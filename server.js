if(process.env.NODE_ENV!=='production'){
    require('dotenv').config()
}

const PORT = process.env.PORT || 3000;

const socketIO = require('socket.io')
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

let playerList
let activePlayerList
let questionList
let activeQuestionList
const server = app.listen(PORT)
const io = socketIO(server)
io.on('connection', async (socket)=>{
    const socketID = socket.id
    
    socket.on('host-join',async ()=>{
        playerList = await Player.find()
        questionList = await Question.find()
    })

    socket.on('host-choose-group',group=>{
        activePlayerList = playerList.filter(i=>i.group==group)
        activeQuestionList = questionList.filter(i=>i.group==group)
        console.log(activePlayerList);
    })

    socket.on('leaderboard-connect',()=>{
        socket.emit('leaderboard-data',activePlayerList)
    })
})
