const camposConfig = [
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
        next: 'x1',  // Passa para o campo de tratamento térmico
    },
    {
        id: 'x1',
        next: 'larguraPinhao',  // Depois da escolha do tratamento, vai para 'larguraPinhao'
        onEnter: () => {
            calcularD1();
            calcularD2();
            calcularCoeficienteRebaixamento();
            calcularDaMaximo();
            calcularEspessurasSa();
            calcularEspessuraMinimaPermitida();
            calcularX2();
            highlightLimites();
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
    // id: 'zw2_adotado',
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
    const element = document.getElementById(campo.id);
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
                const nextEl = document.getElementById(campo.next);
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