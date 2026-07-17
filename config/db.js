const mongoose = require('mongoose');

const conectarBD = async () => {
    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado exitosamente a Atlas");
};

module.exports = conectarBD;