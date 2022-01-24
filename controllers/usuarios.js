const {response}=require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet=async(req,res=response)=>{

    // Ver notas de la destructuracion
    // const {nombre="Daniel", apellido, direccion, edad=25}= req.query;

    const {desde=0, hasta=5} = req.query;
    const query= {estado: 'true'};

    // const usuarios= await Usuario.find(query)
    // //Paginacion
    // .skip(Number(desde))
    // .limit(Number(hasta));

    // const total= await Usuario.countDocuments(query);

    const [usuarios, total]= await Promise.all([
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(hasta)),
        Usuario.countDocuments(query)
    ])

    res.json({
        msg:'Get API - controlador',
        // nombre,
        // apellido,
        // direccion,
        // edad
        total,
        usuarios
    })
}

const usuariosPost=async(req,res=response)=>{
    //En este punto los middlewares se ejecutaron y en el caso de la validacion que se hizo, las funciones ya recogieron los datos de haberse ejecutado. Ahora es momento de revisar si los middlewares encontraron errores que deban ser atendidos.

    // La validacion de errores se pasó como middleware ya declarado en un archivo dentro de la carpeta middlewares

    // const errors= validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json(errors);
    // }


    const {nombre, correo, password, rol}=req.body;
    const usuario = new Usuario({nombre, correo,password,rol});

    //Hash de password
    const salt= bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( String(password), salt);

    //Guardar en DB
    await usuario.save();
    
    res.json({
        usuario
    })
}

const usuariosPut=async(req,res=response)=>{

    const {id} = req.params;
    const { _id, password, google, correo, ...resto}= req.body;

    //TODO validaciones contra BD
    if(password){
        const salt= bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( String(password), salt);
    }

    const usuario= await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg:'Put API - controlador',
        usuario
    })
}

const usuariosPatch=(req,res=response)=>{
    res.json({
        msg:'Patch API - controlador',
    })
}

const usuariosDelete=async(req,res=response)=>{

    const {id}=req.params;

    const usuarioInactivo= await Usuario.findByIdAndUpdate(id,{estado:false});
    
    res.json({ 
        usuarioInactivo,
    })
}

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}