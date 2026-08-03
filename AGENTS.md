# Autoescuela Virtual - Contexto del Proyecto

## Visión General
Plataforma web para estudiar el teórico de autoescuela (permiso B). Combina un manual de estudio completo con simulacros de examen adaptativos.

## Stack Tecnológico
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript
- **Base de Datos**: SQLite (better-sqlite3)
- **Autenticación**: bcrypt + JWT
- **Señales**: SVGs como archivos estáticos servidos desde `server/public/senales/`

## Estructura del Proyecto
```
autoescuela_Virtual/
├── server/           # Backend Express + API REST
├── client/           # Frontend React + Vite
├── .opencode/        # Configuración de opencode
├── AGENTS.md         # Este archivo
└── README.md
```

## Convenios de Código
- TypeScript estricto
- Nombres en español (dominio de negocio)
- Componentes React funcionales + hooks
- API REST con prefijo /api/
- JWT en header Authorization: Bearer <token>

## Estado Actual
Construido e implementado.

### Resumen de implementación

#### Backend (server/)
- Express + TypeScript con SQLite (better-sqlite3)
- Autenticación JWT (bcrypt + jsonwebtoken)
- Rutas API: `/api/auth/*`, `/api/preguntas/*`, `/api/examenes/*`, `/api/progreso/*`, `/api/manual/*`, `/api/senales/*`
- ~200 preguntas de test en 8 temas con referencias al manual
- Contenido documental completo (HTML con Tailwind prose) en 8 temas con 14 secciones
- 65 señales de tráfico en 6 categorías (Peligro, Prohibición, Obligación, Reglamentación, Prioridad, Indicación, Servicio) con SVGs como archivos estáticos y descripciones del Reglamento General de Circulación
- Algoritmo adaptativo por peso de fallos
- Seed automático al iniciar (solo una vez)

#### Frontend (client/)
- React + TypeScript + Vite + Tailwind CSS
- Auth: Login/Register con contexto global y rutas protegidas
- Estudio: Manual completo con contenido renderizado
- Señales: Catálogo con 65 señales SVG filtrable por categoría
- Exámenes: Creación (normal/adaptativo), realización con temporizador, corrección con visualización de fallos
- Progreso: Dashboard con resumen, gráficos por tema, detección de puntos débiles
- Todos los módulos compilan sin errores de TypeScript
- Vite build exitoso

### Para ejecutar

```bash
# Servidor (puerto 3001)
cd server && npm run dev

# Cliente (puerto 5173)
cd client && npm run dev
```

### Próximas mejoras posibles
- Añadir más preguntas (objetivo: 300+)
- Buscador en el manual
- Gráficos interactivos con Recharts
- Modo oscuro
- Marcar preguntas favoritas
- Exportar estadísticas
