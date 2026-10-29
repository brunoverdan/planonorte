<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'state' => new StateResource($this->whenLoaded('state')),
        ];
    }
}
