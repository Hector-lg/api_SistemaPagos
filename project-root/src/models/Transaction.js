const mongoose = require('mongoose');

/**
 * Esquema de transaccion para el sistema de pagos
 * 
 * @typedef {Object} Transaction
 * @property {mongoose.Schema.Types.ObjectId} userId - ID del usuario que realiza la transaccion
 * @property {number} amount - Monto de la transaccion
 * @property {string} currency - Moneda de la transaccion 
 * @property {string} description - Descripcion de la transaccion
 * @property {string} status - Estado de la transaccion (pendiente, completada, fallida)
 * @property {string} type - Tipo de transaccion (debito, credito)
 * @property {Date} createdAt - Fecha de creacion de la transaccion
 * * @property {Date} updatedAt - Fecha de ultima actualizacion de la transaccion
 */

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido'],
    },
    amount: {
        type: Number,
        required: [true, 'El monto es requerido'],
        min: [0, 'El monto no puede ser negativo'],
    },
    currency: {
        type: String,
        required: [true, 'La moneda es requerida'],
        enum: ['USD', 'EUR', 'MXN'], // Agregar las monedas soportadas
    },
    description: {
        type: String,
        required: [true, 'La descripcion es requerida'],
    },
    status: {
        type: String,
        enum: ['pendiente', 'completada', 'fallida'],
        default: 'pendiente',
    },
    type: {
        type: String,
        enum: ['debito', 'credito'],
        required: [true, 'El tipo de transaccion es requerido'],
    },
}, {
    timestamps: true,
})


// Indices para mejorar el rendimiento de las consultas
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;