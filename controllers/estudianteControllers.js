const estudianteModels = require('../models/estudianteModels')

exports.estudiante = async (req, res) => {
    res.render('coordinador/estudiante_home', {data:{}})
}

exports.estudianteByCedula = async (req, res) => {
    body = req.query
    result = await estudianteModels.estudianteByCedula(body.estudiante)
    if (!result) {
        res.status(404).json({ error: 'estudiante no encontrado' })
        res.redirect("/coordinador/estudiante")

    } else {
        const fechaNacimiento = new Date(result.fecha_nacimiento);
        const fechaActual = new Date();
        const edad = Math.floor((fechaActual - fechaNacimiento) / (1000 * 60 * 60 * 24 * 365.25));
        result.edad = edad
        res.render('coordinador/estudiante_home', { data: {estudiante: result} })
    }
    
    
}

exports.crearEstudianteView = async (req, res) => {
    res.render('coordinador/estudiante_crear')
}

exports.crearEstudiante = async (req, res) => {
    try {
        body = req.body
        result = await estudianteModels.crearEstudiante(body)
        if (result instanceof Error) {
            console.log("Ocurrió un error al crear el estudiante:", result.message);
            res.redirect("/coordinador/estudiante")
        } else {
            res.redirect('/coordinador/estudiante')
        } 
    } catch (error) {
        console.log({ error: 'Ocurrió un error al crear el estudiante:', message: error.message });
        res.redirect("/coordinador/estudiante")
    }
}

exports.editarEstudianteView = async (req, res) => {
    estudiante_id = req.params.id
    result = await estudianteModels.estudianteById(estudiante_id)

    if (!result) {
        res.status(404).json({ error: 'estudiante no encontrado' })
        res.redirect("/coordinador/estudiante")

    } else {
        res.render('coordinador/estudiante_modificar', { data: {estudiante: result} })
    }
}


exports.editarEstudiante = async (req, res) => {
    body = req.body
    id_estudiante = req.params.id

    result = await estudianteModels.editarEstudiante(id_estudiante, body)

    if (result instanceof Error) {
        console.log("Ocurrio un error al editar el estudiante:", result.message);
        res.redirect("/coordinador/estudiante")
    } else {
        
        res.redirect('/coordinador/estudiante/')
    }
}