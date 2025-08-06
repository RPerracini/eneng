import {
    getAuth,
    signOut,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const auth = getAuth();
const tabId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
const PING_INTERVAL = 2000; // 2 segundos
const TIMEOUT = 5000; // 5 segundos

function atualizarStatus() {
    const agora = Date.now();
    const status = JSON.parse(localStorage.getItem('abasStatus') || '{}');
    status[tabId] = agora;
    localStorage.setItem('abasStatus', JSON.stringify(status));
}

function removerAba() {
    const status = JSON.parse(localStorage.getItem('abasStatus') || '{}');
    delete status[tabId];
    localStorage.setItem('abasStatus', JSON.stringify(status));
}

function verificarSeUltimaAba() {
    const agora = Date.now();
    const status = JSON.parse(localStorage.getItem('abasStatus') || '{}');

    const ativas = Object.values(status).filter(
        (timestamp) => agora - timestamp < TIMEOUT
    );

    if (ativas.length === 0) {
        // Nenhuma aba ativa = logout
        signOut(auth).catch((err) => {
            console.warn('Erro ao fazer logout:', err.message);
        });
    }
}

export function iniciarControleDeAbas() {
    // Começa a bater
    atualizarStatus();
    const pingInterval = setInterval(atualizarStatus, PING_INTERVAL);

    // Verifica se é a última aba (em todas as abas)
    const checagemInterval = setInterval(verificarSeUltimaAba, PING_INTERVAL);

    // Remove aba quando for fechada
    window.addEventListener('beforeunload', () => {
        clearInterval(pingInterval);
        clearInterval(checagemInterval);
        removerAba();
    });

    window.addEventListener('pagehide', () => {
        clearInterval(pingInterval);
        clearInterval(checagemInterval);
        removerAba();
    });
}
