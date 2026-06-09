const express = require('express');
const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
const paquetesRouter = require('./routes/paquetes');
app.use('/api/paquetes', paquetesRouter);

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ status: 404, error: 'Not Found', message: 'Ruta no encontrada.' });
});

// ── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
});

module.exports = app;
