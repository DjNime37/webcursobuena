// 1. Obtener los nuevos elementos del DOM del formulario del footer
const footerEmail = document.getElementById('footer-email');
const footerPhone = document.getElementById('footer-telefono');
const footerMessage = document.getElementById('footer-mensaje');
const footerSubmit = document.getElementById('footer-submit');

// 2. Manejar el Foco (focus) en el campo email del footer
footerEmail.addEventListener('focus', () => {
    // Cuando el usuario hace clic o se sitúa en el email, habilitamos teléfono y mensaje
    footerPhone.disabled = false;
    footerMessage.disabled = false;
});

// 3. Habilitar el Botón de Enviar cuando el campo no esté vacío (input)
footerEmail.addEventListener('input', () => {
    // Verificamos en tiempo real si el valor tiene contenido omitiendo espacios vacíos
    if (footerEmail.value.trim() !== "") {
        footerSubmit.disabled = false;
    } else {
        footerSubmit.disabled = true;
    }
});
