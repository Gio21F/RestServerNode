const { Router } = require('express');
const { check } = require('express-validator');
const {cargaArchivo, updateImage, mostrarImagen, updateImageCloudinary} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCapos, validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', validarArchivo, cargaArchivo);

router.put('/:coleccion/:id', [ 
    validarArchivo,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ["usuarios","productos"])),
    validarCapos
] ,updateImageCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ["usuarios","productos"])),
    validarCapos
], mostrarImagen)

module.exports = router;