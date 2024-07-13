const asignaturaModels = require('../models/asignaturaModels')

exports.asignatura = async (req, res) => {
    const result = await asignaturaModels.getAsignaturas()
    res.render('coordinador/asignatura_home', {data:{asignatura: result}})
}

exports.crearAsignatura = async (req, res) => {
    body = req.body
    const result = await asignaturaModels.crearAsignatura(body)
    return res.redirect('/coordinador/asignatura')
}

exports.editarAsignaturaView = async (req, res) => {
    const id = req.params.id
    const result = await asignaturaModels.getAsignaturaById(id)
    res.render('coordinador/asignatura_modificar', {data:{asignatura: result}})
}

exports.editarAsignatura = async (req, res) => {
    const id = req.params.id
    body = req.body
    const result = await asignaturaModels.editarAsignatura(id, body)
    return res.redirect('/coordinador/asignatura')
}