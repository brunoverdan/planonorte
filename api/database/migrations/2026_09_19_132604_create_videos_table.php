<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('event_id')->nullable(); // FK added in events migration
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            $table->unsignedSmallInteger('year')->nullable();

            // MVP: embed (youtube/vimeo). Fase 2: upload.
            $table->string('source_type')->default('embed'); // embed | upload
            $table->string('embed_provider')->nullable();    // youtube | vimeo
            $table->string('embed_id')->nullable();          // id do vídeo no provedor
            $table->string('embed_url')->nullable();
            $table->string('video_path')->nullable();        // upload (fase 2)
            $table->string('duration_seconds')->nullable();

            $table->string('thumbnail')->nullable();
            $table->string('trailer_embed_id')->nullable();

            // draft | in_review | approved | published | archived
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_free')->default(true);

            $table->json('credits')->nullable();  // diretor, roteirista, participantes...
            $table->json('rights')->nullable();   // direitos/licença
            $table->string('age_rating')->nullable();

            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedBigInteger('likes_count')->default(0);

            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'published_at']);
            $table->index('is_featured');
        });

        // Vínculo N-N vídeo <-> categoria
        Schema::create('video_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->unique(['video_id', 'category_id']);
        });

        // Vínculo N-N vídeo <-> tag
        Schema::create('video_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->unique(['video_id', 'tag_id']);
        });

        // Legendas (múltiplas faixas, RF-07)
        Schema::create('video_subtitles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->string('language', 10); // pt-BR, en, es...
            $table->string('label')->nullable();
            $table->string('file_path')->nullable();
            $table->string('format')->default('vtt'); // vtt | srt
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // Qualidades (fase 2 — upload/transcode)
        Schema::create('video_qualities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained()->cascadeOnDelete();
            $table->string('label'); // 360p, 720p, 1080p
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('bitrate_kbps')->nullable();
            $table->string('file_path')->nullable();
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('video_qualities');
        Schema::dropIfExists('video_subtitles');
        Schema::dropIfExists('video_tags');
        Schema::dropIfExists('video_categories');
        Schema::dropIfExists('videos');
    }
};
