require('dotenv').config();
const { Pool } = require('pg');
const { HOST, USER, PASSWORD, DBNAME } = process.env;

const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    allowExitOnIdle: true
});

db.connect((error, client, done) => {
	if (error) {
		console.log('Se produjo un error al conectarse a la base de datos', error);
	} else {
		console.log('Conexión a la base de datos con éxito');
	}
});

module.exports = db;