
const Sockets = function(io) {
    this.io = io;
    this.usuarios = [{ id: 1, usuario: "Administrador" }];
    this.mensajes = [{
        mensaje: "Todos sean bienvenidos, <b>no hay reglas ni moderadores</b>; así que entran bajo <b class='text-danger'>su propio riesgo</b>.",
        usuario: this.usuarios[0],
        fecha: new Date(),
        tipo: "mensaje"
    },{
        mensaje: "<i class='text-danger'>Tras 30 minutos de inactividad el servidor se pone en modo invernación y se limpian todos los mensajes.</i>",
        usuario: this.usuarios[0],
        fecha: new Date(),
        tipo: "mensaje"
    }];
    this.socketsEvents();
};

Sockets.prototype.usuarioExiste = function(info) {
    return this.usuarios.filter(usu => (usu.usuario === info || usu.id === info));
}

Sockets.prototype.nuevosUsuarios = function(id) {
    return this.usuarios.filter(usu => usu.id !== id);
}

Sockets.prototype.customMensaje = function(tipo, usuario) {
    return {
        tipo: tipo,
        mensaje: tipo === "login" ? `${usuario} se ha unido al chat` : `${usuario[0].usuario} ha salido del chat`
    }
}

Sockets.prototype.validaExiste = function(existe) {
    return (Array.isArray(existe) && existe.length > 0);
}

Sockets.prototype.cerrarSesion = function(id) {
    let newUsuarios = this.nuevosUsuarios(id);
    if(newUsuarios.length === this.usuarios.length) return;
    let usuario = this.usuarioExiste(id);
    this.usuarios = [...newUsuarios];
    this.mensajes = [...this.mensajes, this.customMensaje("logoff", usuario)];
    this.io.emit('mensajes-chat', this.mensajes);
    this.io.emit('usuarios', this.usuarios);
}

Sockets.prototype.socketsEvents = function() {
    this.io.on("connection", (socket) => {

        this.io.emit('usuarios', this.usuarios);

        socket.on("nuevo-usuario", (usuario) => {
            let existe = this.usuarioExiste(usuario);
            if(this.validaExiste(existe)) {
                socket.emit('error', "Actualmente ya existe un usuario con ese nombre en la sala");
                return;
            }
            this.usuarios = [...this.usuarios, { usuario, id: socket.id}];
            this.mensajes = [...this.mensajes, this.customMensaje("login", usuario)];
            socket.emit('activar-chat');
            this.io.emit('mensajes-chat', this.mensajes);
            this.io.emit('usuarios', this.usuarios);
        });

        socket.on("disconnect", () => {
            this.cerrarSesion(socket.id);
        });

        socket.on("salir-chat", () => {
            this.cerrarSesion(socket.id);
        });

        socket.on("mensaje-cliente", ({ usuario, ...rest }) => {
            let existe = this.usuarioExiste(usuario);
            if(!this.validaExiste(existe)) {
                socket.emit('error', "Necesitas acceder con un usuario");
                return;
            }
            this.mensajes = [...this.mensajes, { usuario: { usuario, id: socket.id }, ...rest }];
            this.io.emit('mensajes-chat', this.mensajes);
        });

    });
};

module.exports = Sockets;