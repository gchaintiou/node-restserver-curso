const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// librerías preexistentes en Node (No hace falta importarlas)
const fs = require('fs'); //file sistem
const path = require('path');
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }
    // Validación del Tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: "Tipo no válido. Permitidos: " + tiposValidos.join(',')
            }
        });

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let archivo = req.files.archivo;
    let arrNombreArchivo = archivo.name.split('.');
    let extension = arrNombreArchivo[arrNombreArchivo.length - 1];
    //console.log(extension);
    if (extensionesValidas.indexOf(extension) < 0)
        return res.json({
            ok: false,
            err: {
                message: "Extensión Inválida. Las extensiones válidas son " + extensionesValidas.join(',')
            }
        });

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });

        // Aquí tengo la imágen cargada
        if (tipo === "usuario")
            ImagenUsuario(id, res, nombreArchivo);
        else
            ImagenProducto(id, res, nombreArchivo);
    });
});

function ImagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            BorraArchivo('usuario', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            BorraArchivo('usuario', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario no existe"
                }
            });
        }
        BorraArchivo('usuario', usuarioDB.img);
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
} // function ImagenUsuario

function ImagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            BorraArchivo('producto', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            BorraArchivo('producto', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            });
        }
        BorraArchivo('producto', productoDB.img);
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
} // function ImagenProducto

function BorraArchivo(tipo, nombreImagen) {
    console.log("BorrarArchivo " + tipo + " " + nombreImagen);
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    // Verifico si existe la imágen que está grabada actualmente en el usuario o producto.            
    console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
        console.log("Existe el archivo. Lo elimino");
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;