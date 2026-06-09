# 📦 Paquetes API

REST API para registrar y consultar paquetes en bodega.

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Base de datos | NeDB (SQLite-like, embebida, sin configuración) |

---

## Instalación

```bash
npm install
npm start
# Servidor en http://localhost:3000
```

Para desarrollo con auto-reload:
```bash
npm run dev   # requiere Node 18+
```

---

## Estructura del proyecto

```
paquetes-api/
├── server.js               # Punto de entrada — inicia el servidor HTTP
├── data/
│   └── paquetes.db         # Base de datos persistente (auto-generada)
├── src/
│   ├── app.js              # Configuración de Express
│   ├── db.js               # Inicialización de la BD y índice único
│   ├── validators.js       # Validaciones de campos
│   ├── paqueteRepository.js# Acceso a datos (capa repository)
│   └── routes/
│       └── paquetes.js     # Handlers de los endpoints
└── tests/
    └── api.test.js         # Suite de integración (19 assertions)
```

---

## Endpoints

### `POST /api/paquetes` — Crear paquete

**Body JSON:**
```json
{
  "codigo": "EC-XYZ-0001",
  "destinatario": "María Pérez",
  "fechaIngreso": "2025-11-01"
}
```

**Respuestas:**

| Código | Situación |
|--------|-----------|
| `201 Created` | Paquete creado exitosamente |
| `400 Bad Request` | Campos faltantes o formato inválido |
| `409 Conflict` | El `codigo` ya existe en la BD |

**Ejemplo 201:**
```json
{
  "id": "abc123",
  "codigo": "EC-XYZ-0001",
  "destinatario": "María Pérez",
  "fechaIngreso": "2025-11-01"
}
```

**Ejemplo 400:**
```json
{
  "status": 400,
  "error": "Bad Request",
  "messages": [
    "El campo \"fechaIngreso\" debe tener formato de fecha válido (YYYY-MM-DD)."
  ]
}
```

**Ejemplo 409:**
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "El codigo \"EC-XYZ-0001\" ya existe."
}
```

---

### `GET /api/paquetes` — Listar paquetes

Retorna todos los paquetes ordenados por `fechaIngreso` descendente.

**Respuesta 200:**
```json
[
  {
    "id": "abc124",
    "codigo": "EC-XYZ-0002",
    "destinatario": "Carlos Ruiz",
    "fechaIngreso": "2025-12-15"
  },
  {
    "id": "abc123",
    "codigo": "EC-XYZ-0001",
    "destinatario": "María Pérez",
    "fechaIngreso": "2025-11-01"
  }
]
```

---

## Validaciones

| Campo | Reglas |
|-------|--------|
| `codigo` | Requerido · no vacío · único · máx. 30 caracteres |
| `destinatario` | Requerido · no vacío · máx. 100 caracteres |
| `fechaIngreso` | Requerido · formato `YYYY-MM-DD` · fecha calendario válida |

---

## Tests

```bash
# Con el servidor corriendo en otra terminal:
npm test
```

La suite cubre 10 casos (19 assertions):
- POST válido → 201
- POST duplicado → 409
- POST campos faltantes → 400
- POST `codigo` vacío → 400
- POST fecha con formato incorrecto (`01/11/2025`) → 400
- POST fecha inexistente (`2025-02-30`) → 400
- POST `destinatario` > 100 chars → 400
- POST body vacío → 400
- GET lista → 200 con array

---

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto del servidor |
