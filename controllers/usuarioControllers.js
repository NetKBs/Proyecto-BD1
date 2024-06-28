const { render } = require("ejs")
const jwt = require("jsonwebtoken")
const usuarioModels = require("../models/usuarioModels")
const coordinadorModels = require('../models/coordinadorModels')

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
                //return res.redirect('/representante');
                break;
            case 'Docente':
                //return res.redirect('/docente');
                break;
            default:
                return res.redirect('/');
        }
    } catch (error) {
        res.clearCookie('token');
        res.redirect('/usuario/login');
    }
};

exports.logout = (req, res) => {
    if (!req.cookies.token) {
        return res.redirect('/usuario/login');
    }

    res.clearCookie('token');
    res.redirect('/usuario/login'); // Cambiar al home o algo así
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
            id: user.id,
            rol: rol.nombre,
            ...getUserDataByRol(user.rol, user.id)
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
            //return res.redirect('/representante'); 
            break;
        case 'Docente':
            //return res.redirect('/docente'); 
            break;
        default:
            return res.redirect('/');
    }
};

const createToken = (user) => {
    return jwt.sign({ user }, "SECRET", { expiresIn: '1h' });
};

const getUserDataByRol = (rol, id) => {
    switch (rol) {
        case 'Coordinador':
            return { coord_id: coordinadorModels.getCoordinadorByUserId(id).id };
        case 'Representante':
            //return { repre_id: getRepresentanteByUserId(id).id };
        case 'Docente':
            //return { docen_id: getDocenteByUserId(id).id };
        default:
            return {};
    }
};
