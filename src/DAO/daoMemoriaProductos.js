const contenedorMemoria = require('../containers/ContainerMemoria');
const { faker } = require('@faker-js/faker');
faker.locale = 'es';

function generarProducto() {
  return {
    name: faker.commerce.product(),
    price: faker.commerce.price(100, 4000),
    thumbnail: faker.image.business(1234, 2345, true),
  };
}
const productos = [];

for (let i = 0; i < 5; i++) {
  let prod = generarProducto();
  productos.push(prod);
}

class ProductosDaoMemoria extends contenedorMemoria {
  constructor() {
    super(productos);
  }
}

module.exports = ProductosDaoMemoria;
