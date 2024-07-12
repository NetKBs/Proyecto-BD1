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


exports.crearRepresentante = async re_data => {
    
    const idDatosPersonales = await insertarDatosPersonales(re_data)
    if (!idDatosPersonales) {
        return null
    } 

    let fecha_ingreso = new Date();
    fecha_ingreso = `${fecha_ingreso.getFullYear()}-${fecha_ingreso.getMonth() + 1}-${fecha_ingreso.getDate()}`

    try {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO representante (
                    datos_personales_id, fecha_ingreso, trabajo, lugar_trabajo, activo, correo, correo_alt,
                    telefono, telefono_alt
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [idDatosPersonales, fecha_ingreso, re_data.cargo_trabajo, re_data.lugar_trabajo, 1, re_data.email,
                    re_data.email2, re_data.tlfno, re_data.tlfno2],
            
                (err, row) => {
                    if (err) {
                        console.log("Error al insertar representante", err)
                        reject(new Error(`Error al insertar representante ${err}`));
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

exports.editarRepresentante = async (id_representante, body) => {
    try {

        const datos_personales_id = (await this.representanteById(id_representante)).datos_personales_id;

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


        const activo = parseInt(body.estado);
        const activoValue = isNaN(activo) ? null : activo;

        const updateRepresentantePromise = new Promise((resolve, reject) => {
            db.run(
                `UPDATE representante SET
                    trabajo = ?,
                    lugar_trabajo = ?,
                    correo = ?,
                    correo_alt = ?,
                    telefono = ?,
                    telefono_alt = ?,
                    activo = ?
                WHERE id = ?`,
                [body.cargo_trabajo, body.lugar_trabajo, body.email, body.email2, body.tlfno, body.tlfno2, activoValue, 
                    id_representante],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Representante actualizado");
                    }
                }
            );
        });

        const [datosPersonalesResult, representanteResult] = await Promise.allSettled([updateDatosPersonalesPromise, updateRepresentantePromise]);

        if (datosPersonalesResult.status === "rejected" || representanteResult.status === "rejected") {
            return Error(`Error al actualizar los datos:\n  ${datosPersonalesResult.reason} \n ${representanteResult.reason}`);
        }
        return "Datos actualizados exitosamente";

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}





exports.representanteByCedula = async (cedula) => {
    try {
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM persona 
                INNER JOIN representante ON persona.id = representante.datos_personales_id 
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

exports.representanteById = async (id) => {
    try {
        return new Promise ((resolve, reject) => {
            db.get(
                `
                SELECT * FROM persona 
                INNER JOIN representante ON persona.id = representante.datos_personales_id 
                WHERE representante.id = ?
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

