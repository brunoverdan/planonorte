<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->with(['children' => fn ($q) => $q->where('is_active', true)])
            ->withCount(['videos' => fn ($q) => $q->published()])
            ->orderBy('position')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->with(['children', 'parent'])
            ->withCount(['videos' => fn ($q) => $q->published()])
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
