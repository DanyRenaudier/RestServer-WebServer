const {request,response}=require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req,res, next) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'Token inexistente en la request',
        })
    }

    try {
        const {uid}= jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        req.uid=uid;

        const usuarioAutenticado= await Usuario.findById(uid);
        
        //Verificar existencia de usuario en db
        if(!usuarioAutenticado){
            return res.status(401).json({
                msg:'El usuario no existe en DB'
            })
        }
        
        //Verificar si el uid tiene estado true
        if(!usuarioAutenticado.estado){
            return res.status(401).json({
                msg:'El usuario fue desactivado'
            })
        }

        req.usuarioAutenticado=usuarioAutenticado;

        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg:'Token invalido'
        })
    }
}

module.exports={
    validarJWT
}