const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('../usuario');

const router = express.Router();

// ================= GET TODOS =================
router.get('/usuarios', async (req, res) => {

    console.log("Entrando al endpoint GET");

    try {

        const usuarios = await Usuario.find();

        res.json({
            success: true,
            total: usuarios.length,
            datos: usuarios
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error interno del servidor"
        });

    }

});

// ================= GET POR ID =================
router.get('/usuarios/:id', async (req, res) => {

    try {

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.json({
            success: true,
            datos: usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error crítico al obtener el usuario"
        });

    }

});

// ================= POST =================
router.post('/usuarios', async (req, res) => {

    try {

        const nuevoUsuario = req.body;

        if (!nuevoUsuario || Object.keys(nuevoUsuario).length === 0) {
            return res.status(400).json({
                error: "No se recibieron datos."
            });
        }

        if (
            !nuevoUsuario._id ||
            !nuevoUsuario.nombre ||
            !nuevoUsuario.email ||
            !nuevoUsuario.password
        ) {
            return res.status(400).json({
                error: "_id, nombre, email y password son obligatorios."
            });
        }

        const usuarioGuardado = await Usuario.create(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario creado con éxito",
            datosGuardados: usuarioGuardado
        });

    } catch (error) {

        console.error(error);

        if (error.code === 11000) {
            return res.status(400).json({
                error: "El _id o el email ya están registrados."
            });
        }

        res.status(500).json({
            error: "Error crítico al guardar el usuario."
        });

    }

});

// ================= PUT =================
router.put('/usuarios/:id', async (req, res) => {

    try {

        const datosNuevos = req.body;

        delete datosNuevos._id;

        if (Object.keys(datosNuevos).length === 0) {
            return res.status(400).json({
                error: "No se enviaron datos para actualizar."
            });
        }

        const resultado = await mongoose.connection.db
            .collection('usuarios')
            .updateOne(
                { _id: req.params.id },
                { $set: datosNuevos }
            );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        const usuarioActualizado = await mongoose.connection.db
            .collection('usuarios')
            .findOne({ _id: req.params.id });

        res.json({
            mensaje: "Usuario actualizado correctamente",
            modificaciones: resultado.modifiedCount,
            datosActualizados: usuarioActualizado
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudo actualizar el usuario.",
            detalle: error.message
        });

    }

});

// ================= PATCH =================
router.patch('/actualizar-estado/:id', async (req, res) => {
    try {
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                error: "Debe enviar el nuevo estado."
            });
        }

        // Validamos que el estado enviado sea uno de los permitidos
        const estadosValidos = ['Reproduciendo', 'Pausado', 'Detenido', 'Finalizado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                error: `Estado inválido. Los valores permitidos son: ${estadosValidos.join(', ')}`
            });
        }

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        // Leemos el estado actual de forma segura y lo comparamos en minúsculas
        const estadoActual = usuario.reproduccion?.estado?.toLowerCase();

        // Regla de negocio: no se puede modificar si ya está finalizado
        if (estadoActual === "finalizado") {
            return res.status(403).json({
                error: "No se puede modificar porque la reproducción ya está finalizada."
            });
        }

        // Si el objeto 'reproduccion' no existe en este usuario, lo creamos vacío primero
        if (!usuario.reproduccion) {
            usuario.reproduccion = {};
        }

        // Actualizamos solo ese campo
        usuario.reproduccion.estado = estado;
        await usuario.save();

        res.json({
            mensaje: "Estado actualizado correctamente.",
            datos: usuario
        });

    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            detalle: error.message
        });
    }
});
// ================= DELETE =================
router.delete('/usuarios/:id', async (req, res) => {

    try {

        const resultado = await mongoose.connection.db
            .collection('usuarios')
            .deleteOne({
                _id: req.params.id
            });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        res.json({
            mensaje: "Usuario eliminado correctamente",
            id_eliminado: req.params.id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "No se pudo eliminar el usuario.",
            detalle: error.message
        });

    }

});

module.exports = router;