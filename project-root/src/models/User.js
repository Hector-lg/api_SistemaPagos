const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Esquema de usuario para el sistema de pagos
 * @typedef {Object} User
 * @property {string} name - Nombre completo del usuario
 * @property {string} email - Correo electronico (único)
 * @property {string} password - Contraseña (hash)
 * @property {Date} createdAt - Fecha de creacion del usuario
 * @property {Date} updatedAt - Fecha de última actualizacion
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  }
}, { 
  timestamps: true
});

//middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error){
        next(error);
    }
    });

    //metodo para comparar contraseñas
    userSchema.methods.comparePassword = async function(password){
        return await bcrypt.compare(password, this.password);
    };
  
    const User = mongoose.model('User', userSchema);

    module.exports = User;
