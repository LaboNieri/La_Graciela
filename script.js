// Configuración
const GITHUB_USERNAME = 'LaboNieri'; // Cambia esto
const REPO_NAME = 'la-graciela-telegram-control'; // Cambia esto
const WORKFLOW_NAME = 'telegram-handler.yml';

// Elementos del DOM
const statusElement = document.getElementById('status');
const responseElement = document.getElementById('responseText');
const loadingElement = document.getElementById('loading');

// Función principal para enviar comandos
async function sendCommand(command) {
    showLoading(true);
    updateStatus('Enviando comando...', 'warning');
    
    try {
        // Disparar GitHub Action
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'token TU_GITHUB_TOKEN', // Necesitarás configurar esto
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'arduino_command',
                client_payload: {
                    command: command,
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (response.ok) {
            updateStatus('Comando enviado, esperando respuesta...', 'info');
            // Simular espera de respuesta (en implementación real, usarías webhooks o polling)
            setTimeout(() => {
                checkForResponse(command);
            }, 3000);
        } else {
            throw new Error('Error al enviar comando');
        }
        
    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error al enviar comando', 'error');
        responseElement.textContent = 'Error: No se pudo enviar el comando';
    } finally {
        showLoading(false);
    }
}

// Función para comando personalizado
function sendCustomCommand() {
    const customCmd = document.getElementById('customCmd').value.trim();
    if (customCmd) {
        sendCommand(customCmd);
        document.getElementById('customCmd').value = '';
    }
}

// Simular respuesta (en implementación real, esto vendría del Arduino)
function checkForResponse(command) {
    // Esta función se mejorará para obtener respuestas reales
    const simulatedResponse = `Comando "${command}" ejecutado correctamente.\nEstado: OK\nTiempo: ${new Date().toLocaleTimeString()}`;
    
    responseElement.textContent = simulatedResponse;
    updateStatus('Respuesta recibida', 'success');
}

// Funciones auxiliares
function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
}

function updateStatus(message, type = 'success') {
    const indicator = statusElement.querySelector('.status-indicator');
    const text = statusElement.querySelector('span:last-child');
    
    text.textContent = message;
    
    // Cambiar color según el tipo
    const colors = {
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
    };
    
    indicator.style.background = colors[type] || colors.success;
    statusElement.style.borderLeftColor = colors[type] || colors.success;
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateStatus('Listo para enviar comandos', 'success');
});