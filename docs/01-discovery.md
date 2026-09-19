# PlanoNorte — Documento de Discovery (Fase 1)

> Plataforma de streaming de vídeos culturais — "Netflix da Cultura".
> Versão 1.1 · 19/09/2026 · Autor: Lara (agente IA) · Revisão: Bruno Verdan

---

## 0.1 Decisões confirmadas pelo cliente (19/09/2026)

| Tema | Decisão | Impacto |
|---|---|---|
| **Storage/streaming de vídeo** | **MVP com vídeo EMBEDADO (YouTube/Vimeo)**; streaming próprio (upload + transcode + HLS) migra na **Fase 2** | Remove fila ffmpeg, worker, disco pesado e CDN do MVP. `Video.source_type = embed\|upload` desde já, com `StorageDriver` abstraído. Reduz custo/complexidade drasticamente. |
| **Escopo do MVP** | Mantém os 16 itens do MVP, **adaptados**: upload/transcode → cadastro por **embed**. RF-19 vira "vincular vídeo embedado" no MVP; upload real na Fase 2. | Publicação/catálogo/player (embed) funcionam 100% no MVP. |
| **Nome** | **PlanoNorte** é o nome do **produto** (e do projeto). | Marca única. |
| **Identidade visual** | Deve ser **baseada na LOGO** (asset recebido 19/09). Logo é **monocromática** (marca clara sobre fundo escuro escuro `#171612`). Paleta/design system derivados dela. | Ver `docs/05-design-system.md` (a gerar). Diretriz: base escura quente + acentuação, **sem** copiar Netflix. |
| **Prazo/prioridade** | **Agora** (em paralelo ao Clinimaster/Turismo). | Início imediato. |
| **Domínio** | `planonorte.planeventus.com.br` (VPS 207.58.153.184, Cloudflare proxied). | Confirmado. |

**Assets:** logo em `planonorte/branding/logo-original.jpg` (monocromática, 955×870).

---

## 0. Decisões de stack (acordadas)

| Camada | Escolha | Justificativa |
|---|---|---|
| Frontend Web | **React 19 + Vite + TS + Tailwind 4** | Mesmo stack do Turismo/PM Hub; domínio consolidado |
| Backend/API | **Laravel 12 (PHP 8.2/8.3)** | API-only com Sanctum; reaproveita padrão existente |
| Banco | **PostgreSQL** (um DB dedicado por sistema) | Padrão já usado nos outros projetos do VPS |
| Web server | **Caddy** (proxy reverso) | Já instalado no VPS; HTTPS automático |
| Fila/Processamento | **NÃO no MVP** (embed YouTube/Vimeo). Laravel Queue + ffmpeg entram na **Fase 2** (upload/transcode) | Sem custo de worker/disco no MVP |
| Storage (MVP) | **Nenhum** — vídeo fica no YouTube/Vimeo (embed). Upload local/S3 na Fase 2, atrás de interface `StorageDriver` | Migrável p/ S3/Bunny/Cloudflare sem reescrever |
| Hospedagem | VPS `207.58.153.184` (mesmo do Turismo e PM Hub) | Custo zero incremental; isolamento por vhost/DB |

**Alternativas de storage consideradas** (ver §21 para trade-offs): Bunny Stream, Cloudflare Stream, S3+CloudFront. **Decisão (19/09):** MVP = **embed YouTube/Vimeo** (custo zero, zero infra de transcode). Streaming próprio (Bunny/Cloudflare/S3) avaliado e implementado na **Fase 2**, com a arquitetura já preparada para CDN.

---

## 1. Visão do produto

Plataforma para **preservar, divulgar e democratizar** o acesso a conteúdos culturais, históricos, artísticos e educacionais, com experiência moderna de streaming e descoberta personalizada.

**Proposta de valor:**
- Para o **público**: descobrir cultura brasileira (história, folclore, música, gastronomia, patrimônio) de forma simples e visual.
- Para o **produtor cultural**: visibilidade e, futuramente, monetização.
- Para **instituições** (museus, prefeituras, secretarias): publicar e preservar acervo.

---

## 2. Requisitos funcionais (RF)

### 2.1 Catálogo e descoberta
- **RF-01** Catálogo de vídeos com metadados completos (título, descrição, categoria, localidade, ano, produtor, diretor, participantes, tags, créditos, direitos).
- **RF-02** Página inicial com hero/destaque + carrosséis horizontais (Continue assistindo, Em destaque, Mais assistidos, Novos, por categoria, por região, recomendados).
- **RF-03** Navegação: Início, Explorar, Categorias, Regiões, Cidades, Artistas, Eventos, Documentários, Minha Lista, Histórico, Perfil.
- **RF-04** Busca global por: nome do vídeo, artista, cidade, estado, região, categoria, evento, tema, pessoa, instituição.
- **RF-05** Busca semântica/linguagem natural (fase posterior; preparada arquiteturalmente).

### 2.2 Vídeo e player
- **RF-06** Página de vídeo completa com player e todos os metadados.
- **RF-07** Player: play/pause, volume, tela cheia, velocidade, legendas (múltiplas faixas), qualidade adaptativa, retomada (continuar assistindo).
- **RF-08** Ações: adicionar à lista, curtir, compartilhar, avaliar, relatar conteúdo.
- **RF-09** Conteúdos relacionados ao final do vídeo.

### 2.3 Localização
- **RF-10** Páginas hierárquicas: País → Estado → Região → Cidade, cada uma com descrição, capa, história, vídeos, eventos, artistas, locais históricos, gastronomia, tradições.
- **RF-11** Mapa cultural interativo: vídeos, artistas, eventos, museus, patrimônios, locais históricos, manifestações. Clique na localização → conteúdos relacionados.

### 2.4 Produtores e usuários
- **RF-12** Perfis de produtor com tipos (pessoa, artista, produtora, museu, prefeitura, secretaria, instituto, ONG, universidade, coletivo, projeto) com bio, localização, redes, site, vídeos, projetos, categorias, visualizações.
- **RF-13** Autenticação: cadastro, login, recuperação de senha, login social (fase 2), perfil com foto, nome, preferências culturais.
- **RF-14** Múltiplos perfis por conta (fase posterior; preparado).

### 2.5 Personalização e recomendações
- **RF-15** Recomendações baseadas em histórico, categorias, regiões/cidades pesquisadas, artistas seguidos, curtidas, lista, histórico. Seção "Recomendados para você".

### 2.6 Administração
- **RF-16** Painel administrativo: dashboard (usuários, vídeos, views, tempo assistido, categorias, produtores, cidades, estados, eventos, publicados, pendentes, denúncias, estatísticas).
- **RF-17** Gestão de vídeos: criar, editar, excluir, publicar, despublicar, agendar, capa, upload, trailer, legenda, descrição, categoria, localização, produtor, tags.
- **RF-18** Workflow de publicação: Rascunho → Em análise → Aprovado → Publicado → Arquivado, com revisão por administradores.
- **RF-19** Upload e processamento de vídeo: upload, armazenamento, transcodificação, thumbnails, streaming adaptativo, qualidades, legendas, trailer, metadados.
- **RF-20** Categorias e subcategorias hierárquicas.
- **RF-21** Módulo de eventos culturais: nome, descrição, data, horário, cidade, local, imagens, vídeos, programação, organizadores, categoria; relacionar vídeos.

### 2.7 Dashboards e IA (fases posteriores)
- **RF-22** Dashboard de indicadores com gráficos e filtros por período.
- **RF-23** IA: descrição automática, transcrição, legendas automáticas, identificação de temas, classificação, tags, recomendação, busca semântica, resumo, pesquisa em linguagem natural.

---

## 3. Requisitos não funcionais (RNF)

- **RNF-01 Performance**: TTFB < 500ms em páginas de catálogo; streaming adaptativo; imagens otimizadas via CDN/cache.
- **RNF-02 Escalabilidade**: arquitetura preparada para milhares/milhões de usuários sem rebuild; storage/CDN abstraídos.
- **RNF-03 Responsividade**: desktop, notebook, tablet, smartphone; TV futura (mesma API).
- **RNF-04 Acessibilidade**: legendas, contraste, navegação por teclado, alt text, leitores de tela, controle de fonte, descrições acessíveis (WCAG 2.1 AA alvo).
- **RNF-05 Segurança**: auth segura, autorização por perfil, rate limiting, validação de upload, proteção contra arquivos maliciosos, logs, auditoria, controle de sessão, LGPD.
- **RNF-06 API-first**: API consumível por web, mobile, smart TV, apps externos (versionada `/api/v1`).
- **RNF-07 Observabilidade**: logs estruturados, métricas de views/tempo assistido, auditoria de ações administrativas.
- **RNF-08 Disponibilidade**: deploy isolado por vhost; não degradar Turismo/PM Hub.
- **RNF-09 Manutenibilidade**: código organizado, documentado, testável (cobertura de testes por módulo).
- **RNF-10 Portabilidade de vídeo**: suporte a múltiplas resoluções e formatos (HLS/DASH futuro).

---

## 4. Perfis de usuário e permissões

| Papel | Descrição | Permissões principais |
|---|---|---|
| **visitante** | Não autenticado | Ver catálogo público, busca, páginas de local/evento/produtor, player de conteúdo gratuito |
| **usuário** | Autenticado | Tudo do visitante + lista, histórico, curtir, avaliar, comentar, relatar, recomendados |
| **produtor** | Usuário com perfil de produtor | Tudo do usuário + criar/editar seus vídeos, enviar para análise, ver métricas dos seus conteúdos |
| **revisor** | Curador de conteúdo | Tudo do usuário + revisar/aprovar/reprovar conteúdos, gerir categorias/tags |
| **admin** | Administrador | Acesso total: usuários, produtores, locais, eventos, denúncias, estatísticas, configurações |
| **super-admin** | Dono do sistema | Admin + gestão de papéis e configurações críticas |

> Nota: perfis são **cumulativos por papel (role) + permissões (policy)**. O memso usuário pode ser `usuario` + `produtor`.

---

## 5. Fluxo de publicação (workflow)

```
Rascunho ──(produtor envia)──> Em análise ──(revisor aprova)──> Aprovado ──(agenda/publica)──> Publicado
   ▲                                │                                                             │
   │                                └──(revisor reprova)──> volta para Rascunho                    │
   └──────────────────────────── (reabrir) ──────────────────────────────────────────────────────┘
                                                                                                  │
                                                                            (despublica/expira) ──┴──> Arquivado
```

**Regras:**
- Produtor não publica direto (salvo se tiver papel de revisor/admin).
- Agendamento: `published_at` futuro → job publica automaticamente.
- Toda transição de estado gera registro em `content_reviews` (auditoria).
- Conteúdo publicado pode ser arquivado, nunca excluído logicamente (soft delete).

---

## 6. Arquitetura

```
                         ┌──────────────────────────────┐
                         │        Clients               │
                         │  Web · Mobile · SmartTV      │
                         └──────────────┬───────────────┘
                                        │ HTTPS
                                 ┌──────▼──────┐
                                 │   Caddy     │  (TLS, vhost planonorte.*)
                                 └──┬───────┬──┘
                       static SPA   │       │ /api/v1
                              ┌─────▼───┐ ┌─▼─────────────────┐
                              │  React  │ │  Laravel 12 API   │
                              │  (dist) │ │  Sanctum + RBAC   │
                              └─────────┘ └─┬──────┬──────┬───┘
                                            │      │      │
                              ┌─────────────▼┐ ┌───▼───┐ ┌▼────────────┐
                              │ PostgreSQL   │ │ Redis │ │ Storage     │
                              │ (dados)      │ │cache/ │ │ Driver      │
                              └──────────────┘ │queue  │ │(local→S3)   │
                                               └───┬───┘ └─────────────┘
                                                   │
                                        ┌──────────▼───────────┐
                                        │  Worker (ffmpeg)     │
                                        │  transcode/thumbs    │
                                        └──────────────────────┘
```

**Camadas backend (Laravel):**
- `app/Http/Controllers/Api/V1/*` — controllers finos
- `app/Services/*` — regra de negócio
- `app/Models/*` — Eloquent
- `app/Policies/*` — autorização
- `app/Jobs/*` — transcodificação, thumbnails, publicação agendada, e-mails
- `app/Contracts/Storage/*` — interface de storage (local/S3/Bunny)

---

## 7. Modelo de dados (entidades)

Baseado no §23 do prompt. Entidades: `User, Profile, Video, VideoCategory, Category, Producer, Artist, Institution, City, State, Region, Country, Event, Venue, Tag, VideoTag, Playlist, WatchHistory, Favorite, Like, Rating, Comment, Subscription, Payment, Notification, Report, ContentReview, VideoSubtitle, VideoQuality, VideoView`.

**Relações-chave:**
- `User 1—N Profile` (multi-perfil futuro)
- `Video N—1 Producer`, `Video N—N Category` (via `video_categories`), `Video N—N Tag` (via `video_tags`)
- `Video N—1 City` (→ `State` → `Region` → `Country`)
- `Video N—1 Event` (opcional)
- `Video 1—N VideoQuality`, `Video 1—N VideoSubtitle`
- `User N—N Video` via `watch_history`, `favorites`, `likes`, `ratings`
- `ContentReview N—1 Video`, `N—1 User` (revisor)
- `Event N—1 City`, `Event N—1 Venue`
- `Artist N—N Video` (participação), `Artist N—1 Producer` (opcional)

> ER detalhado: ver `docs/02-modelo-er.md`.

---

## 8. Contratos de API (resumo)

Versionamento `/api/v1`. Auth: Bearer (Sanctum).

- **Público:** `GET /videos`, `GET /videos/{id}`, `GET /categories`, `GET /regions`, `GET /cities`, `GET /events`, `GET /producers`, `GET /search`
- **Auth:** `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `GET /me`
- **Usuário:** `GET/POST/DELETE /me/list`, `GET /me/history`, `POST /videos/{id}/like`, `POST /videos/{id}/rating`, `POST /videos/{id}/report`, `GET /me/recommendations`
- **Produtor:** `POST /producer/videos`, `PUT /producer/videos/{id}`, `POST /producer/videos/{id}/submit`
- **Admin:** `GET /admin/dashboard`, CRUD `/admin/videos|categories|producers|cities|events|users`, `POST /admin/videos/{id}/approve|reject|publish|archive`

> Contratos completos: ver `docs/04-api.md`.

---

## 9. Roadmap e módulos

| Fase | Módulos | Entregável |
|---|---|---|
| **Fase 0** | Discovery, arquitetura, ER, APIs, design system | Documentação (este doc + anexos) |
| **Fase 1 — MVP** | M1 Auth · M2 Catálogo · M3 Vídeo/Player · M4 Busca · M5 Lista/Histórico · M6 Produtores · M7 Localidades · M8 Admin/Upload/Publicação · M9 Estatísticas básicas | Plataforma funcional |
| **Fase 2** | Recomendações avançadas, Login social, Multi-perfil, Mapa cultural, Monetização (arquitetura) | Escala de engajamento |
| **Fase 3** | IA (transcrição, tags, busca semântica), HLS/streaming adaptativo, Apps mobile/TV | Diferenciação |

---

## 10. MVP (escopo congelado)

1. Cadastro/login  2. Página inicial  3. Catálogo  4. Categorias  5. Busca  6. Página de vídeo  7. Player  8. Minha lista  9. Histórico  10. Perfis de produtores  11. Localização cidade/estado  12. Painel admin  13. Cadastro de vídeos  14. Upload  15. Publicação  16. Estatísticas básicas.

**Fora do MVP (preparado arquiteturalmente):** IA, recomendação avançada, monetização, mobile, Smart TV, mapa cultural completo, login social.

---

## 11. Identidade visual (diretrizes)

- **Nome produto:** PlanoNorte
- **Conceito:** cultura + história + memória + modernidade + diversidade + Brasil + tecnologia.
- **Paleta (proposta):** base terrosa/cerrado + acento vivo brasileiro
  - `--pn-bg: #120F0C` (quase-preto quente)
  - `--pn-surface: #1E1813`
  - `--pn-primary: #E4572E` (terracota/urucum)
  - `--pn-secondary: #2A9D8F` (verde-água)
  - `--pn-accent: #E9C46A` (amarelo-ouro/barro)
  - `--pn-text: #F4EDE4`
- **Tipografia:** títulos cinematográficos (serif expressiva) + corpo legível (sans)
- **Componentes do design system:** cores, tipografia, botões, cards, modais, formulários, menus, player, loading, vazio, erros.
- **Explicitamente:** NÃO copiar identidade da Netflix (cores, logo, layout proprietário).

---

## 12. Próximos passos

1. Aprovar este discovery (Bruno).
2. Gerar `02-modelo-er.md` (ER + migrations).
3. Gerar `03-arquitetura.md` (detalhamento técnico + alternativas).
4. Gerar `04-api.md` (contratos completos).
5. Gerar `05-design-system.md`.
6. Iniciar implementação M1 (Auth), seguindo o template de entrega por módulo.
