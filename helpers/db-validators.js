const Usuario = require('../models/usuario');
const Role = require('../models/role');


//Validacion de Rol
const esRoleValido = async (rol='')=>{
    const existRole= await Role.findOne({rol});
    if(!existRole){
        throw new Error(`No existe el rol ${rol} en la DB`)
    }
}

//Validacion de correo

const emailExiste= async(correo)=>{

    const existeEmail= await Usuario.findOne({correo});
    
    if(existeEmail){
        throw new Error("El correo ya está registrado en la base de datos")
    }
}

const existeUsuarioPorId= async(id)=>{

    const existeUsuario= await Usuario.findById(id);
    
    if(!existeUsuario){
        throw new Error(`El usuario con el id ${id}, no existe`);
    }
}

module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}