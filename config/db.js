const mongoose = require('mongoose');

// ================ CACHÉ PARA VERCEL ================//
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const conectarBD = async () => {
    // Si ya hay conexión activa, usarla
    if (cached.conn) {
        console.log("✅ Usando conexión existente");
        return cached.conn;
    }

    // Si hay una promesa de conexión en curso, esperarla
    if (cached.promise) {
        console.log("⏳ Esperando conexión en curso...");
        await cached.promise;
        return cached.conn;
    }

    // Si no hay conexión, crear una nueva
    try {
        console.log('🔗 Conectando a MongoDB Atlas...');
        
        const opts = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            maxPoolSize: 1, // Importante para serverless
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
        cached.conn = await cached.promise;
        
        console.log('✅ Conectado a MongoDB Atlas');
        console.log(`📊 Base de datos: ${mongoose.connection.db.databaseName}`);
        
        return cached.conn;
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        throw error;
    }
};

module.exports = conectarBD;