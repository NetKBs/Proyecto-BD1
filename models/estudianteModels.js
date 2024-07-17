const db = require('../db/connection')


const insertarDatosPersonales = async (data) => {
    try {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO persona (
                    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, genero, cedula,
                    estado_civil, fecha_nacimiento, ciudad_nacimiento, estado_nacimiento, pais_nacimiento,
                    casa_direccion
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [data.primer_nombre, data.segundo_nombre, data.primer_apellido, data.segundo_apellido, data.genero, data.cedula,
                data.estado_civil, data.fecha_nacimiento, data.ciudad_nacimiento, data.estado_nacimiento, data.pais_nacimiento,
                data.direccion_domicilio],
                function (err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        const id = this.lastID;
                        resolve(id);
                    }
                }
            );
        })
    } catch (error) {
        console.error(error.message);
        throw error
    }
}


exports.crearEstudiante = async re_data => {
    
    const idDatosPersonales = await insertarDatosPersonales(re_data)
    if (!idDatosPersonales) {
        return null
    } 

    let fecha_ingreso = new Date();
    fecha_ingreso = `${fecha_ingreso.getFullYear()}-${fecha_ingreso.getMonth() + 1}-${fecha_ingreso.getDate()}`

    try {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO estudiante (
                    datos_personales_id, fecha_ingreso, discapacidad, estado_academico
                ) 
                VALUES (?, ?, ?, ?)`, 
                [idDatosPersonales, fecha_ingreso, re_data.discapacidad, "Activo"],
            
                (err, row) => {
                    if (err) {
                        reject(new Error(`Error al insertar estudiante ${err}`));
                    } else {
                        resolve(row);
                    }
                }
            );
        })
    } catch (error) {
        console.error(error.message);
        throw error
    }
  
};


exports.editarEstudiante = async (id_estudiante, body) => {
    try {

        const datos_personales_id = (await this.estudianteById(id_estudiante)).datos_personales_id;

        const updateDatosPersonalesPromise = new Promise((resolve, reject) => {
            db.run(
                `UPDATE persona SET
                    primer_nombre = ?,
                    segundo_nombre = ?,
                    primer_apellido = ?,
                    segundo_apellido = ?,
                    genero = ?,
                    cedula = ?,
                    estado_civil = ?,
                    fecha_nacimiento = ?,
                    ciudad_nacimiento = ?,
                    estado_nacimiento = ?,
                    pais_nacimiento = ?,
                    casa_direccion = ?
                WHERE id = ?`,
                [body.primer_nombre, body.segundo_nombre, body.primer_apellido, body.segundo_apellido, body.genero, body.cedula,
                body.estado_civil, body.fecha_nacimiento, body.ciudad_nacimiento, body.estado_nacimiento, body.pais_nacimiento,
                body.direccion_domicilio, 
                datos_personales_id],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Datos personales actualizados");
                    }
                }
            );
        });

        const updateEstudiantePromise = new Promise((resolve, reject) => {
            db.run(
                `UPDATE estudiante SET
                    discapacidad = ?,
                    estado_academico = ?
                WHERE id = ?`,
                [body.discapacidad, body.estado, 
                    id_estudiante],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Estudiante actualizado");
                    }
                }
            );
        });

        const [datosPersonalesResult, estudianteResult] = await Promise.allSettled([updateDatosPersonalesPromise, updateEstudiantePromise]);

        if (datosPersonalesResult.status === "rejected" || estudianteResult.status === "rejected") {
            return Error(`Error al actualizar los datos:\n  ${datosPersonalesResult.reason} \n ${estudianteResult.reason}`);
        }
        return "Datos actualizados exitosamente";

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}





exports.estudianteByCedula = async (cedula) => {
    try {
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM persona 
                INNER JOIN estudiante ON persona.id = estudiante.datos_personales_id 
                WHERE persona.cedula = ?`, 
                [parseInt(cedula)], 
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                })
        })

    } catch (error) {
        console.error(error.message);
        throw error
    }
}

exports.estudianteById = async (id) => {
    try {
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM persona 
                INNER JOIN estudiante ON persona.id = estudiante.datos_personales_id 
                WHERE estudiante.id = ?
                `, 
                [id]
                ,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
        })

    } catch (error) {
        console.error(error.message);
        throw error
    }
}