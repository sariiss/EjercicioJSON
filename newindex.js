const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const middlewareRevision = (req, res, next) => {
    const horaActual = new Date().toLocaleTimeString('es-CO');

    console.log(
        `[${horaActual}] Petición entrante: ${req.method} a la ruta ${req.originalUrl}`
    );

    next();
};

app.use(middlewareRevision);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexión exitosa, iniciando servidor"))
    .catch(err => console.error("No se pudo conectar", err));

const usuariosRoutes = require('./routes/usuarios');
app.use('/api/v1', usuariosRoutes);

const PORT = process.env.PORT || 27017;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});