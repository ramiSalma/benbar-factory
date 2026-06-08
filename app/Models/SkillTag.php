<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SkillTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'usage_count',
    ];

    protected $casts = [
        'usage_count' => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Boot
    // -------------------------------------------------------------------------

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (SkillTag $tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopePopular($query, int $limit = 20)
    {
        return $query->orderByDesc('usage_count')->limit($limit);
    }
}
