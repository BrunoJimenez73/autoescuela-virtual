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

1. Sube este repo a GitHub (privado) y anota `REPO_URL`.
2. Genera la clave SSH que usarás para conectarte a la VM.

## 1. Crear la VM (web de Oracle)

1. Alta en https://cloud.oracle.com (la tarjeta solo se usa para verificar identidad, no se cobra nada).
2. Compute → Instances → *Create instance*:
   - Shape: **`VM.Standard.A1.Flex`** (ARM). OCPUs: 2, Memoria: 12 GB.
   - Imagen: **Canonical Ubuntu 24.04**.
   - SSH keys: subi tu clave pública y **guardá la privada (.key)**.
   - Si sale "out of host capacity", probá otra *Availability Domain* o más tarde.
3. En **Networking / Security List** de la VCN, agregá reglas de ingreso:
   - `22/tcp` (SSH), `80/tcp`, `443/tcp`.

## 2. Instalar y desplegar (en la VM)

```bash
ssh -i clave.key ubuntu@<IP_PUBLICA>

sudo REPO_URL=https://github.com/TU_USUARIO/autoescuela-virtual.git \
     DOMAIN=autoescuela.TUDOMINIO.com \
     EMAIL=tu@email.com \
     bash <(curl -Ls https://raw.githubusercontent.com/TU_USUARIO/autoescuela-virtual/BRANCH/deploy/setup-ubuntu.sh)
```

O si preferís clonar a mano: cloná, después `sudo bash deploy/setup-ubuntu.sh`.

El script hace todo: instala Node 22 + nginx + certbot, compila cliente+servidor,
crea `server/.env`, arma el servicio `autoescuela` con systemd, configura nginx
con SSL Let's Encrypt y programa el cron de backups.

## 3. DNS

Crea un registro (p.ej. `A`) apuntando `autoescuela.TUDOMINIO.com` a la IP
pública de la VM **antes de** ejecutar el script (certbot lo necesita).

## 4. Comprobar

- `https://DOMINIO/health` → `{"datos":{"estado":"ok","baseDeDatos":true}}`
- `https://DOMINIO/api/senales` → JSON con la lista de señales
- `https://DOMINIO/` → la app (registrar un usuario y hacer un examen)

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