const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Usuario = require('./usuario');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'Debe ingresar una Descripción']
    },
    usuario: {
        type: String,
        required: [true, "El usuario es requerido"],
        ref: Usuario
    }

});

module.exports = mongoose.model('Categoria', categoriaSchema);