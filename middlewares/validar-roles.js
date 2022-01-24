const { response, request } = require("express");


const esAdminRole = (req = request, resp = response, next) =>{

    if(!req.usuarioAutenticado){
        return resp.status(500).json({
            msg:'Se quiere verificar el role sin validar el token primero',
        })
    }

    const {rol, nombre}=req.usuarioAutenticado;

    if(rol !== 'ADMIN_ROLE'){
        return resp.status(401).json({
            msg: `El usuario ${nombre} no tiene los permisos para esta accion`
        })
    }

    next();
}

const tieneRole = (...roles) =>{

    return (req , res , next)=>{
        
        if(!req.usuarioAutenticado){
            return resp.status(500).json({
                msg:'Se quiere verificar el role sin validar el token primero',
            })
        }
        
        if(!roles.includes(req.usuarioAutenticado.rol)){
            return res.status(401).json({
                msg: `El servicio requiere de uno de estos roles: ${roles}`
            })
        }

        next();
    }

}

module.exports={
    esAdminRole,
    tieneRole
}