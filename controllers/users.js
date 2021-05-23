const { response } = require('express');

const usersGet = ( req,res = response ) => {

    const { nombre = null, edad } = req.query;

    res.json({
        msj:'Get -- controller',
        nombre,
        edad
    });
}

const usersPut = ( req,res = response ) => {
    const { id } = req.params;
    res.json({
        msj:'Put -- controller',
        id
    });
}

const usersPost = ( req,res = response ) => {
    const body = req.body;
    res.json({
        msj:'Post -- controller',
        body
    });
}

const usersDelete = ( req,res = response ) => {
    res.json({
        msj:'Delete -- controller'
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}