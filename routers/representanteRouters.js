const express = require ('express')
const router = express.Router()
const representanteControllers = require('../controllers/representanteControllers')

router.get('/', representanteControllers.representantePanel);
router.get('/consultar-notas', representanteControllers.consultarNotasView);
router.get('/consultar-notas/buscar', representanteControllers.consultarNotas);

module.exports = router