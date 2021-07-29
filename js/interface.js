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
            console.log('oi minha gente')
        }
    },
    number() {

    }
}

buttonActions['operation']['divide']()

const testStringValue = '0'

const getActualFontSize = () => {
    const numberOfCharacters = testStringValue.length
    if (numberOfCharacters > 10) {
        /* regra de tres inversamente proporcional */
        return (maxNumberOfCharactersForValueDisplayRegularSize * defaultValueDisplayFontSize) / numberOfCharacters
    } else {
        return defaultValueDisplayFontSize
    }
}

const updateValueDisplay = numberButton => {
    const buttonValue = numberButton.dataset.value
    console.log(buttonValue)
    valueDisplay.innerHTML = ''
    valueDisplay.style.fontSize = `${getActualFontSize()}rem`
    valueDisplay.innerHTML = testStringValue
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
        updateValueDisplay(button)
    })
})

window.addEventListener('keypress', event => {
    const index = event.key
    switch (index) {
        case '0': 
            updateValueDisplay(numberButtons[9])
            animatePressedKeyButton(numberButtons[9])
        break
        case '1': 
            updateValueDisplay(numberButtons[6])
            animatePressedKeyButton(numberButtons[6])
        break
        case '2': 
            updateValueDisplay(numberButtons[7])
            animatePressedKeyButton(numberButtons[7])
        break
        case '3': 
            updateValueDisplay(numberButtons[8])
            animatePressedKeyButton(numberButtons[8])
        break
        case '4': 
            updateValueDisplay(numberButtons[3])
            animatePressedKeyButton(numberButtons[3])
        break
        case '5': 
            updateValueDisplay(numberButtons[4])
            animatePressedKeyButton(numberButtons[4])
        break
        case '6': 
            updateValueDisplay(numberButtons[5])
            animatePressedKeyButton(numberButtons[5])
        break
        case '7': 
            updateValueDisplay(numberButtons[0])
            animatePressedKeyButton(numberButtons[0])
        break
        case '8': 
            updateValueDisplay(numberButtons[1])
            animatePressedKeyButton(numberButtons[1])
        break
        case '9': 
            updateValueDisplay(numberButtons[2])
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