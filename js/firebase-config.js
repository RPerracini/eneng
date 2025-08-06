// firebase-config.js
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCYfIlHU7ZT-Cs8VHxugTaSSFXjfSDiaPg',
    authDomain: 'eneng-b34ee.firebaseapp.com',
    projectId: 'eneng-b34ee',
    storageBucket: 'eneng-b34ee.firebasestorage.app',
    messagingSenderId: '401693608382',
    appId: '1:401693608382:web:a912bbb51dac61d88151ef',
    measurementId: 'G-LSC3PG9XKM',
};

// Inicializar o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // Se já estiver inicializado, usa a instância existente
}
