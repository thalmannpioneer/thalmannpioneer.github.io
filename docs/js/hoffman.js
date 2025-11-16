'use strict';


//Переменные
let stringInput = document.getElementById("str-input")
let absResNotification = document.getElementsByClassName("absres-notification")[0];
let binOutput = document.getElementById("str-output");
let keysOutput = document.getElementById("str-output-keys");
let ratioOutput = document.getElementById("str-output-ratio");
let secondSection = document.getElementsByClassName("hoffman-second-section")[0];


//Функции
function utf8Length(str) {
    let encoder = new TextEncoder();
    let utf8Bytes = encoder.encode(str);

    let binaryRepresentations = Array.from(utf8Bytes).map(byte => {return byte.toString(2).padStart(8, '0');});

    return binaryRepresentations.join("").length;
}

function computeString() {
    let lettersCount = new Map();
    let usedLetters = new Set();
    let lettersCountConv = [];
    let codes = new Map();
    let computedString = stringInput.value;

    if(computedString == "") {
        absResNotification.classList.add("notification_shown");
        stringInput.style.background = "#ff7777ff";
        setTimeout(() => {
            absResNotification.classList.remove("notification_shown");
            stringInput.style.background = "white";
        }, 1000);
        return;
    }

    for(let c of computedString) {
        usedLetters.add(c);
        codes.set(c, "");
        if(lettersCount.has(c)) lettersCount.set(c, lettersCount.get(c) + 1);
        else lettersCount.set(c, 1);
    }

    for(let c of usedLetters) lettersCountConv.push([lettersCount.get(c), c])
    
    lettersCountConv.sort(function(a, b) {return b[0] - a[0];});

    if(lettersCountConv.length == 1) {
        codes.set(lettersCountConv[0][1], "0");
    }
    while(lettersCountConv.length > 1) {
        let newUnion = [
            lettersCountConv[lettersCountConv.length - 1][0] + lettersCountConv[lettersCountConv.length - 2][0],
            lettersCountConv[lettersCountConv.length - 1][1] + lettersCountConv[lettersCountConv.length - 2][1]
        ];
        
        for(let c of lettersCountConv[lettersCountConv.length - 1][1]) codes.set(c, codes.get(c) + "0");
        for(let c of lettersCountConv[lettersCountConv.length - 2][1]) codes.set(c, codes.get(c) + "1");

        lettersCountConv.pop();
        lettersCountConv.pop();
        lettersCountConv.push(newUnion);
        
        lettersCountConv.sort(function(a, b) {return b[0] - a[0];});
    }

    let stringOutput = "";
    let compareLength = utf8Length(stringInput);
    let mapOutput = "";
    
    for(let c of computedString) stringOutput += codes.get(c);
    for(let c of usedLetters) mapOutput += `<p class="map-output">${c} - ${codes.get(c)}</p>`;

    let ratio = 1 - stringOutput.length / compareLength;
    ratio = ratio.toFixed(2);

    binOutput.value = stringOutput;
    binOutput.style.width = binOutput.value.length * 30 + "px";
    binOutput.style.height = "auto";
    binOutput.style.height = binOutput.scrollHeight + "px";

    keysOutput.innerHTML = mapOutput;

    ratioOutput.value = ratio * 100 + "% меньше";
    ratioOutput.style.width = ratioOutput.value.length * 30 + "px";
    ratioOutput.style.height = "auto";
    ratioOutput.style.height = ratioOutput.scrollHeight + "px";

    secondSection.classList.remove("hoffman-second-section_hidden");
}

function clearOutput() {
    stringInput.value = "";
    binOutput.value = "";
    binOutput.style.height = "auto";
    keysOutput.innerHTML = "";
    secondSection.classList.add("hoffman-second-section_hidden");
    stringInput.style.height = "auto";
    stringInput.style.width = stringInput.style.minWidth;
}


//Действия при запуске
stringInput.addEventListener("input", () => {
    stringInput.style.height = "auto";
    stringInput.style.height = stringInput.scrollHeight + "px";
    stringInput.style.width = stringInput.value.length * 45 + "px";
})