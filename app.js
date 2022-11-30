const backwardBtnEl = document.querySelector('.calc__history__btn--backward')
const forwardBtnEl = document.querySelector('.calc__history__btn--forward')
const historyDisplayEl = document.querySelector('.calc__history__content')
const displayEl = document.querySelector('.calc__display__content')
const keyboardEl = document.querySelector('.calc__button-container')

const defaultFontSize = 50
const maxNumberOfDigitsOnDisplay = 16

let currentDisplayFontSize = defaultFontSize

let isError = false
let isOperation = true
let currentDisplayValue = '150'

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

/* const calcValues = {
    firstValue: 0,
    firstValueIsFilled: false,
    secondValue: 0,
    secondValueIsFilled: false,
    operation: '',
    currentValue: 1,
    result: 0,
    stringResult: '',
    setValue: value => {
        if (!calcValues.firstValueIsFilled) {
            calcValues.firstValue = Number(value)
            calcValues.firstValueIsFilled = true
            return
        }
        calcValues.secondValue = Number(value)
        calcValues.secondValueIsFilled = true
    },
    setOperation: operation => {
        calcValues.operation = operation
    }
} */

const displayValueProperties = {
    isZero: () => currentDisplayValue === '0',
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

const utilityOperations = {

    //TODO - COMPLETAR COM HISTORICO E COM O OBJETO DE VALORES
    clear: () => {
        currentDisplayFontSize = defaultFontSize
        isError = false
        isOperation = false
        currentDisplayValue = '0'
        displayEl.textContent = currentDisplayValue

        calcValue.firstValue = 0
        calcValue.secondValue = 0
        calcValue.result = 0
        calcValue.stringResult = ''
    },
    negate: () => {
        const {isZero, isNegative} = displayValueProperties
        if (!isOperation && !isZero()) {
            if (isNegative()) {
                currentDisplayValue = currentDisplayValue.replace(/-/i, '')
            } else {
                currentDisplayValue = `-${currentDisplayValue}`
            }
        }
    },
    del: () => {
        const {isZero, totalSize} = displayValueProperties
        if (!isOperation) {
            if (!isZero() && totalSize() > 1) {
                currentDisplayValue = currentDisplayValue.substring(0, currentDisplayValue.length - 1)
                return
            }
            if (!isZero() && totalSize() === 1) {
                currentDisplayValue = '0'
                return
            }
        }
    },
    dot: () => {
        const {isZero, isFloat, totalSize} = displayValueProperties
        if (!isFloat() && totalSize() < maxNumberOfDigitsOnDisplay) {
            if (isZero() || isOperation()) {
                currentDisplayValue = '0.'
            } else {
                currentDisplayValue += '.'
            }
        }
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


//TODO - completar
const mathOperationHandle = () => {
}

const keyboardHandle = event => {
    const keyType = event.target.dataset.js
    const keyValue = event.target.dataset.value

    if (!isError || keyType === 'clear') {
        switch (keyType) {
            case 'utility':
                utilityOperations[keyValue]()
                updateDisplay()
                break
            case 'math-operation':
                mathOperationHandle(keyValue)
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