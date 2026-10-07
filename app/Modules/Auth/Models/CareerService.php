<?php

namespace App\Modules\Auth\Models;

use Illuminate\Database\Eloquent\Model;

class CareerService extends Model
{
    protected $fillable = ['name'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}