<?php

namespace App\Modules\Admin\Controllers;

use App\Modules\Admin\Models\ActivityLog;
use App\Modules\Admin\Models\Position;
use App\Modules\Auth\Models\User;
use App\Modules\User\Services\ProgressCalculator;
use App\Services\ActivityLog\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController
{
    private const ARCH_PER_PAGE = 20;

    public function index(Request $request): Response
    {
        $search     = $request->get('search',     '');
        $department = $request->get('department', '');
        $status     = $request->get('status',     '');
        $posSearch  = $request->get('pos_search', '');
        $posStatus  = $request->get('pos_status', '');
        $perPage    = 10;
        $page       = (int) $request->get('page', 1);

        // ── Validate / normalise the archive table selector ───────────
        $archTable = in_array(
            $request->get('arch_table'),
            ['pds', 'positions', 'assignment'],
            true
        ) ? $request->get('arch_table') : 'pds';

        $query = User::with([
            'personalInformation',
            'familyBackground',
            'educationalBackgrounds',
            'department',
            'positions:id,position_title,tier',
        ])->where('role', 'user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('employee_id', 'like', "%{$search}%")
                  ->orWhereHas('personalInformation', function ($q2) use ($search) {
                      $q2->where('last_name',   'like', "%{$search}%")
                         ->orWhere('first_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($department) {
            $query->where('department_id', $department);
        }

        if ($status === 'with_position') {
            $query->has('positions');
        } elseif ($status === 'without_position') {
            $query->doesntHave('positions');
        }

        $users = $query->get();

        $mapped = $users->map(function (User $user) {
            $pi       = $user->personalInformation;
            $progress = ProgressCalculator::calculate($user);

            $fullName = $pi
                ? strtoupper(trim("{$pi->last_name}, {$pi->first_name}"))
                : strtoupper($user->username);

            return [
                'id'             => $user->id,
                'employee_id'    => str_pad($user->employee_id, 8, '0', STR_PAD_LEFT),
                'name'           => $fullName,
                'department'     => $user->department?->name ?? '—',
                'is_complete'    => (int) $progress['overall'] === 100,
                'date_submitted' => $user->updated_at->format('M d, Y'),
                'positions'      => $user->positions->map(fn ($p) => [
                    'id'             => $p->id,
                    'position_title' => $p->position_title,
                    'tier'           => $p->tier,
                ])->values(),
            ];
        });

        $employeeCount = $mapped->filter(fn ($u) =>  $u['is_complete'])->count();
        $pendingCount  = $mapped->reject(fn ($u) =>  $u['is_complete'])->count();

        if ($status === 'complete') {
            $mapped = $mapped->filter(fn ($u) => $u['is_complete'])->values();
        } elseif ($status === 'incomplete') {
            $mapped = $mapped->filter(fn ($u) => !$u['is_complete'])->values();
        }

        $total  = $mapped->count();
        $sliced = $mapped->forPage($page, $perPage)->values();

        $paginated = new LengthAwarePaginator(
            $sliced,
            $total,
            $perPage,
            $page,
            ['path' => route('admin.dashboard'), 'query' => $request->query()]
        );

        $departments = DB::table('departments')->orderBy('name')->get(['id', 'name']);

        // ── Positions query ───────────────────────────────────────────
        $assignedPositionIds = DB::table('user_positions')->pluck('position_id');

        $posQuery = Position::latest()->whereNotIn('id', $assignedPositionIds);

        if ($posSearch) {
            $posQuery->where('position_title', 'like', "%{$posSearch}%");
        }
        if ($posStatus) {
            $posQuery->where('status', $posStatus);
        }

        $positionsPaginated = $posQuery
            ->paginate($perPage, ['*'], 'pos_page')
            ->withQueryString()
            ->through(fn ($p) => [
                'id'                => $p->id,
                'position_title'    => $p->position_title,
                'department_agency' => $p->department_agency,
                'salary_grade'      => $p->salary_grade,
                'status'            => $p->status,
                'date_added'        => $p->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Admin/Pages/AdminDashboard', [

            // ── Always-present props ──────────────────────────────────
            'stats' => [
                'employees' => $employeeCount,
                'positions' => Position::published()->count(),
                'pending'   => $pendingCount,
            ],
            'employees'   => $paginated,
            'departments' => $departments,
            'filters'     => [
                'search'     => $search,
                'department' => $department,
                'status'     => $status,
            ],
            'positions'  => $positionsPaginated,
            'posFilters' => [
                'search' => $posSearch,
                'status' => $posStatus,
            ],

            // ── Persist selected archive table ────────────────────────
            'archTable' => $archTable,

            // ── Lazy props — paginated, only evaluated when requested ─
            // ActivityLogs.jsx requests these via router.reload({ only: [...] })
            // on mount and on page/filter changes. Each table has its own
            // page param to allow independent pagination.

            'archivedUsers' => Inertia::lazy(function () use ($request) {
                $archUsersPage = (int) $request->get('arch_users_page', 1);

                $query = User::onlyTrashed()
                    ->with(['personalInformation', 'department'])
                    ->latest('deleted_at');

                $total   = $query->count();
                $records = $query
                    ->forPage($archUsersPage, self::ARCH_PER_PAGE)
                    ->get()
                    ->map(fn (User $u) => [
                        'id'          => $u->id,
                        'employee_id' => str_pad($u->employee_id, 8, '0', STR_PAD_LEFT),
                        'name'        => $u->personalInformation
                            ? strtoupper(trim("{$u->personalInformation->last_name}, {$u->personalInformation->first_name}"))
                            : strtoupper($u->username),
                        'department'  => $u->department?->name ?? '—',
                        'deleted_at'  => $u->deleted_at,
                    ]);

                return [
                    'data'         => $records,
                    'current_page' => $archUsersPage,
                    'per_page'     => self::ARCH_PER_PAGE,
                    'total'        => $total,
                    'last_page'    => (int) ceil($total / self::ARCH_PER_PAGE),
                ];
            }),

            'archivedPositions' => Inertia::lazy(function () use ($request) {
                $archPosPage = (int) $request->get('arch_pos_page', 1);

                $query = Position::onlyTrashed()->latest('deleted_at');

                $total   = $query->count();
                $records = $query
                    ->forPage($archPosPage, self::ARCH_PER_PAGE)
                    ->get()
                    ->map(fn (Position $p) => [
                        'id'                => $p->id,
                        'position_title'    => $p->position_title,
                        'department_agency' => $p->department_agency,
                        'salary_grade'      => $p->salary_grade,
                        'status'            => $p->status,
                        'deleted_at'        => $p->deleted_at,
                    ]);

                return [
                    'data'         => $records,
                    'current_page' => $archPosPage,
                    'per_page'     => self::ARCH_PER_PAGE,
                    'total'        => $total,
                    'last_page'    => (int) ceil($total / self::ARCH_PER_PAGE),
                ];
            }),

            'positionAssignmentLogs' => Inertia::lazy(function () use ($request) {
                $assignPage = (int) $request->get('assign_page', 1);

                // Use a raw count query for performance — avoids loading full rows
                $total = DB::table('position_assignment_logs')->count();

                $records = DB::table('position_assignment_logs')
                    ->orderByDesc('created_at')
                    ->offset(($assignPage - 1) * self::ARCH_PER_PAGE)
                    ->limit(self::ARCH_PER_PAGE)
                    ->get()
                    ->map(fn ($log) => [
                        'id'             => $log->id,
                        'position_id'    => $log->position_id,
                        'position_title' => $log->position_title,
                        'position_tier'  => $log->position_tier,
                        'user_id'        => $log->user_id,
                        'user_name'      => strtoupper($log->user_name),
                        'employee_id'    => $log->employee_id,
                        'event'          => $log->event,   // 'assigned' | 'unassigned'
                        'created_at'     => $log->created_at,
                    ]);

                return [
                    'data'         => $records,
                    'current_page' => $assignPage,
                    'per_page'     => self::ARCH_PER_PAGE,
                    'total'        => $total,
                    'last_page'    => (int) ceil($total / self::ARCH_PER_PAGE),
                ];
            }),
        ]);
    }

    /**
     * Soft-delete an employee account (PDS removal).
     */
    public function destroy(User $user, Request $request): \Illuminate\Http\RedirectResponse
    {
        abort_if($user->isAdmin(), 403, 'Cannot delete an admin account.');

        $user->delete();

        ActivityLogService::log(
            action: ActivityLog::ACTION_PDS_REMOVED,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'User',
            entityId: $user->id,
            request: $request,
        );

        return back()->with('success', 'Employee record removed.');
    }

    /**
     * Restore a soft-deleted user (PDS restoration).
     */
    public function restoreUser(int $user, Request $request): \Illuminate\Http\RedirectResponse
    {
        $record = User::onlyTrashed()->findOrFail($user);
        $record->restore();

        ActivityLogService::log(
            action: ActivityLog::ACTION_PDS_RESTORED,
            actorId: auth()->id(),
            actorType: 'admin',
            entityType: 'User',
            entityId: $user,
            request: $request,
        );

        return back()->with('success', 'Employee record restored.');
    }

    /**
     * Return full personal information for a single employee (used by the profile drawer).
     * Route: GET /admin/users/{user}/profile  →  admin.users.profile
     */
    public function profile(User $user): \Illuminate\Http\JsonResponse
    {
        abort_if($user->role !== 'user', 403);

        $pi = $user->personalInformation;

        if (!$pi) {
            return response()->json([
                'found'   => false,
                'message' => 'Personal information not yet submitted.',
            ]);
        }

        $fullName = strtoupper(trim(
            "{$pi->last_name}, {$pi->first_name}"
            . ($pi->suffix       ? ", {$pi->suffix}"    : '')
        ));

        $addressParts = array_filter([
            $pi->house_block_lot_no,
            $pi->street,
            $pi->subdivision_village,
            $pi->barangay,
            $pi->city_municipality,
            $pi->province,
            $pi->region,
            $pi->zip_code,
        ]);
        $residentialAddress = implode(', ', $addressParts);

        return response()->json([
            'found'               => true,
            'full_name'           => $fullName,
            'date_of_birth'       => $pi->date_of_birth
                                        ? \Carbon\Carbon::parse($pi->date_of_birth)->format('F d, Y')
                                        : null,
            'citizenship'         => strtoupper($pi->citizenship ?? ''),
            'sex'                 => strtoupper($pi->sex ?? ''),
            'civil_status'        => strtoupper($pi->civil_status ?? ''),
            'height_cm'           => $pi->height_cm,
            'weight_kg'           => $pi->weight_kg,
            'residential_address' => strtoupper($residentialAddress ?: ''),
            'mobile_no'           => $pi->mobile_no,
            'email'               => $user->email,
        ]);
    }
}