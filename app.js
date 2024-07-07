const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/cookieJwtAuth')

const PORT = 3000
const app = express()

// configs
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('home')
})

// HACER PRUEBA PARA RENDERIZAR SUS VISTAS ACÁ
// borrar luego de terminar la prueba

app.get('/testing', (req, res) => {
    res.render('coordinador/estudiante_home.ejs')
})

app.get('/testing2', (req, res) => {
    res.render('signup.ejs')
})

// routers
/*const coordinadorRouters = require('./routers/coordinadorRouters')
const usuarioRouters = require('./routers/usuarioRouters')

app.use('/coordinador', auth('Coordinador'), coordinadorRouters)
app.use('/usuario', usuarioRouters)*/

app.listen(PORT, () => console.log('Server running on port localhost:'+PORT))

