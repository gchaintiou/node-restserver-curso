// ========================================
// Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;
// si la variable PORT no existe, entonces la crea y le asigna 3000.

// ========================================
// Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// Si la variable NODE_ENV no existe, entonces la crea y le asigna 'dev' (desarrollo)

// ========================================
// Base de Datos
// ========================================
let urlDB;
/*
if (process.env.NODE_ENV === 'dev')
   urlDB = "mongodb: //localhost:27017/cafe";
else
    urlDB = "mongodb+srv://Gustavo:gchMongo123@cluster0.2ytor.mongodb.net/cafe?retryWrites=true&w=majority";
*/

urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;