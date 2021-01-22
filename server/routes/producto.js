const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');

let app = express();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

// ==============================
// Obetener Productos
// ==============================

app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = Number(req.params.desde) || 0;
    let limite = Number(req.params.limite) || 5;
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });

});

// ==============================
// Obetener un Producto x Id
// ==============================

app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }
            return res.json({
                ok: true,
                producto: productoDB
            })
        });
});
//=============================
// Buscar productos 
//=============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    // el parámetro i indica que busque nombres que contengan ese término y sea insensible a mayúsculas y minúsculas
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});
// ============================
// Crear un nuevo producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
});

// =============================
// Modificar un Producto
// =============================

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, {
            new: true
        },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }
            return res.status(200).json({
                ok: true,
                producto: productoDB
            });
        });
});

// =============================
// Eliminar un Producto
// =============================

app.delete('/productos/:id', verificaToken, (req, res) => {
    // marcar disponible = false
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }
        return res.status(200).json({
            ok: true,
            producto: productoDB
        })
    });
});
module.exports = app;