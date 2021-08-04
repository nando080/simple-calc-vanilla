const darkItemsEl = document.querySelectorAll('.dark')
const changeThemeToggleEl = document.querySelector('.theme-toggle-container')


const changeInterfaceTheme = () => {
    darkItemsEl.forEach(item => {
        item.classList.toggle('dark')
    })
}

changeThemeToggleEl.addEventListener('click', changeInterfaceTheme)

console.log(changeThemeToggleEl)