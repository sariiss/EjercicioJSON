const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: [true, 'El ID es obligatorio'] 
    },
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'] 
    },
    email: { 
        type: String, 
        required: [true, 'El email es obligatorio'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email inválido']
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    canciones: [{ 
        type:String,
        ref:'canciones',
        required:true
    }],
    reproduccion: {
        cancionActual: String,
        estado: {
            type: String,
            enum: ['Reproduciendo', 'Pausado', 'Detenido', 'Finalizado'],
            default: 'Detenido',
            required: true
        },
        volumen: Number,
        meGusta: Boolean,
    }
}, {
    _id: false,
    timestamps:true// Desactivamos _id automático porque usamos _id personalizado
});

module.exports = mongoose.model('Usuario', UsuarioSchema);