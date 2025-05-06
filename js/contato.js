document.addEventListener('DOMContentLoaded', function () {
    // Elementos do formulário
    const form = document.getElementById('meuFormulario');
    const btnEnviar = document.getElementById('enviar');
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    const btnReset = document.getElementById('resetar');
    const arquivoInput = document.getElementById('arquivo');
    const fileInfo = document.getElementById('file-info');

    // Configuração inicial do botão de envio
    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.style.opacity = '0.6';
        btnEnviar.style.cursor = 'not-allowed';
    }

    // Função para atualizar bandeiras nos selects de telefone/whatsapp
    const bandeiras = {
        54: 'https://flagcdn.com/w20/ar.png', // Argentina
        55: 'https://flagcdn.com/w20/br.png', // Brasil
        56: 'https://flagcdn.com/w20/cl.png', // Chile
        57: 'https://flagcdn.com/w20/co.png', // Colômbia
        591: 'https://flagcdn.com/w20/bo.png', // Bolívia
        506: 'https://flagcdn.com/w20/cr.png', // Costa Rica
        593: 'https://flagcdn.com/w20/ec.png', // Equador
        503: 'https://flagcdn.com/w20/sv.png', // El Salvador
        502: 'https://flagcdn.com/w20/gt.png', // Guatemala
        592: 'https://flagcdn.com/w20/gy.png', // Guiana
        509: 'https://flagcdn.com/w20/ht.png', // Haiti
        504: 'https://flagcdn.com/w20/hn.png', // Honduras
        1876: 'https://flagcdn.com/w20/jm.png', // Jamaica
        505: 'https://flagcdn.com/w20/ni.png', // Nicarágua
        507: 'https://flagcdn.com/w20/pa.png', // Panamá
        595: 'https://flagcdn.com/w20/py.png', // Paraguai
        51: 'https://flagcdn.com/w20/pe.png', // Peru
        1787: 'https://flagcdn.com/w20/pr.png', // Porto Rico
        597: 'https://flagcdn.com/w20/sr.png', // Suriname
        598: 'https://flagcdn.com/w20/uy.png', // Uruguai
        58: 'https://flagcdn.com/w20/ve.png', // Venezuela
    };

    // Função para atualizar bandeira
    function atualizarBandeira(select) {
        const codigo = select.value;
        const bandeira = bandeiras[codigo];
        select.style.backgroundImage = bandeira ? `url(${bandeira})` : 'none';
    }

    // Função para formatar o telefone
    function formatarTelefone(input) {
        if (!input) return;

        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '$1 $2-$3');
            }
            e.target.value = value;
            verificarCamposPreenchidos();
        });
    }

    // Função para validar o email
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função para verificar se todos os campos estão preenchidos
    function verificarCamposPreenchidos() {
        const nome = form.elements.nome?.value.trim() !== '';
        const email = validarEmail(form.elements.email?.value.trim());
        const whatsapp =
            form.elements.whatsapp?.value.replace(/\D/g, '').length >= 8;
        const mensagem = form.elements.mensagem?.value.trim() !== '';

        // Verifique se todos os campos estão preenchidos corretamente
        const todosValidos = nome && email && whatsapp && mensagem;

        if (btnEnviar) {
            btnEnviar.disabled = !todosValidos;
            btnEnviar.style.opacity = todosValidos ? '1' : '0.6';
            btnEnviar.style.cursor = todosValidos ? 'pointer' : 'not-allowed';
        }

        return todosValidos;
    }

    // Validação em tempo real
    form.addEventListener('input', verificarCamposPreenchidos);
    form.addEventListener('change', verificarCamposPreenchidos);

    // Envio do formulário via fetch
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Previne o envio tradicional

        // Verifica se todos os campos estão validados
        if (!verificarCamposPreenchidos()) {
            return; // Se os campos não estiverem validados, não envia o formulário
        }

        // Desabilita o botão de envio e muda o texto
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        // Envia os dados do formulário para o servidor
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
        })
            .then((response) => {
                if (response.ok) {
                    window.location.href = form._next.value; // Redireciona para a página de agradecimento
                } else {
                    console.error('Erro ao enviar o formulário');
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = 'Tentar novamente';
                }
            })
            .catch((error) => {
                console.error('Erro no envio do formulário', error);
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'Tentar novamente';
            });
    });

    // Validação inicial ao carregar a página
    verificarCamposPreenchidos();

    // Manipulação de arquivos
    if (arquivoInput && fileInfo) {
        arquivoInput.addEventListener('change', function () {
            if (this.files[0]) {
                if (this.files[0].size > 5 * 1024 * 1024) {
                    alert(
                        'Arquivo muito grande! Tamanho máximo permitido: 5MB.'
                    );
                    this.value = '';
                    fileInfo.textContent = 'Nenhum arquivo selecionado';
                } else {
                    fileInfo.textContent = this.files[0].name;
                }
            } else {
                fileInfo.textContent = 'Nenhum arquivo selecionado';
            }
            verificarCamposPreenchidos();
        });
    }

    // Função para resetar o arquivo e bandeira
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            fileInfo.textContent = 'Nenhum arquivo selecionado';
            document.querySelectorAll('.ddi-select').forEach((select) => {
                select.style.backgroundImage = 'none';
            });
        });
    }

    // Configurações das bandeiras para os selects
    document.querySelectorAll('.ddi-select').forEach((select) => {
        select.addEventListener('change', () => atualizarBandeira(select));
        atualizarBandeira(select);
    });

    // Formatação do telefone
    formatarTelefone(document.getElementById('whatsapp'));
});
