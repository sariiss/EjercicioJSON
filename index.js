const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// ================ DNS ================//
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
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
app.use('/api/v1', usuarioRoutes);

// ================ RUTA RAÍZ ================//
app.get('/', (req, res) => {
    res.json({
        mensaje: "API de Usuarios funcionando",
        endpoints: {
            GET: "/api/v1/usuarios - Ver todos",
            GET: "/api/v1/usuarios/:id - Ver por ID",
            POST: "/api/v1/usuarios - Crear usuario",
            PUT: "/api/v1/usuarios/:id - Actualizar",
            DELETE: "/api/v1/usuarios/:id - Eliminar"
        }
    });
});

// ================ INICIAR SERVIDOR ================//
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});