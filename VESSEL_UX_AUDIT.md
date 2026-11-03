# VESSEL · Auditoría UX/UI comparativa

Fecha: 3 de noviembre de 2026 · Rama: `vessel-2.0` · Base: iteración 04 (`b40a57c`).

## 1. Método

1. Lectura completa del código de la iteración 04 (`index.html`: estilos, lógica y datos en un único archivo, JavaScript sin frameworks).
2. Recorrido automatizado de las seis pantallas en 320, 390, 430, 768 y 1280 px, con capturas antes y después.
3. Antes de modificar nada se midieron las cifras del motor de cálculo (horas, tarde/noche e importes por trabajador, por día y por semana). Tras cada fase se comprobó que siguen siendo idénticas.
4. Estudio del código y la documentación de las cuatro referencias (clonadas el 3/11/2026):

| Repositorio | Tecnología | Licencia |
|---|---|---|
| [horilla/horilla-hr](https://github.com/horilla/horilla-hr) | Django + plantillas HTML | LGPL-2.1 |
| [horilla/horilla-hr-mobile](https://github.com/horilla/horilla-hr-mobile) | Flutter | LGPL-2.1 |
| [openjornada/openjornada-admin](https://github.com/openjornada/openjornada-admin) | Next.js + Tailwind | AGPL-3.0 |
| [openjornada/openjornada-trabajadores](https://github.com/openjornada/openjornada-trabajadores) | React + Vite + Tailwind | AGPL-3.0 |

**Licencias.** No se ha copiado código, estilos ni recursos de ningún repositorio de referencia. Todo lo adoptado son ideas o patrones de interacción, reimplementados desde cero en el código existente de Vessel. Esto es relevante para la comercialización: la AGPL-3.0 obligaría a publicar el código de un servicio derivado, y la LGPL-2.1 impone condiciones a la redistribución de código enlazado o modificado. Si en el futuro se quisiera reutilizar código literal, habría que revisarlo archivo por archivo con asesoramiento legal.

## 2. Funciones originales detectadas (iteración 04)

### Inicio
- Cuatro métricas pulsables: próxima apertura (día y mes), personal asignado o "tus próximos turnos" (trabajador), horas previstas del mes (lleva a Cartera o a Perfil según el permiso) y hora de entrada de la próxima jornada.
- Avisos ordenados por estado (Pendiente → Revisado → Resuelto) y fecha de envío, con contador de pendientes.
- Engranaje de opciones: cambio de rol simulado, franja nocturna (solo administrador) y restablecimiento de la demo.

### Horarios
- Fecha seleccionada con un calendario modal (jueves, viernes y sábado marcados como actividad habitual; punto en los días con turnos).
- Resumen del día: empleados activos, turnos y horas previstas.
- Edición por jornada mediante **borrador**: guardar, cancelar (con confirmación), retirar un turno con **Deshacer** durante 8,5 s, añadir trabajador desde un selector con búsqueda y editar horas.
- Turnos que cruzan medianoche, calculados con marcas de tiempo reales (`startAt`/`endAt`).
- Advertencias de disponibilidad: excepción, aviso abierto (Indisponibilidad, Enfermedad o Cambio de disponibilidad) o día no disponible. Añadir a alguien con advertencia exige marcar una casilla.
- No se puede asignar dos veces a la misma persona en un día. Al intentar salir con el borrador abierto se pide descartar, y el navegador avisa antes de cerrar la página.

### Equipo y ficha
- Lista ordenada con disponibilidad J/V/S (disponible, no disponible, sin información), búsqueda sin acentos, paginación en móvil calculada según la altura de pantalla y cuadrícula de 2 o 3 columnas en escritorio.
- Modo edición (solo administrador): alta y edición con fotografía (JPG, PNG o WebP de menos de 1,5 MB), puesto, tarifa para nuevos turnos, permisos, disponibilidad, una excepción y estado activo. Alejandro no se puede desactivar.
- Ficha: disponibilidad, excepciones, tarifa (visible para administración y para el propio Alejandro), permisos, desglose tarde/noche y salario previsto.

### Cartera
- Total de salarios previstos del periodo, tabla por trabajador (horas e importe), búsqueda que no altera el total general, periodos predefinidos y rango libre validado, y aviso de turnos sin tarifa.
- Incluye a los trabajadores inactivos que tienen horas en el periodo.

### Perfil
- Datos de Alejandro (cuenta de demostración) con tarifa, rol y disponibilidad. Formulario de aviso (fecha, motivo y mensaje de al menos 5 caracteres) y resumen de horas y salario del mes.

### Reglas transversales poco evidentes
- **Cada turno guarda su tarifa al crearse**: cambiar la tarifa de un trabajador solo afecta a los turnos nuevos.
- Las horas nocturnas se cuentan minuto a minuto con la franja configurable (22:00–06:00 por defecto), incluso si la franja no cruza medianoche.
- Los avisos nunca modifican turnos.
- Si el almacenamiento falla, se avisa y no se pierde el estado en memoria. Los datos con una versión distinta o corruptos se sustituyen por la demo.
- Modales con foco atrapado, Escape, fondo inerte y devolución del foco al cerrar; `prefers-reduced-motion` desactiva todas las animaciones.

### Matriz de riesgo

| Elemento | Datos y estado | Riesgo al modificar |
|---|---|---|
| Motor de cálculo (`duration`, `splitHours`, `stats`) | `db.shifts[].rate`, `db.settings` | **Alto**: no se ha tocado |
| Guardado de jornada (`saveDay`) | `draft`, `selectedDate` | **Alto**: solo se añadió el historial |
| Borrador y cambios de fecha | `draft`, `selectedDate`, modal `discard` | **Alto**: protegido con pruebas |
| Permisos simulados | `sessionRole`, `canEdit`, `canMoney` | Medio |
| Persistencia y versión | `localStorage['vessel.iter04.v1']` | **Alto**: migración v1 → v2 |
| Modales y foco | `modal`, `modalOpener` | Medio |
| Paginación móvil | `innerHeight` | Medio |
| Estilos | CSS original | Bajo: capa añadida al final |

## 3. Qué hace bien Vessel (y se ha conservado)

- **Foco en lo esencial**: cinco secciones, edición por jornada y una única tarea por pantalla. Las referencias reparten sus funciones en muchos módulos (OpenJornada admin tiene 35 rutas; Horilla, 37 aplicaciones Django).
- **Borrador antes de guardar**, con confirmación de descarte y Deshacer. En las partes revisadas de las referencias no se encontró un flujo equivalente de planificar una jornada completa y revisarla antes de aplicarla.
- **Tarifas históricas por turno**: es más fiel que recalcular con la tarifa actual.
- **Avisos que no alteran turnos**: separa información de decisión.
- **Identidad visual** oscura y sobria, muy por encima de las plantillas administrativas de las referencias.

## 4. Qué hace mejor Horilla

| Patrón (Horilla) | Dónde aparece | Valor para Vessel |
|---|---|---|
| Bandeja de aprobaciones con advertencias de conflicto **orientativas, no bloqueantes** | `horilla-hr-mobile/.../approvals_screen.dart` | Sacar a la superficie los turnos afectados por avisos |
| "My team": quién está y qué días hay poca gente | `team_screen.dart`, `team_models.dart` | Contexto de próxima jornada en Equipo |
| Pulsación con escala 0,97 / 150 ms; objetivo táctil mínimo de 44 px | `core/theme/tokens.dart` | Retroalimentación táctil y tamaños |
| Deshacer en la notificación durante la ventana visible | `approvals_controller.dart`, `toast.dart` | Vessel ya lo tenía para retirar turnos; se extiende a la copia de semana |
| Comentarios en solicitudes de turno y de tipo de trabajo | `base/models.py` (`ShiftRequestComment`) | Respuesta del encargado al aviso |
| Ficha pública en hoja inferior en lugar de pantalla completa cuando hay pocos datos | `profile_sheet.dart` | Confirma el uso de hojas inferiores en Vessel |

## 5. Qué hace mejor OpenJornada

| Patrón (OpenJornada) | Dónde aparece | Valor para Vessel |
|---|---|---|
| Incidencias con estado y **nota del administrador** visible para el trabajador | `incidents/[id]/page.tsx`, `CreateIncident.tsx` | Respuesta al aviso |
| Errores **bloqueantes frente a avisos** al aprobar | `absences/[id]/page.tsx` | Coherente con la casilla de confirmación de Vessel; aplicado a la copia de semana |
| Registro de modificaciones (original → nuevo, quién y cuándo) | `types/index.ts` (`ModificationEntry`) | Historial de cambios por jornada |
| Totales diarios, semanales y mensuales | `lib/time-record-columns.tsx` | Indicadores de horas, horas nocturnas y turnos en Cartera |
| Exportación CSV/XLSX/PDF | `components/reports/ExportButtons.tsx` | Exportación CSV local |
| El trabajador ve sus solicitudes con su estado | `MyChangeRequests.tsx` | Estado y respuesta visibles en los avisos propios |

## 6. Clasificación de hallazgos

**A · Mejoras de algo que Vessel ya hace (implementadas)**
- Conflictos visibles en las tarjetas de turno, en la ficha y en un aviso de Inicio ("turnos por revisar").
- Estados de aviso con color discreto, avisos resueltos plegados y fecha relativa de envío y resolución.
- Navegación día a día (flechas y "Hoy") sin sustituir el calendario.
- Marca "+1" en las salidas al día siguiente.
- Borrador con contador de cambios sin guardar.
- Errores de validación junto al campo en lugar de en una notificación flotante.
- Varias excepciones de disponibilidad por trabajador (el formulario original solo conservaba la primera).
- Detalle del turno con reparto tarde/noche y tarifa histórica.
- Próximo turno de cada persona en Equipo (solo para quien gestiona horarios) y próximos turnos en la ficha.
- Indicadores de horas, horas nocturnas y turnos en Cartera; periodo activo marcado en todos los preajustes.
- Confirmación al cerrar formularios con cambios (ficha de trabajador y respuesta a un aviso).

**B · Funciones nuevas con valor real (implementadas)**
- Historial de cambios por jornada, registrado al guardar.
- Copiar la jornada de la semana anterior al borrador, sin saltarse las advertencias de disponibilidad.
- Respuesta del encargado al aviso, visible para el trabajador.
- Exportación CSV de la Cartera, generada en el navegador.
- "Tus próximos turnos" en Perfil.

**C · Reservado para más adelante** → ver `VESSEL_FUTURE_BACKLOG.md`.
- Estado publicado frente a borrador a nivel de semana, comparación de horas previstas y reales, informes PDF, vista semanal secundaria y solicitudes formales de ausencia con saldo.

**D · Descartado**
- Fichaje, geovallas, reconocimiento facial y SMS: requieren backend y no encajan con el alcance actual.
- Firmas mensuales e informes para la Inspección de Trabajo: corresponden a un producto de registro horario legal, no a la planificación.
- Centros de trabajo, multiempresa, nóminas con deducciones, activos y gastos: complejidad de RR. HH. ajena al encargado de una discoteca.
- Columnas configurables por usuario (OpenJornada): demasiado para una tabla de tres columnas.
- Aprobar o rechazar avisos en un solo toque con ventana de deshacer (Horilla): en Vessel los avisos no se aprueban, se revisan y se responden.
- Tipografías de marca (Plus Jakarta Sans y JetBrains Mono en Horilla): añadirían descargas o licencias. Se usa la fuente del sistema.

## 7. Errores demostrables corregidos

1. **Excepciones de disponibilidad perdidas**: al guardar la ficha, el formulario solo conservaba la primera. Con dos o más excepciones, las demás se borraban sin aviso.
2. **"Noviembre De 2026"** en el calendario: un `text-transform: capitalize` ponía en mayúscula la preposición.
3. **Parpadeo en los modales**: cada cambio de contenido (por ejemplo, el mes del calendario) volvía a lanzar la animación de apertura.
4. Solo el preajuste "Noviembre" se marcaba como activo en el selector de periodo.
5. Fecha de Inicio escrita como texto fijo; ahora se calcula a partir de la fecha de la demo.
6. Pulsar "Horarios" mientras se editaba esa misma jornada ofrecía descartar el borrador.
7. Las notificaciones podían tapar botones y errores dentro de los modales.
8. Los nombres de la tabla de Cartera solo tenían 18 px de alto como zona táctil.
9. Función `updateTime` sin uso (código muerto).

## 8. Comportamientos conservados aunque sean discutibles

- Perfil siempre muestra a Alejandro, incluso con el rol de encargado: es la cuenta de demostración.
- El mes de Inicio, Ficha y Perfil está fijado en noviembre de 2026.
- En Cartera, el puesto solo se muestra junto al nombre de Ángel, Miriam y Alejandro.
- La disponibilidad habitual se limita a jueves, viernes y sábado.
