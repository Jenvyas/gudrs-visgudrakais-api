
const socket = io()
let player;
let url =  new URL(document.location)
let code = url.searchParams.get('code');
const nameHeader = document.getElementById('fullName')

const questionTextContainer = document.getElementById('questionTextContainer');
const answer1 = document.getElementById('answer1')
const answer2 = document.getElementById('answer2')
const answer3 = document.getElementById('answer3')
const answer4 = document.getElementById('answer4')

console.log(code);

socket.on('connection',()=>{
})

socket.emit('code-send',code)

socket.on('game-inactive',()=>{
    window.location.href="/" + "?error=noGame";
    console.log("Game is currently not active");
})

socket.on('code-accepted',(playerData)=>{
    player = playerData;
    nameHeader.textContent=player.classGroup+'. '+player.name+' '+player.lastName
})

socket.on('code-denied',()=>{
    window.location.href="/" + "?error=wrongCode";
})

socket.on('question-stage1',(question)=>{
    showStageOneQuestion(question.questionText);
})

function showStageOneQuestion(questionText){
    questionTextContainer.textContent=questionText;
    questionTextContainer.style.visibility="visible"
    answer1.style.visibility = "visible"
    answer1.textContent="Jā"
    answer2.style.visibility = "visible"
    answer2.textContent ="Nē"
}
answer1.addEventListener('click',submitAnswer)
answer1.answerValue = 1;
answer2.addEventListener('click',submitAnswer)
answer2.answerValue = 2;
answer3.addEventListener('click',submitAnswer)
answer3.answerValue = 3;
answer4.addEventListener('click',submitAnswer)
answer4.answerValue = 4;

function submitAnswer(e){
    let answer = e.currentTarget.answerValue
    questionTextContainer.style.visibility="hidden"
    answer1.style.visibility = "hidden"
    answer2.style.visibility = "hidden"
    answer3.style.visibility = "hidden"
    answer4.style.visibility = "hidden"
    socket.emit('answer',answer,code)
}



