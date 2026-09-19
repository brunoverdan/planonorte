<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\VideoResource;
use App\Models\Video;
use App\Models\VideoView;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $query = Video::query()->published()
            ->with(['categories', 'tags', 'producer', 'city.state.region', 'event']);

        if ($q = $request->string('q')->toString()) {
            $query->where(function ($w) use ($q) {
                $w->where('title', 'ilike', "%{$q}%")
                    ->orWhere('description', 'ilike', "%{$q}%");
            });
        }

        if ($category = $request->string('category')->toString()) {
            $query->whereHas('categories', fn ($c) => $c->where('slug', $category));
        }

        if ($city = $request->string('city')->toString()) {
            $query->whereHas('city', fn ($c) => $c->where('slug', $city));
        }

        if ($producer = $request->string('producer')->toString()) {
            $query->whereHas('producer', fn ($p) => $p->where('slug', $producer));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $sort = $request->string('sort', 'recent')->toString();
        $query = match ($sort) {
            'views' => $query->orderByDesc('views_count'),
            'likes' => $query->orderByDesc('likes_count'),
            'title' => $query->orderBy('title'),
            default => $query->orderByDesc('published_at'),
        };

        return VideoResource::collection($query->paginate($request->integer('per_page', 24)));
    }

    public function show(string $idOrSlug)
    {
        $video = Video::query()->published()
            ->with([
                'categories', 'tags', 'producer.city', 'city.state.region',
                'event', 'subtitles', 'qualities',
            ])
            ->where(fn ($q) => $q->where('id', $idOrSlug)->orWhere('slug', $idOrSlug))
            ->firstOrFail();

        VideoView::create([
            'video_id' => $video->id,
            'user_id' => auth('sanctum')->id(),
            'ip_address' => request()->ip(),
            'user_agent' => substr((string) request()->userAgent(), 0, 255),
            'viewed_at' => now(),
        ]);
        $video->increment('views_count');

        $related = Video::query()->published()
            ->where('id', '!=', $video->id)
            ->when($video->categories->isNotEmpty(), function ($q) use ($video) {
                $q->whereHas('categories', fn ($c) => $c->whereIn('categories.id', $video->categories->pluck('id')));
            })
            ->with(['categories', 'producer'])
            ->limit(12)
            ->get();

        return response()->json([
            'data' => new VideoResource($video),
            'related' => VideoResource::collection($related),
        ]);
    }

    public function home()
    {
        $base = fn () => Video::query()->published()->with(['categories', 'producer', 'city']);

        return response()->json([
            'hero' => VideoResource::collection($base()->where('is_featured', true)->orderByDesc('published_at')->limit(5)->get()),
            'recent' => VideoResource::collection($base()->orderByDesc('published_at')->limit(12)->get()),
            'most_watched' => VideoResource::collection($base()->orderByDesc('views_count')->limit(12)->get()),
            'popular' => VideoResource::collection($base()->orderByDesc('likes_count')->limit(12)->get()),
        ]);
    }
}
