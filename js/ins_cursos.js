document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('meuFormulario');
    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }

    const btnEnviar = document.getElementById('enviar');
    // const mensagemSucesso = document.getElementById('mensagem-sucesso');

    // Configuração inicial do botão
    btnEnviar.style.transition = 'opacity 0.3s ease';
    btnEnviar.style.opacity = '0.6';
    btnEnviar.style.cursor = 'not-allowed';
    btnEnviar.disabled = true;

    const bandeiras = {
        54: 'https://flagcdn.com/w20/ar.png',
        55: 'https://flagcdn.com/w20/br.png',
        56: 'https://flagcdn.com/w20/cl.png',
        57: 'https://flagcdn.com/w20/co.png',
        591: 'https://flagcdn.com/w20/bo.png',
        506: 'https://flagcdn.com/w20/cr.png',
        593: 'https://flagcdn.com/w20/ec.png',
        503: 'https://flagcdn.com/w20/sv.png',
        502: 'https://flagcdn.com/w20/gt.png',
        592: 'https://flagcdn.com/w20/gy.png',
        509: 'https://flagcdn.com/w20/ht.png',
        504: 'https://flagcdn.com/w20/hn.png',
        1876: 'https://flagcdn.com/w20/jm.png',
        505: 'https://flagcdn.com/w20/ni.png',
        507: 'https://flagcdn.com/w20/pa.png',
        595: 'https://flagcdn.com/w20/py.png',
        51: 'https://flagcdn.com/w20/pe.png',
        1787: 'https://flagcdn.com/w20/pr.png',
        597: 'https://flagcdn.com/w20/sr.png',
        598: 'https://flagcdn.com/w20/uy.png',
        58: 'https://flagcdn.com/w20/ve.png',
    };

    function atualizarBandeira(select) {
        const codigo = select.value;
        const bandeira = bandeiras[codigo];
        if (bandeira) {
            select.style.backgroundImage = `url(${bandeira})`;
        } else {
            select.style.backgroundImage = 'none';
        }
    }

    function configurarBandeiras() {
        document.querySelectorAll('.ddi-select').forEach((select) => {
            select.addEventListener('change', () => atualizarBandeira(select));
            atualizarBandeira(select);
        });
    }

    function verificarCamposPreenchidos() {
        const nomeValido = form.elements.nome?.value.trim() !== '';
        const emailValido = form.elements.email?.value.trim() !== '';

        const whatsappDDIValido = form.elements.ddi_whatsapp?.value !== '';
        const whatsappNumeroValido =
            form.elements.whatsapp?.value.replace(/\D/g, '').length >= 8;

        const empresaValida = form.elements.empresa?.value.trim() !== '';
        const funcaoValida = form.elements.funcao?.value.trim() !== '';

        const experienciaValida = [...(form.elements.experiencia || [])].some(
            (radio) => radio.checked
        );

        const todosPreenchidos =
            nomeValido &&
            emailValido &&
            whatsappDDIValido &&
            whatsappNumeroValido &&
            empresaValida &&
            funcaoValida &&
            experienciaValida;

        btnEnviar.disabled = !todosPreenchidos;
        btnEnviar.style.opacity = btnEnviar.disabled ? '0.6' : '1';
        btnEnviar.style.cursor = btnEnviar.disabled ? 'not-allowed' : 'pointer';
    }

    // Configurar eventos para todos os campos
    const eventos = ['input', 'change', 'paste'];

    Array.from(form.elements).forEach((element) => {
        if (
            element.tagName === 'INPUT' ||
            element.tagName === 'SELECT' ||
            element.tagName === 'TEXTAREA'
        ) {
            eventos.forEach((evento) => {
                element.addEventListener(evento, verificarCamposPreenchidos);
            });
        }
    });

    // Eventos específicos para radios de experiência
    const radiosExperiencia = form.elements.experiencia;
    if (radiosExperiencia) {
        Array.from(radiosExperiencia).forEach((radio) => {
            eventos.forEach((evento) => {
                radio.addEventListener(evento, verificarCamposPreenchidos);
            });
        });
    }

    // formatarTelefone(document.getElementById('whatsapp'));
    configurarBandeiras();

    // Verificação inicial
    verificarCamposPreenchidos();

    // Não é necessário usar `fetch` ou AJAX, já que o FormSubmit cuida disso.
    // O formulário será enviado diretamente quando o usuário clicar no botão "Enviar".

    // Configurar envio do formulário - VERSÃO CORRIGIDA
    form.addEventListener('submit', function (e) {
        // Não faz nada com `e.preventDefault()`, já que o FormSubmit lida com o envio do formulário
        if (btnEnviar.disabled) return;

        // Mostrar mensagem de sucesso imediatamente
        mensagemSucesso.style.display = 'block';
        mensagemSucesso.style.opacity = '1';
    });
});
