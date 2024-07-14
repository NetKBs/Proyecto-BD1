const db = require('../db/connection')


exports.getCalificacionesEstudiantes = async (body) => {
    try {
        // Recorrer el array de estudiantes y tratar de encontrar registros en la tabla calificaciones (Usar promesas)
        const materia_id = body.materia
        const promises = body.map(async (body) => {
            return await new Promise((resolve, reject) => {
                db.all(
                    `SELECT id as calificacion_id, lapso, calificacion FROM calificacion
                        WHERE estudiante_id = ? AND seccion = ?
                        AND materia_id = ? AND periodo_id = ?
                        AND anio = ?`,
                    [body.estudiante_id, body.seccion, materia_id, body.periodo_id, body.anio],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });
        });
        
        // Wait for all promises to resolve
        const calificacionesPromises = await Promise.all(promises);
        return calificacionesPromises;
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.cargarNotas = async (data) => {
    const dataArray = data.data;
    return Promise.all(dataArray.map(async (body) => {

        for (let lapso = 1; lapso <= 3; lapso++) {
            const { estudiante_id, materia_id, periodo_id, anio, seccion } = body;
            const nota = body[`lapso${lapso}`];
            
            if (nota > 0) {
                const result = await new Promise((resolve, reject) => db.get(
                    `SELECT id, calificacion FROM calificacion WHERE estudiante_id = ? AND materia_id = ? AND periodo_id = ? AND anio = ? AND lapso = ? AND seccion = ?`,
                    [estudiante_id, materia_id, periodo_id, anio, lapso, seccion],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                    )
                )
                if (result) {
                    await new Promise((resolve, reject) => db.run(
                        `UPDATE calificacion SET calificacion = ? WHERE id = ?`,
                        [nota, result.id],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    )
                    );

                } else {
                    await new Promise ((resolve, reject) => db.run(
                        `INSERT INTO calificacion (estudiante_id, materia_id, periodo_id, anio, lapso, seccion, calificacion) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [estudiante_id, materia_id, periodo_id, anio, lapso, seccion, nota],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    )
                    );
                }
            }
        }
    })).catch(error => {
        console.error(error);
        throw error;
    });
}