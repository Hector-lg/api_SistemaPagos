const authMiddleware = require('../middlewares/authMiddleware');
const transactionRepository = require('../repositories/transactionRepository');
const userRepository = require('../repositories/userRepository');


/**
 * Servicio para gestionar las operaciones de transacciones
 * @module TransactionService
 */

const transactionService = {
    /**
     * Crear una nueva transaccion
     * @param {Object} transactionData - Datos de la transaccion
     * @returns {Promise<Object>} - Transaccion creada
     */
    async createTransaction(transactionData) {
        const user = await userRepository.findById(transactionData.userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }

        const isAuthorized = await this.authorizeTransaction(transactionData);

        if (!isAuthorized) {
            const error = new Error('Transaccion no autorizada');
            error.status = 403;
            throw error;
        }

        return await transactionRepository.createTransaction(transactionData);
    },

    /**
     * Autoriza una transaccion
     * @param {Object} transactionData - Datos de la transaccion
     * @returns {Promise<boolean>} - True si la transaccion es autorizada, false en caso contrario
     */

    async authorizeTransaction(transactionData) {

        if(transactionData.amount > 1000) {
            return false; // simular transacciones mayores a 1000 no autorizadas
        }
        return true;
    },

    /**
     * Obtener transacciones por ID
     * @param {string} transactionId - ID de la transaccion
     * @returns {Promise<Object>} - Transaccion encontrada
     */
    async getTransactionById(transactionId){
        return await transactionRepository.findTransactionById(transactionId);
    },

    /**
     * Transacciones por usuario
     * @param {string} userId - ID del usuario
     * @param {Object} options - Opciones de paginacion y ordenamiento
     * @returns {Promise<Array>} - Lista de transacciones
     */

    async getUserTransactions(userId, options) {
    const user = await userRepository.findById(userId);
    if (!user) {
    const error = new Error('Usuario no encontrado');
    error.status = 404;
    throw error;
}
    
    return await transactionRepository.findByUserId(userId, options);
    },

    /**
     * Actualizar el estado de una transaccion
     * @param {string} transactionId - ID de la transaccion
     * @param {string} status - Nuevo estado de la transaccion
     * @returns {Promise<Object>} - Transaccion actualizada
     */
    async updateTransactionStatus(transactionId, status) {
        const transaction = await transactionRepository.findTransactionById(transactionId);
        if (!transaction) {
            const error = new Error('Transaccion no encontrada');
            error.status = 404;
            throw error;
        }

        return await transactionRepository.updateStatus(transactionId, status);
        }
    };
    
module.exports = transactionService;