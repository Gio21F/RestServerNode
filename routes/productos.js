const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, buscarProductoporId, eliminarProducto, actualizarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarCapos, esAdminRole } = require('../middlewares');
const router = Router();

//Obtener todos los productos
router.get('/', obtenerProductos);

//Crear categoria -- Cualquier role con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id-categoria de Mongo').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCapos
] ,crearProducto );

//Buscar producto por ID
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCapos
], buscarProductoporId );

//Borrar una categoria -- Solo si es admin con token valido
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCapos
], eliminarProducto)

//actualizar categoria -- Cualquier role con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCapos
], actualizarProducto)

module.exports = router;