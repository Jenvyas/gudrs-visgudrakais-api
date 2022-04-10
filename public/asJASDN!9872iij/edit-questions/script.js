const first = document.getElementById('first')
const second = document.getElementById('second')
const third = document.getElementById('third')
const generateButton = document.getElementById('generateCode')
const codeInput = document.getElementById('code')


async function updateList(){
    const json = await fetch('/questions/')
    const questions =await json.json()
    console.log(questions)
    for(const question of questions){
        let {questionText,correctAnswer,group}=question
        
        let div = document.createElement('div');
        div.textContent = `${questionText} ${correctAnswer}`
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
updateList()
