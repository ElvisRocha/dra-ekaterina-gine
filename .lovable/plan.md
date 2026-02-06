

# Plan: Corregir Bug Crítico de Hover en Botones /contacto

## Diagnóstico del Problema

La clase `.btn-gradient` usa un pseudo-elemento `::before` que se superpone al contenido en hover. El CSS actual solo protege elementos `<span>`:

```css
.btn-gradient span {
  @apply relative z-10;
}
```

### Elementos afectados:

| Botón | Problema |
|-------|----------|
| Enviar Mensaje | Ícono `<Send>` está fuera del `<span>` - desaparece en hover |
| WhatsApp | No tiene `<span>` - TODO desaparece en hover |

---

## Solución

Cambiar el selector CSS de `.btn-gradient span` a `.btn-gradient > *` para que TODOS los hijos directos (íconos SVG, spans, texto) queden visibles sobre el overlay.

---

## Cambios Requeridos

### Archivo: `src/index.css`

**Líneas 178-180 - Cambiar:**

```css
/* ANTES - Solo protege spans */
.btn-gradient span {
  @apply relative z-10;
}

/* DESPUÉS - Protege TODOS los hijos directos */
.btn-gradient > * {
  @apply relative z-10;
}
```

---

## Por qué funciona

| Selector | Elementos protegidos |
|----------|---------------------|
| `.btn-gradient span` | Solo `<span>` |
| `.btn-gradient > *` | `<Send>`, `<MessageCircle>`, `<span>`, texto, etc. |

El selector `> *` selecciona todos los hijos directos del botón, asegurando que tanto íconos SVG como texto queden por encima del pseudo-elemento `::before` (z-index 10 > z-index automático del ::before).

---

## Resultado

- Ícono `<Send>` visible en estado normal Y hover
- Ícono `<MessageCircle>` visible en estado normal Y hover  
- Todo el texto visible en estado normal Y hover
- El efecto visual del degradado hover se mantiene intacto

---

## Resumen de Archivos

| Archivo | Cambio |
|---------|--------|
| `src/index.css` | 1 cambio de selector (línea 178) |

