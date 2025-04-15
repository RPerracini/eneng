document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCalc");
  const btnCalcular = document.getElementById("btnCalcular");

  document.getElementById('deltaT').addEventListener('focus', function(e) {
    this.blur(); // Remove o foco imediatamente se alguém tentar focar
  });

  form.addEventListener("submit", e => e.preventDefault());

  const camposEditaveis = Array.from(form.querySelectorAll(".coluna-dados input, .coluna-dados select"))
    .filter(campo => !campo.disabled && !campo.readOnly && campo.offsetParent !== null);

  camposEditaveis.forEach((campo, index) => {
    campo.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();

        // Fluxo especial: Rotação → Botão Calcular
        if (campo.id === "rotacao") {
          if (btnCalcular && !btnCalcular.disabled) {
            btnCalcular.focus();
            btnCalcular.classList.add('pulsar'); // Adiciona efeito de pulsar
            return;
          }
        }

        // Lógica padrão para outros campos
        const proximo = camposEditaveis[index + 1];
        if (proximo) {
          proximo.focus();
          if (proximo.tagName === 'INPUT') proximo.select();
        } else {
          campo.blur();
        }
      }
    });
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    form.reset();
    const camposSaida = [
      "coefEixo", "coefCaixa", "res2", "res3", "res4", "res5", "res6", "res7", "res8", "deltaT"
    ];
    camposSaida.forEach(id => document.getElementById(id).value = "");
    btnCalcular.classList.remove('pulsar'); // Remove efeito ao resetar
  });

  document.getElementById("rotacao").addEventListener("input", () => {
    const rotacao = parseFloat(document.getElementById("rotacao").value);
    let delta = 0;
    if (rotacao <= 300) delta = 10;
    else if (rotacao <= 1200) delta = 20;
    else if (rotacao <= 2000) delta = 30;
    else delta = 40;
    document.getElementById("deltaT").value = delta;
  });

  const camposObrigatorios = [
    "distancia", "materialEixo", "materialCaixa",
    "rotacao", "tempAmbiente", "tempCaixa"
  ];

  function verificarCampos() {
    const preenchidos = camposObrigatorios.every(id => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== "";
    });

    btnCalcular.disabled = !preenchidos;
    btnCalcular.style.cursor = preenchidos ? "pointer" : "not-allowed";
    
    // Remove a classe pulsar se o botão estiver desabilitado
    if (btnCalcular.disabled) {
      btnCalcular.classList.remove('pulsar');
    }
  }

  camposObrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", verificarCampos);
  });

  verificarCampos();

  // Comportamento original do botão "Calcular"
  btnCalcular.addEventListener("click", () => {
    if (!btnCalcular.disabled) {
      btnCalcular.classList.remove('pulsar');
      calcular();
    }
  });

  btnCalcular.addEventListener("keydown", event => {
    if (event.key === "Enter" && !btnCalcular.disabled) {
      btnCalcular.classList.remove('pulsar');
      calcular();
    }
  });
});

function calcular() {
  const distancia = parseFloat(document.getElementById("distancia").value);
  const materialEixo = document.getElementById("materialEixo").value;
  const materialCaixa = document.getElementById("materialCaixa").value;
  const deltaT = parseFloat(document.getElementById("deltaT").value);
  const rotacao = parseFloat(document.getElementById("rotacao").value);
  const tempAmbiente = parseFloat(document.getElementById("tempAmbiente").value);
  const tempCaixa = parseFloat(document.getElementById("tempCaixa").value);

  if (
    isNaN(distancia) || isNaN(deltaT) || isNaN(rotacao) ||
    isNaN(tempAmbiente) || isNaN(tempCaixa)
  ) return;

  const coefEixo = calcularCoeficiente(materialEixo);
  const coefCaixa = calcularCoeficiente(materialCaixa);
  const deltaTCaixa = tempCaixa - tempAmbiente;
  const deltaTEixo = tempCaixa - tempAmbiente + deltaT;

  const dilatacaoEixo = coefEixo * distancia * deltaTEixo;
  const dilatacaoCaixa = coefCaixa * distancia * deltaTCaixa;
  const diferencaDeDilatacao = dilatacaoEixo - dilatacaoCaixa;
  const folgaNecessaria = diferencaDeDilatacao * 1.5;
  const tolerancia = diferencaDeDilatacao * 0.2;

  document.getElementById("coefEixo").value = coefEixo.toFixed(6);
  document.getElementById("coefCaixa").value = coefCaixa.toFixed(6);
  document.getElementById("res2").value = deltaTCaixa.toFixed(3);
  document.getElementById("res3").value = deltaTEixo.toFixed(3);
  document.getElementById("res4").value = dilatacaoEixo.toFixed(3);
  document.getElementById("res5").value = dilatacaoCaixa.toFixed(3);
  document.getElementById("res6").value = diferencaDeDilatacao.toFixed(3);
  document.getElementById("res7").value = folgaNecessaria.toFixed(3);
  document.getElementById("res8").value = " -0.000/" + (tolerancia >= 0 ? "+" : "") + tolerancia.toFixed(3);
}

function calcularCoeficiente(material) {
  const coeficientes = {
    "aco": 11e-6,
    "aluminio": 24e-6,
    "ferro": 12e-6
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
  const logoOffsetX = pageWidth - marginRight - logoWidth - logoMarginFromEdge;

  let yPos = headerStartY;

  // Configurações de fonte
  doc.addFont("fontes/NotoSans-Regular.ttf", "NotoSans", "normal");
  doc.addFont("fontes/NotoSans-Bold.ttf", "NotoSans", "bold");
  doc.setFont("NotoSans");

  const addText = (text, x, y, options = {}) => {
    doc.setFont("NotoSans", options.bold ? "bold" : "normal");
    doc.setFontSize(options.size || 12);
    doc.text(text, x, y, { align: options.align || 'left' });
  };

  const logo = new Image();
  logo.crossOrigin = "Anonymous";
  
  logo.onload = function() {
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
      addText("FOLGA NAS TAMPAS EM", centerX, yPos, { 
        bold: true, 
        size: 16, 
        align: 'center' 
      });
      addText("ROLAMENTOS CILINDRICOS", centerX, yPos + 8, {
        bold: true,
        size: 16,
        align: 'center'
      });

      yPos += Math.max(logoHeight, 30);
      continuarGeracaoPDF(doc, yPos);
    } catch (e) {
      console.error("Erro ao adicionar logo:", e);
      continuarGeracaoPDF(doc, yPos);
    }
  };

  logo.onerror = function() {
    console.warn("Logo não carregado - usando fallback");
    const centerX = pageWidth / 2;
    addText("FOLGA NAS TAMPAS EM", centerX, yPos, { bold: true, size: 16, align: 'center' });
    addText("ROLAMENTOS CILINDRICOS", centerX, yPos + 8, { bold: true, size: 16, align: 'center' });
    yPos += 30;
    continuarGeracaoPDF(doc, yPos);
  };

  logo.src = 'Imagens/LogoEnengcomfundo.png';
  if (logo.complete) logo.onload();

  function continuarGeracaoPDF(doc, yPos) {
    const infoCabecalho = [
      `Cliente: ${document.getElementById("cliente").value || "----"}`,
      `Projeto: ${document.getElementById("projeto").value || "----"}`,
      `Eixo: ${document.getElementById("observacao").value || "----"}`
    ];

    infoCabecalho.forEach(item => {
      if (yPos > 280) { doc.addPage(); yPos = 20; }
      addText(item, marginLeft, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Seção DADOS DE ENTRADA
    addText("DADOS DE ENTRADA", marginLeft, yPos, { bold: true, size: 14 });
    doc.line(marginLeft, yPos + 5, pageWidth - marginRight, yPos + 5);
    yPos += 10;

    // Adicionar imagem do eixo à direita
    const eixoImg = new Image();
    eixoImg.crossOrigin = "Anonymous";
    eixoImg.onload = function() {
      try {
        const imgWidth = 50;
        const aspectRatio = eixoImg.height / eixoImg.width;
        const imgHeight = imgWidth * aspectRatio;
        const imgX = pageWidth - marginRight - imgWidth - 20;
        const imgY = yPos;
        
        doc.addImage(
          eixoImg,
          'PNG',
          imgX,
          imgY,
          imgWidth,
          imgHeight
        );
        
        continuarDadosEntrada();
      } catch (e) {
        console.error("Erro ao adicionar imagem do eixo:", e);
        continuarDadosEntrada();
      }
    };

    eixoImg.onerror = function() {
      console.warn("Imagem do eixo não carregada - continuando sem ela");
      continuarDadosEntrada();
    };

    eixoImg.src = 'Imagens/Eixo1 preto.png';
    if (eixoImg.complete) eixoImg.onload();

    function continuarDadosEntrada() {
      const dadosEntrada = [
        `Distância entre centros L₀: ${document.getElementById("distancia").value || "0"} mm`,
        `Material do eixo: ${document.getElementById("materialEixo").selectedOptions[0].text}`,
        `Material da caixa: ${document.getElementById("materialCaixa").selectedOptions[0].text}`,
        `Rotação: ${document.getElementById("rotacao").value || "0"} rpm`,
        `ΔT caixa/eixo: ${document.getElementById("deltaT").value || "0"} °C`,
        `Temp. ambiente: ${document.getElementById("tempAmbiente").value || "0"} °C`,
        `Temp. caixa: ${document.getElementById("tempCaixa").value || "0"} °C`
      ];

      dadosEntrada.forEach(item => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        addText(item, marginLeft, yPos);
        yPos += 7;
      });

      // Seção RESULTADOS
      yPos += 5;
      addText("RESULTADOS", marginLeft, yPos, { bold: true, size: 14 });
      doc.line(marginLeft, yPos + 5, pageWidth - marginRight, yPos + 5);
      yPos += 10;

      const resultados = [
        `Coef. dilatação eixo: ${document.getElementById("coefEixo").value || "0"} °C⁻¹`,
        `Coef. dilatação caixa: ${document.getElementById("coefCaixa").value || "0"} °C⁻¹`,
        `ΔT caixa-meio: ${document.getElementById("res2").value || "0"} °C`,
        `ΔT eixo-meio: ${document.getElementById("res3").value || "0"} °C`,
        `Dilatação eixo: ${document.getElementById("res4").value || "0"} mm`,
        `Dilatação caixa: ${document.getElementById("res5").value || "0"} mm`,
        `Diferença de dilatação: ${document.getElementById("res6").value || "0"} mm`,
        `Folga necessária: ${document.getElementById("res7").value || "0"} mm`,
        `Tolerância da folga: ${document.getElementById("res8").value || "0"} mm`
      ];

      resultados.forEach(item => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        addText(item, marginLeft, yPos);
        yPos += 7;
      });

      // Rodapé
      const timestamp = new Date().toLocaleString();
      const pageHeight = doc.internal.pageSize.getHeight();
      const footerY = pageHeight - 10;

      addText("www.eneng.com.br", marginLeft, footerY, {
        size: 10,
        align: 'left'
      });

      addText(`Relatório gerado em: ${timestamp}`, pageWidth / 2, footerY, { 
        size: 10, 
        align: 'center' 
      });
      
      window.open(doc.output('bloburl'), '_blank');
    }
  }
}