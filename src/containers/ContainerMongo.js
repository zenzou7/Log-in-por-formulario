const mongoose = require('mongoose');

const connection = async () => {
  try {
    await mongoose.connect('mongodb+srv://Leo:62742@coder-backend.3x5udc7.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
};
const conexion = async () => {
  await connection();
};

conexion();

class ContenedorMongo {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async getAll() {
    const prods = await this.ruta.find();

    return prods;
  }
  async getById(prodId) {
    const prod = await this.ruta.find({}).sort({ id: prodId }).limit(1);
    return prod;
  }
  async save(obj) {
    const newProd = new this.ruta(obj);
    newProd.save(function (err) {
      if (err) return console.log(err);
    });

    return console.log('Guardado con exito');
  }
  async update(id, obj) {
    const objId = { id: id };
    const update = {
      $set: obj,
    };
    const options = { upsert: false };

    await this.ruta
      .updateOne(objId, update, options)
      .then((result) => {
        const { matchedCount, modifiedCount } = result;
        if (matchedCount && modifiedCount) {
          console.log(`Se actualizó correctamente.`);
        }
      })
      .catch((err) => console.error(`No se pudo actualizar: ${err}`));
  }
  async delete(id) {
    if (id) {
      const usuarioBorrar = await this.ruta.deleteOne({ id: `${id}` });
      return console.log(`Producto ${id} borrado`);
    } else {
      const deleteAll = await this.ruta.deleteMany({});
      return console.log('Todos los this.ruta borrados');
    }
  }
}

module.exports = ContenedorMongo;
