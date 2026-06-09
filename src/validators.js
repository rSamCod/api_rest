// Verificaciones de la carga útil con su respectiva respuesta
function validatePaquete({ codigo, destinatario, fechaIngreso }) {
  const errors = [];

  // --- codigo ---
  if (codigo === undefined || codigo === null) {
    errors.push('El campo "codigo" es requerido.');
  } else if (typeof codigo !== 'string' || codigo.trim() === '') {
    errors.push('El campo "codigo" no puede estar vacío.');
  } else if (codigo.trim().length > 30) {
    errors.push('El campo "codigo" no puede superar los 30 caracteres.');
  }

  // --- destinatario ---
  if (destinatario === undefined || destinatario === null) {
    errors.push('El campo "destinatario" es requerido.');
  } else if (typeof destinatario !== 'string' || destinatario.trim() === '') {
    errors.push('El campo "destinatario" no puede estar vacío.');
  } else if (destinatario.trim().length > 100) {
    errors.push('El campo "destinatario" no puede superar los 100 caracteres.');
  }

  // --- fechaIngreso ---
  if (fechaIngreso === undefined || fechaIngreso === null) {
    errors.push('El campo "fechaIngreso" es requerido.');
  } else if (!isValidDate(fechaIngreso)) {
    errors.push(
      'El campo "fechaIngreso" debe tener formato de fecha válido (YYYY-MM-DD).'
    );
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

function isValidDate(value) {
  if (typeof value !== 'string') return false;

  // Verifica el formato YYYY-MM-DD
  const ISO_DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!ISO_DATE_RE.test(value)) return false;

  // Verifica la fecha del calendario
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

module.exports = { validatePaquete };
