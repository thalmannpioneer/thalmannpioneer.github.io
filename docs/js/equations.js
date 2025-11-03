'use strict';

let systemContainer = document.getElementsByClassName("system")[0];
let matrixInputs = document.getElementsByClassName("system__input");
let resultantsInputs = document.getElementsByClassName("system__resultant-input");
let signInputs = document.getElementsByClassName("system__operation-selection");
let matrixOutputs = document.getElementsByClassName("matrix__output");
let deltaOutput = document.getElementsByClassName("delta__output")[0];
let varsOutput = document.getElementsByClassName("variables__output");
let nanNotification = document.getElementsByClassName("nan-notification")[0];
let absResNotification = document.getElementsByClassName("absres-notification")[0];
let resultContainer = document.getElementsByClassName("equations-second-section")[0];
let secondTitle = document.getElementById("equations-secondtitle");
let variablesContainer = document.getElementsByClassName("equations-second-section__variables")[0];

function computeDelta(matrix) {
    let result = 0;

    for(let i = 0; i < 3; i++) {
        let temp = 1;
        let x = i;
        let y = 0;
        for(let j = 0; j < 3; j++) {
            if((x + 1) == 4) x = 0;
            temp *= matrix[x + y * 3];
            y++;
            x++;
        }
        result += temp;
    }

    for(let i = 2; i >= 0; i--) {
        let temp = 1;
        let x = i;
        let y = 0;
        for(let j = 0; j < 3; j++) {
            if(x == -1) x = 2;
            temp *= matrix[x + y * 3];
            y++;
            x--;
        }
        result -= temp;
    }

    return result;
}

function computeEquation() {
    resultContainer.classList.remove("equations-second-section_visible");

    let convertedInputs = [];
    let resultants = [];
    let signs = [];

    for(let input of matrixInputs) {
        let temp = Number(input.value.replace(',', '.'));
        if(input.value == "") temp = 1;
        if(isNaN(temp)) {
            nanNotification.classList.add("notification_shown");
            input.style.background = "#ff7777ff";
            setTimeout(() => {
                nanNotification.classList.remove("notification_shown");
                input.style.background = "white";
            }, 1000);
            return;
        }
        convertedInputs.push(temp);
    }
    for(let input of resultantsInputs) {
        let temp = Number(input.value.replace(',', '.'));
        if(input.value == "") {
            absResNotification.classList.add("notification_shown");
            input.style.background = "#ff7777ff";
            setTimeout(() => {
                absResNotification.classList.remove("notification_shown");
                input.style.background = "white";
            }, 1000);
            return;
        }
        if(isNaN(temp)) {
            nanNotification.classList.add("notification_shown");
            input.style.background = "#ff7777ff";
            setTimeout(() => {
                nanNotification.classList.remove("notification_shown");
                input.style.background = "white";
            }, 1000);
            return;
        }
        resultants.push(temp);
    }
    for(let sign of signInputs) signs.push(sign.value);

    for(let i = 0; i < 6; i++) if(signs[i] == '-') convertedInputs[i + 1 + Math.floor(i / 2)] *= -1;

    // console.log(convertedInputs);
    // console.log(resultants);
    // console.log(signs);
    
    let delta = computeDelta(convertedInputs);

    // console.log(delta);

    let xMatrix = convertedInputs.slice();
    xMatrix[0] = resultants[0];
    xMatrix[3] = resultants[1];
    xMatrix[6] = resultants[2];

    let yMatrix = convertedInputs.slice();
    yMatrix[1] = resultants[0];
    yMatrix[4] = resultants[1];
    yMatrix[7] = resultants[2];

    let zMatrix = convertedInputs.slice();
    zMatrix[2] = resultants[0];
    zMatrix[5] = resultants[1];
    zMatrix[8] = resultants[2];

    let x = computeDelta(xMatrix) / delta;
    let y = computeDelta(yMatrix) / delta;
    let z = computeDelta(zMatrix) / delta;

    // console.log(`${x}, ${y}, ${z}`);

    let maxWidth = 0;
    for(let i = 0; i < 9; i++) {
        matrixOutputs[i].value = String(convertedInputs[i]);
        maxWidth = Math.max(maxWidth, matrixOutputs[i].value.length * 30);
    }
    for(let i = 0; i < 9; i++) matrixOutputs[i].style.width = maxWidth + "px";

    deltaOutput.value = String(delta);
    deltaOutput.style.width = deltaOutput.value.length * 30 + "px";

    maxWidth = 0;
    varsOutput[0].value = isFinite(x) ? parseFloat(x.toFixed(3)) : "0/" + delta;
    maxWidth = varsOutput[0].value.length * 30;
    varsOutput[1].value = isFinite(y) ? parseFloat(y.toFixed(3)) : "0/" + delta;
    maxWidth = Math.max(maxWidth, varsOutput[1].value.length * 30);
    varsOutput[2].value = isFinite(z) ? parseFloat(z.toFixed(3)) : "0/" + delta;
    maxWidth = Math.max(maxWidth, varsOutput[2].value.length * 30);

    varsOutput[0].style.width = maxWidth + "px";
    varsOutput[1].style.width = maxWidth + "px";
    varsOutput[2].style.width = maxWidth + "px";

    setTimeout(() => { resultContainer.classList.add("equations-second-section_visible"); }, 100);

    if(delta == 0) secondTitle.textContent = "Результат неопределёнен: деление на ноль (Δx / Δ, при Δ = 0).";
    else {
        secondTitle.textContent = "Переменные:";
        variablesContainer.classList.add("equations-second-section__variables_visible");
    }
}

function clearEquation() {
    for(let input of matrixInputs) input.value = "";
    for(let input of resultantsInputs) input.value = "";
    for(let input of signInputs) input.selectedIndex = 0;
    resultContainer.classList.remove("equations-second-section_visible");
    systemContainer.classList.add("system_hidden");
    setTimeout(() => {
        systemContainer.classList.remove("system_hidden");
        for(let input of matrixInputs) input.style.width = 36 + "px";
        for(let input of resultantsInputs) input.style.width = 36 + "px";
    }, 100);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


for(let input of matrixInputs) {
    input.style.width = input.value.length * 21 + "px";
    input.addEventListener("input", () => { input.style.width = input.value.length * 21 + "px"; })
}
for(let input of resultantsInputs) {
    input.style.width = input.value.length * 21 + "px";
    input.addEventListener("input", () => { input.style.width = input.value.length * 21 + "px"; })
}