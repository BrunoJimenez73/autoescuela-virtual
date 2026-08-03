#!/usr/bin/env bash
# ============================================================
# Setup de Autoescuela Virtual en Ubuntu 24.04 (Oracle Cloud
# Always Free, instancia ARM Ampere A1)
#
# Uso (como root o con sudo):
#   sudo bash setup-ubuntu.sh
#
# Variables:
#   REPO_URL=https://github.com/...   (solo si no usas SKIP_CLONE=1)
#   DOMAIN=autoescuela.tudominio.com  (si tienes dominio -> HTTPS+SSL)
#   EMAIL=tu@email.com                (obligatorio solo con DOMAIN)
#   IP_PUBLICA=1.2.3.4                (obligatorio sin DOMAIN -> CORS)
#   BRANCH=main
#   SKIP_CLONE=1                      (codigo ya subido via scp a APP_DIR)
#   JWT_SECRET=...                    (si no se pasa, se genera uno)
# ============================================================
set -euo pipefail

REPO_URL="${REPO_URL:-}"
DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"
BRANCH="${BRANCH:-main}"
APP_DIR="/opt/autoescuela-virtual"
DB_DIR="/var/lib/autoescuela"
PORT="3000"
APP_USER="ubuntu"
SKIP_CLONE="${SKIP_CLONE:-0}"

# --- Modo dominio vs modo IP ---------------------------------
if [ -n "$DOMAIN" ]; then
  SERVER_NAME="$DOMAIN"
  CORS_ORIGIN="https://$DOMAIN"
  USE_SSL=1
else
  IP_PUBLICA="${IP_PUBLICA:?Falta IP_PUBLICA (sin DOMAIN hay que indicar la IP)}"
  SERVER_NAME="_"
  CORS_ORIGIN="http://$IP_PUBLICA"
  USE_SSL=0
fi

if [ -z "${JWT_SECRET:-}" ]; then
  JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
fi
export JWT_SECRET

echo "==> [1/7] Instalando dependencias del sistema"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx build-essential python3 sqlite3 git curl
if [ "$USE_SSL" = "1" ]; then
  apt-get install -y certbot python3-certbot-nginx
fi

echo "==> [2/7] Instalando Node.js 22 LTS"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node --version

echo "==> [3/7] Obteniendo el codigo"
if [ "$SKIP_CLONE" = "1" ]; then
  if [ ! -f "$APP_DIR/package.json" ]; then
    echo "ERROR: SKIP_CLONE=1 pero no hay codigo en $APP_DIR" >&2
    exit 1
  fi
  echo "Codigo ya presente en $APP_DIR (subido via scp)"
else
  if [ -z "$REPO_URL" ]; then
    echo "ERROR: falta REPO_URL (o usa SKIP_CLONE=1)" >&2
    exit 1
  fi
  if [ ! -d "$APP_DIR/.git" ]; then
    git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
  else
    git -C "$APP_DIR" fetch --all --prune
    git -C "$APP_DIR" checkout "$BRANCH"
    git -C "$APP_DIR" pull --ff-only
  fi
fi

echo "==> [4/7] Directorio de datos persistente"
mkdir -p "$DB_DIR/backups"
chown -R "$APP_USER:$APP_USER" "$DB_DIR"

echo "==> [5/7] Compilando cliente y servidor"
cd "$APP_DIR"
npm run install:all
npm run build

echo "==> Generando server/.env (no se sube a git)"
cat > server/.env <<EOF
NODE_ENV=production
PORT=$PORT
DB_PATH=$DB_DIR/autoescuela.db
JWT_SECRET=$JWT_SECRET
CORS_ORIGIN=$CORS_ORIGIN
EOF

echo "==> [6/7] Servicio systemd"
cat > /etc/systemd/system/autoescuela.service <<EOF
[Unit]
Description=Autoescuela Virtual API
After=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
Environment=PORT=$PORT
Environment=NODE_ENV=production
Environment=DB_PATH=$DB_DIR/autoescuela.db
Environment=JWT_SECRET=$JWT_SECRET
Environment=CORS_ORIGIN=$CORS_ORIGIN
ExecStart=/usr/bin/node $APP_DIR/server/dist/index.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now autoescuela

echo "==> [7/7] Nginx"
cat > /etc/nginx/sites-available/autoescuela <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
ln -sf /etc/nginx/sites-available/autoescuela /etc/nginx/sites-enabled/autoescuela
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Copia de seguridad diaria de la BD a las 03:00
cp "$APP_DIR/deploy/backup-sqlite.sh" /usr/local/bin/backup-autoescuela.sh
chmod +x /usr/local/bin/backup-autoescuela.sh
( crontab -l 2>/dev/null | grep -v backup-autoescuela; \
  echo "0 3 * * * /usr/local/bin/backup-autoescuela.sh" ) | crontab -

if [ "$USE_SSL" = "1" ]; then
  echo "==> Certificado SSL (Let's Encrypt)"
  if [ -z "$EMAIL" ]; then
    echo "ERROR: EMAIL obligatorio cuando se define DOMAIN" >&2
    exit 1
  fi
  if [ -f /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem ]; then
    certbot renew
  else
    certbot --nginx -d "$DOMAIN" --redirect --agree-tos -m "$EMAIL" --non-interactive
  fi
fi

echo ""
echo "============================================================"
echo "  Despliegue completado"
echo "  URL de la app:  $CORS_ORIGIN/"
echo "  Health check:   $CORS_ORIGIN/health"
echo "  El JWT_SECRET generado se guardo en $APP_DIR/server/.env"
echo "  Backups SQLite diarios en $DB_DIR/backups"
echo "============================================================"