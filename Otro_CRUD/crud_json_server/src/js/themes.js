// Espera a que el DOM esté completamente cargado para ejecutar el código
document.addEventListener('DOMContentLoaded', function () {  
    // Obtiene el tema guardado en el almacenamiento local
    const theme = localStorage.getItem("jws_theme")

    // Verifica si el tema está guardado en el almacenamiento local
    if (theme === null) {
        // Establece el tema predeterminado como claro si no hay ningún tema guardado
        document.documentElement.setAttribute('data-bs-theme', "light")
    } else {
        // Establece el tema guardado en el almacenamiento local
        document.documentElement.setAttribute('data-bs-theme', theme)
    }

    // Obtiene los botones de cambio de tema
    const btnLight = document.getElementById('theme-light')
    const btnDark = document.getElementById('theme-dark')

    // Agrega un event listener para el botón de tema claro
    btnLight.addEventListener("click",() => {
        // Establece el tema como claro en el DOM
        document.documentElement.setAttribute('data-bs-theme', "light");
        // Guarda el tema como claro en el almacenamiento local
        localStorage.setItem('jws_theme', "light");
    })

    // Agrega un event listener para el botón de tema oscuro
    btnDark.addEventListener("click",() => {
        // Establece el tema como oscuro en el DOM
        document.documentElement.setAttribute('data-bs-theme', "dark");
        // Guarda el tema como oscuro en el almacenamiento local
        localStorage.setItem('jws_theme', "dark");
    })
});
