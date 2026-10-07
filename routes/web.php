    <?php

    use Illuminate\Support\Facades\Route;
    use Illuminate\Http\Request;
    use App\Modules\Auth\Models\User;
    use App\Modules\Auth\Controllers\AuthenticationController;
    use App\Modules\Auth\Controllers\LoginController;
    use App\Modules\Auth\Controllers\RegisterController;
    use App\Modules\User\Controllers\UserDashboardController;
    use App\Modules\User\Controllers\PersonalInformationController;
    use App\Modules\User\Controllers\FamilyBackgroundController;
    use App\Modules\User\Controllers\EducationalBackgroundController;
    use App\Modules\User\Controllers\CivilServiceEligibilityController;
    use App\Modules\User\Controllers\WorkExperienceController;
    use App\Modules\User\Controllers\VoluntaryWorkController;
    use App\Modules\User\Controllers\LearningDevelopmentController;
    use App\Modules\User\Controllers\OtherInformationController;
    use App\Modules\User\Controllers\PdsFinalFormController;
    use App\Modules\User\Controllers\PDSController;
    use App\Modules\Admin\Controllers\ActivityLogController;
    use App\Modules\Admin\Controllers\AdminDashboardController;
    use App\Modules\Admin\Controllers\AdminPDSController;
    use App\Modules\Admin\Controllers\PositionController;
    use App\Modules\Admin\Controllers\PositionPDFController;
    use App\Modules\Admin\Controllers\UserPositionController;
    use App\Http\Middleware\EnsureIsAdmin;
    use App\Http\Middleware\EnsureIsUser;
    use App\Modules\Admin\Controllers\OrganizationalStructureController;

    // ── Public ───────────────────────────────────────────────────────────
    Route::get('/', [AuthenticationController::class, 'index'])
        ->name('auth.index');

    // ── Guest Only ───────────────────────────────────────────────────────
    Route::middleware('guest')->group(function () {
        Route::post('/login', [LoginController::class, 'store'])
            ->name('auth.login');
        Route::post('/register', [RegisterController::class, 'store'])
            ->name('auth.register');

        Route::post('/validate-username', [RegisterController::class, 'validateUsername'])
            ->name('auth.validate-username');
        Route::post('/validate-email', [RegisterController::class, 'validateEmail'])
            ->name('auth.validate-email');
    });

    // ── Auth Only ────────────────────────────────────────────────────────
    Route::middleware('auth')->group(function () {

        Route::post('/logout', [LoginController::class, 'destroy'])
            ->name('auth.logout');

        // ── User Routes ──────────────────────────────────────────────────
        Route::middleware(EnsureIsUser::class)->group(function () {

            Route::get('/user/dashboard', [UserDashboardController::class, 'index'])
                ->name('user.dashboard');

            // Personal Information
            Route::patch('/user/personal-information', [PersonalInformationController::class, 'update'])
                ->name('user.personal-information.update');

            // Family Background
            Route::patch('/user/family-background/spouse', [FamilyBackgroundController::class, 'updateSpouse'])
                ->name('user.family-background.spouse');
            Route::post('/user/family-background/children', [FamilyBackgroundController::class, 'addChild'])
                ->name('user.family-background.children.add');
            Route::patch('/user/family-background/children/{child}', [FamilyBackgroundController::class, 'updateChild'])
                ->name('user.family-background.children.update');
            Route::delete('/user/family-background/children/{child}', [FamilyBackgroundController::class, 'deleteChild'])
                ->name('user.family-background.children.delete');

            // Educational Background
            Route::post('/user/educational-background', [EducationalBackgroundController::class, 'save'])
                ->name('user.educational-background.save');
            Route::delete('/user/educational-background/{level}', [EducationalBackgroundController::class, 'destroy'])
                ->name('user.educational-background.destroy');

            // Civil Service Eligibility
            Route::post('/user/civil-service', [CivilServiceEligibilityController::class, 'store'])
                ->name('user.civil-service.store');
            Route::patch('/user/civil-service/{eligibility}', [CivilServiceEligibilityController::class, 'update'])
                ->name('user.civil-service.update');
            Route::delete('/user/civil-service/{eligibility}', [CivilServiceEligibilityController::class, 'destroy'])
                ->name('user.civil-service.destroy');

            // Work Experience
            Route::post('/user/work-experience', [WorkExperienceController::class, 'store'])
                ->name('user.work-experience.store');
            Route::patch('/user/work-experience/{workExperience}', [WorkExperienceController::class, 'update'])
                ->name('user.work-experience.update');
            Route::delete('/user/work-experience/{workExperience}', [WorkExperienceController::class, 'destroy'])
                ->name('user.work-experience.destroy');

            // Voluntary Work
            Route::post('/user/voluntary-work', [VoluntaryWorkController::class, 'store'])
                ->name('user.voluntary-work.store');
            Route::patch('/user/voluntary-work/{voluntaryWork}', [VoluntaryWorkController::class, 'update'])
                ->name('user.voluntary-work.update');
            Route::delete('/user/voluntary-work/{voluntaryWork}', [VoluntaryWorkController::class, 'destroy'])
                ->name('user.voluntary-work.destroy');

            // Learning & Development
            Route::post('/user/learning-development', [LearningDevelopmentController::class, 'store'])
                ->name('user.learning-development.store');
            Route::patch('/user/learning-development/{learningDevelopment}', [LearningDevelopmentController::class, 'update'])
                ->name('user.learning-development.update');
            Route::delete('/user/learning-development/{learningDevelopment}', [LearningDevelopmentController::class, 'destroy'])
                ->name('user.learning-development.destroy');

            // Other Information
            Route::patch('/user/other-information', [OtherInformationController::class, 'update'])
                ->name('user.other-information.update');

            // Final Form (Questions 34–40)
            Route::patch('/user/final-form', [PdsFinalFormController::class, 'update'])
                ->name('user.final-form.update');

            // PDS Download
            Route::get('/user/pds/download', [PDSController::class, 'download'])
                ->name('user.pds.download');
        });

        // ── Admin Routes ─────────────────────────────────────────────────
        Route::middleware(EnsureIsAdmin::class)->group(function () {

            Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
                ->name('admin.dashboard');

            Route::get('/admin/activity-logs', [ActivityLogController::class, 'index'])
                ->name('admin.activity-logs.index');

            Route::get('/admin/users/{user}/pds', [AdminPDSController::class, 'view'])
                ->name('admin.pds.view');

                // Add this line inside the Route::middleware(EnsureIsAdmin::class) group,
// alongside the other admin user routes (near the destroy / restore routes):

Route::get('/admin/users/{user}/profile', [AdminDashboardController::class, 'profile'])
    ->name('admin.users.profile');

            // User / PDS Management
            Route::delete('/admin/users/{user}', [AdminDashboardController::class, 'destroy'])
                ->name('admin.users.destroy');
            Route::match(['post', 'patch'], '/admin/users/{user}/restore', [AdminDashboardController::class, 'restoreUser'])
                ->name('admin.users.restore');

            // Position Assignment
            Route::get('/admin/users/{user}/positions/available', [UserPositionController::class, 'available'])
                ->name('admin.users.positions.available');
            Route::post('/admin/users/{user}/positions/{position}', [UserPositionController::class, 'assign'])
                ->name('admin.users.positions.assign');
            // AFTER
Route::delete('/admin/users/{user}/positions/{position}', [UserPositionController::class, 'remove'])
    ->name('admin.users.positions.remove')
    ->withTrashed();


            // Position Management
            Route::get('/admin/positions', [PositionController::class, 'index'])
                ->name('admin.positions.index');
            Route::get('/admin/positions/create', [PositionController::class, 'create'])
                ->name('admin.positions.create');
            Route::post('/admin/positions', [PositionController::class, 'store'])
                ->name('admin.positions.store');
            Route::get('/admin/positions/{position}/edit', [PositionController::class, 'edit'])
                ->name('admin.positions.edit');
            Route::match(['put', 'patch'], '/admin/positions/{position}', [PositionController::class, 'update'])
                ->name('admin.positions.update');
            Route::delete('/admin/positions/{position}', [PositionController::class, 'destroy'])
                ->name('admin.positions.destroy');
            Route::match(['post', 'patch'], '/admin/positions/{position}/restore', [PositionController::class, 'restore'])
                ->name('admin.positions.restore');

            Route::get('/admin/positions/{position}/pdf', [PositionPDFController::class, 'view'])
                ->name('admin.positions.pdf.view');

            Route::get('/admin/organizational-structure', [OrganizationalStructureController::class, 'index'])
                ->name('admin.organizational-structure.index');
        });
    });