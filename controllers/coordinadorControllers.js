const coordinadorModels = require('../models/coordinadorModels')
const generalModels = require('../models/generalModels')

exports.coordinador = async (req, res) => {
    const id = req.params.id
    const coordinador = await coordinadorModels.getCoordinadorById(id)
    const coordDataPersonales = await generalModels.getDatosPersonalesById(coordinador.datos_personales_id)
    const coordinadorJsonData = {
        id: coordinador.id,
        usuario: coordinador.usuario_id,
        activo: coordinador.activo,
        fecha_ingreso: coordinador.fecha_ingreso,
        fecha_salida: coordinador.fecha_salida,
        datos_personales: coordDataPersonales
    }

    res.render('result_test', {data: coordinadorJsonData})
}