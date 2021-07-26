const darkThemeItems = document.querySelectorAll(".dark")
const toggleButton = document.querySelector('.theme-toggle-container')
const numberButtons = document.querySelectorAll('[data-js="number"]')

const numberButtonIndex = {
    '0': 9,
    '1': 7,
    '2': 8,
    '3': 9,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 5,
    '8': 5,
    '9': 5,
    '.': ''
}

const updateValueDisplay = numberButton => {
    console.log(numberButton.dataset.value)
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