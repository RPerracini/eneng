/* js/login.js
   ─────────────────────────────────────────────────────────────
   Login com Firebase Auth v9 (modular) + spinner e feedback
   ───────────────────────────────────────────────────────────── */

import { auth } from './firebase-init.js';
import {
    signInWithEmailAndPassword,
    sendEmailVerification,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

/* utilitário de seleção rápida */
const $ = (id) => document.getElementById(id);

/* ===== helpers de mensagem ===== */
function showText(id, msg = '', color = '') {
    const el = $(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    if (color) el.style.color = color;
}

function showHtml(id, html = '', color = '') {
    const el = $(id);
    if (!el) return;
    el.innerHTML = html;
    el.style.display = html ? 'block' : 'none';
    if (color) el.style.color = color;
}

/* ===== login ===== */
async function login() {
    const email = $('email').value.trim();
    const pass = $('password').value.trim();

    showText('errorMessage');
    showText('successMessage');

    if (!email || !pass) {
        showText('errorMessage', 'Por favor, preencha todos os campos.', 'red');
        return;
    }

    $('loginBtn').disabled = true; // evita duplo-clique

    try {
        const { user } = await signInWithEmailAndPassword(auth, email, pass);

        if (!user.emailVerified) {
            showText(
                'errorMessage',
                'E-mail não confirmado. Clique abaixo para reenviar.',
                'red'
            );
            $('verificacaoEmail').style.display = 'block';
            return;
        }

        /* spinner + mensagem */
        const html = `
      <i data-lucide="loader" class="spinning big-spinner"></i>
      Login realizado com sucesso!
    `;
        showHtml('successMessage', html, '#fc9403');
        window.lucide?.createIcons({ overwrite: true });

        setTimeout(() => {
            const qs = new URLSearchParams(location.search);
            const dest = qs.get('redirectTo') || 'index.html';
            location.href = dest;
        }, 1200);
    } catch (err) {
        console.error('[login.js]', err.code, err.message);
        const map = {
            'auth/invalid-email': 'E-mail inválido.',
            'auth/user-not-found': 'E-mail ou senha incorretos.',
            'auth/wrong-password': 'E-mail ou senha incorretos.',
            'auth/invalid-login-credentials': 'E-mail ou senha incorretos.',
            'auth/user-disabled': 'Conta desativada. Contate o suporte.',
            'auth/network-request-failed':
                'Problema de conexão. Tente novamente.',
        };
        showText('errorMessage', map[err.code] || `Erro: ${err.code}`, 'red');
    } finally {
        $('loginBtn').disabled = false; // reabilita botão
    }
}

/* ===== reenviar verificação ===== */
async function reenviarConfirmacao() {
    const status = $('verificacaoStatus');
    const user = auth.currentUser;

    if (!user) {
        status.textContent = 'Faça login antes.';
        return;
    }
    if (user.emailVerified) {
        status.textContent = 'Seu e-mail já está confirmado.';
        return;
    }

    try {
        await sendEmailVerification(user);
        status.textContent =
            'E-mail reenviado. Verifique sua caixa de entrada.';
    } catch {
        status.textContent = 'Falha ao enviar. Tente novamente.';
    }
}

/* ===== listeners ===== */
document.addEventListener('DOMContentLoaded', () => {
    $('loginBtn')?.addEventListener('click', login);
    $('reenviarConfirmacao')?.addEventListener('click', reenviarConfirmacao);

    /* alternar visibilidade da senha */
    $('toggle-password')?.addEventListener('click', () => {
        const pw = $('password');
        const icon = $('toggle-password').querySelector('i');
        const show = pw.type === 'password';
        pw.type = show ? 'text' : 'password';
        icon.setAttribute('data-lucide', show ? 'eye' : 'eye-closed');
        window.lucide?.createIcons({ overwrite: true });
    });
});

/* expõe para onclick="" caso alguém ainda use */
window.login = login;
window.reenviarConfirmacao = reenviarConfirmacao;
