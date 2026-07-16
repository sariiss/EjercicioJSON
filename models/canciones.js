const mongoose = require('mongoose');

const CancionSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: [true, 'El ID es obligatorio'] 
    },
    titulo: { 
        type: String,
        required:[true,  'el titulo es obligatorio']
    },
    artista:{
        type: String,
        required:[true,  'el titulo es obligatorio']
    },
    album:{
        type:String,
        required:[true, 'album es requerido']
    }

}, {
    _id: false, // Desactivamos _id automático porque usamos _id personalizado
});

module.exports = mongoose.model('canciones', CancionSchema);