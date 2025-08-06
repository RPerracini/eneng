document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCalc');
    const btnResetar = document.getElementById('btnReset');
    const btnGerarPDF = document.getElementById('btnGerarPDF');
    const elems = Array.from(form.elements).filter((el) => el.id !== 'deltaT');

    if (form) {
        form.addEventListener('submit', (e) => e.preventDefault());

        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const idx = elems.indexOf(document.activeElement);
                if (idx === -1) return;
                const next = elems[idx + 1];
                if (next) {
                    next.focus();
                    if (next.select) next.select();
                }
            }
        });

        btnResetar.addEventListener('click', () => {
            form.reset();
            [
                'coefEixo',
                'coefCaixa',
                'res2',
                'res3',
                'res4',
                'res5',
                'res6',
                'res7',
                'res8',
                'res9',
                'observacao',
                'cliente',
                'projeto',
                'rotacao',
            ].forEach((id) => (document.getElementById(id).value = ''));
        });

        btnGerarPDF?.addEventListener('click', gerarPDF);
    }

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
        calcular();
    });

    // 🔥 Modal: Aviso Legal
    const btnAviso = document.getElementById('btnAviso');
    const modalAviso = document.getElementById('avisoModal');
    const closeModal = modalAviso?.querySelector('.close-modal');

    if (btnAviso && modalAviso && closeModal) {
        btnAviso.addEventListener('click', () => {
            modalAviso.style.display = 'block';
        });

        closeModal.addEventListener('click', () => {
            modalAviso.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalAviso) {
                modalAviso.style.display = 'none';
            }
        });
    }
});

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

    if ([distancia, deltaT, rotacao, tempAmbiente, tempCaixa].some(isNaN))
        return;

    const coefEixo = calcularCoeficiente(materialEixo);
    const coefCaixa = calcularCoeficiente(materialCaixa);
    const deltaTCaixa = tempCaixa - tempAmbiente;
    const deltaTEixo = deltaTCaixa + deltaT;

    const dilatacaoEixo = coefEixo * distancia * deltaTEixo;
    const dilatacaoCaixa = coefCaixa * distancia * deltaTCaixa;
    const diferenca = dilatacaoEixo - dilatacaoCaixa;
    const folga = diferenca;
    const segurança = diferenca * 0.3;
    const total = folga + segurança;

    const tolerancia = diferenca * 0.2;

    document.getElementById('coefEixo').value = coefEixo.toFixed(6);
    document.getElementById('coefCaixa').value = coefCaixa.toFixed(6);
    document.getElementById('res2').value = deltaTCaixa.toFixed(1);
    document.getElementById('res3').value = deltaTEixo.toFixed(1);
    document.getElementById('res4').value = dilatacaoEixo.toFixed(3);
    document.getElementById('res5').value = dilatacaoCaixa.toFixed(3);
    document.getElementById('res6').value = folga.toFixed(3);
    document.getElementById('res9').value = segurança.toFixed(3);

    document.getElementById('res7').value = total.toFixed(3);
    document.getElementById('res8').value = `-0.000/${
        tolerancia >= 0 ? '+' : ''
    }${tolerancia.toFixed(3)}`;
}

function calcularCoeficiente(material) {
    const coef = { aco: 11e-6, aluminio: 24e-6, ferro: 12e-6 };
    return coef[material.toLowerCase()] || 0;
}

function gerarPDF() {
    Promise.all([
        fetch('Fontes_PDF/NotoSans-Regular.txt').then((r) => r.text()),
        fetch('Fontes_PDF/NotoSans-Bold.txt').then((r) => r.text()),
        fetch('imagens/LogoEnengcomfundo.png')
            .then((r) => r.blob())
            .then(
                (blob) =>
                    new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    })
            ),
        fetch('imagens/Eixo1preto.png')
            .then((r) => {
                if (!r.ok)
                    throw new Error('Imagem Eixo1preto.png não encontrada');
                return r.blob();
            })
            .then(
                (blob) =>
                    new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    })
            ),
    ])
        .then(
            ([base64FonteRegular, base64FonteBold, logoBase64, eixoBase64]) => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                // Fontes
                doc.addFileToVFS('NotoSans-Regular.ttf', base64FonteRegular);
                doc.addFont('NotoSans-Regular.ttf', 'noto', 'normal');
                doc.addFileToVFS('NotoSans-Bold.ttf', base64FonteBold);
                doc.addFont('NotoSans-Bold.ttf', 'noto', 'bold');
                doc.setFont('noto', 'normal');

                const pw = doc.internal.pageSize.getWidth();
                const margemEsquerda = 25;
                const margemDireita = 20;
                const larguraUtil = pw - margemEsquerda - margemDireita;
                const centerX = margemEsquerda + larguraUtil / 2;
                let y = 25;

                // 🔥 Logo (direita)
                doc.addImage(
                    logoBase64,
                    'PNG',
                    pw - margemDireita - 40,
                    y - 8,
                    40,
                    0
                );

                // 🔥 Título (agora à esquerda)
                doc.setFontSize(16);
                doc.setFont('noto', 'bold');
                doc.text('FOLGA NAS TAMPAS EM', margemEsquerda, y, {
                    align: 'left',
                });
                doc.text('ROLAMENTOS CILÍNDRICOS', margemEsquerda, y + 8, {
                    align: 'left',
                });
                y += 30;

                // 🔥 Cliente, Projeto, Eixo
                doc.setFont('noto', 'normal');
                doc.setFontSize(12);
                const infoTopo = [
                    `Cliente: ${
                        document.getElementById('cliente').value || '----'
                    }`,
                    `Projeto: ${
                        document.getElementById('projeto').value || '----'
                    }`,
                    `Eixo: ${
                        document.getElementById('observacao').value || '----'
                    }`,
                ];

                infoTopo.forEach((line) => {
                    doc.text(line, margemEsquerda, y);
                    y += 8;
                });

                y += 9;

                // 🔥 Dados de entrada
                doc.setFont('noto', 'bold');
                doc.setFontSize(14);
                doc.text('DADOS DE ENTRADA', margemEsquerda, y);
                doc.line(margemEsquerda, y + 2, pw - margemDireita, y + 2);
                y += 10;

                // 📌 Imagem eixo (à direita da área útil)
                const larguraImg = 57;
                doc.addImage(
                    eixoBase64,
                    'PNG',
                    margemEsquerda + larguraUtil - larguraImg,
                    y - 5,
                    larguraImg,
                    0
                );

                const entradas = [
                    `Distância entre centros dos rolamentos L₀: ${
                        document.getElementById('distancia').value
                    } mm`,
                    `Material do eixo: ${
                        document.getElementById('materialEixo')
                            .selectedOptions[0].text
                    }`,
                    `Material da caixa: ${
                        document.getElementById('materialCaixa')
                            .selectedOptions[0].text
                    }`,
                    `Rotação do eixo: ${
                        document.getElementById('rotacao').value
                    } rpm`,
                    `ΔT entre eixo e caixa: ${
                        document.getElementById('deltaT').value
                    } °C`,
                    `Temperatura ambiente: ${
                        document.getElementById('tempAmbiente').value
                    } °C`,
                    `Temperatura da caixa: ${
                        document.getElementById('tempCaixa').value
                    } °C`,
                ];

                doc.setFont('noto', 'normal');
                doc.setFontSize(12);
                entradas.forEach((line) => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, margemEsquerda, y);
                    y += 8;
                });

                // 🔥 Resultados
                y += 5;
                doc.setFont('noto', 'bold');
                doc.setFontSize(14);
                doc.text('RESULTADOS', margemEsquerda, y);
                doc.line(margemEsquerda, y + 2, pw - margemDireita, y + 2);
                y += 10;

                const resultados = [
                    `Coeficiente de dilatação do eixo: ${
                        document.getElementById('coefEixo').value
                    } °C⁻¹`,
                    `Coeficiente de dilatação da caixa: ${
                        document.getElementById('coefCaixa').value
                    } °C⁻¹`,
                    `ΔT caixa - meio ambiente: ${
                        document.getElementById('res2').value
                    } °C`,
                    `ΔT eixo - meio ambiente: ${
                        document.getElementById('res3').value
                    } °C`,
                    `Dilatação do eixo: ${
                        document.getElementById('res4').value
                    } mm`,
                    `Dilatação da caixa: ${
                        document.getElementById('res5').value
                    } mm`,
                    `Diferença de dilatação eixo - caixa: ${
                        document.getElementById('res6').value
                    } mm`,
                    `Segurança: ${document.getElementById('res9').value} mm`,
                    `Folga necessária: ${
                        document.getElementById('res7').value
                    } mm`,
                    `Tolerância: ${document.getElementById('res8').value} mm`,
                ];

                doc.setFont('noto', 'normal');
                doc.setFontSize(12);
                resultados.forEach((line) => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, margemEsquerda, y);
                    y += 8;
                });

                // 🔥 Rodapé
                const now = new Date();
                doc.setFontSize(10);
                doc.text('www.eneng.com.br', 10, 280);
                doc.text(
                    `${now.getDate()}/${
                        now.getMonth() + 1
                    }/${now.getFullYear()} ${now.getHours()}:${now
                        .getMinutes()
                        .toString()
                        .padStart(2, '0')}`,
                    centerX,
                    280,
                    { align: 'center' }
                );

                const blob = doc.output('blob');
                window.open(URL.createObjectURL(blob), '_blank');
            }
        )
        .catch((err) => {
            console.error('Erro ao gerar PDF:', err);
            alert('Erro ao gerar PDF: ' + err.message);
        });
}
