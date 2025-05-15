const authMiddleware = require('../../../src/middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: 'Bearer token123'
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    
    jwt.verify.mockClear();
  });

  it('should call next() when token is valid', () => {
    // Arrange
    const decodedToken = { id: '123', email: 'user@example.com' };
    jwt.verify.mockReturnValue(decodedToken);
    
    // Act
    authMiddleware.verifyToken(mockReq, mockRes, mockNext);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('token123', expect.any(String));
    expect(mockReq.user).toBe(decodedToken);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should return 401 when token is not provided', () => {
    // Arrange
    mockReq.header.authorization = undefined;
    
    // Act
    authMiddleware.verifyToken(mockReq, mockRes, mockNext);
    
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token no proporcionado'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    // Arrange
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    // Act
    authMiddleware.verifyToken(mockReq, mockRes, mockNext);
    
    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token no valido',
      error: 'Invalid token'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});