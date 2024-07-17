const periodoModels = require('../models/periodoModels')
const estudianteModels = require('../models/estudianteModels')
const inscripcionModels = require('../models/inscripcionModels')

exports.inscripcion = async (req, res) => {
    const periodoActivo = await periodoModels.buscarPeriodoActivo();
    if (!periodoActivo) {
        res.redirect('/coordinador');
        return;
    }
    const periodoDatos = await periodoModels.getPeriodoById(periodoActivo.id);
    res.render('coordinador/inscripcion_home', {data:{periodo: periodoDatos}})
}

exports.inscripcionCrear = async (req, res) => {
    const data = req.body;
    const estudiante = await estudianteModels.estudianteByCedula(data.estudiante)
    if (estudiante) {
        data.estudiante_id = estudiante.id
        const inscripcion = await inscripcionModels.inscripcionCrear(data)
        res.redirect('/coordinador/inscripcion')
    }
    
}