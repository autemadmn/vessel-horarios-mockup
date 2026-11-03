# VESSEL 2.0 · Registro de implementación

Rama `vessel-2.0`, sobre la iteración 04. Sin cambios de stack: sigue siendo un único `index.html` sin dependencias, sin compilación y sin backend.

## Estructura del código

- `index.html` se formateó primero con Prettier (commit independiente, sin cambios funcionales; cálculos y capturas verificados idénticos). El código original estaba minificado en líneas de hasta 4.500 caracteres.
- Los estilos nuevos están en una capa final del `<style>` ("VESSEL 2.0 · Sistema de diseño") que se superpone a las reglas originales, sin reescribirlas.
- Modelo local **v2**: añade `history[]` y el campo opcional `notice.reply`. Los datos guardados en v1 se migran al cargar, sin perder turnos, tarifas ni avisos. Se mantiene la clave `vessel.iter04.v1` para no desconectar a quien ya tenga datos.

## Cambios visuales

- **Tokens**: escala de espaciado de 4 px, radios, elevaciones (`--elev-raised`, `--elev-raised-hover`, `--elev-pressed`, `--elev-sunken`, `--elev-flat`), colores de estado discretos (`--ok`, `--warn`, `--alert`, `--info`) y duraciones y curvas de movimiento.
- **Neomorfismo sutil y con significado**: los elementos pulsables (métricas, tarjetas de turno y de equipo) están elevados y se hunden al pulsarlos. Los paneles informativos (ficha, perfil, total de Cartera) son planos, y los campos, el resumen del día y las horas aparecen hundidos.
- Superficies satinadas con un degradado muy leve y un borde superior iluminado. Botón principal satinado claro.
- Tipografía del sistema (SF, Segoe UI, Roboto) con Arial como alternativa, en lugar de solo Arial. El logotipo no cambia.
- Estados de aviso con un punto de color (pendiente en ámbar, revisado en azul grisáceo, resuelto en verde). Avisos resueltos atenuados.
- Barra inferior con un indicador que se desliza entre pestañas.

## Cambios funcionales

| Pantalla | Cambio |
|---|---|
| Inicio | Aviso "N turnos por revisar", que abre la lista de asignaciones en conflicto; avisos resueltos plegados ("Mostrar resueltos"); motivo del aviso visible; fecha calculada |
| Horarios | Flechas de día anterior/siguiente y "Hoy"; marca de conflicto en cada turno; "+1" en salidas al día siguiente; contador de cambios del borrador; **Copiar del jue XX** (semana anterior); **historial** de la jornada; errores junto a los campos |
| Equipo | Próximo turno de cada persona (solo roles de gestión); filas inactivas atenuadas; motivo breve de la incidencia en el selector |
| Ficha | Avisos abiertos y próximos turnos (con conflictos); **varias excepciones** de disponibilidad con alta y baja individual |
| Cartera | Horas previstas, horas nocturnas y número de turnos; **exportación CSV**; aviso de que los importes no son una nómina; preajuste activo marcado |
| Perfil | **Tus próximos turnos**; la fecha del aviso propone el próximo turno; mensaje sin texto precargado; error junto al campo |
| Avisos | **Respuesta del encargado** (opcional) guardada al revisar o resolver y visible para el trabajador; fechas relativas de envío y resolución; turno asignado ese día |
| Detalle de turno | Reparto tarde/noche; tarifa del turno e importe (solo administración), con una explicación cuando difiere de la tarifa actual |
| Modales | Confirmación al cerrar formularios con cambios; la notificación flotante se retira al abrir un modal |

## Nuevas animaciones

| Interacción | Duración | Técnica |
|---|---|---|
| Pulsación de botones y tarjetas | 100 ms | `transform: scale(.96–.985)` + sombra interior |
| Cambio de pestaña | 180 ms | Opacidad + 6 px vertical (solo el contenido) |
| Indicador de la barra inferior | 220 ms | `translateX` |
| Cambio de día (flechas o calendario) | 180 ms | Deslizamiento de 14 px en la dirección del cambio |
| Selección de día en el calendario | 130 ms | El día se marca antes de cerrar |
| Cambio de mes en el calendario | 170 ms | Deslizamiento de la cuadrícula |
| Hoja inferior (móvil) | 260 ms entrada / 200 ms salida | `translateY(100%)` |
| Diálogo (escritorio) | 220 ms / 180 ms | Opacidad + escala .98 |
| Cambio de contenido dentro de la hoja | 170 ms | Fundido, sin reabrir la hoja |
| Turno añadido o copiado | 220 ms | Aparición con un desplazamiento mínimo |
| Turno retirado | 170 ms | Salida lateral antes de reorganizar |
| Total de Cartera al cambiar de periodo | 320 ms | Recuento numérico; el valor final es siempre el exacto |
| Notificación | 220 ms / 160 ms | Opacidad + 8 px |

Todas usan `transform` y `opacity`. Con `prefers-reduced-motion` se desactivan: la regla CSS global original sigue vigente y las esperas de JavaScript se omiten (`motionOK()`).

## Componentes y funciones modificadas

`nav` (ahora se crea una vez), `render`, `go`, `homeView`, `scheduleView`, `shiftMarkup`, `teamRows`, `detailView`, `walletView`, `profileView`, `openModal`, `closeModal`, `sheet`, `drawModal`, `pickerRows`, `saveDay`, `showToast` y los manejadores de eventos.
Nuevas: `migrate`, `upcomingConflicts`, `conflictShort`, `nextShifts`, `diffDay`, `copyWeek`, `changeDay`, `exportCsv`, `countUp`, `placeIndicator`, `showGuard`, `fieldError`, `hideToast`, `noticeStatus` y utilidades de formato.
Sin cambios: `duration`, `splitHours`, `stats`, `timestamps`, `makeShift`, `conflict`, `available`, `validateShift` y `seed` (salvo la versión y el historial vacío).

## Dependencias incorporadas

Ninguna en la aplicación. Las pruebas (`tests/vessel.test.html`) tampoco tienen dependencias: solo necesitan servir la carpeta por HTTP.

## Control de calidad

**Ejecutado:**
- `tests/vessel.test.html`: **23/23 pruebas superadas** en Chromium (cálculos, tarifas históricas, franja nocturna, migración v1, datos corruptos, borrador, descarte, cambio de día durante la edición, historial, copia de semana, confirmación de conflictos, validación, permisos de trabajador y parcial, avisos, respuesta, confirmación al cerrar, excepciones múltiples, búsqueda de Cartera y CSV).
- **Prueba de mutación**: al romper a propósito la regla de disponibilidad de la copia y la conservación de excepciones, fallaron las dos pruebas correspondientes.
- **Cifras de referencia**: horas, tarde/noche e importes por trabajador, por día y por semana idénticos a los de la iteración 04 (881,5 h · 616,5 h nocturnas · 9.567 € · 124 turnos en noviembre; 2.178 € en la semana del 2 al 8).
- **Capturas** de las seis pantallas y de los flujos nuevos en 320×640, 390×844, 430×932, 768×1024 y 1280×800, sin errores de consola ni desbordamiento horizontal.
- **Animaciones** con movimiento activado y reducido: se aplican las clases correctas, los overlays se eliminan al cerrar y el fondo deja de estar inerte.
- **Rendimiento**: render completo de cada sección entre 3 y 7 ms (Chromium de escritorio).
- **Accesibilidad básica**: todos los controles tienen nombre accesible, el foco queda atrapado dentro de la hoja (25 tabulaciones) y vuelve al botón de origen al cerrar.

**Problemas encontrados y resueltos durante el QA:** desbordamiento del historial a 320 px; próximo turno truncado en Equipo a 320 px (a ≤360 px se oculta la hora); comas dobles en las fechas cortas; notificaciones tapando los modales; zona táctil de 18 px en Cartera; el toast se desplazaba en horizontal al aparecer.

**No verificado:**
- Dispositivos físicos iOS y Android, teclado virtual real ni áreas seguras con muesca (solo emulación de viewport en Chromium).
- Safari y Firefox.
- Lectores de pantalla (VoiceOver, TalkBack, NVDA).
- Rendimiento en móviles de gama baja.
- Contraste medido con herramienta: los colores de texto base no han cambiado respecto a la iteración 04.

## Riesgos conocidos y limitaciones

- **Perfil ya no cabe sin desplazamiento a 390×844** (sobran 138 px) por el bloque "Tus próximos turnos". Inicio, Horarios, Equipo y Cartera siguen cabiendo.
- El historial se guarda en `localStorage` (máximo 300 entradas) y se pierde al restablecer la demo. No hay autoría real: se registra el rol simulado.
- La copia de semana usa la **tarifa actual** de cada trabajador, igual que un alta manual de turno.
- Al abrir un modal se retira la notificación activa, también su "Deshacer".
- `:has()` se usa solo para el estado pulsado de las tarjetas en edición; en navegadores sin soporte, simplemente no se ve ese efecto.
- Sigue siendo un prototipo: los permisos no protegen nada y los datos no se sincronizan entre dispositivos.
