<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // visitante | usuario | produtor | revisor | admin | super-admin
            $table->string('role')->default('usuario')->after('email');
            $table->string('avatar')->nullable()->after('role');
            $table->json('cultural_preferences')->nullable()->after('avatar');
            $table->boolean('is_active')->default(true)->after('cultural_preferences');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar', 'cultural_preferences', 'is_active']);
            $table->dropSoftDeletes();
        });
    }
};
