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
        res.render('coordinador/calificaciones-boletin', {data:{}})

    } else {
        //res.redirect('/coordinador/calificaciones')
        res.render('coordinador/calificaciones-home', {data:{error: 'Alumno no encontrado'}})
    }
    
    

}