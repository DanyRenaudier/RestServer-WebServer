const jwt = require('jsonwebtoken');

const generateJWT = (uid= '') =>{

    return new Promise ((resolve,reject)=>{
        const paylode= { uid }

        jwt.sign(paylode, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '4h',
        },  (err,token)=>{

            if(err){
                console.log( err );
                reject('No se pudo generar el token')
            }else{
                resolve( token );
            }
        });

    })

}

module.exports={
    generateJWT
}
