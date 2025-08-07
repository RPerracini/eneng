// auth-config.js
import {
    getAuth,
    setPersistence,
    browserSessionPersistence,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

export async function configurarSessaoTemporaria() {
    const auth = getAuth();
    try {
        await setPersistence(auth, browserSessionPersistence);
        console.log('[Firebase] Persistência de sessão configurada (SESSION)');
    } catch (error) {
        console.error('Erro ao configurar persistência:', error);
    }
}
