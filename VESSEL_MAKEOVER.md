# VESSEL · Makeover visual y de UX

Rama `vessel-makeover`, sobre `vessel-2.0`. Sigue siendo un prototipo estático, sin framework, sin compilación y sin backend, y se puede publicar en GitHub Pages.

## 1. Auditoría breve

**Qué impedía un neomorfismo convincente**
- Había tres capas de CSS superpuestas en el `<style>` (unas 2.975 líneas): la iteración 04, los ajustes para "caber sin desplazamiento" y la capa 2.0. Muchas reglas `max-height` reducían textos y tarjetas para que todo entrara en una pantalla.
- Los elementos eran más claros que el fondo y estaban rodeados de bordes. El relieve no se distinguía, y los paneles informativos se parecían demasiado a los botones.
- Inicio tenía cuatro métricas del mismo peso compitiendo entre sí.
- En Horarios, las horas iban en una pastilla pequeña a la derecha.
- Cartera usaba una tabla de tres columnas comprimida.
- Las fotos de prueba iban incrustadas en base64 (unos 35 KB).

**Qué se conserva**
- El motor de cálculo, el borrador con Deshacer, el historial, la copia de la semana anterior, los avisos con respuesta, los permisos por rol y la persistencia local (modelo v2, misma clave).
- Las hojas inferiores, la marca VESSEL, la fecha de referencia y los datos de demostración.

## 2. Sistema de diseño

Los archivos son `css/vessel.css` (tokens `--v-*`, componentes, pantallas y movimiento) y `css/open-props.subset.css`.

| Token | Uso |
|---|---|
| `--v-bg #17181b`, `--v-surface #1d1e22`, `--v-inset #121316` | Grafito. El fondo y los elementos comparten tono, como en SoftUI. |
| `--v-text`, `--v-muted`, `--v-faint` | Contraste 14,8 : 1, 8,1 : 1 y 5,1 : 1 sobre la superficie |
| `--v-accent #8c73c8`, `--v-accent-ink`, `--v-accent-fill` | Morado solo en la pestaña activa, la selección, el foco, el borrador y "+1" |
| `--v-ok`, `--v-alert` | Disponibilidad (✓) y acciones destructivas. Los avisos y conflictos no usan color: se expresan con texto |
| `--v-raised`, `--v-raised-sm`, `--v-pressed`, `--v-sunken` | Relieve: elevado, pulsado y hundido |
| Espacio, tipografía, curvas y radio | Escalas de Open Props asignadas a `--v-*` |

**Regla de relieve**
- **Elevado** significa que se puede pulsar: botones, tarjetas de turno, filas de equipo, avisos, el selector de fecha y el de periodo.
- **Hundido** marca un campo, un valor seleccionado o algo pulsado: buscadores, campos, el resumen del día, la pastilla activa del dock y las horas editables.
- **Plano** es información: grupos de datos de la ficha y del perfil, y la lista de Cartera.

## 3. Cambios por pantalla

| Pantalla | Cambio |
|---|---|
| Dock | Iconos Lucide de 24 px con etiqueta. Una cápsula hundida se desliza hasta la pestaña activa, con una línea morada de 2 px. En escritorio, el dock flota como una pieza elevada. La pestaña Cartera restringida muestra un candado. |
| Inicio | **Cabe en una pantalla, sin desplazamiento**, desde 320 × 568 hasta escritorio. El **encargado** ve la próxima jornada con quién viene y a qué hora entra (dos columnas, hasta seis personas) y un botón grande "Ver horario". El **trabajador** ve su turno en grande. Debajo hay dos fichas, "Turnos por revisar" y "Horas del mes", y los avisos abiertos en filas compactas: se muestran los que caben y "Ver todos" abre la lista completa, con el conmutador de resueltos. En pantallas bajas se compacta automáticamente. |
| Logo e intro | El logo de VESSEL Club se ha redibujado en vectorial a partir de una captura, sin la foto de fondo: `assets/brand/vessel-logo.svg` (completo), `vessel-emblem.svg` y `favicon.svg`. La cabecera de Inicio usa el emblema y la palabra VESSEL. Al abrir la app (una vez por sesión) se reproduce la misma intro que en la carta de Caribbean's Avenue: las tres V se trazan, VESSEL sube letra a letra, CLUB se descubre de izquierda a derecha y, al terminar, un círculo se abre desde el fondo de la copa mientras el emblema y la palabra vuelan a su sitio exacto en la cabecera (unos 1,4 s en total). Con «reducir movimiento», el logo queda quieto y se desvanece. Código en `js/intro.js` y estilos críticos en línea en `index.html`. |
| Horarios | Selector de fecha grande con flechas de 48 px. Tarjetas de turno con el nombre en 17 px y la hora en 17 px debajo, y la tarjeta entera pulsable. En edición, la hora aparece como campo hundido con lápiz y la X de retirar va aparte. Guardar y Cancelar están en una barra fija y grande al pie. |
| Selector de horas | Campo de 26 px con cuatro horas habituales a un toque (entrada de 20:00 a 23:00 y salida de 02:00 a 06:00). La duración se recalcula al momento. |
| Equipo | Directorio con avatar de 48 px, puesto y próximo turno (solo para gestión). La disponibilidad se muestra con icono y día (✓ Jue, ✕ ~~Jue~~, ? Jue) en lugar de puntos de color. En móvil ya no se pagina por debajo de 20 personas. |
| Ficha | Avatar grande, disponibilidad en tres casillas con texto, y grupos planos: avisos, próximos turnos, horas de tarde y noche con icono, tarifa, permisos y salario previsto. |
| Cartera | Selector de periodo destacado y total grande con horas, horas nocturnas y turnos. La tabla pasa a ser una lista de filas con avatar, horas e importe, y cada fila abre la ficha. La nota explica que no incluye cotizaciones ni costes de empresa y que no es una nómina. |
| Perfil | Identidad centrada y grupos de próximos turnos, horas del mes, datos y formulario de aviso. Muestra los mismos datos que antes para el rol de trabajador. |
| Hojas | Cabecera fija con un botón de cierre de 44 px. La acción principal queda fija al final de los formularios largos. Las acciones destructivas (Descartar y Restablecer) se distinguen por color. Hay chips segmentados para el periodo y opciones de rol tipo radio. |

### Ajustes tras la primera revisión

- No hay rallitas de color a la izquierda de ningún bloque.
- Los conflictos y los avisos se dicen con palabras ("Revisar · No disponible los jueves", "Pendiente" en negrita), sin triángulos, pastillas ni puntos naranjas.
- Se han quitado los iconos decorativos (reloj, sol y luna) de filas y tarjetas. Los iconos quedan solo en botones y navegación.

## 4. Recursos externos y licencias

| Recurso | Uso | Licencia |
|---|---|---|
| [SoftUI](https://github.com/siddharth-bhansali/softui) | Recetas de sombra elevada y hundida, y patrones de dock, segmentado, avatar y hoja, reimplementados con tokens propios. No se incluye su CSS (310 KB minificado, con prefijo `sui-`), porque habría obligado a reescribir todo el marcado. | MIT |
| [Open Props](https://github.com/argyleink/open-props) 1.7.23 | Subconjunto local (`css/open-props.subset.css`): tamaños, pesos, interlineado, curvas y radio. Sin colores. | MIT |
| [Lucide](https://github.com/lucide-icons/lucide) 1.68 | Iconos SVG inline, solo en botones y navegación en `index.html` | ISC |
| [DiceBear](https://github.com/dicebear/dicebear) 10.7 + estilo **Lorelei** de Lisa Wischofsky | 24 SVG locales en `assets/avatars/`: 12 trabajadores y 12 de reserva para los nuevos | Core MIT · estilo CC0 1.0 |

**Por qué Lorelei:** se compararon Notionists Neutral, Lorelei, Lorelei Neutral y Open Peeps. Lorelei es línea monocroma (encaja con el negro y grafito) y cada persona tiene un peinado distinto, así que es reconocible sin resultar infantil. Las variantes Neutral son solo caras sobre un círculo blanco, demasiado brillantes en modo oscuro. Open Peeps usa colores saturados aleatorios.

**Avatares:** se generan una sola vez con `tools/generate-avatars.mjs`. La semilla (`vessel-<id>`) no contiene datos personales y no se llama a ninguna API externa. Una foto subida por el administrador tiene prioridad. Un trabajador nuevo recibe un avatar de reserva elegido de forma estable a partir de su identificador.

## 5. Verificación ejecutada

- `tests/vessel.test.html`: **23/23** en Chromium. Solo se cambió un selector: las filas de Cartera ya no son `<tr>`.
- Las cifras de referencia no cambian (881,5 h · 616,5 h nocturnas · 9.567 € · 124 turnos). Lo cubre la prueba "Totales de la demo idénticos".
- Capturas de 20 estados por ancho (Inicio, Horarios, calendario, edición, editar turno, añadir, nuevo turno con incidencia, retirada con Deshacer, descartar, Equipo, ficha, Cartera, periodo, Perfil, aviso, turnos por revisar, opciones, y la vista de trabajador en Inicio, Horarios y Cartera) en **320 × 640, 375 × 812, 390 × 844, 430 × 932 y 1280 × 800**. No hay errores de consola, peticiones fallidas ni desbordamiento horizontal.
- Accesibilidad básica: todos los controles tienen nombre accesible y miden al menos 40 × 40 px. El foco entra en la hoja, sigue dentro tras 25 tabulaciones y vuelve al botón de origen al cerrar. Los colores de texto superan 4,5 : 1.
- Movimiento: cambio de pestaña (190 ms), indicador del dock (240 ms), día (180 ms), hoja (260 ms en móvil, 220 ms en escritorio), mes y cierre. Con `prefers-reduced-motion` todas las duraciones quedan anuladas.
- Microanimaciones: el total de Cartera cuenta de 0 a la cifra en 1,0 s (medido), una vez por sesión, y en 320 ms al cambiar de periodo. El tic de los contadores dura 200 ms y entra desde abajo si la cifra sube y desde arriba si baja. Solo se activa si la cifra ha cambiado en la misma jornada y con el mismo rol. «Guardado ✓» dura 500 ms y, mientras tanto, el pie no admite toques; el guardado ya está hecho antes. Deslizar exige 60 px en horizontal, un gesto más horizontal que vertical y menos de 0,7 s. Ignora los 24 px de cada borde (gestos del sistema) y se desactiva en edición. En Horarios, `touch-action: pan-y pinch-zoom` impide que el navegador lo tome como «página anterior». El avatar viaja en 340 ms y, al volver a Equipo, se recupera el desplazamiento de la lista. Con «reducir movimiento» no hay conteo, tic, espera ni viaje.
- Corregido un fallo de la 2.0: elegir un día en el calendario daba un error y no cambiaba de jornada. Lo cubre la prueba «Elegir un día en el calendario abre esa jornada».

- Intro: el emblema y la palabra aterrizan con un error de 0 px en 390 × 844, 375 × 667 y 1280 × 800, y dura unos 1,4 s. En 320 × 568, donde la cabecera oculta el logo para caber sin desplazamiento, el logo se desvanece. Solo se reproduce una vez por sesión. Las pruebas cargan la app con `?intro=0`.

## 6. Pendiente y limitaciones

- No se ha probado en dispositivos físicos iOS o Android, en Safari o Firefox, ni con lectores de pantalla.
- El render completo de Equipo y Cartera en móvil sube de unos 5 ms a unos 20 ms en Chromium de escritorio, porque se pintan los 12 trabajadores (antes 5 por página) y cada uno lleva su avatar. Se puede reducir si la plantilla crece mucho.
- Inicio no se desplaza; Horarios, Equipo, Cartera y Perfil sí, a propósito, para no reducir textos ni botones. Si una pantalla fuera tan baja que ni lo esencial de Inicio cupiese, se permite desplazar como último recurso.
- El trazo del icono del dock y el color del disco de los avatares (`--v-avatar-bg`) son decisiones estéticas fáciles de ajustar desde los tokens.
- Para cambiar el estilo de avatar basta con editar `tools/generate-avatars.mjs` y volver a generarlos.
