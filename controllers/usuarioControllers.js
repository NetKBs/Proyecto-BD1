const { render } = require("ejs")
const usuarioModels = require("../models/usuarioModels")
const coordinadorModels = require('../models/coordinadorModels')
const generalModels = require('../models/generalModels')

exports.login = async (req, res) => {
    res.render('login', {data: {}});
}

exports.loginAuth = async (req, res) => {
    const { username, password } = req.body;
    const user = await usuarioModels.getUsuarioByNombre(username)

    if (!user) {
        res.render('login', { data: { error: 'Usuario no encontrado' } })
        return
    }

    if (user.clave_acceso !== password) {
        res.render('login', { data: { error: 'Contraseña incorrecta' } })
        return
    }

    const rol = await usuarioModels.getTipoUsuarioById(user.tipo_usuario_id);
    if (!rol) {
        res.status(402).json({ error: 'Rol no encontrado' })
        return
    }

    switch (rol.nombre) {
        case 'Coordinador':
           const coordinador = await coordinadorModels.getCoordinadorByUserId(user.id)
           res.redirect('/coordinador/' + coordinador.id)
        
        case 'Docente':
        
        case 'Representante':

    }
};
