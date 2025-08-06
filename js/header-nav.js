// js/header-nav.js

import { auth } from './auth-state.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// ✅ Exporta a função para ser chamada pelo auth-sync.js
export function updateLoginUI(user) {
    const logged = !!user;

    // 🔎 Busca os elementos após o DOM estar carregado (garante que existem)
    const menuLogin = document.getElementById('menu-login');
    const menuLogout = document.getElementById('menu-logout');
    const loginLabel = document.getElementById('login-label');
    const adminItem = document.querySelector('.admin');

    if (menuLogin) menuLogin.style.display = logged ? 'none' : 'block';
    if (menuLogout) menuLogout.style.display = logged ? 'block' : 'none';

    if (loginLabel)
        loginLabel.textContent = logged
            ? 'LOGOUT - SENHA ▾'
            : 'LOGIN - SENHA ▾';

    const adminUID = 'czlEaVm7PUX5LjK817x90jOyKz82'; // seu UID de admin
    if (adminItem)
        adminItem.style.display =
            logged && user.uid === adminUID ? 'block' : 'none';

    console.log(
        '[header-nav] updateLoginUI executado com usuário:',
        user?.email || 'deslogado'
    );
}

// 🔁 Função global usada no botão de logout
window.logout = () => {
    signOut(auth)
        .then(() => {
            console.log('[header-nav] Logout realizado com sucesso.');
            location.href = 'index.html';
        })
        .catch((err) => console.error('[header-nav] Erro no logout:', err));
};

// (Opcional) Redirecionamento para login com retorno
window.redirectToLogin = () => {
    const back = encodeURIComponent(location.href);
    location.href = `login.html?redirectTo=${back}`;
};
