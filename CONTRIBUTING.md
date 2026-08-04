# Contributing a Autoescuela Virtual

¡Gracias por tu interés en contribuir! Este proyecto te permite ayudar a futuros conductores a preparar el examen teórico de la DGT.

## Guía de inicio rápido

1. **Fork & Clone**
   ```bash
   git fork https://github.com/BrunoJimenez73/autoescuela-virtual.git
   git clone https://github.com/<tu-usuario>/autoescuela-virtual.git
   cd autoescuela-virtual
   npm run install:all
   ```

2. **Desarrollo** (2 terminales)
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev

   # Terminal 2: Frontend
   cd client && npm run dev
   ```

3. **Verifica que funciona**
   ```bash
   curl http://localhost:3001/api/preguntas
   # o abre http://localhost:5173
   ```

## Cómo contribuir

### Reportar un error

1. Abre un [issue](../../issues)
2. Usa el template "Bug report"
3. Incluye:
   - Captura de pantalla o descripción
   - Pasos para reproducir
   - Tu sistema operativo y versión de Node.js

### Proponer mejoras

1. Abre un issue con la etiqueta "enhancement"
2. Describe qué quieres cambiar y por qué
3. Si es algo grande, abre un issue de discusión primero

### Añadir preguntas nuevas

Todas las preguntas vienen de tests oficiales DGT. Para añadir preguntas:

1. Abre el archivo `server/src/db/seed-preguntas-oficiales.ts`
2. Añade preguntas siguiendo el patrón:
   ```typescript
   {
     texto: "Tu pregunta aquí",
     opciones: ["Opción A", "Opción B", "Opción C"],
     indice_correcta: 1,  // Índice de la respuesta correcta
     tema_id: 1,          // Ver tabla temas
     dificultad: 2,       // 1=fácil, 5=difícil
     referencia_manual: "tema#seccion",
     explicacion: "Explicación breve"
   }
   ```
3. Asegúrate de que:
   - Las preguntas provienen de tests DGT oficiales
   - La respuesta correcta es verificable
   - La `referencia_manual` ancla a contenido real del manual

### Añadir señales

1. Coloca el SVG en `server/public/senales/`
2. Nombra con el patrón: `{categoria}{numero}.svg` (ej: `r101.svg`, `s1.svg`)
3. Añade la entrada en `server/src/db/seed-senales.ts`

### Añadir contenido al manual

1. Edita `server/src/db/seed-manual.ts`
2. Cada tema tiene secciones con contenido HTML
3. Los encabezados deben tener `id` para anclas
4. Verifica que las anclas coincidan con `referencia_manual` en preguntas

## Patrones de desarrollo

### Backend

- Express + TypeScript
- Rutas con validación de JWT
- Queries con better-sqlite3 (no ORM)
- Seeds idempotentes (usa `seed_meta`)

### Frontend

- React + TypeScript + Vite
- Tailwind CSS para estilos
- Context API para auth (no Redux)
- Hooks customizados para lógica de negocio

### Convenciones

- Nombres en español (dominio de negocio)
- API REST con prefijo `/api/`
- JWT en header `Authorization: Bearer <token>`
- TypeScript estricto (compila con `npx tsc --noEmit`)

## Pull requests

1. Mantén cambios enfocados en una sola cosa
2. Asegúrate de que compila sin errores:
   ```bash
   cd server && npx tsc --noEmit
   cd client && npx tsc --noEmit
   ```
3. Si añades preguntas, verifica conectividad manual
4. Push a un branch con nombre descriptivo:
   ```bash
   git checkout -b fix/corregir-pregunta-123
   ```
5. Abre PR con descripción clara

## Código de conducta

Sé amable y respetuoso. Este es un proyecto educativo sin ánimo de lucro.

## ¿Preguntas?

Abre un issue o contacta a [@BrunoJimenez73](https://github.com/BrunoJimenez73)
