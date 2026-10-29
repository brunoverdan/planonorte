<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CityResource;
use App\Http\Resources\V1\RegionResource;
use App\Http\Resources\V1\StateResource;
use App\Models\City;
use App\Models\Region;
use App\Models\State;

class LocationController extends Controller
{
    public function regions()
    {
        return RegionResource::collection(
            Region::with('country')->withCount('states')->orderBy('name')->get()
        );
    }

    public function states()
    {
        return StateResource::collection(
            State::with('region')->withCount('cities')->orderBy('name')->get()
        );
    }

    public function cities()
    {
        return CityResource::collection(
            City::with('state.region')->withCount('videos')->orderBy('name')
                ->paginate(request()->integer('per_page', 50))
        );
    }

    public function city(string $slug)
    {
        $city = City::where('slug', $slug)
            ->with(['state.region.country'])
            ->withCount('videos')
            ->firstOrFail();

        return new CityResource($city);
    }
}
