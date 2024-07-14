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


exports.actualizarClave = async (id, nueva_clave) => {
    try {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE usuario SET clave_acceso = ? WHERE id = ?`, [nueva_clave, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    } catch (error) {
        console.log(error.message)
        throw error
    }
}

exports.crearUsuario = async (body) => {
    try {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO usuario (nombre_usuario, clave_acceso, activo, tipo_usuario_id) VALUES (?, ?, ?, ?)`, 
                [body.username, body.password, 1, 2], 
                function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    } catch (error) {
        console.log(error.message)
        throw error
    }
}