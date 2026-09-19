<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Histórico / "continuar assistindo"
        Schema::create('watch_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('position_seconds')->default(0);
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamp('watched_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'video_id']);
        });

        // Minha lista (favoritos)
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'video_id']);
        });

        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'video_id']);
        });

        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating'); // 1..5
            $table->timestamps();
            $table->unique(['user_id', 'video_id']);
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('comments')->cascadeOnDelete();
            $table->text('body');
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
        });

        // Denúncias / relatar conteúdo
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->morphs('reportable'); // video, comment...
            $table->string('reason');
            $table->text('details')->nullable();
            $table->string('status')->default('open'); // open|reviewing|resolved|dismissed
            $table->timestamps();
        });

        // Auditoria do workflow de publicação
        Schema::create('content_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Visualizações (métricas RF-09/RNF-07)
        Schema::create('video_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_views');
        Schema::dropIfExists('content_reviews');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('ratings');
        Schema::dropIfExists('likes');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('watch_history');
    }
};
