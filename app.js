const backwardBtnEl = document.querySelector('.calc__history__btn--backward')
const forwardBtnEl = document.querySelector('.calc__history__btn--forward')
const historyDisplayEl = document.querySelector('.calc__history__content')
const displayEl = document.querySelector('.calc__display__content')
const keyboardEl = document.querySelector('.calc__button-container')

const defaultFontSize = 50
const maxNumberOfDigitsOnDisplay = 16

let currentDisplayValue = '0'
let currentDisplayFontSize = defaultFontSize

const getDisplayContainerSize = () => displayEl.parentNode.getBoundingClientRect().width

const getDisplayContentSize = () => displayEl.scrollWidth

const setDisplayFontSize = size => {
    displayEl.style.fontSize = `${size}px`
}

const updateDisplay = () => {
    displayEl.classList.add('is-hidden')
    displayEl.textContent = currentDisplayValue
    while(getDisplayContentSize() > getDisplayContainerSize()) {
        currentDisplayFontSize -= 0.1
        setDisplayFontSize(currentDisplayFontSize)
        console.log(getDisplayContentSize());
    }
    displayEl.classList.remove('is-hidden')
}