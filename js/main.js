const themeSelector = document.querySelector('.calculator__theme button');
const theme = document.querySelectorAll('link')[2];
const displayValue = document.querySelector('.display__value');
const keys = document.querySelectorAll('.calculator__keys button');

const positions  = ["9%", "40%", "70%"];
let favTheme = localStorage.getItem('favTheme');
let currentPosition = favTheme ? +favTheme : 0;
themeSelector.style.left = positions[currentPosition];
theme.setAttribute("href", `css/theme${currentPosition}.css`);

themeSelector.parentElement.addEventListener("click", ()=>{
    const prevPosition = currentPosition;
    currentPosition == positions.length-1 ? currentPosition = 0: currentPosition += 1;
    themeSelector.style.left = positions[currentPosition];
    theme.setAttribute("href", `css/theme${currentPosition}.css`);
    localStorage.setItem("favTheme", currentPosition);

    animationKeyframe = [
        {left: `${positions[prevPosition]}`},
        {left: `${positions[currentPosition]}`}
    ]
    themeSelector.animate(animationKeyframe, 250)
});

const activeKeyBg = {
    theme0: ["white", "hsla(6, 93%, 67%, 1)", "hsl(224, 51%, 76%)"], 
    theme1:["white", "hsl(25, 100%, 61%)", "hsl(185, 41%, 56%)"], 
    theme2:["hsla(268, 54%, 44%, 1)", "hsla(177, 100%, 79%, 1)", "hsla(280, 56%, 44%, 1)"]
}

function animateKey (key, typeKey) {
   const currentTheme = theme.getAttribute("href").match(/theme\d/)[0];
   const button = document.getElementById(key)
   const normalBg = button.style.backgroundColor
   button.style.backgroundColor = activeKeyBg[currentTheme][typeKey-1]
   setTimeout(() => {
       button.style.backgroundColor = normalBg
    }, 300);
}

function keyVerifier (key){
    let operation = displayValue.textContent;
    if(key.match(/(^[0-9]|\.)/)){
        key = key.replace('.', ',');
        animateKey(key, 1);

        let operationArray = operation.split(' ');
        if(key.match(/,/)){
            if(!operationArray[operationArray.length-1].match(/,|\s/)){
                displayValue.textContent += key
            } 
        }else if(key.match(0)){
            operation.slice(-1) == "0" ? 
            operation.split(' ')[operation.split(' ').length - 1].match(/,/g) ?
            displayValue.textContent+=key : null : displayValue.textContent +=key
        }else{
            operation == '0'? displayValue.textContent = key : displayValue.textContent +=key
        }

    }else if (key.match(/\/|\+|\*|-/)){
        displayValue.textContent == 0 ? null:
        operation.slice(-2, -1).match(/\/|\+|\*|-/) ? displayValue.textContent = operation.replace(operation.slice(-2, -1), key): 
        displayValue.textContent += ` ${key} `;
        animateKey(key, 1);
    } else if (key == "Backspace") {
        displayValue.textContent.length == 1 ? displayValue.textContent = 0 : 
        operation.slice(-1) == ' ' ? 
        displayValue.textContent = operation.slice(0, -3):
        displayValue.textContent = operation.slice(0,-1);
        animateKey(key, 3);
    } else if (key == "Delete") {
        displayValue.textContent = 0;
        animateKey(key, 3);
    }else if (key == "Enter" || key == "="){
        operation = operation.replace(/,/g, '.');
        let result = Function(`return ${operation}`)();
        displayValue.textContent = result.toString().replace('.', ',');
        result.toString().length >= 18 ? displayValue.style.fontSize = "0.8rem" : null
        animateKey(key, 2);
   } 
}

document.addEventListener("keyup", (e) =>{
    keyVerifier(e.key);
});

keys.forEach(key => {
    key.addEventListener("click", ()=>{
        keyVerifier(key.id);
    });
});