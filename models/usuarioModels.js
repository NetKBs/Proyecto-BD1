const db = require('../db/connection')

exports.getUsuarioByNombre = async (nombre) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM usuario WHERE nombre_usuario = '${nombre}'`, (err, row) => {
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

exports.getUsuarioById = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM usuario WHERE id = '${id}'`, (err, row) => {
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

exports.getTipoUsuarioById = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM tipo_usuario WHERE id = ${id}`, (err, row) => {
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
