<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\VideoResource;
use App\Models\Favorite;
use App\Models\Like;
use App\Models\Rating;
use App\Models\Report;
use App\Models\Video;
use App\Models\VideoView;
use App\Models\WatchHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserContentController extends Controller
{
    public function list(Request $request)
    {
        $videos = Video::query()
            ->whereHas('favorites', fn ($f) => $f->where('user_id', $request->user()->id))
            ->with(['categories', 'producer'])
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 24));

        return VideoResource::collection($videos);
    }

    public function toggleList(Request $request, Video $video)
    {
        $existing = Favorite::where('user_id', $request->user()->id)->where('video_id', $video->id)->first();
        if ($existing) {
            $existing->delete();
            return response()->json(['in_list' => false]);
        }
        Favorite::create(['user_id' => $request->user()->id, 'video_id' => $video->id]);
        return response()->json(['in_list' => true]);
    }

    public function history(Request $request)
    {
        $items = WatchHistory::where('user_id', $request->user()->id)
            ->with(['video.categories', 'video.producer'])
            ->orderByDesc('watched_at')
            ->paginate($request->integer('per_page', 24));

        return response()->json([
            'data' => $items->map(fn ($h) => [
                'position_seconds' => $h->position_seconds,
                'completed' => $h->completed,
                'watched_at' => $h->watched_at?->toIso8601String(),
                'video' => new VideoResource($h->video),
            ]),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function progress(Request $request, Video $video)
    {
        $data = $request->validate([
            'position_seconds' => ['required', 'integer', 'min:0'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
        ]);

        $history = WatchHistory::updateOrCreate(
            ['user_id' => $request->user()->id, 'video_id' => $video->id],
            [
                'position_seconds' => $data['position_seconds'],
                'duration_seconds' => $data['duration_seconds'] ?? null,
                'completed' => isset($data['duration_seconds'])
                    && $data['duration_seconds'] > 0
                    && $data['position_seconds'] >= $data['duration_seconds'] * 0.9,
                'watched_at' => now(),
            ]
        );

        return response()->json($history);
    }

    public function toggleLike(Request $request, Video $video)
    {
        $existing = Like::where('user_id', $request->user()->id)->where('video_id', $video->id)->first();
        if ($existing) {
            $existing->delete();
            $video->decrement('likes_count');
            return response()->json(['liked' => false, 'likes_count' => max(0, $video->likes_count)]);
        }
        Like::create(['user_id' => $request->user()->id, 'video_id' => $video->id]);
        $video->increment('likes_count');
        return response()->json(['liked' => true, 'likes_count' => $video->likes_count]);
    }

    public function rate(Request $request, Video $video)
    {
        $data = $request->validate(['rating' => ['required', 'integer', 'min:1', 'max:5']]);

        Rating::updateOrCreate(
            ['user_id' => $request->user()->id, 'video_id' => $video->id],
            ['rating' => $data['rating']]
        );

        $avg = Rating::where('video_id', $video->id)->avg('rating');

        return response()->json(['rating' => $data['rating'], 'average' => round((float) $avg, 2)]);
    }

    public function report(Request $request, Video $video)
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
            'details' => ['nullable', 'string', 'max:2000'],
        ]);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'reportable_type' => Video::class,
            'reportable_id' => $video->id,
            'reason' => $data['reason'],
            'details' => $data['details'] ?? null,
        ]);

        return response()->json($report, 201);
    }

    public function recommendations(Request $request)
    {
        $userId = $request->user()->id;

        // Categorias preferidas do histórico
        $categoryIds = DB::table('watch_history')
            ->join('video_categories', 'watch_history.video_id', '=', 'video_categories.video_id')
            ->where('watch_history.user_id', $userId)
            ->pluck('video_categories.category_id')
            ->unique();

        $watchedIds = WatchHistory::where('user_id', $userId)->pluck('video_id');

        $query = Video::query()->published()
            ->whereNotIn('id', $watchedIds)
            ->with(['categories', 'producer', 'city']);

        if ($categoryIds->isNotEmpty()) {
            $query->whereHas('categories', fn ($c) => $c->whereIn('categories.id', $categoryIds));
        }

        return VideoResource::collection($query->orderByDesc('views_count')->limit(20)->get());
    }
}
