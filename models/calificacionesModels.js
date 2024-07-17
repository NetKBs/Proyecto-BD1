const db = require('../db/connection')
const inscripcionModels = require('./inscripcionModels')
const asignaturaModels = require('./asignaturaModels')
const docenteModels = require('./docenteModels')
const estudianteModels = require('./estudianteModels')
const cargaAcademicaModels = require('./cargaAcademicaModels')
const { calificaciones } = require('../controllers/calificacionesControllers')

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

        if (!inscrito) {
            return new Error("Estudiante no está isncrito a ese año")
        }

        // obtener la carga académica de ese periodo
        const cargaAcademica = await cargaAcademicaModels.cargasByPeriodoSeccionAnio(inscrito.periodo_id, inscrito.seccion, inscrito.anio)
        console.log(cargaAcademica)

        // Obtener las materias que se ven en ese año escolar en especifico
        const materias = await asignaturaModels.getAsignaturaByAnio(anio)
        //console.log(materias)
        if (!materias) {
            return new Error("No existen materias para ese año escolar")
        }

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

        const boletinesNotasGrupos = {};
        console.log(boletinesNotas)
        for (const boletinNota of boletinesNotas) {
            const { materia_id, lapso, calificacion } = boletinNota;


            if (!boletinesNotasGrupos[materia_id]) {
                const materia = materias.find(materia => materia.id === materia_id);

                boletinesNotasGrupos[materia_id] = {
                    nombre: materia.nombre,
                    lapso1: 0,
                    lapso2: 0,
                    lapso3: 0,
                    docente: ""
                };
            }

            boletinesNotasGrupos[materia_id][`lapso${lapso}`] = calificacion || 0;
            // Asignar docente
            const docente = cargaAcademica.find(carga => carga.materia_id === materia_id);
            if (docente) {
                const nombreDocente = await docenteModels.docenteById(docente.docente_id)
                boletinesNotasGrupos[materia_id].docente = nombreDocente.primer_nombre + " " + nombreDocente.primer_apellido
            } else {
                boletinesNotasGrupos[materia_id].docente = "Sin docente"
            }
        }

        // Agregar las materias que no tienen calificaciones
        for (const materia of materias) {
            if (!boletinesNotasGrupos[materia.id]) {
                boletinesNotasGrupos[materia.id] = {
                    nombre: materia.nombre,
                    lapso1: 0,
                    lapso2: 0,
                    lapso3: 0,
                    docente: ""
                };
                // Asignar docente
                const docente = cargaAcademica.find(carga => carga.materia_id === materia.id);
                if (docente) {
                    const nombreDocente = await docenteModels.docenteById(docente.docente_id)
                    boletinesNotasGrupos[materia.id].docente = nombreDocente.primer_nombre + " " + nombreDocente.primer_apellido
                } else {
                    boletinesNotasGrupos[materia.id].docente = "Sin docente"
                }
            }
        }

        const data = { asignaturas: boletinesNotasGrupos }
        // imprimir asignaturas en data
        data.asignaturas = Object.values(data.asignaturas)


        // Agregar datos relevantes del usuario
        const estudiante = await estudianteModels.estudianteById(id_estudiante)
        data.estudiante = {
            id: id_estudiante,
            nombre: estudiante.primer_nombre + " " + estudiante.primer_apellido,
            cedula: estudiante.cedula
        }

        data.anio = anio

        return data

    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.getNotasFinales = async (id_estudiante) => {
    try {
        const inscritos = await inscripcionModels.getEstudianteById(id_estudiante);
        const anosEscolares = [];
        const data = { asignaturas: {} }; // Object to store all subjects grouped by school year

        for (const inscrito of inscritos) {
            const anio = inscrito.anio;
            if (!anosEscolares.includes(anio)) {
                anosEscolares.push(anio);
                data.asignaturas[anio] = {}; // Initialize empty object for each school year
            }
        }

        for (const anio of anosEscolares) {
            const boletinesNotasGrupos = {};
            const cargaAcademica = await cargaAcademicaModels.cargasByPeriodoSeccionAnio(inscritos[0].periodo_id, inscritos[0].seccion, anio);
            const materias = await asignaturaModels.getAsignaturaByAnio(anio);

            if (!materias) {
                return new Error("No existen materias para ese año escolar");
            }

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

            // Agregar las calificaciones al objeto
            for (const boletinNota of boletinesNotas) {
                const { materia_id, lapso, calificacion } = boletinNota;

                if (!boletinesNotasGrupos[materia_id]) {
                    const materia = materias.find((materia) => materia.id === materia_id);

                    boletinesNotasGrupos[materia_id] = {
                        nombre: materia.nombre,
                        lapso1: 0,
                        lapso2: 0,
                        lapso3: 0,
                        docente: ""
                    };
                }

                boletinesNotasGrupos[materia_id][`lapso${lapso}`] = calificacion || 0;
                // Asignar docente
                const docente = cargaAcademica.find((carga) => carga.materia_id === materia_id);
                if (docente) {
                    const nombreDocente = await docenteModels.docenteById(docente.docente_id);
                    boletinesNotasGrupos[materia_id].docente = `${nombreDocente.primer_nombre} ${nombreDocente.primer_apellido}`;
                } else {
                    boletinesNotasGrupos[materia_id].docente = "Sin docente";
                }
            }

            // Agregar las materias que no tienen calificaciones
            for (const materia of materias) {
                if (!boletinesNotasGrupos[materia.id]) {
                    boletinesNotasGrupos[materia.id] = {
                        nombre: materia.nombre,
                        lapso1: 0,
                        lapso2: 0,
                        lapso3: 0,
                        docente: ""
                    };
                    // Asignar docente
                    const docente = cargaAcademica.find((carga) => carga.materia_id === materia.id);
                    if (docente) {
                        const nombreDocente = await docenteModels.docenteById(docente.docente_id);
                        boletinesNotasGrupos[materia.id].docente = `${nombreDocente.primer_nombre} ${nombreDocente.primer_apellido}`;
                    } else {
                        boletinesNotasGrupos[materia.id].docente = "Sin docente";
                    }
                }
            }

            data.asignaturas[anio] = boletinesNotasGrupos; // Assign subject data for the school year
            data.asignaturas[anio] = Object.values(data.asignaturas[anio])
        }

        // Add student data
        const estudiante = await estudianteModels.estudianteById(id_estudiante);
        data.estudiante = {
            id: id_estudiante,
            nombre: `${estudiante.primer_nombre} ${estudiante.primer_apellido}`,
            cedula: estudiante.cedula
        };

        data.anosEscolares = anosEscolares;
        data.asignaturas = Object.values(data.asignaturas)
        console.log(data);
        console.log(data.asignaturas[0])
        return data;

    } catch (error) {
        console.log(error);
        throw error;
    }
}


exports.getNotasFinalByPeriodoSeccionMateria = async (periodo_id, seccion, materia_id) => {
    try {
        const data = { notas: {} };

        // 

        // Obtener la información de los inscritos
        const inscritos = await inscripcionModels.getEstudiantesByPeriodoSeccion(periodo_id, seccion);

        // Obtener las notas de cada estudiante
        for (const inscrito of inscritos) {
            const notas = await exports.getBoletinesNotas(inscrito.estudiante_id, inscrito.anio);

            for (const nota of notas.asignaturas) {
                const asignatura_id = (await asignaturaModels.getAsignaturaIdPorNombre(nota.nombre)).id

                if (asignatura_id == materia_id) {
                    const notaFinal = (nota.lapso1 + nota.lapso2 + nota.lapso3) / 3;

                    const estudiante = await estudianteModels.estudianteById(inscrito.estudiante_id);
                    
                    const materia = nota.nombre;
                    const docente = nota.docente;
                    const anio = inscrito.anio;

                    if (!data.notas[anio]) {
                        data.notas[anio] = [];
                    }

                    data.notas[anio].anio = anio;
                    data.notas[anio].push({
                        id_estudiante: inscrito.estudiante_id,
                        nombre_estudiante : `${estudiante.primer_nombre} ${estudiante.primer_apellido}`,
                        cedula: estudiante.cedula,
                        materia,
                        docente,
                        anio,
                        notaFinal: notaFinal.toFixed(2)
                    });
                }
            }
        }
        
        data.notas = Object.values(data.notas);
        return data;

    } catch (error) {
        console.log(error);
        throw error;
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
                    await new Promise((resolve, reject) => db.run(
                        `INSERT INTO calificacion (estudiante_id, materia_id, periodo_id, docente_id, anio, lapso, seccion, calificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [estudiante_id, materia_id, periodo_id, 7, anio, lapso, seccion, nota],
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