document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('iniciosesiónForm');
    const passInput = document.getElementById('password');

    // Crear o recuperar la estructura del banner
    function obtenerBanner() {
        let banner = document.getElementById('mensajeBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'mensajeBanner';
            banner.style.position = 'relative';
            banner.style.padding = '12px 40px 12px 16px';
            banner.style.marginBottom = '15px';
            banner.style.borderRadius = '4px';
            banner.style.fontWeight = 'bold';
            banner.style.textAlign = 'center';
            banner.style.display = 'none';

            // Botón de cierre (X)
            const botonCerrar = document.createElement('span');
            botonCerrar.innerHTML = '&times;';
            botonCerrar.style.position = 'absolute';
            botonCerrar.style.right = '12px';
            botonCerrar.style.top = '50%';
            botonCerrar.style.transform = 'translateY(-50%)';
            botonCerrar.style.cursor = 'pointer';
            botonCerrar.style.fontSize = '20px';
            botonCerrar.style.lineHeight = '1';

            // Se cierra únicamente al hacer clic en la X
            botonCerrar.addEventListener('click', () => {
                banner.style.display = 'none';
            });

            const textoMensaje = document.createElement('span');
            textoMensaje.id = 'textoMensajeBanner';

            banner.appendChild(textoMensaje);
            banner.appendChild(botonCerrar);

            form.parentNode.insertBefore(banner, form);
        }
        return banner;
    }

    // Mostrar el banner en pantalla
    function mostrarBanner(mensaje, esError = true) {
        const banner = obtenerBanner();
        const texto = document.getElementById('textoMensajeBanner');

        texto.textContent = mensaje;
        banner.style.backgroundColor = esError ? '#f8d7da' : '#d4edda';
        banner.style.color = esError ? '#721c24' : '#155724';
        banner.style.border = esError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
        banner.style.display = 'block';
    }

    // Evento Submit
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Aportar información de formato antes del envío
        if (passInput.value.length < 8) {
            mostrarBanner('La contraseña debe tener al menos 8 caracteres.', true);
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);

        try {
            const response = await fetch('login.html', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const resultado = await response.json();

            // 2. Mostrar la respuesta del backend
            if (resultado.status === 'error') {
                mostrarBanner(resultado.message, true);
            } else if (resultado.status === 'success') {
                mostrarBanner(resultado.message, false);
            }

        } catch (error) {
            mostrarBanner('No se pudo conectar con el servidor.', true);
        }
    });
});
