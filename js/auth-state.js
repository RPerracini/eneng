// js/auth-state.js
import {
    initializeApp,
    getApps,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';

import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: 'AIzaSyCYfIlHU7ZT-Cs8VHxugTaSSFXjfSDiaPg',
    authDomain: 'eneng-b34ee.firebaseapp.com',
    projectId: 'eneng-b34ee',
    storageBucket: 'eneng-b34ee.appspot.com',
    messagingSenderId: '401693608382',
    appId: '1:401693608382:web:a912bbb51dac61d88151ef',
    measurementId: 'G-LSC3PG9XKM',
};

// Inicializa Firebase apenas uma vez
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exporta autenticação
export { auth };

/**
 * Executa uma função assim que o estado do usuário for determinado.
 * @param {(user: User|null) => void} callback
 */
export function onUserReady(callback) {
    onAuthStateChanged(auth, callback);
}
