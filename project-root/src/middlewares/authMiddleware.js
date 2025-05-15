const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

const authMiddleware = {
    verifyToken: (req, res, next) => {
        try{
            const token = req.headers.authorization?.split(" ")[1];

            if(!token){
                return res.status (401).json({
                    success: false,
                    message: "Token no proporcionado"
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        }catch (error){
            return res.status(401).json({
                success: false,
                message: "Token no valido",
                error: error.message
            });
        }
    }
};

module.exports = authMiddleware;