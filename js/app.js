const darkItemsEl = document.querySelectorAll('.dark')
const changeThemeToggleEl = document.querySelector('.theme-toggle-container')
const numberButtonsEl = document.querySelectorAll('[data-js="number"]')
const operationButtonsEl = document.querySelectorAll('[data-js="operation"]')
const valueDisplayEl = document.querySelector('.value-display')
const errorDisplayEl = document.querySelector('.error')
const dotButtonEl = document.querySelector('[data-js="dot"]')
const clearOperationButtonEl = document.querySelector('[data-js="clear"]')
const clearAllButtonEl = document.querySelector('[data-js="clear-all"]')
const negativeButtonEl = document.querySelector('[data-js="negative"]')

const maxCharacterNumberOnDisplay = 16
const maxCharactersOnDefaultSize = 10
const valueDisplayInitialSize = 4.7

let isOperation = false
let isError = false
let historyDisplay = ''
let displayValue = ''
let firstValue = ''
let secondValue = ''
let actualOperation = ''

const mathOperations = {
    divide: {
        symbol: '/',
        calc: (value1, value2) => value1 / value2
    },
    multiply: {
        symbol: 'x',
        calc: (value1, value2) => value1 * value2
    },
    subtract: {
        symbol: '-',
        calc: (value1, value2) => value1 - value2
    },
    sum: {
        symbol: '+',
        calc: (value1, value2) => value1 + value2
    },
}

const isDisplayValueZeroOrEmpty = () => (displayValue === '' || displayValue === '0') ? true : false

const isDisplayValueReachedMaximumLength = () => {
    let displayValueLength = displayValue.length
    if (displayValue.indexOf('.') >= 0) {
        displayValueLength--
    }
    if (displayValue.indexOf('-') >= 0) {
        displayValueLength--
    }
    return (displayValueLength >= maxCharacterNumberOnDisplay) ? true : false
}

const showError = () => {
    errorDisplayEl.classList.add('show-error')
    isError = true
}

const removeError = () => {
    if (errorDisplayEl.classList.contains('show-error')) {
        errorDisplayEl.classList.remove('show-error')
        isError = false
    }
}


//TODO: arrumar erro ao digitar operadores
const updateDisplayValue = value => {
    if (!isDisplayValueReachedMaximumLength()) {
        if (isOperation) {
            displayValue = `<span>${value}</span>`
        } else {
            if (isDisplayValueZeroOrEmpty()) {
                displayValue = value
            } else {
                displayValue += value
            }
        }
        renderDisplayValue()
    } else {
        showError()
    }
}

const fontSizeAutoAdjust = () => {
    const displayValueLength = displayValue.length
    if (displayValueLength > maxCharactersOnDefaultSize) {
        const fontSize = (maxCharactersOnDefaultSize * valueDisplayInitialSize) / displayValueLength
        valueDisplayEl.style.fontSize = `${fontSize}rem`
    }
}

const renderDisplayValue = () => {
    fontSizeAutoAdjust()
    if (displayValue === '') {
        valueDisplayEl.innerHTML = '0'
    } else {
        valueDisplayEl.innerHTML = displayValue
    }
}

const changeInterfaceTheme = () => {
    darkItemsEl.forEach(item => {
        item.classList.toggle('dark')
    })
}

const complementaryOperations = {
    dot: () => {
        const displayValueHasDot = displayValue.indexOf('.') >= 0
        if (!displayValueHasDot) {
            if (isDisplayValueZeroOrEmpty()) {
                updateDisplayValue('0.')
            } else {
                updateDisplayValue('.')
            }
        }
    },
    clear: () => {
        displayValue = ''
        renderDisplayValue()
    },
    clearAll: () => {
        isOperation = false
        isError = false
        historyDisplay = ''
        displayValue = '0'
        firstValue = ''
        secondValue = ''
        actualOperation = ''
        renderDisplayValue()
    },
    negative: () => {
        const isDisplayValueNegative = displayValue.indexOf('-') >= 0
        if (!isDisplayValueNegative) {
            let negativeValue = ''
            if (isDisplayValueZeroOrEmpty()) {
                negativeValue = '-0'
            } else {
                negativeValue = `-${displayValue}`
            }
            complementaryOperations.clear()
            updateDisplayValue(negativeValue)
        } else {
            const positiveValue = displayValue.replace(/-/i, '')
            complementaryOperations.clear()
            updateDisplayValue(positiveValue)

        }
    }
}


//TODO consertar erro ao inserir operador com valor já na tela
const handleOperationButtons = event => {
    const operationType = event.target.dataset.value
    const isActualOperationEmpty = actualOperation === ''
    if (isDisplayValueZeroOrEmpty && isActualOperationEmpty && !isOperation) {
        firstValue = '0'
        actualOperation = operationType
        isOperation = true
        updateDisplayValue(mathOperations[operationType].symbol)
        return
    }
    if (!isDisplayValueZeroOrEmpty && isActualOperationEmpty && !isOperation) {
        firstValue = displayValue
        actualOperation = operationType
        isOperation = true
        updateDisplayValue(mathOperations[operationType].symbol)
        return
    }
    if (isOperation) {
        actualOperation = operationType
        updateDisplayValue(mathOperations[operationType].symbol)
        return
    }
    if (secondValue !== '' && !isOperation) {
        const firstNumberValue = Number(firstValue)
        const secondNumberValue = Number(secondValue)
        const result = mathOperations[actualOperation].calc(firstNumberValue, secondNumberValue)
        firstValue = result.toString()
        secondValue = ''
        complementaryOperations.clear()
        updateDisplayValue(firstValue)
        actualOperation = operationType
        isOperation = true
        return
    }
}

changeThemeToggleEl.addEventListener('click', changeInterfaceTheme)

numberButtonsEl.forEach(numberButton => {
    const buttonValue = numberButton.dataset.value
    numberButton.addEventListener('click', () => {
        updateDisplayValue(buttonValue)
    })
})

dotButtonEl.addEventListener('click', complementaryOperations.dot)

clearOperationButtonEl.addEventListener('click', complementaryOperations.clear)

clearAllButtonEl.addEventListener('click', complementaryOperations.clearAll)

negativeButtonEl.addEventListener('click', complementaryOperations.negative)

operationButtonsEl.forEach(operationButton => {
    operationButton.addEventListener('click', handleOperationButtons)
})