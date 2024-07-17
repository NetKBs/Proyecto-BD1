const db = require('../db/connection')


exports.crearCargaAcademica = async (body) => {
    try {
        const {periodo_id, docente_id, materia_id, anio, seccion} = body
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO carga_academica (periodo_id, docente_id, materia_id, anio, seccion) VALUES (?, ?, ?, ?, ?)`,
                [periodo_id, docente_id, materia_id, anio, seccion],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    } catch (error) {
        console.log(error)
    }
}

exports.cargasByDocenteID = async (docente_id) => {
    try {
        return await new Promise((resolve, reject) => {
            db.all(
                `
                    SELECT c.id AS carga_id, c.anio, c.seccion, m.nombre FROM carga_academica AS c
                    INNER JOIN docente AS d ON d.id = c.docente_id
                    INNER JOIN materia AS m ON m.id = c.materia_id
                    WHERE d.id = ?
                    ORDER BY  m.nombre 
                `,
                [docente_id],
                function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

    } catch (error) {
        console.log(error)
    }
}

exports.getCargaAcademicaById = async (carga_id) => {
    try {
        return await new Promise((resolve, reject) => {
            db.get (
                `
                SELECT * FROM carga_academica WHERE id = ?
                `,
                [carga_id],
                function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }                
            )
        });
    } catch (error) {
        console.log(error)
    }
}


exports.cargasByPeriodoSeccionAnio = async (periodo_id, seccion, anio) => {
    try {
        return await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM carga_academica WHERE periodo_id = ? AND seccion = ? AND anio = ?`,
                [periodo_id, seccion, anio],
                function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    } catch (error) {
        console.log(error)
    }
}

exports.editarCargaAcademica = async (body) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE carga_academica SET 
                 materia_id = ?, 
                 anio = ?, 
                 seccion = ? 
                 WHERE id = ?`,
                [parseInt(body.materia), parseInt(body.grado), body.seccion, parseInt(body.carga_id)],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    } catch (error) {
        console.log(error)
    }
}