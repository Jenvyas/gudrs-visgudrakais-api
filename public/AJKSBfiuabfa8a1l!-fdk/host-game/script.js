const nextQuestionButton = document.getElementById('nextQuestionButton')
const questionContainer = document.getElementById('questionContainer')
const socket = io()

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
nextQuestionButton.addEventListener('click',()=>{
    socket.emit('next-question')
})

