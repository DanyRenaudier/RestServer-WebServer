const express=require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app=express();
        this.port=process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

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

    }

    listen() {
        this.app.listen(this.port,()=>{
            console.log('App listening at port',this.port);
        });
    }

}

module.exports= Server;