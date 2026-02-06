

# Plan: Reducir Opacidad del Idioma Inactivo en Toggle

## Resumen

Aplicar una opacidad reducida al boton del idioma NO seleccionado para crear un contraste visual mas claro entre el estado activo e inactivo del toggle de idioma.

---

## Estado Actual

Los botones inactivos usan `text-muted-foreground` que tiene cierto contraste, pero el usuario desea que sea aun mas evidente cual idioma esta activo.

---

## Cambios Propuestos

Se modificaran 3 ubicaciones donde existe el toggle de idioma:

### 1. Navbar Desktop (lineas 61-75)

```tsx
// Antes - boton inactivo
'text-muted-foreground hover:text-foreground'

// Despues - agregar opacidad reducida
'text-muted-foreground/50 hover:text-muted-foreground'
```

### 2. Navbar Mobile (lineas 144-158)

```tsx
// Antes - boton inactivo
'text-muted-foreground'

// Despues - agregar opacidad reducida
'text-muted-foreground/50 hover:text-muted-foreground'
```

### 3. BookingNavbar (lineas 32-46)

```tsx
// Antes - boton inactivo
'text-muted-foreground hover:text-foreground'

// Despues - agregar opacidad reducida
'text-muted-foreground/50 hover:text-muted-foreground'
```

---

## Comparacion Visual

| Estado | Antes | Despues |
|--------|-------|---------|
| Activo | `bg-primary text-primary-foreground` | Sin cambios (color completo) |
| Inactivo | `text-muted-foreground` (~45% contraste) | `text-muted-foreground/50` (~22% contraste) |
| Inactivo + Hover | `text-foreground` | `text-muted-foreground` (sutil mejora) |

---

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/Navbar.tsx` | 4 clases (2 desktop + 2 mobile) |
| `src/components/booking/BookingNavbar.tsx` | 2 clases |

---

## Resultado Esperado

- El idioma activo mantiene su apariencia completa con fondo primario
- El idioma inactivo se ve notablemente mas apagado (50% de opacidad)
- Al hacer hover sobre el inactivo, aumenta ligeramente la visibilidad
- Distincion visual clara e inmediata de cual idioma esta seleccionado

