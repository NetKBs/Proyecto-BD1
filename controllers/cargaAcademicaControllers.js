const cargaAcademicaModels = require('../models/cargaAcademicaModels')
const periodoModels = require('../models/periodoModels')
const asignaturaModels = require('../models/asignaturaModels')
const docenteModels = require('../models/docenteModels')

exports.cargaAcademica = (req, res) => {
    res.render('coordinador/cargaAcademica-home', {data: {}})
}

exports.crearCargaAcademicaView = async (req, res) => {
    const periodoActivo = await periodoModels.buscarPeriodoActivo();
    const periodoDatos = await periodoModels.getPeriodoById(periodoActivo.id);
    const asignaturas = await asignaturaModels.getAsignaturas();
    res.render('coordinador/cargaAcademica-crear', {data: {periodo: periodoDatos, asignaturas: asignaturas}})
}

exports.crearCargaAcademica = async (req, res) => {
    const body = req.body
    const periodoActivo = (await periodoModels.buscarPeriodoActivo()).id;
    const profesor = (await docenteModels.docenteByCedula(body.profesor));
    
    if (profesor) {
        const newBody = {
            periodo_id: periodoActivo,
            docente_id: profesor.id,
            materia_id: parseInt(body.materia),
            anio: parseInt(body.grado),
            seccion: body.seccion
        }

        await cargaAcademicaModels.crearCargaAcademica(newBody)

        res.redirect('/coordinador/carga-academica')
        return
    }

}

exports.buscarCargaAcademica = async (req, res) => {
    body = req.query
    docente = await docenteModels.docenteByCedula(body.docente)
    cargas = await cargaAcademicaModels.cargasByDocenteID(docente.id)
    res.render('coordinador/cargaAcademica-home', {data: {docente: docente, cargas: cargas}})
}

exports.editarCargaAcademicaView = async (req, res) => {
    const carga_id = req.params.id
    const periodoActivo = await periodoModels.buscarPeriodoActivo();
    const periodoDatos = await periodoModels.getPeriodoById(periodoActivo.id);
    const asignaturas = await asignaturaModels.getAsignaturas();
    let cargaData = await cargaAcademicaModels.getCargaAcademicaById(carga_id)

    cargaData = {
        materia_id: cargaData.materia_id,
        anio: cargaData.anio,
        seccion: cargaData.seccion
    }
    res.render('coordinador/cargaAcademica-editar', {data: {carga_id: carga_id, cargaData: cargaData, periodo: periodoDatos, asignaturas: asignaturas}})
}

exports.editarCargaAcademica = async (req, res) => {
    body = req.body
    const result = await cargaAcademicaModels.editarCargaAcademica(body)
    if (true) {
        res.redirect('/coordinador/carga-academica')
        return
    }
    
}