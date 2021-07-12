const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { User,Producto } = require("../models")

const cargaArchivo = async( req, res=response) => {
 
    try {
        const nombre = await subirArchivo( req.files, ['txt','md'] );
        return res.status(201).json({ nombre })
    } catch (msg) {
        return res.status(400).json({ msg })
    }
}

const updateImage = async( req, res = response ) => {
    const { coleccion, id } = req.params;
    
    let modelo;
    
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById( id );
            if ( !modelo ) {
                return res.status(400).json({msg:'No Existe un usuario con ese ID'})
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({msg:'No Existe un producto con ese ID'})
            }
        break;
    
        default:
            return res.status(500).json({ msg:'Algo anda mal en la actualizacion de imagenes: User,Product'})
    }

    //Limpiar imagenes previas
    if ( modelo.img ) {
        //Borrar imagen de servidor
        const pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img )
        if ( fs.existsSync( pathImg ) ) {
            fs.unlinkSync( pathImg )
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion ) 
    modelo.img = nombre;

    await modelo.save();

    res.status(201).json({ modelo });
}


const updateImageCloudinary = async( req, res = response ) => {
    const { coleccion, id } = req.params;
    
    let modelo;
    
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById( id );
            if ( !modelo ) {
                return res.status(400).json({msg:'No Existe un usuario con ese ID'})
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({msg:'No Existe un producto con ese ID'})
            }
        break;
    
        default:
            return res.status(500).json({ msg:'Algo anda mal en la actualizacion de imagenes: User,Product'})
    }

    //Limpiar imagenes previas
    if ( modelo.img ) {
        //Borrar imagen de Cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy( public_id );
        
    }
    
    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url
    await modelo.save();

    return res.status(201).json({ modelo });
}


const mostrarImagen = async(req, res=response) => {
    const { coleccion, id } = req.params;
    
    let modelo;
    
    switch ( coleccion ) {
        case 'usuarios':
            modelo = await User.findById( id );
            if ( !modelo ) {
                return res.status(400).json({msg:'No Existe un usuario con ese ID'})
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );
            if ( !modelo ) {
                return res.status(400).json({msg:'No Existe un producto con ese ID'})
            }
        break;
    
        default:
            return res.status(500).json({ msg:'Algo anda mal en la actualizacion de imagenes: User,Product'})
    }

    //Limpiar imagenes previas
    let pathImg;
    if ( modelo.img ) {
        //Borrar imagen de servidor
        pathImg = path.join( __dirname, '../uploads', coleccion, modelo.img )
        if ( fs.existsSync( pathImg ) ) {
            return res.sendFile( pathImg )
        }
    }

    pathImg = path.join( __dirname, '../assets',  "no-image.jpg")
    return res.sendFile( pathImg );
}

module.exports = {
    cargaArchivo,
    updateImage,
    mostrarImagen,
    updateImageCloudinary
}