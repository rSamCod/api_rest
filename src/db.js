const Datastore = require('nedb-promises');
const path = require('path');

// Persistent datastore — file stored at ./data/paquetes.db
const db = Datastore.create({
  filename: path.join(__dirname, '..', 'data', 'paquetes.db'),
  autoload: true,
});

// Enforce unique index on 'codigo' (equivalent to UNIQUE constraint)
db.ensureIndex({ fieldName: 'codigo', unique: true });

module.exports = db;
