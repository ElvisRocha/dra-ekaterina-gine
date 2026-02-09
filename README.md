# Clínica Esperanza - Sistema de Reservas

Sistema web de gestión de citas para la Clínica Esperanza de la Dra. Ekaterina Malaspina Riazanova, especialista en Ginecología y Obstetricia.

## Descripción

Plataforma web moderna que permite a las pacientes:
- Explorar servicios ginecológicos y obstétricos
- Agendar citas en línea
- Consultar disponibilidad en tiempo real
- Gestionar su historial médico
- Recibir confirmaciones automáticas

## Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context + TanStack Query

## Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos

1. Clonar el repositorio
```bash
git clone <repo-url>
cd clinica-esperanza
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar servidor de desarrollo
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:8080`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run build:dev` - Build en modo desarrollo
- `npm run preview` - Preview del build de producción
- `npm run lint` - Ejecuta ESLint
- `npm run test` - Ejecuta tests
- `npm run test:watch` - Tests en modo watch

## Estructura del Proyecto

```
clinica-esperanza/
├── public/              # Archivos estáticos (favicons, manifest)
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   │   ├── ui/        # Componentes base (shadcn/ui)
│   │   └── booking/   # Componentes del sistema de reservas
│   ├── contexts/      # React Context providers
│   ├── data/          # Datos estáticos
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilidades
│   ├── pages/         # Páginas principales
│   ├── test/          # Configuración de tests
│   ├── utils/         # Funciones utilitarias
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Entry point
├── index.html         # HTML template
├── vite.config.ts     # Configuración de Vite
├── tailwind.config.ts # Configuración de Tailwind CSS
└── tsconfig.json      # Configuración de TypeScript
```

## Deployment

### Build de producción

```bash
npm run build
```

Los archivos optimizados se generarán en `/dist`.

### Configuración de servidor (SPA)

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Características

- Sistema de reservas multi-paso
- Calendario de disponibilidad
- Gestión de servicios
- Formulario de historial médico
- Diseño responsive
- Multiidioma (ES/EN)

## Licencia

Copyright 2025 Clínica Esperanza. Todos los derechos reservados.

## Desarrollo

Desarrollado por [SmartFlow Automations](https://www.smartflow-automations.com)

## Contacto

- **Email**: info@clinicaesperanza.cr
- **Dirección**: San José, Costa Rica
- **Website**: https://clinicaesperanza.com
