// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: 'AIzaSyCYfIlHU7ZT-Cs8VHxugTaSSFXjfSDiaPg',
    authDomain: 'eneng-b34ee.firebaseapp.com',
    databaseURL: 'https://eneng-b34ee-default-rtdb.firebaseio.com', // <- adicione esta linha
    projectId: 'eneng-b34ee',
    storageBucket: 'eneng-b34ee.appspot.com', // <- corrigido o domínio
    messagingSenderId: '401693608382',
    appId: '1:401693608382:web:a912bbb51dac61d88151ef',
    measurementId: 'G-LSC3PG9XKM',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

