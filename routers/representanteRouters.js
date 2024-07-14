const express = require ('express')
const router = express.Router()
const representanteControllers = require('../controllers/representanteControllers')

router.get('/', representanteControllers.representantePanel);
router.get('/consultar-notas', representanteControllers.consultarNotas);

module.exports = router