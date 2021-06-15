const Role = require('../models/role');
const User = require('../models/user');
const esRoleValido = async ( role='' ) => {
    const existeRol = await Role.findOne({ role });
    if(!existeRol){
        //error personalizado
        throw new Error(`El rol: ${role}, no es un tipo de rol en el sistema`)
    }
}

const emailExiste = async ( email ='' ) => {
    const existeEmail = await User.findOne( { email } );
    if ( existeEmail ){
        throw new Error(`El correo: ${ email } ya existe`);
    }
}

const existeUsuarioPorId = async ( id ) => {
    const existeUsuario = await User.findById( id );
    if ( !existeUsuario ){
        throw new Error(`El id: ${ id } no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}