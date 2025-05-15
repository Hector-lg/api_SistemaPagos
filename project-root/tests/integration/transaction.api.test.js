const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/index');
const User = require('../../src/models/User');
const Transaction = require('../../src/models/Transaction');
const jwt = require('jsonwebtoken');

// Variables globales para pruebas
let testUser;
let userId;
let authToken;
let transactionId;

// Conectar a la base de datos antes de las pruebas
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb+srv://[tu_usuario]:[tu_contraseña]@[tu-cluster].mongodb.net/payment_system_test?retryWrites=true&w=majority';
  await mongoose.connect(MONGODB_URI);

  // Crear un usuario de prueba
  testUser = new User({
    name: 'Transaction Test User',
    email: 'transaction.test@example.com',
    password: 'password123'
  });
  
  await testUser.save();
  userId = testUser._id;
  
  // Generar token de autenticación
  const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";
  authToken = jwt.sign(
    { id: userId, email: testUser.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
});

// Limpiar después de cada prueba
afterEach(async () => {
  if (transactionId) {
    await Transaction.findByIdAndDelete(transactionId);
    transactionId = null;
  }
});

// Desconectar después de todas las pruebas
afterAll(async () => {
  await User.findByIdAndDelete(userId);
  await mongoose.connection.close();
});

describe('Transaction API Endpoints', () => {
  describe('POST /api/transactions', () => {
    it('should create a new transaction when authorized', async () => {
      const transactionData = {
        amount: 100,
        currency: 'USD',
        description: 'Test Transaction',
        type: 'debito'
      };
      
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.amount).toBe(transactionData.amount);
      expect(response.body.data.status).toBe('pendiente');
      
      transactionId = response.body.data._id;
    });
    
    it('should return 401 when not authenticated', async () => {
      const transactionData = {
        amount: 100,
        currency: 'USD',
        description: 'Test Transaction',
        type: 'debito'
      };
      
      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should return 400 for invalid transaction data', async () => {
      const invalidData = {
        amount: -100, // Invalid amount
        currency: 'USD',
        description: 'Test Transaction',
        type: 'debito'
      };
      
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/transactions/:id', () => {
    it('should get a transaction by id', async () => {
      // Create a test transaction first
      const transaction = new Transaction({
        userId: userId,
        amount: 100,
        currency: 'USD',
        description: 'Test Transaction',
        type: 'debito',
        status: 'pendiente'
      });
      
      await transaction.save();
      transactionId = transaction._id;
      
      const response = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.amount).toBe(100);
    });
    
    it('should return 404 for non-existing transaction', async () => {
      const nonExistingId = mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/transactions/${nonExistingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PATCH /api/transactions/:id/status', () => {
    it('should update transaction status', async () => {
      // Create a test transaction first
      const transaction = new Transaction({
        userId: userId,
        amount: 100,
        currency: 'USD',
        description: 'Status Update Test',
        type: 'debito',
        status: 'pendiente'
      });
      
      await transaction.save();
      transactionId = transaction._id;
      
      const response = await request(app)
        .patch(`/api/transactions/${transactionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completada' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completada');
    });
    
    it('should return 400 for invalid status', async () => {
      // Create a test transaction first
      const transaction = new Transaction({
        userId: userId,
        amount: 100,
        currency: 'USD',
        description: 'Status Invalid Test',
        type: 'debito',
        status: 'pendiente'
      });
      
      await transaction.save();
      transactionId = transaction._id;
      
      const response = await request(app)
        .patch(`/api/transactions/${transactionId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
});