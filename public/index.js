moment.locale("es");

const SocketCliente = function(url) {
    this.url = url;
    this.socket = io(url);

    this.login = document.getElementById("miLogin");
    this.formulario = document.getElementById("miFormulario");
    this.mensajes = document.getElementById("misMensajes");
    this.usuarios = document.getElementById("usuarios");
    this.txtMensaje = document.getElementById("mensaje");
    this.txtUsuario = document.getElementById("usuario");
    this.txtError = document.getElementById("error");
    this.ultimo = document.getElementById("irUltimo");
    this.salir = document.getElementById("salir");
}

SocketCliente.prototype.limpiarError = function(error = "") { this.txtError.innerHTML = error; }

SocketCliente.prototype.txtUsuarioFocus = function() { this.txtUsuario.focus(); }
SocketCliente.prototype.txtUsuarioValue = function() { return this.txtUsuario.value; }

SocketCliente.prototype.txtMensajeFocus = function() { this.txtMensaje.focus(); }
SocketCliente.prototype.txtMensajeValue = function() { return this.txtMensaje.value; }

SocketCliente.prototype.ocultarFormularios = function(iniciar = false) {
    iniciar ? this.login.classList.add('d-none') : this.login.classList.remove('d-none');
    iniciar ? this.formulario.classList.remove('d-none') : this.formulario.classList.add('d-none');
    iniciar ? this.mensajes.classList.remove('d-none') : this.mensajes.classList.add('d-none');
}

SocketCliente.prototype.limpiarSesion = function(mensaje) {
    this.limpiarError(mensaje);
    this.ocultarFormularios();
    this.txtUsuarioFocus();
}

SocketCliente.prototype.formatMensajes = function({ usuario, mensaje, fecha, tipo }) {
    if(tipo === "login") return `<li class="text-success"><b><i>${mensaje}</i></b></li>`;
    if(tipo === "logoff") return `<li class="text-danger"><b><i>${mensaje}</i></b></li>`;
    return `<li><b>${usuario.usuario}</b> <i>(${moment(fecha).format("LLLL")})</i>:<br />${mensaje}</li>`;
}

SocketCliente.prototype.iniciarEventos = function() {
    this.salir.addEventListener("click", () => {
        this.limpiarSesion('Se abandono la sala del chat');
        this.socket.emit("salir-chat");
    });
    
    this.login.addEventListener("submit", (e) => {
        e.preventDefault();
        this.limpiarError();
        const usuario = this.txtUsuarioValue();
        if(usuario.trim() !== "") this.socket.emit("nuevo-usuario", usuario.trim());
        this.txtUsuarioFocus();
    });
    
    this.formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        this.limpiarError();
        const mensaje = this.txtMensajeValue();
        const usuario = this.txtUsuarioValue();
        if(mensaje.trim() !== "") {
            this.txtMensaje.value = "";
            this.socket.emit("mensaje-cliente", {
                usuario,
                mensaje,
                fecha: new Date()
            });
        }
        this.txtMensajeFocus();
    });
}

SocketCliente.prototype.iniciarSockets = function() {
    this.socket.on('usuarios', (usu) => {
        let conectados = `<p>Usuarios conectados: <b>${usu.length - 1}</b>`;
        if(usu.length > 1) {
            conectados += " (<i>";
            usu.forEach(({usuario}) => {
                if(usuario === "Administrador") return;
                conectados += `<b>${usuario}</b>, `;
            });
            conectados = conectados.substring(0, conectados.length - 2);
            conectados += "</i>)";
        }
        conectados += "</p>";
        this.usuarios.innerHTML = conectados;
    });
    
    this.socket.on('activar-chat', () => {
        this.ocultarFormularios(true);
        this.txtMensajeFocus();
    });
    
    this.socket.on('mensajes-chat', (listadoMensajes) => {
        if(!Array.isArray(listadoMensajes) || listadoMensajes.length === 0) return;
        let liMensajes = "";
        listadoMensajes.forEach((msj) => { liMensajes += this.formatMensajes(msj) });
        this.mensajes.innerHTML = liMensajes;
        this.ultimo.click();
        setTimeout(() => { this.txtMensajeFocus(); }, 100);
    });
    
    this.socket.on('error', (mensaje) => { this.limpiarSesion(mensaje); });
}

SocketCliente.prototype.execute = function() {
    this.iniciarEventos();
    this.iniciarSockets();
}

// "http://localhost:3000"
// "https://edder-socket-server.herokuapp.com/"
const cliente = new SocketCliente("https://edder-socket-server.herokuapp.com/");
cliente.execute();