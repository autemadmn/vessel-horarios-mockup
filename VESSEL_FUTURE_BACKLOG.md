# VESSEL · Backlog futuro

Nada de esta lista se ha implementado en la iteración 2.0.

## Requiere backend

| Función | Motivo |
|---|---|
| Autenticación y permisos aplicados en servidor | Los roles actuales solo simulan la experiencia |
| Datos compartidos entre dispositivos y usuarios | `localStorage` es local a cada navegador |
| Historial con autoría real e inalterable | Hoy registra el rol simulado y se puede borrar |
| Notificaciones push o por correo de avisos y cambios de turno | Requiere servicio de envío |
| Registro de jornada real (fichaje) y comparación entre horas previstas y reales | Patrón de OpenJornada; necesita registros fiables, idealmente con firma |
| Copias de seguridad y exportación programada | — |

## Integraciones posibles

- Exportación a gestoría o nóminas (CSV/XLSX con un formato acordado). El CSV actual ya separa horas de tarde y de noche.
- Calendario (ICS) con los turnos de cada trabajador.
- Mensajería para avisos urgentes (por ejemplo, ausencia el mismo día).

## Funciones avanzadas aún no justificadas

- **Estado publicado frente a borrador por semana**: los trabajadores verían solo lo publicado. Tiene sentido cuando existan cuentas reales.
- **Vista semanal secundaria** (solo lectura) para revisar la cobertura de jueves a sábado. Nunca debe sustituir al editor diario.
- **Solicitudes formales de ausencia** con aprobación y saldo (Horilla y OpenJornada). Hoy los avisos cubren el caso sin la carga de gestionar saldos.
- **Indicador de "poca gente"** por día según los mínimos por puesto (barra, seguridad, accesos). Requiere definir esos mínimos.
- **Informe PDF** de remuneraciones previstas.
- **Plantillas de jornada** (por ejemplo, "sábado fuerte") además de copiar la semana anterior.
- **Gesto de deslizar para cerrar** en las hojas sin formularios. Se descartó en esta iteración para no arriesgar la pérdida de cambios.

## Descartado en esta iteración

Fichaje con geovalla o reconocimiento facial, SMS, firmas mensuales, informes para la Inspección de Trabajo, centros de trabajo y multiempresa, nóminas con deducciones, activos y gastos, columnas configurables, y aprobaciones en un toque. Los motivos están en `VESSEL_UX_AUDIT.md`, §6 D.

## Recomendaciones para próximas fases

1. Antes del backend, separar `index.html` en módulos (datos, cálculo, vistas y estilos) con un empaquetador ligero. Las pruebas actuales sirven de red de seguridad.
2. Convertir la clave de almacenamiento y el modelo v2 en el contrato inicial de la API: `employees`, `shifts` (con la tarifa congelada), `notices` (con `reply`), `history` y `settings`.
3. Llevar el motor de cálculo (`duration`, `splitHours`, `stats`) a un módulo compartido entre cliente y servidor, con las mismas cifras de referencia como pruebas.
4. Revisar con asesoramiento legal cualquier reutilización futura de código de Horilla (LGPL-2.1) u OpenJornada (AGPL-3.0).
5. Probar en dispositivos reales (iOS Safari y Android Chrome) el teclado virtual, las áreas seguras y el rendimiento de las animaciones.
