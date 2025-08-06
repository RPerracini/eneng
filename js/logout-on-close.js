// js/logout-on-close.js
import { auth } from './firebase-init.js';
import {
    onAuthStateChanged,
    signOut,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// 🔐 Lista de páginas protegidas
const paginasProtegidas = [
    '/pagina1.html',
    '/pagina2.html',
    '/pagina3.html',
    '/calculo1.html',
    '/calcfolgacilin.html',
    '/area-restrita.html',
];

// 📍 Caminho atual
const caminhoAtual = location.pathname.endsWith('/')
    ? '/index.html'
    : location.pathname;

// 🔢 Gerencia contador de abas com localStorage
const CHAVE_CONTADOR = 'eneng-abas-abertas';

// Incrementa ao abrir
const incrementarAbas = () => {
    const atual = parseInt(localStorage.getItem(CHAVE_CONTADOR) || '0', 10);
    localStorage.setItem(CHAVE_CONTADOR, String(atual + 1));
};

// Decrementa ao fechar e faz logout se for a última
const decrementarAbas = async () => {
    const atual = parseInt(localStorage.getItem(CHAVE_CONTADOR) || '1', 10);
    const novo = Math.max(0, atual - 1);
    localStorage.setItem(CHAVE_CONTADOR, String(novo));

    if (novo === 0 && auth.currentUser) {
        // ✅ Ignora se a aba for a de logout
        if (!location.pathname.includes('logout.html')) {
            try {
                await signOut(auth);
                console.log('✅ Logout automático após fechar todas as abas.');
            } catch (err) {
                console.error('⚠️ Erro no logout automático:', err);
            }
        }
    }
};

// Incrementa ao carregar a aba
incrementarAbas();

// Decrementa ao fechar aba
window.addEventListener('unload', () => {
    decrementarAbas();
});

// Redireciona se necessário
onAuthStateChanged(auth, (user) => {
    const precisaLogin = paginasProtegidas.includes(caminhoAtual);
    if (!user && precisaLogin) {
        console.warn('🔒 Página protegida sem login — redirecionando...');
        window.location.href = 'login.html';
    } else {
        console.log(
            user
                ? '🔓 Usuário autenticado.'
                : '🔓 Página pública — sem necessidade de login.'
        );
    }
});
