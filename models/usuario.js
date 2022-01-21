const {Schema, model}= require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'El contraseña es obligatoria'],
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE']
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default:false
    }
});

UsuarioSchema.methods.toJSON = function(){
    const {_id,__v, password, ...usuario}=this.toObject()
    const uid=_id;
    return {...usuario,uid}

    //fernando en la clase lo hace asi:

    // usuario.uid=_id
    // return usuario
}

module.exports= model('Usuario', UsuarioSchema);