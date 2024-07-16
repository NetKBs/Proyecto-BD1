const { render } = require("ejs")
const jwt = require("jsonwebtoken")
const usuarioModels = require("../models/usuarioModels")
const coordinadorModels = require('../models/coordinadorModels')
const docenteModels = require('../models/docenteModels')
const representanteModels = require('../models/representanteModels')

exports.signUp = (req, res) => {
    res.render('signup', { data: {} });
}

exports.signUpAuth = async (req, res) => {
    const body = req.body
    const representante = await representanteModels.representanteByCedula(body.cedula)
    if (!representante) {
        console.log("No existe representante")
        res.redirect("/auth/signup")
        return

    } 

    if (representante.usuario_id != null) {
        console.log("Este representante ya tiene cuenta")
        res.redirect("/auth/login")
        return
    }

    const usuarioExists = await usuarioModels.getUsuarioByNombre(body.username)
    if (usuarioExists) {
        console.log("El usuario ya existe")
        res.redirect("/auth/signup")
        return
    }


    const idUsuario = await usuarioModels.crearUsuario(body)
    console.log(idUsuario)
    const asignar = await representanteModels.asignarUsuarioId(representante.id, idUsuario)

    res.redirect('/auth/login')
}


exports.login = (req, res) => {
    
    if (req.cookies.token) {
  
        return alreadyLoggedIn(req, res);
    }
    res.render('login', { data: {} });

};

const alreadyLoggedIn = (req, res) => {
    try {
     
        const user = jwt.verify(req.cookies.token, "SECRET");
        switch (user.user.rol) {
            case 'Coordinador':
                return res.redirect('/coordinador');
            case 'Representante':
                return res.redirect('/representante');
            case 'Docente':
                return res.redirect('/docente');
            default:
                return res.redirect('/');
        }

    } catch (error) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
};

exports.logout = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect('/auth/login');
    }

    res.clearCookie('token');
    res.redirect('/');
};

exports.loginAuth = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await usuarioModels.getUsuarioByNombre(username);
        if (!user || user.clave_acceso !== password) {
            return res.render('login', { data: { error: 'Credenciales incorrectas' } });
        }

        const rol = await usuarioModels.getTipoUsuarioById(user.tipo_usuario_id);
        if (!rol) {
            return res.status(402).json({ error: 'Rol no encontrado' });
        }

        const userData = {
            id: await getUserDataByRol(rol.nombre, user.id),
            rol: rol.nombre,
            user_id: user.id
        };
        

        loggedIn(userData, res);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const loggedIn = (user, res) => {
    const token = createToken(user);

    if (!token) {
        return res.status(401).json({ error: 'No se pudo autenticar al usuario' });
    }

    res.cookie('token', token, { httpOnly: true });

    switch (user.rol) {
        case 'Coordinador':
            return res.redirect('/coordinador');
        case 'Representante':
            return res.redirect('/representante'); 
            break;
        case 'Docente':
            return res.redirect('/docente'); 
            break;
        default:
            return res.redirect('/');
    }
};

const createToken = (user) => {
    return jwt.sign({ user }, "SECRET", { expiresIn: '5h' });
};

const getUserDataByRol = async (rol, id) => {

    switch (rol) {
        case 'Coordinador':
            return (await coordinadorModels.getCoordinadorByUserId(id)).id 
        case 'Representante':
            return (await representanteModels.getRepresentanteByUserId(id)).id;
        case 'Docente':
            return (await docenteModels.getDocenteByUserId(id)).id
        default:
            console.log("Estoy en default")
            return {};
    }
};
