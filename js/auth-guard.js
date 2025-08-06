// js/auth-guard.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Sua configuração do Firebase:
const firebaseConfig = {
    apiKey: 'AIzaSyCYfIlHU7ZT-Cs8VHxugTaSSFXjfSDiaPg',
    authDomain: 'eneng-b34ee.firebaseapp.com',
    projectId: 'eneng-b34ee',
    storageBucket: 'eneng-b34ee.appspot.com',
    messagingSenderId: '401693608382',
    appId: '1:401693608382:web:a912bbb51dac61d88151ef',
    measurementId: 'G-LSC3PG9XKM',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Protege a página:
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Não está logado: manda para login
        window.location.href =
            'login.html?redirectTo=' +
            encodeURIComponent(window.location.pathname);
    } else if (!user.emailVerified) {
        // Logado mas não validou o email: manda para verificar-email.html (ou outra página de aviso)
        window.location.href = 'nao-confirmou-email.html';
    }
    // Se chegou aqui, está logado e verificado: permite o acesso normalmente
});
