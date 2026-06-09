/**
 * tests/api.test.js
 * Manual integration tests — runs against the live server.
 * Execute:  node tests/api.test.js
 */

const fetch = require('node-fetch');

const BASE = 'http://localhost:3000/api/paquetes';

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(` CORRECTO ${label}`);
    passed++;
  } else {
    console.error(` ERROR ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

async function post(body) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

async function get() {
  const res = await fetch(BASE);
  const json = await res.json();
  return { status: res.status, body: json };
}

// ──────────────────────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\nPaquetes API — Suite de pruebas\n');

  // ── T1: POST válido → 201 ──────────────────────────────────────────────────
  console.log('T1  POST válido → 201 Created');
  const t1 = await post({ codigo: 'EC-XYZ-0001', destinatario: 'María Pérez', fechaIngreso: '2025-11-01' });
  assert('status 201',             t1.status === 201, `got ${t1.status}`);
  assert('body.codigo correcto',   t1.body.codigo === 'EC-XYZ-0001');
  assert('body.destinatario',      t1.body.destinatario === 'María Pérez');
  assert('body.fechaIngreso',      t1.body.fechaIngreso === '2025-11-01');
  assert('body.id existe',         !!t1.body.id);

  // ── T2: POST duplicado → 409 ──────────────────────────────────────────────
  console.log('\nT2  POST codigo duplicado → 409 Conflict');
  const t2 = await post({ codigo: 'EC-XYZ-0001', destinatario: 'Juan López', fechaIngreso: '2025-11-02' });
  assert('status 409',             t2.status === 409, `got ${t2.status}`);
  assert('error = Conflict',       t2.body.error === 'Conflict');

  // ── T3: POST sin codigo → 400 ─────────────────────────────────────────────
  console.log('\nT3  POST sin campo codigo → 400 Bad Request');
  const t3 = await post({ destinatario: 'Ana Gómez', fechaIngreso: '2025-11-03' });
  assert('status 400',             t3.status === 400, `got ${t3.status}`);
  assert('messages array',         Array.isArray(t3.body.messages));

  // ── T4: POST codigo vacío → 400 ───────────────────────────────────────────
  console.log('\nT4  POST codigo vacío → 400 Bad Request');
  const t4 = await post({ codigo: '   ', destinatario: 'Ana', fechaIngreso: '2025-11-03' });
  assert('status 400',             t4.status === 400);

  // ── T5: POST fecha con formato incorrecto → 400 ───────────────────────────
  console.log('\nT5  POST fechaIngreso con formato inválido → 400');
  const t5 = await post({ codigo: 'EC-001', destinatario: 'Luis', fechaIngreso: '01/11/2025' });
  assert('status 400',             t5.status === 400, `got ${t5.status}`);

  // ── T6: POST fecha inexistente (30 de febrero) → 400 ─────────────────────
  console.log('\nT6  POST fecha calendario inválida (2025-02-30) → 400');
  const t6 = await post({ codigo: 'EC-002', destinatario: 'Luis', fechaIngreso: '2025-02-30' });
  assert('status 400',             t6.status === 400, `got ${t6.status}`);

  // ── T7: POST destinatario > 100 chars → 400 ───────────────────────────────
  console.log('\nT7  POST destinatario > 100 chars → 400');
  const t7 = await post({ codigo: 'EC-003', destinatario: 'A'.repeat(101), fechaIngreso: '2025-11-04' });
  assert('status 400',             t7.status === 400, `got ${t7.status}`);

  // ── T8: POST sin body → 400 ───────────────────────────────────────────────
  console.log('\nT8  POST body vacío → 400');
  const t8 = await post({});
  assert('status 400',             t8.status === 400, `got ${t8.status}`);

  // ── T9: Segundo POST válido ────────────────────────────────────────────────
  console.log('\nT9  POST segundo paquete válido');
  const t9 = await post({ codigo: 'EC-XYZ-0002', destinatario: 'Carlos Ruiz', fechaIngreso: '2025-12-15' });
  assert('status 201',             t9.status === 201, `got ${t9.status}`);

  // ── T10: GET → 200 con lista ──────────────────────────────────────────────
  console.log('\nT10  GET /api/paquetes → 200 OK con lista');
  const t10 = await get();
  assert('status 200',             t10.status === 200, `got ${t10.status}`);
  assert('respuesta es array',     Array.isArray(t10.body));
  assert('contiene ≥ 2 paquetes',  t10.body.length >= 2, `length=${t10.body.length}`);
  const found = t10.body.find(p => p.codigo === 'EC-XYZ-0001');
  assert('EC-XYZ-0001 está en lista', !!found);

  // ── Resumen ───────────────────────────────────────────────────────────────
  console.log(`\n────────────────────────────────`);
  console.log(`  Pasaron: ${passed}  |  Fallaron: ${failed}`);
  console.log(`────────────────────────────────\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Error inesperado al correr los tests:', err.message);
  process.exit(1);
});
