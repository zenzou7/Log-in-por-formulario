const ContainerMongo = require('../containers/ContainerMongo.js');
const mensajes = require('../../models/mensajes.js');

class mensajesDaoMongo extends ContainerMongo {
  constructor() {
    super(mensajes);
  }
}

module.exports = mensajesDaoMongo;
