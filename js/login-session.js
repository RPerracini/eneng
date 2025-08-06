// js/login-session.js

import {
    getAuth,
    setPersistence,
    signInWithEmailAndPassword,
    sendEmailVerification,
    browserLocalPersistence,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

import { auth } from './firebase-init.js';

// 🔐 Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorEl = document.getElementById('errorMessage');
    const successEl = document.getElementById('successMessage');
    const verifyBox = document.getElementById('verificacaoEmail');
    const verifyStatus = document.getElementById('verificacaoStatus');

    if (!loginBtn || !emailInput || !passwordInput) {
        console.error('[login-session.js] Campos não encontrados na página.');
        return;
    }

    loginBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        errorEl.style.display = 'none';
        successEl.style.display = 'none';
        verifyBox.style.display = 'none';
        verifyStatus.textContent = '';

        if (!email || !password) {
            errorEl.innerText = 'Por favor, preencha todos os campos.';
            errorEl.style.display = 'block';
            return;
        }

        // Define a persistência como localStorage
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .then(({ user }) => {
                if (user.emailVerified) {
                    successEl.innerHTML =
                        '<i data-lucide="loader" class="lucide-spin" style="width: 40px; height: 40px;vertical-align: middle"></i> Login realizado com sucesso!';
                    successEl.style.display = 'block';
                    if (window.lucide) lucide.createIcons?.();

                    const params = new URLSearchParams(window.location.search);
                    const redirectTo = params.get('redirectTo') || 'index.html';

                    setTimeout(() => {
                        window.location.href = redirectTo;
                    }, 2000);
                } else {
                    errorEl.innerText =
                        'E-mail não confirmado. Clique abaixo para reenviar.';
                    errorEl.style.display = 'block';
                    verifyBox.style.display = 'block';
                }
            })
            .catch((error) => {
                const map = {
                    'auth/invalid-email': 'E-mail inválido.',
                    'auth/user-not-found': 'Usuário não encontrado.',
                    'auth/wrong-password': 'Senha incorreta.',
                    'auth/invalid-login-credentials':
                        'E-mail ou senha incorretos.',
                    'auth/user-disabled': 'Conta desativada.',
                    'auth/network-request-failed': 'Erro de rede.',
                };
                errorEl.innerText = map[error.code] || `Erro: ${error.code}`;
                errorEl.style.display = 'block';
            });
    });

    // 🔁 Reenviar confirmação de e-mail
    const reenviarBtn = document.getElementById('reenviarConfirmacao');
    if (reenviarBtn) {
        reenviarBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (user && !user.emailVerified) {
                sendEmailVerification(user)
                    .then(() => {
                        verifyStatus.innerText =
                            'E-mail reenviado com sucesso.';
                    })
                    .catch(() => {
                        verifyStatus.innerText =
                            'Erro ao reenviar e-mail de confirmação.';
                    });
            }
        });
    }

    // 👁️ Alternância de visibilidade da senha
    const toggleBtn = document.getElementById('toggle-password');
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const isVisible = passwordInput.type === 'text';
            passwordInput.type = isVisible ? 'password' : 'text';
            toggleBtn.innerHTML = `<i data-lucide="${
                isVisible ? 'eye-closed' : 'eye'
            }"></i>`;
            if (window.lucide) lucide.createIcons?.();
        });
    }
});
