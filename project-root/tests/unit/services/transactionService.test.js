const transactionService = require('../../../src/services/transactionService');
const transactionRepository = require('../../../src/repositories/transactionRepository');
const userRepository = require('../../../src/repositories/userRepository');

// Mock dependencies
jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/repositories/userRepository');

describe('Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createTransaction', () => {
    it('should create transaction successfully when authorized', async () => {
      // Arrange
      const transactionData = {
        userId: 'user-123',
        amount: 100,
        currency: 'USD',
        description: 'Test payment',
        type: 'debito'
      };
      
      const mockUser = { _id: 'user-123', name: 'Test User' };
      const mockCreatedTransaction = {
        id: 'txn-123',
        ...transactionData,
        status: 'pendiente',
        createdAt: new Date()
      };
      
      userRepository.findById.mockResolvedValue(mockUser);
      transactionRepository.createTransaction.mockResolvedValue(mockCreatedTransaction);
      
      // Mock the authorizeTransaction method
      const authorizeSpy = jest.spyOn(transactionService, 'authorizeTransaction')
        .mockResolvedValue(true);
      
      // Act
      const result = await transactionService.createTransaction(transactionData);
      
      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(transactionData.userId);
      expect(authorizeSpy).toHaveBeenCalledWith(transactionData);
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(transactionData);
      expect(result).toEqual(mockCreatedTransaction);
      
      // Clean up
      authorizeSpy.mockRestore();
    });
    
    it('should throw error when user not found', async () => {
      // Arrange
      const transactionData = {
        userId: 'nonexistent-user',
        amount: 100
      };
      
      userRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(transactionService.createTransaction(transactionData))
        .rejects
        .toThrow('Usuario no encontrado');
    });
    
    it('should throw error when transaction not authorized', async () => {
      // Arrange
      const transactionData = {
        userId: 'user-123',
        amount: 2000, // Amount exceeds limit
        currency: 'USD',
        description: 'Test payment',
        type: 'debito'
      };
      
      userRepository.findById.mockResolvedValue({ _id: 'user-123' });
      
      // Mock the authorizeTransaction method
      const authorizeSpy = jest.spyOn(transactionService, 'authorizeTransaction')
        .mockResolvedValue(false);
      
      // Act & Assert
      await expect(transactionService.createTransaction(transactionData))
        .rejects
        .toThrow('Transaccion no autorizada');
      
      // Clean up
      authorizeSpy.mockRestore();
    });
  });
  
  describe('authorizeTransaction', () => {
    it('should authorize transaction with amount <= 1000', async () => {
      // Arrange
      const transactionData = { amount: 500 };
      
      // Act
      const result = await transactionService.authorizeTransaction(transactionData);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should not authorize transaction with amount > 1000', async () => {
      // Arrange
      const transactionData = { amount: 1500 };
      
      // Act
      const result = await transactionService.authorizeTransaction(transactionData);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('getUserTransactions', () => {
    it('should get user transactions', async () => {
      // Arrange
      const userId = 'user-123';
      const options = { page: 1, limit: 10 };
      
      const mockUser = { _id: userId };
      const mockTransactions = [
        { id: 'txn-1', amount: 100 },
        { id: 'txn-2', amount: 200 }
      ];
      
      userRepository.findById.mockResolvedValue(mockUser);
      transactionRepository.findByUserId.mockResolvedValue(mockTransactions);
      
      // Act
      const result = await transactionService.getUserTransactions(userId, options);
      
      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(transactionRepository.findByUserId).toHaveBeenCalledWith(userId, options);
      expect(result).toEqual(mockTransactions);
    });
    
    it('should throw error when user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(transactionService.getUserTransactions('nonexistent-user'))
        .rejects
        .toThrow('Usuario no encontrado');
    });
  });
  
  describe('updateTransactionStatus', () => {
    it('should update transaction status', async () => {
      // Arrange
      const transactionId = 'txn-123';
      const status = 'completada';
      
      const mockTransaction = { id: transactionId, status: 'pendiente' };
      const mockUpdatedTransaction = { id: transactionId, status };
      
      transactionRepository.findTransactionById.mockResolvedValue(mockTransaction);
      transactionRepository.updateStatus.mockResolvedValue(mockUpdatedTransaction);
      
      // Act
      const result = await transactionService.updateTransactionStatus(transactionId, status);
      
      // Assert
      expect(transactionRepository.findTransactionById).toHaveBeenCalledWith(transactionId);
      expect(transactionRepository.updateStatus).toHaveBeenCalledWith(transactionId, status);
      expect(result).toEqual(mockUpdatedTransaction);
    });
    
    it('should throw error when transaction not found', async () => {
      // Arrange
      transactionRepository.findTransactionById.mockResolvedValue(null);
      
      // Act & Assert
      await expect(transactionService.updateTransactionStatus('nonexistent-id', 'completada'))
        .rejects
        .toThrow('Transaccion no encontrada');
    });
  });
});