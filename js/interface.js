const darkThemeItems = document.querySelectorAll(".dark")
const toggleButton = document.querySelector('.theme-toggle-container')
const numberButtons = document.querySelectorAll('[data-js="number"]')
const operationButtons = document.querySelectorAll('[data-js="operation"]')
const valueDisplay = document.querySelector('.value-display')

const maxNumberOfCharactersForValueDisplayRegularSize = 10
const defaultValueDisplayFontSize = 4.7


//todo ações dos botões
const buttonActions = {
    operation : {
        divide() {
        },
        multiplay() {

        },
        subtract() {

        },
        sum() {

        },
        dot() {

        },
        equals() {

        },
        clear() {

        }
    },

    number(value) {
        if (value === "0") {
            const isActualStringValueEqualsZero = getStringValue() === "0"
            if (!isActualStringValueEqualsZero) {
                updateStringDisplayValue(value)
                renderValueDisplay()
            }
        } else {
            updateStringDisplayValue(value)
            renderValueDisplay()
        }
    }
}

/* buttonActions['operation']['divide']() */

const getActualFontSize = () => {
    const actualStringValue = getStringValue()
    const numberOfCharacters = actualStringValue.length
    if (numberOfCharacters > 10) {
        /* regra de tres inversamente proporcional */
        return (maxNumberOfCharactersForValueDisplayRegularSize * defaultValueDisplayFontSize) / numberOfCharacters
    } else {
        return defaultValueDisplayFontSize
    }
}

//todo fazer método funcionar corretamente
const renderValueDisplay = () => {
    valueDisplay.style.fontSize = `${getActualFontSize()}rem`
    valueDisplay.innerHTML = getStringValue()
}

const updateStringDisplayValue = value => {
    const actualValue = getStringValue()
    const isDisplayValueEqualsZero = actualValue === "0"
    let newValue = "0"
    if (!isDisplayValueEqualsZero) {
        newValue = `${actualValue}${value}`
    } else {
        newValue = value
    }
    setStringValue(newValue)
}

const changeTheme = () => {
    darkThemeItems.forEach(item => {
        item.classList.toggle('dark')
    })
}

const animatePressedKeyButton = button => {
    button.classList.add('keyPressTransform')
    const removeAnimateClass = setInterval(() => {
        button.classList.remove('keyPressTransform')
    },
    400)
}

toggleButton.addEventListener('click', changeTheme)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        buttonActions[button.dataset.js](button.dataset.value)
    })
})

window.addEventListener('keypress', event => {
    const index = event.key
    switch (index) {
        case '0': 
            updateStringDisplayValue(numberButtons[9])
            animatePressedKeyButton(numberButtons[9])
        break
        case '1': 
            updateStringDisplayValue(numberButtons[6])
            animatePressedKeyButton(numberButtons[6])
        break
        case '2': 
            updateStringDisplayValue(numberButtons[7])
            animatePressedKeyButton(numberButtons[7])
        break
        case '3': 
            updateStringDisplayValue(numberButtons[8])
            animatePressedKeyButton(numberButtons[8])
        break
        case '4': 
            updateStringDisplayValue(numberButtons[3])
            animatePressedKeyButton(numberButtons[3])
        break
        case '5': 
            updateStringDisplayValue(numberButtons[4])
            animatePressedKeyButton(numberButtons[4])
        break
        case '6': 
            updateStringDisplayValue(numberButtons[5])
            animatePressedKeyButton(numberButtons[5])
        break
        case '7': 
            updateStringDisplayValue(numberButtons[0])
            animatePressedKeyButton(numberButtons[0])
        break
        case '8': 
            updateStringDisplayValue(numberButtons[1])
            animatePressedKeyButton(numberButtons[1])
        break
        case '9': 
            updateStringDisplayValue(numberButtons[2])
            animatePressedKeyButton(numberButtons[2])
        break
        case '.': console.log('ponto')
        break
        case '/': console.log('barra')
        break
        case '*': console.log('asterisco')
        break
        case '+': console.log('mais')
        break
        case '-': console.log('menos')
        break
        case 'Enter': console.log('igualim que nem')
        break
    }
})

renderValueDisplay()