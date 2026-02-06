

# Plan: Estandarizar Estilo del Botón "Cómo Llegar"

## Problema Actual

El botón "Cómo Llegar" usa estilos diferentes a los otros dos botones principales:

| Botón | Estilo Actual |
|-------|---------------|
| Enviar Mensaje | `btn-gradient` + `h-12` + `rounded-full` |
| Chatear por WhatsApp | `btn-gradient` + `h-12` + `rounded-full` |
| Cómo Llegar | `variant="outline"` + `rounded-full` (diferente) |

---

## Solución

Aplicar exactamente el mismo estilo `btn-gradient` al botón "Cómo Llegar" y envolver el texto en un `<span>` para garantizar visibilidad en hover.

---

## Cambios Requeridos

### Archivo: `src/pages/Contact.tsx`

**Líneas 327-337 - Cambiar de:**

```tsx
<Button 
  variant="outline"
  className="rounded-full"
  onClick={() => {
    window.open('https://maps.google.com', '_blank');
  }}
>
  <MapPin className="w-4 h-4 mr-2" />
  {language === 'es' ? 'Cómo Llegar' : 'Get Directions'}
</Button>
```

**A:**

```tsx
<Button 
  className="h-12 px-6 btn-gradient rounded-full font-medium"
  onClick={() => {
    window.open('https://maps.google.com', '_blank');
  }}
>
  <MapPin className="w-5 h-5" />
  <span>{language === 'es' ? 'Cómo Llegar' : 'Get Directions'}</span>
</Button>
```

---

## Detalles Técnicos

| Cambio | Razón |
|--------|-------|
| Remover `variant="outline"` | Evita conflicto con btn-gradient |
| Agregar `h-12` | Altura consistente con otros botones |
| Agregar `btn-gradient` | Aplica degradado corporativo |
| Cambiar ícono a `w-5 h-5` | Tamaño consistente con otros botones |
| Remover `mr-2` del ícono | btn-gradient ya tiene `gap-2` heredado |
| Envolver texto en `<span>` | Garantiza z-index correcto en hover |

---

## Resultado

Los tres botones principales de la página tendrán:
- Mismo degradado de fondo (magenta a fucsia)
- Misma altura (48px)
- Mismo efecto hover (degradado coral-fucsia + elevación)
- Texto e íconos siempre visibles (protegidos por z-index)

