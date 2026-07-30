document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const pass = document.getElementById('password');
    const passConfirm = document.getElementById('password_confirm');
    const piso = document.getElementById('piso');
    const puerta = document.getElementById('puerta');

    // 1. Verificar contraseñas
    function validarContrasenas() {
        if (passConfirm.value.length > 0 && pass.value !== passConfirm.value) {
            passConfirm.setCustomValidity('Las contraseñas no coinciden.');
        } else {
            passConfirm.setCustomValidity(''); // Limpia el error si coinciden
        }
    }

    // 2. Regla: Piso O Puerta (al menos uno debe tener contenido)
    function validarPisoPuerta() {
        if (!piso.value.trim() && !puerta.value.trim()) {
            piso.setCustomValidity('Debes rellenar al menos el Piso o la Puerta.');
            puerta.setCustomValidity('Debes rellenar al menos el Piso o la Puerta.');
        } else {
            piso.setCustomValidity('');
            puerta.setCustomValidity('');
        }
    }

    // Escuchar eventos en tiempo real para feedback inmediato
    pass.addEventListener('input', validarContrasenas);
    passConfirm.addEventListener('input', validarContrasenas);
    piso.addEventListener('input', validarPisoPuerta);
    puerta.addEventListener('input', validarPisoPuerta);

    // Evento Submit
    form.addEventListener('submit', (event) => {
        // Prevenir el envío por defecto siempre para procesar el JS
        event.preventDefault();

        // Ejecutar las validaciones personalizadas justo antes de comprobar la validez
        validarContrasenas();
        validarPisoPuerta();

        // Añadir clase para estilos CSS de error/éxito
        form.classList.add('validado');

        // Comprobar la validez general (HTML5 + Custom JS)
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.reportValidity(); // Lanza el aviso del navegador en el primer campo erróneo
            return;
        }

        // --- SI TODO ES CORRECTO ---
        generarYDescargarSQL();
    });

    // 3. Función para generar el script .sql para phpMyAdmin / XAMPP
    function generarYDescargarSQL() {
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData.entries());

        // Función para limpiar texto e insertar NULL en SQL si el campo opcional está vacío
        const sqlValue = (val) => {
            if (!val || val.trim() === '') return 'NULL';
            const sanitized = val.toString().replace(/'/g, "''");
            return `'${sanitized}'`;
        };

        // Construcción de las sentencias SQL
        const contenidoSQL = `-- Script de registro generado para XAMPP / phpMyAdmin
-- Fecha: ${new Date().toLocaleString()}

CREATE DATABASE IF NOT EXISTS \`registros\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`registros\`;

CREATE TABLE IF NOT EXISTS \`usuarios\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`nombre\` VARCHAR(100) NOT NULL,
    \`primer_apellido\` VARCHAR(100) NOT NULL,
    \`segundo_apellido\` VARCHAR(100) NOT NULL,
    \`usuario\` VARCHAR(50) NOT NULL UNIQUE,
    \`email\` VARCHAR(150) NOT NULL,
    \`password\` VARCHAR(255) NOT NULL,
    \`fecha_nacimiento\` DATE NOT NULL,
    \`prefijo\` VARCHAR(10) NOT NULL,
    \`telefono\` VARCHAR(20) NOT NULL,
    \`codigo_postal\` VARCHAR(10) NOT NULL,
    \`nombre_via\` VARCHAR(150) NOT NULL,
    \`numero\` VARCHAR(20) NOT NULL,
    \`piso\` VARCHAR(20) DEFAULT NULL,
    \`puerta\` VARCHAR(20) DEFAULT NULL,
    \`pais\` VARCHAR(100) NOT NULL,
    \`fecha_registro\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`usuarios\` (
  \`nombre\`, \`primer_apellido\`, \`segundo_apellido\`, \`usuario\`, \`email\`, \`password\`,
  \`fecha_nacimiento\`, \`prefijo\`, \`telefono\`, \`codigo_postal\`, \`nombre_via\`,
  \`numero\`, \`piso\`, \`puerta\`, \`pais\`
) VALUES (
    ${sqlValue(datos.nombre)},
    ${sqlValue(datos.primer_apellido)},
    ${sqlValue(datos.segundo_apellido)},
    ${sqlValue(datos.usuario)},
    ${sqlValue(datos.email)},
    ${sqlValue(datos.password)},
    ${sqlValue(datos.fecha_nacimiento)},
    ${sqlValue(datos.prefijo)},
    ${sqlValue(datos.telefono)},
    ${sqlValue(datos.codigo_postal)},
    ${sqlValue(datos.nombre_via)},
    ${sqlValue(datos.numero)},
    ${sqlValue(datos.piso)},
    ${sqlValue(datos.puerta)},
    ${sqlValue(datos['País'] || datos.pais)}
)
ON DUPLICATE KEY UPDATE 
  \`nombre\` = VALUES(\`nombre\`),
  \`primer_apellido\` = VALUES(\`primer_apellido\`),
  \`segundo_apellido\` = VALUES(\`segundo_apellido\`),
  \`email\` = VALUES(\`email\`),
  \`password\` = VALUES(\`password\`),
  \`fecha_nacimiento\` = VALUES(\`fecha_nacimiento\`),
  \`prefijo\` = VALUES(\`prefijo\`),
  \`telefono\` = VALUES(\`telefono\`),
  \`codigo_postal\` = VALUES(\`codigo_postal\`),
  \`nombre_via\` = VALUES(\`nombre_via\`),
  \`numero\` = VALUES(\`numero\`),
  \`piso\` = VALUES(\`piso\`),
  \`puerta\` = VALUES(\`puerta\`),
  \`pais\` = VALUES(\`pais\`);
`;

        // Descarga del archivo .sql
        const blob = new Blob([contenidoSQL], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'registros.sql';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
