const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');


const usersGet = async ( req = request ,res = response ) => {

    const { limit = 5, desde = 0 } = req.query;
    const [ total, usuarios] = await Promise.all([
        User.countDocuments({status:true}),
        User.find({status:true})
            .skip(Number(desde))
            .limit(Number(limit))
    ])
    res.json({
        total,
        usuarios
    });
}

const usersPut = async ( req,res = response ) => {
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //Valiodar contra base de datos
    if( password ){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const user = await User.findByIdAndUpdate( id, resto );
    res.json(user);
}

const usersPost = async ( req,res = response ) => {
     
    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role } );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );
    //Guardar en base de datos
    await user.save();
    res.json({
        msj:'Post -- controller',
        user
    });
}

const usersDelete = async ( req,res = response ) => {
    const { id } = req.params;
    //Borrar fisicamente
    //const usuario = await User.findByIdAndDelete( id );
    const usuario = await User.findByIdAndUpdate( id, { status: false } )
    res.json({
        usuario
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}