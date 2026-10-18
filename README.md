# RedCoop · Ecosistema digital GBA

MVP navegable para presentar a GBA LATAM cómo se vería el Smart Center: una cooperativa entra, reconoce sus servicios, sigue su transformación, aprende con Academy y lee el avance con su equipo.

No es la plataforma productiva. Los datos viven en el navegador.

## Requisitos

Node.js 20 o superior.

## Ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run test:e2e
```

La prueba end-to-end usa Playwright y recorre login, planeación, Academy y reportería en escritorio y en un viewport de 390 px. La primera ejecución descarga Chromium. Si el disco del sistema no tiene espacio, define `PLAYWRIGHT_BROWSERS_PATH` en otra unidad antes de `npx playwright install chromium`.

## Recorrer la demo

La guía corta está en [docs/GUIA_DEMO.md](docs/GUIA_DEMO.md). El alcance y los límites están en [docs/ALCANCE_MVP.md](docs/ALCANCE_MVP.md). El análisis de los materiales de origen está en [docs/ANALISIS_REFERENCIAS.md](docs/ANALISIS_REFERENCIAS.md).

Correo de entrada sugerido: `laura.gomez@cooperativa.ejemplo`. No hace falta una contraseña real.

## Stack

Next.js (App Router), React, TypeScript estricto, Tailwind CSS, componentes al estilo shadcn/ui sobre Radix, Lucide, Recharts, Motion y Zustand con `localStorage`.

## Pantallas

Login, dashboard, Mi Transformación, preoperativos, programa y detalle de módulo, índice de madurez, iniciativas, Academy, ruta, lección, perfil, catálogo, proyectos de acreditación, reportería y GIO.

## Pendiente para producción

Identidad aprobada, autenticación, aislamiento entre cooperativas, LMS, Monday, Drive, importación real del IMD y un proveedor de IA gobernado por las reglas de GBA.
