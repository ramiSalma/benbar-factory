<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'prompt',
        'response',
        'tokens_used',
        'model',
        'purpose',
        'cost',
        'metadata',
        'duration_ms',
    ];

    protected $casts = [
        'tokens_used' => 'integer',
        'cost'        => 'decimal:6',
        'metadata'    => 'array',
        'duration_ms' => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
