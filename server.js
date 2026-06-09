const app = require('./src/app');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Paquetes API corriendo en http://localhost:${PORT}`);
  console.log(`   POST  http://localhost:${PORT}/api/paquetes`);
  console.log(`   GET   http://localhost:${PORT}/api/paquetes`);
});
