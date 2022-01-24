
const validarJWT  = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const comprobacionErrores  = require('../middlewares/comprobar-errores');

module.exports={
    ...validarJWT,
    ...validarRoles,
    ...comprobacionErrores,
}