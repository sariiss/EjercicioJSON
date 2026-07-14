const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    _id: {type: String,required: true},
    nombre: {type: String,required: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    canciones: [{type: Object}],
    reproduccion: {
    cancionActual: String,
    estado: {
        type: String,
        enum: ['Reproduciendo', 'Pausado', 'Detenido', 'Finalizado'],
        default: 'Detenido'
    },
    volumen: Number,
    meGusta: Boolean
}
}, {
    _id: false,
});

module.exports = mongoose.model('Usuario', UsuarioSchema);