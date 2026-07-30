# Jimmy Isidro App — PWA para Android y iPhone

Aplicación web progresiva lista para publicarse en GitHub Pages. Funciona como sitio web y puede instalarse en Android o agregarse a la pantalla de inicio de iPhone.

## Formularios integrados

Los enlaces se encuentran en `config.js` y fueron mapeados según el orden entregado:

1. Personeros
2. Simpatizantes / voto seguro
3. Profesionales y técnicos

Si el orden no coincide, solo intercambie los enlaces en `config.js`.

## Publicar en GitHub Pages

1. Cree un repositorio nuevo, por ejemplo: `Jimmy-Isidro-App`.
2. Suba **el contenido de esta carpeta**, no la carpeta contenedora.
3. En GitHub entre a `Settings` → `Pages`.
4. En `Build and deployment`, seleccione `Deploy from a branch`.
5. Elija la rama `main` y la carpeta `/ (root)`.
6. Presione `Save` y espere la dirección pública.

La URL tendrá una estructura similar a:
`https://USUARIO.github.io/Jimmy-Isidro-App/`

## Instalar

### Android
Abra la URL en Chrome y presione `Instalar aplicación` o `Agregar a pantalla principal`.

### iPhone
Abra la URL en Safari → botón Compartir → `Agregar a inicio`.

## Actualizar centros poblados y barrios

Edite `data.js`. Cada territorio tiene:
- `name`
- `population`
- `localities`
- `needs`
- `status`

Cuando exista una población oficial, reemplace `population: null` por el número, por ejemplo:
`population: "2 450"`

## Privacidad

La aplicación no guarda respuestas ni datos personales. Los formularios se abren en Microsoft Forms. No agregue bases de datos públicas de simpatizantes, DNI, teléfonos o preferencias políticas dentro del repositorio.

## Documentos públicos

Se incluyeron:
- Diagnóstico territorial inicial.
- Investigación integral del distrito.

El Plan Estratégico de Campaña no se incluye porque es un documento interno.
