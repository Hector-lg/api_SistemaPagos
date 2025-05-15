const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const router = express.Router();

// Rutas que requieren autenticacion
router.use(authMiddleware.verifyToken);

// Crear una nueva transaccion
router.post('/', validationMiddleware.validateTransaction, transactionController.createTransaction);

// Obtener una transaccion por ID
router.get('/:id', transactionController.getTransactionById);

// Actualizar el estado de una transaccion
router.patch('/:id/status', transactionController.updateTransactionStatus);

module.exports = router;