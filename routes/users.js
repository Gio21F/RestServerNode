const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCapos } = require('../middlewares/validar-campos');

const { usersGet, 
    usersPost, 
    usersPut, 
    usersDelete } = require('../controllers/users');


const router = Router();

router.get('/', usersGet );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ),
    validarCapos
], usersPut );

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y minimo 6 caracteres').isLength({ min:6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExiste ),
    //check('role', 'No es un rol valido').isIn( [ 'ADMIN_ROLE','USER_ROLE' ] ),
    check('role').custom( esRoleValido ),
    validarCapos
] ,usersPost );

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCapos
] ,usersDelete )

module.exports = router;
