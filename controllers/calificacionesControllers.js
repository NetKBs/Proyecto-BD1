const estudianteModels = require('../models/estudianteModels')
const calificacionesModels = require('../models/calificacionesModels')


exports.calificaciones = async (req, res) => {
    res.render('coordinador/calificaciones-home', {data:{}})
}

exports.boletin = async (req, res) => {
    body = req.query
    const estudiante = await estudianteModels.estudianteByCedula(body.cedula_alumno)
    
    if (estudiante) {
        const boletin = await calificacionesModels.getBoletinesNotas(estudiante.id, body.grado)
        if (boletin instanceof Error) {
            res.render('coordinador/calificaciones-home', {data:{error: boletin.message}})
            
        } else {
           // console.log(boletin)
            res.render('coordinador/calificaciones-boletin', {data:{boletin: boletin}})
        }


    } else {
        //res.redirect('/coordinador/calificaciones')
        res.render('coordinador/calificaciones-home', {data:{error: 'Alumno no encontrado'}})
    }


}

exports.finales = async (req, res) => {
    body = req.query
    const estudiante = await estudianteModels.estudianteByCedula(body.cedula_alumno)

    if (estudiante) {
        const notas = await calificacionesModels.getNotasFinales(estudiante.id)
        if (notas instanceof Error) {
            res.render('coordinador/calificaciones-home', {data:{error: notas.message}})
            
        } else {
            res.render('coordinador/calificaciones-finales', {data:{notas: notas}})
        }


    } else {
        //res.redirect('/coordinador/calificaciones')
        res.render('coordinador/calificaciones-home', {data:{error: 'Alumno no encontrado'}})
    }
}

exports.clases = async (req, res) => {
    body = req.query
}