function calcularZw1eZw2() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const alfa = parseFloat(document.getElementById('alfa').value) * (Math.PI / 180);
    const beta = parseFloat(document.getElementById('beta').value) * (Math.PI / 180);

    // const betaRad = (beta * Math.PI) / 180;
    const tanAlfaT = Math.tan(alfa) / Math.cos(beta);

    const alfaT = (Math.atan(tanAlfaT) * 180) / Math.PI;
    const alfaTRad=alfaT * (Math.PI / 180);

    const z1 = parseFloat(document.getElementById('z1').value);
    const z2 = parseFloat(document.getElementById('z2').value);
    const A1 = 4 * (x1 / z1) * Math.cos(beta) * (1 + (x1 / z1) * Math.cos(beta));
    const B1 = Math.tan(alfa) ** 2 + Math.cos(beta) ** 2;
    const C1 = Math.cos(beta) * (Math.sin(alfa) ** 2 + Math.cos(beta) ** 2 * Math.cos(alfa) ** 2);
    const D1 = (z1 / Math.PI) * Math.tan(alfaTRad) + (2 * x1 / Math.PI) * Math.tan(alfa);
    const zw1calc = (z1*alfaT / 180) + 0.5 + (z1 / Math.PI) * Math.sqrt(Math.tan(alfa) ** 2 + A1 * B1) / C1 - D1;
    const A2 = 4 * (x2 / z2) * Math.cos(beta) * (1 + (x2 / z2) * Math.cos(beta));
    const B2 = Math.tan(alfa) ** 2 + Math.cos(beta) ** 2;
    const C2 = Math.cos(beta) * (Math.sin(alfa) ** 2 + Math.cos(beta) ** 2 * Math.cos(alfa) ** 2);
    const D2 = (z2 / Math.PI) * Math.tan(alfaTRad) + (2 * x2 / Math.PI) * Math.tan(alfa);
    const zw2calc = (z2 * alfaT/ 180) + 0.5 + (z2 / Math.PI) * Math.sqrt(Math.tan(alfa) ** 2 + A2 * B2) / C2 - D2;

    // Atualiza os valores no DOM usando .value em vez de .innerText
    document.getElementById('zw1calc').value = zw1calc.toFixed(1); // Atualiza o campo zw1calc
    document.getElementById('zw2calc').value = zw2calc.toFixed(1); // Atualiza o campo zw2calc
    }

// Função para calcular as medidas W
function calcularW() {
    const mn = parseFloat(document.getElementById('mn').value);  // Módulo normal (mₙ)
    const alfaN = parseFloat(document.getElementById('alfa').value); // Ângulo de pressão normal (αₙ)
    const alfaNRad = alfaN * Math.PI / 180;
    const zw1 = parseFloat(document.getElementById('zw1_adotado').value);
    const zw2 = parseFloat(document.getElementById('zw2_adotado').value);
    const Z1d = parseFloat(document.getElementById('z1').value);
    const Z2d = parseFloat(document.getElementById('z2').value);
    const betaw = parseFloat(document.getElementById('beta').value);
    const betaRad = betaw*Math.PI/180;
    const tanAlfaT = Math.tan(alfaNRad) / Math.cos(betaRad);
    const alfaT = (Math.atan(tanAlfaT) * 180) / Math.PI;

    const evalfat = calcularEvalfat(alfaT);  // Passando o valor de alfaT para calcular evalfat

    // Verificar se os valores são válidos
    if (isNaN(mn) || isNaN(alfaN) || isNaN(betaw) || isNaN(zw1) || isNaN(zw2) || isNaN(alfaT) || isNaN(Z1d) || isNaN(Z2d)) {
        console.error("Valores inválidos para os parâmetros.");
        return;
    }

    // Obter as correções x1, x1max, x1min, x2, x2max, x2min (esses valores podem vir de inputs HTML)
    const x1 = parseFloat(document.getElementById('x1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const x1max = parseFloat(document.getElementById('x1max').textContent);
    const x1min = parseFloat(document.getElementById('x1min').textContent);
    const x2max = parseFloat(document.getElementById('x2max').textContent);
    const x2min = parseFloat(document.getElementById('x2min').textContent);

    // Verificar se os valores de correção são válidos
    if (isNaN(x1) || isNaN(x1max) || isNaN(x1min) || isNaN(x2) || isNaN(x2max) || isNaN(x2min)) {
        console.error("Valores inválidos para as correções.");
        return;
    }

    // Calcular as medidas W
    const Wnom1 = mn * Math.cos(alfaNRad) * ((zw1 - 0.5) * Math.PI + Z1d * evalfat)  + 2 * mn * x1 * Math.sin(alfaNRad);
    const Wxmax1 = mn * Math.cos(alfaNRad) * ((zw1 - 0.5) * Math.PI + Z1d * evalfat)  + 2 * mn * x1max * Math.sin(alfaNRad);
    const Wxmin1 = mn * Math.cos(alfaNRad) * ((zw1 - 0.5) * Math.PI + Z1d * evalfat)  + 2 * mn * x1min * Math.sin(alfaNRad);
    const Wnom2 = mn * Math.cos(alfaNRad) * ((zw2 - 0.5) * Math.PI + Z2d * evalfat)  + 2 * mn * x2 * Math.sin(alfaNRad);
    const Wxmax2 = mn * Math.cos(alfaNRad) * ((zw2 - 0.5) * Math.PI + Z2d * evalfat) + 2 * mn * x2max * Math.sin(alfaNRad);
    const Wxmin2 = mn * Math.cos(alfaNRad) * ((zw2 - 0.5) * Math.PI + Z2d * evalfat) + 2 * mn * x2min * Math.sin(alfaNRad);

    // Exibir os valores calculados na tela
    document.getElementById('Wnom1').textContent = Wnom1.toFixed(3) + ' mm';
    document.getElementById('Wxmax1').textContent = Wxmax1.toFixed(3) + ' mm';
    document.getElementById('Wxmin1').textContent = Wxmin1.toFixed(3) + ' mm';
    document.getElementById('Wnom2').textContent = Wnom2.toFixed(3) + ' mm';
    document.getElementById('Wxmax2').textContent = Wxmax2.toFixed(3) + ' mm';
    document.getElementById('Wxmin2').textContent = Wxmin2.toFixed(3) + ' mm';
}

// Calcula ângulo de pressão transversal
function calcularAlfaT() {

    const alfaN = parseFloat(document.getElementById('alfa').value); // Ângulo de pressão normal (αₙ)
    const alfaNRad = alfaN * Math.PI / 180;

    const betaRad = (beta * Math.PI) / 180;   // Converte beta para radianos
    const tanAlfaT = Math.tan(alfaNRad) / Math.cos(betaRad);

    const alfaT = (Math.atan(tanAlfaT) * 180) / Math.PI;

    return alfaT;
}

// Função para calcular a evolvente de alpha_t
function calcularEvalfat(alfaT) {
    // Converte o ângulo de pressão transversal (alfaT) de graus para radianos
    const alfaTRad = (alfaT * Math.PI) / 180;

    // Calcula a evolvente de alfa_t (evalfat)
    const evalfat = Math.tan(alfaTRad) - alfaTRad;

    return evalfat;
}

function larguraMinimaRodaDentada() {
    // Captura os valores digitados no HTML (substitua os IDs conforme seu HTML)
    const larguraPinhao = parseFloat(document.getElementById('larguraPinhao').value.replace(',', '.'));
    const larguraEngrenagem = parseFloat(document.getElementById('larguraCoroa').value.replace(',', '.'));

    // Wnom1 e Wnom2
    const Wnom1Text = document.getElementById('Wnom1').textContent;
    const Wnom1 = parseFloat(Wnom1Text.replace(' mm', '').replace(',', '.'));
    const Wnom2Text = document.getElementById('Wnom2').textContent;
    const Wnom2 = parseFloat(Wnom2Text.replace(' mm', '').replace(',', '.'));

    // Beta em graus e radianos
    const betaGraus = parseFloat(document.getElementById('beta').value);
    const betaRad = betaGraus * Math.PI / 180;

    // Disco do micrômetro para cada medida
    const bM1 = (Wnom1 <= 100) ? 20 : 30;
    const bM2 = (Wnom2 <= 100) ? 20 : 30;

    // Fórmula da largura mínima
    const larguraMinima1 = Wnom1 * Math.sin(betaRad) + bM1 * Math.cos(betaRad);
    const larguraMinima2 = Wnom2 * Math.sin(betaRad) + bM2 * Math.cos(betaRad);

    // Atualiza no HTML (e pinta de vermelho se necessário)
    const spanMin1 = document.getElementById('larguraMinima1');
    const spanMin2 = document.getElementById('larguraMinima2');
    spanMin1.textContent = larguraMinima1.toFixed(2) + ' mm';
    spanMin2.textContent = larguraMinima2.toFixed(2) + ' mm';

    spanMin1.style.color = (larguraMinima1 > larguraPinhao) ? 'red' : '';
    spanMin2.style.color = (larguraMinima2 > larguraEngrenagem) ? 'red' : '';

    return {
        larguraMinima1,
        larguraMinima2,
        bM1,
        bM2
    };
}
