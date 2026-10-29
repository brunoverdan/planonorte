<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ProducerResource;
use App\Http\Resources\V1\VideoResource;
use App\Models\Producer;
use Illuminate\Http\Request;

class ProducerController extends Controller
{
    public function index(Request $request)
    {
        $query = Producer::query()->where('is_active', true)
            ->with('city.state')->withCount('videos');

        if ($type = $request->string('type')->toString()) {
            $query->where('type', $type);
        }

        if ($q = $request->string('q')->toString()) {
            $query->where('name', 'ilike', "%{$q}%");
        }

        return ProducerResource::collection(
            $query->orderBy('name')->paginate($request->integer('per_page', 24))
        );
    }

    public function show(string $slug)
    {
        $producer = Producer::where('slug', $slug)
            ->with(['city.state'])
            ->withCount('videos')
            ->firstOrFail();

        $videos = VideoResource::collection(
            $producer->videos()->published()->with(['categories'])->orderByDesc('published_at')->limit(24)->get()
        );

        return response()->json([
            'data' => new ProducerResource($producer),
            'videos' => $videos,
        ]);
    }
}
