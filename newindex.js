const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Forzar a Node a usar estos servidores DNS (soluciona el error querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Middleware de revisión
const middlewareRevision = (req, res, next) => {
    const horaActual = new Date().toLocaleTimeString('es-CO');

    console.log(
        `[${horaActual}] Petición entrante: ${req.method} a la ruta ${req.originalUrl}`
    );

    next();
};

app.use(middlewareRevision);

// Verificar que la URI se esté leyendo correctamente
console.log("MONGO_URI:", process.env.MONGO_URI);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Conexión exitosa a MongoDB");
    })
    .catch((err) => {
        console.error("❌ No se pudo conectar a MongoDB");
        console.error(err);
    });

// Rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/v1', usuariosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});