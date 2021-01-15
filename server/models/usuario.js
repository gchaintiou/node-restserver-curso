const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('../routes/usuario');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Debe ingresar el Nombre']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Debe ingresar el Correo']
    },
    password: {
        type: String,
        required: [true, 'Debe ingresar una Contraseña']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//la siguiente función permite modificar la estructura del Schema, que se devolverá al cliente
// en este caso con el objetivo de que no se le retorne el password
// para eso modificamos el método toJSON (que es el que genera el JSon)
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject(); // obtengo el objeto con todas las propiedades y métodos
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);