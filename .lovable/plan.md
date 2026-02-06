

# Plan: Convertir Logo a PNG con Fondo Transparente

## Situacion Actual

El logo actual (`src/assets/logo.png`) ya esta en formato PNG, pero tiene un **fondo blanco/gris** en lugar de fondo transparente. Esto causa que el logo no se integre visualmente bien con los diferentes fondos de la aplicacion.

---

## Limitacion Importante

**No puedo editar imagenes directamente.** La conversion de una imagen PNG con fondo solido a PNG con fondo transparente requiere herramientas de edicion de imagenes como:

- Adobe Photoshop
- GIMP (gratuito)
- Canva
- Remove.bg (herramienta online automatica)
- Photopea (editor online gratuito)

---

## Pasos Recomendados

### Paso 1: Crear el Logo con Fondo Transparente (Lo haces tu)

1. Abre el logo actual en un editor de imagenes
2. Usa la herramienta "Varita Magica" o "Seleccionar por Color" para seleccionar el fondo blanco
3. Elimina el fondo seleccionado
4. Exporta como PNG (asegurandote de mantener la transparencia)

**Opcion rapida:** Sube la imagen a [remove.bg](https://remove.bg) - elimina fondos automaticamente

### Paso 2: Subir el Nuevo Logo

Una vez tengas el logo con fondo transparente, subelo al chat y yo lo reemplazare en el proyecto.

---

## Ubicaciones del Logo a Actualizar

| Componente | Archivo | Uso |
|------------|---------|-----|
| Navbar | `src/components/Navbar.tsx` | Logo principal en navegacion |
| Footer | `src/components/Footer.tsx` | Logo en pie de pagina (con filtro invert) |
| BookingNavbar | `src/components/booking/BookingNavbar.tsx` | Logo en pagina de reservas |

---

## Beneficios del Fondo Transparente

- Se integrara perfectamente con el fondo glass del navbar
- Se vera mejor sobre el fondo chocolate del footer (sin necesidad de filtros invert)
- Aspecto mas profesional y limpio en toda la aplicacion

---

## Siguiente Paso

**Sube la version del logo con fondo transparente** y yo actualizare todas las referencias en la aplicacion, ajustando los estilos CSS si es necesario (por ejemplo, removiendo los filtros `brightness-0 invert` del footer si ya no son necesarios).

