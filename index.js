const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// ================ DNS ================//
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(express.json());

// ================ CACHÉ PARA CONEXIÓN EN VERCEL ================//
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        console.log("✅ Usando conexión existente a MongoDB");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log('🔗 Conectando a MongoDB Atlas...');
        
        const opts = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            maxPoolSize: 1,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
            .then((mongoose) => {
                console.log('✅ Conectado a MongoDB Atlas');
                console.log(`📊 Base de datos: ${mongoose.connection.db.databaseName}`);
                return mongoose;
            })
            .catch(err => {
                console.error('❌ Error al conectar a MongoDB Atlas:');
                console.error(`   ${err.message}`);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

// ================ MIDDLEWARE PARA CONECTAR DB EN CADA REQUEST ================//
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("❌ Error de conexión a DB:", error);
        res.status(503).json({ 
            error: "Servicio no disponible: Error de conexión a la base de datos" 
        });
    }
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

// ================ EXPORTAR PARA VERCEL ================//
module.exports = app;

// ================ INICIAR SERVIDOR (SOLO EN LOCAL) ================//
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
}