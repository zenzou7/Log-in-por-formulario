const mongoose = require('mongoose');

const mensajesSchema = new mongoose.Schema({
  author: {
    id: { type: String, require: true },
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    edad: { type: String, require: true },
    avatar: { type: String, require: true },
  },
  text: {
    mensaje: { type: String, require: true },
    fecha: { type: String, require: true },
    hora: { type: String, require: true },
  },
});
const mensajes = mongoose.model('mensajes', mensajesSchema);
module.exports = mensajes;
