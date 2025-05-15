const User = require('../models/User');

/**
 * Repositorio para las operaciones de usuario
 * @module userRepository
 */

const UserRepository = {
    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @retruns {Promise<Object>} - Usuario creado
     */

    async create(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error){ throw error; }
    },
    /**
     * Busca un usuario por su ID
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object|null>} - Usuario encontrado o null si no se encuentra
     */

    async findById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) { throw error; }
    },

    /**
     * Busca un usario por su correo electronico
     * @param {string} email - Correo electronico del usuario
     * @returns {Promise<Object|null>} - Usuario encontrado o null si no se encuentra
     */

    async findByEmail(email) {
        try {
            return await User.findOne({ email});
        } catch (error) { throw error; }
},
     /**
   * Actualiza un usuario por su ID
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object|null>} Usuario actualizado o null
   */
  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserRepository;