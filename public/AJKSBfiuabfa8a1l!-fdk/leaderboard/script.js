const socket = io()

let playerData;
socket.on('connect',()=>{
    socket.emit('leaderboard-connect')
})
socket.on('leaderboard-data',(activePlayers)=>{
    playerData=activePlayers
    console.log(activePlayers);
    updateList()
})
function updateList(){

}
