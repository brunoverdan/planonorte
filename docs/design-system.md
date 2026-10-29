# Plan Norte — Design System (v2)

> Derivado **diretamente** da logo oficial (`branding/logo-original.jpg`).

## Origem das cores (amostragem real da logo)

| Elemento | Hex | Uso |
|---|---|---|
| Fundo da logo (preto quente) | `#070604` | `norte-950` |
| Marca / lettering (off-white) | `#F7F6F6` | `areia-100` |

A logo é **monocromática** (off-white sobre preto quente). Não há cor cromática nela —
o acento âmbar é a cor de sistema escolhida para dar identidade cultural/cálida.

## Paleta

### Base escura (quente, ancorada no preto da logo)
| Token | Hex |
|---|---|
| `norte-950` | `#070604` |
| `norte-900` | `#0f0e0c` |
| `norte-850` | `#171612` |
| `norte-800` | `#201e1a` |
| `norte-700` | `#2e2b26` |
| `norte-600` | `#453f38` |

### Texto (off-white da marca, levemente dessaturado nos níveis menores)
| Token | Hex |
|---|---|
| `areia-100` | `#f7f6f6` |
| `areia-200` | `#e9e7e5` |
| `areia-300` | `#cfccc8` |
| `areia-400` | `#a5a19c` |

### Acento (âmbar dourado — cultura, "norte", calor humano)
| Token | Hex |
|---|---|
| `ambar-400` | `#f0b429` |
| `ambar-500` | `#e09b1a` |
| `ambar-600` | `#c07d0e` |

### Secundário (verde-mata — natureza / Norte)
| Token | Hex |
|---|---|
| `mata-500` | `#2f7d5b` |
| `mata-600` | `#256447` |

## Tipografia
- **Display:** Archivo → headings, wordmark
- **Sans:** Inter → corpo, UI

## Assets de marca
| Arquivo | Descrição |
|---|---|
| `app/public/logo-planonorte.png` | Wordmark com fundo transparente, cor `areia-100` (para fundos escuros) |
| `app/public/favicon-32.png` / `-192.png` | Monograma "P" em quadrado `norte-850` |
| `branding/logo-original.jpg` | Logo original enviada pelo cliente |
| `branding/logo-planonorte-transparente.png` | Wordmark transparente claro |
| `branding/logo-planonorte-escuro.png` | Wordmark transparente escuro (para fundos claros) |
| `branding/logo-planonorte-ambar.png` | Wordmark transparente âmbar (variante de acento) |

## Regras
- Fundo sempre escuro (`norte-900`/`norte-950`).
- Card superfície `norte-850`, borda `norte-800`.
- Input `norte-850` + borda `norte-700`, foco `ambar-500`.
- Acento âmbar com parcimônia: links ativos, CTAs, destaques.
- ❌ Sem vermelho de marca. ❌ Sem wordmark serifada. (não copiar Netflix)
