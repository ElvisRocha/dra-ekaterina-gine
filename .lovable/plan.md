

# Plan: Estilizar Boton WhatsApp y Alinear Botones

## Resumen

Dos cambios en `/contacto`: unificar el estilo del boton de WhatsApp con el de "Enviar Mensaje" y alinear ambos botones a la misma altura visual.

---

## Cambios a Realizar

### 1. Color del Boton WhatsApp

**Archivo:** `src/pages/Contact.tsx`

**Linea 288-296:** El boton de WhatsApp actualmente usa colores verdes personalizados.

```tsx
// Antes
className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#25D366] hover:bg-[#22c55e] text-white rounded-full font-medium transition-colors"

// Despues - usar btn-gradient igual que "Enviar Mensaje"
className="flex items-center justify-center gap-2 w-full py-3 px-4 btn-gradient rounded-full font-medium transition-colors"
```

El icono de WhatsApp (MessageCircle) y el texto se mantienen sin cambios.

---

### 2. Alinear Botones Horizontalmente

Para que ambos botones queden a la misma altura, necesitamos que ambas cards usen flexbox con distribucion vertical y empujen el boton hacia abajo.

**Card izquierda (formulario) - Linea 103:**
```tsx
// Antes
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full"

// Despues - agregar flex flex-col
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full flex flex-col"
```

**Form dentro de la card - Linea 109:**
```tsx
// Antes
<form onSubmit={handleSubmit} className="space-y-5">

// Despues - agregar flex-1 flex flex-col
<form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
```

**Boton "Enviar Mensaje" - Linea 179:**
```tsx
// Antes
<Button type="submit" className="w-full btn-gradient rounded-full" ...>

// Despues - agregar mt-auto para empujar al fondo
<Button type="submit" className="w-full btn-gradient rounded-full mt-auto" ...>
```

**Card derecha (info contacto) - Linea 199:**
```tsx
// Antes
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full"

// Despues - agregar flex flex-col
className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border h-full flex flex-col"
```

**Seccion WhatsApp CTA - Linea 282:**
```tsx
// Antes
<div className="mt-8 pt-6 border-t border-border">

// Despues - agregar mt-auto para empujar al fondo
<div className="mt-auto pt-6 border-t border-border">
```

---

## Resumen de Cambios

| Elemento | Cambio |
|----------|--------|
| Boton WhatsApp | Reemplazar `bg-[#25D366] hover:bg-[#22c55e] text-white` por `btn-gradient` |
| Card formulario | Agregar `flex flex-col` |
| Form | Agregar `flex-1 flex flex-col` |
| Boton Enviar | Agregar `mt-auto` |
| Card info contacto | Agregar `flex flex-col` |
| Seccion WhatsApp | Cambiar `mt-8` por `mt-auto` |

---

## Resultado Visual

Ambos botones quedaran:
- Con el mismo estilo de degradado (btn-gradient)
- Con el mismo border-radius (rounded-full)
- Alineados horizontalmente en la parte inferior de sus respectivas cards

---

## Archivo Modificado

- `src/pages/Contact.tsx` (6 cambios de clases CSS)

