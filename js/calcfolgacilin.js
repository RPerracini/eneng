document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCalc');
    const btnCalcular = document.getElementById('btnCalcular');

    // Desativa autocomplete para os campos específicos
    ['cliente', 'projeto', 'observacao'].forEach((id) => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.autocomplete = 'off';
            campo.autocorrect = 'off';
            campo.autocapitalize = 'off';
            campo.spellcheck = false;
        }
    });

    document.getElementById('deltaT').addEventListener('focus', function () {
        this.blur(); // Remove foco no deltaT
    });

    form.addEventListener('submit', (e) => e.preventDefault());

    const camposEditaveis = Array.from(
        form.querySelectorAll('.coluna-dados input, .coluna-dados select')
    ).filter(
        (campo) =>
            !campo.disabled && !campo.readOnly && campo.offsetParent !== null
    );

    // Função auxiliar para verificar campos obrigatórios
    function todosCamposObrigatoriosPreenchidos() {
        return camposObrigatorios.every((id) => {
            const campo = document.getElementById(id);
            return campo && campo.value.trim() !== '';
        });
    }

    camposEditaveis.forEach((campo, index) => {
        campo.addEventListener('input', () => {
            limparCamposSaida();
        });

        campo.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const proximo = camposEditaveis[index + 1];
                if (proximo) {
                    proximo.focus();
                    if (proximo.tagName === 'INPUT') proximo.select();
                } else {
                    verificarCampos();
                    if (!btnCalcular.disabled) {
                        btnCalcular.focus();
                        btnCalcular.classList.add('pulsar');
                    }
                }
            }
        });
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        form.reset();
        limparCamposSaida();
        btnCalcular.classList.remove('pulsar');
        verificarCampos();
    });

    // Configuração do campo rotação com cálculo automático ao pressionar Enter
    document.getElementById('rotacao').addEventListener('input', function () {
        const rotacao = parseFloat(this.value);
        let delta = 0;
        if (!isNaN(rotacao)) {
            if (rotacao <= 300) delta = 10;
            else if (rotacao <= 1200) delta = 20;
            else if (rotacao <= 2000) delta = 30;
            else delta = 40;
        }
        document.getElementById('deltaT').value = delta;
        this.dispatchEvent(new Event('input')); // Força atualização
    });

    document
        .getElementById('rotacao')
        .addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.dispatchEvent(new Event('input')); // Atualiza deltaT

                if (todosCamposObrigatoriosPreenchidos()) {
                    calcular();
                } else {
                    const index = camposEditaveis.findIndex(
                        (campo) => campo.id === 'rotacao'
                    );
                    const proximo = camposEditaveis[index + 1];
                    if (proximo) {
                        proximo.focus();
                        if (proximo.tagName === 'INPUT') proximo.select();
                    }
                }
            }
        });

    const camposObrigatorios = [
        'distancia',
        'materialEixo',
        'materialCaixa',
        'rotacao',
        'tempAmbiente',
        'tempCaixa',
    ];

    function verificarCampos() {
        const preenchidos = todosCamposObrigatoriosPreenchidos();
        btnCalcular.disabled = !preenchidos;
        btnCalcular.style.cursor = preenchidos ? 'pointer' : 'not-allowed';
        if (btnCalcular.disabled) {
            btnCalcular.classList.remove('pulsar');
        }
    }

    camposObrigatorios.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', verificarCampos);
    });

    verificarCampos();

    btnCalcular.addEventListener('click', () => {
        if (!btnCalcular.disabled) {
            btnCalcular.classList.remove('pulsar');
            calcular();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Enter' &&
            document.activeElement === btnCalcular &&
            !btnCalcular.disabled
        ) {
            event.preventDefault();
            calcular();
        }
    });
});

function limparCamposSaida() {
    const camposSaida = [
        'coefEixo',
        'coefCaixa',
        'res2',
        'res3',
        'res4',
        'res5',
        'res6',
        'res7',
        'res8',
    ];
    camposSaida.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function calcular() {
    const distancia = parseFloat(document.getElementById('distancia').value);
    const materialEixo = document.getElementById('materialEixo').value;
    const materialCaixa = document.getElementById('materialCaixa').value;
    const deltaT = parseFloat(document.getElementById('deltaT').value);
    const rotacao = parseFloat(document.getElementById('rotacao').value);
    const tempAmbiente = parseFloat(
        document.getElementById('tempAmbiente').value
    );
    const tempCaixa = parseFloat(document.getElementById('tempCaixa').value);

    if (
        isNaN(distancia) ||
        isNaN(deltaT) ||
        isNaN(rotacao) ||
        isNaN(tempAmbiente) ||
        isNaN(tempCaixa)
    )
        return;

    const coefEixo = calcularCoeficiente(materialEixo);
    const coefCaixa = calcularCoeficiente(materialCaixa);
    const deltaTCaixa = tempCaixa - tempAmbiente;
    const deltaTEixo = tempCaixa - tempAmbiente + deltaT;

    const dilatacaoEixo = coefEixo * distancia * deltaTEixo;
    const dilatacaoCaixa = coefCaixa * distancia * deltaTCaixa;
    const diferencaDeDilatacao = dilatacaoEixo - dilatacaoCaixa;
    const folgaNecessaria = diferencaDeDilatacao * 1.5;
    const tolerancia = diferencaDeDilatacao * 0.2;

    document.getElementById('coefEixo').value = coefEixo.toFixed(6);
    document.getElementById('coefCaixa').value = coefCaixa.toFixed(6);
    document.getElementById('res2').value = deltaTCaixa.toFixed(1);
    document.getElementById('res3').value = deltaTEixo.toFixed(1);
    document.getElementById('res4').value = dilatacaoEixo.toFixed(3);
    document.getElementById('res5').value = dilatacaoCaixa.toFixed(3);
    document.getElementById('res6').value = diferencaDeDilatacao.toFixed(3);
    document.getElementById('res7').value = folgaNecessaria.toFixed(3);
    document.getElementById('res8').value = `-0.000/${
        tolerancia >= 0 ? '+' : ''
    }${tolerancia.toFixed(3)}`;
}

function calcularCoeficiente(material) {
    const coeficientes = {
        aco: 11e-6,
        aluminio: 24e-6,
        ferro: 12e-6,
    };
    return coeficientes[material.toLowerCase()] || 0;
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações de layout
    const marginLeft = 25;
    const marginRight = 5;
    const logoWidth = 40;
    const logoMarginFromEdge = 1;
    const logoOffsetY = -8;
    const headerStartY = 25;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoOffsetX =
        pageWidth - marginRight - logoWidth - logoMarginFromEdge;

    let yPos = headerStartY;

    // Configurações de fonte
    doc.addFont('fontes/NotoSans-Regular.ttf', 'NotoSans', 'normal');
    doc.addFont('fontes/NotoSans-Bold.ttf', 'NotoSans', 'bold');
    doc.setFont('NotoSans');

    const addText = (text, x, y, options = {}) => {
        doc.setFont('NotoSans', options.bold ? 'bold' : 'normal');
        doc.setFontSize(options.size || 12);
        doc.text(text, x, y, { align: options.align || 'left' });
    };

    const logo = new Image();
    logo.crossOrigin = 'Anonymous';

    logo.onload = function () {
        try {
            const aspectRatio = logo.height / logo.width;
            const logoHeight = logoWidth * aspectRatio;

            doc.addImage(
                logo,
                'PNG',
                logoOffsetX,
                headerStartY + logoOffsetY,
                logoWidth,
                logoHeight
            );

            const centerX = pageWidth / 2;
            addText('FOLGA NAS TAMPAS EM', centerX, yPos, {
                bold: true,
                size: 16,
                align: 'center',
            });
            addText('ROLAMENTOS CILINDRICOS', centerX, yPos + 8, {
                bold: true,
                size: 16,
                align: 'center',
            });

            yPos += Math.max(logoHeight, 30);
            continuarGeracaoPDF(doc, yPos);
        } catch (e) {
            console.error('Erro ao adicionar logo:', e);
            continuarGeracaoPDF(doc, yPos);
        }
    };

    logo.onerror = function () {
        console.warn('Logo não carregado - usando fallback');
        const centerX = pageWidth / 2;
        addText('FOLGA NAS TAMPAS EM', centerX, yPos, {
            bold: true,
            size: 16,
            align: 'center',
        });
        addText('ROLAMENTOS CILINDRICOS', centerX, yPos + 8, {
            bold: true,
            size: 16,
            align: 'center',
        });
        yPos += 30;
        continuarGeracaoPDF(doc, yPos);
    };

    logo.src = 'Imagens/LogoEnengcomfundo.png';
    if (logo.complete) logo.onload();

    function continuarGeracaoPDF(doc, yPos) {
        const infoCabecalho = [
            `Cliente: ${document.getElementById('cliente').value || '----'}`,
            `Projeto: ${document.getElementById('projeto').value || '----'}`,
            `Eixo: ${document.getElementById('observacao').value || '----'}`,
        ];

        infoCabecalho.forEach((item) => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            addText(item, marginLeft, yPos);
            yPos += 8;
        });

        yPos += 5;

        // Seção DADOS DE ENTRADA
        addText('DADOS DE ENTRADA', marginLeft, yPos, { bold: true, size: 14 });
        doc.line(marginLeft, yPos + 5, pageWidth - marginRight, yPos + 5);
        yPos += 15;

        const dadosEntrada = [
            `Distância entre centros L₀: ${
                document.getElementById('distancia').value || '0'
            } mm`,
            `Material do eixo: ${
                document.getElementById('materialEixo').selectedOptions[0].text
            }`,
            `Material da caixa: ${
                document.getElementById('materialCaixa').selectedOptions[0].text
            }`,
            `Rotação do eixo: ${
                document.getElementById('rotacao').value || '0'
            } rpm`,
            `Diferença de temperatura caixa/eixo: ${
                document.getElementById('deltaT').value || '0'
            } °C`,
            `Temperatura ambiente: ${
                document.getElementById('tempAmbiente').value || '0'
            } °C`,
            `Temperatura da caixa: ${
                document.getElementById('tempCaixa').value || '0'
            } °C`,
        ];

        // Armazena posição inicial para imagem
        const yDadosInicio = yPos;

        dadosEntrada.forEach((item) => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            addText(item, marginLeft, yPos);
            yPos += 8;
        });

        // Carrega imagem ao lado direito dos dados de entrada
        const img = new Image();
        img.src = 'Imagens/Eixo1 preto.png';
        img.onload = () => {
            try {
                const larguraImagem = 50;
                const proporcao = img.height / img.width;
                const alturaImagem = larguraImagem * proporcao;

                const xImagem = pageWidth - marginRight - larguraImagem - 25;
                const yImagem = yDadosInicio;

                doc.addImage(
                    img,
                    'PNG',
                    xImagem,
                    yImagem,
                    larguraImagem,
                    alturaImagem
                );

                gerarResultados();
            } catch (e) {
                console.error('Erro ao inserir imagem Eixo1 preto:', e);
                gerarResultados();
            }
        };

        img.onerror = () => {
            console.warn('Imagem Eixo1 preto não carregada.');
            gerarResultados();
        };

        function gerarResultados() {
            yPos += 5;
            addText('RESULTADOS', marginLeft, yPos, { bold: true, size: 14 });
            doc.line(marginLeft, yPos + 5, pageWidth - marginRight, yPos + 5);
            yPos += 15;

            const resultados = [
                `Coeficiente de dilatação do eixo: ${
                    document.getElementById('coefEixo').value || '0'
                } °C⁻¹`,
                `Coeficiente de dilatação da caixa: ${
                    document.getElementById('coefCaixa').value || '0'
                } °C⁻¹`,
                `ΔT caixa-meio ambiente: ${
                    document.getElementById('res2').value || '0'
                } °C`,
                `ΔT eixo-meio ambiente: ${
                    document.getElementById('res3').value || '0'
                } °C`,
                `Dilatação eixo: ${
                    document.getElementById('res4').value || '0'
                } mm`,
                `Dilatação caixa: ${
                    document.getElementById('res5').value || '0'
                } mm`,
                `Diferença de dilatação: ${
                    document.getElementById('res6').value || '0'
                } mm`,
                `Folga necessária: ${
                    document.getElementById('res7').value || '0'
                } mm`,
                `Tolerância: ${
                    document.getElementById('res8').value || '0'
                } mm`,
            ];

            resultados.forEach((item) => {
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                addText(item, marginLeft, yPos);
                yPos += 8;
            });

            const data = new Date();
            const dataFormatada = `${data.getDate()}/${
                data.getMonth() + 1
            }/${data.getFullYear()}`;
            const horaMinuto = `${data.getHours()}:${data.getMinutes()}`;

            doc.setFontSize(10);
            doc.text('www.eneng.com.br', 10, 280);
            doc.text(`${dataFormatada} ${horaMinuto}`, 105, 280, {
                align: 'center',
            });

            const blob = doc.output('blob');
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        }

        if (img.complete) img.onload();
    }

    doc.setFontSize(10); // Fonte menor para o aviso
    const avisoLegal = [
        'Aviso Legal:',
        'A ENENG não se responsabiliza pela precisão, confiabilidade ou consequências dos resultados',
        'gerados por este programa de cálculo. Os valores obtidos são fornecidos apenas para fins',
        'informativos e não substituem a avaliação de um profissional qualificado.',
    ];
    doc.text(avisoLegal, 25, 255);
}
