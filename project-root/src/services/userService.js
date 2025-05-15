
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta"; //clave temporal

/** 
 * servicio para gestionar las operaciones de usuario
 * @module userService
 */

const userService = {

    /**
     * Crear un nuevo usuario  
     * @param {Object} userData - Datos del usuario a crear
     * @returns {Promise<Object>} - Usuario creado
     */

    async createUser(userData) {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('El correo electronico ya está en uso');
            error.code = 11000; // error de duplicado
            throw error;
        }

    return await userRepository.create(userData);
    },

    /**
     * Obtiene un usuario por su ID
     * @param {string} userId - ID del usuario a buscar
     * @returns {Promise<Object>|null} - Usuario encontrado
     */
    async getUserById(userId) {
        return await userRepository.findById(userId);
    },

    /**
     * Autentica el usuario y se genera un token JWT
     * @param {string} email - Correo electronico del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<string>} - Token JWT
     */

    async loginUser(email, password){
        const user = await userRepository.findByEmail(email);
        if(!user){
            throw new Error ("Credenciales Invalidad");
        }

        
    const isPasswordValid = await user.comparePassword (password);
        if(!isPasswordValid){
            throw new Error("Credenciales Invalidas");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email},
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        return {
            token, 
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }

};

module.exports = userService;