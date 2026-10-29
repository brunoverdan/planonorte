<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()->with(['city.state', 'venue'])->withCount('videos');

        if ($city = $request->string('city')->toString()) {
            $query->whereHas('city', fn ($c) => $c->where('slug', $city));
        }

        if ($request->boolean('upcoming')) {
            $query->where('start_date', '>=', now()->toDateString());
        }

        return EventResource::collection(
            $query->orderByDesc('start_date')->paginate($request->integer('per_page', 24))
        );
    }

    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)
            ->with(['city.state', 'venue', 'videos'])
            ->withCount('videos')
            ->firstOrFail();

        return new EventResource($event);
    }
}
