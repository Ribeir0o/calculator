const themeSelector = document.querySelector('.calculator__theme button');
const theme = document.querySelectorAll('link')[2];
const displayValue = document.querySelector('.display__value');
const keys = document.querySelectorAll('.calculator__keys button');

const positions  = ["9%", "40%", "70%"];
let currentPosition = 0;

themeSelector.parentElement.addEventListener("click", ()=>{
    const prevPosition = currentPosition;
    currentPosition == positions.length-1 ? currentPosition = 0: currentPosition += 1;
    themeSelector.style.left = positions[currentPosition];
    theme.setAttribute("href", `css/theme${currentPosition}.css`);

    animationKeyframe = [
        {left: `${positions[prevPosition]}`},
        {left: `${positions[currentPosition]}`}
    ]
    themeSelector.animate(animationKeyframe, 250)
});

function keyVerifier (key){
    let operation = displayValue.textContent;

    if(key.match(/(^[0-9]|\.)/)){
        key = key.replace('.', ',')
        if(key.match(/,/)){
            operation.slice(-1) == "," ? null : displayValue.textContent += key
        }else{
            operation == '0'?  displayValue.textContent = key : displayValue.textContent +=key
        }

    }else if (key.match(/\/|\+|\*|-/)){
        displayValue.textContent == 0 ? null: 
        operation.slice(-2, -1).match(/\/|\+|\*|-/) ? displayValue.textContent = operation.replace(operation.slice(-2, -1), key): 
        displayValue.textContent += ` ${key} `
    } else if (key == "Backspace") {
        displayValue.textContent.length == 1 ? displayValue.textContent = 0 : displayValue.textContent = operation.slice(0,-1);
    } else if (key == "Delete") {
        displayValue.textContent = 0;
    }else if (key == "Enter" || key == "="){
        operation = operation.replace(/,/g, '.');
        let result = Function(`return ${operation}`)();
        displayValue.textContent = result.toString().replace('.', ',');
   } 
}

document.addEventListener("keyup", (e) =>{
    keyVerifier(e.key);
});

keys.forEach(key => {
    key.addEventListener("click", ()=>{
        keyVerifier(key.id);
    })
});