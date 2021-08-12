const darkItemsEl = document.querySelectorAll('.dark')
const changeThemeToggleEl = document.querySelector('.theme-toggle-container')
const numberButtonsEl = document.querySelectorAll('[data-js="number"]')
const operationButtonsEl = document.querySelectorAll('[data-js="operation"]')
const valueDisplayEl = document.querySelector('.value-display')
const historyDisplayEl = document.querySelector('.history-display')
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
let isShowingResults = false
let isHistoryDisplayInitialized = false
let historyValue = ''
let inputValue = ''
let resultValue = ''
let currentOperation = ''

const mathOperations = {
    divide: {
        symbol: '/',
        calc: (value1, value2) => {
            if (value1 === 0 || value2 === 0) {
                return 0
            } else {
                return value1 / value2
            }
        }
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

const isValueEmpty = value => value === '' ? true : false

const isValueEqualsZero = value => value === '0' ? true : false

const isValueEmptyOrEqualsZero = value => (isValueEmpty(value) || isValueEqualsZero(value)) ? true : false

const isValueReachedMaximumLength = value => {
    let valueLength = value.length
    if (value.indexOf('.') >= 0) {
        valueLength--
    }
    if (value.indexOf('-') >= 0) {
        valueLength--
    }
    return (valueLength >= maxCharacterNumberOnDisplay) ? true : false
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

const fontSizeAutoAdjust = value => {
    const displayValueLength = value.length
    if (displayValueLength > maxCharactersOnDefaultSize) {
        const fontSize = (maxCharactersOnDefaultSize * valueDisplayInitialSize) / displayValueLength
        valueDisplayEl.style.fontSize = `${fontSize}rem`
    }
}

const renderDisplayValue = (value, type = 'input') => {
    if (!isError) {
        fontSizeAutoAdjust(value)
        valueDisplayEl.textContent = ''
        valueDisplayEl.textContent = value
        isShowingResults = type === 'result' ? true : false
    }
}

const updateInputValue = value => {

    const conditionToReplaceValue = 
        valueDisplayEl.textContent === '0' || (inputValue === '' || inputValue === '0') || isOperation || isShowingResults

    if (conditionToReplaceValue) {
        inputValue = value
    } else if (inputValue === '-0') {
        inputValue = `-${value}`
    } else {
        inputValue += value
    }

    if (isValueReachedMaximumLength(inputValue)) {
        showError()
    } else {
        renderDisplayValue(inputValue)
    }
}

const complementaryOperations = {
    dot: () => {
        const inputValueHasDot = inputValue.indexOf('.') >= 0
        if (!inputValueHasDot) {
            if (inputValue === '' || inputValue === '0') {
                updateInputValue('0.')
            } else {
                updateInputValue('.')
            }
        }
    },
    clear: () => {
        inputValue = '0'
        renderDisplayValue(inputValue)
    },
    clearAll: () => {
        isOperation = false
        isError = false
        isShowingResults = false
        isHistoryDisplayInitialized = false
        historyValue = ''
        inputValue = '0'
        resultValue = ''
        currentOperation = ''
        renderDisplayValue(inputValue)
        historyDisplayEl.classList.add('initial-state')
    },
    negative: () => {
        const isInputValueNegative = inputValue.indexOf('-') >= 0
        if (!isInputValueNegative) {
            let negativeValue = ''
            if (inputValue === '' || inputValue === '0') {
                negativeValue = '-0'
            } else {
                negativeValue = `-${inputValue}`
            }
            complementaryOperations.clear()
            updateInputValue(negativeValue)
        } else {
            const positiveValue = inputValue.replace(/-/i, '')
            complementaryOperations.clear()
            updateInputValue(positiveValue)
        }
    }
}

const renderHistoryDisplay = value => {
    let currentValue = value.trim()
    currentValue = currentValue.replace(/ /ig, '')
    currentValue = currentValue.replace(/\//ig, '<span> / </span>')
    currentValue = currentValue.replace(/x/ig, '<span> x </span>')
    currentValue = currentValue.replace(/\+/ig, '<span> + </span>')
    currentValue = currentValue.replace(/=/ig, '<span> = </span>')
    currentValue = currentValue.replace(/-/ig, '<span> - </span>')
    historyDisplayEl.innerHTML = ''
    historyDisplayEl.innerHTML = currentValue
    historyDisplayEl.classList.remove('initial-state')
}

const updateHistoryValue = value => {
    const currentHistoryDisplayValue = historyDisplayEl.textContent
    let updatedValue = value
    let newHistoryValue = ''

    if (!isOperation) {
        if (value.indexOf('-') === 0 && value.length > 1) {
            updatedValue = `(${value})`
        }
    
        if (!isHistoryDisplayInitialized) {
            newHistoryValue = updatedValue
        } else {
            newHistoryValue = `${currentHistoryDisplayValue}${updatedValue}`
        }
    }

    if (isOperation) {
        newHistoryValue = currentHistoryDisplayValue.trim().replace(/.$/, updatedValue)
    }

    renderHistoryDisplay(newHistoryValue)

    isHistoryDisplayInitialized = true
}


const handleOperationInput = operation => {
    if (isOperation) {
        currentOperation = operation
        updateHistoryValue(mathOperations[operation].symbol)
    } else {
        if (resultValue === '' && inputValue === '') {
            resultValue = '0'
            currentOperation = operation
            updateHistoryValue(resultValue)
            updateHistoryValue(mathOperations[operation].symbol)
            isOperation = true
        } else if (resultValue === '' && inputValue !== '') {
            resultValue = inputValue
            //inputValue = '0'
            currentOperation = operation
            updateHistoryValue(resultValue)
            updateHistoryValue(mathOperations[operation].symbol)
            complementaryOperations.clear()
            isOperation = true
        } else {
            const value1 = Number(resultValue)
            const value2 = Number(inputValue)
            const mathResult = mathOperations[currentOperation].calc(value1, value2)
            resultValue = mathResult.toString()
            updateHistoryValue(inputValue)
            updateHistoryValue(mathOperations[operation].symbol)
            renderDisplayValue(resultValue)
            currentOperation = operation
            inputValue = ''
            isOperation = true
            isShowingResults = true
        }
    }
}

const handleNumberInput = value => {
    updateInputValue(value)
    isOperation = false
}

const changeInterfaceTheme = () => {
    darkItemsEl.forEach(item => {
        item.classList.toggle('dark')
    })
}

changeThemeToggleEl.addEventListener('click', changeInterfaceTheme)

numberButtonsEl.forEach(numberButton => {
    const buttonValue = numberButton.dataset.value
    numberButton.addEventListener('click', () => {
        if (!isError) {
            handleNumberInput(buttonValue)
        }
    })
})

operationButtonsEl.forEach(operationButton => {
    const operationType = operationButton.dataset.value
    operationButton.addEventListener('click', () => {
        handleOperationInput(operationType)
    })
})

dotButtonEl.addEventListener('click', complementaryOperations.dot)

clearOperationButtonEl.addEventListener('click', complementaryOperations.clear)

clearAllButtonEl.addEventListener('click', complementaryOperations.clearAll)

negativeButtonEl.addEventListener('click', complementaryOperations.negative)