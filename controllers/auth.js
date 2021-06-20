const { response } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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

const googleSignIn = async(req, res=response) => {
    
    const { id_token } = req.body;
    
    try {
        const { email, name, img } = await googleVerify( id_token )
        let user = await User.findOne( { email } );
        if ( !user ) {
            //Tengo que crearlo
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            }
            
            user = new User( data );
            await user.save();
        }

        //  Si el usuario esta fuera de linea
        if ( !user.status ) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario fuera de linea'
            })
        }

        //Generar JWT
        const token = await generarJWT( user.id );

        res.json({
            user,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            msg:'Token de Google no reconocido'
        })
    }
    
}

module.exports = {
    login,
    googleSignIn
}
