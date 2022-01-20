const { Router } = require('express');
const {check} = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { compr, comprobacionErrores } = require('../middlewares/comprobar-errores');

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');



const router = Router();

//El path de cada http request ahora es '/' pero eso no quiere decir que vaya a hacer devolver el response en el path root (en este caso seria localhost:8080, el path principal), el response lo haria en /api/usuarios ya que a ese path del url es a donde estan respondiendo (seguir leyendo). 

//Ese sería su path main al que responden y no al localhost:8080. Es como si estos routes estuvieran almacenados dentro del path /api/usuarios, el que se detallo en el archivo server.js. Que indica a donde pertenecen los routes y de donde saca la informacion para trabajar.

router.get('/', usuariosGet);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password tiene que tener 6 letras o mas').isLength({min:6}),
    check('correo', 'El correo no es válido o está vacio').isEmail(),
    check('correo').custom(emailExiste),
    
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),

    // check('rol').custom(async (rol='')=>{
    //     const existRole= await Role.findOne({rol});
    //     if(!existRole){
    //         throw new Error(`No existe el rol ${rol} en la DB`)
    //     }
    // })
    comprobacionErrores    
], usuariosPost);

router.put('/:id',[
    check('id', "No es un ID valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    comprobacionErrores
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    check('id', "No es un ID valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    comprobacionErrores
], usuariosDelete);

//los controles de las rutas, es decir, el segundo parametro que se pasa a cada ruta, se le hizo una descomposicion y se envio dentro de un archivo aparte para que sea mas facil el mantenimiento. En este nuevo archivo se exportan las funciones y se importan en este archivo desde '../controllers/usuarios'.

module.exports = router;