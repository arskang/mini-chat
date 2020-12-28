# Ejercicio para el manejo de sockets con socket.io

Se realizo con **Vanilla JS**, **Node**, **Express** y **Socket.io**

El ejercicio se realizaba con clases, pero decidí hacerlo con prototypes.

Es un ejercicio muy básico, por lo que le faltan muchas cosas

+ **Ejemplo**: https://edder-socket-server.herokuapp.com/

+ **Instalar dependencias**
```
npm install
```

+ **Modo desarrollo**

*Es necesario instalar nodemon*

```
npm i nodemon -g
npm run dev
```

+ **Modo producción**
```
npm start
```

### Verificar

+ **Servidor**

Si no funciona la **conexión** con el cliente, verificar el servidor al que apunta en la **línea 56** en **/public/index.html**

```javascript
    const url = "http://localhost:3000";
```

+ Puerto

El puerto del servidor se configura en **.env**, el predeterminado es el **3000**