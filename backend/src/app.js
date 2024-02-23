require('./database/config');
const express = require('express');
const routes = require('./routes/index');
const morgan = require('morgan');
const cors = require('cors');
const { authMiddleware } = require('./middlewares/auth');

const app = express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(authMiddleware);

// Handle request
app.use((req, res, next) => {
	const method = req.method;
	const querys = req.query;
	const params = req.params;
	const path = req.originalUrl;
	const currentDate = new Date(Date.now());

	console.log(`
	Today ${currentDate}, \n 
	Method: ${method} \n 
	path: ${path} \n
	`);

	if (Object.keys(querys).length) console.table(querys);

	next();
});

// routes
app.use('/', routes);

// errors
app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).send('Error en el servidor');
});

module.exports = app;