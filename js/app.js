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
let historyValue = ''
let inputValue = ''
let resultValue = ''
let currentOperation = ''

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

const isValueEmpty = value => {
    return (value === '' || value === '0') ? true : false
}

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
    const conditionToResetValue =
        isValueEmpty(valueDisplayEl.textContent) || isValueEmpty(inputValue) || isOperation || isShowingResults
    if (conditionToResetValue) {
        inputValue = value
    } else if (inputValue === '-0') {
        inputValue = `-${value}`
    } else {
        inputValue += value
    }
    if (!isValueReachedMaximumLength(inputValue)) {
        renderDisplayValue(inputValue)
        isOperation = false
        isShowingResults = false
    } else {
        showError()
    }
}

const changeInterfaceTheme = () => {
    darkItemsEl.forEach(item => {
        item.classList.toggle('dark')
    })
}

const complementaryOperations = {
    dot: () => {
        const inputValueHasDot = inputValue.indexOf('.') >= 0
        if (!inputValueHasDot) {
            if (isValueEmpty(inputValue)) {
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
        historyValue = ''
        inputValue = '0'
        resultValue = ''
        currentOperation = ''
        renderDisplayValue(inputValue)
    },
    negative: () => {
        const isInputValueNegative = inputValue.indexOf('-') >= 0
        if (!isInputValueNegative) {
            let negativeValue = ''
            if (isValueEmpty(inputValue)) {
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
    let currentValue = ''
    let updatedValue  = ''
    if (value.indexOf('-') >= 0 && value.length > 1) {
        updatedValue = `(${value})`
    } else {
        updatedValue = value
    }
    if (!isValueEmpty(historyDisplayEl.textContent)) {
        currentValue = historyDisplayEl.textContent
    }
    let newValue = ''
    if (isOperation && isShowingResults) {
        newValue = currentValue.trim().replace(/.$/, updatedValue)
    } else {
        newValue = `${currentValue}${updatedValue}`
    }
    renderHistoryDisplay(newValue)
}

//TODO arrumar quando zero é o primeiro valor
const handleOperationInput = operation => {
    if (!isOperation && isValueEmpty(resultValue)) {
        resultValue = inputValue
        currentOperation = operation
        updateHistoryValue(resultValue)
        updateHistoryValue(mathOperations[operation].symbol)
        complementaryOperations.clear()
        renderDisplayValue(resultValue, 'result')
        isOperation = true
        return
    }
    if (isOperation) {
        updateHistoryValue(mathOperations[operation].symbol)
        currentOperation = operation
        return
    }
    if (!isOperation && (resultValue !== '') && (inputValue !== '') && !isValueEmpty(currentOperation)) {
        updateHistoryValue(inputValue)
        updateHistoryValue(mathOperations[operation].symbol)
        const value1 = Number(resultValue)
        const value2 = Number(inputValue)
        resultValue = mathOperations[currentOperation].calc(value1, value2)
        currentOperation = operation
        complementaryOperations.clear()
        renderDisplayValue(resultValue, 'result')
        isOperation = true
    }
}

const handleNumberInput = value => {
    updateInputValue(value)
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