
# Plan: Ajustes de Consistencia Visual en Contacto

## Resumen

Aplicar dos ajustes de estilo en la pagina `/contacto` para mejorar la consistencia visual entre las dos secciones principales.

---

## Cambios a Realizar

### 1. Boton "Enviar Mensaje" - Border Radius

**Archivo:** `src/pages/Contact.tsx`

**Linea 179-190:** El boton actualmente usa la clase `btn-gradient` sin especificar border-radius. El boton de WhatsApp usa `rounded-full`.

**Cambio:**
```tsx
// Antes (linea 181)
className="w-full btn-gradient"

// Despues
className="w-full btn-gradient rounded-full"
```

---

### 2. Consistencia Entre Cards

Ambas cards ya tienen estilos similares, pero hay que asegurar que tengan la misma altura minima para verse alineadas.

**Estado actual de ambas cards:**
- Card izquierda (linea 103): `bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border`
- Card derecha (linea 199): `bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border`

Los estilos base son identicos. El problema es que tienen contenido de diferente tamaño, por lo que una puede verse mas corta que la otra.

**Solucion:** Agregar `h-full` a ambas cards para que ocupen el 100% de la altura disponible en el grid, asegurando que se vean parejas.

**Cambios:**

```tsx
// Card izquierda (linea 103)
// Antes
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border"

// Despues
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full"
```

```tsx
// Card derecha (linea 199)
// Antes
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border"

// Despues
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full"
```

---

## Resumen de Cambios

| Elemento | Cambio |
|----------|--------|
| Boton "Enviar Mensaje" | Agregar `rounded-full` para igualar el border-radius del boton de WhatsApp |
| Card "Envíanos un Mensaje" | Agregar `h-full` para altura consistente |
| Card "Información de Contacto" | Agregar `h-full` para altura consistente |

---

## Archivos Modificados

- `src/pages/Contact.tsx` (3 cambios menores de clases CSS)
