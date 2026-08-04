# Tabla de contenidos

- [Documentación](#documentación)
  - [Estructura de la API](#estructura-de-la-api)
  - [Esquema de la base de datos](#esquema-de-la-base-de-datos)
  - [Algoritmo adaptativo](#algoritmo-adaptativo)
  - [Temas y señales](#temas-y-señales)
- [Desarrollo](#desarrollo)
- [Deployment](#deployment)

## Estructura de la API

Todas las rutas usan el prefijo `/api/` y requieren autenticación JWT salvo indicación contraria.

### Auth

```
POST /api/auth/register
  Body: { email, password, nombre }
  Returns: { token, user }

POST /api/auth/login
  Body: { email, password }
  Returns: { token, user }

GET /api/auth/verify
  Headers: Authorization: Bearer <token>
  Returns: { id, email, nombre }
```

### Preguntas

```
GET /api/preguntas?tema=1&modo=adaptativo
  Requires: Authorization
  Query params:
    - tema (opcional): ID del tema
    - modo: 'normal' o 'adaptativo'
  Returns: [{ id, texto, opciones, tema_id, ... }]

GET /api/preguntas/:id
  Requires: Authorization
  Returns: pregunta completa (sin índice correcto)
```

### Exámenes

```
POST /api/examenes
  Requires: Authorization
  Body: { modo: 'normal'|'adaptativo', tema?: id }
  Returns: { id, preguntas: [...] }

PUT /api/examenes/:id
  Requires: Authorization
  Body: { respuestas: [{ pregunta_id, indice_seleccionado }] }
  Returns: { acertadas, total, porcentaje, detalles }

GET /api/examenes
  Requires: Authorization
  Returns: [{ id, fecha, acertadas, total, porcentaje, modo }]
```

### Progreso

```
GET /api/progreso
  Requires: Authorization
  Returns: { resumen, por_tema, puntos_debles }
```

## Esquema de la base de datos

Ver [server/src/db/database.ts](server/src/db/database.ts) para el código fuente.

### Tabla: preguntas

Almacena las 452 preguntas oficiales DGT.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | Primary key |
| texto | TEXT | Enunciado de la pregunta |
| opciones | TEXT (JSON) | Array de 3 strings |
| indice_correcta | INTEGER | Índice de respuesta correcta (0, 1, 2) |
| tema_id | INTEGER | FK a temas.id |
| dificultad | INTEGER | 1-5 (1=fácil) |
| referencia_manual | TEXT | Formato "slug_tema#ancla_seccion" |
| explicacion | TEXT | Explicación de la respuesta |
| imagen | TEXT | Ruta relativa a SVG (opcional) |

### Tabla: examenes

Histórico completo de exámenes realizados.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER | Primary key |
| usuario_id | INTEGER | FK a usuarios.id |
| fecha | TEXT | ISO timestamp |
| acertadas | INTEGER | Número de aciertos |
| total | INTEGER | Total preguntas |
| porcentaje | INTEGER | 0-100 |
| modo | TEXT | 'normal' o 'adaptativo' |
| tiempo_segundos | INTEGER | Duración del examen |
| detalles | TEXT (JSON) | Array de {pregunta_id, indice_seleccionado, indice_correcta} |

### Tabla: progreso_tema

| Columna | Tipo | Descripción |
|---------|------|-------------|
| usuario_id | INTEGER | FK a usuarios.id |
| tema_id | INTEGER | FK a temas.id |
| acertadas | INTEGER | |
| falladas | INTEGER | |
| total | INTEGER | |

### Tabla: errores_pregunta

Para algoritmo adaptativo.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| usuario_id | INTEGER | |
| pregunta_id | INTEGER | |
| veces | INTEGER | Número de veces fallada |

## Algoritmo adaptativo

### Selección de preguntas

1. Consulta `errores_pregunta` para el usuario
2. Preguntas con más errores reciben mayor peso
3. Si no hay historial, selecciona aleatoriamente

### Fórmula de peso

```
peso = errores * 10 + (dificultad * 5)
```

### Distribución

- 50% preguntas falladas (pesos altos)
- 30% preguntas del mismo tema
- 20% nuevas preguntas (rotación)

## Temas y señales

### 8 Temas de estudio

```
1: señalizacion - Señales de tráfico
2: prioridades - Circulación y prioridades
3: estacionamiento - Estacionamiento
4: cambio-sentido - Cambio de sentido
5: velocidad - Velocidad y distancias
6: normas-usuario - Normas de usuario
7: documentacion - Documentación y seguros
8: mecanica - Instalaciones y mecánica
```

### 6 Categorías de señales

```
1: peligro - Señales de peligro (ADVERTENCIA)
2: prohibicion - Señales de prohibición
3: obligacion - Señales de obligación
4: reglamentacion - Señales de reglamentación
5: prioridad - Señales de prioridad
6: indicacion - Señales de indicación
```

## Desarrollo

### Verificación continua

```bash
# Verificar tipos del server
cd server && npx tsc --noEmit

# Verificar tipos del client
cd client && npx tsc --noEmit

# Build completo
npm run build

# Base de datos
node server/src/scripts/verify-db.js
```

### Seeds

Los seeds son idempotentes. Para forzar reinicio:

```bash
rm server/data/autoescuela.db
cd server && npm run dev  # Reconstruye automáticamente
```

## Deployment

### Producción

```bash
npm run build
npm start
```

### Variables de entorno

```
PUERTO=3001
JWT_SECRET=super_secreto_cambiar
SESSION_EXPIRES_IN=7d
```

Ver [.env.example](.env.example)
