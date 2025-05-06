document.addEventListener('DOMContentLoaded', () => {
    // Função para carregar os dados do rolamento a partir do CSV
    function carregarDados() {
        const codigo = document.getElementById('codigoRolamento').value.trim();

        // Carregar o arquivo CSV usando PapaParse
        Papa.parse('rolamentos.csv', {
            download: true,
            complete: function (results) {
                const data = results.data; // Dados do CSV

                const rolamento = data.find((item) => item.codigo === codigo);
                if (rolamento) {
                    // Preencher os campos com os dados do rolamento
                    document.getElementById('diametroD').value = rolamento.DA;
                    document.getElementById('diametrod').value = rolamento.DI;
                    document.getElementById('larguraB').value = rolamento.B;
                    document.getElementById('constR1').value = rolamento.R1;
                    document.getElementById('constR2').value = rolamento.R2;
                    document.getElementById('constR3').value = rolamento.R3;
                    document.getElementById('constR4').value = rolamento.R4;
                    document.getElementById('constS1').value = rolamento.S1;
                    document.getElementById('constS2').value = rolamento.S2;
                    document.getElementById('constS3').value = rolamento.S3;
                    document.getElementById('constS4').value = rolamento.S4;
                    document.getElementById('coefSelo').value = rolamento.Mseal;
                    document.getElementById('coefArraste').value =
                        rolamento.Mdrag;
                }
            },
        });
    }

    // Evento para quando o código do rolamento for inserido
    document
        .getElementById('codigoRolamento')
        .addEventListener('input', carregarDados);

    // Função para calcular o torque de atrito
    document.getElementById('btnCalcular').addEventListener('click', () => {
        const diametroD = parseFloat(
            document.getElementById('diametroD').value
        );
        const diametrod = parseFloat(
            document.getElementById('diametrod').value
        );
        const larguraB = parseFloat(document.getElementById('larguraB').value);

        const constR1 = parseFloat(document.getElementById('constR1').value);
        const constR2 = parseFloat(document.getElementById('constR2').value);
        const constR3 = parseFloat(document.getElementById('constR3').value);
        const constR4 = parseFloat(document.getElementById('constR4').value);

        const constS1 = parseFloat(document.getElementById('constS1').value);
        const constS2 = parseFloat(document.getElementById('constS2').value);
        const constS3 = parseFloat(document.getElementById('constS3').value);
        const constS4 = parseFloat(document.getElementById('constS4').value);

        const coefSelo = parseFloat(document.getElementById('coefSelo').value);
        const coefArraste = parseFloat(
            document.getElementById('coefArraste').value
        );

        // Cálculos de momento de atrito (simplificados com base no exemplo)
        const dm = (diametroD + diametrod) / 2;

        // Momentos de atrito de rolagem e deslizamento
        const Mrr =
            241 *
            (constR1 * Math.pow(dm, 1.85) * (2990 * constR2 + 100) ** 0.54);
        const Msl =
            22 *
            (constS1 * Math.pow(dm, 0.25) * (2990 + 4 * constS2 * 100) ** 1.3);
        const Mseal = 6.9 * Math.pow(dm, 2) * coefSelo;
        const Mdrag = 4 * 0.00003 * 0.00000000001 * Math.pow(dm, 2);

        const Mtotal = Mrr + Msl + Mseal + Mdrag;

        // Exibir os resultados
        document.getElementById('Mrr').value = Mrr.toFixed(4);
        document.getElementById('Msl').value = Msl.toFixed(4);
        document.getElementById('Mseal').value = Mseal.toFixed(4);
        document.getElementById('Mdrag').value = Mdrag.toFixed(4);
        document.getElementById('Mtotal').value = Mtotal.toFixed(4);
    });

    // Resetar os campos
    document.getElementById('btnReset').addEventListener('click', () => {
        document.getElementById('formCalc').reset();
    });
});
