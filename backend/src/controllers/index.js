const db = require('../database/config');

const registerController = async (req, res, next) => {
	try {
		const { email, passwordHash, rol, lenguage } = req.user;
		const result = await db.query(
			'INSERT INTO usuarios (email, password, rol, lenguage)  VALUES ($1, $2, $3, $4) RETURNING *',
			[email, passwordHash, rol, lenguage]
		);

		if (result.rowCount) {
			res.status(200).send({
				status: 'Success',
				msg: 'User registered successfully',
			});
		}
	} catch (error) {
		next(error);
	}
};

const loginController = (req, res, next) => {
	try {
		const { token } = req;
		res.status(200).send({
			status: 'Success',
			msg: 'Login successfully',
			token,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	registerController,
	loginController
};