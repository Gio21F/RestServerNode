const { Categoria, User, Role, Producto } = require('../models');

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

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await User.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeCategoria = async( id ) => {
    //Verificar si existe la categoria por el id
    const existeID = await Categoria.findById( id );
    if ( !existeID ) {
        throw new Error('Esta categoria ID no existe')
    }
}

const existeProducto = async( id ) => {
    //Verificar si existe el producto por ID
    const existe = await Producto.findById( id );
    if ( !existe ) {
        throw new Error(`No existe un producto con el id: ${id}`)
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria, 
    existeProducto
}