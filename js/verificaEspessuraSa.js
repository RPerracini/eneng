export function verificarEspessuraMinimaSaCalculada() {
    const mn = parseFloat(document.getElementById('mn')?.value);
    const beta = parseFloat(document.getElementById('beta')?.value);
    const x1 = parseFloat(document.getElementById('x1')?.value);
    const adendo = parseFloat(document.getElementById('adendo')?.value);
    const saField = document.getElementById('sa');
    const feedbackEl = document.getElementById('sa-feedback');

    if (!saField || !feedbackEl || isNaN(mn) || isNaN(beta) || isNaN(x1))
        return;

    const z1 = parseFloat(document.getElementById('z1')?.value) || 0;
    const rebk = parseFloat(document.getElementById('rebk')?.textContent) || 0;
    const betaRad = (beta * Math.PI) / 180;
    const d = (mn * z1) / Math.cos(betaRad);
    const da = d + 2 * mn * (adendo + x1 - rebk);

    const inv = (angulo) => Math.tan(angulo) - angulo;
    const alfa = parseFloat(document.getElementById('alfa')?.value) || 0;
    const alfaRad = (alfa * Math.PI) / 180;

    const s = (Math.PI * mn) / 2 + 2 * x1 * mn;
    const sa = da * (s / d + inv(alfaRad) - inv(Math.acos(d / da)));
    saField.value = sa.toFixed(3);

    const tratamento = document.querySelector(
        'input[name="tratamento"]:checked'
    )?.value;
    const mt = mn / Math.cos(betaRad);
    const saMin = (tratamento === 'temperada' ? 0.4 : 0.2) * mt;

    document.getElementById('sa-minimo').value = saMin.toFixed(3);

    if (sa < saMin) {
        feedbackEl.innerHTML = '❌';
        feedbackEl.style.color = '#D00000';
        feedbackEl.title = `Mínimo exigido: ${saMin.toFixed(3)} mm`;
    } else {
        feedbackEl.innerHTML = '✅';
        feedbackEl.style.color = 'green';
        feedbackEl.title = `OK: ${sa.toFixed(3)} mm ≥ ${saMin.toFixed(3)} mm`;
    }
}
