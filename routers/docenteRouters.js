const express = require ('express')
const router = express.Router()
const docenteControllers = require('../controllers/docenteControllers')

router.get('/', docenteControllers.docentePanel);
router.get('/clave', docenteControllers.claveView);
router.post('/clave', docenteControllers.clave);
router.get('/carga-notas', docenteControllers.cargaNotasView);
router.get('/carga-notas/listado', docenteControllers.listado);
router.post('/carga-notas/guardar', docenteControllers.cargaNotasGuardar);

module.exports = router