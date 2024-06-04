import Swal from 'sweetalert2';

// Función para mostrar alertas de error
export function smallAlertError(message) {
    Swal.fire({
        toast: true, // Muestra la alerta como una notificación emergente
        position: "top-end", // Posición de la alerta en la esquina superior derecha
        icon: "error", // Icono de error
        title: `${message}`, // Mensaje de la alerta
        showConfirmButton: false, // No muestra un botón de confirmación
        timer: 2000, // Duración de la alerta en milisegundos (2 segundos)
        timerProgressBar: true, // Muestra una barra de progreso del temporizador
    });
}

// Función para mostrar alertas de éxito
export function smallAlertSuccess(message) {
    Swal.fire({
        toast: true, // Muestra la alerta como una notificación emergente
        position: "top-end", // Posición de la alerta en la esquina superior derecha
        icon: "success", // Icono de éxito
        title: `${message}`, // Mensaje de la alerta
        showConfirmButton: false, // No muestra un botón de confirmación
        timer: 2000, // Duración de la alerta en milisegundos (2 segundos)
        timerProgressBar: true, // Muestra una barra de progreso del temporizador
    });
}
