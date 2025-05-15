

const validationMiddleware = {
    validateUserCreation: (req, res, next) => {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios"
            });
        }
        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 8 caracteres"
            });
        }

        //validar formato de email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success: false,
                message: "Formato de email inválido"
            });
        }

        next();
    },

    validateTransaction: (req, res, next) => {
        const {amount, currency, description, type} = req.body;

        if(!amount || !description || !currency || !type){
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios"
            });
        }
        if(amount <= 0){
            return res.status(400).json({
                success: false,
                message: "El monto debe ser mayor a 0"
            });
        }

        const validCurrencies = ["USD", "EUR", "MXN"];
        if(!validCurrencies.includes(currency)){
            return res.status(400).json({
                success: false,
                message: "Moneda no válida"
            });
        }

        const validTypes = ["debito", "credito"];
        if(!validTypes.includes(type)){
            return res.status(400).json({
                success: false,
                message: "Tipo de transacción no válido"
            });
    }
    next();
}
};

module.exports = validationMiddleware;