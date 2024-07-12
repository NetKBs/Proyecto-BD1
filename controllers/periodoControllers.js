const periodoModels = require('../models/periodoModels')

exports.periodo = async (req, res) => {
    res.render('coordinador/periodo_home', {data:{}})
}

exports.crearPeriodoView = async (req, res) => {
    res.render('coordinador/periodo_crear', {data:{}})
}

exports.crearPeriodo = async (req, res) => {
    body = req.body
    const result = await periodoModels.crearPeriodo(body)
}