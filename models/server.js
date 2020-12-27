const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Sockets = require("./sockets");

const Servidor = function (port) {

    this.app = express();
    this.port = port;

    // HTTP Server
    this.server = http.createServer(this.app);

    // Configuración de sockets
    this.io = socketio(this.server);

};

Servidor.prototype.middlewares = function () {
    // Desplegar el directorio público
    this.app.use(express.static(path.join(__dirname, "../public")));
};

Servidor.prototype.configurarSockets = function () {
    new Sockets(this.io);
};

Servidor.prototype.execute = function () {
    this.middlewares();
    this.configurarSockets();
    this.server.listen(this.port, () => {
        console.log(`Servidor activo en puerto: ${this.port}`);
    });
};

module.exports = Servidor;