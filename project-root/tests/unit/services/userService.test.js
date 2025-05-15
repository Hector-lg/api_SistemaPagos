const userService = require('../../../src/services/userService');
const userRepository = require('../../../src/repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../src/repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        _id: 'user-123',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);
      
      // Act
      const result = await userService.createUser(userData);
      
      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
    
    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      userRepository.findByEmail.mockResolvedValue({ _id: 'existing-user' });
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow('El correo electronico ya está en uso');
      
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });
  
  describe('getUserById', () => {
    it('should get user by id', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = { _id: userId, name: 'Test User' };
      
      userRepository.findById.mockResolvedValue(mockUser);
      
      // Act
      const result = await userService.getUserById(userId);
      
      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });
  
  describe('loginUser', () => {
    it('should return token for valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      
      const mockUser = {
        _id: 'user-123',
        name: 'Test User',
        email,
        password: 'hashed-password',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-jwt-token');
      
      // Act
      const result = await userService.loginUser(email, password);
      
      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, email: mockUser.email },
        expect.anything(),
        { expiresIn: "24h" }
      );
      
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });
    
    it('should throw error for nonexistent user', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      
      // Act & Assert
      await expect(userService.loginUser('nonexistent@example.com', 'password'))
        .rejects
        .toThrow('Credenciales Invalidad');
    });
    
    it('should throw error for invalid password', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      
      userRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Act & Assert
      await expect(userService.loginUser('test@example.com', 'wrong-password'))
        .rejects
        .toThrow('Credenciales Invalidas');
    });
  });
});