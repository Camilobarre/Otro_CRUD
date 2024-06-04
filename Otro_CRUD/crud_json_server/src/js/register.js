// Importación de estilos SCSS y librerías necesarias
import '../scss/login_register.scss'
import * as bootstrap from 'bootstrap'
import { createDropdownTheme } from '../components/dropdown_theme'
import { smallAlertError } from './alerts' // Importa función para mostrar alertas de error
import Swal from 'sweetalert2' // Importa la librería SweetAlert2 para mostrar alertas más estilizadas
import bcryptjs from 'bcryptjs' // Importa la librería bcryptjs para encriptar contraseñas

// Función para crear el tema del dropdown
createDropdownTheme()

// URL del servidor donde se realizarán las operaciones
const URLSERVER = "http://localhost:3000"

// Obtención de elementos del formulario y asignación a variables
const form = document.getElementById("form")
const userName = document.getElementById("user-name")
const birthDate = document.getElementById("birth-date")
const email = document.getElementById("email")
const password = document.getElementById("password")
const passwordConfirm = document.getElementById("password-confirm")

// Evento de escucha para el envío del formulario
form.addEventListener("submit", (event) => {
    // Verifica si el formulario es válido
    if (!form.checkValidity()) {
        // Previene el envío del formulario si no es válido
        event.preventDefault()
    } else {
        event.preventDefault()
        // Llama a la función para registrar al usuario si el formulario es válido
        registerUser()
    }
})

// Función asincrónica para registrar al usuario
async function registerUser() {
    // Valida que las contraseñas coincidan
    const { validatedMatch, messageMatch } = validatePasswordMatch()
    // Valida la seguridad de la contraseña
    const { validatedSecurity, messageSecurity } = validatePasswordSecurity()
    // Valida si el correo electrónico ya está registrado en la base de datos
    const { validatedEmail, messageEmail } = await validateEmailInDatabase(email.value)
    
    // Verifica si todas las validaciones fueron exitosas
    if (validatedMatch && validatedSecurity && validatedEmail) {
        // Guarda al usuario si todas las validaciones fueron exitosas
        saveUser()
    } else {
        // Muestra alertas de error correspondientes a las validaciones fallidas
        if (validatedMatch === false) {
            smallAlertError(messageMatch)
        }
        if (validatedSecurity === false) {
            smallAlertError(messageSecurity)
        }
        if (validatedEmail === false) {
            smallAlertError(messageEmail)
        }
    }
}

// Función para validar si las contraseñas coinciden
function validatePasswordMatch() {
    if (password.value != passwordConfirm.value) {
        // Agrega una clase de estilo para indicar que la validación falló
        password.classList.add("is-invalid")
        return {
            validatedMatch: false,
            messageMatch: "the passwords do not match"
        }
    }
    return { validatedMatch: true }
}

// Función para validar la seguridad de la contraseña
function validatePasswordSecurity() {
    // Expresión regular para verificar la seguridad de la contraseña
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    if (regex.test(password.value)) {
        return {
            validatedSecurity: true,
        }
    }
    return {
        validatedSecurity: false,
        messageSecurity: "Passwords must have uppercase, lowercase, numbers and a special character"
    }
}

// Función asincrónica para validar si el correo electrónico está registrado en la base de datos
async function validateEmailInDatabase(email) {
    const response = await fetch(`${URLSERVER}/users?email=${email}`)
    const data = await response.json()
    if (data.length === 0) {
        return {
            validatedEmail: true,
        }
    }
    return {
        validatedEmail: false,
        messageEmail: "that email is already registered"
    }
}

// Función asincrónica para guardar al usuario en la base de datos
async function saveUser() {
    // Objeto con los datos del usuario a guardar
    const user = {
        roleId: "3",
        userName: userName.value,
        birthDate: birthDate.value,
        email: email.value,
        // Se encripta la contraseña antes de guardarla
        password: bcryptjs.hashSync(password.value, 8)
    }

    // Petición POST para guardar al usuario
    const response = await fetch(`${URLSERVER}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    // Verifica si la operación fue exitosa
    if (response.ok && response.status == 201) {
        // Reinicia el formulario y muestra una alerta de éxito
        form.reset()
        form.classList.remove("was-validated");
        Swal.fire({
            title: `🌐Welcome ${user.userName}! 🚀`,
            icon: "success",
            showConfirmButton: false,
            timer: 1000
        })
    } else {
        // Muestra una alerta de error si la operación no fue exitosa
        Swal.fire({
            icon: "error",
            title: "Ups",
            text: `${response.statusText}`,
            confirmButtonColor: "#0d6efd",
        });
    }
}