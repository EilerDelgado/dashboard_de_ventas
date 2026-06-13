# Streaming Chopper 🎬

Panel para gestionar la compra y venta de cuentas de streaming. Sin complicaciones, solo registras, filtras y ves cuánto estás ganando.

## Stack

- React + Vite
- TailwindCSS
- Supabase (base de datos + auth)

## Corre el proyecto

```bash
npm install
npm run dev
```

Necesitas un archivo `.env` en la raíz con esto:

```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_clave
```

## Qué hace

- Registra ventas con todos los datos (servicio, cliente, precios, método de pago)
- Calcula la ganancia automáticamente y previene pérdida de datos con guardado automático de borradores
- Filtra por servicio, estado, fecha o cliente, además de búsqueda global en tiempo real
- Dashboard con KPIs enriquecidos (márgenes, ticket promedio), gráficas interactivas con tooltips y resumen de insights
- Tabla de ventas con paginación integrada
- Interfaz completamente responsiva para móviles con menú lateral desplegable
- Control de errores robusto con Error Boundary y validaciones amigables de entorno
- Exporta lo que ves a CSV
- Cada admin solo ve sus propias ventas

## Estructura rápida

```
src/
├── components/   # UI, layout, ventas, dashboard
├── context/      # Estado global + CRUD con Supabase
├── pages/        # Dashboard, Ventas, Nueva venta, Login
└── utils/        # Lógica de negocio, exportación, constantes
```

## Acceso

Los usuarios se crean manualmente desde Supabase en **Authentication → Users → Add user**. No hay registro público.

---

Hecho con React y Supabase.

