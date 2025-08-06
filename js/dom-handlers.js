/**
 * dom-handlers.js
 * Responsável por “ligar” o DOM às funções de geometria e tolerância.
 */

import {
    calcularAlfaT,
    invAlfa,
    calcularD1 as calcD1,
    calcularReducao as calcReducao,
    calcularSomaCorrecoes,
    calcularSomaCorrecoes as calcSomaCorrecoes,
    calcularZv1,
    calcularZv2,
    calcularX1a,
    calcularX1ResistenciaFlexao,
    calcularCoeficienteRebaixamento,
    calcularXminUndercut,
    calcularX1ag,
} from './calculos-geometria.js';

/** 1) Atualiza adendo_real e dedendo_real no DOM */
export function atualizarAdendoEDedendo() {
    const mn = parseFloat(document.getElementById('mn').value) || 0;
    const adendo = parseFloat(document.getElementById('adendo').value) || 0;
    const dedendo = parseFloat(document.getElementById('dedendo').value) || 0;

    const adRealEl = document.getElementById('adendo_real');
    if (adRealEl) adRealEl.value = (mn * adendo).toFixed(3);

    const dedRealEl = document.getElementById('dedendo_real');
    if (dedRealEl) dedRealEl.value = (mn * dedendo).toFixed(3);
}

/** 2) Handler para calcular D1 e atualizar no DOM (#d1 e #d1_input) */
export function handlerCalcularD1() {
    const mn = parseFloat(document.getElementById('mn').value) || 0;
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const d1 = calcD1(mn, z1, beta);

    const d1Span = document.getElementById('d1');
    if (d1Span) d1Span.textContent = d1.toFixed(3) + ' mm';

    const d1Input = document.getElementById('d1_input');
    if (d1Input) d1Input.value = d1.toFixed(3);
}

/** 3) Atualiza relação largura/diâmetro no #relacaoLarguraDiametro */
export function atualizarRelacaoLarguraDiametro() {
    const largura = parseFloat(
        document.getElementById('larguraPinhao')?.value || 0
    );
    let d1Str = document.getElementById('d1')?.textContent || '';
    d1Str = d1Str.replace(' mm', '').replace(',', '.');
    const d1 = parseFloat(d1Str);

    const campo = document.getElementById('relacaoLarguraDiametro');
    if (!campo) return;

    if (!isNaN(largura) && largura > 0 && !isNaN(d1) && d1 > 0) {
        campo.value = (largura / d1).toFixed(3);
    } else {
        campo.value = '';
    }
}

/** 4) Resetar todos os campos (inputs não-readonly, resultados e spans) */
export function resetarCampos() {
    if (!confirm('Tem certeza que deseja resetar todos os valores?')) return;

    document
        .querySelectorAll('input:not([readonly])')
        .forEach((el) => (el.value = ''));
    document
        .querySelectorAll('.resultado-calculado')
        .forEach((el) => (el.value = ''));
    document
        .querySelectorAll('span[id]')
        .forEach((sp) => (sp.textContent = '-'));

    // Valores padrão
    const alfaEl = document.getElementById('alfa');
    if (alfaEl) alfaEl.value = '20';

    const grauEl = document.getElementById('grauTolerancia');
    if (grauEl) grauEl.value = '25';

    const desvioEl = document.getElementById('desvioPermitido');
    if (desvioEl) desvioEl.value = 'b';

    const adendoEl = document.getElementById('adendo');
    if (adendoEl) adendoEl.value = '1.000';

    const dedendoEl = document.getElementById('dedendo');
    if (dedendoEl) dedendoEl.value = '1.250';

    atualizarAdendoEDedendo();

    const btn = document.getElementById('btnCalcular');
    if (btn) {
        btn.disabled = true;
        btn.classList.remove('pulsando');
    }
}

/** 5) Atualiza os campos de tolerância (tolerancia_positiva, tolerancia_negativa, aw_max, aw_min) */
export function updateToleranceField() {
    const awInput = document.getElementById('aw');
    const classeInput = document.getElementById('toleranciaCentros');
    if (!awInput || !classeInput) return;

    const aw = parseFloat(awInput.value) || 0;

    try {
        // Chama a função global getTolerance (definida em center-tolerance.js)
        const toler = window.getTolerance(aw);
        const formatValue = (v) =>
            typeof v === 'number' ? v.toFixed(3) : '0.000';

        // tolerancia_positiva
        const posEl = document.getElementById('tolerancia_positiva');
        if (posEl) {
            if (posEl.tagName === 'INPUT')
                posEl.value = formatValue(toler.upper);
            else posEl.textContent = formatValue(toler.upper);
        }

        // tolerancia_negativa
        const negEl = document.getElementById('tolerancia_negativa');
        if (negEl) {
            if (negEl.tagName === 'INPUT')
                negEl.value = formatValue(toler.lower);
            else negEl.textContent = formatValue(toler.lower);
        }

        // aw_max
        const awMaxEl = document.getElementById('aw_max');
        if (awMaxEl) {
            if (awMaxEl.tagName === 'INPUT')
                awMaxEl.value = (aw + toler.upper).toFixed(3) + ' mm';
            else awMaxEl.textContent = (aw + toler.upper).toFixed(3) + ' mm';
        }

        // aw_min
        const awMinEl = document.getElementById('aw_min');
        if (awMinEl) {
            if (awMinEl.tagName === 'INPUT')
                awMinEl.value = (aw + toler.lower).toFixed(3) + ' mm';
            else awMinEl.textContent = (aw + toler.lower).toFixed(3) + ' mm';
        }
    } catch (err) {
        console.error('Erro no cálculo de tolerância:', err);

        // Se der erro, coloca “–” nos campos
        const posEl = document.getElementById('tolerancia_positiva');
        if (posEl) {
            if (posEl.tagName === 'INPUT') posEl.value = '–';
            else posEl.textContent = '–';
        }
        const negEl = document.getElementById('tolerancia_negativa');
        if (negEl) {
            if (negEl.tagName === 'INPUT') negEl.value = '–';
            else negEl.textContent = '–';
        }
        const awMaxEl = document.getElementById('aw_max');
        if (awMaxEl) {
            if (awMaxEl.tagName === 'INPUT') awMaxEl.value = '–';
            else awMaxEl.textContent = '–';
        }
        const awMinEl = document.getElementById('aw_min');
        if (awMinEl) {
            if (awMinEl.tagName === 'INPUT') awMinEl.value = '–';
            else awMinEl.textContent = '–';
        }
    }
}

/** 6) Calcula Zv1, Zv2, X1a, X1b, X1u, X2u e exibe no DOM */
export function calcularZv1eX1Handlers() {
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const somaXn = parseFloat(document.getElementById('somaXn').value) || 0;

    const zv1El = document.getElementById('zv1');
    const zv2El = document.getElementById('zv2');
    const x1apEl = document.getElementById('x1ap');
    const x1bpEl = document.getElementById('x1bp');
    const x1uEl = document.getElementById('x1u');
    const x2uEl = document.getElementById('x2u');

    if (z1 > 0 && z2 > 0 && beta !== 0 && somaXn !== 0) {
        const zv1 = calcularZv1(z1, beta);
        const zv2 = calcularZv2(z2, beta);
        const x1ap = calcularX1a(zv1, z1, z2, somaXn);
        const x1bp = calcularX1ResistenciaFlexao(z1, z2, somaXn);
        const alfaN = parseFloat(document.getElementById('alfa').value) || 20;
        const x1u = calcularXminUndercut(z1, alfaN, beta);
        const x2u = calcularXminUndercut(z2, alfaN, beta);

        if (zv1El) zv1El.textContent = zv1.toFixed(5);
        if (zv2El) zv2El.textContent = zv2.toFixed(5);
        if (x1apEl) x1apEl.value = x1ap.toFixed(5);
        if (x1bpEl) x1bpEl.value = x1bp.toFixed(5);
        if (x1uEl) x1uEl.value = x1u.toFixed(5);
        if (x2uEl) x2uEl.value = x2u.toFixed(5);

        const x1ag = calcularX1ag(z1, z2, somaXn);
        const x1agEl = document.getElementById('x1ag');
        if (x1agEl) x1agEl.value = x1ag.toFixed(5);
    } else {
        if (zv1El) zv1El.textContent = '-';
        if (zv2El) zv2El.textContent = '-';
        if (x1apEl) x1apEl.value = '';
        if (x1bpEl) x1bpEl.value = '';
        if (x1uEl) x1uEl.value = '';
        if (x2uEl) x2uEl.value = '';
    }
}

/** 7) Calcula todos os parâmetros principais (chamado ao clicar em “Calcular”) */
export function calcularTudoHandlers() {
    const mn = parseFloat(document.getElementById('mn').value) || 0;
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const aw = parseFloat(document.getElementById('aw').value) || 0;
    const alfaN = parseFloat(document.getElementById('alfa').value) || 20;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const x1 = parseFloat(document.getElementById('x1').value) || 0;

    // Validação mínima
    if (mn <= 0 || z1 <= 0 || z2 <= 0 || aw <= 0) {
        alert('Preencha todos os campos obrigatórios antes de calcular!');
        return;
    }

    // 1) Ângulo transversal α_t
    const alfaT = calcularAlfaT(alfaN, beta);
    const alfaTEl = document.getElementById('alfaT');
    if (alfaTEl) alfaTEl.textContent = alfaT.toFixed(5) + '°';

    // 2) d1, d2
    const d1 = calcD1(mn, z1, beta);
    const d2 = calcD1(mn, z2, beta);
    const d1El = document.getElementById('d1');
    const d2El = document.getElementById('d2');
    if (d1El) d1El.textContent = d1.toFixed(3) + ' mm';
    if (d2El) d2El.textContent = d2.toFixed(3) + ' mm';

    const d1Input = document.getElementById('d1_input');
    if (d1Input) d1Input.value = d1.toFixed(3);

    // 3) db1, db2
    const alfaTRad = (alfaT * Math.PI) / 180;
    const db1 = d1 * Math.cos(alfaTRad);
    const db2 = d2 * Math.cos(alfaTRad);
    const db1El = document.getElementById('db1');
    const db2El = document.getElementById('db2');
    if (db1El) db1El.textContent = db1.toFixed(3) + ' mm';
    if (db2El) db2El.textContent = db2.toFixed(3) + ' mm';

    // 4) pn, pt
    const betaRad = (beta * Math.PI) / 180;
    const pn = Math.PI * mn;
    const pt = pn / Math.cos(betaRad);
    const pnEl = document.getElementById('pn');
    const ptEl = document.getElementById('pt');
    if (pnEl) pnEl.textContent = pn.toFixed(3) + ' mm';
    if (ptEl) ptEl.textContent = pt.toFixed(3) + ' mm';

    // 5) ΣX e α_wt
    try {
        // ATENÇÃO: A assinatura exata de calcSomaCorrecoes deve bater com o que há em calculos-geometria.js
        // Se em calculos-geometria.js estiver definido como function calcularSomaCorrecoes(z1, z2, alfaN, beta, aw, mn),
        // então chame calcSomaCorrecoes(z1, z2, alfaN, beta, aw, mn).
        // Caso contrário, se for export function calcularSomaCorrecoes({ z1, z2, alfaN, beta, aw, mn }),
        // então mantenha passando o objeto.
        const { alfaWt, somaXn } = calcSomaCorrecoes({
            z1,
            z2,
            alfaN,
            beta,
            aw,
            mn,
        });
        const alfaWtEl = document.getElementById('alfaWt');
        if (alfaWtEl) alfaWtEl.textContent = alfaWt.toFixed(5) + '°';
        const somaEl = document.getElementById('somaXn');
        if (somaEl) {
            somaEl.value = somaXn.toFixed(5);
        }
        // ✅ CHAME DIRETAMENTE:
        calcularZv1eX1Handlers(); // <- Isso garante que x1ap aparece!
    } catch (err) {
        console.error('Erro ao calcular soma de correções:', err);
    }

    // 6) Zv1, Zv2, X1a, X1b, X1u, X2u
    const somaXnValue =
        parseFloat(document.getElementById('somaXn').value) || 0;
    if (z1 > 0 && z2 > 0 && beta !== 0 && somaXnValue !== 0) {
        const zv1 = calcularZv1(z1, beta);
        const zv2 = calcularZv2(z2, beta);
        const x1ap = calcularX1a(zv1, z1, z2, somaXnValue);
        const x1bp = calcularX1ResistenciaFlexao(z1, z2, somaXnValue);
        const x1u = calcularXminUndercut(z1, alfaN, beta);
        const x2u = calcularXminUndercut(z2, alfaN, beta);

        const zv1El = document.getElementById('zv1');
        const zv2El = document.getElementById('zv2');
        const x1apEl = document.getElementById('x1ap');
        const x1bpEl = document.getElementById('x1bp');
        const x1uEl = document.getElementById('x1u');
        const x2uEl = document.getElementById('x2u');

        if (zv1El) zv1El.textContent = zv1.toFixed(5);
        if (zv2El) zv2El.textContent = zv2.toFixed(5);
        if (x1apEl) x1apEl.value = x1ap.toFixed(5);
        if (x1bpEl) x1bpEl.value = x1bp.toFixed(5);
        if (x1uEl) x1uEl.value = x1u.toFixed(5);
        if (x2uEl) x2uEl.value = x2u.toFixed(5);
    }

    // 7) Rebaixamento (rebk)
    const somaXnFinal =
        parseFloat(document.getElementById('somaXn').value) || 0;
    const rebkValue = calcularCoeficienteRebaixamento({
        z1,
        z2,
        mn,
        aw,
        beta,
        somaXn: somaXnFinal,
    });
    const rebkEl = document.getElementById('rebk');
    if (rebkEl) rebkEl.textContent = rebkValue.toFixed(4);

    // 8) dw1, dw2, ha1, ha2, h, da1, da2, df1, df2
    const dw1 = db1 / Math.cos(alfaTRad);
    const dw2 = db2 / Math.cos(alfaTRad);
    const dw1El = document.getElementById('dw1');
    const dw2El = document.getElementById('dw2');
    if (dw1El) dw1El.textContent = dw1.toFixed(3) + ' mm';
    if (dw2El) dw2El.textContent = dw2.toFixed(3) + ' mm';

    const y = aw / mn - (z1 + z2) / (2 * Math.cos(betaRad));
    const yEl = document.getElementById('y');
    if (yEl) yEl.textContent = y.toFixed(6);

    const x2Value = parseFloat(document.getElementById('x2').value) || 0;
    const x1apValue = parseFloat(document.getElementById('x1ap').value) || 0;
    const ha1 = (1 + y - x2Value) * mn;
    const ha2 = (1 + y - x1apValue) * mn;
    const ha1El = document.getElementById('ha1');
    const ha2El = document.getElementById('ha2');
    if (ha1El) ha1El.textContent = ha1.toFixed(3) + ' mm';
    if (ha2El) ha2El.textContent = ha2.toFixed(3) + ' mm';

    const h = (2.25 + y - (x1apValue + x2Value)) * mn;
    const hEl = document.getElementById('h');
    if (hEl) hEl.textContent = h.toFixed(3) + ' mm';

    const da1 = d1 + 2 * ha1;
    const da2 = d2 + 2 * ha2;
    const da1El = document.getElementById('da1');
    const da2El = document.getElementById('da2');
    if (da1El) da1El.textContent = da1.toFixed(3) + ' mm';
    if (da2El) da2El.textContent = da2.toFixed(3) + ' mm';

    const df1 = da1 - 2 * h;
    const df2 = da2 - 2 * h;
    const df1El = document.getElementById('df1');
    const df2El = document.getElementById('df2');
    if (df1El) df1El.textContent = df1.toFixed(3) + ' mm';
    if (df2El) df2El.textContent = df2.toFixed(3) + ' mm';

    // 9) Atualiza relação largura/diâmetro (final)
    atualizarRelacaoLarguraDiametro();

    if (d1Input) d1Input.value = d1.toFixed(3);
}

/** 8) Calcula “redução” (Z2/Z1) e exibe no #reducao */
export function handlerCalcularReducao() {
    const z1 = parseFloat(document.getElementById('z1').value) || 0;
    const z2 = parseFloat(document.getElementById('z2').value) || 0;
    if (z1 <= 0 || z2 <= 0) {
        alert('Os valores de Z1 e Z2 devem ser maiores que zero!');
        document.getElementById('z2')?.focus();
        return;
    }
    try {
        const reducao = calcReducao(z1, z2).toFixed(4);
        const redEl = document.getElementById('reducao');
        if (redEl) redEl.value = reducao;
    } catch (e) {
        console.error('Erro ao calcular redução:', e);
    }
}

// NOVA FUNÇÃO para calcular ΣX e X1 assim que os dados forem digitados
export function calcularSomaXNEDependente() {
    const mn = parseFloat(document.getElementById('mn')?.value) || 0;
    const z1 = parseInt(document.getElementById('z1')?.value) || 0;
    const z2 = parseInt(document.getElementById('z2')?.value) || 0;
    const aw = parseFloat(document.getElementById('aw')?.value) || 0;
    const alfaN = parseFloat(document.getElementById('alfa')?.value) || 20;
    const beta = parseFloat(document.getElementById('beta')?.value) || 0;

    if (mn && z1 && z2 && aw && alfaN && beta) {
        try {
            const { somaXn, alfaWt } = calcularSomaCorrecoes({
                z1,
                z2,
                alfaN,
                beta,
                aw,
                mn,
            });

            const somaEl = document.getElementById('somaXn');
            if (somaEl) somaEl.value = somaXn.toFixed(5);

            const alfaWtEl = document.getElementById('alfaWt');
            if (alfaWtEl) alfaWtEl.textContent = alfaWt.toFixed(5) + '°';

            calcularZv1eX1Handlers(); // Atualiza X1a, X1b, etc.
        } catch (e) {
            console.warn('Erro ao calcular soma de correções:', e);
        }
    }
}

/** 9) Placeholder para gerar PDF */
export function gerarPDF() {
    alert('Funcionalidade de geração de PDF será implementada aqui.');
}
