<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'year' => $this->year,
            'duration_seconds' => $this->duration_seconds,
            'thumbnail' => $this->thumbnail,
            'source_type' => $this->source_type,
            'embed_provider' => $this->embed_provider,
            'embed_id' => $this->embed_id,
            'embed_url' => $this->embed_url,
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'is_featured' => $this->is_featured,
            'is_free' => $this->is_free,
            'age_rating' => $this->age_rating,
            'views_count' => $this->views_count,
            'likes_count' => $this->likes_count,
            'credits' => $this->credits,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'producer' => new ProducerResource($this->whenLoaded('producer')),
            'city' => new CityResource($this->whenLoaded('city')),
            'event' => new EventResource($this->whenLoaded('event')),
            'subtitles' => VideoSubtitleResource::collection($this->whenLoaded('subtitles')),
            'qualities' => VideoQualityResource::collection($this->whenLoaded('qualities')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
