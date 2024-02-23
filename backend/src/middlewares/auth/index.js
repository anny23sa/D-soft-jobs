const db = require('../../database/config');
const { genSalt, hash, compare } = require('bcrypt');
const json = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');

const authMiddleware = (req, res, next) => {
	try {
		expressjwt({
			secret: process.env.JWT_SECRET,
			algorithms: ['HS256'],
		}).unless({
			path: [
				{
					url: '/login',
					methods: ['POST', 'OPTIONS'],
				},
				{
					url: '/register',
					methods: ['POST', 'OPTIONS'],
				},
			],
		})(req, res, next);
	} catch (error) {
		throw new Error(error);
	}
};

const getUser = async (req,res,next) => {
	try {
		const authorization = req.header("Authorization")
		const token = authorization.split("Bearer ")[1]
		json.verify(token, process.env.JWT_SECRET)

		// console.log(json.decode(token))
		const {email} = json.decode(token)
		
		const userExist = await db.query(
			'SELECT * FROM usuarios WHERE email = $1',
			[email]
		);
		if (!userExist.rowCount) {
			res.status(400).send({
				status: 'Bad request',
				msg: 'User does not exist',
			});
		} 
		else {
			const user = userExist.rows[0]
			// console.log(user)
			res.status(200).send({
				status: 'Success',
				msg: 'Usuario obtenido con éxito',
				user: user
			});
		}
	} catch (error) {
		res.status(error.code || 500).send(error)
	}
}

const registerMiddleware = async (req, res, next) => {
	try {
		const { email } = req.body;
		const userExist = await db.query(
			'SELECT * FROM usuarios WHERE email = $1',
			[email]
		);
		if (userExist.rowCount) {
			res.status(400).send({
				status: 'Bad request',
				msg: 'User already exist',
			});
		} else {
			const { password } = req.body;
			genSalt(10, function (err, salt) {
				hash(password, salt, function (err, hash) {
					req.user = {
						...req.body,
						passwordHash: hash,
					};
					next();
				});
			});
		}
	} catch (error) {
		next(error);
	}
};

const loginMiddleware = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const userExist = await db.query(
			'SELECT * FROM usuarios WHERE email = $1',
			[email]
		);

		if (!userExist.rowCount) {
			res.status(400).send({
				status: 'Bad request',
				msg: 'User does not exist',
			});
		} else {
			const { id, email, role } = userExist.rows[0];
			const passwordHash = userExist.rows[0].password;

			const match = await compare(password, passwordHash);
			if (match) {
				const token = json.sign(
					{
						id,
						role,
						email,
					},
					process.env.JWT_SECRET,
					{
						expiresIn: '1h',
					}
				);
				req.token = token;
				next();
			} else {
				res.status(401).send('Credenciales incorrectas');
			}
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	registerMiddleware,
	loginMiddleware,
	authMiddleware,
	getUser
};