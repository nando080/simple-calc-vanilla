const darkThemeItems = document.querySelectorAll(".dark")
const toggleButton = document.querySelector('.theme-toggle-container')


const changeTheme = () => {
    darkThemeItems.forEach(item => {
        item.classList.toggle('dark')
    })
}

toggleButton.addEventListener('click', changeTheme)
changeTheme()