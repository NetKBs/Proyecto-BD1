const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/cookieJwtAuth')

const PORT = 3002
const app = express()

// configs
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static('public'));


app.get("/", (req, res)=> {
    res.render("home", {titulo: "inicio"});
});


// routers
const coordinadorRouters = require('./routers/coordinadorRouters')
const usuarioRouters = require('./routers/usuarioRouters')

app.use('/coordinador', auth('Coordinador'), coordinadorRouters)
app.use('/usuario', usuarioRouters)

app.listen(PORT, () => console.log('Server running on port localhost:'+PORT))

