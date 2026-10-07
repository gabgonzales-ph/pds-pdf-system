<?php

namespace App\Modules\User\Controllers;

use App\Modules\Auth\Models\EducationalBackground;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class EducationalBackgroundController
{
    /**
     * Valid education levels.
     */
    private const LEVELS = [
        'Elementary',
        'Secondary',
        'Vocation/Trade Course',
        'College',
        'Graduate Studies',
    ];

    /**
     * Regex for dd/mm/yyyy format.
     */
    private const DATE_REGEX = '/^\d{2}\/\d{2}\/\d{4}$/';

    /**
     * Save or update educational background levels.
     * POST /user/educational-background
     */
    public function save(Request $request): RedirectResponse
    {
        $request->validate([
            'education'                   => ['required', 'array'],
            'education.*.level'           => ['required', Rule::in(self::LEVELS)],
            'education.*.school_name'     => ['nullable', 'string', 'max:255'],
            'education.*.academic_degree' => ['nullable', 'string', 'max:20'],
            'education.*.degree_course'   => ['nullable', 'string', 'max:255'],
            'education.*.attendance_from' => ['nullable', 'string', 'max:10',  'regex:' . self::DATE_REGEX],
            'education.*.attendance_to'   => ['nullable', 'string', 'max:13',  $this->attendanceToRule()],
            'education.*.highest_level'   => ['nullable', 'string', 'max:255'],
            'education.*.year_graduated'  => ['nullable', 'string', 'max:13',  $this->yearGraduatedRule()],
            'education.*.honors_received' => ['nullable', 'string', 'max:255'],
        ], $this->validationMessages());

        // Cross-field: attendance_from must not be later than attendance_to
        $this->validateDateOrder($request->education);

        $userId = Auth::id();

        foreach ($request->education as $row) {
            EducationalBackground::updateOrCreate(
                ['user_id' => $userId, 'level' => $row['level']],
                [
                    'school_name'     => $row['school_name']     ?? null,
                    'academic_degree' => $row['academic_degree'] ?? null,
                    'degree_course'   => $row['degree_course']   ?? null,
                    'attendance_from' => $row['attendance_from'] ?? null,
                    'attendance_to'   => $row['attendance_to']   ?? null,
                    'highest_level'   => $row['highest_level']   ?? null,
                    'year_graduated'  => $row['year_graduated']  ?? null,
                    'honors_received' => $row['honors_received'] ?? null,
                ]
            );
        }

        return back();
    }

    /**
     * Delete a single educational background level for the authenticated user.
     * DELETE /user/educational-background/{level}
     */
    public function destroy(string $level): RedirectResponse
    {
        if (!in_array($level, self::LEVELS)) {
            abort(422, 'Invalid education level.');
        }

        EducationalBackground::where('user_id', Auth::id())
            ->where('level', $level)
            ->delete();

        return back();
    }

    // ── Private Helpers ────────────────────────────────────────────────

    /**
     * attendance_to accepts dd/mm/yyyy or the literal "UNDERGRADUATE".
     */
    private function attendanceToRule(): \Closure
    {
        return function ($attribute, $value, $fail) {
            if ($value === 'UNDERGRAD') return;
            if (!preg_match(self::DATE_REGEX, $value)) {
                $fail('The attendance end date must be in dd/mm/yyyy format or "UNDERGRAD".');
            }
        };
    }

    /**
     * year_graduated accepts dd/mm/yyyy or the literal "UNDERGRADUATE".
     */
// WITH:
private function yearGraduatedRule(): \Closure
{
    return function ($attribute, $value, $fail) {
        if ($value === 'N/A') return;
        if (!preg_match('/^\d{4}$/', $value)) {
            $fail('The year graduated must be a 4-digit year (e.g. 2010) or "N/A".');
        }
    };
}

    /**
     * Cross-field date order validation.
     * Skips rows where either value is missing or attendance_to is "UNDERGRADUATE".
     *
     * @throws ValidationException
     */
    private function validateDateOrder(array $rows): void
    {
        $errors = [];

        foreach ($rows as $index => $row) {
            $from = $row['attendance_from'] ?? null;
            $to   = $row['attendance_to']   ?? null;

            // Skip if either is absent, or if to is UNDERGRADUATE (open-ended)
            if (!$from || !$to || $to === 'UNDERGRAD') continue;

            // Both are dd/mm/yyyy — convert to comparable timestamps
            $fromTs = $this->parseDate($from);
            $toTs   = $this->parseDate($to);

            if ($fromTs === null || $toTs === null) continue;

            if ($fromTs > $toTs) {
                $errors["education.{$index}.attendance_from"] =
                    ['The attendance start date cannot be later than the end date.'];
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * Parse a dd/mm/yyyy string into a Unix timestamp. Returns null on failure.
     */
    private function parseDate(string $value): ?int
    {
        if (!preg_match(self::DATE_REGEX, $value)) return null;

        [$day, $month, $year] = explode('/', $value);

        if (!checkdate((int) $month, (int) $day, (int) $year)) return null;

        return mktime(0, 0, 0, (int) $month, (int) $day, (int) $year);
    }

    /**
     * Custom validation messages.
     */
    private function validationMessages(): array
    {
        return [
            'education.*.attendance_from.regex' => 'The attendance start date must be in dd/mm/yyyy format.',
            'education.*.attendance_from.max'   => 'The attendance start date is too long.',
            'education.*.attendance_to.max'     => 'The attendance end date is too long.',
            'education.*.year_graduated.max'    => 'The year graduated value is too long.',
        ];
    }
}
