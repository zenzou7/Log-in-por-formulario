class ContenedorMemoria {
  constructor(ruta) {
    this.ruta = ruta;
  }
  save(obj) {
    this.ruta.push(obj);
    return `Producto ${obj} guardado`;
  }
  getAll() {
    return this.ruta;
  }
  getById(id) {
    const prodsFilter = this.ruta.filter((prod) => prod.id == id);
    return prodsFilter;
  }
  update(obj) {
    const prods = this.ruta.filter((prod) => prod.id !== obj.id);
    let prodsFilter = this.ruta.filter((prod) => prod.id == obj.id);
    prodsFilter = obj;

    prods.push(prodsFilter);
    return `Producto ${prodsFilter} updateado`;
  }
  delete(id) {
    if (id) {
      const prods = this.ruta.filter((prod) => prod.id !== obj.id);
      return prods;
    } else {
      this.ruta = [];
      return 'Todos los producto borrados';
    }
  }
}

module.exports = ContenedorMemoria;
