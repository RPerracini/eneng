// js/auth-sync.js
import { onUserReady } from './auth-state.js';
import { updateLoginUI } from './header-nav.js';
import { atualizaFooter } from './footer-status.js'; // precisa exportar a função

onUserReady((user) => {
    updateLoginUI(user);
    atualizaFooter(user);
});
