const jwt = require('jsonwebtoken')

const JwtAuth = (rolRequerido = null) => {
    return (req, res, next) => {
        const token = req.cookies.token
        if (!token) {
            res.redirect('/usuario/login')
            return;
        } 
    
        try {
            const user = jwt.verify(token, "SECRET")
            req.user = user
   
            if (rolRequerido != null) {
                if (user.user.rol !== rolRequerido) {
                    res.status(403).send('Acceso denegado: no tienes el rol necesario.');
                    //res.redirect('/usuario/login') // Cambiar esto
                    return;
                }
            }
            

            next()
        } catch(error) {
            console.log(error)
            res.clearCookie('token')
            res.redirect('/usuario/login')
        }
    }
} 

module.exports = JwtAuth

