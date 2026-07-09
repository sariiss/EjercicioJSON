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
// ================GET OBETENER LOS USUARIOS================//
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

// ============ POST - Crear un nuevo usuario============
app.post('/api/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = req.body;

        // Validación de seguridad por si el body llega vacío o no es JSON
        if (!nuevoUsuario || Object.keys(nuevoUsuario).length === 0) {
            return res.status(400).json({
                error: "No se recibieron datos en el cuerpo de la petición. Revisa el Content-Type."
            });
        }

        // Tu validación de campos obligatorios
        if (!nuevoUsuario._id || !nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
            return res.status(400).json({
                error: "Formato inválido: _id, nombre, email y password son obligatorios"
            });
        }

        // CORRECCIÓN: Usamos el modelo 'Usuario' de Mongoose en lugar de la conexión nativa
        const usuarioGuardado = await Usuario.create(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario creado con éxito",
            datosGuardados: usuarioGuardado
        });

    } catch (error) {
        console.error("Error al guardar:", error);

        // Si el error es porque el _id o el email ya existen en la base de datos
        if (error.code === 11000) {
            return res.status(400).json({ error: "El _id o el email ya están registrados" });
        }

        res.status(500).json({ error: "Error crítico al guardar el usuario" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`El backend está escuchando en localhost:${PORT}`);
});