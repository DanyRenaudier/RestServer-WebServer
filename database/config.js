const mongoose = require('mongoose');

const dbConnection=async()=>{

    try {
        
        await mongoose.connect(process.env.URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,

            //Mongoose ya no soporta esas configuraciones:
            
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log("Base de datos conectada con exito")

    } catch (error) {
        throw new Error("No se se pudo iniciar la base de datos, error: ", error);
    }
}

module.exports={
    dbConnection
}