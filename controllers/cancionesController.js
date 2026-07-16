const Cancion = require("../models/canciones");

// ================= CREAR CANCIÓN =================
const crearCancion = async (req, res) => {
    try {
        const nuevaCancion = req.body;
        
        if (!nuevaCancion || Object.keys(nuevaCancion).length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "No se recibieron datos"
            });
        }
        
        const cancionGuardada = await Cancion.create(nuevaCancion);
    
        res.status(201).json({
            success: true,
            mensaje: "Canción creada con éxito",
            datos: cancionGuardada
        });
    
    } catch (error) {
        console.error("Error al guardar:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                mensaje: "Error de validación",
                errores: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                mensaje: "El _id ya está registrado"
            });
        }

        res.status(500).json({
            success: false,
            mensaje: "Error crítico al guardar la canción"
        });
    }
};

// ================= OBTENER TODAS LAS CANCIONES =================
const obtenerCanciones = async (req, res) => {
    try {
        const canciones = await Cancion.find();
        
        res.json({
            success: true,
            total: canciones.length,
            datos: canciones
        });
        
    } catch (error) {
        console.error("Error al consultar:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error al consultar las canciones" 
        });
    }
};

// ================= OBTENER CANCIÓN POR ID =================
const obtenerCancionPorId = async (req, res) => {
    try {
        const cancion = await Cancion.findById(req.params.id);
        
        if (!cancion) {
            return res.status(404).json({
                success: false,
                mensaje: "Canción no encontrada"
            });
        }
        
        res.json({
            success: true,
            datos: cancion
        });
        
    } catch (error) {
        console.error("Error al obtener canción:", error);
        
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                mensaje: "ID inválido"
            });
        }
        
        res.status(500).json({
            success: false,
            mensaje: "Error al consultar canción por ID"
        });
    }
};

// ================= ACTUALIZAR CANCIÓN =================
const actualizarCancion = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        
        // Eliminar _id si viene en el body
        delete datosActualizar._id;

        // Verificar que hay datos para actualizar
        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "No se enviaron datos para actualizar"
            });
        }

        const cancionActualizada = await Cancion.findByIdAndUpdate(
            id,
            datosActualizar,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!cancionActualizada) {
            return res.status(404).json({
                success: false,
                mensaje: "Canción no encontrada"
            });
        }

        res.json({
            success: true,
            mensaje: "Canción actualizada con éxito",
            datos: cancionActualizada
        });

    } catch (error) {
        console.error("Error al actualizar:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                mensaje: "Error de validación",
                errores: Object.values(error.errors).map(e => e.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                mensaje: "El _id ya está registrado"
            });
        }

        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar la canción"
        });
    }
};

// ================= ELIMINAR CANCIÓN =================
const eliminarCancion = async (req, res) => {
    try {
        const cancionEliminada = await Cancion.findByIdAndDelete(req.params.id);
        
        if (!cancionEliminada) {
            return res.status(404).json({
                success: false,
                mensaje: "Canción no encontrada"
            });
        }
        
        res.json({
            success: true,
            mensaje: "Canción eliminada con éxito",
            datos: cancionEliminada
        });
        
    } catch (error) {
        console.error("Error al eliminar:", error);
        
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                mensaje: "ID inválido"
            });
        }
        
        res.status(500).json({
            success: false,
            mensaje: "No se pudo eliminar la canción"
        });
    }
};

module.exports = {
    crearCancion,
    obtenerCanciones,
    obtenerCancionPorId,
    actualizarCancion,
    eliminarCancion
};