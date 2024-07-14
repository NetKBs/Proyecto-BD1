const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/authControllers')

router.get("/login", authControllers.login);
router.post("/login", authControllers.loginAuth);
router.get("/logout", authControllers.logout);
router.get('/signup', authControllers.signUp);
router.post('/signup', authControllers.signUpAuth);

module.exports = router