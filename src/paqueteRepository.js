// Capa de datos, si necesitamos cambiar de DB, solo se cambiaría este archivo.
const db = require('./db');

function toPublic(doc) {
  return {
    id: doc._id,
    codigo: doc.codigo,
    destinatario: doc.destinatario,
    fechaIngreso: doc.fechaIngreso,
  };
}

async function createPaquete({ codigo, destinatario, fechaIngreso }) {
  const doc = {
    codigo: codigo.trim(),
    destinatario: destinatario.trim(),
    fechaIngreso: fechaIngreso.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const inserted = await db.insert(doc);
    return toPublic(inserted);
  } catch (err) {
    // NeDB unique-constraint violation
    if (err.errorType === 'uniqueViolated') {
      const conflict = new Error(`El codigo "${doc.codigo}" ya existe.`);
      conflict.code = 'CONFLICT';
      throw conflict;
    }
    throw err;
  }
}

async function getAllPaquetes() {
  const docs = await db.find({}).sort({ fechaIngreso: -1 });
  return docs.map(toPublic);
}

module.exports = { createPaquete, getAllPaquetes };
