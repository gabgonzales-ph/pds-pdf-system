<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Modules\Admin\Models\UserPosition;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'username',
        'email',
        'password',
        'employee_id',
        'role',
        'department_id',
        'career_service_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Role Helpers ─────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    // ── PDS Helpers ───────────────────────────────────────────────────

    public function hasPdsCompleted(): bool
    {
        return $this->pdsFinalForm()->exists();
    }

    // ── Position Helpers ──────────────────────────────────────────────

    public function hasPosition(int $positionId): bool
    {
        return $this->positions()->where('position_id', $positionId)->exists();
    }

    // ── Relationships ────────────────────────────────────────────────

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function careerService()
    {
        return $this->belongsTo(CareerService::class);
    }

    public function personalInformation()
    {
        return $this->hasOne(PersonalInformation::class);
    }

    public function familyBackground()
    {
        return $this->hasOne(FamilyBackground::class);
    }

    public function educationalBackgrounds()
    {
        return $this->hasMany(EducationalBackground::class);
    }

    public function civilServiceEligibilities()
    {
        return $this->hasMany(CivilServiceEligibility::class)->orderBy('order');
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class)->orderBy('order');
    }

    public function voluntaryWorks()
    {
        return $this->hasMany(VoluntaryWork::class)->orderBy('order');
    }

    public function learningDevelopments()
    {
        return $this->hasMany(LearningDevelopment::class)->orderBy('order');
    }

    public function otherInformation()
    {
        return $this->hasOne(OtherInformation::class);
    }

    public function pdsFinalForm()
    {
        return $this->hasOne(PdsFinalForm::class);
    }

    public function positions(): BelongsToMany
{
    return $this->belongsToMany(
        \App\Modules\Admin\Models\Position::class,
        'user_positions',
        'user_id',
        'position_id'
    )->using(UserPosition::class)
     ->withPivot('assigned_by')
     ->as('assignment')
     ->withTrashed(); // positions are soft-deleted on assignment by design
}
}