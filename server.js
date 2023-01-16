const express = require('express');
const session = require('express-session');

const MongoStore = require('connect-mongo');

const { Router } = require('express');
const router = Router();

const multer = require('multer');
const { normalize, schema } = require('normalizr');
const upload = multer();

const daoMemoria = require('./src/DAO/daoMemoriaProductos.js');
const classProductos = new daoMemoria();

const mensajesDaoMongo = require('./src/DAO/daoMongoMensajes.js');
const classMsgs = new mensajesDaoMongo();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://Leo:62742@coder-backend.3x5udc7.mongodb.net/test',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: '1234',
    resave: true,
    saveUninitialized: false,
    cookie: { expires: 60000 },
  })
);

//Socket.io
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});

app.set('view engine', 'ejs');

app.use('/api/productos', router);

app.get('/', async (req, res) => {
  try {
    const prods = await classProductos.getAll();
    const user = req.session.user;

    if (user) {
      res.render('pages/form', { products: prods, user: user });
    } else {
      res.render('pages/form', { products: prods, user: true });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const prods = await classProductos.getAll();

    res.render('pages/productos', { products: prods });
  } catch (err) {
    console.log(err);
  }
});

router.post('/form', upload.none(), (req, res) => {
  try {
    const body = req.body;
    classProductos.save(body);
    if (body) {
    } else {
      res.json({ error: true, msg: 'Producto no agregado' });
    }
  } catch (err) {
    console.log(err);
  }
});

//LOGIN

router.post('/login', upload.none(), (req, res) => {
  try {
    const username = req.body.userName;

    if (username) {
      req.session.user = username;
      req.session.admin = true;
      res.redirect('/api/productos/login');
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/login', async (req, res) => {
  try {
    const prods = await classProductos.getAll();
    const user = req.session.user;

    if (user) {
      res.render('pages/form', { products: prods, user: user });
    } else {
      res.render('pages/form', { products: prods, user: true });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.send('no pudo deslogear');
      } else {
        res.render('pages/logout');
      }
    });
  } catch (err) {
    console.log(err);
  }
});

io.on('connection', async (socket) => {
  console.log('Usuario conectado');

  socket.on('msg', async (data) => {
    let fecha = new Date();
    /* email: data.email,
      mensaje: data.mensaje,
      fecha: fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
      hora: fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds(), */
    const msg = {
      author: {
        id: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        edad: data.edad,
        avatar: data.avatar,
      },
      text: {
        mensaje: data.mensaje,
        fecha: fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear(),
        hora: fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds(),
      },
    };

    classMsgs.save(msg);
    const allData = await classMsgs.getAll();

    const mensajeSchema = new schema.Entity('mensaje');
    const authorSchema = new schema.Entity(
      'author',
      {
        mensaje: mensajeSchema,
      },
      { idAttribute: 'email' }
    );
    const chatSchema = new schema.Entity('chat', {
      author: [authorSchema],
    });
    const normalizado = normalize({ id: 'chatHistory', messages: allData }, chatSchema);
    console.log(JSON.stringify(normalizado));

    io.sockets.emit('msg-list', { normalizado: normalizado });
  });

  socket.on('sendTable', async (data) => {
    classProductos.save(data);

    try {
      const productos = await classProductos.getAll();
      socket.emit('prods', productos);
    } catch (err) {
      console.log(err);
    }
  });
});
