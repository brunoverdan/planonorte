<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Country;
use App\Models\Producer;
use App\Models\Region;
use App\Models\State;
use App\Models\Tag;
use App\Models\User;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Admin ----
        User::create([
            'name' => 'Bruno Verdan',
            'email' => 'brunocbv@gmail.com',
            'password' => 'pnadmin123',
            'role' => User::ROLE_SUPER_ADMIN,
        ]);
        User::create([
            'name' => 'Revisor Demo',
            'email' => 'revisor@planonorte.com',
            'password' => 'revisor123',
            'role' => User::ROLE_REVIEWER,
        ]);

        // ---- Geografia: Brasil → Sudeste → SP → Ribeirão Preto ----
        $brasil = Country::create(['name' => 'Brasil', 'slug' => 'brasil', 'code' => 'BRA']);
        $sudeste = Region::create(['country_id' => $brasil->id, 'name' => 'Sudeste', 'slug' => 'sudeste', 'description' => 'Região Sudeste do Brasil.']);
        $sp = State::create(['region_id' => $sudeste->id, 'name' => 'São Paulo', 'slug' => 'sao-paulo', 'code' => 'SP']);
        $rp = City::create([
            'state_id' => $sp->id,
            'name' => 'Ribeirão Preto',
            'slug' => 'ribeirao-preto',
            'description' => 'Cidade do interior paulista, polo cultural e gastronômico.',
            'latitude' => -21.1775,
            'longitude' => -47.8103,
        ]);
        $nordeste = Region::create(['country_id' => $brasil->id, 'name' => 'Nordeste', 'slug' => 'nordeste', 'description' => 'Região Nordeste do Brasil.']);
        $pe = State::create(['region_id' => $nordeste->id, 'name' => 'Pernambuco', 'slug' => 'pernambuco', 'code' => 'PE']);
        City::create(['state_id' => $pe->id, 'name' => 'Recife', 'slug' => 'recife', 'description' => 'Capital pernambucana, rica em cultura popular.']);

        // ---- Categorias ----
        $cats = [
            ['Documentário', 'documentario', 'Documentários históricos e culturais'],
            ['Música', 'musica', 'Shows, clipes e manifestações musicais'],
            ['Folclore', 'folclore', 'Lendas, danças e tradições populares'],
            ['Patrimônio', 'patrimonio', 'Bens históricos e arquitetônicos'],
            ['Gastronomia', 'gastronomia', 'Cozinha típica e cultura alimentar'],
            ['Artes Cênicas', 'artes-cenicas', 'Teatro, dança e performance'],
        ];
        $catModels = collect($cats)->map(fn ($c) => Category::create([
            'name' => $c[0], 'slug' => $c[1], 'description' => $c[2], 'is_active' => true,
        ]));

        // ---- Tags ----
        $tagModels = collect(['história', 'tradição', 'brasil', 'interior', 'música ao vivo', 'patrimônio imaterial'])
            ->map(fn ($t) => Tag::create(['name' => $t, 'slug' => Str::slug($t)]));

        // ---- Produtores ----
        $prod = Producer::create([
            'type' => 'produtora',
            'name' => 'Coletivo Cultural Norte',
            'slug' => 'coletivo-cultural-norte',
            'bio' => 'Coletivo dedicado à preservação e divulgação da cultura brasileira.',
            'city_id' => $rp->id,
            'is_verified' => true,
        ]);
        $prefeitura = Producer::create([
            'type' => 'prefeitura',
            'name' => 'Secretaria de Cultura de Ribeirão Preto',
            'slug' => 'secretaria-cultura-rp',
            'bio' => 'Órgão municipal de cultura.',
            'city_id' => $rp->id,
            'is_verified' => true,
        ]);

        // ---- Vídeos (embed) ----
        $videos = [
            ['A História de Ribeirão Preto', 'documentario', 'youtube', 'dQw4w9WgXcQ', true],
            ['Chorinho no Centro', 'musica', 'youtube', 'dQw4w9WgXcQ', false],
            ['Lendas do Vale do Paraíba', 'folclore', 'youtube', 'dQw4w9WgXcQ', false],
            ['Patrimônio Arquitetônico Paulista', 'patrimonio', 'youtube', 'dQw4w9WgXcQ', true],
            ['Sabores do Interior', 'gastronomia', 'vimeo', '76979871', false],
            ['Festival de Inverno', 'artes-cenicas', 'vimeo', '76979871', false],
        ];

        foreach ($videos as $i => [$title, $cat, $provider, $embedId, $featured]) {
            $video = Video::create([
                'title' => $title,
                'producer_id' => $i % 2 === 0 ? $prod->id : $prefeitura->id,
                'city_id' => $rp->id,
                'description' => "Produção audiovisual sobre {$title}.",
                'short_description' => "Um olhar cultural sobre {$title}.",
                'year' => 2020 + $i,
                'source_type' => 'embed',
                'embed_provider' => $provider,
                'embed_id' => $embedId,
                'duration_seconds' => 600 + ($i * 120),
                'thumbnail' => null,
                'status' => Video::STATUS_PUBLISHED,
                'published_at' => now()->subDays($i),
                'is_featured' => $featured,
                'is_free' => true,
                'age_rating' => 'L',
                'views_count' => rand(50, 5000),
                'likes_count' => rand(5, 400),
            ]);

            $video->categories()->attach($catModels->firstWhere('slug', $cat)->id);
            $video->tags()->attach($tagModels->random(2)->pluck('id'));
            $video->subtitles()->create([
                'language' => 'pt-BR', 'label' => 'Português', 'format' => 'vtt', 'is_default' => true,
            ]);
        }
    }
}
