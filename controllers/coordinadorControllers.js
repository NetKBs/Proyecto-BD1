const coordinadorModels = require('../models/coordinadorModels')
const representanteModels = require('../models/representanteModels')
const usuarioModels = require('../models/usuarioModels')
const generalModels = require('../models/generalModels')

exports.coordinador = async (req, res) => {
    res.render('coordinador/home')
}

exports.representante = async (req, res) => {
    res.render('coordinador/representante_home', {data:{}})
}

exports.representanteByCedula = async (req, res) => {
    body = req.query
    result = await representanteModels.representanteByCedula(body.representante)
    if (!result) {
        res.status(404).json({ error: 'Representante no encontrado' })
        res.redirect("/coordinador/representante")
    } else {
        res.render('coordinador/representante_home', { data: {representante: result} })
    }
    
    
}

exports.crearRepresentanteView = async (req, res) => {
    res.render('coordinador/representante_crear')
}

exports.crearRepresentante = async (req, res) => {
    body = req.body
    result = await representanteModels.crearRepresentante(body)
    if (result instanceof Error) {
        console.log("Ocurrió un error al crear el representante:", result.message);
        res.redirect("/coordinador/representante")
    } else {
        res.redirect('/coordinador/representante')
    }  
    
}

exports.editarRepresentanteView = async (req, res) => {
    representante_id = req.params.id
    result = await representanteModels.representanteById(representante_id)

    if (!result) {
        res.status(404).json({ error: 'Representante no encontrado' })
        res.redirect("/coordinador/representante")

    } else {
        if (result.usuario_id != null) {
            const user = await usuarioModels.getUsuarioById(result.usuario_id)
            res.render('coordinador/representante_modificar', { data: {representante: result, user} })
        } else {
            res.render('coordinador/representante_modificar', { data: {representante: result} })
        }

    }
}


exports.editarRepresentante = async (req, res) => {
    body = req.body
    id_representante = req.params.id

    result = await representanteModels.editarRepresentante(id_representante, body)

    if (result instanceof Error) {
        console.log("Ocurrio un error al editar el representante:", result.message);
        res.redirect("/coordinador/representante")
    } else {
        res.redirect('/coordinador/representante')
    }
}