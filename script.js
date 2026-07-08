
// Conexión a MongoDB Atlas
var conexion = new Mongo("mongodb+srv://ivanclavijo97_db_user:ovPcjs7Bec2mIQIC@cluster0.xvhwje9.mongodb.net/");
var db = conexion.getDB("playlist");

print("==================================");
print(" CONEXIÓN EXITOSA A PLAYLIST ");
print("==================================");


// 1. LOGIN POR EMAIL
print("\n1. LOGIN");

var usuario = db.usuarios.findOne({
    email: "violetta@gmail.com",
    password: "123456"
});

if (usuario) {
    print("Acceso concedido");
} else {
    print("Usuario no encontrado");
}
// 2. LISTAR USUARIOS CON VOLUMEN MENOR A 10

print("\n2. Usuarios con volumen menor a 10");

db.usuarios.find({
    "reproduccion.volumen": {
        $lt: 10
    }
}).forEach(printjson);

// 3. ACTUALIZAR PERFIL

print("\n3. Actualizar perfil");

db.usuarios.updateOne(
    { _id: "user001" },
    {
        $set: {
            nombre: "Violetta Martinez"
        }
    }
);

print("Perfil actualizado");

// 4. INSERTAR UNA NUEVA ANIDACIÓN

print("\n4. Agregar nueva canción");

db.usuarios.updateOne(
    { _id: "user001" },
    {
        $push: {
            canciones: {
                _id: "song005",
                titulo: "In The End",
                artista: "Linkin Park",
                album: "Hybrid Theory"
            }
        }
    }
);

print("Canción agregada");

// 5. LISTAR TODAS LAS CANCIONES DE UN USUARIO

print("\n5. Canciones del usuario");

db.usuarios.find(
    { _id: "user001" },
    {
        _id: 0,
        canciones: 1
    }
).forEach(printjson);

// 6. BUSCAR CANCIONES POR ARTISTA

print("\n6. Canciones de Oasis");

db.usuarios.find({
    "canciones.artista": "Oasis"
}).forEach(printjson);

// 7. CAMBIAR EL VOLUMEN

print("\n7. Cambiar volumen");

db.usuarios.updateOne(
    { _id: "user002" },
    {
        $set: {
            "reproduccion.volumen": 50
        }
    }
);

print("Volumen actualizado");

// 8. CAMBIAR EL ESTADO DE REPRODUCCIÓN

print("\n8. Cambiar estado");

db.usuarios.updateOne(
    { _id: "user001" },
    {
        $set: {
            "reproduccion.estado": "Pausado"
        }
    }
);

print("Estado actualizado");

// 9. ELIMINAR UNA CANCIÓN

print("\n9. Eliminar canción");

db.usuarios.updateOne(
    { _id: "user001" },
    {
        $pull: {
            canciones: {
                _id: "song005"
            }
        }
    }
);

print("Canción eliminada");

// 10. MOSTRAR USUARIOS REPRODUCIENDO

print("\n10. Usuarios reproduciendo");

db.usuarios.find({
    "reproduccion.estado": "Reproduciendo"
}).forEach(printjson);

print("\n==================================");
print(" FIN DE LAS CONSULTAS ");
print("==================================");