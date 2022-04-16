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
let groupPlayerList
let connectedPlayerSockets= []
let stageOnePlayerList = []
let stageTwoPlayerList = []
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
    currentStageTwoQuestion:0,
    currentAnswer:0,
    currentQuestionCorrect:0,
    currentQuestionIncorrect:0
}

io.on('connection', async (socket)=>{
    socket.on('host-join',async ()=>{
        socket.join('host')
        playerList = await Player.find()
        questionList = await Question.find()
    })

    socket.on('host-choose-group',group=>{
        gameState = {
            active:false,
            currentStage:1,
            currentStageOneQuestion:0,
            currentStageTwoQuestion:0,
            currentAnswer:0,
            currentQuestionCorrect:0,
            currentQuestionIncorrect:0
        }
        groupPlayerList = playerList.filter(i=>i.group==group)
        activeQuestionList = questionList.filter(i=>i.group==group)
        activeOneQuestions = activeQuestionList.filter(i=>i.stage===1)
        activeTwoQuestions = activeQuestionList.filter(i=>i.stage===2)
        gameState.active=true;
        if(leaderboardID){
            socket.to(leaderboardID).emit('leaderboard-data',groupPlayerList)
        }
        socket.emit('group-accepted',groupPlayerList,activeQuestionList)
    })

    socket.on('leaderboard-connect',()=>{
        socket.join('leaderboard')
        leaderboardID = socket.id
        socket.emit('leaderboard-data',groupPlayerList)
    })

    socket.on('code-send',code=>{
        if(gameState.active){
            if (gameState.currentStage==1) {
                let player = groupPlayerList.find(i=>i.code==code)
                if(player){
                    connectedPlayerSockets.push({'socket':socket,'code':code})
                    stageOnePlayerList.push(player)
                    socket.join('game-stage1')
                    socket.emit('code-accepted',{name:player.name,lastName:player.lastName,classGroup:player.classGroup})
                }
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
        gameState.currentQuestionCorrect=0
        gameState.currentQuestionIncorrect=0
        if(gameState.active){
            if(gameState.currentStage===1){
                if(gameState.currentStageOneQuestion>=15){
                    return
                }
                let singleQuestion = activeOneQuestions[gameState.currentStageOneQuestion];
                gameState.currentAnswer=singleQuestion.correctAnswer
                io.in('game-stage1').emit('question-stage1',{questionText:singleQuestion.questionText})
                gameState.currentStageOneQuestion++
            }
            if(gameState.currentStage===2){
                let singleQuestion = activeTwoQuestions[gameState.currentStageTwoQuestion]
                gameState.currentAnswer=singleQuestion.correctAnswer
                io.in('game-stage2').emit('question-stage2',{questionText:singleQuestion.questionText,answerTextA:singleQuestion.answerTextA,
                answerTextB:singleQuestion.answerTextB,answerTextC:singleQuestion.answerTextC,answerTextD:singleQuestion.answerTextD})
            }
        }
    })

    socket.on('show-leaderboard',()=>{

    })

    socket.on('show-question-display',()=>{

    })

    socket.on('next-stage',()=>{
        if (gameState.active) {
            
        
        gameState.currentStage=2;
        stageOnePlayerList.sort((a, b)=>{
            return b.score-a.score
        })
        stageTwoPlayerList=stageOnePlayerList.slice(0,9);
        for(let i =1;i<stageOnePlayerList.length-10;i++){
            if(stageOnePlayerList[9].score==stageOnePlayerList[9+i].score){
                stageTwoPlayerList.push(stageOnePlayerList[9+i])
            }
        }
        stageTwoPlayerList.map(i=>{
            let socketIndex = connectedPlayerSockets.findIndex(j=>j.code==i.code)
            console.log(connectedPlayerSockets[socketIndex]);
            let playerSocket =connectedPlayerSockets[socketIndex].socket;
            playerSocket.join('game-stage2')
        })
    }
    })

    socket.on('answer',(answer,code)=>{
        stageOnePlayerList = stageOnePlayerList.map(i=>{
            if(i.code==code){
                if(answer==gameState.currentAnswer){
                    i.score=i.score+1
                    gameState.currentQuestionCorrect++
                }
                else{
                    gameState.currentQuestionIncorrect++
                }
            }
            return i
        })
    })

    socket.on('answer-stage2',(answer,code)=>{
        stageTwoPlayerList = stageTwoPlayerList.map(i=>{
            if(i.code==code){
                if(answer==gameState.currentAnswer){
                    i.score=i.score+1
                    gameState.currentQuestionCorrect++
                }
                else{
                    gameState.currentQuestionIncorrect++
                }
            }
            return i
        })
    })

    socket.on('time-up',()=>{
        if(gameState.currentStage==1){
            io.to('game-stage1').emit('question-over')
        }
        if(gameState.currentStage==2){
            io.to('game-stage2').emit('question-over')
        }
        socket.emit('question-over')
    })
})
