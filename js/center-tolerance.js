/**
 * center-tolerance.js
 * Tabela de tolerâncias para dimensões lineares (ISO 286)
 * Valores em micrômetros (µm).
 */

const toleranceTable = [
    // min   max     IT6   IT7    IT8    IT9    IT10   IT11
    { min: 0, max: 3, IT6: 6, IT7: 10, IT8: 14, IT9: 25, IT10: 40, IT11: 60 },
    { min: 3, max: 6, IT6: 8, IT7: 12, IT8: 18, IT9: 30, IT10: 48, IT11: 75 },
    { min: 6, max: 10, IT6: 9, IT7: 15, IT8: 22, IT9: 36, IT10: 58, IT11: 90 },
    {
        min: 10,
        max: 18,
        IT6: 11,
        IT7: 18,
        IT8: 27,
        IT9: 43,
        IT10: 70,
        IT11: 110,
    },
    {
        min: 18,
        max: 30,
        IT6: 13,
        IT7: 21,
        IT8: 33,
        IT9: 52,
        IT10: 84,
        IT11: 130,
    },
    {
        min: 30,
        max: 50,
        IT6: 16,
        IT7: 25,
        IT8: 39,
        IT9: 62,
        IT10: 100,
        IT11: 160,
    },
    {
        min: 50,
        max: 80,
        IT6: 19,
        IT7: 30,
        IT8: 46,
        IT9: 74,
        IT10: 120,
        IT11: 190,
    },
    {
        min: 80,
        max: 120,
        IT6: 22,
        IT7: 35,
        IT8: 54,
        IT9: 87,
        IT10: 140,
        IT11: 220,
    },
    {
        min: 120,
        max: 180,
        IT6: 25,
        IT7: 40,
        IT8: 63,
        IT9: 100,
        IT10: 160,
        IT11: 250,
    },
    {
        min: 180,
        max: 250,
        IT6: 29,
        IT7: 46,
        IT8: 72,
        IT9: 115,
        IT10: 185,
        IT11: 290,
    },
    {
        min: 250,
        max: 315,
        IT6: 32,
        IT7: 52,
        IT8: 81,
        IT9: 130,
        IT10: 210,
        IT11: 330,
    },
    {
        min: 315,
        max: 400,
        IT6: 36,
        IT7: 57,
        IT8: 89,
        IT9: 140,
        IT10: 230,
        IT11: 360,
    },
    {
        min: 400,
        max: 500,
        IT6: 40,
        IT7: 63,
        IT8: 97,
        IT9: 155,
        IT10: 250,
        IT11: 390,
    },
    {
        min: 500,
        max: 630,
        IT6: 44,
        IT7: 70,
        IT8: 110,
        IT9: 175,
        IT10: 280,
        IT11: 440,
    },
    {
        min: 630,
        max: 800,
        IT6: 50,
        IT7: 80,
        IT8: 125,
        IT9: 200,
        IT10: 320,
        IT11: 500,
    },
    {
        min: 800,
        max: 1000,
        IT6: 56,
        IT7: 90,
        IT8: 140,
        IT9: 225,
        IT10: 360,
        IT11: 560,
    },
    {
        min: 1000,
        max: 1250,
        IT6: 66,
        IT7: 105,
        IT8: 165,
        IT9: 265,
        IT10: 420,
        IT11: 650,
    },
    {
        min: 1250,
        max: 1600,
        IT6: 78,
        IT7: 125,
        IT8: 195,
        IT9: 310,
        IT10: 500,
        IT11: 780,
    },
    {
        min: 1600,
        max: 2000,
        IT6: 92,
        IT7: 150,
        IT8: 230,
        IT9: 370,
        IT10: 600,
        IT11: 950,
    },
    {
        min: 2000,
        max: 2500,
        IT6: 110,
        IT7: 175,
        IT8: 280,
        IT9: 440,
        IT10: 700,
        IT11: 1100,
    },
    {
        min: 2500,
        max: 3150,
        IT6: 135,
        IT7: 210,
        IT8: 330,
        IT9: 520,
        IT10: 840,
        IT11: 1300,
    },
];

/**
 * Calcula os valores de tolerância dimensional
 * @param {number} dimension - Dimensão em mm
 * @param {string} toleranceClass - Classe de tolerância (js6 a js11)
 * @returns {Object} { positivo, negativo, lower, upper } em mm
 */
function calcularTolerancia(dimension, toleranceClass) {
    if (!dimension || !toleranceClass) {
        return { positivo: 0, negativo: 0, lower: 0, upper: 0 };
    }

    const faixa = toleranceTable.find(
        (r) => dimension >= r.min && dimension < r.max
    );
    if (!faixa) return { positivo: 0, negativo: 0, lower: 0, upper: 0 };

    const match = toleranceClass.match(/^js([6-9]|10|11)$/);
    if (!match) return { positivo: 0, negativo: 0, lower: 0, upper: 0 };

    const itGrade = 'IT' + match[1];
    const valorIT = faixa[itGrade];
    const valorMM = valorIT / 1000;

    const metade = valorMM / 2;
    return {
        positivo: metade,
        negativo: -metade,
        lower: -metade,
        upper: metade,
    };
}

// Exporta para uso no navegador
if (typeof window !== 'undefined') {
    window.getTolerance = function (dimension) {
        const toleranceClass =
            document.getElementById('toleranciaCentros')?.value || 'js8';
        return calcularTolerancia(dimension, toleranceClass);
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const inputDim = document.getElementById('aw'); // Entre centros
    const selectTol = document.getElementById('toleranciaCentros');
    const outputMin = document.getElementById('tolerancia_negativa');
    const outputMax = document.getElementById('tolerancia_positiva');
    const awMinField = document.getElementById('aw_min');
    const awMaxField = document.getElementById('aw_max');

    if (
        !inputDim ||
        !selectTol ||
        !outputMin ||
        !outputMax ||
        !awMinField ||
        !awMaxField
    ) {
        console.warn(
            '[center-tolerance.js] Elementos não encontrados. Verifique se o HTML tem os IDs corretos.'
        );
        return;
    }

    function calcularTolerancia(dimension, classe) {
        // Exemplo simples de cálculo (ajuste conforme sua tabela real)
        const classes = {
            js6: 0.003,
            js7: 0.006,
            js8: 0.01,
            js9: 0.016,
            js10: 0.025,
            js11: 0.04,
        };
        const valorBase = classes[classe] || 0.01;
        const desvio = dimension * valorBase;
        return {
            lower: -desvio,
            upper: desvio,
        };
    }

    function atualizarTolerancia() {
        const dimension = parseFloat(inputDim.value);
        const classe = selectTol.value;

        if (isNaN(dimension)) return;

        const resultado = calcularTolerancia(dimension, classe);

        outputMin.value = resultado.lower.toFixed(3);
        outputMax.value = resultado.upper.toFixed(3);
        awMinField.value = (dimension + resultado.lower).toFixed(3);
        awMaxField.value = (dimension + resultado.upper).toFixed(3);
    }

    inputDim.addEventListener('input', atualizarTolerancia);
    selectTol.addEventListener('change', atualizarTolerancia);

    atualizarTolerancia(); // Inicializa ao carregar
});
