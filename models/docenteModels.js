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


exports.crearDocente = async re_data => {
    
    const idDatosPersonales = await insertarDatosPersonales(re_data)
    if (!idDatosPersonales) {
        return null
    } 

    const idUsuario = await new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO usuario (
                nombre_usuario, clave_acceso, activo, tipo_usuario_id
            ) 
            VALUES (?, ?, ?, ?)`, 
            [re_data.username, re_data.password, 1, 3],
        
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    const idUsuario = this.lastID;
                    resolve(idUsuario);
                }
            }
        );
    })

    let fecha_ingreso = new Date();
    fecha_ingreso = `${fecha_ingreso.getFullYear()}-${fecha_ingreso.getMonth() + 1}-${fecha_ingreso.getDate()}`

    try {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO docente (
                    usuario_id, datos_personales_id, fecha_ingreso, titulo_academico, especialidad, activo, correo, correo_alt,
                    telefono, telefono_alt
                ) 
                VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [idUsuario, idDatosPersonales, fecha_ingreso, re_data.titulo_academico, re_data.especialidad, 1, re_data.email,
                    re_data.email2, re_data.tlfno, re_data.tlfno2],
            
                (err, row) => {
                    if (err) {
                        console.log("Error al insertar docente", err)
                        reject(new Error(`Error al insertar docente ${err}`));
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

exports.docenteByCedula = async (cedula) => {
    try {
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM persona 
                INNER JOIN docente ON persona.id = docente.datos_personales_id 
                WHERE persona.cedula = ?`, 
                [cedula], 
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

exports.docenteById = async (id) => {
    try {
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM persona 
                INNER JOIN docente ON persona.id = docente.datos_personales_id 
                WHERE docente.id = ?
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



exports.getDocenteByUserId = async (id) => {
    try {
        console.log(id)
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM docente WHERE usuario_id = ?
                `, 
                [id]
                ,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                 
                        console.log(rows)
                        resolve(rows);
                    }
                })
        })  
    } catch (error) {
        console.error(error.message);
        throw error
    }
}

exports.editarDocente = async (id_docente, body) => {
    try {

        const datos_docente = await this.docenteById(id_docente);
        const datos_personales_id = datos_docente.datos_personales_id
        const usuario_id = datos_docente.usuario_id

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

        // Actualizar usuario
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE usuario SET
                    nombre_usuario = ?,
                    clave_acceso = ?
                WHERE id = ?`,
                [body.username, body.password, usuario_id],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Usuario actualizado");
                    }
                }
            );
        }
        )


        const activo = parseInt(body.estado);
        const activoValue = isNaN(activo) ? null : activo;

        const updateDocentePromise = new Promise((resolve, reject) => {
            db.run(
                `UPDATE docente SET
                    especialidad = ?,
                    titulo_academico = ?,
                    correo = ?,
                    correo_alt = ?,
                    telefono = ?,
                    telefono_alt = ?,
                    activo = ?
                WHERE id = ?`,
                [body.especialidad, body.titulo_academico, body.email, body.email2, body.tlfno, body.tlfno2, activoValue, 
                    id_docente],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Docente actualizado");
                    }
                }
            );
        });

        const [datosPersonalesResult, docenteResult] = await Promise.allSettled([updateDatosPersonalesPromise, updateDocentePromise]);

        if (datosPersonalesResult.status === "rejected" || docenteResult.status === "rejected") {
            return Error(`Error al actualizar los datos:\n  ${datosPersonalesResult.reason} \n ${docenteResult.reason}`);
        }
        return "Datos actualizados exitosamente";

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}