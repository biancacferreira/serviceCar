const express = require('express')
const app = express()
const dataBase = require('./src/config/dataBase')
const consign = require('consign')

consign()
    .then('./src/config/middleware.js')
    .then('./api')
    .then('./src/config/routes.js')
    .into(app)

app.dataBase = dataBase

app.listen(3000, () =>{
    console.log("Executando o backend")
})