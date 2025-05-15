const Transaction = require("../models/Transaction");

/**
 * Repositorio para las opperaciones de transacciones
 * @module TransactionRepository
 */

const TransactionRepository = {
    /**
     * Crear una nueva transaccion
     * @param {Object} transactionData - Datos de la transaccion
     * @returns {Promise<Transaction>} - Transaccion creada
     */

    async createTransaction(transactionData) {
        try {
            const transaction = new Transaction(transactionData);
            await transaction.save();
            return transaction;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Buscar transacciones por ID
     * @param {string} transactionId - ID de la transaccion
     * @returns {Promise<Transaction>} - Transaccion encontrada
     */

    async findTransactionById(transactionId){
        try{
            return await Transaction.findById(transactionId);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtiene las transacciones por usuario
     * @param {string} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de transacciones
     */

    async findByUserId(userId, options = {}){
        try{
            const { limit = 10, page = 1, sort = { createdAt: -1 } } = options;
            const skip = (page - 1) * limit;

            return await Transaction.find({ userId })
                .sort(sort)
                .skip(skip)
                .limit(limit);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Actualizar una transaccion o el estado de una transaccion
     * @param {string} transactionId - ID de la transaccion
     * @param {string} status - Nuevo estado de la transaccion
     * @returns {Promise <Object> | null} - Transaccion actualizada o null si no se encuentra
     */

    async updateStatus(transactionId, status){
        try{
            return await Transaction.findByIdAndUpdate(
                transactionId,
                { status },
                { new: true , runValidators: true }
            );
        } catch (error) {
            throw error;
        }
    }
};

module.exports = TransactionRepository;