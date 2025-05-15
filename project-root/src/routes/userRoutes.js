const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas publicas
router.post('/register', userController.register);
router.post('/login', userController.login);

//rutas privadas
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.get('/:id/transactions', authMiddleware.verifyToken, userController.getUserTransactions);

module.exports = router;