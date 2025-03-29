const Base = Object.freeze({
    BIN: 2,
    OCT: 8,
    DEC: 10,
    HEX: 16
});
const decimalToHex = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' };
const hexToDecimal = { 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15 };

let sourceBase, destinationBase, numberToConvert;

const fromButtons = document.querySelectorAll("#convert-from .btn");
const toButtons = document.querySelectorAll("#convert-to .btn");
const convertBtn = document.getElementById("convert");
const numberInput = document.getElementById("numberToConvert");

fromButtons.forEach((btn) => btn.addEventListener("click", function () {
    sourceBase = Number(this.dataset.base);
    handleButtonClick(this, fromButtons);
}));

toButtons.forEach((btn) => btn.addEventListener("click", function () {
    destinationBase = Number(this.dataset.base);
    handleButtonClick(this, toButtons);
}));

const handleButtonClick = function (btn, siblingsBtns) {
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
    numberToConvert = numberInput.value;
    if (numberInput == "" || !sourceBase || !destinationBase) return;
    let isValid = isValidInput(sourceBase, numberToConvert);
    if (!isValid) {
        alert(`Not valid number in base ${sourceBase} `);
    } else {
        let result = convertFromBaseToBase(numberToConvert, sourceBase, destinationBase);
        handleResult(result);
    }
});

/* Optional : Verify if a number is valid for a given base. */
const isValidInput = function (base, number) {
    for (let char of number) {
        if (base === Base.BIN && (char !== '0' && char !== '1')) return false;
        if (base === Base.OCT && (char < '0' || char > '7')) return false;
        if (base === Base.DEC && (char < '0' || char > '9')) return false;
        if (base === Base.HEX && !((char >= '0' && char <= '9') || (char >= 'A' && char <= 'F') || (char >= 'a' && char <= 'f'))) {
            return false;
        }
    }
    return true;
}

const handleResult = function (result) {
    const resultElement = clearResult();
    resultElement.innerHTML = `${numberToConvert} <sub>${sourceBase}</sub> = ${result} <sub>${destinationBase}</sub>`;
    numberInput.value = "";
}

const convertFromBaseToBase = function (number, sourceBase, destinationBase) {
    if (sourceBase == destinationBase) {
        return "" + number;
    }
    let decimalNumber = convertFromBaseToDicimal(number, sourceBase);
    return convertDecimalToBase(decimalNumber, destinationBase);
}

const convertFromBaseToDicimal = function (number, BASE) {
    let result = 0;
    let position = 0;
    while (number != "") {
        let ones = number.slice(-1);
        ones = ones.toUpperCase(); // Handle lowercase letters in a hexadecimal base.
        if (BASE == Base.HEX && hexToDecimal[ones]) {
            ones = hexToDecimal[ones];
        }
        ones = parseInt(ones);
        result += ones * Math.pow(BASE, position);
        number = number.slice(0, -1);
        position++;
    }
    return result;
}

const convertDecimalToBase = function (number, BASE) {
    let result = "";
    if (number == 0) return "0";
    while (number > 0) {
        let reminder = number % BASE;
        if (BASE == Base.HEX && decimalToHex[reminder]) {
            reminder = decimalToHex[reminder];
        }
        number = parseInt(number /= BASE);
        result = reminder + result;
    }
    return result;
}