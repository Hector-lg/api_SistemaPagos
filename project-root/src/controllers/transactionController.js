const e = require('express');
const { create } = require('../repositories/userRepository');
const transactionService = require('../services/transactionService');

/**
 * controlador para gestionar las operaciones de transacciones
 * @module TransactionController
 */

const transactionController = {
    /**
     * Crear una nueva transaccion
     * @param {Object} req - Request de la API
     * @param {Object} res - Response de la API
     * @returns {Object} - Respuesta de la API de la transaccion creada
     */
    async createTransaction(req, res) {
        try{
            //obtener userId del usuario autenticado
            const userId = req.user.id;

            //preparar datos de la transaccion
            const transactionData = {
                ...req.body,
                userId
        };
        const transaction = await transactionService.createTransaction(transactionData);

        return res.status(201).json({
            success: true,
            message: 'Transaccion creada con exito',
            data: transaction
        });
    }
         catch (error){
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Errror al crear la transaccion"
            });
        }
    },

    /**
     * Obtener una transaccion por ID
     * @param {Object} req - Request de la API
     * @param {Object} res - Response de la API
     * @returns {Object} - Respuesta de la API de la transaccion encontrada
     */

    async getTransactionById(req, res){
        try{
            const {id} = req.params;
            const transaction = await transactionService.getTransactionById(id);
            if(!transaction){
                return res.status(404).json({
                    success: false,
                    message: 'Transaccion no encontrada'
                });
            }

            //verificar si el usuario autenticado es el propietario de la transaccion
            if(transaction.userId.toString() !== req.user.id){
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a esta transaccion'
                });
            }
            return res.status(200).json({
                success: true,
                data: transaction
            });
        } catch (error){
            return res.status(500).json({
                success: false,
                message: 'Error al obtener la transaccion',
                error: error.message
            });
        }
    },

    /**
     * Actualizar el estado de una transaccion
     * @param {Object} req - Request de la API
     * @param {Object} res - Response de la API
     * @returns {Object} - Respuesta de la API de la transaccion actualizada
     */

    async updateTransactionStatus(req, res){
        try{
            const {id} = req.params;
            const { status } = req.body;

            if(!['pendiente', 'completada', 'fallida'].includes(status)){
                return res.status(400).json({
                    success: false,
                    message: 'Estado de transaccion invalido'
                });
            }
            const updatedTransaction = await transactionService.updateTransactionStatus(id, status);
            if(!updatedTransaction){
                return res.status(404).json({
                    success: false,
                    message: 'Transaccion no encontrada'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Transaccion actualizada con exito',
                data: updatedTransaction
            });
        } catch (error){
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la transaccion',
                error: error.message
            });
        }
    }
};

module.exports = transactionController;