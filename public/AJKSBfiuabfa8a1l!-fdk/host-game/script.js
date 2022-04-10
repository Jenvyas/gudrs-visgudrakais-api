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
