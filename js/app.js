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
const equalsButtonEl = document.querySelector('[data-js="equals"]')

const maxCharacterNumberOnDisplay = 16
const maxCharactersOnDefaultSize = 10
const valueDisplayInitialSize = 4.7

let isOperation = false
let isError = false
let isShowingOperationResults = false
let isHistoryDisplayInitialized = false
let isResult = false
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
    return (valueLength > maxCharacterNumberOnDisplay) ? true : false
}

const handleSizeOfFloatResult = value => {
    let currentValue = ''
    const isValueNegative = value.indexOf('-') >= 0
    const isFloatNumber = value.indexOf('.') >= 0
    currentValue = isValueNegative ? value.replace('-', '') : value
    const isValueTooBig =
        (isFloatNumber && currentValue.length > maxCharacterNumberOnDisplay + 1) ? true : false
    if (isValueTooBig) {
        const separatedValue = currentValue.split('.')
        if (separatedValue[0].length < maxCharacterNumberOnDisplay) {
            const numbersAfterDot = maxCharacterNumberOnDisplay - separatedValue[0].length
            const numberValue = Number(currentValue)
            currentValue = (numberValue.toFixed(numbersAfterDot)).toString()
        }
    }
    currentValue = isValueNegative ? `-${currentValue}` : currentValue
    return currentValue
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
        isShowingOperationResults = type === 'result' ? true : false
    }
}

const updateInputValue = value => {

    const conditionToReplaceValue =
        valueDisplayEl.textContent === '0' || (inputValue === '' || inputValue === '0') || isOperation || isShowingOperationResults

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
        isShowingOperationResults = false
        isHistoryDisplayInitialized = false
        isResult = false
        historyValue = ''
        inputValue = ''
        resultValue = ''
        currentOperation = ''
        valueDisplayEl.style.fontSize = `${valueDisplayInitialSize}rem`
        renderDisplayValue('0')
        historyDisplayEl.classList.add('initial-state')
        removeError()
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
    },

    equals: () => {
        if (!isError) {
            if (!isResult) {
                if (resultValue === '' && inputValue === '') {
                    resultValue = '0'
                    updateHistoryValue(resultValue)
                    updateHistoryValue('=')
                    isResult = true
                    isShowingOperationResults = true
                } else {
                    if (inputValue !== '') {
                        if (resultValue !== '') {
                            const value1 = Number(resultValue)
                            const value2 = Number(inputValue)
                            const result = mathOperations[currentOperation].calc(value1, value2)
                            updateHistoryValue(inputValue)
                            updateHistoryValue('=')
                            resultValue = handleSizeOfFloatResult(result.toString())
                            complementaryOperations.clear()
                            updateInputValue(resultValue)
                            isResult = true
                            isShowingOperationResults = true
                        }
                    } else {
                        if (isOperation) {
                            const value = Number(resultValue)
                            const result = mathOperations[currentOperation].calc(value, value)
                            isOperation = false
                            updateHistoryValue(resultValue)
                            resultValue = handleSizeOfFloatResult(result.toString())
                            updateHistoryValue('=')
                            updateInputValue(resultValue)
                            isResult = true
                            isShowingOperationResults = true
                        }
                    }
                }
            } else {

            }
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
        if (isResult) {
            currentOperation = operation
            renderHistoryDisplay('')
            updateHistoryValue(resultValue)
            updateHistoryValue(mathOperations[operation].symbol)
            isResult = false
        } else {
            if (resultValue === '' && inputValue === '') {
                resultValue = '0'
                currentOperation = operation
                updateHistoryValue(resultValue)
                updateHistoryValue(mathOperations[operation].symbol)
                isOperation = true
            } else if (resultValue === '' && inputValue !== '') {
                resultValue = inputValue
                currentOperation = operation
                updateHistoryValue(resultValue)
                updateHistoryValue(mathOperations[operation].symbol)
                isOperation = true
                isShowingOperationResults = true
            } else {
                const value1 = Number(resultValue)
                const value2 = Number(inputValue)
                const mathResult = mathOperations[currentOperation].calc(value1, value2)
                resultValue = handleSizeOfFloatResult(mathResult.toString())
                updateHistoryValue(inputValue)
                updateHistoryValue(mathOperations[operation].symbol)
                renderDisplayValue(resultValue)
                currentOperation = operation
                inputValue = ''
                isOperation = true
                isShowingOperationResults = true
            }
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

const animateKeyboardClickedButton = button => {
    button.classList.add('keyPressTransform')
    setInterval(() => {
        if (button.classList.contains('keyPressTransform')) {
            button.classList.remove('keyPressTransform')
        }
    }, 500)
}


//TODO definir ações do teclado
const handlePressedKey = event => {
    const pressedKey = event.key
    let button
    switch (pressedKey) {
        case '/':
            button = document.querySelector('[data-value="divide"]')
            animateKeyboardClickedButton(button)
            handleOperationInput('divide')
            break
        case '*':
            button = document.querySelector('[data-value="multiply"]')
            animateKeyboardClickedButton(button)
            handleOperationInput('multiply')
            break
        case '-':
            button = document.querySelector('[data-value="subtract"]')
            animateKeyboardClickedButton(button)
            handleOperationInput('subtract')
            break
        case '+':
            button = document.querySelector('[data-value="sum"]')
            animateKeyboardClickedButton(button)
            handleOperationInput('sum')
            break
        case '.':
            animateKeyboardClickedButton(dotButtonEl)
            complementaryOperations.dot()
            break
        case 'Enter':
            animateKeyboardClickedButton(equalsButtonEl)
            complementaryOperations.equals()
            break
        case '0':
            button = document.querySelector('[data-value="0"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '1':
            button = document.querySelector('[data-value="1"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '2':
            button = document.querySelector('[data-value="2"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '3':
            button = document.querySelector('[data-value="3"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '4':
            button = document.querySelector('[data-value="4"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '5':
            button = document.querySelector('[data-value="5"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '6':
            button = document.querySelector('[data-value="6"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '7':
            button = document.querySelector('[data-value="7"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '8':
            button = document.querySelector('[data-value="8"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
        case '9':
            button = document.querySelector('[data-value="9"]')
            animateKeyboardClickedButton(button)
            handleNumberInput(pressedKey)
            break
    }
    console.log();
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

equalsButtonEl.addEventListener('click', complementaryOperations.equals)

document.addEventListener('keypress', handlePressedKey)