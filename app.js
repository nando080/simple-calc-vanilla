const backwardBtnEl = document.querySelector('.calc__history__btn--backward')
const forwardBtnEl = document.querySelector('.calc__history__btn--forward')
const historyDisplayEl = document.querySelector('.calc__history__content')
const displayEl = document.querySelector('.calc__display__content')
const keyboardEl = document.querySelector('.calc__button-container')

const defaultFontSize = 50
const maxNumberOfDigitsOnDisplay = 16

let currentDisplayFontSize = defaultFontSize

let isError = false
let currentDisplayValue = '0'

const calcValue = {
    firstValue: 0,
    secondValue: 0,
    result: 0,
    stringResult: ''
}

const mathOperations = {
    divide: values => {
        if (values[0] === 0 || values[1] === 0) {
            return 0
        }
        return values[0] / values[1]
    },
    multiply: values => {
        if (values[0] === 0 || values[1] === 0) {
            return 0
        }
        return values[0] * values[1]
    },
    subtract: values => values[0] - values[1],
    sum: values => values[0] + values[1]
}

const displayValueProperties = {
    isNegative: () => currentDisplayValue.search(/-/i) >= 0,
    isFloat: () => currentDisplayValue.search(/\./i) >= 0,
    totalSize: () => {
        let value = currentDisplayValue
        if (displayValueProperties.isNegative()) {
            value = value.replace(/-/i, '')
        }
        if (displayValueProperties.isFloat()) {
            value = value.replace(/\./i, '')
        }
        return value.length
    },
    integerSize: () => {
        let value = currentDisplayValue
        value = value.replace(/-/i, '')
        if (displayValueProperties.isFloat()) {
            const values = currentDisplayValue.split('.')
            return values[0].length
        }
        return value.length
    },
    decimalSize: () => {
        if (displayValueProperties.isFloat()) {
            const values = currentDisplayValue.split('.')
            return values[1].length
        }
        return 0
    }
}


const getDisplayContainerSize = () => displayEl.parentNode.getBoundingClientRect().width

const getDisplayContentSize = () => displayEl.scrollWidth

const setDisplayFontSize = size => {
    displayEl.style.fontSize = `${size}px`
}

const updateDisplay = () => {
    displayEl.classList.add('is-hidden')
    displayEl.textContent = currentDisplayValue
    while (getDisplayContentSize() > getDisplayContainerSize()) {
        currentDisplayFontSize -= 0.1
        setDisplayFontSize(currentDisplayFontSize)
    }
    displayEl.classList.remove('is-hidden')
}

const insertNumber = number => {
    if (currentDisplayValue === '0') {
        currentDisplayValue = number
    } else {
        currentDisplayValue += number
    }
    updateDisplay()
}

const keyboardHandle = event => {
    const keyType = event.target.dataset.js
    const keyValue = event.target.dataset.value

    if (!isError || keyType === 'clear') {
        switch (keyType) {
            case 'utility':
                console.log('utility');
                break
            case 'math-operation':
                console.log('operation');
                break
            case 'number':
                if (displayValueProperties.totalSize() < maxNumberOfDigitsOnDisplay) {
                    insertNumber(keyValue)
                }
                break
        }
    }
}

keyboardEl.addEventListener('click', keyboardHandle)