// Servidor
const Servidor = require("./models/server");
require('dotenv').config();
const server = new Servidor(process.env.PORT);

server.execute();