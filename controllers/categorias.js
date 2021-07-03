const { response, request } = require("express");
const { Categoria } = require('../models');

//Obtener categorias --paginadas --total --populate()
const obtenerCategorias = async ( req, res=response) => {
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true }
    const [ total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'name')
            .skip(Number(desde))
            .limit(Number(limit))
    ])
    res.status(201).json({
        total,
        categorias
    });
}


//Obtener categoria especifica por ID -- populate()
const obtenerCategoriaPorID = async ( req=request, res=response) => {
    const { id } = req.params;

    //Obtener categoria
    const categoria = await Categoria.findById( id ).populate('usuario', 'name');

    res.status(201).json({
        categoria
    })
}

//Crear categorias
const crearCategoria = async ( req,res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    //Verificar si existe esa categoria
    const categoriaDB = await Categoria.findOne( { nombre } );
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} que intenta guardar ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre, 
        usuario: req.user._id
    }
    //Preparar
    const categoria = new Categoria( data );
    //Guardar
    await categoria.save();
    res.status(201).json({
        categoria
    })
}

//Actualizar categorias
const actualizarCategoria = async( req, res=response ) => {
    const { id } = req.params;
    //no aceptar estos campos por si algun valiente los intenta mandar
    const { estado, usuario, ...data} = req.body;
    //Nombre nuevo
    data.nombre = data.nombre.toUpperCase();
    //id del usuario del token
    data.usuario = req.user._id;
    //actualizar
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new:true } )

    res.status(201).json(categoria);

}

const borrarCategoria = async( req, res = response ) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado:false}, {new:true} );
    res.status(201).json(categoriaBorrada);
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorID,
    actualizarCategoria,
    borrarCategoria
}