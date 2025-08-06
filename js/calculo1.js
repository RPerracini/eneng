// calculo1.js

// =================== IMPORTS (Firebase) ===================
import {
    initializeApp,
    getApps,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';

import {
    getAuth,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence,
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// =========== VARIÁVEIS GLOBAIS ===========
let beta, z1, z2, mn, aw, alfaN, somaXn, d1, d2;

function resetarCampos(){
  location.reload();
}

// Agora o código do modal
document.addEventListener('DOMContentLoaded', function () {
    const btnPdf = document.getElementById('btnPDF');
    if (btnPdf) btnPdf.disabled = true;

    const modal = document.getElementById('modalConfirm');
    modal.style.display = 'none'; // Garantir que o modal esteja oculto inicialmente

    // Flag para controlar se o reset foi confirmado pelo usuário
    let confirmarReset = false;

    // Exibe o modal quando o botão de reset for clicado
    document.getElementById('btnReset').addEventListener('click', function () {
        // liberarCampos1();
        modal.style.display = 'flex'; // Exibe o modal de confirmação
        confirmarReset = false; // Garante que a flag de reset está como false
    });

    // Quando o usuário clica em "Sim", chama a função de resetar
    document.getElementById('btnSim').addEventListener('click', function () {
        confirmarReset = true; // Definir a flag para 'true', indicando que o reset pode ser executado
        resetarCampos();  // Chama a função de resetar os campos
        modal.style.display = 'none';  // Fecha o modal após resetar
        document.getElementById('mn').focus(); // Foco no primeiro campo
    });

    // Quando o usuário clica em "Não", fecha o modal sem fazer nada
    document.getElementById('btnNao').addEventListener('click', function () {
        modal.style.display = 'none'; // Fecha o modal sem realizar nada
    });

      // 🔥 Modal: Aviso Legal
    const btnAviso = document.getElementById('btnavisoLegal');
    const modalAviso = document.getElementById('avisoModal');
    const closeModal = modalAviso?.querySelector('.close-modal');

    if (btnAviso && modalAviso && closeModal) {
        btnAviso.addEventListener('click', () => {
            modalAviso.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modalAviso.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalAviso) {
                modalAviso.style.display = 'none';
            }
        });
    }
});

// ========== CONFIGURAÇÃO FIREBASE ==========
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig); // firebaseConfig deve existir no seu HTML!
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
    .then(() => {
        onAuthStateChanged(auth, (user) => {
            const statusEl = document.getElementById('user-email-text');
            const warningEl = document.getElementById('footer-login-warning');
            if (user) {
                if (statusEl) statusEl.innerHTML = `Logado como <b>${user.email}</b>`;
                if (warningEl) warningEl.style.display = 'none';
            } else {
                if (statusEl) {
                    statusEl.innerHTML = `
                        <i data-lucide="loader" class="lucide spinning"></i>
                        <span>Você não fez login. Redirecionando para a página de login...</span>
                    `;
                }
                if (warningEl) warningEl.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 15000);
            }
        });
    })
    .catch((err) => {
        console.error('Erro ao configurar persistência:', err);
    });

// Formata um número com 4 casas decimais (como string)
function formatar4Casas(valor) {
    return Number(valor).toFixed(4);
}

// Verifica se todos os campos obrigatórios estão preenchidos e válidos
function camposPreenchidosEValidos() {
    const obrigatorios = [
        'mn', 'z1', 'z2', 'aw', 'alfa', 'beta',
        'adendo', 'dedendo', 'x1', 'larguraPinhao',
        'larguraCoroa', 'grauTolerancia', 'desvioPermitido',
        'toleranciaEixo', 'toleranciaCentros', 'zw1_adotado','zw2_adotado',
    ];

    let camposInvalidos = [];

    obrigatorios.forEach((id) => {
        const el = document.getElementById(id);

        if (!el || el.value === '' || el.value == null || el.value === 'Selecione' || el.value === 'Escolha') {
            camposInvalidos.push(id);  // Adiciona o ID do campo não preenchido
        }

        // Verificação adicional para campos numéricos obrigatórios
        if (
            [
                'mn', 'z1', 'z2', 'aw', 'alfa', 'beta',
                'larguraPinhao', 'larguraCoroa',
            ].includes(id)
        ) {
            if (parseFloat(el.value) <= 0) camposInvalidos.push(id);  // Adiciona campos numéricos com valor <= 0
        }
    });

    return camposInvalidos;  // Retorna os campos inválidos
}

// Atualiza os campos de adendo_real e dedendo_real ao alterar módulo/adendo/dedendo
function atualizarAdendoEDedendo() {
    mn = parseFloat(document.getElementById('mn').value) || 0;
    const adendo = parseFloat(document.getElementById('adendo').value) || 0;
    const dedendo = parseFloat(document.getElementById('dedendo').value) || 0;
    document.getElementById('adendo_real').value = (mn * adendo).toFixed(2);
    document.getElementById('dedendo_real').value = (mn * dedendo).toFixed(2);
}

// Calcula a involuta para um ângulo em graus
function invAlfaGraus(anguloGraus) {
    const anguloRad = (anguloGraus * Math.PI) / 180;
    return Math.tan(anguloRad) - anguloRad;
}

// ========== FUNÇÕES DE CÁLCULO DE ENGRENAGENS ==========

// Cálculo do diâmetro primitivo do pinhão (d1)
function calcularDiametro(mn, z, beta) {
    const betaRad = (beta * Math.PI) / 180;
    return (mn * z) / Math.cos(betaRad);
}

// Função para calcular d1
    function calcularD1() {
    mn = parseFloat(document.getElementById('mn').value) || 0;
    z1 = parseInt(document.getElementById('z1').value) || 0;
    beta = parseFloat(document.getElementById('beta').value) || 0;

    d1 = calcularDiametro(mn, z1, beta);

    const d1Input = document.getElementById('d1_input');
    if (d1Input) d1Input.value = d1.toFixed(3);
    document.getElementById("d1").textContent = parseFloat(d1Input.value).toFixed(3) + " mm";
}

// Função para calcular d2
function calcularD2() {
    mn = parseFloat(document.getElementById('mn').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    beta = parseFloat(document.getElementById('beta').value) || 0;

    d2 = calcularDiametro(mn, z2, beta);

    document.getElementById('d2').innerHTML = d2.toFixed(3) + ' mm';
    const d2Input = document.getElementById('d2_input');
    if (d2Input) d2Input.value = d2.toFixed(3);
}

// Atualiza relação largura/diâmetro do pinhão
function atualizarRelacaoLarguraDiametro() {
    const largura = parseFloat(document.getElementById('larguraPinhao')?.value);
    let d1Str = document.getElementById('d1')?.textContent || '';

    // Se o span #d1 estiver vazio, tenta pegar o valor do input
    if (!d1Str || d1Str.trim() === '' || d1Str === '-') {
        d1Str = document.getElementById('d1_input')?.value || '';
    }

    d1Str = d1Str.replace(' mm', '').replace(',', '.');
    const d1 = parseFloat(d1Str);

    const campoRelacao = document.getElementById('relacaoLarguraDiametro');
    if (!campoRelacao) return;

    if (!isNaN(largura) && largura > 0 && !isNaN(d1) && d1 > 0) {
        campoRelacao.value = (largura / d1).toFixed(3);
    } else {
        campoRelacao.value = '';
    }
}

// Calcula redução Z2/Z1
function calcularReducao() {
    z1 = parseInt(document.getElementById("z1").value) || 0;
    z2 = parseInt(document.getElementById("z2").value) || 0;
    if (z1 <= 0 || z2 <= 0) {
        alert('Os valores de Z1 e Z2 devem ser maiores que zero!');
        document.getElementById('z2').focus();
        return false;
    }
    const reducao = (z2 / z1).toFixed(4);
    document.getElementById('reducao').value = reducao;
}

// Calcula ângulo de pressão transversal
function calcularAlfaT() {
    const alfaNRad = (alfaN * Math.PI) / 180;  // Converte alfaN para radianos
    const betaRad = (beta * Math.PI) / 180;   // Converte beta para radianos
    const tanAlfaT = Math.tan(alfaNRad) / Math.cos(betaRad);

    const alfaT = (Math.atan(tanAlfaT) * 180) / Math.PI;

    return alfaT;
}

// Função para calcular db1 e db2
function calcularDb() {
    // Obter os valores de d1, d2 e alfaN
    d1 = parseFloat(document.getElementById('d1').innerHTML.replace(' mm', '')) || 0;
    const d2 = parseFloat(document.getElementById('d2').innerHTML.replace(' mm', '')) || 0;
    const alfaN = parseFloat(document.getElementById('alfa').value) || 20;  // Em graus
    // Calcular o ângulo alfaT (em radianos)
    beta = parseFloat(document.getElementById('beta').value) || 0;  // Ângulo beta
    const alfaT = calcularAlfaT(alfaN, beta);  // Função já fornecida para calcular alfaT
    const alfaTRad = (alfaT * Math.PI) / 180;  // Converter para radianos
    // Calcular db1 e db2
    const db1 = d1 * Math.cos(alfaTRad);
    const db2 = d2 * Math.cos(alfaTRad);
    // Atualizar os valores na interface
    document.getElementById('db1').innerHTML = db1.toFixed(3) + ' mm';
    document.getElementById('db2').innerHTML = db2.toFixed(3) + ' mm';
    // Atualizar os inputs (se necessário)
    const db1Input = document.getElementById('db1_input');
    const db2Input = document.getElementById('db2_input');
    if (db1Input) db1Input.value = db1.toFixed(3);
    if (db2Input) db2Input.value = db2.toFixed(3);
}

function calcularDf() {
    // Sempre use const/let!
    const d1_inputEl = document.getElementById('d1_input');
    const d1El = document.getElementById('d1');
    const d2El = document.getElementById('d2');
    const mnEl = document.getElementById('mn');
    const dedendoEl = document.getElementById('dedendo');
    const x1El = document.getElementById('x1');
    const x2El = document.getElementById('x2');

    if (!d1_inputEl || !d1El || !d2El || !mnEl || !dedendoEl || !x1El || !x2El) {
        console.error('Algum elemento não foi encontrado no DOM.');
        return;
    }

    // d1: pega do input, se não tiver, pega do resultado
    const d1 = parseFloat(d1_inputEl.value || d1El.textContent);
    const d2 = parseFloat(d2El.textContent);
    const mn = parseFloat(mnEl.value);
    const dedendo = parseFloat(dedendoEl.value);
    const x1 = parseFloat(x1El.value);
    // x2 pode ser input readonly, então tanto .value quanto .textContent pode ser preenchido por JS
    const x2 = parseFloat(x2El.value || x2El.textContent);

    if ([d1, d2, mn, dedendo, x1, x2].some(val => isNaN(val))) {
        console.warn('Parâmetros inválidos para calcular df1 e df2.');
        return;
    }

    const df1 = d1 - 2 * mn * (dedendo - x1);
    const df2 = d2 - 2 * mn * (dedendo - x2);

    const df1El = document.getElementById('df1');
    const df2El = document.getElementById('df2');
    if (df1El) df1El.textContent = df1.toFixed(3) + ' mm';
    if (df2El) df2El.textContent = df2.toFixed(3) + ' mm';
}

// Tabela simplificada ISO 286 (h7, h8, h9)
const toleranciaISO = [
{ max: 3, IT7: 10, IT8: 14, IT9: 25 },
{ max: 6, IT7: 12, IT8: 18, IT9: 30 },
{ max: 10, IT7: 15, IT8: 22, IT9: 36 },
{ max: 18, IT7: 18, IT8: 27, IT9: 43 },
{ max: 30, IT7: 21, IT8: 33, IT9: 52 },
{ max: 50, IT7: 25, IT8: 39, IT9: 62 },
{ max: 80, IT7: 30, IT8: 46, IT9: 74 },
{ max: 120, IT7: 35, IT8: 54, IT9: 87 },
{ max: 180, IT7: 40, IT8: 63, IT9: 100 },
{ max: 250, IT7: 46, IT8: 72, IT9: 115 },
{ max: 315, IT7: 52, IT8: 81, IT9: 130 },
{ max: 400, IT7: 57, IT8: 89, IT9: 140 },
{ max: 500, IT7: 63, IT8: 97, IT9: 155 },
{ max: 630, IT7: 175, IT8: 280, IT9: 440 },
{ max: 800, IT7: 200, IT8: 320, IT9: 500 },
{ max: 1000 , IT7: 230, IT8: 360, IT9: 560 },
{ max: 1250 , IT7: 260, IT8: 420, IT9: 660 },
{ max: 1600 , IT7: 310, IT8: 500, IT9: 780 },
{ max: 2000 , IT7: 370, IT8: 600, IT9: 920 },
{ max: 2500 , IT7: 440, IT8: 700, IT9: 1100  },
{ max: 3150 , IT7: 540, IT8: 860, IT9: 1350  },
];

// Função para obter a tolerância superior
function getTolerancia(diametro, classe) {
  if (diametro <= 0 || diametro > 3150) {
    return `Diâmetro fora da faixa suportada (0 - 3150 mm).`;
  }
  const linha = toleranciaISO.find(l => diametro <= l.max);
  if (!linha || !linha[`IT${classe}`]) {
    return `Classe de tolerância inválida. Use 7, 8 ou 9.`;
  }
  const IT = linha[`IT${classe}`];
  const toleranciaSuperior = IT / 1000;  // converter micrômetros para milímetros
  return toleranciaSuperior;
}

// Função para calcular da1max, da1min, da2max e da2min
function calcularDaMaximo() {
    // Obter os valores necessários da interface
    const d1 = parseFloat(document.getElementById('d1').innerHTML.replace(' mm', '')) || 0;
    const d2 = parseFloat(document.getElementById('d2').innerHTML.replace(' mm', '')) || 0;
    const mn = parseFloat(document.getElementById('mn').value) || 0;
    const adendo = parseFloat(document.getElementById('adendo').value) || 0;
    const x1 = parseFloat(document.getElementById('x1').value) || 0;
    const x2 = parseFloat(document.getElementById('x2').value) || 0;
    const rebk = parseFloat(document.getElementById('rebk').innerHTML.replace(' mm', '')) || 0;

    // 🟢 Obter valor da classe de tolerância (ex: "h7") e extrair o número
    const classeStr = document.getElementById('toleranciaEixo')?.value || 'h8'; // padrão "h7"
    const classe = parseInt(classeStr.replace(/[^\d]/g, '')) || 7;

    // Calcular da1max e da2max
    const da1max = d1 + 2 * mn * (adendo + x1 + rebk);
    const da2max = d2 + 2 * mn * (adendo + x2 + rebk);

    // Obter a tolerância superior com a classe dinâmica
    const toleranciaSuperior = getTolerancia(d1, classe);

    // Atualizar os valores no DOM
    document.getElementById('da1max').innerHTML = da1max.toFixed(3) + ' mm';
    document.getElementById('da2max').innerHTML = da2max.toFixed(3) + ' mm';

    const da1Input = document.getElementById('da1_input');
    const da2Input = document.getElementById('da2_input');
    if (da1Input) da1Input.value = da1max.toFixed(3);
    if (da2Input) da2Input.value = da2max.toFixed(3);

    // Calcular mínimo
    const da1min = da1max - toleranciaSuperior;
    const da2min = da2max - toleranciaSuperior;

    document.getElementById('da1min').innerHTML = da1min.toFixed(3) + ' mm';
    document.getElementById('da2min').innerHTML = da2min.toFixed(3) + ' mm';

    return { da1max, da1min, da2max, da2min };
}

function calcularDw() {
    const db1 = parseFloat(document.getElementById('db1').textContent);
    const db2 = parseFloat(document.getElementById('db2').textContent);
    const alfaWt = parseFloat(document.getElementById('alfaWt').textContent);
    if (isNaN(db1) || isNaN(db2) || isNaN(alfaWt)) {
        console.warn('Parâmetros inválidos para calcular dw1 e dw2.');
        return;
    }
    const alfaWtRad = (alfaWt * Math.PI) / 180;
    const dw1 = db1 / Math.cos(alfaWtRad);
    const dw2 = db2 / Math.cos(alfaWtRad);
    document.getElementById('dw1').textContent = dw1.toFixed(3) + ' mm';
    document.getElementById('dw2').textContent = dw2.toFixed(3) + ' mm';
}

// Calcula coeficiente de rebaixamento (rebk)
function calcularCoeficienteRebaixamento() {
    z1 = parseInt(document.getElementById('z1').value) || 0;
    z2 = parseInt(document.getElementById('z2').value) || 0;
    mn = parseFloat(document.getElementById('mn').value) || 0;
    aw = parseFloat(document.getElementById('aw').value) || 0;
    const somaX = parseFloat(document.getElementById('somaXn').value) || 0;
    beta = parseFloat(document.getElementById('beta').value) || 0;
    const betaRad = (beta * Math.PI) / 180;
    const a_teorico = ((z1 + z2) * mn) / (2 * Math.cos(betaRad));
    let k = ((aw - a_teorico) / mn)-somaX;
    if (k < 0) k = 0;
    document.getElementById('rebk').innerHTML = k.toFixed(4);
    return k;
}

function updateTolerance() {
    const awInput = document.getElementById('aw');
    const classeInput = document.getElementById('toleranciaCentros');
    if (!awInput || !classeInput) return;
    const aw = parseFloat(awInput.value) || 0;
    const classe = classeInput.value;
    try {
        const tolerance = window.getTolerance(aw, classe);
        const formatValue = (value) =>
            typeof value === 'number' ? value.toFixed(3) : '0.000';
        document.getElementById('tolerancia_positiva').textContent =
            formatValue(tolerance.positivo);
        document.getElementById('tolerancia_negativa').textContent =
            formatValue(tolerance.negativo);
        document.getElementById('aw_max').textContent =
            formatValue(aw + tolerance.upper) + ' mm';
        document.getElementById('aw_min').textContent =
            formatValue(aw + tolerance.lower) + ' mm';
    } catch (error) {
        console.error('Erro no cálculo de tolerância:', error);
        resetToleranceFields();
    }
}

// Soma de correções (Soma Xn)
function calcularSomaCorrecoes() {
    z1 = parseFloat(document.getElementById("z1")?.value?.replace(",", ".")) || 0;
    z2 = parseFloat(document.getElementById("z2")?.value?.replace(",", ".")) || 0;
    aw = parseFloat(document.getElementById("aw")?.value?.replace(",", ".")) || 0;
    beta = parseFloat(document.getElementById("beta")?.value?.replace(",", ".")) || 0;
    alfaN = parseFloat(document.getElementById("alfa")?.value?.replace(",", ".")) || 0;
    mn = parseFloat(document.getElementById("mn")?.value?.replace(",", ".")) || 0;
    let camposFaltando = [];
    if (z1 <= 0) camposFaltando.push("Número de dentes 1 (z1)");
    if (z2 <= 0) camposFaltando.push("Número de dentes 2 (z2)");
    if (aw <= 0) camposFaltando.push("Distância entre centros (aw)");
    if (beta < 0) camposFaltando.push("Ângulo de inclinação (β)");
    if (alfaN <= 0) camposFaltando.push("Ângulo de pressão normal (αN)");
    if (mn <= 0) camposFaltando.push("Módulo (mn)");
    if (camposFaltando.length > 0) {
        alert("Preencha corretamente o(s) campo(s): " + camposFaltando.join(", ") + "!");
        if (z1 <= 0) document.getElementById('z1').focus();
        else if (z2 <= 0) document.getElementById('z2').focus();
        else if (aw <= 0) document.getElementById('aw').focus();
        else if (beta < 0) document.getElementById('beta').focus();
        else if (alfaN <= 0) document.getElementById('alfa').focus();
        else if (mn <= 0) document.getElementById('mn').focus();
        return false;
    }
    const betaRad = (beta * Math.PI) / 180;
    const alfaT = calcularAlfaT(alfaN, beta);
    const alfaTRad = (alfaT * Math.PI) / 180;
    const mt = mn / Math.cos(betaRad);
    const cosAlfaWt = ((z1 + z2) * mt * Math.cos(alfaTRad)) / (2 * aw);
    let alfaWt = 0;
    if (cosAlfaWt >= -1 && cosAlfaWt <= 1) {
        const alfaWtRad = Math.acos(cosAlfaWt);
        alfaWt = (alfaWtRad * 180) / Math.PI;
    } else {
        alfaWt = 0;
    }
    document.getElementById('alfaWt').innerHTML = alfaWt.toFixed(5) + '°';
    somaXn = ((z1 + z2) * (invAlfaGraus(alfaWt) - invAlfaGraus(alfaT))) /
        (2 * Math.tan((alfaN * Math.PI) / 180));
    document.getElementById('somaXn').value = formatar4Casas(somaXn);
}

// Função para calcular o módulo transversal
function calcularModuloTransversal() {
    const mn = parseFloat(document.getElementById('mn').value); // Módulo normal (mₙ)
    const beta = parseFloat(document.getElementById('beta').value); // Ângulo de inclinação (β) em graus

    // Verifique se os valores são válidos
    if (isNaN(mn) || isNaN(beta)) {
        console.error("Valores inválidos para o módulo normal ou ângulo de inclinação.");
        return;
    }

    // Converte o ângulo de inclinação (beta) de graus para radianos
    const betaRad = (beta * Math.PI) / 180;

    // Calcula o módulo transversal (mₜ)
    const mt = mn / Math.cos(betaRad);

    // Exibir o valor de mₜ no HTML (por exemplo, em um campo de resultado)
    document.getElementById('mt').textContent = mt.toFixed(5) + ' mm';  // Exibe o resultado no <span id="mt">

    return mt;
}

function calcularZv1() {
    // Pega os valores dos campos de entrada
    const z1 = parseFloat(document.getElementById('z1').value);
    const beta_b = parseFloat(document.getElementById('beta_b').value);
    const beta = parseFloat(document.getElementById('beta').value);

    let zv1;

    if (z1 > 0 && !isNaN(beta_b) && !isNaN(beta)) {
        // Converte os ângulos de graus para radianos
        const beta_bRad = (beta_b * Math.PI) / 180;
        const betaRad = (beta * Math.PI) / 180;

        // Calcula Z_v1 com a fórmula correta
        zv1 = z1 / (Math.cos(beta_bRad) ** 2 * Math.cos(betaRad)); // Fórmula Z_v1

        // Atualiza o valor do campo de entrada com o valor calculado
        document.getElementById('zv1').value = zv1.toFixed(5);  // Atualiza o valor do input

        // Exibe o valor de forma visível (caso necessário)
        document.getElementById('zv1_mostrar').textContent = zv1.toFixed(5);

        return zv1;
    } else {
        // Limpa o valor do campo de entrada caso os dados sejam inválidos
        document.getElementById('zv1').value = '';
        document.getElementById('zv1_mostrar').textContent = '-';
        console.warn('⚠️ Z_v1 não foi calculado - valores inválidos');
        return null;
    }
}

function calcularZv2() {
    // Pega os valores dos campos de entrada
    const z2 = parseFloat(document.getElementById('z2').value);
    const beta_b = parseFloat(document.getElementById('beta_b').value);
    const beta = parseFloat(document.getElementById('beta').value);

    let zv2;

    if (z2 > 0 && !isNaN(beta_b) && !isNaN(beta)) {
        const beta_bRad = (beta_b * Math.PI) / 180;
        const betaRad = (beta * Math.PI) / 180;

        zv2 = z2 / (Math.cos(beta_bRad) ** 2 * Math.cos(betaRad));

        // Atualiza o valor do campo de entrada com o valor calculado
        document.getElementById('zv2').value = zv2.toFixed(5);  // Atualiza o valor do input

        // Exibe o valor de forma visível (caso necessário)
        document.getElementById('zv2_mostrar').textContent = zv2.toFixed(5);

        return zv2;
    } else {
        // Limpa o valor do campo de entrada caso os dados sejam inválidos
        document.getElementById('zv2').value = '';
        document.getElementById('zv2_mostrar').textContent = '-';
        console.warn('⚠️ Z_v2 não foi calculado - valores inválidos');
        return null;
    }
}

function calcularX1ap() {
    z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const somaXn = parseFloat(document.getElementById('somaXn').value) || 0;
    beta = parseFloat(document.getElementById('beta').value) || 0;
    const alfaN = parseFloat(document.getElementById('alfa').value) || 20;
    // Verificando se os valores de entrada são válidos
    if (z1 > 0 && z2 > 0 && beta !== 0 && somaXn !== 0) {
        const zv1 = calcularZv1()
        // Calculando X1a e X1b
        const x1ap = calcularx1a(zv1, z1, z2, somaXn);
        const x1bp = calcularX1ResistenciaFlexao(z1, z2, somaXn);
        // Exibindo valores calculados
        const x1u = calcularXminUndercut(z1, alfaN,beta);
        const x2u = calcularXminUndercut(z2, alfaN,beta);
        // Atualizando os valores de entrada na interface
        document.getElementById('x1ap').value = formatar4Casas(x1ap);
        document.getElementById('x1bp').value = formatar4Casas(x1bp);
        document.getElementById('x1u').value = formatar4Casas(x1u);
        document.getElementById('x2u').value = formatar4Casas(x2u);
    } else {
        document.getElementById('x1ap').value = '';
        document.getElementById('x1bp').value = '';
    }
}

// Calcula coeficiente de correção para evitar undercut
function calcularXminUndercut(z, alfaN, beta) {
    // Converte ângulos de graus para radianos
    const alfaRad = alfaN * Math.PI / 180;
    const betaRad = beta  * Math.PI / 180;
let alfaTrad = Math.atan(Math.tan(alfaRad) / Math.cos(betaRad));

    // (sin(alpha_t))^2
    const seno2 = Math.pow(Math.sin(alfaTrad), 2);

    return 1 - (z * seno2) / (2 * Math.cos(betaRad));
}

// Calcula coeficiente de correção (deslizamento específico)
function calcularx1a(zv1, z1, z2, somaXn) {
    const u = z2 / z1;
    return (1 / Math.sqrt(zv1)) * (1 - 1 / u) + somaXn / (1 + u);
}

function calcularX1ResistenciaFlexao(z1, z2, somaXn) {
    const u = z2 / z1;
    return 0.5 * (1 - 1 / u) + somaXn / (1 + u);
}

function calcularX1Geral() {
    z1 = parseFloat(document.getElementById('z1').value) || 0;
    const z2 = parseFloat(document.getElementById('z2').value) || 0;
    const somaXn = parseFloat(document.getElementById('somaXn').value) || 0;
    if (z1 <= 0 || z2 <= 0 || somaXn === 0) {
        document.getElementById('x1ag').value = '';
        return;
    }
    const u = z2 / z1;
    const x1ag = (1 / 3) * (1 - 1 / u) + somaXn / (1 + u);
    document.getElementById('x1ag').value = formatar4Casas(x1ag);
}

// Calcula X2 a partir de somaXn e X1
function calcularX2() {
    const somaXn = parseFloat(document.getElementById('somaXn').value);
    const x1 = parseFloat(document.getElementById('x1').value);

    if (!isNaN(somaXn) && !isNaN(x1)) {
        const x2 = somaXn - x1;
        document.getElementById('x2').value = formatar4Casas(x2);
    } else {
        console.warn("Valores inválidos: somaXn ou x1 não são números.");
    }
}

// Calcula espessura mínima permitida Sa
function calcularEspessuraMinimaPermitida() {
    mn = parseFloat(document.getElementById('mn')?.value) || 0;
    // Pegar o valor do campo de texto 'tratamento'
    const tratamento = document.getElementById('tratamento')?.value.toUpperCase(); // Garantir que seja maiúsculo
    if (!mn || !tratamento || (tratamento !== 'S' && tratamento !== 'N')) {
        document.getElementById('sa-minimo').value = '';
        return;
    }
    const fator = tratamento === 'N' ? 0.2 : 0.4;
    const saMin = fator * mn;
    document.getElementById('sa-minimo').value = saMin.toFixed(3);
}

function calcularBetaB() {
    // Recebe os ângulos em graus
    const beta = parseFloat(document.getElementById('beta').value);
    const alfa_n = parseFloat(document.getElementById('alfa').value);

    const betaRad = beta * Math.PI / 180;
    const alfaNRad = alfa_n * Math.PI / 180;

    // Calcula o seno de beta_b
    const sinBetaB = Math.sin(betaRad) * Math.cos(alfaNRad);

    // Calcula beta_b em radianos
    const betaBRad = Math.asin(sinBetaB);

    // Converte beta_b para graus
    const beta_b = betaBRad * 180 / Math.PI;

    document.getElementById('beta_b').value = beta_b.toFixed(4);

    return beta_b;
}

// Funções auxiliares seguras para leitura de campos
function getNumber(id, fallback = 0) {
    const el = document.getElementById(id);
    let val = el?.value?.trim() || el?.textContent?.trim();
    if (!val) {
        console.warn(`⚠️ Elemento '${id}' não encontrado ou sem valor.`);
        return fallback;
    }
    return parseFloat(val.replace(",", ".")) || fallback;
}

    function calcularPnPt() {
    mn = parseFloat(document.getElementById('mn')?.value?.replace(",", ".")) || 0;
    beta = parseFloat(document.getElementById('beta')?.value?.replace(",", ".")) || 0;
    const betaRad = (beta * Math.PI) / 180;
    const pn = Math.PI * mn;
    const pt = pn / Math.cos(betaRad);
    document.getElementById('pn').innerHTML = pn.toFixed(3) + ' mm';
    document.getElementById('pt').innerHTML = pt.toFixed(3) + ' mm';
    // Opcional: retorno para reuso
    return { mn, beta, betaRad, pn, pt };
}

function calcularCorrecoes(pn, mn, alfaN, sn1max, sn1min, sn2max, sn2min) {
    // Validação de entrada
    const parametros = { pn, mn, alfaN, sn1max, sn1min, sn2max, sn2min };
    for (const [key, value] of Object.entries(parametros)) {
    if (!isFinite(value)) {
        console.warn(`❌ Parâmetro inválido: ${key} =`, value);
        return;
    }
}

    // Conversão do ângulo para radianos
    const alfaN_rad = (alfaN * Math.PI) / 180;
    const tanAlfaN = Math.tan(alfaN_rad);

    // Função auxiliar para atualização do DOM
    const setValor = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = isFinite(val) ? val.toFixed(5) : "-";
        }
    };

    // Cálculo das correções
    const calcularX = (sn) => (2 * sn - pn) / (4 * mn * tanAlfaN);
    const x1max = calcularX(sn1max);
    const x1min = calcularX(sn1min);
    const x2max = calcularX(sn2max);
    const x2min = calcularX(sn2min);

    // Atualiza o DOM
    setValor("x1max", x1max);
    setValor("x1min", x1min);
    setValor("x2max", x2max);
    setValor("x2min", x2min);

    // Opcional: retornar dados para depuração ou encadeamento
    return { x1max, x1min, x2max, x2min };
}

function calcularEspessuraDente() {
    const getValue = (id, fromText = false) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const raw = fromText ? el.textContent : el.value;
        if (!raw) return 0;
        return parseFloat(raw.replace("µm", "").replace(",", ".").replace(" mm", "").trim()) || 0;
    };

    const rad = deg => deg * (Math.PI / 180);

    const pn = getValue("pn", true);
    const mn = getValue("mn");
    const x1 = getValue("x1");
    const x2 = getValue("x2");
    const asne1 = getValue("asne1", true);
    const asni1 = getValue("asni1", true);
    const asne2 = getValue("asne2", true);
    const asni2 = getValue("asni2", true);
    const alfaN = getValue("alfa");
    const beta = getValue("beta");

    if (!isFinite(alfaN) || !isFinite(beta)) {
        document.getElementById("alfaT").textContent = "-";
        return;
    }

    const alfaN_rad = rad(alfaN);

    const sn1 = pn / 2 + 2 * x1 * mn * Math.tan(alfaN_rad);
    const sn2 = pn / 2 + 2 * x2 * mn * Math.tan(alfaN_rad);

    const sn1max = sn1 + asne1 / 1000;
    const sn1min = sn1 + asni1 / 1000;
    const sn2max = sn2 + asne2 / 1000;
    const sn2min = sn2 + asni2 / 1000;

    // Atualiza DOM (sem " mm" no textContent, para uso em parseFloat)
    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val.toFixed(3);
    };

    setText("espessura1_normal", sn1);
    setText("espessura1_maxima", sn1max);
    setText("espessura1_minima", sn1min);
    setText("espessura2_normal", sn2);
    setText("espessura2_maxima", sn2max);
    setText("espessura2_minima", sn2min);

    // Retorna tudo que pode ser útil em outros cálculos
    return {
        pn, mn, alfaN, beta,
        sn1nom: sn1, sn1min, sn1max,
        sn2nom: sn2, sn2min, sn2max
    };
}

// Função utilitária para atualizar os campos Md
function atualizarSaidasMd(resultado, engrenagem) {
  document.getElementById(`Mdnom${engrenagem}`).textContent = `${resultado.Mdnom.toFixed(3)} mm`;
  document.getElementById(`Mdmin${engrenagem}`).textContent = `${resultado.Mdmin.toFixed(3)} mm`;
  document.getElementById(`Mdmax${engrenagem}`).textContent = `${resultado.Mdmax.toFixed(3)} mm`;
}

// Cálculo master: chama todos os cálculos principais em sequência
function calcularTudo() {
    const btnPdf = document.getElementById('btnPDF');
    if (btnPdf) btnPdf.disabled = false;

    const btn = document.getElementById('btnCalcular');
    btn.disabled = true;
    btn.classList.remove('pulsando');

    // Obter alfaN e beta dos inputs
    const alfaN = parseFloat(document.getElementById('alfa').value);
    const beta = parseFloat(document.getElementById('beta').value);

    if (!isNaN(alfaN) && !isNaN(beta)) {
        const alfaT = calcularAlfaT(alfaN, beta);
        document.getElementById('alfaT').textContent = alfaT.toFixed(5) + '°';
    } else {
        console.error("Valores de alfaN ou beta inválidos.");
    }

    // Etapas básicas do cálculo
    calcularReducao();
    calcularD1();
    calcularD2();
    calcularBetaB();
    calcularDb();
    calcularDaMaximo();
    atualizarRelacaoLarguraDiametro();
    calcularSomaCorrecoes();
    calcularX2();
    calcularCoeficienteRebaixamento();

    // Etapa crítica: Pn precisa ser calculado antes da espessura do dente
    calcularPnPt();

    // Agora sim, coletar valores atualizados
    const pn = parseFloat(document.getElementById("pn")?.textContent?.replace(",", ".")) || 0;
    const mn = parseFloat(document.getElementById("mn")?.value?.replace(",", ".")) || 0;

    const dadosEsp = calcularEspessuraDente();

    if (dadosEsp) {
        // Atualizar os campos do DOM
        document.getElementById('espessura1_normal').textContent = `${dadosEsp.sn1nom.toFixed(3)} mm`;
        document.getElementById('espessura1_minima').textContent = `${dadosEsp.sn1min.toFixed(3)} mm`;
        document.getElementById('espessura1_maxima').textContent = `${dadosEsp.sn1max.toFixed(3)} mm`;

        document.getElementById('espessura2_normal').textContent = `${dadosEsp.sn2nom.toFixed(3)} mm`;
        document.getElementById('espessura2_minima').textContent = `${dadosEsp.sn2min.toFixed(3)} mm`;
        document.getElementById('espessura2_maxima').textContent = `${dadosEsp.sn2max.toFixed(3)} mm`;

        // Correções
        calcularCorrecoes(
            pn, mn, alfaN,
            dadosEsp.sn1max, dadosEsp.sn1min,
            dadosEsp.sn2max, dadosEsp.sn2min
        );

        // Espessuras na cabeça após correções
        calcularEspessurasSa();
    } else {
        console.warn("❗ Dados de espessura não disponíveis.");
    }

    // Espessuras na cabeça após correções
    calcularEspessurasSaMaxXmax();

    // Cálculo de Md
    const resultado1 = calcularMdEngrenagem(1);
    const resultado2 = calcularMdEngrenagem(2);
    atualizarSaidasMd(resultado1, 1);
    atualizarSaidasMd(resultado2, 2);

    // Demais etapas finais
    calcularEspessuraMinimaPermitida();
    calcularZv1();
    calcularZv2();
    calcularDw();
    calcularDf();
    calcularZw1eZw2();
    calcularModuloTransversal();
    calculoDoDiametroDaEsfera();
    calcularW();
    larguraMinimaRodaDentada();
    calcularX1Geral();
    calcularX1ap()

    // Exibir resultados
    document.getElementById('resultado-calculo1').style.display = 'block';
    document.getElementById('resultado-calculo2').style.display = 'block';
    document.getElementById('resultado-calculo3').style.display = 'block';

    // Foco em inputs manuais
    const zw1Input = document.getElementById('zw1_adotado');
    const zw2Input = document.getElementById('zw2_adotado');
}

// ========== EVENTOS E DOMContentLoaded ==========

document.addEventListener('DOMContentLoaded', function () {

    setupCalculoEngrenagens();

    const btnCalcular = document.getElementById('btnCalcular');
    btnCalcular.disabled = true;
    document.getElementById('btnCalcular')?.addEventListener('click', calcularTudo);

const camposConfig = [
    { id: 'cliente', next: 'projeto', },
    { id: 'projeto', next: 'observacoes', },
    { id: 'observacoes', next: 'mn', },
    { id: 'mn', next: 'z1', },
    { id: 'z1', next: 'z2' },
    { id: 'z2', next: 'aw', onEnter: calcularReducao },
    { id: 'aw', next: 'toleranciaCentros', onEnter: updateTolerance },
    { id: 'toleranciaCentros', next: 'alfa' },
    { id: 'alfa', next: 'beta' },
    { id: 'beta', next: 'adendo', onEnter: calcularBetaB },
    { id: 'adendo', next: 'dedendo', onEnter: atualizarAdendoEDedendo },
    {
        id: 'dedendo',
        next: 'tratamento',
        onEnter: () => {
            atualizarAdendoEDedendo();
            calcularSomaCorrecoes();
            calcularZv1();
            calcularZv2();
            calcularX1Geral();
            calcularX1ap();
        },
    },
    {
        id: 'tratamento',
        next: 'x1',
        onEnter: () => {
        calcularEspessuraMinimaPermitida();// Passa para o campo de tratamento térmico
    },
},
    {
        id: 'x1',
        next: 'larguraPinhao',  // Depois da escolha do tratamento, vai para 'larguraPinhao'
        onEnter: () => {
            calcularD1();
            calcularD2();
            calcularCoeficienteRebaixamento();
            calcularDaMaximo();
            calcularEspessuraMinimaPermitida();
            calcularX2();
        }
    },
    {
        id: 'larguraPinhao',
        next: 'larguraCoroa',
        onEnter: atualizarRelacaoLarguraDiametro,
    },
    { id: 'larguraCoroa', next: 'grauTolerancia' },
    {
        id: 'grauTolerancia',
        next: 'desvioPermitido',
        onEnter: updateTolerance,
        isSelect: true,
    },
    {
        id: 'desvioPermitido',
        next: 'toleranciaEixo',
        isSelect: true,
    },
    {
        id: 'toleranciaEixo',
        next: 'zw1_adotado',
        onEnter:calcularZw1eZw2
    },
    {
        id: 'zw1_adotado',
        next: 'zw2_adotado',
     },
    {
        id: 'zw2_adotado',
        next: 'd1adotado',
        onEnter:calculoDoDiametroDaEsfera
     },

         {
        id: 'd1adotado',
        next: 'd2adotado',
     },
{
    id: 'd2adotado',
    next: 'btnCalcular',
    onEnter: () => {
        const btn = document.getElementById('btnCalcular');
        // Chama a função para verificar os campos e retorna uma lista dos campos não preenchidos
        const camposInvalidos = camposPreenchidosEValidos();
        if (camposInvalidos.length === 0) {
            btn.disabled = false;
            btn.classList.add('pulsando');
        } else {
            console.warn("Campos não preenchidos ou inválidos:");
            camposInvalidos.forEach(campo => {
                console.warn(`Campo não preenchido ou inválido: ${campo}`);
            });
        }
    },

    isSelect: true,
}
];

camposConfig.forEach((campo) => {
    const element = document.getElementById(campo.id) || document.querySelector(`[name="${campo.id}"]`);
    if (!element) return;
    element.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            if (document.getElementById('popup-undercut')) return;
            e.preventDefault();
            // Executa ação customizada se existir
            if (typeof campo.onEnter === 'function') {
                try {
                    campo.onEnter();
                } catch (err) {
                    console.warn(`Erro na função onEnter do campo ${campo.id}:`, err);
                }
            }
            // Move para o próximo campo
            if (campo.next) {
                const nextEl = document.getElementById(campo.next) || document.querySelector(`[name="${campo.next}"]`);
                if (nextEl) {
                    nextEl.focus();
                    // Se for select, abre opções temporariamente
                    if (campo.isSelect && nextEl.tagName === 'SELECT') {
                        nextEl.size = nextEl.options.length;
                        setTimeout(() => (nextEl.size = 1), 300);
                    }
                }
            }
        }
    });
    // Aciona função ao mudar select manualmente
    if (campo.isSelect && typeof campo.onEnter === 'function') {
        element.addEventListener('change', campo.onEnter);
    }
});

// Setup inicial dos campos, listeners, etc
function setupCalculoEngrenagens() {
    // Aqui você pode configurar qualquer coisa adicional no carregamento, se necessário.
    // Por exemplo: preencher selects, ajustar valores padrão, etc.
}
});

document.addEventListener('DOMContentLoaded', function() {
  const mnInput = document.getElementById('mn');
  const x1Input = document.getElementById('x1');

  // Sempre 3 casas para mn
  mnInput.addEventListener('blur', function() {
    if (mnInput.value !== "") {
      let valor = mnInput.value.replace(',', '.');
      mnInput.value = parseFloat(valor).toFixed(3);
    }
  });

  // Sempre 4 casas para x1
  x1Input.addEventListener('blur', function() {
    if (x1Input.value !== "") {
      let valor = x1Input.value.replace(',', '.');
      x1Input.value = parseFloat(valor).toFixed(4);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os inputs e selects do formulário
    const campos = document.querySelectorAll('input, select');
    campos.forEach(function(campo) {
        campo.addEventListener('change', function() {
            calcularTudo();
        });
        // Opcional: para inputs tipo texto/number, executa a cada digitação também
        if (campo.tagName === 'INPUT') {
            campo.addEventListener('input', function() {
                calcularTudo();
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const btnFormulas = document.getElementById('btnFormulasExemplo');
    if (btnFormulas) {
        btnFormulas.addEventListener('click', function(e) {
            e.preventDefault(); // Garante que nenhum outro comportamento aconteça
            window.open('arquivos_Pdf/ECDRouH.pdf', '_blank');
        });
    }
});
