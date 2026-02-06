
# Plan: Envolver el Layout 60-40 en una Card Principal

## Situacion Actual

El layout actual tiene:
- Lista de servicios (acordeón con categorías) - 60%
- Panel de información del servicio - 40%

Ambos componentes están lado a lado usando flexbox, pero **no están contenidos dentro de una card principal**. Son elementos independientes visualmente.

## Objetivo

Crear una **card contenedora principal** que envuelva ambos componentes, manteniendo la distribución 60-40 interna. Esto dará una apariencia más cohesiva y profesional al paso de selección de servicios.

## Cambios Requeridos

### Archivo: `src/components/booking/steps/ServiceStep.tsx`

Envolver el contenedor flex 60-40 dentro de un componente `Card`:

```text
Estructura actual:
+------------------+     +------------------+
|  Services List   |     |  Info Panel      |
|      (60%)       |     |     (40%)        |
+------------------+     +------------------+

Nueva estructura:
+------------------------------------------------+
|              CARD PRINCIPAL                     |
|  +------------------+   +------------------+   |
|  |  Services List   |   |  Info Panel      |   |
|  |      (60%)       |   |     (40%)        |   |
|  +------------------+   +------------------+   |
+------------------------------------------------+
```

**Cambios específicos:**

1. Importar el componente `Card` de shadcn/ui
2. Envolver el div con `className="flex flex-col lg:flex-row gap-6"` dentro de un `Card`
3. Aplicar padding interno al Card
4. Mantener la distribución 60-40 exactamente igual

---

## Detalles Tecnicos

| Cambio | Descripcion |
|--------|-------------|
| Importar Card | `import { Card } from '@/components/ui/card'` |
| Wrapper Card | Envuelve el contenedor flex con `<Card className="p-6">` |
| Mantener flex 60-40 | El div interno sigue siendo `flex flex-col lg:flex-row gap-6` |
| Responsivo | En movil se apila verticalmente, en desktop 60-40 |

---

## Codigo Propuesto

```tsx
import { Card } from '@/components/ui/card';

// ... resto del codigo ...

{/* Card principal contenedora */}
<Card className="p-6">
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Services list - 60% */}
    <div className="w-full lg:w-[60%]">
      {/* Accordion con categorias */}
    </div>

    {/* Service Info Panel - 40% */}
    <div className="w-full lg:w-[40%]">
      {/* Panel de informacion */}
    </div>
  </div>
</Card>
```

---

## Resultado Visual

- Ambos componentes (lista y panel) quedaran visualmente unidos dentro de una card con borde y sombra sutil
- La distribucion 60-40 se mantiene exactamente igual
- El diseno se ve mas cohesivo y profesional
- En movil, los componentes se apilan verticalmente dentro de la misma card
