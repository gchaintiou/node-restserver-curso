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
// Vencimiento del Token
// ========================================
// 60 minutos
// 60 segundos
// 24 hs.
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================================
// SEED (Semilla) de autenticación
// ========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
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
if (process.env.NODE_ENV === 'dev')
//urlDB = "mongodb: //localhost:27017/cafe";
    urlDB = "mongodb+srv://Gustavo:gchMongo123@cluster0.2ytor.mongodb.net/cafe?retryWrites=true&w=majority";
else
    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;