const express=require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app=express();
        this.url=process.env.URL;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';
        this.

        //Conectar a base de datos
        this.conectarDB()

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());
        
        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio Publico
        this.app.use(express.static('public'))
    }

    routes() {

        //el primer parametro es el path del url por donde tienen que pasar los http request. Es decir, los request van a provernir desde esa url. 

        //En el segundo path (el del require), es donde se van a almacenar los response de los requests al primer path. Es lo que se va a llamar en caso de que en el URL hayan requests. **Apretar f12 despues de hacer click en el path del require **
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        
        this.app.use(this.authPath, require('../routes/auth'));
    }

    listen() {
        this.app.listen(this.url,()=>{
            console.log('App listening at', this.url);
        });
    }

}

module.exurls= Server;