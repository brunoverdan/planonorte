<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProducerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logo,
            'cover_image' => $this->cover_image,
            'bio' => $this->bio,
            'website' => $this->website,
            'social_links' => $this->social_links,
            'is_verified' => $this->is_verified,
            'city' => new CityResource($this->whenLoaded('city')),
            'videos_count' => $this->when(isset($this->videos_count), $this->videos_count),
        ];
    }
}
