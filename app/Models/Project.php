<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'cahier_de_charge',
        'cahier_de_charge_pdf_path',
        'budget',
        'status',
        'start_date',
        'end_date',
        'client_user_id',
        'client_request_id',
        'assigned_freelancer_id',
        'qa_reviewer_id',
        'slug',
        'project_type',
        'currency',
        'agreed_rate',
        'tech_stack',
        'tags',
        'is_private',
        'nda_required',
        'nda_document_url',
        'is_featured',
        'admin_notes',
        'created_by_admin',
        'completion_percentage',
        'completed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'tech_stack'          => 'array',
        'tags'                => 'array',
        'start_date'          => 'date',
        'end_date'            => 'date',
        'completed_at'        => 'datetime',
        'cancelled_at'        => 'datetime',
        'is_private'          => 'boolean',
        'nda_required'        => 'boolean',
        'is_featured'         => 'boolean',
        'budget'              => 'decimal:2',
        'agreed_rate'         => 'decimal:2',
        'completion_percentage' => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Boot
    // -------------------------------------------------------------------------

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->name) . '-' . Str::random(6);
            }
        });
    }

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function clientRequest(): BelongsTo
    {
        return $this->belongsTo(ClientRequest::class);
    }

    public function assignedFreelancer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_freelancer_id');
    }

    public function qaReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'qa_reviewer_id');
    }

    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_admin');
    }

    public function lots(): HasMany
    {
        return $this->hasMany(Lot::class)->orderBy('order');
    }

    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }

    public function repositories(): HasMany
    {
        return $this->hasMany(Repository::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function aiSessions(): HasMany
    {
        return $this->hasMany(AiSession::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['open', 'in_progress', 'review']);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeForClient($query, int $userId)
    {
        return $query->where('client_user_id', $userId);
    }

    public function scopeForFreelancer($query, int $userId)
    {
        return $query->where('assigned_freelancer_id', $userId);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }
}
