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



// routers
const coordinadorRouters = require('./routers/coordinadorRouters')
const authRouters = require('./routers/authRouters')

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/auth', authRouters)
app.use('/coordinador', auth('Coordinador'), coordinadorRouters)

app.listen(PORT, () => console.log('Server running on port localhost:'+PORT))

