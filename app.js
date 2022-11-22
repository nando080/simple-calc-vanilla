const backwardBtnEl = document.querySelector('.calc__history__btn--backward')
const forwardBtnEl = document.querySelector('.calc__history__btn--forward')
const historyDisplayEl = document.querySelector('.calc__history__content')
const displayEl = document.querySelector('.calc__display__content')
const keyboardEl = document.querySelector('.calc__button-container')

let isError = false

const keyboardOperations = {
    number: function(value) {
    }
}

const clearCalc = () => {
    isError = false
}

const keyboardHandle = event => {
    const buttonType = event.target.dataset.js
    const buttonValue = event.target.dataset.value
    
    if (!isError || buttonValue === 'clear') {
        keyboardOperations[buttonType](buttonValue)
    }
    
    console.log(buttonType, buttonValue);
}

keyboardEl.addEventListener('click', keyboardHandle)