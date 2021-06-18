const { response, request } = require("express")


const esAdminRole = ( req = request, res = response, next ) => {
    if( !req.user ){
        return res.status(500).json({
            msg:'Se quiere validar el rol sin validar el token primero'
        })
    }

    const { rol, name } = req.user;
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `El usuario: ${ name } no tiene acceso de administrador`
        })
    }
    next();
}
//...roles todo lo que la persona mande sera un arreglo
const tieneRole = ( ...roles ) => {
    return ( req = request, res = response, next ) => {
        if( !req.user ){
            return res.status(500).json({
                msg:'Se quiere validar el rol sin validar el token primero'
            })
        }

        if ( !roles.includes( req.user.role ) ) {
            return res.status(401).json({
                msg:'No tiene un rol permitido'
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}