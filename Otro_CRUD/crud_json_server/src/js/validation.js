(() => {
    "use strict";

    // Selecciona todos los formularios que tienen la clase "needs-validation".
    const forms = document.querySelectorAll(".needs-validation");

    // Itera sobre cada formulario seleccionado.
    Array.from(forms).forEach((form) => {
        // Agrega un event listener para el evento "submit" en cada formulario.
        form.addEventListener(
            "submit",
            (event) => {
                // Verifica si el formulario es válido.
                if (!form.checkValidity()) {
                    // Si el formulario no es válido, previene que se envíe.
                    event.preventDefault();
                    // Detiene la propagación del evento para evitar que se propague a otros elementos.
                    event.stopPropagation();
                }

                // Agrega la clase "was-validated" al formulario para mostrar los estilos de validación de Bootstrap.
                form.classList.add("was-validated");
            },
            false
        );
    });
})();
