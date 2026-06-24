# Electromica — Sitio Web Corporativo

Sitio web estático para **Electromica**, empresa venezolana de servicios técnicos industriales especializada en mantenimiento eléctrico, obras civiles, instrumentación y automatización para el sector petrolero e industrial.

## Propósito

El sitio funciona como **presencia digital corporativa**: presenta la empresa, cataloga los servicios que ofrece, muestra los clientes y trabajos realizados, y proporciona canales de contacto. Está optimizado para buscadores (GEO/SEO) con schema.org JSON-LD, etiquetas OG, y meta descriptions.

## Tecnologías

- HTML5 semántico
- CSS3 puro (sin frameworks)
- JavaScript vanilla (Intersection Observer, animaciones)
- Google Fonts (Montserrat)
- Google Maps Embed (ubicación)
- Schema.org JSON-LD (GEO/SEO)

## Estructura

```
/
├── index.html          — Página principal: carrusel de clientes, tabla de trabajos, sección "Nosotros"
├── servicios.html      — Catálogo interactivo de servicios con pestañas e imágenes
├── contacto.html       — Página de contacto con mapa y datos de la empresa
├── css/
│   └── style.css       — Todos los estilos del sitio (responsive incluido)
├── js/
│   └── script.js       — Menú móvil, animaciones al scroll, pausa de carrusel, año dinámico
├── assets/
│   └── img/
│       ├── logos_carrusel/     — Logos de clientes (CMEC, CNPC, PDVSA, PDVSA Gas, PDVSA Industrial)
│       ├── img_servicios/      — Imágenes ilustrativas por categoría de servicio
│       ├── logo_electromica.jpeg
│       ├── logo_electromica_favicon.png
│       ├── fondo-hero.jpeg
│       ├── fondo_seccion_nosotros.jpeg
│       ├── f1.jpg
│       └── alumbrado_publico.png
└── README.md
```

## Despliegue

El sitio es 100% estático y se despliega en **Vercel** desde el repositorio de Git. Cualquier cambio en la rama principal se despliega automáticamente.

### Local

Abrí `index.html` en cualquier navegador. No requiere build ni dependencias.

```bash
# Servir localmente con Python (opcional)
python -m http.server 8000
```

## Mantenimiento

- **Agregar un logo**: colocá la imagen en `assets/img/logos_carrusel/` y agregá el `<img>` en las dos mitades del carrusel en `index.html`.
- **Agregar un servicio**: actualizá las pestañas, paneles e imágenes en `servicios.html`.
- **Actualizar trabajos**: editá la tabla en `index.html`.
