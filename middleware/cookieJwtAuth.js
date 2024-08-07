const jwt = require('jsonwebtoken')

const JwtAuth = (rolRequerido = null) => {
    return (req, res, next) => {
        console.log("hola")
        const token = req.cookies.token
        if (!token) {
            res.redirect('/auth/login')
            return;
        } 
    
        try {
            const user = jwt.verify(token, "SECRET")
            req.user = user
            console.log("hola")
            if (rolRequerido != null) {
                if (user.user.rol !== rolRequerido) {
                    res.status(403).send('Acceso denegado: no tienes el rol necesario.');
                    res.redirect('/auth/login')
                    next()
                    return;
                }
            }
            

            next()
        } catch(error) {
            console.log(error)
            res.clearCookie('token')
            res.redirect('/auth/login')
        }
    }
} 

module.exports = JwtAuth

