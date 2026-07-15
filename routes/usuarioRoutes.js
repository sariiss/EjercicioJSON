const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// ================= GET TODOS =================
router.get('/usuarios', usuarioController.obtenerUsuarios);

// ================= GET POR ID =================
router.get('/usuarios/:id', usuarioController.obtenerUsuarioPorId);

// ================= POST =================
router.post('/usuarios', usuarioController.crearUsuario);

// ================= PUT =================
router.put('/usuarios/:id', usuarioController.actualizarUsuario);

// ================= DELETE =================
router.delete('/usuarios/:id', usuarioController.eliminarUsuario);

module.exports = router;