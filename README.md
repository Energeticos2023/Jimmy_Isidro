# Jimmy Isidro App — Versión 3.0 móvil

Aplicación web progresiva (PWA) optimizada para Android y iPhone, preparada para publicarse en GitHub Pages.

## Mejoras principales de esta versión

- Portada más limpia y menos saturada.
- Un solo llamado principal: **Encuentra tu zona**.
- Botones móviles de ancho completo y mayor separación.
- Se eliminó el botón flotante que podía cubrir contenido.
- Nueva función **Mi zona**, que guarda localmente el barrio o centro poblado elegido.
- Navegación inferior actualizada: Inicio, Mi zona, Súmate, Propuestas y Jimmy.
- Acceso directo al WhatsApp de Jimmy Isidro: 981 918 440.
- Formularios de personeros, simpatizantes y profesionales.
- Plan de Gobierno, diagnóstico territorial e investigación integral en una sección secundaria de transparencia.
- Caché inicial más ligero: no descarga automáticamente toda la galería ni los PDF.
- Diseño adaptado a pantallas pequeñas desde 360 px de ancho.

## Publicación en GitHub Pages

1. Descomprime el ZIP.
2. Sube todos los archivos y carpetas a la raíz del repositorio.
3. En GitHub abre **Settings → Pages**.
4. Selecciona **Deploy from a branch**.
5. Elige la rama **main** y la carpeta **/ root**.
6. Guarda los cambios.

## Actualización desde una versión anterior

Reemplaza todos los archivos anteriores, especialmente:

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `manifest.webmanifest`
- carpeta `assets`

El nuevo `sw.js` usa el caché `jimmy-isidro-v3.0.0`, por lo que los celulares deberían recibir la versión nueva. Si un equipo conserva la versión anterior, cerrar la app, abrirla de nuevo con internet y actualizar la página.

## Privacidad

La app no guarda respuestas de formularios. La selección de **Mi zona** se guarda únicamente en el navegador del propio celular mediante `localStorage`.
