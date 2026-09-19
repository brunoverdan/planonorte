<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\VideoResource;
use App\Models\Category;
use App\Models\City;
use App\Models\Event;
use App\Models\Producer;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoView;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'users' => User::count(),
            'videos' => [
                'total' => Video::count(),
                'published' => Video::where('status', Video::STATUS_PUBLISHED)->count(),
                'draft' => Video::where('status', Video::STATUS_DRAFT)->count(),
                'in_review' => Video::where('status', Video::STATUS_IN_REVIEW)->count(),
                'archived' => Video::where('status', Video::STATUS_ARCHIVED)->count(),
            ],
            'categories' => Category::count(),
            'producers' => Producer::count(),
            'cities' => City::count(),
            'events' => Event::count(),
            'views' => [
                'total' => VideoView::count(),
                'last_30_days' => VideoView::where('created_at', '>=', now()->subDays(30))->count(),
            ],
        ]);
    }

    public function videos(Request $request)
    {
        $query = Video::query()->with(['categories', 'producer', 'city', 'creator']);

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'ilike', "%{$q}%");
        }

        return VideoResource::collection($query->orderByDesc('created_at')->paginate($request->integer('per_page', 24)));
    }

    public function storeVideo(Request $request)
    {
        $data = $this->validateVideo($request);
        $data['created_by'] = $request->user()->id;
        $data['status'] = $data['status'] ?? Video::STATUS_DRAFT;

        $video = Video::create($data);
        $this->syncRelations($video, $request);

        return response()->json(new VideoResource($video->load(['categories', 'tags', 'producer', 'city'])), 201);
    }

    public function updateVideo(Request $request, Video $video)
    {
        $data = $this->validateVideo($request, $video->id);

        if (($data['status'] ?? null) === Video::STATUS_PUBLISHED && ! $video->published_at) {
            $data['published_at'] = now();
        }

        $video->update($data);
        $this->syncRelations($video, $request);

        return new VideoResource($video->load(['categories', 'tags', 'producer', 'city']));
    }

    public function destroyVideo(Video $video)
    {
        $video->delete();
        return response()->json(['message' => 'Vídeo removido.']);
    }

    public function review(Request $request, Video $video)
    {
        $data = $request->validate([
            'status' => ['required', 'in:in_review,approved,published,archived,draft'],
            'notes' => ['nullable', 'string'],
        ]);

        $from = $video->status;
        $update = ['status' => $data['status']];
        if ($data['status'] === Video::STATUS_PUBLISHED && ! $video->published_at) {
            $update['published_at'] = now();
        }
        $video->update($update);

        $video->reviews()->create([
            'reviewer_id' => $request->user()->id,
            'from_status' => $from,
            'to_status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        return new VideoResource($video);
    }

    private function validateVideo(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'source_type' => ['nullable', 'in:embed,upload'],
            'embed_provider' => ['nullable', 'in:youtube,vimeo'],
            'embed_id' => ['nullable', 'string', 'max:255'],
            'embed_url' => ['nullable', 'url', 'max:500'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
            'producer_id' => ['nullable', 'integer', 'exists:producers,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'event_id' => ['nullable', 'integer', 'exists:events,id'],
            'credits' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
            'is_free' => ['nullable', 'boolean'],
            'age_rating' => ['nullable', 'string', 'max:10'],
            'status' => ['nullable', 'in:draft,in_review,approved,published,archived'],
        ]);
    }

    private function syncRelations(Video $video, Request $request): void
    {
        if ($request->has('category_ids')) {
            $video->categories()->sync($request->input('category_ids', []));
        }
        if ($request->has('tag_ids')) {
            $video->tags()->sync($request->input('tag_ids', []));
        }
    }
}
