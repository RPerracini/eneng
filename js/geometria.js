/**
 * geometria.js
 * “Ponto de entrada” principal: importa firebase-init, validacoes e dom-handlers
 * para iniciar a aplicação e anexar os listeners de ENTER.
 */

// import { initFirebaseAuth } from './firebase-init.js';
import { camposPreenchidosEValidos } from './validacoes.js';
import {
    handlerCalcularD1,
    atualizarRelacaoLarguraDiametro,
    atualizarAdendoEDedendo,
    resetarCampos,
    updateToleranceField,
    calcularZv1eX1Handlers,
    calcularTudoHandlers,
    handlerCalcularReducao,
    gerarPDF,
    calcularSomaXNEDependente, // 👈 IMPORTANTE
} from './dom-handlers.js';

import { verificarEspessuraMinimaSaCalculada } from './verificaEspessuraSa.js';

document.addEventListener('DOMContentLoaded', () => {
    // Dispara verificação de sa quando qualquer campo relevante for alterado
    ['mn', 'z1', 'x1', 'adendo', 'alfa', 'beta'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', verificarEspessuraMinimaSaCalculada);
            el.addEventListener('change', verificarEspessuraMinimaSaCalculada);
        }
    });

    // Radio buttons (tratamento térmico)
    document
        .querySelectorAll('input[name="tratamento"]')
        .forEach((radio) =>
            radio.addEventListener(
                'change',
                verificarEspessuraMinimaSaCalculada
            )
        );

    document.getElementById('x1')?.addEventListener('input', () => {
        verificarEspessuraMinimaSaCalculada();
    });

    // Aciona cálculo automático de ΣX e X1 assim que os campos base forem preenchidos
    ['mn', 'z1', 'z2', 'aw', 'alfa', 'beta'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => {
            calcularSomaXNEDependente();
        });
    });

    document
        .querySelectorAll('input[name="tratamento"]')
        .forEach((radio) =>
            radio.addEventListener(
                'change',
                verificarEspessuraMinimaSaCalculada
            )
        );

    document
        .getElementById('toleranciaCentros')
        ?.addEventListener('change', () => {
            updateToleranceField();
        });

    // 2) Desabilita o botão “Calcular” inicialmente
    const btnCalcular = document.getElementById('btnCalcular');
    if (btnCalcular) btnCalcular.disabled = true;

    // 3) Quando digitar em “larguraPinhao”: recalcula D1 e relação largura/diâmetro
    document.getElementById('larguraPinhao')?.addEventListener('input', () => {
        handlerCalcularD1();
        atualizarRelacaoLarguraDiametro();
    });

    // 4) Quando alterar “desvioPermitido”: habilita botão se todos os campos estiverem válidos
    const campoDesvio = document.getElementById('desvioPermitido');
    if (campoDesvio) {
        const habilitarBotaoSeValido = () => {
            if (camposPreenchidosEValidos()) {
                btnCalcular.disabled = false;
                btnCalcular.classList.add('pulsando');
            }
        };

        campoDesvio.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                habilitarBotaoSeValido();
                setTimeout(() => campoDesvio.blur(), 10);
            }
        });
        campoDesvio.addEventListener('change', habilitarBotaoSeValido);
    }

    // 5) Navegação por ENTER em sequência de campos
    const camposConfig = [
        { id: 'mn', next: 'z1' },
        { id: 'z1', next: 'z2' },
        {
            id: 'z2',
            next: 'aw',
            onEnter: handlerCalcularReducao,
        },
        {
            id: 'aw',
            next: 'toleranciaCentros',
            onEnter: updateToleranceField,
        },
        { id: 'toleranciaCentros', next: 'alfa' },
        { id: 'alfa', next: 'beta' },
        {
            id: 'beta',
            next: 'adendo',
            onEnter: atualizarAdendoEDedendo,
        },
        {
            id: 'adendo',
            next: 'dedendo',
            onEnter: atualizarAdendoEDedendo,
        },
        {
            id: 'dedendo',
            next: 'x1',
            onEnter: () => {
                // Dispara atualização de adendo/dedendo real e outros cálculos
                atualizarAdendoEDedendo();
            },
        },
        {
            id: 'x1',
            next: 'larguraPinhao',
            onEnter: () => {
                // Ao pressionar ENTER em x1: recalcula x2 e d1
                const somaXn =
                    parseFloat(document.getElementById('somaXn').value) || 0;
                const x1 = parseFloat(document.getElementById('x1').value) || 0;
                const x2El = document.getElementById('x2');
                if (x2El)
                    x2El.value = somaXn !== 0 ? (somaXn - x1).toFixed(5) : '';
                handlerCalcularD1();
            },
        },
        { id: 'x2', next: 'larguraPinhao' },
        {
            id: 'larguraPinhao',
            next: 'larguraCoroa',
            onEnter: atualizarRelacaoLarguraDiametro,
        },
        { id: 'larguraCoroa', next: 'grauTolerancia' },
        {
            id: 'grauTolerancia',
            next: 'desvioPermitido',
            onEnter: updateToleranceField,
            isSelect: true,
        },
    ];

    camposConfig.forEach((campo) => {
        const el = document.getElementById(campo.id);
        if (!el) {
            console.warn(
                `Elemento com id="${campo.id}" não encontrado no DOM.`
            );
            return;
        }

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                try {
                    if (campo.onEnter) campo.onEnter();
                } catch (err) {
                    console.error(`Erro em onEnter de ${campo.id}:`, err);
                }
                if (campo.next) {
                    const proximo = document.getElementById(campo.next);
                    if (proximo) {
                        proximo.focus();
                        if (campo.isSelect) {
                            // Expande o <select> ao ganhar foco
                            proximo.size = proximo.options.length;
                            setTimeout(() => (proximo.size = 1), 200);
                        }
                    }
                }
            }
        });

        if (campo.isSelect && campo.onEnter) {
            el.addEventListener('change', campo.onEnter);
        }
    });

    // 6) Quando muda “somaXn”, já dispara recálculo de Zv1 e X1
    document
        .getElementById('somaXn')
        ?.addEventListener('change', calcularZv1eX1Handlers);

    // 7) Se digitar em “x1”, recalcula x2 diretamente
    document.getElementById('x1')?.addEventListener('input', () => {
        const somaXn = parseFloat(document.getElementById('somaXn').value) || 0;
        const x1 = parseFloat(document.getElementById('x1').value) || 0;
        const x2El = document.getElementById('x2');
        if (x2El) x2El.value = somaXn !== 0 ? (somaXn - x1).toFixed(5) : '';
    });

    // 8) Botões “Reset” e “PDF”
    document
        .getElementById('btnReset')
        ?.addEventListener('click', resetarCampos);
    document.getElementById('btnPDF')?.addEventListener('click', gerarPDF);

    // 9) Botão “Calcular”: chama a função que preenche todos os resultados e logo em seguida desabilita o botão
    btnCalcular?.addEventListener('click', () => {
        calcularTudoHandlers();
        btnCalcular.disabled = true;
        btnCalcular.classList.remove('pulsando');
    });
});
