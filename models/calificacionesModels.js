const db = require('../db/connection')
const inscripcionModels = require('./inscripcionModels')
const asignaturaModels = require('./asignaturaModels')
const docenteModels = require('./docenteModels')

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


exports.getBoletinesNotas = async (id_estudiante, anio) => {
    try {

        // Ver si ese estudiante está o ha sido inscrito a ese año escolar
        // toma el más reciente
        const inscrito = (await inscripcionModels.getEstudianteByIdAnio(id_estudiante, anio))[0]
        //console.log(inscrito)
        if (!inscrito) {
            return "Estudiante no está isncrito a ese año"
        }

        // Obtener las materias que se ven en ese año escolar en especifico
        const materias = await asignaturaModels.getAsignaturaByAnio(anio)
        console.log(materias)
        //console.log(materias)
        if (!materias) {
            return "No existen materias para ese año escolar"
        }

        // Obtener nombre de docente de cada materia
        materias.forEach(async materia => {
            console.log(materia.docente_id)
            const docente = (await docenteModels.docenteById(materia.docente_id))
            console.log(docente)
        });

        // Obtener las notas de cada lapso de cada materia para ese estudiante
        const boletinesNotas = await new Promise((resolve, reject) => {
            db.all(
                `
                SELECT * FROM calificacion
                WHERE estudiante_id = ? AND anio = ?
                ORDER BY id DESC
                `,
                [id_estudiante, anio],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        //console.log(boletinesNotas)
        const boletinesNotasGrupos = {};

        for (const boletinNota of boletinesNotas) {
            const { materia_id, lapso, calificacion } = boletinNota;
            if (!boletinesNotasGrupos[materia_id]) {
                const materia = materias.find(materia => materia.id === materia_id);
                boletinesNotasGrupos[materia_id] = {
                    nombre: materia.nombre,
                    lapso1: 0,
                    lapso2: 0,
                    lapso3: 0
                };
            }
            boletinesNotasGrupos[materia_id][`lapso${lapso}`] = calificacion || 0;
        }

        // Agregar las materias que no tienen calificaciones
        for (const materia of materias) {
            if (!boletinesNotasGrupos[materia.id]) {
                boletinesNotasGrupos[materia.id] = {
                    nombre: materia.nombre,
                    lapso1: 0,
                    lapso2: 0,
                    lapso3: 0,
                };
            }
        }
        console.log(boletinesNotasGrupos)

        /*const boletinesNotas = await new Promise((resolve, reject) => {
            db.all(
                `SELECT materia_anio.materia_id, materia.nombre, materia.creditos, SUM(calificacion.calificacion) / COUNT(calificacion.calificacion) AS promedio
                    FROM calificacion
                    INNER JOIN materia_anio ON calificacion.materia_id = materia_anio.materia_id
                    INNER JOIN materia ON materia_anio.materia_id = materia.id
                    WHERE estudiante_id = ? AND anio = ?
                    GROUP BY materia_anio.materia_id, materia.nombre, materia.creditos`,
                [cedula, ano],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        if (boletinesNotas.length === 0) {
            return [];
        } else {
            return boletinesNotas.map(boletin => ({
                materia_id: boletin.materia_id,
                nombre: boletin.nombre,
                creditos: boletin.creditos,
                promedio: boletin.promedio,
            }));
        }*/
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