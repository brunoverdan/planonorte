<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ProducerResource;
use App\Http\Resources\V1\VideoResource;
use App\Models\Producer;
use App\Models\Video;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $q = trim((string) $request->string('q'));
        if ($q === '') {
            return response()->json(['videos' => [], 'producers' => [], 'query' => '']);
        }

        $videos = Video::query()->published()
            ->with(['categories', 'producer', 'city'])
            ->where(function ($w) use ($q) {
                $w->where('title', 'ilike', "%{$q}%")
                    ->orWhere('description', 'ilike', "%{$q}%")
                    ->orWhereHas('tags', fn ($t) => $t->where('name', 'ilike', "%{$q}%"))
                    ->orWhereHas('categories', fn ($c) => $c->where('name', 'ilike', "%{$q}%"))
                    ->orWhereHas('city', fn ($c) => $c->where('name', 'ilike', "%{$q}%"))
                    ->orWhereHas('producer', fn ($p) => $p->where('name', 'ilike', "%{$q}%"));
            })
            ->orderByDesc('views_count')
            ->limit(30)
            ->get();

        $producers = Producer::query()->where('is_active', true)
            ->where('name', 'ilike', "%{$q}%")
            ->withCount('videos')
            ->limit(12)
            ->get();

        return response()->json([
            'query' => $q,
            'videos' => VideoResource::collection($videos),
            'producers' => ProducerResource::collection($producers),
        ]);
    }
}
