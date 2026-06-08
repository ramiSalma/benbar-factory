<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Repository extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'github_account_id',
        'name',
        'url',
        'visibility',
        'github_repo_id',
        'default_branch',
        'description',
        'languages',
        'webhook_active',
        'webhook_secret',
    ];

    protected $hidden = ['webhook_secret'];

    protected $casts = [
        'languages'      => 'array',
        'webhook_active' => 'boolean',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function githubAccount(): BelongsTo
    {
        return $this->belongsTo(GithubAccount::class);
    }

    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class)->latest('committed_at');
    }

    public function pullRequests(): HasMany
    {
        return $this->hasMany(PullRequest::class);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isPublic(): bool
    {
        return $this->visibility === 'public';
    }
}
