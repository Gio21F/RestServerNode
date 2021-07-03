const express = require('express');
const path = require('path');
const cors = require('cors');
const { dbConnection } = require('../database/config');
class Server {

    constructor() {
        this.app = express();
        this.app.set('port', process.env.PORT || 3000); 
        this.paths = {
            users: '/api/users',
            auth: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos'
        }

        //Coneccion a la db
        this.connectDB();

        //Middlewares Funciones que añaden mas funciones a mi servidor
        this.middlewares();
        //Rutas de mi servidor
        this.routes();
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
        
    }

    routes(){
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }

    listen(){
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

module.exports = Server;