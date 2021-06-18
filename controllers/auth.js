const { response } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require("../helpers/generar-jwt");


const login = async(req, res=response) => {
    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await User.findOne( { email } );
        if ( !usuario ){
            return res.status(400).json({
                msg:'Usuario y/o password no son correctos - email'
            })
        }

        //Verificar si el usuario esta activo
        if ( !usuario.status ){
            return res.status(400).json({
                msg:'Usuario y/o password no son correctos - Estado: Inactivo'
            })
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password )
        if ( !validPassword ){
            return res.status(400).json({
                msg:'Usuario y/o password no son correctos - Password'
            })
        }
        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hanle con el administrador'
        });
    }
    
}

module.exports = {
    login
}
