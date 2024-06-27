const express = require ('express')
const router = express.Router()
const coordinadorControllers = require('../controllers/coordinadorControllers')

router.get('/:id', coordinadorControllers.coordinador);

module.exports = router