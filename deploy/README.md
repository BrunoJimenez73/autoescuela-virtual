# Despliegue en Oracle Cloud Always Free

Este kit despliega la app completa (API Express + frontend React + señales)
en una única instancia **ARM Ampere A1** de Oracle Cloud que es gratuita 24/7
para siempre (2 OCPU / 12 GB RAM / 200 GB disco).

## Arquitectura

```
Internet ── HTTPS:443 ──> Nginx (Let's Encrypt) ── proxy ──> Node/Express :3000
                                                              ├── /api/*      (API)
                                                              ├── /senales/*  (SVG)
                                                              └── /           (frontend build de client/dist)
                                   BD SQLite: /var/lib/autoescuela/autoescuela.db
                                   Backup: cron diario (14 copias)
```

## 0. Antes (en tu PC)

1. Sube este repo a GitHub (privado) y anota `REPO_URL` (opcional si despliegas por `scp`).
2. Genera la clave SSH que usarás para conectarte a la VM:
   `ssh-keygen -t ed25519 -f ~/.ssh/autoescuela_oracle`

## 1. Crear la VM (web de Oracle)

1. Alta en https://cloud.oracle.com (la tarjeta solo se usa para verificar identidad, no se cobra nada).
2. Compute → Instances → *Create instance*:
   - Shape: **`VM.Standard.A1.Flex`** (ARM). OCPUs: 2, Memoria: 12 GB.
   - Imagen: **Canonical Ubuntu 24.04**.
   - SSH keys: subi tu clave pública (`~/.ssh/autoescuela_oracle.pub`).
   - Si sale "out of host capacity", probá otra *Availability Domain* o más tarde.
3. En **Networking / Security List** de la VCN, agregá reglas de ingreso:
   - `22/tcp` (SSH), `80/tcp` (HTTP) y `443/tcp` solo si usarás dominio+HTTPS.

## 2. Desplegar (por DNS inmediato, sin dominio)

La app se sirve sola en el puerto `3000` dentro de la VM. Un método rápido es
subir el código con `scp` (evita gestionar tokens de GitHub en la VM):

```bash
# 1. Empaquetar el proyecto (sin node_modules/ni dist/ni datos ni .env)
tar -czf autoescuela.tar.gz \
  --exclude=node_modules --exclude=dist --exclude=.git \
  --exclude=.env --exclude='*.log' --exclude=data \
  ./

# 2. Subirlo a la VM
scp -i ~/.ssh/autoescuela_oracle autoescuela.tar.gz ubuntu@IP:/tmp/
scp -i ~/.ssh/autoescuela_oracle deploy/setup-ubuntu.sh ubuntu@IP:/tmp/

# 3. En la VM
ssh -i ~/.ssh/autoescuela_oracle ubuntu@IP
sudo mkdir -p /opt/autoescuela-virtual
sudo tar -xzf /tmp/autoescuela.tar.gz -C /opt/autoescuela-virtual
sudo bash /tmp/setup-ubuntu.sh SKIP_CLONE=1 IP_PUBLICA=<IP_PUBLICA>
```

## 2b. Desplegar (con dominio y HTTPS)

```bash
sudo REPO_URL=https://github.com/TU_USUARIO/autoescuela-virtual.git \
     DOMAIN=autoescuela.TUDOMINIO.com \
     EMAIL=tu@email.com \
     bash <(curl -Ls https://raw.githubusercontent.com/TU_USUARIO/autoescuela-virtual/BRANCH/deploy/setup-ubuntu.sh)
```

> Antes de ejecutarlo, el registro DNS debe apuntar a la IP de la VM.

## 4. Comprobar

Sustituí `BASE_URL` por `http://IP_PUBLICA` o `https://DOMINIO` según el modo:

- `BASE_URL/health` → `{"datos":{"estado":"ok","baseDeDatos":true}}`
- `BASE_URL/api/senales` → JSON con la lista de señales
- `BASE_URL/` → la app (registrar un usuario y hacer un examen)

## Operaciones habituales

```bash
# Logs del servicio
sudo journalctl -u autoescuela -f

# Redesplegar (tras un push a git)
cd /opt/autoescuela-virtual && git pull && npm run build && sudo systemctl restart autoescuela

# Copia de seguridad manual
sudo bash /usr/local/bin/backup-autoescuela.sh

# Descargar backups a tu PC
scp -i clave.key ubuntu@IP:/var/lib/autoescuela/backups/autoescuela-*.db .
```

## Ficheros

| Fichero              | Función                                              |
|----------------------|------------------------------------------------------|
| `setup-ubuntu.sh`    | Instala y configura todo en la VM (una sola vez)     |
| `backup-sqlite.sh`   | Backup consistente de la BD (cron diario)            |