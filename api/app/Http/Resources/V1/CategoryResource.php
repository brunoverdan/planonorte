<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'position' => $this->position,
            'is_active' => $this->is_active,
            'children' => CategoryResource::collection($this->whenLoaded('children')),
            'videos_count' => $this->when(isset($this->videos_count), $this->videos_count),
        ];
    }
}
