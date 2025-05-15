const validationMiddleware = require('../../../src/middlewares/validationMiddleware');

describe('Validation Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validateUserCreation', () => {
    it('should call next() for valid user data', () => {
      // Arrange
      mockReq.body = {
        name: 'Test User',
        email: 'valid@example.com',
        password: 'password123'
      };
      
      // Act
      validationMiddleware.validateUserCreation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
    
    it('should return 400 when required fields are missing', () => {
      // Arrange
      mockReq.body = {
        name: 'Test User',
        // email missing
        password: 'password123'
      };
      
      // Act
      validationMiddleware.validateUserCreation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 400 when password is too short', () => {
      // Arrange
      mockReq.body = {
        name: 'Test User',
        email: 'valid@example.com',
        password: 'short'
      };
      
      // Act
      validationMiddleware.validateUserCreation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 400 for invalid email format', () => {
      // Arrange
      mockReq.body = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      };
      
      // Act
      validationMiddleware.validateUserCreation(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Formato de email inválido'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateTransaction', () => {
    it('should call next() for valid transaction data', () => {
      // Arrange
      mockReq.body = {
        amount: 100,
        currency: 'USD',
        description: 'Test payment',
        type: 'debito'
      };
      
      // Act
      validationMiddleware.validateTransaction(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
    
    it('should return 400 when required fields are missing', () => {
      // Arrange
      mockReq.body = {
        amount: 100,
        currency: 'USD',
        // description missing
        type: 'debito'
      };
      
      // Act
      validationMiddleware.validateTransaction(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 400 for negative amount', () => {
      // Arrange
      mockReq.body = {
        amount: -50,
        currency: 'USD',
        description: 'Test payment',
        type: 'debito'
      };
      
      // Act
      validationMiddleware.validateTransaction(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'El monto debe ser mayor a 0'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 400 for invalid currency', () => {
      // Arrange
      mockReq.body = {
        amount: 100,
        currency: 'INVALID',
        description: 'Test payment',
        type: 'debito'
      };
      
      // Act
      validationMiddleware.validateTransaction(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Moneda no válida'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 400 for invalid transaction type', () => {
      // Arrange
      mockReq.body = {
        amount: 100,
        currency: 'USD',
        description: 'Test payment',
        type: 'invalid'
      };
      
      // Act
      validationMiddleware.validateTransaction(mockReq, mockRes, mockNext);
      
      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tipo de transacción no válido'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});