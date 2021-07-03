const { response, request } = require("express");
const { Categoria, Producto } = require('../models');


const obtenerProductos = async(req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true, disponible:true}
    const [ total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'name')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ])
    res.status(201).json({
        total,
        productos
    });
}

const crearProducto = async(req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;
    //Verificar si existe esa categoria
    const nombre = body.nombre.toUpperCase();
    const productoDB = await Producto.findOne( { nombre } );
    if( productoDB ) {
        res.status(400).json({
            msg:`Producto: ${nombre} ya existente`
        })
    }
    //Generar la data a guardar
    const data = {
        ...body,
        nombre,
        usuario: req.user._id
    }

    const producto = new Producto( data );
    //Guardar
    await producto.save();
    res.status(200).json({
        producto
    })

}

const buscarProductoporId = async(req = request, res = response) => {
    const { id } = req.params;

    //Obtener categoria
    const producto = await Producto.findById( id ).populate('usuario', 'name').populate('categoria','nombre');

    res.status(201).json({
        producto
    })
}

const eliminarProducto =  async(req = request, res = response) => {
    const { id } = req.params;
    const productoBorrada = await Producto.findByIdAndUpdate( id, { estado:false}, {new:true} );
    res.status(201).json(productoBorrada);
}

//Actualizar categorias
const actualizarProducto = async( req, res=response ) => {
    const { id } = req.params;
    //no aceptar estos campos por si algun valiente los intenta mandar
    const { estado, usuario, categoria, ...data} = req.body;
    //Nombre nuevo
    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
        const existe = await Producto.findOne( { nombre: data.nombre })
        if (existe ) {
            res.status(400).json({
                msg:`Producto: ${data.nombre} ya existente`
            })
        }
    }
    //id del usuario del token
    data.usuario = req.user._id;
    //actualizar
    const producto = await Producto.findByIdAndUpdate( id, data, { new:true } )

    res.status(201).json(producto);

}


module.exports = {
    obtenerProductos,
    crearProducto,
    buscarProductoporId,
    eliminarProducto,
    actualizarProducto
}