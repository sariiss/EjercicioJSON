const express = require('express');
const router = express.Router();
const {
    crearCancion,
    obtenerCanciones,
    obtenerCancionPorId,
    actualizarCancion,
    eliminarCancion
} = require('../controllers/cancionesController');

// ========== RUTAS DE CANCIONES ==========

// Obtener todas las canciones
router.get('/canciones', obtenerCanciones);

// Obtener una canción por ID
router.get('/canciones/:id', obtenerCancionPorId);

// Crear una nueva canción
router.post('/canciones', crearCancion);

// Actualizar una canción
router.put('/canciones/:id', actualizarCancion);

// Eliminar una canción
router.delete('/canciones/:id', eliminarCancion);

module.exports = router;