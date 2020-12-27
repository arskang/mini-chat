
const Sockets = function(io) {
    this.io = io;
    this.mensajes = [{ mensaje: "Bienvenido a todos", usuario: "Administrador", fecha: new Date() }];
    this.socketsEvents();
};

Sockets.prototype.socketsEvents = function() {
    this.io.on("connection", (socket) => {

        // socket.emit('mensaje-bienvenida', {
        //     msg: "Bienvenido al servidor",
        //     fecha: new Date()
        // });

        // socket.on('nuevo-cliente', (mensaje) => {
        //     console.log("Cliente conectado", mensaje, socket.id);
        // });

        this.io.emit('mensajes-chat', this.mensajes);

        socket.on("mensaje-cliente", (mensaje) => {
            this.mensajes = [...this.mensajes, mensaje];
            this.io.emit('mensajes-chat', this.mensajes);
        })

    });
};

module.exports = Sockets;