// firebase-init.js
// Firebase 9.23 – inicialização centralizada do app e do Auth
import {
    initializeApp,
    getApps,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
    getAuth,
    setPersistence,
    browserLocalPersistence, // persistência em localStorage
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

/* ============================================================================
 * 1. Configuração do seu projeto Firebase
 * --------------------------------------------------------------------------*/
const firebaseConfig = {
    apiKey: 'AIzaSyCYfIlHU7ZT-Cs8VHxugTaSSFXjfSDiaPg',
    authDomain: 'eneng-b34ee.firebaseapp.com',
    projectId: 'eneng-b34ee',
    storageBucket: 'eneng-b34ee.appspot.com',
    messagingSenderId: '401693608382',
    appId: '1:401693608382:web:a912bbb51dac61d88151ef',
    measurementId: 'G-LSC3PG9XKM',
};

/* ============================================================================
 * 2. Inicialização única do Firebase App + Auth
 * --------------------------------------------------------------------------*/
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ============================================================================
 * 3. Persistência em localStorage (compartilhada por todas as abas)
 * --------------------------------------------------------------------------*/
setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('[firebase-init] Persistência localStorage OK.'))
    .catch((err) => console.error('[firebase-init] Erro persistência:', err));

/* ============================================================================
 * 4. Guard de páginas protegidas
 * --------------------------------------------------------------------------*/
export function requireLogin() {
    onAuthStateChanged(auth, (user) => {
        if (!user) window.location.href = 'login.html';
    });
}

/* ============================================================================
 * 5. Exportações
 * --------------------------------------------------------------------------*/
export { auth };
