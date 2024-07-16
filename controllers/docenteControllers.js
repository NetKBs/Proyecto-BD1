const docenteModels = require('../models/docenteModels')
const usuarioModels = require('../models/usuarioModels')
const cargaAcademicaModels = require('../models/cargaAcademicaModels')
const periodoModels = require('../models/periodoModels')
const asignaturaModels = require('../models/asignaturaModels')
const inscripcionModels = require('../models/inscripcionModels')
const calificacionModels = require('../models/calificacionesModels')
const estudianteModels = require('../models/estudianteModels')

exports.docentePanel = async (req, res) => {
    res.render('docente/home', {data:{}})
}

exports.claveView = async (req, res) => {
    res.render('docente/passwordChange', {data:{}})
}

exports.clave = async (req, res) => {
    body = req.body
    user = req.user.user
    userData =  await usuarioModels.getUsuarioById(user.user_id)
    
    if (body.actual_clave != userData.clave_acceso) {
        console.log({ error: 'La contraseña actual no coincide' })
        res.render('docente/passwordChange', {data:{error: 'La contraseña actual no coincide'}})

    } else if (body.nueva_clave != body.nueva_clave2) {
        console.log({ error: 'Las nuevas contraseña no coinciden' })
        res.render('docente/passwordChange', {data:{error: 'Las nuevas contraseña no coinciden'}})

    } else {
        result = await usuarioModels.actualizarClave(user.user_id, body.nueva_clave)
        res.redirect('/auth/logout')
    }
}

exports.cargaNotasView = async (req, res) => {
    const user = req.user.user
    const cargas = await cargaAcademicaModels.cargasByDocenteID(user.id)
    const periodoActivo = await periodoModels.buscarPeriodoActivo();
    console.log(periodoActivo)
    const periodoDatos = await periodoModels.getPeriodoById(periodoActivo.id);
    const asignaturas = await asignaturaModels.getAsignaturas();
    res.render('docente/notes', {data:{cargas: cargas, asignaturas: asignaturas, periodo: periodoDatos}})
}

exports.listado = async (req, res) => {
    const body = req.query
    const user = req.user.user
    const cargas = await cargaAcademicaModels.cargasByDocenteID(user.id)
    const periodoActivo = await periodoModels.buscarPeriodoActivo();
    const periodoDatos = await periodoModels.getPeriodoById(periodoActivo.id);
    const asignaturas = await asignaturaModels.getAsignaturas();

    const newBody = {
        periodo_id: periodoActivo.id,
        anio: parseInt(body.grado),
        seccion: body.seccion
    }
    const resultEstudiantes = await inscripcionModels.getEstudiantesInscritosFiltrados(newBody)

    if (resultEstudiantes != []) {
        resultEstudiantes.materia = parseInt(body.materia)
        const calificacionesEstudiantes = await calificacionModels.getCalificacionesEstudiantes(resultEstudiantes)

        if (calificacionesEstudiantes != []) {

            const calificaciones = []
            for (let i = 0; i < resultEstudiantes.length; i++) {
                const estudianteData = await estudianteModels.estudianteById(resultEstudiantes[i].estudiante_id)
                const nombre = estudianteData.primer_nombre + " " + estudianteData.primer_apellido
                const cedula = estudianteData.cedula

                calificaciones.push({estudiante_id: resultEstudiantes[i].estudiante_id, cedula: cedula, 
                    nombre: nombre, calificaciones: calificacionesEstudiantes[i], materia_id: body.materia, 
                    anio: body.grado, seccion: body.seccion})
            }

            res.render('docente/notes', {data:{cargas: cargas, asignaturas: asignaturas, periodo: periodoDatos, calificaciones: calificaciones}})
        }
    }
    
}

exports.cargaNotasGuardar = async (req, res) => {
    body = req.body
    console.log("Entre")
    const result = await calificacionModels.cargarNotas(body)
    console.log("Ya terminé señor")
}




/* 
    FUCCIONES DE DOCENTE PARA EL COORDINADOR
*/

exports.docente = (req, res) => {
    res.render('coordinador/docente_home', {data:{}})
}

exports.crearDocenteView = async (req, res) => {
    res.render('coordinador/docente_registro', {data:{}})
}

exports.crearDocente = async (req, res) => {
    try {
        body = req.body
        result = await docenteModels.crearDocente(body)
        if (result instanceof Error) {
            console.log("Ocurrió un error al crear el docente:", result.message);
            res.redirect("/coordinador/docente")
            return
        }
        res.redirect('/coordinador/docente')
        
    } catch (error) {
        console.log({ error: 'Ocurrió un error al crear el docente:', message: error.message });
        res.redirect("/coordinador/docente")
    }
}

exports.docenteByCedula = async (req, res) => {
    body = req.query
    result = await docenteModels.docenteByCedula(body.docente)

    if (!result) {
        console.log({ error: 'Docente no encontrado' })
        res.redirect("/coordinador/docente")

    } else {
        const fechaNacimiento = new Date(result.fecha_nacimiento);
        const fechaActual = new Date();
        const edad = Math.floor((fechaActual - fechaNacimiento) / (1000 * 60 * 60 * 24 * 365.25));
        result.edad = edad
        res.render('coordinador/docente_home', { data: {docente: result} })
    }
}

exports.editarDocenteView = async (req, res) => {
    docente_id = req.params.id
    result = await docenteModels.docenteById(docente_id)

    if (!result) {
        console.log({ error: 'Docente no encontrado' })
        res.redirect("/coordinador/docente")

    } else {

        if (result.usuario_id != null) {
            const user = await usuarioModels.getUsuarioById(result.usuario_id)
            res.render('coordinador/docente_modificar', { data: {docente: result, user} })
        } else {
            res.render('coordinador/docente_modificar', { data: {docente: result} })
        }

    }
}


exports.editarDocente = async (req, res) => {
    body = req.body
    id_docente = req.params.id
    result = await docenteModels.editarDocente(id_docente, body)

    if (result instanceof Error) {
        console.log("Ocurrio un error al editar el docentee:", result.message);
        res.redirect("/coordinador/docente")
    } else {
        res.redirect('/coordinador/docente')
    }
}