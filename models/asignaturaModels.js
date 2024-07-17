const db = require('../db/connection')

exports.getAsignaturas = async () => {
    try {
         const materias = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM materia`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
        const grados = await new Promise((resolve, reject) => {
            db.all(
                `SELECT materia_id, anio FROM materia_anio`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        const groupedGrados = grados.reduce((acc, curr) => {
            const materiaId = curr.materia_id;
            if (!acc[materiaId]) {
                acc[materiaId] = [];
            }
            acc[materiaId].push(curr.anio);
            return acc;
        }, {});

        const result = materias.map((materia) => {
            const materiaId = materia.id;
            const gradosMateria = groupedGrados[materiaId] || [];

            return {
                id: materia.id,
                codigo: materia.codigo,
                nombre: materia.nombre,     
                grados: gradosMateria,
            };
        });

        return result;

    } catch (error) {
        console.log(error)
    }
}

exports.getAsignaturaById = async (id) => {
    try {
        // Fetch the data from the periodo_academico table
        const materia = await new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM materia WHERE id = ?`,
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
        const grados = await new Promise((resolve, reject) => {
            db.all(
                `SELECT anio FROM materia_anio WHERE materia_id = ?`,
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
            id: materia.id,
            codigo: materia.codigo,
            nombre: materia.nombre,    
            grados: grados.map(grado => grado.anio),
        };

        return result;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

exports.getAsignaturaByAnio = async (anio) => {
    try {
        // Fetch the data from the materia table
        const materias = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM materia WHERE id IN (
                    SELECT materia_id FROM materia_anio WHERE anio = ?
                )`,
                [anio],
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
        const result = materias.map(materia => ({
            id: materia.id,
            codigo: materia.codigo,
            nombre: materia.nombre,
        }));

        return result;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

exports.crearAsignatura = async (body) => {

    try {
        // Crear Materia
        const id_materia = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO materia (
                codigo, nombre 
                ) 
                VALUES (?, ?)
                `,
                [body.codigo, body.asignatura],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        const id = this.lastID;
                        resolve(id);
                    }
                }
            )
        })


        // Crear Grados
        if (body.grados.length > 1) {
            await body.grados.map(grado => {
                return new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO materia_anio (
                        materia_id, anio
                        ) 
                        VALUES (?, ?)`,
                        [id_materia, grado],

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

        } else {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO materia_anio (
                    materia_id, anio
                    ) 
                    VALUES (?, ?)`,
                    [id_materia, body.grados[0]],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                )
            })
        }

    } catch (error) {
        console.log(error)
    }
}

exports.editarAsignatura = async (id, body) => {

    try {

        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE materia SET
                codigo = ?, nombre = ?
                WHERE id = ?`,
                [body.codigo, body.asignatura, id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            )
        })

        // Actualizar grados
        // Obtener los grados actuales
        const gradosActuales = await new Promise((resolve, reject) => {
            db.all(
                `SELECT anio FROM materia_anio WHERE materia_id = ?`,
                [id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.map(row => row.anio));
                    }
                }
            );
        });

        if (body.grados && body.grados.length <= 1) { 
            body.grados = [body.grados];
        } else if (!body.grados) {
            body.grados = [];
        }

        // Calcular las diferencias entre los grados actuales y los seleccionados
        const aEliminar = gradosActuales.filter(grado => !body.grados.includes(grado));
        const aAgregar = body.grados.filter(grado => !gradosActuales.includes(grado));

        // Eliminar las relaciones que se han deseleccionado
        await Promise.all(
            aEliminar.map(grado => {
                return new Promise((resolve, reject) => {
                    db.run(
                        `DELETE FROM materia_anio WHERE materia_id = ? AND anio = ?`,
                        [id, grado],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            })
        );

        // Agregar las nuevas relaciones seleccionadas
        await Promise.all(
            aAgregar.map(grado => {
                return new Promise((resolve, reject) => {
                    db.run(
                        `INSERT OR IGNORE INTO materia_anio (materia_id, anio) VALUES (?, ?)`,
                        [id, grado],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            })
        );

        return true

    } catch (error) {
        console.log(error)
    }
}