const estudianteModels = require('../models/estudianteModels')
const calificacionesModels = require('../models/calificacionesModels')
const periodoModels = require('../models/periodoModels')
const asignaturaModels = require('../models/asignaturaModels')


exports.calificaciones = async (req, res) => {
    const asignaturas = await asignaturaModels.getAsignaturas();
    const periodo = await periodoModels.getPeriodos();

    res.render('coordinador/calificaciones-home', {data:{asignaturas: asignaturas, periodos: periodo}})
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
    const result = await calificacionesModels.getNotasFinalByPeriodoSeccionMateria(body.periodo, body.seccion, body.materia)
    
    result.notas.forEach(anio => {
        let cantidad_aprobados = 0;
        let cantidad_reprobados = 0;
        let suma_notas = 0;
        const aprobados = [];
        const reprobados = [];
        anio.forEach(nota => {
            suma_notas += parseFloat(nota.notaFinal);
            if (parseFloat(nota.notaFinal) >= 10) {
                cantidad_aprobados++;
                aprobados.push(nota);
            } else {
                cantidad_reprobados++;
                reprobados.push(nota);
            }
        });
        const promedio = suma_notas / anio.length;
        anio.promedio = promedio.toFixed(2);
        anio.cantidad_aprobados = cantidad_aprobados;
        anio.cantidad_reprobados = cantidad_reprobados;
        anio.aprobados = aprobados;
        anio.reprobados = reprobados;
    });

    console.log(result)
    res.render('coordinador/calificaciones-clases', {data: result})
}
