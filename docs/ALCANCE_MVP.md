# Alcance del MVP demostrativo

Esta aplicación muestra la experiencia propuesta para GBA LATAM. No es la plataforma productiva.

## Incluido

- Login simulado y cierre de sesión.
- Smart Center con cuatro indicadores coherentes: formación, planeación, ejecución y pendientes.
- Mi Transformación, preoperativos con carga simulada, seis módulos y detalle.
- Índice de Madurez como resultado importado, con lectura y acceso a GIO.
- Academy, ruta SARLAFT, lección, perfil, catálogo y proyectos de acreditación.
- Iniciativas de la cooperativa, separadas del Programa TD.
- Reportería con vistas de participante, gerencia y administración GBA.
- Cambio de entidad entre Ejemplo, Aurora y Red Coop Central.
- GIO con respuestas fijas según la pantalla y el estado local.
- Persistencia en el navegador y reinicio de la demo.
- Modo presentación con el recorrido de 90 segundos.
- Escritorio, tablet y móvil.

## Simulado, no real

- Credenciales, permisos y aislamiento multiempresa.
- Carga y aprobación de documentos.
- Progreso de lecciones y entrega a validación.
- Creación de iniciativas.
- Respuestas de GIO.
- Interés por un curso no contratado: el aviso dice que el envío queda para después.

## Fuera de esta etapa

- Backend, PostgreSQL, Supabase, SSO.
- Monday, Google Drive, LMS/LXP, IMD en vivo, proveedor de IA.
- Pagos, correo, descarga real de archivos y app nativa.
- Acreditación automática y aprobación oficial de documentos.

## Cómo se conectaría después

Los tipos viven en `src/types`. Los datos base están en `src/data`. La pantalla no calcula cifras por su cuenta: `buildWorkspace` deriva indicadores, pendientes y avance desde esa fuente más el estado local. Un servicio real puede reemplazar `buildWorkspace` sin reescribir las páginas.
