import '../scss/login_register.scss'; // Importa el archivo SCSS para estilos específicos de la página de inicio de sesión/registro
import * as bootstrap from 'bootstrap'; // Importa Bootstrap, aunque no se usa directamente en este archivo
import { createDropdownTheme } from '../components/dropdown_theme'; // Importa una función para crear un menú desplegable de temas
import { smallAlertError } from './alerts'; // Importa una función para mostrar alertas de error
import bcryptjs from 'bcryptjs'; // Importa bcryptjs para comparar contraseñas de forma segura

createDropdownTheme(); // Llama a una función para inicializar el menú desplegable de temas
const URLSERVER = "http://localhost:3000"; // URL del servidor donde se almacenan los datos

// Captura elementos del DOM
const form = document.getElementById("form"); // Captura el formulario de inicio de sesión
const email = document.getElementById("email"); // Captura el campo de entrada de correo electrónico
const password = document.getElementById("password"); // Captura el campo de entrada de contraseña

// Evento de escucha para el envío del formulario
form.addEventListener("submit", async (event) => {
    // Si el formulario no es válido, previene la acción por defecto (envío del formulario)
    if (!form.checkValidity()) {
        event.preventDefault();
    } else {
        event.preventDefault(); // Prevención de la acción por defecto del formulario

        // Validación del correo electrónico en la base de datos
        const { validatedEmail, messageEmail } = await validateEmailInDatabase();

        // Si el correo electrónico está validado y la contraseña coincide
        if (validatedEmail && bcryptjs.compareSync(password.value, messageEmail)) {
            loginUser(); // Llama a la función para iniciar sesión del usuario
        } else {
            // Si el correo electrónico no está validado, muestra un mensaje de error relacionado con el correo electrónico.
            // Si la contraseña es incorrecta, muestra un mensaje de error genérico de contraseña incorrecta.
            if (validatedEmail === false) {
                smallAlertError(messageEmail);
            } else {
                smallAlertError("incorrect password");
            }
        }
    }
});

// Función para validar el correo electrónico en la base de datos
async function validateEmailInDatabase() {
    const response = await fetch(`${URLSERVER}/users?email=${email.value}`); // Realiza una solicitud al servidor para verificar el correo electrónico
    const data = await response.json(); // Convierte la respuesta en formato JSON

    // Si se encuentra un usuario con el correo electrónico proporcionado, devuelve un objeto con el correo electrónico validado y la contraseña asociada
    if (data.length === 1) {
        return {
            validatedEmail: true,
            messageEmail: data[0].password
        };
    }

    // Si no se encuentra ningún usuario con el correo electrónico proporcionado, devuelve un objeto con el correo electrónico no validado y un mensaje indicando que el correo electrónico no existe
    return {
        validatedEmail: false,
        messageEmail: "the email does not exist"
    };
}

// Función para iniciar sesión del usuario
function loginUser() {
    localStorage.setItem("isAutorizated", "true"); // Establece un indicador de autorización en el almacenamiento local del navegador
    window.location.href = "src/users/indexUsers.html"; // Redirige al usuario a la página principal de usuarios
}
