#!/bin/bash
# Script de deploy - PlanoNorte
# Uso: ssh -p 2226 bruno@207.58.153.184 "bash -s" < deploy.sh [branch]
#
# Primeira execução: cria o .env de produção a partir de deploy/.env.production
# se ele ainda não existir no servidor.

set -e

BRANCH="${1:-main}"
SITE_PATH="/var/www/planonorte"
LOG_FILE="/var/log/deploy-planonorte.log"

log() { echo "$@" | tee -a $LOG_FILE; }

log "[$(date '+%Y-%m-%d %H:%M:%S')] ========== Iniciando deploy - branch: $BRANCH =========="

if [ ! -d "$SITE_PATH/.git" ]; then
  log "!!! $SITE_PATH não é um repositório git. Rode o bootstrap primeiro."
  log "    (primeira instalação: clonar o repo em $SITE_PATH)"
  exit 1
fi

cd $SITE_PATH

log "=== 1. Git pull ==="
git fetch origin 2>&1 | tee -a $LOG_FILE
git checkout $BRANCH 2>&1 | tee -a $LOG_FILE
git pull origin $BRANCH 2>&1 | tee -a $LOG_FILE

log "=== 2. .env de produção ==="
if [ ! -f "$SITE_PATH/api/.env" ]; then
  log ".env não encontrado - criando a partir de deploy/.env.production"
  cp "$SITE_PATH/deploy/.env.production" "$SITE_PATH/api/.env"
  log ".env criado a partir do template."
else
  log ".env já existe - mantido."
fi

# Gera APP_KEY se estiver vazia
if ! grep -q '^APP_KEY=base64:' "$SITE_PATH/api/.env"; then
  log "APP_KEY vazia - gerando com artisan key:generate"
  (cd "$SITE_PATH/api" && php artisan key:generate --force 2>&1 | tee -a $LOG_FILE)
fi

log "=== 3. Backend (API Laravel) ==="
cd $SITE_PATH/api
composer install --no-dev --optimize-autoloader 2>&1 | tee -a $LOG_FILE
php artisan migrate --force 2>&1 | tee -a $LOG_FILE
php artisan config:cache 2>&1 | tee -a $LOG_FILE
php artisan route:cache 2>&1 | tee -a $LOG_FILE
php artisan view:cache 2>&1 | tee -a $LOG_FILE
php artisan storage:link 2>/dev/null || true

log "=== 4. Frontend (React/Vite) ==="
cd $SITE_PATH/app
npm ci 2>&1 | tee -a $LOG_FILE
npm run build 2>&1 | tee -a $LOG_FILE

log "=== 5. Permissões ==="
cd $SITE_PATH
mkdir -p api/storage/app/public
chmod -R 775 api/storage api/bootstrap/cache 2>/dev/null || true
chown -R bruno:www-data api/storage api/bootstrap/cache 2>/dev/null || true
chown -R www-data:www-data app/dist 2>/dev/null || true

log "=== 6. Reload Caddy ==="
sudo systemctl reload caddy 2>/dev/null || sudo caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || log "Caddy reload manual se necessário"

log "[$(date '+%Y-%m-%d %H:%M:%S')] ========== Deploy concluído! =========="
