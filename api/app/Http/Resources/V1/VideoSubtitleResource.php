<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoSubtitleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'language' => $this->language,
            'label' => $this->label,
            'file_path' => $this->file_path,
            'format' => $this->format,
            'is_default' => $this->is_default,
        ];
    }
}
