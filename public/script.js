let codeField = document.getElementById('code')
let button = document.getElementById('codeButton')
let url =  new URL(document.location)
let problem = url.searchParams.get('error');
let code;
button.addEventListener('click',()=>{
    code = codeField.value;
    if(code){
        window.location.href="/game/" + "?code=" + code;
    }
})
if(problem=="noGame"){
    
}

if(problem=="wrongCode"){

}
