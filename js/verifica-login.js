// verifica-login.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    const aindaLogado = sessionStorage.getItem('logadoFirebase') === 'sim';

    if (!user || !aindaLogado) {
        window.location.href = 'login.html';
    }
});
