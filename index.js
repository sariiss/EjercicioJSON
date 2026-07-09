const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./usuario');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexion exitosa, iniciando server"))
    .catch(err => console.error("No se pudo conectar", err));

app.get('/', async (req, res) => {
    console.log("entrando al endpoint");
    try {
        const usuarios = await Usuario.find(); // Usamos 'Usuario' directamente con await
        res.json(usuarios);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`El backend está escuchando en localhost:${PORT}`);
});