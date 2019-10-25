const express = require('express')
const bodyParser = require('body-parser')

const app = express();

//defifinido que a api vai receber parametro por url e aceitar requisisçoes json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

// importando os controllers
require('./app/controllers/authController')(app);
require('./app/controllers/projectController')(app);

app.listen(3000, ()=> {
    console.warn('Ok, API rodando na porta 3000')
})