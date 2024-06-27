const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const connection = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite');
  }
});

module.exports = connection;
