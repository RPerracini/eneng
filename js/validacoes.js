// js/validacoes.js
// Contém lógica de validação de formulário (campos obrigatórios, valores > 0, selects, etc.)

/**
 * Verifica se todos os campos obrigatórios estão preenchidos corretamente.
 * - <select>: não permite valor “Selecione” ou string vazia
 * - Inputs numéricos específicos: valor deve ser > 0
 *
 * @returns {boolean} true se todos válidos, false caso contrário
 */
export function camposPreenchidosEValidos() {
    const obrigatorios = [
        'mn',
        'z1',
        'z2',
        'aw',
        'alfa',
        'beta',
        'adendo',
        'dedendo',
        'x1',
        'larguraPinhao',
        'larguraCoroa',
        'toleranciaCentros',
        'grauTolerancia',
        'desvioPermitido',
    ];
    let valid = true;

    obrigatorios.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) {
            valid = false;
            return;
        }
        if (el.type === 'select-one') {
            if (!el.value || el.value === '' || el.value === 'Selecione')
                valid = false;
        } else if (el.value === '' || el.value == null) {
            valid = false;
        }
        // Campos numéricos que devem ser > 0
        if (
            [
                'mn',
                'z1',
                'z2',
                'aw',
                'alfa',
                'beta',
                'larguraPinhao',
                'larguraCoroa',
            ].includes(id)
        ) {
            if (parseFloat(el.value) <= 0) valid = false;
        }
    });

    return valid;
}
