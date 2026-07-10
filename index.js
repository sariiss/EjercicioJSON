const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb'); // Importar ObjectId
const Usuario = require('./usuario');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conexion exitosa, iniciando server"))
    .catch(err => console.error("No se pudo conectar", err));

// ================ GET - OBTENER TODOS LOS USUARIOS ================//
app.get('/', async (req, res) => {
    console.log("entrando al endpoint GET");
    try {
        const usuarios = await Usuario.find();
        res.json({
            success: true,
            total: usuarios.length,
            datos: usuarios
        });
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ================ GET - OBTENER USUARIO POR ID ================//
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const usuario = await Usuario.findById(idUsuario);
        
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        res.json({
            success: true,
            datos: usuario
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ error: "Error crítico al obtener el usuario" });
    }
});

// ============ POST - CREAR UN NUEVO USUARIO ============//
app.post('/api/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = req.body;

        if (!nuevoUsuario || Object.keys(nuevoUsuario).length === 0) {
            return res.status(400).json({
                error: "No se recibieron datos en el cuerpo de la petición. Revisa el Content-Type."
            });
        }

        if (!nuevoUsuario._id || !nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
            return res.status(400).json({
                error: "Formato inválido: _id, nombre, email y password son obligatorios"
            });
        }

        const usuarioGuardado = await Usuario.create(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario creado con éxito",
            datosGuardados: usuarioGuardado
        });

    } catch (error) {
        console.error("Error al guardar:", error);

        if (error.code === 11000) {
            return res.status(400).json({ error: "El _id o el email ya están registrados" });
        }

        res.status(500).json({ error: "Error crítico al guardar el usuario" });
    }
});

// ============ PUT - ACTUALIZAR USUARIO (CORREGIDO) ============//
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const idUsuario = req.params.id;
        const datosNuevos = req.body;

        // Eliminar _id si viene en el body (no se puede actualizar)
        delete datosNuevos._id;

        // Verificar que hay datos para actualizar
        if (Object.keys(datosNuevos).length === 0) {
            return res.status(400).json({ 
                error: "No se enviaron datos para actualizar" 
            });
        }

        // CORREGIDO: mongoose (no moongose)
        const resultado = await mongoose.connection.db.collection('usuarios').updateOne(
            { _id: idUsuario },
            { $set: datosNuevos }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ 
                error: "Usuario no encontrado en la base de datos" 
            });
        }

        // Obtener el usuario actualizado
        const usuarioActualizado = await mongoose.connection.db.collection('usuarios').findOne({ _id: idUsuario });

        res.json({
            mensaje: "Usuario actualizado correctamente",
            modificaciones: resultado.modifiedCount,
            datosActualizados: usuarioActualizado
        });

    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(500).json({ 
            error: "No se pudo actualizar el usuario correctamente",
            detalle: error.message
        });
    }
});

// ============ DELETE - ELIMINAR USUARIO (CORREGIDO) ============//
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const idUsuario = req.params.id;

        // CORREGIDO: mongoose (no moongose)
        const resultado = await mongoose.connection.db.collection('usuarios').deleteOne(
            { _id: idUsuario }
        );

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ 
                error: "Usuario no encontrado en la base de datos o ya fue eliminado" 
            });
        }

        res.json({
            mensaje: "Usuario eliminado correctamente",
            id_eliminado: idUsuario
        });

    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ 
            error: "No se pudo eliminar el usuario correctamente",
            detalle: error.message
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   GET  /                          - Ver todos los usuarios`);
    console.log(`   GET  /api/usuarios/:id          - Ver un usuario por ID`);
    console.log(`   POST /api/usuarios              - Crear un nuevo usuario`);
    console.log(`   PUT  /api/usuarios/:id          - Actualizar un usuario`);
    console.log(`   DELETE /api/usuarios/:id        - Eliminar un usuario`);
});