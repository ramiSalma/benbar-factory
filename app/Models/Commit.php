<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commit extends Model
{
    use HasFactory;

    protected $fillable = [
        'repository_id',
        'mission_id',
        'author_user_id',
        'sha',
        'message',
        'branch',
        'author_github_login',
        'author_email',
        'committed_at',
        'additions',
        'deletions',
        'changed_files',
        'url',
    ];

    protected $casts = [
        'committed_at' => 'datetime',
        'additions'    => 'integer',
        'deletions'    => 'integer',
        'changed_files' => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function repository(): BelongsTo
    {
        return $this->belongsTo(Repository::class);
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_user_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function getShortShaAttribute(): string
    {
        return substr($this->sha, 0, 7);
    }

    public function getShortMessageAttribute(): string
    {
        return \Str::limit($this->message, 72);
    }
}
