const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');
    
    if ( !token ) {
        return res.status(401).json({
            msg:'No tienes acceso -- No se recibio token'
        })
    }

    try {
        //Leer el usuario correspòndiente al uid
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ) 
        const usuario = await User.findById( uid );
        //Verificar si el usuario no existe
        if ( !usuario ) {
            return res.status(401).json({
                msg:'Token no valido - Usuario no existente'
            })
        }


        //Verificar si el usuario que intenta borrar no esta fuera de linea
        if ( !usuario.status ) {
            return res.status(401).json({
                msg:'Token no valido - Usuario fuera de linea'
            })
        }

        req.user = usuario

        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}