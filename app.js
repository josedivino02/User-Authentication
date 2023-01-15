//imports necessários
const express = require("express")
const cors = require("cors")

const corsConfig = require("./src/config/cors")
const conn = require("./src/db/conn")
const routes = require('./src/routes/router')

const app = express() //instanciando o express

app.use(cors())
app.use(corsConfig)
app.use(express.json())

//conexão DB
conn()

// Routes
app.use('/api', routes)

const porta = 3003 

app.listen(porta, function () {
    console.log(`Servidor Online! porta ${porta}`)
})
