const userService = require('../../../src/services/userService');
const userRepository = require('../../../src/repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the dependencies
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
      const mockUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const mockCreatedUser = {
        _id: '60d21b4667d0d8992e610c85',
        ...mockUserData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockCreatedUser);
      
      // Act
      const result = await userService.createUser(mockUserData);
      
      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(userRepository.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw an error if email already exists', async () => {
      // Arrange
      const mockUserData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      userRepository.findByEmail.mockResolvedValue({ 
        _id: '60d21b4667d0d8992e610c85',
        email: mockUserData.email 
      });
      
      // Act & Assert
      await expect(userService.createUser(mockUserData))
        .rejects
        .toThrow('El correo electronico ya está en uso');
      
      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });
  
  describe('loginUser', () => {
    it('should return a token when credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      
      const mockUser = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Test User',
        email,
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      
      const mockToken = 'mock.jwt.token';
      
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);
      
      // Act
      const result = await userService.loginUser(email, password);
      
      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });
    
    it('should throw error when user is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';
      
      userRepository.findByEmail.mockResolvedValue(null);
      
      // Act & Assert
      await expect(userService.loginUser(email, password))
        .rejects
        .toThrow('Credenciales Invalidad');
      
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});