const inputslider=document.querySelector("[datalengthslider]")
const displaylength=document.querySelector("[data-lengthnumber]")
const PasswordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]")
const CopyMsg=document.querySelector("[data-copymsg]")
const uppercasecheck=document.querySelector("#uppercase")
const lowercasecheck=document.querySelector("#lowercase")
const numbercheck=document.querySelector("#numbers")
const symbolcheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-Indicator]")
const generateBtn=document.querySelector(".generateButton")
const allcheckbox=document.querySelectorAll("input[type=checkbox]")
const symbols="~`!@#$%^&*()_-+={[}]|:;<,>.?/"

let password=""
let passwordlength= 10;
let checkcount= 0;
handleslider()
setIndicator("#ccc")

function handleslider(){
    inputslider.value=passwordlength;
    displaylength.innerText=passwordlength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize = ( (passwordlength - min)*100/(max - min)) + "% 100%"
}




function setIndicator(color){
    indicator.style.backgroundColor=color
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getrandomInteger(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}
function generaterandomnumber(){
    return getrandomInteger(0,9)
}
function generatelowercase(){
    return String.fromCharCode(getrandomInteger(97,123))
}
function generateuppercase(){
    return String.fromCharCode(getrandomInteger(65,91))
}
function generatesymbol(){
    const radnum=getrandomInteger(0,symbols.length)
    return symbols.charAt(radnum)
}
function calstrength(){
    let hasupper=false
    let haslower=false
    let hasnumber=false
    let hassymbols=false
    if(uppercasecheck.checked)hasupper=true
    if(lowercasecheck.checked)haslower=true
    if(numbercheck.checked)hasnumber=true
    if(symbolcheck.checked)hassymbols=true

    if(hasupper && haslower&&(hasnumber||hassymbols)&&(passwordlength>=8)){
        setIndicator("#0f0") //green
    } else if((haslower||hasupper)&&(hasnumber||hasnumber||hassymbols)&&passwordlength>=6){
        setIndicator("#ff0")//yellow
    }else{
        setIndicator("#f00")//red
    }
}  
//  //here we use async function method because we use navigator.clipboard.writeText to copy password 
// 'navigator.clipboard.writeText'returns promise( which either gets resolved or reject) basically to write 
//  promise we have to use async function with keyword 'await'

async function copycontent(){ 
try{
await navigator.clipboard.writeText(PasswordDisplay.value)
CopyMsg.innerText='Copied'
}
catch(e){
CopyMsg.innerText='Failed'
}  

CopyMsg.classList.add("active")

setTimeout(()=>{
    CopyMsg.classList.remove("active")
},2000);
}

function shufflepassword(array){
    // fisher yates method
    for(let i=array.length - 1;i > 0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str=""
    array.forEach((el) => (str+=el));
    return str;

}


function handlecheckboxchange(){
    checkcount = 0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkcount++
             
    });
    // /special condition
if(passwordlength < checkcount){
    passwordlength = checkcount
    handleslider();
}
}



allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange)
})

inputslider.addEventListener('input',(e)=>{
    passwordlength=e.target.value
    handleslider();
})

copyBtn.addEventListener('click',()=>{
    if(PasswordDisplay.value)
    copycontent();
})

generateBtn.addEventListener('click',() => {
    if(checkcount==0) 
        return;

    if(passwordlength<checkcount){
        passwordlength=checkcount
        handleslider()
    }
    //  start the journey to find new password
    console.log("starting the journey")

    //remove old password
    password=""

    //Generate passsword main function

    let funcArr=[];

    if(uppercasecheck.checked)
        funcArr.push(generateuppercase)
    

    if(lowercasecheck.checked)
        funcArr.push(generatelowercase)
    

    if(numbercheck.checked)
        funcArr.push(generaterandomnumber)
    

    if(symbolcheck.checked)
        funcArr.push(generatesymbol)
    

    //necessary addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("necessary addition done")

    //remaining addition
    for(let i=0; i<passwordlength-funcArr.length; i++){
      var randIndex=getrandomInteger(0,funcArr.length)
        console.log("randIndex:"+ randIndex)
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done")

       //shuffle the password
     password=shufflepassword(Array.from(password))
     console.log("shuffling password done")

    // display password in UI
     PasswordDisplay.value=password;
     console.log("UI addition done")

    // calculate the strength of the password
      calstrength()

})

