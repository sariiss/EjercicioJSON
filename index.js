const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// ================ DNS ================//
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// ================ MIDDLEWARES ================//
app.use(cors());
app.use(express.json());

// ================ CONEXIÓN A MONGODB ================//
console.log('🔗 Conectando a MongoDB Atlas...');

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    console.log(`📊 Base de datos: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
    console.error('❌ Error al conectar a MongoDB Atlas:');
    console.error(`   ${err.message}`);
});

// ================ RUTAS ================//
const usuarioRoutes = require('./routes/usuarioRoutes');
const cancionesRoutes = require('./routes/cancionesRoutes');
const saludRoutes = require('./routes/salud');

app.use('/api/v1', cancionesRoutes);
app.use('/api/v1', usuarioRoutes);
app.use('/api/v1', saludRoutes);

// ================ RUTA RAÍZ ================//
app.get('/', (req, res) => {
    res.json({
        mensaje: "API de Usuarios y Canciones funcionando 🚀",
        version: "1.0.0",
        endpoints: {
            USUARIOS: {
                GET_ALL: "/api/v1/usuarios",
                GET_ONE: "/api/v1/usuarios/:id",
                POST: "/api/v1/usuarios",
                PUT: "/api/v1/usuarios/:id",
                DELETE: "/api/v1/usuarios/:id"
            },
            CANCIONES: {
                GET_ALL: "/api/v1/canciones",
                GET_ONE: "/api/v1/canciones/:id",
                POST: "/api/v1/canciones",
                PUT: "/api/v1/canciones/:id",
                DELETE: "/api/v1/canciones/:id"
            },
            SALUD: {
                GET: "/api/v1/salud"
            }
        }
    });
});

// ================ INICIAR SERVIDOR ================//
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});