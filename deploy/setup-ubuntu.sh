#!/usr/bin/env bash
# ============================================================
# Setup de Autoescuela Virtual en Ubuntu 24.04 (Oracle Cloud
# Always Free, instancia ARM Ampere A1)
#
# Uso (como root o con sudo):
#   sudo REPO_URL=https://github.com/TU_USUARIO/autoescuela-virtual.git \
#        DOMAIN=autoescuela.tudominio.com \
#        EMAIL=tu@email.com \
#        bash setup-ubuntu.sh
#
# Variables opcionales:
#   BRANCH=main            rama a desplegar
#   JWT_SECRET=...         si no se pasa, se genera uno aleatorio
# ============================================================
set -euo pipefail

REPO_URL="${REPO_URL:?Falta REPO_URL (ej: https://github.com/usuario/repo.git)}"
DOMAIN="${DOMAIN:?Falta DOMAIN (ej: autoescuela.tudominio.com)}"
EMAIL="${EMAIL:?Falta EMAIL para Let's Encrypt}"
BRANCH="${BRANCH:-main}"
APP_DIR="/opt/autoescuela-virtual"
DB_DIR="/var/lib/autoescuela"
PORT="3000"
APP_USER="ubuntu"

if [ -z "${JWT_SECRET:-}" ]; then
  JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
fi
export JWT_SECRET

echo "==> [1/7] Instalando dependencias del sistema"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx \
  build-essential python3 sqlite3 git curl

echo "==> [2/7] Instalando Node.js 22 LTS"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node --version

echo "==> [3/7] Clonando repositorio ($BRANCH)"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" pull --ff-only
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
CORS_ORIGIN=https://$DOMAIN
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
Environment=CORS_ORIGIN=https://$DOMAIN
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

echo "==> [7/7] Nginx + certificado SSL"
cat > /etc/nginx/sites-available/autoescuela <<EOF
server {
    listen 80;
    server_name $DOMAIN;

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

if [ -f /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem ]; then
  echo "SSL ya emitido, renovando..."
  certbot renew
else
  certbot --nginx -d "$DOMAIN" --redirect --agree-tos -m "$EMAIL" --non-interactive
fi

echo ""
echo "============================================================"
echo "  Despliegue completado"
echo "  Comprueba:  https://$DOMAIN/health"
echo "  El JWT_SECRET generado se guardo en $APP_DIR/server/.env"
echo "  Backups SQLite diarios en $DB_DIR/backups"
echo "============================================================"
