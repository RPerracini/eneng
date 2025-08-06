/**
 * calculos-geometria.js
 * Contém todas as funções matemáticas relacionadas a cálculos de engrenagens.
 */

/**
 * Exemplo de função que calcula ângulo de pressão transversal α_t
 */
export function calcularAlfaT(alfaN, beta) {
    const betaRad = (beta * Math.PI) / 180;
    const alfaNRad = (alfaN * Math.PI) / 180;
    return (Math.atan(Math.tan(alfaNRad) / Math.cos(betaRad)) * 180) / Math.PI;
}

/**
 * Exemplo de função involuta
 */
export function invAlfa(anguloGraus) {
    const anguloRad = (anguloGraus * Math.PI) / 180;
    return Math.tan(anguloRad) - anguloRad;
}

/**
 * Calcula o diâmetro primitivo (referência) d = (m_n * Z) / cos(β)
 */
export function calcularD1(mn, z, beta) {
    const betaRad = (beta * Math.PI) / 180;
    return (mn * z) / Math.cos(betaRad);
}

/**
 * Calcula a redução (Z2 / Z1)
 */
export function calcularReducao(z1, z2) {
    return z2 / z1;
}

/**
 * Calcula ΣX e α_wt. Retorna { alfaWt, somaXn }.
 * ATENÇÃO: ASSINATURA recebe um OBJETO.
 */
export function calcularSomaCorrecoes({ z1, z2, alfaN, beta, aw, mn }) {
    // Se algum parâmetro faltar, lançamos erro para depuração
    if (![z1, z2, alfaN, beta, aw, mn].every((x) => typeof x === 'number')) {
        throw new Error('Parâmetros inválidos em calcularSomaCorrecoes');
    }

    const betaRad = (beta * Math.PI) / 180;
    const alfaT = calcularAlfaT(alfaN, beta);
    const alfaTRad = (alfaT * Math.PI) / 180;

    const mt = mn / Math.cos(betaRad);
    const cosAlfaWt = (((z1 + z2) * mt) / (2 * aw)) * Math.cos(alfaTRad);
    const alfaWtRad = Math.acos(cosAlfaWt);
    const alfaWt = (alfaWtRad * 180) / Math.PI;

    const somaXn =
        ((z1 + z2) * (invAlfa(alfaWt) - invAlfa(alfaT))) /
        (2 * Math.tan((alfaN * Math.PI) / 180));

    return { alfaWt, somaXn };
}

/**
 * Calcula número de dentes virtuais Z_v1 = Z1 / cos³(β)
 */
export function calcularZv1(z1, beta) {
    const betaRad = (beta * Math.PI) / 180;
    return z1 / Math.pow(Math.cos(betaRad), 3);
}

/**
 * Calcula número de dentes virtuais Z_v2 = Z2 / cos³(β)
 */
export function calcularZv2(z2, beta) {
    const betaRad = (beta * Math.PI) / 180;
    return z2 / Math.pow(Math.cos(betaRad), 3);
}

/**
 * Coeficiente de correção (específico)
 */
export function calcularX1a(zv1, z1, z2, somaXn) {
    const u = z2 / z1;
    return (1 / Math.sqrt(zv1)) * (1 - 1 / u) + somaXn / (1 + u);
}

/**
 * Coeficiente de correção (resistência à flexão)
 */
export function calcularX1ResistenciaFlexao(z1, z2, somaXn) {
    const u = z2 / z1;
    return 0.5 * (1 - 1 / u) + somaXn / (1 + u);
}

/**
 * Coeficiente de rebaixamento
 */
export function calcularCoeficienteRebaixamento({
    z1,
    z2,
    mn,
    aw,
    beta,
    somaXn,
}) {
    let rebk = 0;
    if (z1 > 0) {
        const betaRad = (beta * Math.PI) / 180;
        const a = (0.5 * mn * (z1 + z2)) / Math.cos(betaRad);
        rebk = somaXn - (aw - a) / mn;
    }
    return rebk < 0 ? 0 : rebk;
}

/**
 * Calcula X mínimo para evitar undercut
 */
export function calcularXminUndercut(z, alfaN, beta) {
    const betaRad = (beta * Math.PI) / 180;
    const alfaNRad = (alfaN * Math.PI) / 180;

    // Número de dentes equivalente normalizado
    const z_nx = z / Math.pow(Math.cos(betaRad), 3);

    // sin²(α_n)
    const sinAlphaN2 = Math.pow(Math.sin(alfaNRad), 2);

    // Fórmula de correção mínima crítica
    const xMin = 1 - (z_nx * sinAlphaN2) / 2;

    return xMin;
}

export function calcularX1ag(z1, z2, somaXn) {
    const u = z2 / z1;
    return (1 / 3) * (1 - 1 / u) + somaXn / (1 + u);
}
