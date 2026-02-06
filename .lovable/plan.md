

# Plan: Actualizar Label y Placeholder del Textarea

## Resumen

Cambiar el texto del label y placeholder del campo de mensaje en el formulario de contacto para hacerlo mas amigable y centrado en el usuario.

---

## Cambios a Realizar

**Archivo:** `src/pages/Contact.tsx`

### 1. Label del Textarea (Linea 167)

```tsx
// Antes
{language === 'es' ? 'Mensaje' : 'Message'} *

// Despues
{language === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help you?'} *
```

### 2. Placeholder del Textarea (Linea 173)

```tsx
// Antes
placeholder={language === 'es' ? 'Cuéntanos cómo podemos ayudarte...' : 'Tell us how we can help you...'}

// Despues
placeholder={language === 'es' ? 'Cuéntanos tus dudas o lo que necesitas, estamos aquí para ti...' : "Tell us your questions or what you need, we're here for you..."}
```

---

## Textos Finales

| Elemento | Español | Ingles |
|----------|---------|--------|
| Label | ¿En que podemos ayudarte? * | How can we help you? * |
| Placeholder | Cuentanos tus dudas o lo que necesitas, estamos aqui para ti... | Tell us your questions or what you need, we're here for you... |

---

## Archivo Modificado

- `src/pages/Contact.tsx` (2 cambios de texto)

