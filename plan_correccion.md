# Plan de Corrección y Mejoras - Streaming Chopper 🎬

Este documento contiene el análisis del error actual que impide registrar ventas, la solución propuesta y una lista de mejoras recomendadas para el proyecto.

---

## 1. Diagnóstico del Error Principal 🔍

El frontend no se comunica correctamente con la base de datos de Supabase al intentar registrar o actualizar una venta. Al simular y depurar las peticiones HTTP al endpoint de Supabase `/rest/v1/sales`, se identificó el siguiente error devuelto por la base de datos:

```json
{
  "code": "428C9",
  "details": "Column \"profit\" is a generated column.",
  "hint": null,
  "message": "cannot insert a non-DEFAULT value into column \"profit\""
}
```

### ¿Por qué ocurre?
En el esquema de la base de datos PostgreSQL en Supabase, la columna `profit` (ganancia) está configurada como una **columna generada** (computed/generated column), lo que significa que la base de datos calcula automáticamente su valor (restando `purchase_price` de `sale_price`).

Sin embargo, en el frontend (`src/context/SalesContext.jsx`), las funciones de inserción y actualización están enviando explitamente el campo `profit` calculado en el cliente:

1. **Al insertar (`toDB`):**
   ```javascript
   const toDB = (data, userId) => ({
     ...
     profit:         data.salePrice - data.purchasePrice, // ❌ Error: PostgreSQL no permite escribir en columnas generadas
     ...
   })
   ```

2. **Al actualizar (`updateSale`):**
   ```javascript
   const updateSale = async (id, data) => {
     const { data: updated, error } = await supabase
       .from('sales')
       .update({
         ...
         profit: data.salePrice - data.purchasePrice, // ❌ Error
         ...
       })
       ...
   }
   ```

Como la base de datos prohíbe la inserción o actualización de valores no establecidos como `DEFAULT` en columnas generadas, la petición es rechazada con un código HTTP `400 Bad Request`, impidiendo el registro y la edición de ventas.

---

## 2. Plan de Acción para la Solución 🛠️

Para solucionar este error, debemos dejar que la base de datos calcule la ganancia por sí misma y omitir el campo `profit` en las peticiones de escritura.

### Paso 1: Modificar `toDB`
En [SalesContext.jsx](file:///C:/Users/Usuario/Documents/Inicio_2026/streaming-dashboard/src/context/SalesContext.jsx#L21-L32), eliminaremos la propiedad `profit` del objeto de base de datos retornado por `toDB`:

```javascript
const toDB = (data, userId) => ({
  service:        data.service,
  account_type:   data.accountType,
  purchase_price: data.purchasePrice,
  sale_price:     data.salePrice,
  // profit:      data.salePrice - data.purchasePrice, // <-- Eliminar
  client_name:    data.clientName,
  payment_method: data.paymentMethod,
  sale_date:      data.date,
  status:         data.status,
  created_by:     userId,
})
```

### Paso 2: Modificar `updateSale`
En [SalesContext.jsx](file:///C:/Users/Usuario/Documents/Inicio_2026/streaming-dashboard/src/context/SalesContext.jsx#L69-L83), eliminaremos el campo `profit` de la carga útil del método `.update()`:

```javascript
  const updateSale = async (id, data) => {
    const { data: updated, error } = await supabase
      .from('sales')
      .update({
        service: data.service, account_type: data.accountType,
        purchase_price: data.purchasePrice, sale_price: data.salePrice,
        // profit: data.salePrice - data.purchasePrice, // <-- Eliminar
        client_name: data.clientName, payment_method: data.paymentMethod,
        sale_date: data.date, status: data.status,
      })
      .eq('id', id).select().single()
    ...
  }
```

---

## 3. Otras Mejoras Identificadas en el Proyecto 📈

Además del error principal, se sugieren las siguientes mejoras para asegurar la robustez y rendimiento del frontend:

### A. Corrección del Estado en Render de `SaleTable.jsx`
En [SaleTable.jsx](file:///C:/Users/Usuario/Documents/Inicio_2026/streaming-dashboard/src/components/sales/SaleTable.jsx#L57-L61), se actualizan variables de estado directamente durante la fase de renderizado:
```javascript
  if (sales.length !== prevSalesLength || rowsPerPage !== prevRowsPerPage) {
    setPrevSalesLength(sales.length)
    setPrevRowsPerPage(rowsPerPage)
    setCurrentPage(1)
  }
```
Esto viola las buenas prácticas de React y puede ocasionar renders innecesarios o bucles infinitos bajo ciertas condiciones. 
* **Solución propuesta:** Manejar este reajuste de paginación mediante un `useEffect` limpio o reaccionar a los cambios de tamaño de datos de manera controlada.

### B. Consola y Registro de Errores de BD
Actualmente, si ocurre un error de base de datos, solo se muestra un Toast general:
```javascript
if (error) showToast('Error al cargar ventas', 'error')
```
* **Solución propuesta:** Agregar `console.error('Error al realizar operación:', error)` en todos los manejadores del `SalesContext.jsx` para que los desarrolladores puedan diagnosticar fallos rápidamente en la consola del navegador.

### C. JSDoc e Indicaciones de Tipos
Para un proyecto que crece rápido, añadir documentación ligera con JSDoc a funciones clave como `toDB`, `fromDB` y las funciones del context ayudará a mantener la claridad del flujo de datos.
