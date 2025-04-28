/**
 * Tabela de tolerâncias para dimensões lineares (ISO 286)
 * Valores em micrômetros (µm).
 * Substitui a tabela anterior de distância entre centros.
 */
const toleranceTable = [
    // min   max     IT6   IT7    IT8
    { min: 0,    max: 3,    IT6: 6,   IT7: 10,  IT8: 14   },
    { min: 3,    max: 6,    IT6: 8,   IT7: 12,  IT8: 18   },
    { min: 6,    max: 10,   IT6: 9,   IT7: 15,  IT8: 22   },
    { min: 10,   max: 18,   IT6: 11,  IT7: 18,  IT8: 27   },
    { min: 18,   max: 30,   IT6: 13,  IT7: 21,  IT8: 33   },
    { min: 30,   max: 50,   IT6: 16,  IT7: 25,  IT8: 39   },
    { min: 50,   max: 80,   IT6: 19,  IT7: 30,  IT8: 46   },
    { min: 80,   max: 120,  IT6: 22,  IT7: 35,  IT8: 54   },
    { min: 120,  max: 180,  IT6: 25,  IT7: 40,  IT8: 63   },
    { min: 180,  max: 250,  IT6: 29,  IT7: 46,  IT8: 72   },
    { min: 250,  max: 315,  IT6: 32,  IT7: 52,  IT8: 81   },
    { min: 315,  max: 400,  IT6: 36,  IT7: 57,  IT8: 89   },
    { min: 400,  max: 500,  IT6: 40,  IT7: 63,  IT8: 97   },
    { min: 500,  max: 630,  IT6: 44,  IT7: 70,  IT8: 110  },
    { min: 630,  max: 800,  IT6: 50,  IT7: 80,  IT8: 125  },
    { min: 800,  max: 1000, IT6: 56,  IT7: 90,  IT8: 140  },
    { min: 1000, max: 1250, IT6: 66,  IT7: 105, IT8: 165  },
    { min: 1250, max: 1600, IT6: 78,  IT7: 125, IT8: 195  },
    { min: 1600, max: 2000, IT6: 92,  IT7: 150, IT8: 230  },
    { min: 2000, max: 2500, IT6: 110, IT7: 175, IT8: 280  },
    { min: 2500, max: 3150, IT6: 135, IT7: 210, IT8: 330  }
];

/**
 * Calcula os valores de tolerância dimensional
 * @param {number} dimension - Dimensão em mm
 * @param {string} toleranceClass - Classe de tolerância (h6, h7, js6, js7, etc.)
 * @returns {Object} { positivo: number, negativo: number, lower: number, upper: number } em mm
 */
function calcularTolerancia(dimension, toleranceClass) {
    if (!dimension || !toleranceClass) {
        return { 
            positivo: 0, 
            negativo: 0, 
            lower: 0, 
            upper: 0 
        };
    }

    // Encontra a faixa de tamanho
    const faixa = toleranceTable.find(r => dimension >= r.min && dimension < r.max);
    if (!faixa) return { positivo: 0, negativo: 0, lower: 0, upper: 0 };

    // Extrai o valor IT
    const itGrade = "IT" + (toleranceClass.match(/\d+/)?.[0] || '8');
    const valorIT = faixa[itGrade] || faixa['IT8'];
    const valorMM = valorIT / 1000; // Converte µm para mm

    // Calcula os valores conforme a classe
    if (toleranceClass.startsWith('h')) {
        return {
            positivo: 0,
            negativo: valorMM,
            lower: -valorMM,
            upper: 0
        };
    } else if (toleranceClass.startsWith('js')) {
        const metade = valorMM / 2;
        return {
            positivo: metade,
            negativo: -metade,
            lower: -metade,
            upper: metade
        };
    } else {
        return {
            positivo: valorMM,
            negativo: -valorMM,
            lower: -valorMM,
            upper: valorMM
        };
    }
}

// Exporta a função para uso global
if (typeof window !== 'undefined') {
    window.getTolerance = function(dimension) {
        const toleranceClass = document.getElementById('toleranciaCentros')?.value || 'h8';
        return calcularTolerancia(dimension, toleranceClass);
    };
}