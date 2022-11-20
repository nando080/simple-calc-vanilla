const themeButtonEl = document.querySelector('.theme-button__container')

const changeTheme = () => {
    const darkElementsEl = document.querySelectorAll('.js-dark')
    darkElementsEl.forEach(item => {
        item.classList.toggle('is-dark')
    })
    themeButtonEl.classList.toggle('is-active')
}

themeButtonEl.addEventListener('click', changeTheme)