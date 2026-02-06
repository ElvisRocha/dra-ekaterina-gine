
# Plan: Agregar Navegación al Formulario de Primera Vez

## Resumen

Modificar el componente `FirstTimeForm` para incluir un botón "Atrás" que regrese al modal anterior y habilitar el botón de cierre (X) para cerrar el formulario completamente.

---

## Cambios Requeridos

### Archivo: `src/components/FirstTimeForm.tsx`

#### 1. Actualizar Props del Componente

Agregar un nuevo callback `onBack` para manejar el retroceso:

```tsx
interface FirstTimeFormProps {
  isOpen: boolean;
  onComplete: () => void;
  onBack: () => void;        // NUEVO: Para volver al modal anterior
  onClose: () => void;       // NUEVO: Para cerrar el formulario
  initialData: {
    fullName: string;
    idNumber: string;
    phone: string;
  };
}
```

#### 2. Habilitar el Botón X de Cierre

Cambiar el `onOpenChange` del Dialog para que llame a `onClose`:

```tsx
// Antes (línea 134)
<Dialog open={isOpen} onOpenChange={() => {}}>

// Después
<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
```

#### 3. Agregar Botón "Atrás" en la Sección de Botones

Modificar la sección de botones (líneas 392-396) para incluir dos botones con el layout estándar:

```tsx
// Antes
<div className="pt-4 pb-6">
  <Button type="submit" className="w-full btn-gradient">
    <span>{t('form.submit')}</span>
  </Button>
</div>

// Después
<div className="flex gap-3 pt-4 pb-6">
  <Button
    type="button"
    variant="outline"
    onClick={onBack}
    className="flex-1 h-12 rounded-full btn-outline-gradient"
  >
    <span>{t('booking.back')}</span>
  </Button>
  <Button
    type="submit"
    className="flex-1 h-12 rounded-full btn-gradient"
  >
    <span>{t('form.submit')}</span>
  </Button>
</div>
```

---

### Archivo: `src/pages/BookAppointment.tsx`

#### 1. Agregar Handler para "Atrás"

Crear función que cierre el FirstTimeForm y vuelva a mostrar el NewPatientModal:

```tsx
const handleFirstTimeFormBack = () => {
  setShowFirstTimeForm(false);
  setShowNewPatientModal(true);
};
```

#### 2. Agregar Handler para Cerrar

Crear función que simplemente cierre el formulario sin volver al modal:

```tsx
const handleFirstTimeFormClose = () => {
  setShowFirstTimeForm(false);
};
```

#### 3. Actualizar el Uso del Componente

Pasar los nuevos props al FirstTimeForm:

```tsx
// Antes (líneas 263-271)
<FirstTimeForm
  isOpen={showFirstTimeForm}
  onComplete={handleFirstTimeFormComplete}
  initialData={{...}}
/>

// Después
<FirstTimeForm
  isOpen={showFirstTimeForm}
  onComplete={handleFirstTimeFormComplete}
  onBack={handleFirstTimeFormBack}
  onClose={handleFirstTimeFormClose}
  initialData={{...}}
/>
```

---

## Flujo de Navegación Resultante

```text
ConfirmationPopup
       |
       v
NewPatientModal
  |           |
  v           v
"Llenar     "Llenar en
 ahora"      la clínica"
  |               |
  v               v
FirstTimeForm   Toast + Cerrar
  |     |
  v     v
Atrás  Enviar
  |      |
  v      v
Vuelve  Toast + Cerrar
al Modal
```

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/FirstTimeForm.tsx` | Agregar props `onBack` y `onClose`, habilitar botón X, agregar botón "Atrás" |
| `src/pages/BookAppointment.tsx` | Agregar handlers y pasar nuevos props |

---

## Estilos Aplicados

Los botones utilizarán exactamente los mismos estilos que los botones de navegación del flujo de agendamiento:

- **Botón Atrás**: `h-12 rounded-full btn-outline-gradient` (outline con hover gradient)
- **Botón Enviar**: `h-12 rounded-full btn-gradient` (gradient sólido)
- **Layout**: `flex gap-3` con `flex-1` en ambos botones para distribución equitativa
