const express = require('express');
const router = express.Router();
const { validatePaquete } = require('../validators');
const { createPaquete, getAllPaquetes } = require('../paqueteRepository');

// POST /api/paquetes  — crear un paquete
router.post('/', async (req, res) => {
  const { codigo, destinatario, fechaIngreso } = req.body;

  // 1. Validate input
  const validation = validatePaquete({ codigo, destinatario, fechaIngreso });
  if (!validation.valid) {
    return res.status(400).json({
      status: 400,
      error: 'Bad Request',
      messages: validation.errors,
    });
  }

  // 2. Persist
  try {
    const paquete = await createPaquete({ codigo, destinatario, fechaIngreso });
    return res.status(201).json(paquete);
  } catch (err) {
    if (err.code === 'CONFLICT') {
      return res.status(409).json({
        status: 409,
        error: 'Conflict',
        message: err.message,
      });
    }
    console.error('Error al crear paquete:', err);
    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Ocurrió un error inesperado.',
    });
  }
});

// GET /api/paquetes  — listar paquetes
router.get('/', async (_req, res) => {
  try {
    const paquetes = await getAllPaquetes();
    return res.status(200).json(paquetes);
  } catch (err) {
    console.error('Error al obtener paquetes:', err);
    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
      message: 'Ocurrió un error inesperado.',
    });
  }
});

module.exports = router;
