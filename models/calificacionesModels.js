const db = require('../db/connection')


exports.getCalificacionesEstudiantes = async (body) => {
    try {
        // Recorrer el array de estudiantes y tratar de encontrar registros en la tabla calificaciones (Usar promesas)

        const promises = body.map(async (elemento) => {
            return await new Promise((resolve, reject) => {
                console.log(elemento)
                db.get(
                    `SELECT * FROM calificacion
                        WHERE estudiante_id = ? AND seccion = ?
                        AND materia_id = ? AND periodo_id = ?
                        AND anio = ?`,
                    [body.estudiante_id, body.seccion, body.materia, body.periodo_id, body.anio],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else if (row === undefined) {
                            // Handle the case where row is undefined
                            resolve(null); // or any other appropriate value
                        } else {
                            console.log("Dentro de la promesa");
                            console.log(row);
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