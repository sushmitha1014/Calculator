
const result = document.getElementById("result");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let current = "0";
let storedValue = null;
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
    result.value = current;
}

function clearCalculator() {
    current = "0";
    storedValue = null;
    operator = null;
    waitingForOperand = false;
    previous.textContent = "";
    updateDisplay();
}

function inputNumber(number) {
    if (current === "Error" || waitingForOperand) {
        current = number;
        waitingForOperand = false;
    } else {
        current = current === "0" ? number : current + number;
    }
    updateDisplay();
}

function inputDecimal() {
    if (current === "Error" || waitingForOperand) {
        current = "0.";
        waitingForOperand = false;
    } else if (!current.includes(".")) {
        current += ".";
    }
    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const value = Number(current);

    if (operator && !waitingForOperand) {
        calculate();
    } else {
        storedValue = value;
    }

    operator = nextOperator;
    waitingForOperand = true;
    previous.textContent = `${storedValue} ${getSymbol(operator)}`;
}

function calculate() {
    if (operator === null || storedValue === null) return;

    const first = storedValue;
    const second = Number(current);
    let answer;

    switch (operator) {
        case "+":
            answer = first + second;
            break;
        case "-":
            answer = first - second;
            break;
        case "*":
            answer = first * second;
            break;
        case "/":
            if (second === 0) {
                current = "Error";
                previous.textContent = "Cannot divide by zero";
                storedValue = null;
                operator = null;
                waitingForOperand = true;
                updateDisplay();
                return;
            }
            answer = first / second;
            break;
        default:
            return;
    }

    current = Number.isFinite(answer)
        ? String(Number(answer.toPrecision(12)))
        : "Error";

    previous.textContent = `${first} ${getSymbol(operator)} ${second} =`;
    storedValue = null;
    operator = null;
    waitingForOperand = true;
    updateDisplay();
}

function getSymbol(op) {
    return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

function deleteLast() {
    if (current === "Error" || waitingForOperand) {
        current = "0";
        waitingForOperand = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : "0";

        if (current === "-") current = "0";
    }
    updateDisplay();
}

function applyPercent() {
    if (current !== "Error") {
        current = String(Number(current) / 100);
        updateDisplay();
    }
}

function toggleSign() {
    if (current !== "Error" && Number(current) !== 0) {
        current = String(-Number(current));
        updateDisplay();
    }
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
    } else if (button.dataset.op) {
        chooseOperator(button.dataset.op);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;
            case "delete":
                deleteLast();
                break;
            case "decimal":
                inputDecimal();
                break;
            case "percent":
                applyPercent();
                break;
            case "sign":
                toggleSign();
                break;
            case "equals":
                calculate();
                break;
        }
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        applyPercent();
    }
});

updateDisplay();