
const socket = io()
let player;
let url =  new URL(document.location)
let code = url.searchParams.get('code');
const nameHeader = document.getElementById('fullName')
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
    console.log(question);
})



