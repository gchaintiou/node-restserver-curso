const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// =============================
// Mostrar todas las categorías
// =============================
app.get('/categoria', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Categoria.find()
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') // busca en tablas relacionadas
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments((err, cantidad) => {
                res.json({
                    ok: true,
                    categorias,
                    cantidad
                })
            });
        });

});

// =============================
// Mostrar una categoría x Id
// =============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// =============================
// Crear Nueva Categoria
// =============================
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoría
    // Usuario que crea la categoría: req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// =============================
// Actualizar una categoría
// =============================
// Versión por Gustavo
/*
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Actualiza la descripción de la Categoría
    //Categoria.findById(...);
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let usuario = req.usuario._id;
    Categoria.findById({ _id: id }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }
        categoriaDB.descripcion = descripcion;
        categoriaDB.usuario = usuario;
        categoriaDB.save((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                categoria
            });

        });

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});
*/

// =============================
// Actualizar una categoría
// =============================
// Versión por Fernando
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Actualiza la descripción de la Categoría
    //Categoria.findById(...);
    let id = req.params.id;
    let body = req.body;
    let datosAActualizar = {
        descripcion: body.descripcion,
        usuario: req.usuario._id
    }
    Categoria.findByIdAndUpdate(id, datosAActualizar, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// =============================
// Eliminar una categoría
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un Administrador puede eliminar una Categoría
    let id = req.params.id;

    Categoria.findByIdAndRemove({ _id: id }, (err, categoriaEliminada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se pudo eliminar la categoría"
                }
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaEliminada
        });

    });

});

module.exports = app;