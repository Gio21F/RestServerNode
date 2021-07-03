const { Router } = require('express');
const { check } = require('express-validator');
const { 
    validarJWT,
    validarCapos,
    esAdminRole
} = require('../middlewares');

const { 
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorID,
    actualizarCategoria,
    borrarCategoria
 } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

//{{url}}/api/categorias

//Obtener categorias - publico
router.get('/', obtenerCategorias);


//Obtener categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCapos
], obtenerCategoriaPorID );


//Crear categoria -- Cualquier role con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCapos   
], crearCategoria )


//actualizar categoria -- Cualquier role con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCapos
], actualizarCategoria)

//Borrar una categoria -- Solo si es admin con token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCapos
], borrarCategoria)
module.exports = router;
