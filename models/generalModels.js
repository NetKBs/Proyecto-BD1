const db = require('../db/connection')

exports.getDatosPersonalesById = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM datos_personales WHERE id = ${id}`, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    } catch (error) {
        console.log(error.message)
        throw error
    }
    
}