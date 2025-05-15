const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/index');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

// Variables globales para pruebas
const testUser = {
  name: 'Test User',
  email: 'integration@test.com',
  password: 'password123'
};
let userId;
let authToken;

// Conectar a la base de datos antes de las pruebas
beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/payment_system_test';
  await mongoose.connect(MONGODB_URI);
});

// Limpiar la base de datos después de cada prueba
afterEach(async () => {
  if (userId) {
    await User.findByIdAndDelete(userId);
  }
});

// Desconectar de la base de datos después de todas las pruebas
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API Endpoints', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      
      userId = response.body.user.id; // Guardar para limpieza
    });
    
    it('should return 409 when email already exists', async () => {
      // Primero crear el usuario
      const user = new User(testUser);
      await user.save();
      userId = user._id;
      
      // Intentar registrar el mismo email
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser)
        .expect(409);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ya esta en uso');
    });
  });
  
  describe('POST /api/users/login', () => {
    it('should login and return token', async () => {
      // Primero crear el usuario
      const user = new User(testUser);
      await user.save();
      userId = user._id;
      
      // Intentar iniciar sesión
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id');
      
      authToken = response.body.data.token;
    });
  });
  
  describe('GET /api/users/:id', () => {
    it('should get user by id when authenticated', async () => {
      // Primero crear el usuario y generar token
      const user = new User(testUser);
      await user.save();
      userId = user._id;
      
      const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";
      authToken = jwt.sign(
        { id: userId, email: testUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // Consultar usuario por ID
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(testUser.email);
    });
    
    it('should return 401 when token is not provided', async () => {
      const response = await request(app)
        .get(`/api/users/anyid`)
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
});