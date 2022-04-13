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
let activeOneQuestions
let activeTwoQuestions
const server = app.listen(PORT)
const io = socketIO(server)
let leaderboardID
let gameState = {
    active:false,
    currentStage:1,
    currentStageOneQuestion:0,
    currentStageTwoQuestion:0
}

io.on('connection', async (socket)=>{
    const socketID = socket.id
    socket.on('host-join',async ()=>{
        playerList = await Player.find()
        questionList = await Question.find()
    })

    socket.on('host-choose-group',group=>{
        activePlayerList = playerList.filter(i=>i.group==group)
        activeQuestionList = questionList.filter(i=>i.group==group)
        activeOneQuestions = activeQuestionList.filter(i=>i.stage===1)
        activeTwoQuestions = activeQuestionList.filter(i=>i.stage===2)
        gameState.active=true;
        if(leaderboardID){
            socket.to(leaderboardID).emit('leaderboard-data',activePlayerList)
        }
        socket.emit('group-accepted',activePlayerList,activeQuestionList)
    })

    socket.on('leaderboard-connect',()=>{
        socket.join('leaderboard')
        leaderboardID = socket.id
        socket.emit('leaderboard-data',activePlayerList)
    })

    socket.on('code-send',code=>{
        if(gameState.active){
            let player = activePlayerList.find(i=>i.code==code)
            if(player){
                socket.join('game-stage1')
                socket.emit('code-accepted',{name:player.name,lastName:player.lastName,classGroup:player.classGroup})
            }
            else{
                socket.emit('code-denied')
            }
        }
        else{
            socket.emit('game-inactive')
        }
    })

    socket.on('next-question',()=>{
        if(gameState.currentStage===1){
            let singleQuestion = activeOneQuestions[gameState.currentStageOneQuestion];
            io.in('game-stage1').emit('question-stage1',{questionText:singleQuestion.questionText})
        }
        if(gameState.currentStage===2){

        }
    })
})
