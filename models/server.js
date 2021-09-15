const express = require('express');
const path = require('path');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const socketController = require('../sockets/socketController');
class Server {

    constructor() {
        this.app = express();
        this.app.set('port', process.env.PORT || 3000); 
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.paths = {
            auth: '/api/auth',
            buscar:'/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            users: '/api/users',
            uploads:'/api/uploads'
        }

        //Coneccion a la db
        this.connectDB();

        //Middlewares Funciones que añaden mas funciones a mi servidor
        this.middlewares();
        //Rutas de mi servidor
        this.routes();
        //Sockets
        this.sockets();
        //Escuchar peticiones
        this.listen();

    }

    async connectDB(){
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y Parseo del body
        this.app.use( express.json() );

        //Directorio Publico
        //this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.static('public'));

        //FileUploads - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes(){
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets(){
        this.io.on('connection', socketController);
    }

    listen(){
        this.server.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

module.exports = Server;