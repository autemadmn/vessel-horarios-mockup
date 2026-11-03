# VESSEL · Horarios y equipo

Mockup interactivo de una aplicación para gestionar los horarios y el equipo de una discoteca. Identidad **Satin Graphite — Quiet Industrial Luxury**. Esta es la versión **2.0**, una evolución de la iteración 04 con neomorfismo oscuro más coherente, microanimaciones y mejoras funcionales.

![Vista previa de VESSEL](preview.png)

## Abrir el prototipo

Descarga este repositorio y abre **index.html** en un navegador moderno. El HTML incluye estilos, lógica e imágenes: no necesita instalación, compilación ni conexión a Internet.

Para servirlo localmente, también puedes ejecutar desde esta carpeta:

```sh
python -m http.server 8000
```

Abre después `http://localhost:8000`.

## Funciones del mockup

- Cinco secciones: Inicio, Horarios, Equipo, Cartera y Perfil; ficha individual secundaria.
- Calendario, navegación día a día y edición de jornadas con borrador, contador de cambios, guardado, cancelación y retirada reversible.
- Copia de la jornada de la semana anterior, sin saltarse las advertencias de disponibilidad.
- Historial de cambios de cada jornada.
- Asignación de empleados con advertencias de indisponibilidad; turnos en conflicto señalados en Inicio, Horarios y la ficha.
- Cálculo de turnos nocturnos, tarifas conservadas por turno y sincronización de horas y remuneraciones previstas.
- Directorio, tarifas, disponibilidad con varias excepciones y gestión de trabajadores.
- Cartera con búsqueda, selección de periodo, indicadores de horas y exportación CSV; el filtro de búsqueda conserva el total general.
- Envío y revisión de avisos, con respuesta del encargado, sin modificar automáticamente los horarios.
- Perfil con los próximos turnos del trabajador.
- Diseño adaptativo a pantalla completa; paginación móvil para Equipo y Cartera; animaciones que respetan `prefers-reduced-motion`.
- Persistencia en el almacenamiento local del navegador (los datos de la iteración 04 se migran automáticamente).

El engranaje de Inicio permite cambiar entre los roles de demostración y restablecer los datos. La fecha de referencia de la demo es el **5 de noviembre de 2026**.

## Pruebas

Con la carpeta servida (ver arriba), abre `http://localhost:8000/tests/vessel.test.html`. La batería comprueba cálculos, tarifas históricas, migración de datos, borradores, historial, copia de semana, permisos, avisos y Cartera. Restaura tus datos locales al terminar.

## Documentación

- [`VESSEL_UX_AUDIT.md`](VESSEL_UX_AUDIT.md): auditoría de la iteración 04 y comparación con Horilla HR y OpenJornada.
- [`VESSEL_UI_CHANGELOG.md`](VESSEL_UI_CHANGELOG.md): cambios, animaciones, QA y limitaciones.
- [`VESSEL_FUTURE_BACKLOG.md`](VESSEL_FUTURE_BACKLOG.md): lo que queda para fases posteriores.

## Alcance

Este repositorio contiene un **prototipo frontend con datos sintéticos**. Los roles simulan la experiencia de uso; no existe autenticación ni autorización de servidor. Los datos se conservan en cada navegador y no se sincronizan entre dispositivos. Las cantidades son remuneraciones previstas, no nóminas ni costes empresariales completos.

Para una aplicación de producción se requiere backend, autenticación, permisos aplicados en servidor y almacenamiento compartido.

## Verificación realizada

Versión 2.0: 23 pruebas de regresión superadas; cifras del motor de cálculo idénticas a las de la iteración 04; capturas en 320, 390, 430, 768 y 1280 px sin desbordamientos ni errores de consola. En 390 × 844, Inicio, Horarios, Equipo y Cartera caben sin desplazamiento; Perfil necesita desplazarse por el bloque de próximos turnos. El detalle está en `VESSEL_UI_CHANGELOG.md`.
