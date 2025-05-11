const hexToDecimal = { 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15 };

let sourceBase, destinationBase, numberToConvert;

const fromButtons = document.querySelectorAll("#convert-from .btn");
const toButtons = document.querySelectorAll("#convert-to .btn");
const convertBtn = document.getElementById("convert");
const numberInput = document.getElementById("numberToConvert");

fromButtons.forEach((btn) => btn.addEventListener("click", function () {
    sourceBase = Number(this.dataset.base);
    highlightSelectionAndClearResult(this, fromButtons);
}));

toButtons.forEach((btn) => btn.addEventListener("click", function () {
    destinationBase = Number(this.dataset.base);
    highlightSelectionAndClearResult(this, toButtons);
}));

const highlightSelectionAndClearResult = function (btn, siblingsBtns) {
    siblingsBtns.forEach((btn) => btn.classList.remove("chosen"));
    btn.classList.add("chosen");
    clearResult();
}

const clearResult = function () {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = "";
    return resultElement;
}

convertBtn.addEventListener("click", function () {
    numberToConvert = numberInput.value.trim();
    if (numberToConvert == "") {
        alert("Please enter a number to convert.");
        return;
    }
    if (!sourceBase) {
        alert("Please select the source base.");
        return;
    }
    if (!destinationBase) {
        alert("Please select the destination base.");
        return;
    }
    let isValid = isValidInput(sourceBase, numberToConvert);
    if (!isValid) {
        alert(`Not valid number in base ${sourceBase}!`);
        return;
    }
    let result = convertFromBaseToBase(numberToConvert, sourceBase, destinationBase);
    displayResult(result);
    clearInput();
});

const isValidInput = function (base, number) {
    number = number.toUpperCase();
    for (let char of number) {
        const digit = hexToDecimal[char] ?? parseInt(char);
        if (isNaN(digit) || digit >= base) {
            return false;
        }
    }
    return true;
}

const displayResult = function (result) {
    const resultElement = clearResult();
    resultElement.innerHTML = `${numberToConvert.toUpperCase()} <sub>${sourceBase}</sub> = ${result} <sub>${destinationBase}</sub>`;
}

const clearInput = function () {
    numberInput.value = "";
}

const convertFromBaseToBase = function (number, sourceBase, destinationBase) {
    if (sourceBase == destinationBase) {
        return number;
    }
    let decimalNumber = convertFromBaseToDicimal(number, sourceBase);
    return convertDecimalToBase(decimalNumber, destinationBase);
}

const convertFromBaseToDicimal = function (number, base) {
    number = number.toUpperCase();
    let result = 0;
    for (let i = 0; i < number.length; i++) {
        const char = number[number.length - 1 - i];
        const value = hexToDecimal[char] ?? parseInt(char);
        result += value * Math.pow(base, i);
    }
    return result;
}

const convertDecimalToBase = function (number, base) {
    const decimalToHex = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' };
    if (number == 0) return 0;
    let result = "";
    while (number > 0) {
        let remainder = number % base;
        result = (decimalToHex[remainder] ?? remainder) + result;
        number = Math.floor(number / base);
    }
    return result;
};