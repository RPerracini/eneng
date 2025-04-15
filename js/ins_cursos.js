document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('meuFormulario');
    if (!form) return;

    const btnEnviar = document.getElementById('enviar');
    const btnInstrucoes = document.getElementById('btn-instrucoes');
    const modal = document.getElementById('modal-instrucoes');
    const spanFechar = document.querySelector('.fechar-modal');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');

    btnEnviar.style.transition = 'opacity 0.3s ease';
    btnEnviar.style.opacity = '0.6';
    btnEnviar.style.cursor = 'not-allowed';
    btnEnviar.disabled = true;

     const bandeiras = {
        '54': 'https://flagcdn.com/w20/ar.png',
        '55': 'https://flagcdn.com/w20/br.png',
        '56': 'https://flagcdn.com/w20/cl.png',
        '57': 'https://flagcdn.com/w20/co.png',
        '591': 'https://flagcdn.com/w20/bo.png',
        '506': 'https://flagcdn.com/w20/cr.png',
        '593': 'https://flagcdn.com/w20/ec.png',
        '503': 'https://flagcdn.com/w20/sv.png',
        '502': 'https://flagcdn.com/w20/gt.png',
        '592': 'https://flagcdn.com/w20/gy.png',
        '509': 'https://flagcdn.com/w20/ht.png',
        '504': 'https://flagcdn.com/w20/hn.png',
        '1876': 'https://flagcdn.com/w20/jm.png',
        '505': 'https://flagcdn.com/w20/ni.png',
        '507': 'https://flagcdn.com/w20/pa.png',
        '595': 'https://flagcdn.com/w20/py.png',
        '51': 'https://flagcdn.com/w20/pe.png',
        '1787': 'https://flagcdn.com/w20/pr.png',
        '597': 'https://flagcdn.com/w20/sr.png',
        '598': 'https://flagcdn.com/w20/uy.png',
        '58': 'https://flagcdn.com/w20/ve.png'
    };

    function atualizarBandeira(select) {
        const codigo = select.value;
        const bandeira = bandeiras[codigo];
        if (bandeira) {
            select.style.backgroundImage = `url(${bandeira})`;  // Note as crases
        } else {
            select.style.backgroundImage = 'none';
        }
    }

    function configurarBandeiras() {
        document.querySelectorAll('.ddi-select').forEach(select => {
            // Atualiza ao mudar seleção
            select.addEventListener('change', () => atualizarBandeira(select));
            
            // Atualiza inicialmente
            atualizarBandeira(select);
        });
    }

    btnInstrucoes.addEventListener('click', () => modal.style.display = 'block');
    spanFechar.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    function formatarTelefone(input) {
        if (!input) return;

        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '$1 $2-$3');
            }
            
            e.target.value = value;
            verificarCamposPreenchidos();
        });
    }

    function verificarCamposPreenchidos() {
        const camposObrigatorios = [
            form.elements.nome?.value.trim(),
            form.elements.email?.value.trim(),
            form.elements.ddi_telefone?.value,
            form.elements.telefone?.value.replace(/\D/g, '').length >= 8,
            form.elements.ddi_whatsapp?.value,
            form.elements.whatsapp?.value.replace(/\D/g, '').length >= 8,
            form.elements.empresa?.value.trim(),
            form.elements.funcao?.value.trim(),
            [...form.elements.experiencia || []].some(radio => radio.checked)
        ];

        const todosPreenchidos = camposObrigatorios.every(campo => !!campo);
        
        btnEnviar.disabled = !todosPreenchidos;
        btnEnviar.style.opacity = btnEnviar.disabled ? '0.6' : '1';
        btnEnviar.style.cursor = btnEnviar.disabled ? 'not-allowed' : 'pointer';
    }

    const eventos = ['input', 'change', 'paste'];
    const camposParaMonitorar = [
        form.elements.nome,
        form.elements.email,
        form.elements.ddi_telefone,
        form.elements.telefone,
        form.elements.ddi_whatsapp,
        form.elements.whatsapp,
        form.elements.empresa,
        form.elements.funcao,
        ...(form.elements.experiencia || [])
    ];

    camposParaMonitorar.forEach(campo => {
        if (campo) {
            eventos.forEach(evento => {
                campo.addEventListener(evento, verificarCamposPreenchidos);
            });
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (btnEnviar.disabled) return;
        
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        setTimeout(() => {
            mensagemSucesso.style.display = 'block';
            mensagemSucesso.style.opacity = '1';

            setTimeout(() => {
                mensagemSucesso.style.opacity = '0';
                setTimeout(() => {
                    mensagemSucesso.style.display = 'none';
                }, 500);
            }, 3000);

            form.reset();
            btnEnviar.textContent = 'Enviar Inscrição';
            verificarCamposPreenchidos();
        }, 1500);
    });

    formatarTelefone(document.getElementById('telefone'));
    formatarTelefone(document.getElementById('whatsapp'));
    configurarBandeiras();
    verificarCamposPreenchidos();
});