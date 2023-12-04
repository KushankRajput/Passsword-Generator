//using  we can fetch custom attributes
let inputSlider=document.querySelector("[data-lengthSlider]");
let lengthDisplay=document.querySelector("[data-lengthNumber]");
let passwordDisplay = document.querySelector("[data-passwordDisplay]");
let copyBtn=document.querySelector("[data-copy]")
let copyMsg=document.querySelector("[data-copyMsg]")
let uppercaseCheck=document.querySelector("#upperCase")
let lowercaseCheck=document.querySelector("#lowerCase")
let numbersCheck=document.querySelector("#number") 
let symbolsCheck=document.querySelector("#symbols")
let indicator=document.querySelector("[data-indicator]")
let generateBtn=document.querySelector(".generateButton")
let allCheckBox=document.querySelectorAll("input[type=checkbox]")  //it will get all the inout tags which has type=checkbox
let symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password="";
let passwordLength=10;
let checkCount=0;  //will be used in generate password button
//set strength circle color to gray

//handle the length of password
//handleSLider will reflect the password length to UI
//whenever we will change the length of the password , we will have to call "handleSlider()" to change in the UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
handleSlider();

//set the indicator color
function setIndicator(color){
    indicator.style.background=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
} 
setIndicator("#ccc  ")

//set the length of password
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min))+min
}

//for random integer
function generateRandomNumber(){
    return getRndInteger(0,9)  //because we want a single digit number thats why range is (0,9)
}
 
// for random Lowercase character
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))     //because the the value of small "a" is 97 and small "z" is 123 (converting it into character using String.fromCharCode)
}

//for random Uppercase character 
function generateupperCase(){
    return String.fromCharCode(getRndInteger(65,91))     //because the the value of capital "A" is 65 and capital "Z" is 91 (converting it into character using String.fromCharCode)
}

//for random symbol
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length)
    return symbols.charAt(randNum)  //is will return the symbol of the random index from the symbol list
}

//for checking the strength of the password
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true
    if(lowercaseCheck.checked) hasLower=true
    if(numbersCheck.checked) hasNum=true
    if(symbolsCheck.checked) hasSym=true

    if(hasUpper && hasLower && hasNum && hasSym && passwordLength>=10){
        setIndicator("#0f0")
    }else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    }else{
        setIndicator("#f00")
    }
}

//to shuffle the password (remix the password)
function shufflePassword(array){
    //an algorigthm named (Fisher Yates Method)
    for(let i=array.length-1;i>0;i--){
        //finding the random variabale named "j"
        const j=Math.floor(Math.random()* (i+1));
        //swapping the value
        const temp =array[i];
        array[i]=array[j]
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>  (str +=el));  //this el will take all the values of above loop
    return str;
}

//for the copy button 
//navigator.clipboard.writeText is used for copy the text (passwordDisplay.value is used because we are coping the value inside the password)
//navigator.clipboard.writeText returns a promise   
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText="Copied";
    } catch (error) {
        copyMsg.innerText="failed"
    }

    //copied vala span visible krne ke liye(this "active" class will be used in "CSS")
    copyMsg.classList.add("active");

    //now we have to remove that copied text within two second
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}


//for controlling the slider
// The "InputEvent" Object handles events that occur when an input element is changed.
inputSlider.addEventListener('input',(eve)=>{
    passwordLength=eve.target.value;
    handleSlider()
})

//for coping the value(password)
copyBtn.addEventListener("click",()=>{
    // if(passwordLength.value)
    if(password.length>0)
        copyContent()   
})


function handleCheckBoxChanged(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if (checkbox.checked)
            checkCount++

            //in case we are trying a password of length "1" and we have checked all the checkboxes then 
            //it is not possible to cover all checkboxes in "1" length so...
            if (passwordLength<checkCount){
                passwordLength=checkCount;
                handleSlider()
            }
    })
}
// The onchange event occurs when the value of an HTML element is changed.
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckBoxChanged);
})



generateBtn.addEventListener("click",()=>{
    //1st case if none of the check box is selected
    if (checkCount==0){
        return
    }
    //2nd case if length of password is small than the chechkbox count
    if( passwordLength<checkCount){
        passwordLength=checkCount
        handleSlider();
    }

    // lets find the new password
    //1st remove the old password
    password="";
    //lets find out which variable we need to put inside our password (lower,upper,num,sym)

    //here we are pushing all the cases that are checked (for example:=>if uppercase is cheked then we have pushed generateuppercase() as others as it is)
    let funcArr=[];

    if (uppercaseCheck.checked){
        funcArr.push(generateupperCase)
    }

    if (lowercaseCheck.checked){
        funcArr.push(generateLowerCase)
    }

    if (numbersCheck.checked){
        funcArr.push(generateRandomNumber)
    }

    if (symbolsCheck.checked){
        funcArr.push(generateSymbol)
    }

    //adding the values to the array(complasary which is checked)
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining password (if we have the length pf 10 and we have cheked 4 checkboxes then  the remaining length will be 6)
    //let passsword.length=12 and funcArr.length=4 then (i<passwordLength-funcArr.length) will be 12-4=8
    for (let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length)
        password +=funcArr[randIndex]();
        console.log(password)
    }
    console.log("Remaining done")

    //remix the password (to ensure that which letter will be on which position)
    // Array.from() converts the password into an "array" and return it to the "shufflePassword" function
    password=shufflePassword(Array.from(password))

    //show the shullfed password in the UI
    passwordDisplay.value=password;
    // calculate the strength 
    calcStrength();
})
