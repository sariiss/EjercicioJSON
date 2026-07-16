const Usuario = require("../models/Usuario");

// ================= CREAR USUARIO =================
const crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = req.body;
        
        if (!nuevoUsuario || Object.keys(nuevoUsuario).length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "No se recibieron datos"
            });
        }
        const usuarioGuardado = await Usuario.create(nuevoUsuario);
    
        res.status(201).json({
            success: true,
            mensaje: "Usuario creado con éxito",
            datos: usuarioGuardado
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
                mensaje: "El _id o el email ya están registrados"
            });
        }

        res.status(500).json({
            success: false,
            mensaje: "Error crítico al guardar el usuario"
        });
    }
};

// ================= OBTENER TODOS =================
const obtenerUsuarios = async (req, res) => {
    try {
        // ✅ USANDO MONGOOSE
        const usuarios = await Usuario.find().populate('canciones');
        
        res.json({
            success: true,
            total: usuarios.length,
            datos: usuarios
        });
        
    } catch (error) {
        console.error("Error al consultar:", error);
        res.status(500).json({ 
            success: false,
            mensaje: "Error al consultar los usuarios" 
        });
    }
};

// ================= OBTENER POR ID =================
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('canciones');
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }
        
        res.json({
            success: true,
            datos: usuario
        });
        
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                mensaje: "ID inválido"
            });
        }
        
        res.status(500).json({
            success: false,
            mensaje: "Error al consultar usuario por ID"
        });
    }
};

// ================= ACTUALIZAR USUARIO =================
const actualizarUsuario = async (req, res) => {
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

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            datosActualizar,
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }

        res.json({
            success: true,
            mensaje: "Usuario actualizado con éxito",
            datos: usuarioActualizado
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
                mensaje: "El email ya está registrado"
            });
        }

        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el usuario"
        });
    }
};
// ========== ACTUALIZAR ESTADO DE REPRODUCCIÓN ==========
const actualizarEstadoReproduccion = async (req, res) => {
    try {
        console.log(`📥 Recibida solicitud PATCH a /actualizar-estado/${req.params.id}`);
        
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que se envió el estado
        if (!estado) {
            return res.status(400).json({
                success: false,
                mensaje: 'El campo "estado" es obligatorio'
            });
        }

        // Validar que el estado sea válido
        const estadosValidos = ['Reproduciendo', 'Pausado', 'Detenido', 'Finalizado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Estado inválido',
                errores: [`El estado debe ser uno de: ${estadosValidos.join(', ')}`]
            });
        }

        // Buscar el usuario
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        // Verificar si el usuario está finalizado
        if (usuario.reproduccion.estado === 'Finalizado') {
            return res.status(403).json({
                success: false,
                mensaje: 'No se puede modificar un usuario finalizado'
            });
        }

        // Actualizar el estado
        usuario.reproduccion.estado = estado;
        await usuario.save();

        // No devolver la contraseña
        const usuarioResponse = usuario.toObject();
        delete usuarioResponse.password;

        res.json({
            success: true,
            mensaje: 'Estado de reproducción actualizado',
            usuario: usuarioResponse
        });

    } catch (error) {
        console.error('❌ Error al actualizar estado:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar el estado',
            errores: [error.message]
        });
    }
};

// ================= ELIMINAR USUARIO =================
const eliminarUsuario = async (req, res) => {
    try {
        // ✅ USANDO MONGOOSE (no el driver nativo)
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        
        if (!usuarioEliminado) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }
        
        res.json({
            success: true,
            mensaje: "Usuario eliminado con éxito",
            datos: usuarioEliminado
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
            mensaje: "No se pudo eliminar el usuario"
        });
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    actualizarEstadoReproduccion  
};