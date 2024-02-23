const { checkSchema } = require('express-validator');

const registerRequestMiddleware = async (req, res, next) => {
	try {
		const validationSchema = await checkSchema(
			{
				email: {
					notEmpty: {
						errorMessage: 'Field required',
					},
					isEmail: {
						errorMessage: 'Email format is incorrect',
					},
				},
				passworde: {
					notEmpty: {
						errorMessage: 'Field required',
					},
					matches: {
						options:
							/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
						errorMessage:
							'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character from the following: @$!%*?&',
					},
				},
				role: {
					notEmpty: {
						errorMessage: 'Field required',
					},
					isIn: {
						options: ['frontend', 'backend', 'fullstack','Full Stack Developer','Frontend Developer','Backend Developer'],
						errorMessage:
							'The value must be one of the following: frontend, backend, fullstack, Full Stack Developer, Frontend Developer, Backend Developer',
					},
				},
				lenguagee: {
					notEmpty: {
						errorMessage: 'Field required',
					},
					isIn: {
						options: ['javascript', 'ruby', 'Python'],
						errorMessage:
							'The value must be one of the following: javascript, ruby, Python',
					},
				},
			},
			['body']
		).run(req);

		if (validationSchema.length) {
			const validations = {};
			validationSchema.forEach((schema) => {
				const { errors } = schema;
				console.log(errors)
				if (errors.length) {
					errors.forEach((error) => {
						const { path, value, msg } = error;
						switch (path) {
							case 'email':
								if (Array.isArray(validations[path])) {
									validations[path] = [
										...validations[path],
										{
											value,
											msg,
										},
									];
								} else {
									validations[path] = [
										{
											value,
											msg,
										},
									];
								}
								break;
							case 'rol':
								if (Array.isArray(validations[path])) {
									validations[path] = [
										...validations[path],
										{
											value,
											msg,
										},
									];
								} else {
									validations[path] = [
										{
											value,
											msg,
										},
									];
								}
								break;
							case 'password':
								if (Array.isArray(validations[path])) {
									validations[path] = [
										...validations[path],
										{
											value,
											msg,
										},
									];
								} else {
									validations[path] = [
										{
											value,
											msg,
										},
									];
								}
								break;
							case 'lenguage':
								if (Array.isArray(validations[path])) {
									validations[path] = [
										...validations[path],
										{
											value,
											msg,
										},
									];
								} else {
									validations[path] = [
										{
											value,
											msg,
										},
									];
								}
								break;

							default:
								break;
						}
					});
				}
			});

			if (Object.keys(validations).length) {
				res.status(400).send({
					status: 'Bad request',
					errors: validations,
				});
			} else {
				next();
			}
		}
	} catch (error) {
		next(error);
	}
};
const loginRequestMiddleware = async (req, res, next) => {
	try {
		const validationSchema = await checkSchema(
			{
				email: {
					notEmpty: {
						errorMessage: 'Field required',
					},
					isEmail: {
						errorMessage: 'Email format is incorrect',
					},
				},
				password: {
					notEmpty: {
						errorMessage: 'Field required',
					},
				},
			},
			['body']
		).run(req);

		if (validationSchema.length) {
			const validations = {};
			validationSchema.forEach((schema) => {
				const { errors } = schema;
				if (errors.length) {
					errors.forEach((error) => {
						const { path, value, msg } = error;
						switch (path) {
							case 'email':
								if (Array.isArray(validations[path])) {
									validations[path] = [
										...validations[path],
										{
											value,
											msg,
										},
									];
								} else {
									validations[path] = [
										{
											value,
											msg,
										},
									];
								}
								break;

							case 'password':
								validations[path] = [
									{
										value,
										msg,
									},
								];
								break;
							default:
								break;
						}
					});
				}
			});

			if (Object.keys(validations).length) {
				res.status(400).send({
					status: 'Bad request',
					errors: validations,
				});
			} else {
				next();
			}
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	registerRequestMiddleware,
	loginRequestMiddleware,
};