

## Internacionalizar la pagina "Acerca de Mi"

Todos los textos de la pagina estan escritos directamente en espanol. Se necesita agregar las traducciones al sistema de idiomas existente (`LanguageContext`) y usar la funcion `t()` o condicionales `language === 'es'` para que respondan al toggle.

### Textos a traducir

**Hero:**
- "Ginecologa y Obstetra" / "Gynecologist and Obstetrician"
- Cita (blockquote) con version en ingles

**Seccion "Mi historia" / "My story":**
- Titulo de seccion
- 4 bloques narrativos (titulos + parrafos) con versiones en ingles

**Seccion "Fuera del consultorio" / "Outside the office":**
- Titulo de seccion
- Parrafo descriptivo
- Labels de hobbies (4 items)

**CTA final:**
- Texto del heading
- Boton (ya funciona)

### Cambios tecnicos

**1. `src/contexts/LanguageContext.tsx`** - Agregar ~25 nuevas claves de traduccion:
- `about.specialty`, `about.quote`
- `about.storyTitle`, `about.story1.title`, `about.story1.p1`, `about.story2.title`, `about.story2.p1`, `about.story2.p2`, `about.story3.title`, `about.story3.p1`, `about.story3.p2`, `about.story4.title`, `about.story4.p1`, `about.story4.p2`, `about.story4.p3`
- `about.outsideTitle`, `about.outsideDesc`
- `about.hobby1` a `about.hobby4`
- `about.ctaHeading`

**2. `src/pages/AboutMe.tsx`** - Reemplazar todos los textos hardcoded:
- Mover los datos de `storyBlocks` y `hobbies` dentro del componente para que puedan usar `t()`
- Reemplazar cada string espanol con llamadas a `t('about.xxx')`
- Mantener la estructura visual y animaciones sin cambios

