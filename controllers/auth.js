const { response, request } = require("express");
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generateJWT } = require("../helpers/generate-jwt");


const login=async(req,res = response)=>{
    
    const {correo,password} = req.body;
    
    try {
    
        //Validar que el correo exista en la BD

        const usuario = await Usuario.findOne({correo});
    
        if(!usuario){
            res.status(400).json({
                msg: 'El Correo / Contraseña no son validos - correo'
            })
        }

        //Validar que el usuario este activo / existe
            
        if(!usuario.estado){
            res.status(400).json({
                msg: 'El usuario no se encuentra en la BD'
            })
        }
        
        //Verificar la contraseña
        const passwordValido= bcryptjs.compareSync(password,usuario.password);
        
        if(!passwordValido){
            res.status(400).json({
                msg: 'El Correo / Contraseña no son validos - password'
            })
        }
         
        //Generar el JWT
        const token= await generateJWT(usuario.id);

        res.json({
            "msg":"Login Ok",
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        throw res.status(500).json({
            msg:"Contactese con el administrador del sistema"
        })
    }
    
}

module.exports={
    login
}