const db = require('../db/connection')

exports.getCoordinadores = async () => {
    try {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM coordinador', (err, rows) => {
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

exports.getCoordinadorByUserId = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM coordinador WHERE usuario_id = ${id}`, (err, row) => {
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

exports.getCoordinadorById = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM coordinador WHERE id = ${id}`, (err, row) => {
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