
# Plan: Corregir Hover de Botones en /contacto

## Problema Identificado

La clase `btn-gradient` en `src/index.css` usa un pseudo-elemento `::before` que cubre todo el boton en hover con `opacity-100`. El CSS actual solo aplica `z-10` a elementos `span`:

```css
.btn-gradient span {
  @apply relative z-10;
}
```

Esto causa que los iconos SVG y textos fuera de `<span>` queden ocultos detras del overlay.

---

## Solucion

Modificar el CSS de `btn-gradient` para que TODOS los hijos directos (iconos y texto) permanezcan visibles sobre el overlay del hover.

**Archivo:** `src/index.css`

**Cambio en lineas 178-180:**

```css
/* Antes */
.btn-gradient span {
  @apply relative z-10;
}

/* Despues - aplicar a todos los hijos directos */
.btn-gradient > * {
  @apply relative z-10;
}
```

---

## Por que funciona

| Selector | Afecta a |
|----------|----------|
| `.btn-gradient span` | Solo elementos `<span>` |
| `.btn-gradient > *` | Todos los hijos directos (iconos SVG, spans, texto) |

Con este cambio, tanto el icono `<Send>` como el icono `<MessageCircle>` y todos los textos quedaran por encima del pseudo-elemento `::before`, manteniendose visibles durante el hover.

---

## Archivo Modificado

- `src/index.css` (1 cambio de selector CSS)
