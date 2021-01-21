require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    // Habilitación de la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
// Configuración global de rutas
app.use(require('./routes/index'));


app.get('/', function(req, res) {
    res.json('Hello World')
})

// mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
//     if (err) throw err;
//     console.log("Base de datos ONLINE");
// });

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        throw err;

    }
    console.log('Base de Datos online');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
})