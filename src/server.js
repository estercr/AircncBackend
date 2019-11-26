const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

require('./models/User');

const app = express();
const server = http.Server(app);
const io = socketio(server);


mongoose.connect('mongodb+srv://omnistackTeh:Teh@omnistackteh-t55ny.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const connetedUsers = {}; 

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connetedUsers[user_id] = socket.id;
});


app.use((req, res, next) => {
    req.io = io;
    req.connetedUsers = connetedUsers;

    return next();
});

//GET, POST, PUT, DELETE
// req.query = Acessar query params (para filtros)
// req.params = Acessar route params (para edição e delete )
// req.body = Acessar corpo da requisição (para criação e edição de registros)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333); 