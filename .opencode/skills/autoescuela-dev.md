# Autoescuela Virtual - Skill de Desarrollo

## Patrones de Código

### Backend (server/)
- **Rutas**: Organizadas por recurso en `server/src/routes/`
- **Middleware**: Autenticación JWT en `server/src/middleware/auth.ts`
- **DB**: SQLite con better-sqlite3. Schema en `server/src/db/schema.sql`
- **Seed**: Preguntas y contenido del manual en `server/src/db/seed-*.ts`
- **Modelo de respuesta**: `{ datos: T | null, error: string | null }`

### Frontend (client/)
- **Páginas**: En `client/src/pages/` organizadas por funcionalidad
- **Componentes**: En `client/src/components/` reutilizables
- **API Client**: En `client/src/api/client.ts` con fetch wrapper
- **Auth Context**: En `client/src/context/AuthContext.tsx`
- **Rutas protegidas**: Componente `ProtectedRoute` que redirige a `/login`
- **Tipos compartidos**: En `client/src/types/index.ts`

## Convenios
- Exportaciones nombradas (no default exports)
- Props tipadas con interfaces
- CSS con Tailwind (sin CSS modules ni styled-components)
- Fetch con manejo de errores uniforme
- Fechas en ISO 8601
- Respuestas siempre en formato `{ datos, error }`

## Comandos Comunes

```bash
# Server
cd server && npm run dev    # Iniciar backend en modo desarrollo
cd server && npm run build  # Compilar TypeScript
cd server && npm start      # Iniciar en producción

# Client
cd client && npm run dev    # Iniciar frontend en modo desarrollo
cd client && npm run build  # Compilar producción
cd client && npm run lint   # Linter
```
