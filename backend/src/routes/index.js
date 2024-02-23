const { registerController, loginController } = require('../controllers');
const { registerMiddleware, loginMiddleware, getUser } = require('../middlewares/auth');
const { registerRequestMiddleware, loginRequestMiddleware } = require('../middlewares/request');

const router = require('express').Router();

router.post('/usuarios', registerRequestMiddleware, registerMiddleware, registerController);

router.post('/login', loginRequestMiddleware, loginMiddleware, loginController);
router.get('/usuarios', getUser);


module.exports = router;