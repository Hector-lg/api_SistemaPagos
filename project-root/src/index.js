require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Función para conectar
async function connectToMongoDB() {
  try {
    // Usar URI desde variables de entorno
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('La variable de entorno MONGODB_URI no está definida');
    }
    
    // Conectar Mongoose
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado correctamente');
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  }
}

// Resto del código sin cambios
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('API de Sistema de Pagos');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Iniciar la conexión
connectToMongoDB().catch(console.dir);

module.exports = app;