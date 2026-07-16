const express = require('express');
const router = express.Router();
const {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    actualizarEstadoReproduccion  // 👈 NUEVA FUNCIÓN
} = require('../controllers/usuarioController');

// ========== RUTAS DE USUARIOS ==========

// Obtener todos los usuarios
router.get('/usuarios', obtenerUsuarios);

// Obtener un usuario por ID
router.get('/usuarios/:id', obtenerUsuarioPorId);

// Crear un nuevo usuario
router.post('/usuarios', crearUsuario);

// Actualizar un usuario
router.put('/usuarios/:id', actualizarUsuario);

// Eliminar un usuario
router.delete('/usuarios/:id', eliminarUsuario);

// 👇 NUEVA RUTA: Actualizar estado de reproducción
router.patch('/actualizar-estado/:id', actualizarEstadoReproduccion);

module.exports = router;