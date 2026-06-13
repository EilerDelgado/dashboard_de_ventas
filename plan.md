# Plan de Mejoras — Streaming Chopper 🎬

> **Regla general**: No se modifica la base de datos de Supabase. Todos los cambios son frontend.  
> Cada fase se ejecuta en un **commit independiente** para llevar control y notar los cambios.

---

## Fase 1 — Limpieza de código residual
**Commit**: `fix: limpieza de código residual y typos`

| # | Tarea | Detalle |
|---|-------|---------|
| 1 | Eliminar carpeta `src/{components` | Carpeta huérfana con llave en el nombre, probablemente un error |
| 2 | Limpiar `App.css` | Contiene estilos del template de Vite (`.hero`, `.counter`, `#next-steps`…) que no se usan |
| 3 | Eliminar `STORAGE_KEY` de `constants.js` | Constante residual de cuando se usaba localStorage, no se usa en ningún lado |
| 4 | Corregir typo `Disney+ Primium` → `Disney+ Premium` | En `constants.js` |
| 5 | Corregir tipo de toast en `deleteSale` y `clearAllSales` | Usan `'error'` (rojo) aunque la operación fue exitosa. Cambiar a `'success'` |

---

## Fase 2 — Fix de profit y await
**Commit**: `fix: enviar profit a Supabase y corregir await en NewSale`

| # | Tarea | Detalle |
|---|-------|---------|
| 6 | Enviar `profit` en `toDB()` | Agregar `profit: data.salePrice - data.purchasePrice` al objeto que se envía a Supabase en insert |
| 7 | Enviar `profit` en `updateSale` | Agregar el cálculo de profit en el payload del `.update()` |
| 8 | Agregar `await` en `NewSale.jsx` | `handleSubmit` llama `addSale(data)` sin `await`, causando que `onAfterSave()` se ejecute antes de confirmar el guardado |

---

## Fase 3 — Arquitectura: Router + Contextos
**Commit**: `refactor: agregar React Router y separar AuthContext`

| # | Tarea | Detalle |
|---|-------|---------|
| 9 | Instalar `react-router-dom` | Reemplazar la navegación por `useState('dashboard')` con rutas reales (`/`, `/ventas`, `/nueva`) |
| 10 | Separar `AuthContext` de `SalesContext` | Crear contexto independiente para `user`, `loading`, `signOut`. El SalesContext actual mezcla auth + CRUD |
| 11 | Usar carpeta `hooks/` | Extraer hooks como `useAuth`, `useFilters`. Actualmente la carpeta está vacía |

---

## Fase 4 — Gestión de estado y protección de formularios
**Commit**: `feat: gestión de estado, guardado local y protección de formularios`

### Objetivo
Evitar la pérdida de información cuando el usuario está diligenciando formularios o navegando dentro de la aplicación.

### Reglas

#### 4.1 No realizar recargas automáticas
- Nunca usar `window.location.reload()`
- Nunca refrescar la página por temporizadores
- Nunca recargar la aplicación cada ciertos minutos

#### 4.2 Mantener el estado del formulario
- Los datos escritos por el usuario deben permanecer mientras navega dentro de la aplicación
- Si ocurre un error de red, los datos del formulario no deben perderse

#### 4.3 Guardado automático local
Implementar guardado automático en `localStorage` para formularios importantes.

Comportamiento esperado:
- Guardar cambios cada 10 segundos
- Guardar cambios cuando el usuario modifique un campo
- Restaurar automáticamente la información si la página se recarga accidentalmente

#### 4.4 Advertencia antes de salir
Si existen cambios sin guardar:
- Mostrar una advertencia antes de cerrar la pestaña
- Mostrar una advertencia antes de abandonar la página

#### 4.5 Actualización manual
Agregar un botón de actualización manual en vistas donde sea necesario:
- Botón "Actualizar datos" o "Recargar información"
- La actualización solicita datos al backend **sin recargar toda la aplicación**

#### 4.6 Manejo de sesión
- La sesión debe permanecer activa mientras exista actividad del usuario
- Cerrar sesión únicamente cuando: el token haya expirado, el usuario presione "Cerrar sesión", o por razones de seguridad del backend

#### 4.7 Experiencia de usuario
Priorizar siempre:
- No perder información escrita
- No recargar pantallas innecesariamente
- Mantener navegación fluida
- Conservar filtros, búsquedas y formularios al cambiar entre módulos

#### Nivel de complejidad
Aplicación SaaS para un único administrador por cuenta. **No implementar**:
- Sincronización en tiempo real
- WebSockets
- Actualizaciones automáticas periódicas
- Sistemas colaborativos multiusuario

---

## Fase 5 — Mejorar Dashboard
**Commit**: `feat: mejorar dashboard con KPIs enriquecidos, tooltips e insights`

### Objetivo
Dashboard limpio, moderno y fácil de leer, mostrando únicamente información que aporte valor para la toma de decisiones. Mantener estética dark mode y la identidad visual morada.

### 5.1 Mejorar tarjetas de métricas (KPIs)

Mantener las 6 tarjetas actuales y agregar **información secundaria** debajo de cada métrica:

| Tarjeta | Dato secundario | Ejemplo |
|---------|-----------------|---------|
| **Ingresos** | Ticket promedio por venta | `$957.900` → `$12.772 por venta` |
| **Ganancias** | Margen de ganancia (%) | `$447.600` → `46.7% margen` |
| **Top Servicio** | % de participación sobre ventas totales | `Netflix` → `53% de las ventas` |
| **Mejor Día** | Cantidad de ventas registradas | `05-29` → `8 ventas` |

### 5.2 Mejorar gráfica principal (Últimos 14 días)

Mantener el diseño SVG actual. Agregar **tooltips interactivos** al pasar el mouse sobre cualquier punto.

El tooltip debe mostrar:
- Fecha
- Ventas
- Ingresos
- Ganancia

Ejemplo:
```
04 Junio
8 ventas
$120.000 ingresos
$58.000 ganancia
```

Los tooltips deben tener el mismo estilo visual oscuro del dashboard.

### 5.3 Mejorar sección "Por servicio"

Mantener las barras actuales. Agregar debajo o al lado del nombre del servicio:
- Porcentaje de participación sobre el total de ventas

Ejemplo:
```
Netflix
40 ventas · 53% del total
$270.100 ingresos
```

No agregar información redundante.

### 5.4 Crear tarjeta de Insights

Agregar una **única tarjeta compacta** debajo de los KPIs.

- **Título**: "Resumen del negocio"
- Generar automáticamente entre **3 y 4 conclusiones** basadas en los datos disponibles
- Diseño minimalista y elegante

Ejemplos:
- 📈 Netflix genera más de la mitad de los ingresos
- 🔥 El 29 de mayo fue el día con más ventas
- 💰 El margen promedio del negocio es del 46.7%
- 🚀 Se registraron 75 ventas durante el período analizado

### Restricciones del Dashboard
- ❌ No agregar más gráficas
- ❌ No agregar gráficos de pastel
- ❌ No agregar tablas grandes
- ❌ No agregar heatmaps
- ❌ No agregar métricas innecesarias
- ❌ No modificar la estructura principal del dashboard
- ✅ Mantener la estética actual dark mode
- ✅ Mantener la identidad visual morada
- ✅ Priorizar claridad y legibilidad
- ✅ El resultado debe parecer un software SaaS profesional

---

## Fase 6 — UX: Paginación, Responsive y Errores
**Commit**: `feat: paginación, responsive mobile y error boundaries`

| # | Tarea | Detalle |
|---|-------|---------|
| 12 | Paginación en tabla de ventas | Agregar paginación client-side (10-25 por página) con controles prev/next |
| 13 | Fix responsive del Sidebar | En mobile: sidebar debe iniciar cerrado. Agregar botón hamburguesa en el Navbar |
| 14 | Error Boundary global | Agregar `ErrorBoundary` de React y estados de error consistentes en las operaciones CRUD |
| 15 | Validación de `.env` amigable | Mostrar un mensaje visual en lugar de `throw new Error(...)` que crashea sin UI |

---

## Fase 7 — Polish final
**Commit**: `feat: loading skeletons, búsqueda global y confirmación de navegación`

| # | Tarea | Detalle |
|---|-------|---------|
| 16 | Loading skeletons | Reemplazar "Cargando..." por skeletons animados en tarjetas del dashboard y tabla |
| 17 | Búsqueda global en Navbar | Buscador rápido que filtre ventas por cualquier campo (servicio, cliente, etc.) |
| 18 | Confirmación al salir de formulario | Si el usuario está llenando un formulario y cambia de página, mostrar advertencia |

---

## Fase 8 — Tests (opcional)
**Commit**: `test: tests unitarios y de integración`

| # | Tarea | Detalle |
|---|-------|---------|
| 19 | Tests unitarios | Tests para `calculations.js` y `exportCSV.js` |
| 20 | Tests de integración | Tests para `SalesContext` con Supabase mockeado |

---

## Resumen de commits

| Commit | Fase | Descripción |
|--------|------|-------------|
| 1 | Fase 1 | `fix: limpieza de código residual y typos` |
| 2 | Fase 2 | `fix: enviar profit a Supabase y corregir await en NewSale` |
| 3 | Fase 3 | `refactor: agregar React Router y separar AuthContext` |
| 4 | Fase 4 | `feat: gestión de estado, guardado local y protección de formularios` |
| 5 | Fase 5 | `feat: mejorar dashboard con KPIs enriquecidos, tooltips e insights` |
| 6 | Fase 6 | `feat: paginación, responsive mobile y error boundaries` |
| 7 | Fase 7 | `feat: loading skeletons, búsqueda global y confirmación de navegación` |
| 8 | Fase 8 | `test: tests unitarios y de integración` |
