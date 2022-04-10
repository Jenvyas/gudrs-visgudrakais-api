if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Player = require('./models/Player')
const Question = require('./models/Question')

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',e=>{console.error(e)})
db.once('open',()=>{console.log("Connected to Database");})

app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

const questionRouter = require('./routes/questions')
app.use('/questions',questionRouter)
const playerRouter= require('./routes/players')
app.use('/players',playerRouter) 

app.listen(3000)