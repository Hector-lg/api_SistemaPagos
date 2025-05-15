# API Sistema de Pagos

API REST para un sistema de pagos que permite registrar usuarios, procesar transacciones y consultar historial de pagos.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [CI/CD](#cicd)
- [Licencia](#licencia)

## Requisitos

- Node.js 14.x o superior
- MongoDB 4.4 o superior
- npm 6.x o superior

## Instalación

1. Clonar el repositorio:
git clone https://github.com/yourusername/api_SistemaPagos.git cd api_SistemaPagos/project-root

2. Instalar dependencias:
npm install

3. Crear archivo `.env` basando en `.env.example`:
cp .env.example .env


4. Editar `.env` con tus configuraciones específicas.

## Configuración

El archivo `.env` debe contener:
PORT=3000 NODE_ENV=development MONGODB_URI=mongodb://localhost:27017/payment_system JWT_SECRET=tu_clave_secreta_aqui


## Uso

### Desarrollo
npm run dev

### Producción
npm start


## Endpoints

### Usuarios

- **Registrar usuario**: `POST /api/users/register`
  ```json
  {
    "name": "Usuario Demo",
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }

- Iniciar sesión: POST /api/users/login
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```
- Obtener usuario por ID: `GET /api/users/:id` (Requiere autenticación)

- Obtener transacciones de usuario: `GET /api/users/:id/transactions?page=1&limit=10` (Requiere autenticación)

Transacciones
- Crear transacción: `POST /api/transactions` (Requiere autenticación)
```json
{
  "amount": 100.50,
  "currency": "USD",
  "description": "Pago de servicio",
  "type": "debito"
}
```
- Obtener transacción por ID: GET /api/transactions/:id (Requiere autenticación)
- Actualizar estado de transacción: PATCH /api/transactions/:id/status (Requiere autenticación)
```json
{
  "status": "completada"
}
```
**Pruebas**
Ejecutar pruebas
```
npm test
```
Ejecutar en modo watch
```
npm run test:watch
```

### Estructura del proyecto
```
 project-root/
├── src/
│   ├── controllers/       # Controladores para manejo de peticiones
│   ├── services/          # Lógica de negocio
│   ├── repositories/      # Acceso a datos
│   ├── middlewares/       # Autenticación y validación
│   ├── models/            # Esquemas de datos
│   ├── routes/            # Definición de rutas
│   └── [index.js](http://_vscodecontentref_/5)           # Punto de entrada
├── tests/
│   ├── unit/              # Pruebas unitarias
│   └── integration/       # Pruebas de integración
├── .github/workflows/     # Configuraciones de CI/CD
├── .env.example           # Variables de entorno de ejemplo
└── [package.json](http://_vscodecontentref_/6)           # Configuración del proyecto
```

**CI/CD**
Este proyecto utiliza GitHub Actions para integración continua y despliegue continuo. El flujo de trabajo:

1. Integración Continua:

    - Ejecuta linting
    - Ejecuta pruebas unitarias e integración
    - Genera informes de cobertura
2. Despliegue Continuo:

    - Se activa automáticamente cuando se fusiona código en la rama principal
    - Despliega la aplicación al entorno configurado

**Licencia**

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.


## 6. Pasos para Probar la API

1. **Instalar dependencias**:
   ```bash
   npm install
    ```

2. **Ejecutar MongoDB localmente**: Asegúrate de que MongoDB esté ejecutándose en tu sistema:
``` bash
# Si tienes MongoDB instalado localmente
mongod
```
