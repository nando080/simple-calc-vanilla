const darkItemsEl = document.querySelectorAll('.dark')
const changeThemeToggleEl = document.querySelector('.theme-toggle-container')
const numberButtonsEl = document.querySelectorAll('[data-js="number"]')
const operationButtonsEl = document.querySelectorAll('[data-js="operation"]')
const valueDisplayEl = document.querySelector('.value-display')

let isOperation = false
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
    subtraction: {
        symbol: '-',
        calc: (value1, value2) => value1 - value2
    },
    sum: {
        symbol: '+',
        calc: (value1, value2) => value1 + value2
    },
}


//TODO
const updateDisplayValue = value => {
    const isDisplayValueZeroOrEmpty = displayValue === '' || displayValue === '0'
    if (isOperation) {
        displayValue =  `<span>${value}</span>`
    } else {
        if (isDisplayValueZeroOrEmpty) {
            displayValue = value
        } else {
            displayValue += value
        }
    }
    renderDisplayValue()
}

const renderDisplayValue = () => {
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

changeThemeToggleEl.addEventListener('click', changeInterfaceTheme)

numberButtonsEl.forEach(numberButton => {
    const buttonValue = numberButton.dataset.value
    numberButton.addEventListener('click', () => {
        updateDisplayValue(buttonValue)
    })
})

console.log(valueDisplayEl)