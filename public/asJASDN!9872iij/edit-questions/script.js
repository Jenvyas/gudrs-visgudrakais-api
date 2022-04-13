const first = document.getElementById('first')
const second = document.getElementById('second')
const third = document.getElementById('third')
const generateButton = document.getElementById('generateCode')
const codeInput = document.getElementById('code')
function appendQuestion(parentElement,question){
    let {questionText,correctAnswer,stage,index,answerTextA,answerTextB,answerTextC,answerTextD}=question
    let div = document.createElement('div');
    if(stage==1){
        const container = parentElement.querySelector('.first-stage')
        div.classList.add('first-stage-question')
        div.textContent=`${index}. ${questionText} ${correctAnswer}`
        container.append(div)
    }
    if(stage==2){
        const container = parentElement.querySelector('.second-stage')
        div.classList.add('second-stage-question')
        const multipleAnswers = document.createElement('div')
        multipleAnswers.classList.add('multiple-answers')
        div.textContent=`${index}. ${questionText} ${correctAnswer}`
        const answerAB = document.createElement('div')
        answerAB.classList.add('multiple-answers-answer')
        answerAB.textContent=`${answerTextA} | ${answerTextB}`
        multipleAnswers.append(answerAB)
        const answerCD = document.createElement('div')
        answerCD.classList.add('multiple-answers-answer')
        answerCD.textContent=`${answerTextC} | ${answerTextD}`
        multipleAnswers.append(answerCD)
        div.append(multipleAnswers)
        container.append(div)
    }
}

async function updateList(){
    const json = await fetch('/questions/')
    const questions =await json.json()
    console.log(questions)
    for(const question of questions){     
        const {group} = question   
        if(group =="1"){
            appendQuestion(first,question)
        }
        else if(group=="2"){
            appendQuestion(second,question)
        }
        else{
            appendQuestion(third,question)
        }
    }
}
    
updateList()
