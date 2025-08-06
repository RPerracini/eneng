// js/footer-status.js

export function atualizaFooter(user) {
    const el = document.getElementById('user-email-text');
    const display = document.getElementById('user-email-display');
    const spinner = document.getElementById('auth-spinner');

    if (!el || !display || !spinner) {
        console.warn('[footer-status] Elementos não encontrados');
        return;
    }

    spinner.style.display = 'none';
    display.style.display = 'block';

    if (user) {
        el.innerHTML = `Logado como <b>${user.email}</b>`;
    } else {
        el.textContent = 'Você não está logado.';
    }

}
