// layout-loader.js (Firebase v9, type="module")
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: 'AIzaSyCYfIlHU7ZT-Cs8VHxugTaSSFXjfSDiaPg',
    authDomain: 'eneng-b34ee.firebaseapp.com',
    projectId: 'eneng-b34ee',
    storageBucket: 'eneng-b34ee.firebasestorage.app',
    messagingSenderId: '401693608382',
    appId: '1:401693608382:web:a912bbb51dac61d88151ef',
    measurementId: 'G-LSC3PG9XKM',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function carregarHeader() {
    fetch('header-nav.html')
        .then((response) => response.text())
        .then((html) => {
            document.getElementById('header-nav-container').innerHTML = html;

            // Aguarda o DOM do header carregar
            const tentarMostrarEmail = () => {
                const emailSpan = document.getElementById('user-email-text');
                if (emailSpan) {
                    onAuthStateChanged(auth, (user) => {
                        emailSpan.textContent = user?.email ?? 'Usuário não logado';
                    });
                } else {
                    // Tenta novamente em 100ms se não encontrar ainda
                    setTimeout(tentarMostrarEmail, 100);
                }
            };

            tentarMostrarEmail();
        })
        .catch((err) => console.error('Erro ao carregar header:', err));
}

function carregarFooter() {
    fetch('footer.html')
        .then((response) => response.text())
        .then((html) => {
            document.getElementById('footer-container').innerHTML = html;
        })
        .catch((err) => console.error('Erro ao carregar footer:', err));
}

document.addEventListener('DOMContentLoaded', () => {
    carregarHeader();
    carregarFooter();
});
