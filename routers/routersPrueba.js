const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("<h1>Hola mundo desde una ruta</h1>");
})

module.exports = router