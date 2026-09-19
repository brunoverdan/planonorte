<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'start_time' => $this->start_time,
            'address' => $this->address,
            'cover_image' => $this->cover_image,
            'schedule' => $this->schedule,
            'organizers' => $this->organizers,
            'status' => $this->status,
            'city' => new CityResource($this->whenLoaded('city')),
            'venue' => new VenueResource($this->whenLoaded('venue')),
            'videos_count' => $this->when(isset($this->videos_count), $this->videos_count),
        ];
    }
}
