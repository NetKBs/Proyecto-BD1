const express = require ('express')
const router = express.Router()
const docenteControllers = require('../controllers/docenteControllers')

router.get('/', docenteControllers.docentePanel);
router.get('/clave', docenteControllers.claveView);
router.post('/clave', docenteControllers.clave);
router.get('/carga-notas', docenteControllers.cargaNotasView);
router.get('/listado', docenteControllers.listado);

module.exports = router