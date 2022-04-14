const nextQuestionButton = document.getElementById('nextQuestionButton')
const questionContainer = document.getElementById('questionContainer')
const nextStageButton = document.getElementById('nextQuestionButton')
const socket = io()
let timer
let time
let currentStage=1
socket.on('connect',()=>{
    socket.emit('host-join')
})

function chooseGroup(group){
    socket.emit('host-choose-group',group)
}

socket.on('leaderboard-data',()=>{
    console.log("aaaa");
})

socket.on('group-accepted',(playerList,questionList)=>{
    console.log(playerList,questionList);
})

socket.on('question-over',()=>{
    clearInterval(timer)
    console.log('it works');
})

nextQuestionButton.addEventListener('click',()=>{
    socket.emit('next-question')
    timerStart();
})

nextStageButton.addEventListener('click',()=>{
    socket.emit()
})

function timerStart(){
    if(currentStage==1){
        time=10
    }
    if(currentStage==2){
        time=15
    }
    timer = setInterval(()=>{
        time-=1
        if(time==0){
            socket.emit('time-up');
        }
    },1000)
}

