const first = document.getElementById('first')
const second = document.getElementById('second')
const third = document.getElementById('third')
const generateButton = document.getElementById('generateCode')
const codeInput = document.getElementById('code')

let existingCodes = []

async function updateList(){
    const json = await fetch('/players/')
    const players =await json.json()
    existingCodes=[]
    console.log(players)
    for(const player of players){
        let {name, lastName,code, classGroup, group}=player
        
        existingCodes.push(code)
        let div = document.createElement('div');
        div.textContent = `${classGroup} ${name} ${lastName}: ${code}`
        if(group =="1"){
            first.append(div)
        }
        else if(group=="2"){
            second.append(div)
        }
        else{
            third.append(div)
        }
    }
}
function generateCode(){
    console.log(existingCodes);
    let newCode = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
    if(existingCodes.includes(newCode)){
        console.log("repeat");
        return generateCode()
    }
    else{
        return newCode
    }
}
generateButton.addEventListener('click',()=>{
    codeInput.value= generateCode()
})
updateList()
