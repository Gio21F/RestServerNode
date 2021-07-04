const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { User, Categoria, Producto } = require('../models')
const coleccionesPermitidas = [
    "usuarios",
    "categorias",
    "productos",
    "roles"
]

const buscarUsuarios = async( termino='', res = response ) => {
    const esMOngoID = ObjectId.isValid( termino ) //True si si es -- False no lo es

    if ( esMOngoID ){
        const user = await User.findById( termino )
        return res.json({
            results: ( user ) ? [ user ] : []
        })
    }

    const regex = new RegExp( termino, 'i') //Sea incensible a Mayusculas y Minusculas
    
    const user = await User.find({
        $or: [{ name:regex },{ email: regex }],
        $and: [{status:true}]
    })
    res.status(201).json({
        results: user
    })
}

const buscarCategorias = async( termino='', res=response) => {
    const esMOngoID = ObjectId.isValid( termino ) //True si si es -- False no lo es

    if ( esMOngoID ){
        const categoria = await Categoria.findById( termino )
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino, 'i') //Sea incensible a Mayusculas y Minusculas
    
    const categoria = await Categoria.find( { nombre:regex, estado:true } )
    res.status(201).json({
        results: categoria
    })
}

const buscarProductos = async ( termino='', res=response ) => {
    const esMOngoID = ObjectId.isValid( termino ) //True si si es -- False no lo es

    if ( esMOngoID ){
        const producto = await Producto.findById( termino )
                                .populate('categoria','nombre')
                                .populate('usuario','name')
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino, 'i') //Sea incensible a Mayusculas y Minusculas
    
    const producto = await Producto.find( { nombre:regex, estado:true } )
                        .populate('categoria','nombre')
                        .populate('usuario','name')
    res.status(201).json({
        results: producto
    })
}

const buscar = (req, res=response) => {
    const { coleccion, termino } = req.params
    if(!coleccionesPermitidas.includes( coleccion )) {
        res.status(400).json({
            msg: `Las coleccciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino, res )
        break;
        case 'categorias':
            buscarCategorias( termino, res )
        break;
        case 'productos':
            buscarProductos( termino, res )
        break;
        default:
            return res.status(500).json({
                msg:'Olvide terminar las busquedas'
            })
    }
}

module.exports = {
    buscar
}