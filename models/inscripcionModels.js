const db = require('../db/connection')

exports.inscripcionCrear = async (body) => {
    return await new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO inscripcion_estudiante_anio (
            estudiante_id, periodo_id, anio, seccion
            ) 
            VALUES (?, ?, ?, ?)`,
            [body.estudiante_id, body.periodo_id, body.grado, body.seccion],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    })
    
}

exports.getEstudiantesInscritosFiltrados = async (body) => {
    try {

        return await new Promise((resolve, reject) => {
            db.all(
                `
                SELECT * FROM inscripcion_estudiante_anio
                WHERE periodo_id = ? AND anio = ? AND seccion = ?
                `,
                [body.periodo_id, body.anio, body.seccion],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            )
        })

    } catch (error) {
        console.log(error.message)
        throw error
    }
}