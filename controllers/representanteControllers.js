const representanteModels = require('../models/representanteModels')
const estudianteModels = require('../models/estudianteModels')
const usuarioModels = require('../models/usuarioModels')

exports.representante = async (req, res) => {
    res.render('coordinador/representante_home', {data:{}})
}

exports.representanteByCedula = async (req, res) => {
    body = req.query
    result = await representanteModels.representanteByCedula(body.representante)
    if (!result) {
        console.log({ error: 'Representante no encontrado' })
        res.redirect("/coordinador/representante")

    } else {
        const fechaNacimiento = new Date(result.fecha_nacimiento);
        const fechaActual = new Date();
        const edad = Math.floor((fechaActual - fechaNacimiento) / (1000 * 60 * 60 * 24 * 365.25));
        result.edad = edad

        const representados = await representanteModels.buscarRepresentadoByRepresentanteId(result.id)
        res.render('coordinador/representante_home', { data: {representante: result, representados: representados} })
    }
}



exports.crearRepresentanteView = async (req, res) => {
    res.render('coordinador/representante_crear')
}

exports.crearRepresentante = async (req, res) => {
    body = req.body
    result = await representanteModels.crearRepresentante(body)
    if (result instanceof Error) {
        console.log("Ocurrió un error al crear el representante:", result.message);
        res.redirect("/coordinador/representante")
    } else {
        res.redirect('/coordinador/representante')
    }  
    
}

exports.editarRepresentanteView = async (req, res) => {
    representante_id = req.params.id
    result = await representanteModels.representanteById(representante_id)

    if (!result) {
        console.log({ error: 'Representante no encontrado' })
        res.redirect("/coordinador/representante")

    } else {
        if (result.usuario_id != null) {
            const user = await usuarioModels.getUsuarioById(result.usuario_id)
            res.render('coordinador/representante_modificar', { data: {representante: result, user} })
        } else {
            res.render('coordinador/representante_modificar', { data: {representante: result} })
        }

    }
}


exports.editarRepresentante = async (req, res) => {
    body = req.body
    id_representante = req.params.id
    result = await representanteModels.editarRepresentante(id_representante, body)

    if (result instanceof Error) {
        console.log("Ocurrio un error al editar el representante:", result.message);
        res.redirect("/coordinador/representante")
    } else {
        res.redirect('/coordinador/representante')
    }
}

exports.eliminarRepresentante = async (req, res) => {
    representante_id = req.params.id
    result = await representanteModels.eliminarRepresentante(representante_id)

    if (result instanceof Error) {
        console.log("Ocurrio un error al eliminar el representante:", result.message);
        res.redirect("/coordinador/representante")
        return
    } 

    res.redirect('/coordinador/representante')
    
}



exports.crearRepresentado = async (req, res) => {
    representante_id = req.params.id
    estudiante_cedula = req.body.representado
    estudiante_id = (await estudianteModels.estudianteByCedula(estudiante_cedula)).id

    if (!estudiante_id) {
        console.log({ error: 'Estudiante no encontrado' })
        res.redirect("/coordinador/representante")
        return
    } 

    result = await representanteModels.crearRepresentado(representante_id, estudiante_id)
    if (result instanceof Error) {
        console.log("Ocurrio un error al crear el representado:", result.message);
        res.redirect("/coordinador/representante")
        return
    } 

    //representado = await representanteModels.buscarRepresentadoByRepresentanteId(representante_id)

    res.redirect('/coordinador/representante')
}

exports.eliminarRepresentado = async (req, res) => {
    representante_id = req.params.representante_id
    representado_id = req.params.representado_id
    result = await representanteModels.eliminarRepresentado(representante_id, representado_id)

    if (result instanceof Error) {
        console.log("Ocurrio un error al eliminar el representado:", result.message);   
        res.redirect("/coordinador/representante")
        return
    } 
    representante_cedula = (await representanteModels.representanteById(representante_id)).cedula
    res.redirect('/coordinador/representante/buscar?representante=' + representante_cedula)
    
}