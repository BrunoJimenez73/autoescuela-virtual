# Autoescuela Virtual

Plataforma web para estudiar el teórico de autoescuela (permiso B). Combina un manual de estudio completo con simulacros de examen adaptativos.

[Documentación completa →](#documentación)

## Características

- **Manual de estudio completo**: 8 temas con 14 secciones y contenido HTML con Tailwind CSS
- **Simulacro de examen**: 452 preguntas reales de la DGT (tests oficiales 269-278)
- **Examen adaptativo**: Algoritmo que prioriza preguntas según tus fallos históricos
- **Catálogo de señales**: 65 señales de tráfico en 6 categorías con SVG oficiales
- **Dashboard de progreso**: Estadísticas, gráficos por tema y detección de puntos débiles
- **Autenticación JWT**: Sesión segura con bcrypt y tokens

## Tecnologías

| Área | Tecnologías |
|------|-------------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | Express + TypeScript + SQLite (better-sqlite3) |
| Auth | bcrypt + JWT |
| Señales | SVGs estáticos con descripciones oficiales |

## Instalación

### Requisitos

- Node.js >= 20 < 23
- npm

### Desde el repositorio

```bash
# Clonar el repositorio
git clone https://github.com/BrunoJimenez73/autoescuela-virtual.git
cd autoescuela-virtual

# Instalar dependencias (client + server)
npm run install:all

# O instalar por separado:
cd server && npm install
cd ../client && npm install
```

## Uso

### Modo desarrollo

```bash
# Terminal 1 - Backend (puerto 3001)
cd server && npm run dev

# Terminal 2 - Frontend (puerto 5173)
cd client && npm run dev
```

### Producción

```bash
# Build both client and server
npm run build

# Run production server (serves built client)
npm start

# O por separado:
npm run build:server
npm run dev:server
npm run build:client
npm run dev:client
```

### Windows (usando start.bat)

```cmd
start.bat
```

## Estructura del proyecto

```
autoescuela_Virtual/
├── server/                    # Backend Express + API REST
│   ├── src/
│   │   ├── db/                # Base de datos y seeds
│   │   │   ├── database.ts    # Conexión SQLite
│   │   │   ├── seed-preguntas-oficiales.ts  # Preguntas DGT v3
│   │   │   ├── seed-manual.ts # Contenido del manual
│   │   │   └── seed-senales.ts # Catálogo de señales
│   │   ├── routes/            # Rutas API
│   │   │   ├── auth.ts        # /api/auth/* (login, register, verify)
│   │   │   ├── preguntas.ts   # /api/preguntas/* (CRUD + simulacro)
│   │   │   ├── examenes.ts    # /api/examenes/* (crear, responder, corregir)
│   │   │   ├── progreso.ts    # /api/progreso/* (estadísticas)
│   │   │   ├── manual.ts      # /api/manual/* (contenido)
│   │   │   └── senales.ts     # /api/senales/* (catálogo)
│   │   └── index.ts           # Entry point
│   ├── data/                  # Base de datos SQLite (auto-generada)
│   └── public/                # Archivos estáticos (SVGs de señales)
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── pages/             # Páginas: Auth, Estudio, Examenes, Progreso, Señales
│   │   ├── components/        # Componentes reutilizables
│   │   ├── hooks/             # Hooks customizados
│   │   ├── context/           # AuthContext (JWT global)
│   │   └── types/             # Tipos TypeScript
│   └── public/                # Assets estáticos
├── tools/                     # Scripts de extracción y validación
├── .gitignore
├── package.json               # Scripts de workspace
└── AGENTS.md                  # Contexto del desarrollo
```

## API

### Autenticación

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/register` | POST | Registrar nuevo usuario |
| `/api/auth/login` | POST | Iniciar sesión, retorna token JWT |
| `/api/auth/verify` | GET | Verificar token y obtener usuario |

**Header de autenticación**: `Authorization: Bearer <token>`

### Preguntas

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/preguntas` | GET | Obtener preguntas (filtrado por tema, modo adaptativo) |
| `/api/preguntas/:id` | GET | Obtener pregunta específica |
| `/api/preguntas/categoria/:categoria` | GET | Preguntas por categoría de tema |

### Exámenes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/examenes` | POST | Crear examen (normal/adaptativo) |
| `/api/examenes/:id` | PUT | Enviar respuestas y corregir |
| `/api/examenes/:id` | GET | Obtener resultado del examen |
| `/api/examenes` | GET | Listar exámenes del usuario |

### Progreso

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/progreso` | GET | Dashboard con resumen y estadísticas |
| `/api/progreso/weakness` | GET | Puntos débiles detectados |

### Manual

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/manual/:tema` | GET | Contenido del tema |

### Señales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/senales` | GET | Catálogo completo (filtrable por categoría) |

## Base de datos

**SQLite** con `better-sqlite3`. La base se crea e inicializa automáticamente al iniciar el servidor.

### Schema principal

```sql
-- Temas de estudio
CREATE TABLE temas (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  orden INTEGER NOT NULL
);

-- Preguntas de examen
CREATE TABLE preguntas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  texto TEXT NOT NULL,
  opciones TEXT NOT NULL,           -- JSON array
  indice_correcta INTEGER NOT NULL,
  tema_id INTEGER REFERENCES temas(id),
  dificultad INTEGER DEFAULT 1,      -- 1=fácil, 5=difícil
  referencia_manual TEXT,           -- "#seccion" del manual
  explicacion TEXT,
  imagen TEXT                       -- ruta relativa a SVG
);

-- Examenes realizados
CREATE TABLE examenes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  acertadas INTEGER NOT NULL,
  total INTEGER NOT NULL,
  porcentaje INTEGER NOT NULL,
  modo TEXT NOT NULL,               -- 'normal' | 'adaptativo'
  tiempo_segundos INTEGER,
  detalles TEXT,                    -- JSON: respuestas + tiempos
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

-- Progreso por tema
CREATE TABLE progreso_tema (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  tema_id INTEGER NOT NULL,
  acertadas INTEGER DEFAULT 0,
  falladas INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  FOREIGN KEY(tema_id) REFERENCES temas(id)
);

-- Errores por pregunta (para algoritmo adaptativo)
CREATE TABLE errores_pregunta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  pregunta_id INTEGER NOT NULL,
  veces INTEGER DEFAULT 1,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  FOREIGN KEY(pregunta_id) REFERENCES preguntas(id)
);

-- Meta de seed para idempotencia
CREATE TABLE seed_meta (
  marca TEXT PRIMARY KEY,
  fecha TEXT NOT NULL
);
```

### Semillas de datos

| Archivo | Temas | Preguntas | Descripción |
|---------|-------|-----------|-------------|
| `seed-preguntas-oficiales.ts` | 8 | 405+ | Preguntas reales DGT (tests 269-278) |
| `seed-preguntas-reales.ts` | - | 7 | Preguntas originales test-269 |
| `seed-manual.ts` | 8 | 14 secciones | Contenido teórico completo |
| `seed-senales.ts` | 6 categorías | 65 | Señales con SVG + descripción RGC |
| `seed-temas.ts` | 8 | - | Temas de estudio |
| `seed-admin.ts` | - | 1 | Usuario admin de prueba |

**Idempotencia**: Los seeds usan `seed_meta` para evitar duplicados. Puedes reiniciar la base borrando `server/data/autoescuela.db`.

## Algoritmo adaptativo

El sistema adapta la selección de preguntas según los errores del usuario:

1. **Historial**: Cada vez que un usuario falla una pregunta → se registra en `errores_pregunta`
2. **Pesos**: Preguntas falladas recientemente tienen mayor peso (más probabilidad de repetirse)
3. **Selección**: Al crear un examen adaptativo, se priorizan preguntas con más errores
4. **Temas**: Se equilibran preguntas de todos los temas, dando más peso a temas con menor precisión

Fórmula de peso: `peso = errores * 10 + dificultad`

## Contenido

### 8 Temas de estudio

| # | Tema | Slug |
|---|------|------|
| 1 | Señales de tráfico | señalizacion |
| 2 | Circulación y prioridades | prioridades |
| 3 | Estacionamiento | estacionamiento |
| 4 | Cambio de sentido y dirección | cambio-sentido |
| 5 | Velocidad y distancias de seguridad | velocidad |
| 6 | Normas de usuario | normas-usuario |
| 7 | Documentación y seguros | documentacion |
| 8 | Instalaciones y mecánica | mecanica |

### 65 Señales de tráfico

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| Peligro | ~15 | Triángulos y ADV |
| Prohibición | ~20 | Rojas circulares |
| Obligación | ~12 | Azules circulares |
| Reglamentación | ~8 | Azules rectangulares |
| Prioridad | ~5 | Amarillas/Blancas |
| Indicación | ~5 | Verdes |

## Desarrollo

### Verificar tipos

```bash
# Server
cd server && npx tsc --noEmit

# Client
cd client && npx tsc --noEmit
```

### Verificar base de datos

```bash
# Ejecutar script de validación
cd server && node -e "const db = require('better-sqlite3')('data/autoescuela.db'); console.log('Total preguntas:', db.prepare('SELECT COUNT(*) as c FROM preguntas').get().c);"
```

### Tests

El proyecto no incluye un framework de tests configurado, pero puedes validar:

1. Iniciar el servidor: `cd server && npm run dev`
2. Hacer petición: `curl http://localhost:3001/api/preguntas`
3. Verificar respuestas con login y crear examen

## Deployment

### Opciones

1. **Producción**: `npm run build && npm start`
2. **Docker** (próximamente): Dockerfile + docker-compose

Vea la carpeta `deploy/` para scripts de despliegue.

## Créditos

- Preguntas basadas en tests oficiales DGT (269-278)
- Señales SVG del Reglamento General de Circulación
- Iconos de [Heroicons](https://heroicons.com/)

## Licencia

MIT - Bruno Jiménez
