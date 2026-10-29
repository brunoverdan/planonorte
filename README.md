# PlanoNorte 🎬

Plataforma de **streaming de conteúdo cultural brasileiro** ("Netflix da Cultura").
Preservar, divulgar e democratizar o acesso a conteúdos históricos, artísticos, educacionais e culturais com experiência moderna.

> Domínio (produção): `planonorte.planeventus.com.br`
> Repositório: `github.com/brunoverdan/...` (a definir)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 8 + TypeScript + Tailwind 4 + React Router 7 |
| Backend | Laravel 13 (API-only) + Sanctum |
| Banco | PostgreSQL |
| Web server | Caddy (vhost `planonorte.*`) |

## Estrutura

```
planonorte/
├── api/          # Backend Laravel (API /api/v1)
├── app/          # Frontend React (SPA)
├── branding/     # Assets de marca (logo)
└── docs/         # Discovery, modelo ER, arquitetura, API, design system
```

## Desenvolvimento local

### Backend (api/)
```bash
cd api
cp .env.example .env        # (se necessário)
php artisan migrate --seed  # cria schema + dados demo
php artisan serve           # http://127.0.0.1:8000
```

Banco: `planonorte_db` / usuário `planonorte_user`.

### Frontend (app/)
```bash
cd app
npm install
npm run dev                 # http://localhost:5173 (proxy /api -> :8000)
```

## Credenciais demo (seed)

| Papel | E-mail | Senha |
|---|---|---|
| Super-admin | brunocbv@gmail.com | pnadmin123 |
| Revisor | revisor@planonorte.com | revisor123 |

## API (v1)

Base: `/api/v1` · Auth: Bearer (Sanctum)

- **Público:** `/home`, `/videos`, `/videos/{id|slug}`, `/categories`, `/regions`, `/states`, `/cities`, `/events`, `/producers`, `/search`
- **Auth:** `POST /auth/register`, `POST /auth/login`, `GET /me`, `POST /auth/logout`
- **Usuário:** `GET /me/list`, `POST /videos/{id}/list`, `GET /me/history`, `POST /videos/{id}/progress`, `POST /videos/{id}/like`, `POST /videos/{id}/rating`, `POST /videos/{id}/report`, `GET /me/recommendations`
- **Admin:** `GET /admin/dashboard`, `GET|POST /admin/videos`, `PUT|DELETE /admin/videos/{id}`, `POST /admin/videos/{id}/review`

## Decisões-chave

- **MVP com vídeo embedado (YouTube/Vimeo)** — upload/transcode/streaming próprio na Fase 2. `Video.source_type = embed|upload` já preparado.
- **Identidade visual baseada na logo** (marca monocromática clara sobre base escura quente `#171612` + acento âmbar). Sem copiar a Netflix.
- **API-first** — mesma API serve web, mobile e TV no futuro.

Ver `docs/01-discovery.md` para o detalhamento completo.
