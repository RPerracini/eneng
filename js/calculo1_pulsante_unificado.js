// Estilo CSS embutido para pulsação
const estilo = document.createElement('style');
estilo.innerHTML = `
@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
}
.pulsante {
  animation: pulse 1.2s infinite;
  transition: transform 0.2s ease-in-out;
}
`;
document.head.appendChild(estilo);

// Função auxiliar para verificar campos
function camposValidosGlobais() {
    return (
        typeof camposPreenchidosEValidos === 'function' &&
        camposPreenchidosEValidos()
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnCalcular');
    const campoDesvio = document.getElementById('desvioPermitido');

    if (!btn || !campoDesvio) return;

    // Começa desativado e sem pulsar
    btn.disabled = true;
    btn.classList.remove('pulsante');

    // Só ativa e começa a pulsar após interação com o campo 'desvioPermitido'
    const ativarBotao = () => {
        if (camposValidosGlobais()) {
            btn.disabled = false;
            btn.classList.add('pulsante');
        }
    };

    campoDesvio.addEventListener('change', ativarBotao);
    campoDesvio.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            ativarBotao();
        }
    });

    // Para de pulsar ao clicar
    btn.addEventListener('click', () => {
        btn.classList.remove('pulsante');
    });

    // Para de pulsar ao resetar
    const resetBtn = document.getElementById('btnReset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            btn.disabled = true;
            btn.classList.remove('pulsante');
        });
    }
});
