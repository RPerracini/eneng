// Função auxiliar para obter número de um <span>, tratando "-" e valores inválidos
function getNumberFromSpan(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const value = el.textContent.trim();
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}

// Função para calcular a espessura na cabeça do dente (sa)
function calcularEspessuraSa(z, x, d, da, alfaN) {
    const alfaNRad = (alfaN * Math.PI) / 180;
    const tgAlfaN = Math.tan(alfaNRad);
    const cosAlfaN = Math.cos(alfaNRad);
    const razao = (d / da) * cosAlfaN;

    if (razao < -1 || razao > 1) return NaN;

    const alfaARad = Math.acos(razao);
    const evAlfaN = Math.tan(alfaNRad) - alfaNRad;
    const evAlfaA = Math.tan(alfaARad) - alfaARad;
    const argumento = ((Math.PI + 4 * x * tgAlfaN) / (2 * z)) + evAlfaN - evAlfaA;

    return da * Math.sin(argumento);
}

// Função para calcular sa1 e sa2 com base nos dados da interface
function calcularEspessurasSa() {
    const z1 = parseInt(document.getElementById('z1')?.value) || 0;
    const z2 = parseInt(document.getElementById('z2')?.value) || 0;
    const x1max = parseFloat(document.getElementById('x1max')?.textContent.replace(' mm', '').trim()) || 0;
    const x2max = parseFloat(document.getElementById('x2max')?.textContent.replace(' mm', '').trim()) || 0;
    const d1 = parseFloat(document.getElementById('d1')?.textContent.replace(' mm', '').trim()) || 0;
    const d2 = parseFloat(document.getElementById('d2')?.textContent.replace(' mm', '').trim()) || 0;
    const da1max = parseFloat(document.getElementById('da1max')?.textContent.replace(' mm', '').trim()) || 0;
    const da2max = parseFloat(document.getElementById('da2max')?.textContent.replace(' mm', '').trim()) || 0;
    const alfaN = parseFloat(document.getElementById('alfa')?.value) || 20;

    const sa1 = calcularEspessuraSa(z1, x1max, d1, da1max, alfaN);
    const sa2 = calcularEspessuraSa(z2, x2max, d2, da2max, alfaN);

    const elSa1 = document.getElementById('sa1');
    const elSa2 = document.getElementById('sa2');

    if (elSa1) elSa1.textContent = isNaN(sa1) ? '-' : `${sa1.toFixed(3)} mm`;
    if (elSa2) elSa2.textContent = isNaN(sa2) ? '-' : `${sa2.toFixed(3)} mm`;

    // Se existirem essas funções externas, executa
    calcularDa1MaxComXmax();
    calcularDa2MaxComXmax();
    }

// Vincula a função ao botão Calcular ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnCalcular');
    if (btn) {
        btn.addEventListener('click', calcularEspessurasSa);
    }
});

// Calcular da1maxxmax
function calcularDa1MaxComXmax() {
    const d1 = parseFloat(document.getElementById('d1')?.textContent?.replace(' mm', '')) || 0;
    const mn = parseFloat(document.getElementById('mn')?.value) || 0;
    const adendo = parseFloat(document.getElementById('adendo')?.value) || 0;
    const rebk = parseFloat(document.getElementById('rebk')?.textContent?.replace(' mm', '')) || 0;
    const x1max = getNumberFromSpan('x1max');

    const da1maxxmax = d1 + 2 * mn * (adendo + x1max + rebk);

    const el = document.getElementById('da1maxxmax');
    if (el) el.textContent = `${da1maxxmax.toFixed(3)} mm`;

    return da1maxxmax;
}

// Calcular da2maxxmax
function calcularDa2MaxComXmax() {
    const d2 = parseFloat(document.getElementById('d2')?.textContent?.replace(' mm', '')) || 0;
    const mn = parseFloat(document.getElementById('mn')?.value) || 0;
    const adendo = parseFloat(document.getElementById('adendo')?.value) || 0;
    const rebk = parseFloat(document.getElementById('rebk')?.textContent?.replace(' mm', '')) || 0;
    const x2max = getNumberFromSpan('x2max');

    const da2maxxmax = d2 + 2 * mn * (adendo + x2max + rebk);

    const el = document.getElementById('da2maxxmax');
    if (el) el.textContent = `${da2maxxmax.toFixed(3)} mm`;

    return da2maxxmax;
}

function calcularNovaEspessuraSa(z, x, d, daMaxXmax, alfaN) {
    const alfaNRad = (alfaN * Math.PI) / 180;
    const tgAlfaN = Math.tan(alfaNRad);
    const cosAlfaN = Math.cos(alfaNRad);
    const razao = (d / daMaxXmax) * cosAlfaN;

    if (razao < -1 || razao > 1) return NaN;

    const alfaARad = Math.acos(razao);
    const evAlfaN = Math.tan(alfaNRad) - alfaNRad;
    const evAlfaA = Math.tan(alfaARad) - alfaARad;
    const argumento = ((Math.PI + 4 * x * tgAlfaN) / (2 * z)) + evAlfaN - evAlfaA;

    return daMaxXmax * Math.sin(argumento);
}

function calcularEspessurasSaMaxXmax() {
    const z1 = parseInt(document.getElementById('z1')?.value) || 0;
    const z2 = parseInt(document.getElementById('z2')?.value) || 0;
    const x1max = parseFloat(document.getElementById('x1max')?.textContent.replace(' mm', '').trim()) || 0;
    const x2max = parseFloat(document.getElementById('x2max')?.textContent.replace(' mm', '').trim()) || 0;
    const d1 = parseFloat(document.getElementById('d1')?.textContent.replace(' mm', '').trim()) || 0;
    const d2 = parseFloat(document.getElementById('d2')?.textContent.replace(' mm', '').trim()) || 0;
    const da1maxxmax = parseFloat(document.getElementById('da1maxxmax')?.textContent.replace(' mm', '').trim()) || 0;
    const da2maxxmax = parseFloat(document.getElementById('da2maxxmax')?.textContent.replace(' mm', '').trim()) || 0;
    const alfaN = parseFloat(document.getElementById('alfa')?.value) || 20;

    const sa1maxxmax = calcularNovaEspessuraSa(z1, x1max, d1, da1maxxmax, alfaN);
    const sa2maxxmax = calcularNovaEspessuraSa(z2, x2max, d2, da2maxxmax, alfaN);

    const elSa1MaxXmax = document.getElementById('sa1maxxmax');
    const elSa2MaxXmax = document.getElementById('sa2maxxmax');

const saMinPermitida = parseFloat(document.getElementById('sa-minimo')?.value?.replace(',', '.')) || 0;

if (elSa1MaxXmax) {
    if (!isNaN(sa1maxxmax)) {
        elSa1MaxXmax.textContent = `${sa1maxxmax.toFixed(3)} mm`;
        elSa1MaxXmax.style.color = sa1maxxmax < saMinPermitida ? 'red' : 'black';
    } else {
        elSa1MaxXmax.textContent = '-';
        elSa1MaxXmax.style.color = 'black';
    }
}

if (elSa2MaxXmax) {
    if (!isNaN(sa2maxxmax)) {
        elSa2MaxXmax.textContent = `${sa2maxxmax.toFixed(3)} mm`;
        elSa2MaxXmax.style.color = sa2maxxmax < saMinPermitida ? 'red' : 'black';
    } else {
        elSa2MaxXmax.textContent = '-';
        elSa2MaxXmax.style.color = 'black';
    }
}
}
