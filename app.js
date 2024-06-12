const express = require('express');
const path = require('path');

const PORT = 3000
const app = express()

// configs
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static('public'));

// routers
app.use('/', require("./routers/routersPrueba"))


app.listen(PORT, () => console.log('Server running on port localhost:'+PORT))