const periodoModels = require('../models/periodoModels')

exports.periodo = async (req, res) => {
    result = await periodoModels.getPeriodos()
    res.render('coordinador/periodo_home', {data:{periodos: result}})
}

exports.crearPeriodoView = async (req, res) => {
    res.render('coordinador/periodo_crear', {data:{}})
}

exports.crearPeriodo = async (req, res) => {
    body = req.body
    const result = await periodoModels.crearPeriodo(body)
    return res.redirect('/coordinador/periodo')
}

exports.editarPeriodoView = async (req, res) => {
    const periodo_id = req.params.id
    const result = await periodoModels.getPeriodoById(periodo_id)
   
    res.render('coordinador/periodo_editar', {data:{periodo: result}})
}

exports.editarPeriodo = async (req, res) => {
    const id = req.params.id
    body = req.body
    const result = await periodoModels.editarPeriodo(id, body)
    return res.redirect('/coordinador/periodo')
}