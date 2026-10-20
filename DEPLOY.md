# Deploy — PlanoNorte

Produção: **https://planonorte.planeventus.com.br**
Servidor: `207.58.153.184` (VPS), path `/var/www/planonorte`

## Deploy automatizado

```bash
# do seu computador, na raiz do repo:
ssh -p 2226 bruno@207.58.153.184 "bash -s" < deploy.sh main
```

O script faz, em sequência:

1. `git fetch` + `checkout` + `pull` da branch
2. Cria `api/.env` a partir de `deploy/.env.production` (só se não existir) e gera `APP_KEY`
3. Backend: `composer install --no-dev`, `migrate --force`, caches, `storage:link`
4. Frontend: `npm ci` + `npm run build` (gera `app/dist`)
5. Permissões (`bruno:www-data` em storage/cache, `www-data` em dist)
6. Reload do Caddy

Log: `/var/www/planonorte/deploy.log`

## Primeira instalação (bootstrap, já feito)

```bash
ssh -p 2226 bruno@207.58.153.184
cd /var/www && rmdir planonorte/api planonorte/app   # dirs vazios
cd planonorte && git clone https://github.com/brunoverdan/planonorte.git .
```

Depois rodar o deploy e, na primeira vez, `php artisan db:seed --force` para popular.

## Configuração do servidor

| Item | Valor |
|---|---|
| Vhost Caddy | `planonorte.planeventus.com.br` (api → php8.3-fpm, app → `app/dist`) |
| Banco | `planonorte_db` / `planonorte_user` |
| .env produção | `deploy/.env.production` (template versionado) |
| Log do deploy | `/var/www/planonorte/deploy.log` |

> ⚠️ O `.env` real fica só no servidor (`api/.env`, fora do git). Se mudar credenciais, edite lá.
