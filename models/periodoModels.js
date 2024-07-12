const db = require('../db/connection')

exports.crearPeriodo = async (body) => {
    try {
        let fecha_ingreso = new Date();
        fecha_ingreso = `${fecha_ingreso.getFullYear()}-${fecha_ingreso.getMonth() + 1}-${fecha_ingreso.getDate()}`

        const crearPeriodo = new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO periodo (
                nombre, fecha_inicio, finalizado, lapso_activo
                ) 
                VALUES (?, ?, ?, ?)`,
                [body.nombre, fecha_ingreso, 0, 0],

                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            )
        })
        
    } catch (error) {
        console.log(error)
        throw error
    }
}