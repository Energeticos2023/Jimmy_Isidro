# Jimmy Isidro · Independencia — Aplicación ciudadana v5

Aplicación web instalable (PWA) para Android y iPhone. No pasa por ninguna tienda:
se publica en GitHub Pages y se instala desde el navegador.

---

## Sistema de diseño

**Idea rectora: curvas de nivel.** Independencia es un distrito partido entre la
Cordillera Blanca y la Cordillera Negra. La cartografía de ese territorio —el
relieve y las curvas de nivel— es la única textura decorativa de la aplicación:
aparece en la transición de la portada, en las tarjetas de zona y en la cabecera
de cada ficha. Nunca lleva texto encima.

| Elemento | Decisión |
|---|---|
| Tipografía | Archivo variable, autoalojada (88 KB). Los títulos usan el eje de ancho en 106–112 para dar carácter institucional; el texto corrido va en ancho normal. |
| Color | Tinta `#0D141C`, piedra `#ECEFF2`, papel blanco y un solo color saturado: el oro del partido `#F5C400`. La Cordillera Blanca aporta un azul hielo `#D9E7F3`. |
| Iconos | Juego propio de 26 iconos SVG de trazo, dibujados sobre retícula de 24 px. No se usan emojis: se ven distintos en cada teléfono. |
| Espaciado | Escala de 4 px. Márgenes laterales de 20 px, tarjetas separadas 12 px, bloques cada 32 px. |
| Zona táctil | Mínimo 56 px en todo botón o fila. |
| Movimiento | Aparición escalonada de bloques (420 ms). Se desactiva si el sistema pide movimiento reducido. |

## Arquitectura

Pantallas independientes, no una página larga. Cada vista tiene una sola tarea:

| Pantalla | Alto en celular |
|---|---|
| Inicio | ≈ 2,2 |
| Territorio | ≈ 1,2 |
| Lista de una zona | ≈ 1,1 |
| Ficha territorial | ≈ 1,4 |
| Súmate | ≈ 1,4 |
| Propuestas | ≈ 1,5 |
| Jimmy | ≈ 2,1 |

El territorio se recorre en tres niveles: **Zona → Centro poblado → Ficha**,
con botón de volver y título de contexto en la barra superior.

## Verificaciones realizadas

- **Contraste:** 86 textos medidos sobre el píxel realmente pintado. Todos cumplen WCAG AA.
- **Maqueta:** sin desbordes, sin solapamientos y sin zonas táctiles menores a 44 px en 360, 390 y 430 px de ancho.
- **Pliegue:** la acción principal de la portada entra completa en iPhone 14/15, iPhone Pro Max, Pixel 8 y Android de 360×640.
- **Funcionamiento:** navegación, búsqueda, guardado de zona, hojas modales y enlaces, sin errores de consola.

---

## Publicar en GitHub Pages

1. Crea un repositorio nuevo (por ejemplo `app-jimmy-isidro`).
2. Sube **todos** los archivos de esta carpeta a la raíz del repositorio.
3. Entra a **Settings → Pages**.
4. En *Source* elige `Deploy from a branch`, rama `main`, carpeta `/ (root)`. Guarda.
5. En dos o tres minutos queda publicada en
   `https://TU-USUARIO.github.io/app-jimmy-isidro/`

El archivo `.nojekyll` ya está incluido: no lo borres.

> La aplicación debe abrirse por `https://` (GitHub Pages) o por un servidor local.
> Si abres `index.html` con doble clic desde el disco, el navegador bloquea la
> carga de la tipografía y verás la letra del sistema. No es un error del archivo.

## Qué editar

Solo dos archivos necesitan mantenimiento:

- **`config.js`** — número de WhatsApp, Facebook y los tres enlaces de Microsoft Forms.
- **`data.js`** — zonas, centros poblados, caseríos, prioridades y los cinco compromisos.

Los iconos de `data.js` siguen escribiéndose como emoji (💧, 🛡️, 📍, 📈, ❤️) y la
aplicación los traduce automáticamente a su icono dibujado. Si agregas un
compromiso con un emoji nuevo, aparecerá con el icono por defecto.

### Después de cada cambio

Sube también `sw.js` con un número de versión nuevo:

```js
const CACHE = "jimmy-isidro-v5.0.1";
```

Sin eso, los celulares que ya instalaron la app seguirán mostrando la versión anterior.

## Verificar los enlaces de formularios

Confirma que cada enlace de `config.js` corresponde al formulario correcto:

- `forms.personeros` → convocatoria de personeros
- `forms.simpatizantes` → registro de apoyo ciudadano
- `forms.profesionales` → padrón de profesionales

Si el orden está cambiado, solo intercambia las direcciones dentro del archivo.

## Créditos tipográficos

Archivo, de Omnibus-Type, bajo SIL Open Font License 1.1.
