const express = require('express')
const router = express.Router()
const usuarioControllers = require('../controllers/usuarioControllers')

router.get("/login", usuarioControllers.login);
router.post("/login", usuarioControllers.loginAuth);


module.exports = router