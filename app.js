const express = require('express');
const path = require('path');

const PORT = 3001
const app = express()

// configs
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static('public'));


app.get("/", (req, res)=> {
    res.render("home", {titulo: "inicio"});
});

app.get("/Representante", (req, res)=>{
    res.render("Representante")

});

app.get("/RegistrarseRepresentante", (req, res)=>{
    res.render("RegistrarseRepresentante")

});

app.get("/Docente", (req, res)=>{
      res.render("Docente")
});

app.get("/Coordinador", (req, res)=>{
    res.render("Coordinador")
});

// routers
app.use('/', require("./routers/routersPrueba"))


app.listen(PORT, () => console.log('Server running on port localhost:'+PORT))