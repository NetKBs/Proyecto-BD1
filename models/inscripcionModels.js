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

exports.getEstudianteByIdAnio = async (id_estudiante, anio) => {
    try {
        return await new Promise((resolve, reject) => {
            db.all(
                `
                SELECT * FROM inscripcion_estudiante_anio
                WHERE estudiante_id = ? AND anio = ?
                ORDER BY id DESC
                `,
                [id_estudiante, anio],
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


exports.getEstudiantesByPeriodoSeccion = async (periodo_id, seccion) => {
    try {
        return await new Promise((resolve, reject) => {
            db.all(
                `
                SELECT * FROM inscripcion_estudiante_anio
                WHERE periodo_id = ? AND seccion = ?
                `,
                [periodo_id, seccion],
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

exports.getEstudianteById = async (id_estudiante) => {
    try {
        return await new Promise((resolve, reject) => {
            db.all(
                `
                SELECT * FROM inscripcion_estudiante_anio
                WHERE estudiante_id = ?
                ORDER BY id DESC
                `,
                [id_estudiante],
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