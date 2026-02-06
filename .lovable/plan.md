
# Plan: Aplicar Hover Gradient a Botones de Retroceso

## Resumen

Crear una nueva clase CSS para los botones de retroceso que mantenga su apariencia outline en estado normal, pero aplique el mismo efecto de hover gradient que tienen los botones "Siguiente".

---

## Botones de Retroceso Identificados

| Componente | Linea | Texto del Boton |
|------------|-------|-----------------|
| PatientDataStep.tsx | 87-93 | "Atras" |
| DateTimeStep.tsx | 109-115 | "Atras" |
| ConfirmStep.tsx | 133-140 | "Atras" |

---

## Solucion

### Paso 1: Crear Nueva Clase CSS

Agregar en `src/index.css` una nueva clase `btn-outline-gradient` que:
- Mantenga el estilo outline en estado normal (borde visible, fondo transparente)
- En hover, aplique el gradiente y colores del `btn-gradient`

**Archivo:** `src/index.css`

```css
/* Boton outline con hover gradient - para botones de retroceso */
.btn-outline-gradient {
  @apply relative overflow-hidden font-medium transition-all duration-300;
  @apply bg-transparent border border-primary text-primary;
}

.btn-outline-gradient:hover {
  @apply text-white border-transparent;
  background: var(--gradient-cta);
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}

.btn-outline-gradient::before {
  content: '';
  @apply absolute inset-0 opacity-0 transition-opacity duration-300;
  background: linear-gradient(135deg, hsl(var(--fuchsia)) 0%, hsl(var(--coral)) 100%);
}

.btn-outline-gradient:hover::before {
  @apply opacity-100;
}

.btn-outline-gradient > * {
  @apply relative z-10;
}
```

---

### Paso 2: Aplicar a Botones de Retroceso

Cambiar las clases de los 3 botones "Atras":

**PatientDataStep.tsx (linea 87-93):**
```tsx
// Antes
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full"
>

// Despues
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full btn-outline-gradient"
>
```

**DateTimeStep.tsx (linea 109-115):**
```tsx
// Antes
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full"
>

// Despues
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full btn-outline-gradient"
>
```

**ConfirmStep.tsx (linea 133-140):**
```tsx
// Antes
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full"
  disabled={isLoading}
>

// Despues
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full btn-outline-gradient"
  disabled={isLoading}
>
```

---

## Resultado Visual

| Estado | Boton Retroceso | Boton Siguiente |
|--------|-----------------|-----------------|
| Normal | Borde magenta, fondo transparente, texto magenta | Fondo gradiente, texto blanco |
| Hover | Fondo gradiente, texto blanco (igual que Siguiente) | Fondo gradiente animado, texto blanco |

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| src/index.css | Agregar clase `.btn-outline-gradient` |
| src/components/booking/steps/PatientDataStep.tsx | Agregar clase al boton "Atras" |
| src/components/booking/steps/DateTimeStep.tsx | Agregar clase al boton "Atras" |
| src/components/booking/steps/ConfirmStep.tsx | Agregar clase al boton "Atras" |
