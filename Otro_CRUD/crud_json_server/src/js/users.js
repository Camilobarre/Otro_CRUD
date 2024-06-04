// Importa los estilos SCSS y la biblioteca Bootstrap, así como la función para crear un menú desplegable de temas.
import '../scss/style.scss'
import * as bootstrap from 'bootstrap'
import { createDropdownTheme } from '../components/dropdown_theme'

// Importa bcryptjs para el cifrado de contraseñas.
import bcryptjs from 'bcryptjs'

// Llama a la función para crear el menú desplegable de temas.
createDropdownTheme()

// URL base de la API.
const URLBASE = "http://localhost:3000"

// Obtiene referencias a los elementos del formulario y a otros elementos del DOM.
const rol = document.getElementById("rol")
const nameUser = document.getElementById("user-name")
const birthDate = document.getElementById("birth-date")
const email = document.getElementById("email")
const password = document.getElementById("password")
const btnSignoff = document.getElementById("sign-off")
const btnCloseModal = document.getElementById("btn-close-modal")
const form = document.getElementById("form")
const tbody = document.getElementById("tbody")
let userCache

// Evento que se dispara cuando el DOM está completamente cargado.
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene los roles y los usuarios al cargar la página.
    getRoles() 
    getUsers()
})

// Evento que se dispara cuando se envía el formulario.
form.addEventListener("submit", (event) => {
    // Verifica la validez del formulario.
    if (!form.checkValidity()) {
        event.preventDefault()
    } else {
        event.preventDefault()
        // Si no hay un usuario en caché, guarda un nuevo usuario; de lo contrario, actualiza el usuario existente.
        if (userCache === undefined) {
            saveUser()
        } else {
            updateUser(userCache)
        }
    }
})

// Evento que se dispara cuando se hace clic en el cuerpo de la tabla.
tbody.addEventListener('click', (event) => {
    // Si se hace clic en el botón de edición, obtiene los detalles del usuario seleccionado.
    if (event.target.classList.contains("btn-primary")) {
        userCache = event.target.getAttribute("data-id")
        nameUser.value = event.target.parentElement.parentElement.getElementsByTagName('td')[0].textContent;
        userAge.value = event.target.parentElement.parentElement.getElementsByTagName('td')[1].textContent;
    }
    // Si se hace clic en el botón de eliminación, elimina el usuario correspondiente.
    if (event.target.classList.contains("btn-danger")) {
        let id = event.target.getAttribute("data-id")
        deleteUser(id)
    }
})

// Evento que se dispara cuando se hace clic en el botón de cierre de sesión.
btnSignoff.addEventListener("click", () => {
    // Borra el indicador de autorización del usuario y recarga la página.
    localStorage.setItem("isAutorizated", "false")
    window.location.reload(true)
})

// Función asincrónica para guardar un nuevo usuario.
async function saveUser() {
    // Objeto que representa al usuario con los datos del formulario.
    const user = {
        roleId: rol.value,
        userName: nameUser.value,
        birthDate: birthDate.value,
        email: email.value,
        password: bcryptjs.hashSync(password.value,8)
    }

    // Realiza una solicitud POST a la API para guardar el nuevo usuario.
    await fetch(`${URLBASE}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    
    // Reinicia el formulario y cierra el modal después de guardar el usuario.
    form.classList.remove("was-validated");
    form.reset()
    btnCloseModal.click()
    // Obtiene y muestra la lista actualizada de usuarios.
    getUsers()
}

// Función asincrónica para actualizar un usuario existente.
async function updateUser(id) {
    // Objeto que representa al usuario con los datos actualizados.
    const user = {
        name: nameUser.value,
        age: userAge.value
    }

    // Realiza una solicitud PUT a la API para actualizar el usuario.
    const response = await fetch(`${URLBASE}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    userCache = undefined
    // Obtiene y muestra la lista actualizada de usuarios después de actualizar el usuario.
    getUsers()
    form.reset()
}

// Función asincrónica para obtener la lista de usuarios desde la API.
async function getUsers() {
    const response = await fetch(`${URLBASE}/users?_embed=role`)
    const data = await response.json()
    // Renderiza la lista de usuarios en la tabla.
    renderUsers(data)
}

// Función asincrónica para obtener la lista de roles desde la API.
async function getRoles() {
    const response = await fetch(`${URLBASE}/roles`)
    const data = await response.json()
    // Renderiza la lista de roles en el menú desplegable de roles.
    renderRoles(data)
}

// Función asincrónica para eliminar un usuario.
async function deleteUser(id) {
    await fetch(`${URLBASE}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    // Obtiene y muestra la lista actualizada de usuarios después de eliminar el usuario.
    getUsers()
}

// Función para renderizar la lista de usuarios en la tabla.
function renderUsers(data) {
    cleanTbody()
    data.forEach((element, index) => {
        const dateNow = new Date()
        const birthDate = new Date(element.birthDate)
        const ageInMilliseconds = dateNow - birthDate.getTime();
        const ageInYears = new Date(ageInMilliseconds).getFullYear() - 1970;
        tbody.innerHTML += `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${element.role.name}</td>
            <td>${element.userName}</td>
            <td>${ageInYears} years</td>
            <td>${element.email}</td>
            <td>
                <button type="button" class="btn btn-primary" data-id="${element.id}">Edit</button>
                <button type="button" class="btn btn-danger" data-id="${element.id}">Delete</button>
            </td>
        </tr>
        `
    });
}

// Función para renderizar la lista de roles en el menú desplegable de roles.
function renderRoles(data) {    
    data.forEach(element => {
        const option = document.createElement("option")
        option.value = element.id
        option.textContent = element.name
        rol.appendChild(option)
    });
}

// Función para limpiar el cuerpo de la tabla.
function cleanTbody() {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild)
    }
}