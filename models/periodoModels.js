const db = require('../db/connection')

exports.getPeriodos = async () => {
    try {
        // Fetch the data from the periodo_academico table
        const periodos = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM periodo_academico ORDER BY nombre DESC`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        // Fetch the related sections from the periodo_seccion table
        const secciones = await new Promise((resolve, reject) => {
            db.all(
                `SELECT periodo_id, seccion FROM periodo_seccion`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        // Group the sections by their periodo_id
        const groupedSecciones = secciones.reduce((acc, curr) => {
            const periodoId = curr.periodo_id;
            if (!acc[periodoId]) {
                acc[periodoId] = [];
            }
            acc[periodoId].push(curr.seccion);
            return acc;
        }, {});

        // Combine the data from the two queries
        const result = periodos.map((periodo) => {
            const periodoId = periodo.id;
            const seccionesPeriodo = groupedSecciones[periodoId] || [];

            return {
                id: periodo.id,
                nombre: periodo.nombre,
                fecha_inicio: periodo.fecha_inicio,
                fecha_fin: periodo.fecha_fin,
                finalizado: periodo.finalizado,
                lapso_activo: periodo.lapso_activo,
                secciones: seccionesPeriodo
            };
        });

        return result;
    } catch (error) {
        console.error(error.message);
        throw error
    }
}

exports.getPeriodoById = async (id) => {
    try {
        // Fetch the data from the periodo_academico table
        const periodo = await new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM periodo_academico WHERE id = ?`,
                [id],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        // Fetch the related sections from the periodo_seccion table
        const secciones = await new Promise((resolve, reject) => {
            db.all(
                `SELECT seccion FROM periodo_seccion WHERE periodo_id = ?`,
                [id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        // Combine the data from the two queries
        const result = {
            id: periodo.id,
            nombre: periodo.nombre,
            fecha_inicio: periodo.fecha_inicio,
            fecha_fin: periodo.fecha_fin,
            finalizado: periodo.finalizado,
            secciones: secciones.map(seccion => seccion.seccion),
            lapso_activo: periodo.lapso_activo
        };

        return result;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

exports.buscarPeriodoActivo = async () => {
    try {
        const result = await new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM periodo_academico WHERE finalizado = 0`,
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
        
        return result;

    } catch (error) {
        console.error(error.message);
        throw error
    }
}


exports.crearPeriodo = async (body) => {
    try {
        let fecha_ingreso = new Date();
        fecha_ingreso = `${fecha_ingreso.getFullYear()}-${fecha_ingreso.getMonth() + 1}-${fecha_ingreso.getDate()}`

        const id = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO periodo_academico (
                nombre, fecha_inicio, finalizado, lapso_activo
                ) 
                VALUES (?, ?, ?, ?)`,
                [body.nombre, fecha_ingreso, 0, 0],

                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        const id = this.lastID;
                        resolve(id);
                    }
                }
            )
        });

        if (body.secciones.length > 0) {
            const crearSeccionesPromises = body.secciones.map(seccion => {
                return new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO periodo_seccion (
                        periodo_id, seccion
                        ) 
                        VALUES (?, ?)`,
                        [id, seccion],

                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    )
                })
            })

            await Promise.all(crearSeccionesPromises);
        }

        return "Periodo creado exitosamente";

    } catch (error) {
        console.log(error);
        throw new Error('Error al crear el periodo: ' + error.message);
    }
}

exports.editarPeriodo = async (id, body) => {
    try {
        if (body.estado === "1") {
            // Verificar si el periodo ya tiene una fecha de finalizacion
            const fechaFinalizacion = await new Promise((resolve, reject) => {
                db.get(
                    `SELECT fecha_fin FROM periodo_academico WHERE id = ?`,
                    [id],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row.fecha_fin);
                        }
                    }
                );
            });

            if (!fechaFinalizacion) {
                // Si no tiene una fecha de finalizacion, sacar la fecha actual y agregarla al UPDATE
                let fecha_actual = new Date();
                fecha_actual = `${fecha_actual.getFullYear()}-${fecha_actual.getMonth() + 1}-${fecha_actual.getDate()}`
                body.fecha_fin = fecha_actual;
            } else {
                body.fecha_fin = null;
            }
        }

        // Actualizar el nombre del periodo académico
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE periodo_academico SET nombre = ?, finalizado = ?, lapso_activo = ?, fecha_fin = ? WHERE id = ?`,
                [body.nombre, body.estado, body.lapso, body.fecha_fin , id],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Periodo actualizado exitosamente");
                    }
                }
            );
        });

        if (body.secciones.length > 0) {
            const crearSeccionesPromises = body.secciones.map(async seccion => {
                // Verificar si existe un registro con el mismo periodo_id y seccion
                const existeRegistro = await new Promise((resolve, reject) => {
                    db.get(
                        `SELECT COUNT(*) AS count FROM periodo_seccion WHERE periodo_id = ? AND seccion = ?`,
                        [id, seccion],
                        (err, row) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row.count > 0);
                            }
                        }
                    );
                });
        
                if (existeRegistro) {
                    // Actualizar el registro existente
                    await new Promise((resolve, reject) => {
                        db.run(
                            `UPDATE periodo_seccion SET seccion = ? WHERE periodo_id = ? AND seccion = ?`,
                            [seccion, id, seccion],
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            }
                        );
                    });
                } else {
                    // Insertar un nuevo registro
                    await new Promise((resolve, reject) => {
                        db.run(
                            `INSERT OR IGNORE INTO periodo_seccion (periodo_id, seccion) VALUES (?, ?)`,
                            [id, seccion],
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            }
                        );
                    });
                }
            });
        
            await Promise.all(crearSeccionesPromises);
        }
        

        return "Periodo actualizado exitosamente";
    } catch (error) {
        console.log(error);
        throw new Error('Error al editar el periodo: ' + error.message);
    }
};
