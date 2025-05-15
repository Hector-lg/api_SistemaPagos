//contolador de usuarios

const userService = require('../services/userService');

/**
 * Controlador para gestionar las operaciones de usuario
 * @module userController
 */


const userController = {
    /**
     * Registra un nuevo usuario en el sistema
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     * @returns {Object} Respuesta con el usuario creado
     */

    async register(req, res){
        try{
            const userData = req.body;
            const user = await userService.createUser(userData);

            // no devolver la contraseña en la repuesta
            const userResponse ={
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            };

            return res.status(201).json({
                success: true,
                message: "Usuario creado con exito",
                user: userResponse,
            });

        } catch (error){
            if (error.code === 11000){ //error de duplicado
                return res.status(409).json({
                    success: false,
                    message: 'El correo electronico ya esta en uso'
                });
            }

            return res.status(500).json({
                success: false, 
                message: 'Error al crear el usuario',
                error: error.message
            });
        }
    },

    /**
     * Login de un usuario
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     * @returns {Object} Respuesta con el token de acceso
     */
    async login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    const result = await userService.loginUser(email, password);
    
    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Credenciales inválidas'
    });
  }
},

    async getUserTransactions(req, res) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Verificar que el usuario autenticado accede a sus propias transacciones
    if (id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver estas transacciones'
      });
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };
    
    const transactions = await transactionService.getUserTransactions(id, options);
    
    return res.status(200).json({
      success: true,
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        transactions
      }
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al obtener las transacciones',
    });
  }
},

    

    /** 
     * Obtiene un usaruio por su ID
     * @param {Object} req - Objeto de solicitud Express
     * @param {Object} res - Objeto de respuesta Express
     * @returns {Object} Respuesta con el usuario encontrado
     */

    async getUserById(req, res){
    try {
        const {id} = req.params;
        const user = await userService.getUserById(id);
        
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        //no devolver la contraseña en la respuesta
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            data: userResponse
        });
    } catch (error){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario',
            error: error.message
            });
        }
    }

    


}


module.exports = userController;