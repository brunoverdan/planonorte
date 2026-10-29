<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoQualityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'width' => $this->width,
            'height' => $this->height,
            'bitrate_kbps' => $this->bitrate_kbps,
            'file_path' => $this->file_path,
            'mime_type' => $this->mime_type,
        ];
    }
}
