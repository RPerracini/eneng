document.addEventListener('DOMContentLoaded', function() {
    // Fallback seguro para a função de tolerância
    window.getTolerance = window.getTolerance || function(aw, toleranceClass) {
        console.warn("Usando cálculo de tolerância fallback");
        const baseTolerance = aw * 0.03; // 3% como fallback
        return {
            lower: -baseTolerance,
            upper: baseTolerance
        };
    };
    
    setupCalculoEngrenagens();
});

function setupCalculoEngrenagens() {
    // Configuração do campo 'aw' (Entre centros de trabalho)
    const awField = document.getElementById('aw');
    if (awField) {
        awField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                try {
                    updateTolerance();
                    const nextField = document.getElementById('alfa');
                    if (nextField) nextField.focus();
                } catch (error) {
                    console.error('Erro ao calcular tolerância:', error);
                }
            }
        });
    }

    // Configuração completa para todos os campos
    const camposConfig = [
        { id: 'mn', next: 'z1' },
        { id: 'z1', next: 'z2' },
        { 
            id: 'z2',
            next: 'aw',
            onEnter: calcularReducao
        },
        { 
            id: 'aw',
            next: 'alfa',
            onEnter: updateTolerance
        },
        { id: 'alfa', next: 'beta' },
        { 
            id: 'beta',
            next: 'x1',
            onEnter: function() {
                if (calcularSomaCorrecoes()) {
                    calcularZv1eX1();
                }
            }
        },
        { 
            id: 'x1',
            next: 'grauTolerancia',
            onEnter: calcularX2
        },
        { 
            id: 'grauTolerancia',
            next: 'desvioPermitido',
            onEnter: updateTolerance,
            isSelect: true
        },
        { 
            id: 'desvioPermitido',
            next: 'toleranciaCentros',
            onEnter: updateTolerance,
            isSelect: true
        },
        { 
            id: 'toleranciaCentros',
            onEnter: calcularTudo
        }
    ];

    // Configura os eventos para todos os campos
    camposConfig.forEach(campo => {
        const element = document.getElementById(campo.id);
        if (element) {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    try {
                        if (campo.onEnter) campo.onEnter();
                        if (campo.next) {
                            const nextElement = document.getElementById(campo.next);
                            if (nextElement) {
                                nextElement.focus();
                                if (campo.isSelect) {
                                    nextElement.size = nextElement.options.length;
                                    setTimeout(() => nextElement.size = 1, 200);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Erro no campo ${campo.id}:`, error);
                    }
                }
            });
            
            if (campo.isSelect && campo.onEnter) {
                element.addEventListener('change', campo.onEnter);
            }
        }
    });

    // Eventos adicionais
    document.getElementById('beta').addEventListener('change', function() {
        if (calcularSomaCorrecoes()) calcularZv1eX1();
    });
    
    document.getElementById('somaXn').addEventListener('change', calcularZv1eX1);
    document.getElementById('x1').addEventListener('input', calcularX2);

    // Botões
    document.getElementById('btnReset').addEventListener('click', resetarCampos);
    document.getElementById('btnPDF').addEventListener('click', gerarPDF);
}

// Função para calcular e exibir a tolerância
function updateTolerance() {
    const awInput = document.getElementById('aw');
    const classeInput = document.getElementById('toleranciaCentros');
    
    if (!awInput || !classeInput) return;

    const aw = parseFloat(awInput.value) || 0;
    const classe = classeInput.value;

    try {
        const tolerance = window.getTolerance(aw);
        
        // Garante que os valores existem antes de formatar
        const formatValue = (value) => typeof value === 'number' ? value.toFixed(3) : '0.000';
        
        // Atualiza todos os campos de tolerância
        document.getElementById('tolerancia_positiva').textContent = formatValue(tolerance.positivo);
        document.getElementById('tolerancia_negativa').textContent = formatValue(tolerance.negativo);
        document.getElementById('aw_max').textContent = formatValue(aw + tolerance.upper) + ' mm';
        document.getElementById('aw_min').textContent = formatValue(aw + tolerance.lower) + ' mm';
        
    } catch (error) {
        console.error("Erro no cálculo de tolerância:", error);
        resetToleranceFields();
    }
}

function resetToleranceFields() {
    const fields = ['tolerancia_positiva', 'tolerancia_negativa', 'aw_max', 'aw_min'];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = '-';
    });
}

// Função para calcular a redução (Z2/Z1)
function calcularReducao() {
    const z1 = parseFloat(document.getElementById('z1').value) || 0;
    const z2 = parseFloat(document.getElementById('z2').value) || 0;

    if (z1 <= 0 || z2 <= 0) {
        alert("Os valores de Z1 e Z2 devem ser maiores que zero!");
        document.getElementById('z2').focus();
        return false;
    }

    const reducao = (z2 / z1).toFixed(4);
    document.getElementById('reducao').value = reducao;
    return true;
}

// Função para calcular a soma das correções (ΣX)
function calcularSomaCorrecoes() {
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const alfaN = parseFloat(document.getElementById('alfa').value) || 20;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const aw = parseFloat(document.getElementById('aw').value) || 0;
    const mn = parseFloat(document.getElementById('mn').value) || 0;

    if (mn <= 0 || aw <= 0 || beta === 0) {
        alert("Preencha os campos Módulo, Distância entre centros e Ângulo de inclinação primeiro!");
        document.getElementById('beta').focus();
        return false;
    }

    const alfaT = calcularAlfaT(alfaN, beta);
    const alfaTRad = alfaT * Math.PI / 180;
    const betaRad = beta * Math.PI / 180;

    const mt = mn / Math.cos(betaRad);
    const cosAlfaWt = ((z1 + z2) * mt) / (2 * aw) * Math.cos(alfaTRad);
    
    const alfaWtRad = Math.acos(cosAlfaWt);
    const alfaWt=alfaWtRad * 180 / Math.PI

    document.getElementById('alfaWt').textContent = alfaWt.toFixed(5);

    const somaXn = ((z1 + z2) * (invAlfa(alfaWt) - invAlfa(alfaT))) /
        (2 * Math.tan(alfaN * Math.PI / 180));

    document.getElementById('somaXn').value = somaXn.toFixed(5);
    return true;
}

// Função auxiliar para cálculo de ângulo de pressão transversal
function calcularAlfaT(alfaN, beta) {
    const betaRad = beta * Math.PI / 180;
    const alfaNRad = alfaN * Math.PI / 180;
    return Math.atan(Math.tan(alfaNRad) / Math.cos(betaRad)) * 180 / Math.PI;
}

// Função auxiliar para cálculo de involuta
function invAlfa(anguloGraus) {
    const anguloRad = anguloGraus * Math.PI / 180;
    return Math.tan(anguloRad) - anguloRad;
}

// Função para calcular número de dentes virtuais e coeficientes de correção
function calcularZv1eX1() {
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const somaXn = parseFloat(document.getElementById('somaXn').value) || 0;

    if (z1 > 0 && z2 > 0 && beta !== 0 && somaXn !== 0) {
        const zv1 = calcularzv1(z1, beta);
        
        // Cálculo para deslizamento específico
        const x1ap = calcularx1a(zv1, z1, z2, somaXn);
        document.getElementById('x1ap').value = x1ap.toFixed(5);
        
        // Cálculo para igualdade de resistência à flexão
        const x1bp = calcularX1ResistenciaFlexao(z1, z2, somaXn);
        document.getElementById('x1bp').value = x1bp.toFixed(5);

        document.getElementById('zv1').textContent = zv1.toFixed(5);
    } else {
        document.getElementById('zv1').textContent = '-';
        document.getElementById('x1ap').value = '';
        document.getElementById('x1bp').value = '';
    }
}

// Função auxiliar para cálculo de número de dentes virtuais
function calcularzv1(z1, beta) {
    const betaRad = beta * Math.PI / 180;
    return z1 / Math.pow(Math.cos(betaRad), 3);
}

// Função auxiliar para cálculo de coeficiente de correção (deslizamento específico)
function calcularx1a(zv1, z1, z2, somaXn) {
    const u = z2 / z1;
    return (1 / Math.sqrt(zv1)) * (1 - 1 / u) + (somaXn / (1 + u));
}

// Função auxiliar para cálculo de coeficiente de correção (resistência à flexão)
function calcularX1ResistenciaFlexao(z1, z2, somaXn) {
    const u = z2 / z1;
    return 0.5 * (1 - (1 / u)) + (somaXn / (1 + u));
}

function calcularCoeficienteRebaixamento() {
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const mn = parseFloat(document.getElementById('mn').value) || 0;
    const aw = parseFloat(document.getElementById('aw').value) || 0;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const somax = parseFloat(document.getElementById('somaXn').value) || 0;

    let rebk = 0;

    if (z1 > 0) {
        const betaRad = beta * Math.PI / 180;
        const a = 0.5 * mn * (z1 + z2) / Math.cos(betaRad);
        rebk = somax - ((aw - a) / mn);
    }

    if (rebk < 0) {
        rebk = 0;
    }

    // Atualiza o span correto
    document.getElementById('rebk').textContent = rebk.toFixed(4);
}


// Função para calcular X2
function calcularX2() {
    const somaXn = parseFloat(document.getElementById('somaXn').value) || 0;
    const x1 = parseFloat(document.getElementById('x1').value) || 0;
    
    if (somaXn !== 0) {
        const x2 = somaXn - x1;
        document.getElementById('x2').value = x2.toFixed(5);
    } else {
        document.getElementById('x2').value = '';
    }
}

// Função para calcular todos os parâmetros
function calcularTudo() {
    const mn = parseFloat(document.getElementById('mn').value) || 0;
    const z1 = parseInt(document.getElementById('z1').value) || 0;
    const z2 = parseInt(document.getElementById('z2').value) || 0;
    const aw = parseFloat(document.getElementById('aw').value) || 0;
    const alfaN = parseFloat(document.getElementById('alfa').value) || 20;
    const beta = parseFloat(document.getElementById('beta').value) || 0;
    const x1 = parseFloat(document.getElementById('x1').value) || 0;

    // Validação básica
    if (mn <= 0 || z1 <= 0 || z2 <= 0 || aw <= 0) {
        alert("Preencha os campos obrigatórios antes de calcular!");
        return;
    }

    // Cálculo de ângulos
    const alfaT = calcularAlfaT(alfaN, beta);
    document.getElementById('alfaT').textContent = alfaT.toFixed(5) + '°';

    const betaRad = beta * Math.PI / 180;
    const alfaTRad = alfaT * Math.PI / 180;

    // Cálculos básicos de diâmetros
    const d1 = (mn * z1) / Math.cos(betaRad);
    const d2 = (mn * z2) / Math.cos(betaRad);
    document.getElementById('d1').textContent = d1.toFixed(3) + ' mm';
    document.getElementById('d2').textContent = d2.toFixed(3) + ' mm';

    const db1 = d1 * Math.cos(alfaTRad);
    const db2 = d2 * Math.cos(alfaTRad);
    document.getElementById('db1').textContent = db1.toFixed(3) + ' mm';
    document.getElementById('db2').textContent = db2.toFixed(3) + ' mm';

    // Cálculo de passos
    const pn = Math.PI * mn;
    const pt = pn / Math.cos(betaRad);
    document.getElementById('pn').textContent = pn.toFixed(4) + ' mm';
    document.getElementById('pt').textContent = pt.toFixed(4) + ' mm';

    // Cálculo de ΣX
    const y = (aw / mn) - ((z1 + z2) / (2 * Math.cos(betaRad)));
    document.getElementById('y').textContent = y.toFixed(6);

    // const numerador = Math.cos(alfaTRad);
    // const denominador = (2 * y * Math.cos(betaRad)) + (z1 + z2);
    // const alfaWtRad = Math.acos((numerador / denominador) * Math.cos(alfaTRad));
    // const alfaWt = alfaWtRad * 180 / Math.PI;
    // document.getElementById('alfaWt').textContent = alfaWt.toFixed(4) + '°';

    // const somaXn = ((z1 + z2) * (invAlfa(alfaWtRad) - invAlfa(alfaT))) / (2 * Math.tan(alfaN * Math.PI / 180));
    // document.getElementById('somaXn').value = somaXn.toFixed(5);

    // Cálculos de X₁
    // const zv1 = calcularzv1(z1, beta);
    // const x1ap = calcularx1a(zv1, z1, z2, somaXn);
    // const x1bp = calcularX1ResistenciaFlexao(z1, z2, somaXn);
    
    // document.getElementById('zv1').textContent = zv1.toFixed(5);
    // document.getElementById('x1ap').value = x1ap.toFixed(5);
    // document.getElementById('x1bp').value = x1bp.toFixed(5);

    // Cálculo de X₂
    // const x2 = (somaXn - x1).toFixed(5);
    // document.getElementById('x2').value = x2;

    calcularCoeficienteRebaixamento();

    // Cálculos adicionais de dimensões
    const dw1 = db1 / Math.cos(alfaWtRad);
    const dw2 = db2 / Math.cos(alfaWtRad);
    document.getElementById('dw1').textContent = dw1.toFixed(3) + ' mm';
    document.getElementById('dw2').textContent = dw2.toFixed(3) + ' mm';

    const ha1 = (1 + y - parseFloat(x2)) * mn;
    const ha2 = (1 + y - x1ap) * mn;
    document.getElementById('ha1').textContent = ha1.toFixed(3) + ' mm';
    document.getElementById('ha2').textContent = ha2.toFixed(3) + ' mm';

    const h = (2.25 + y - (x1ap + parseFloat(x2))) * mn;
    document.getElementById('h').textContent = h.toFixed(3) + ' mm';

    const da1 = d1 + (2 * ha1);
    const da2 = d2 + (2 * ha2);
    document.getElementById('da1').textContent = da1.toFixed(3) + ' mm';
    document.getElementById('da2').textContent = da2.toFixed(3) + ' mm';

    const df1 = da1 - (2 * h);
    const df2 = da2 - (2 * h);
    document.getElementById('df1').textContent = df1.toFixed(3) + ' mm';
    document.getElementById('df2').textContent = df2.toFixed(3) + ' mm';

    // Atualiza outros cálculos
    // calcularReducao();
    // calcularZv1eX1();
    // updateTolerance();
}

// Função para resetar todos os campos
function resetarCampos() {
    if (confirm('Tem certeza que deseja resetar todos os valores?')) {
        document.querySelectorAll('input:not([readonly])').forEach(input => {
            input.value = '';
        });

        document.querySelectorAll('.resultado-calculado').forEach(input => {
            input.value = '';
        });

        document.querySelectorAll('span[id]').forEach(span => {
            span.textContent = '-';
        });

        // Valores padrão
        document.getElementById('alfa').value = '20';
        document.getElementById('grauTolerancia').value = '25';
        document.getElementById('desvioPermitido').value = 'cd';
    }
}

// Função para gerar PDF (placeholder)
function gerarPDF() {
    alert('Funcionalidade de PDF será implementada aqui.');
}