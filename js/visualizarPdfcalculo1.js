function extrairNumero(valor) {
  if (typeof valor !== "string") valor = String(valor);
  valor = valor.replace(/\s/g, '');              // Remove TODOS os espaços
  valor = valor.replace(/[^0-9.,-]+/g, '');      // Mantém só números, ponto, vírgula, sinal
  valor = valor.replace(',', '.');               // Troca vírgula por ponto
  return parseFloat(valor);
}

const margemEsquerda = 25; // Margem esquerda
const margemDireita = 20;  // Margem direita

// --- CONTROLES DE ESPAÇAMENTO --- //
const ESPACO_TITULO_PRINCIPAL = 20;
const ESPACO_TITULO_SECAO = 8;
const ESPACO_LINHA = 6; // Ajuste para espaçamento entre valores

function textoComSubscrito(doc, x, y, texto, subscrito, options = {}) {
  const normalFontSize = options.fontSize || 11;
  const subFontSize = normalFontSize * 0.7;
  const subYOffset = normalFontSize * 0.1;

  const match = subscrito.match(/^([^\s]+)(.*)$/);
  const indice = match ? match[1] : subscrito;
  const textoExtra = match ? match[2] : '';

  doc.setFontSize(normalFontSize);
  doc.text(texto, x, y);

  const textoWidth = doc.getTextWidth(texto);

  doc.setFontSize(subFontSize);
  doc.text(indice, x + textoWidth + 0.5, y + subYOffset);

  const indiceWidth = doc.getTextWidth(indice);

  doc.setFontSize(normalFontSize);
  doc.text(textoExtra, x + textoWidth + indiceWidth + 1, y);

  return textoWidth + indiceWidth + doc.getTextWidth(textoExtra) + 1;
}

// Função para ler tanto input, span ou div
function getValorCampo(selector) {
  const el = document.querySelector(selector);
  if (!el) return "Campo não preenchido";

  let valor = "";
  if (el.value !== undefined && el.value !== "") valor = el.value;
  else if (el.innerText && el.innerText !== "-") valor = el.innerText;
  else if (el.textContent && el.textContent !== "-") valor = el.textContent;

  // Se o valor final estiver vazio, retorna os traços
  return valor.trim() === "" ? "Campo não preenchido" : valor;
}

function formatarValor4Decimais(valor) {
  if (valor === "" || valor === "-" || valor === null || valor === undefined) return "0.0000";
  const num = parseFloat(String(valor).replace(',', '.'));
  return isNaN(num) ? "0.0000" : num.toFixed(4);
}

function coletarCamposPorSecao(section) {
  const dados = {
    entrada: [
      { label: "Cliente", value: getValorCampo('input[name="cliente"]'), subscript: "", unidade: "" },
      { label: "Projeto", value: getValorCampo('input[name="projeto"]'), subscript: "", unidade: "" },
      { label: "Referência", value: getValorCampo('input[name="observacoes"]'), subscript: "", unidade: "" },
      { label: "Módulo normal m", value: getValorCampo('#mn'), subscript: "n", unidade: "mm" },
      { label: "Nº de dentes Z", value: getValorCampo('#z1'), subscript: "1", unidade: "" },
      { label: "Nº de dentes Z", value: getValorCampo('#z2'), subscript: "2", unidade: "" },
      { label: "Largura do pinhão b", value: getValorCampo('#larguraPinhao'), subscript: "1", unidade: "mm" },
      { label: "Largura da coroa b", value: getValorCampo('#larguraCoroa'), subscript: "2", unidade: "mm" },
      { label: "Ângulo de pressão normal α", value: getValorCampo('#alfa'), subscript: "n", unidade: "°" },
      { label: "Ângulo de hélice β", value: getValorCampo('#beta'), subscript: "", unidade: "°" },
      { label: "Entre centros de trabalho a", value: getValorCampo('#aw'), subscript: 'w', unidade: 'mm' },
      { label: "Classe de tolerância do entre centros", value: getValorCampo('#toleranciaCentros'), subscript: '', unidade: '' },
      { label: "Adendo", value: getValorCampo('#adendo'), subscript: '', unidade: '' },
      { label: "Dedendo", value: getValorCampo('#dedendo'), subscript: '', unidade: '' },
      { label: "Grau de Tolerância do dentado", value: getValorCampo('#grauTolerancia'), subscript: '', unidade: '' },
      { label: "Desvio Permitido do dentado", value: getValorCampo('#desvioPermitido'), subscript: '', unidade: '' },
    ],
    geral: [
      { label: "Redução", value: getValorCampo('#reducao'), subscript: '', unidade: '' },
      { label: "Módulo transversal m", value: getValorCampo('#mt'), subscript: 't', unidade: '' },
      { label: "Entre centros máximo a", value: getValorCampo('#aw_max'), subscript: 'wmax', unidade: 'mm' },
      { label: "Entre centros mínimo a", value: getValorCampo('#aw_min'), subscript: 'wmin', unidade: 'mm' },
      { label: "Passo normal p", value: getValorCampo('#pn'), subscript: 'n', unidade: '' },
      { label: "Passo transversal p", value: getValorCampo('#pt'), subscript: 't', unidade: '' },
      { label: "Ângulo de pressão transversal α", value: getValorCampo('#alfaT'), subscript: 't', unidade: '' },
      { label: "Ângulo de pressão transversal de trabalho α", value: getValorCampo('#alfaWt'), subscript: 'wt', unidade: '' },
      { label: "Coeficiente de rebaixamento k", value: getValorCampo('#rebk'), subscript: '', unidade: '' },
      { label: "Somatória das correções ΣX", value: getValorCampo('#somaXn'), unidade: "" },
      { label: "Ângulo de hélice na base β", value: getValorCampo('#beta_b'), subscript: "b", unidade: "°" },
{
  label: "Engrenagens tem tratamento térmico",
    value: getValorCampo('#tratamento') === 'S' ? 'Sim' :
          getValorCampo('#tratamento') === 'N' ? 'Não' :
          getValorCampo('#tratamento'), // mantém o valor original caso seja diferente de S ou N
          subscript: '',
          unidade: ''
},
      { label: "Espessura mínima permitida na cabeça do dente s", value: getValorCampo('#sa-minimo'), subscript: 'min', unidade: '' },
    ],

    resultado1: [
      { label: "Diâmetro primitivo d", value: getValorCampo('#d1'), subscript: "1", unidade: "" },
      { label: "Diâmetro de base db", value: getValorCampo('#db1'), subscript: "1", unidade: "" },
      { label: "Diâmetro de trabalho dw", value: getValorCampo('#dw1'), subscript: "1", unidade: "" },
      { label: "Diâmetro de cabeça máximo com x nominal da", value: getValorCampo('#da1max'), subscript: "1max", unidade: "" },
      { label: "Diâmetro de cabeça mínimo com x nominal da", value: getValorCampo('#da1min'), subscript: "1min", unidade: "" },
      { label: "Diâmetro do círculo do pé com x nominal df", value: getValorCampo('#df1'), subscript: "1", unidade: "" },
      { label: "Número de dentes virtuais Z", value: getValorCampo('#zv1_mostrar'), subscript: "v1", unidade: "" },
      { label: "Afastamento inferior da esp. do dente Asne", value: getValorCampo('#asne1'), subscript: "1", unidade: "" },
      { label: "Tolerância da espessura do dente Tsn", value: getValorCampo('#tsn1'), subscript: "1", unidade: "" },
      { label: "Afastamento superior da esp. do dente Asni", value: getValorCampo('#asni1'), subscript: "1", unidade: "" },
      { label: "Espessura nominal no diâmetro primitivo s", value: getValorCampo('#espessura1_normal'), subscript: "n1", unidade: "" },
      { label: "Espessura máxima no diâmetro primitivo s", value: getValorCampo('#espessura1_maxima'), subscript: "1max", unidade: "" },
      { label: "Espessura mínima no diâmetro primitivo s", value: getValorCampo('#espessura1_minima'), subscript: "1min", unidade: "" },
      { label: "Espessura mínima no diâmetro de cabeça s", value: getValorCampo('#sa1'), subscript: "1cmin  c/ x nominal", unidade: "" },
      { label: "Espessura mínima no diâmetro de cabeça s", value: getValorCampo('#sa1maxxmax'), subscript: "1cmin  c/ x máximo", unidade: "" },
      { label: "Correção recomendada para casos gerais", value: formatarValor4Decimais(getValorCampo('#x1ag')), subscript: "", unidade: "" },
      { label: "Correção recomendada para um equilíbrio aproximado das\nrazões de deslizamento específico", value: formatarValor4Decimais(getValorCampo('#x1ap')), subscript: "", unidade: "" },
      { label: "Correção recomendada para garantir a igualdade aproximada\ndos fatores de resistência à flexão dos dentes", value: formatarValor4Decimais(getValorCampo('#x1bp')), subscript: "", unidade: "" },
      { label: "Correção mínima para evitar undercut", value: formatarValor4Decimais(getValorCampo('#x1u')), subscript: "", unidade: "" },
      { label: "Correção adotada x", value: formatarValor4Decimais(getValorCampo('#x1')), subscript: "1", unidade: "" },
      { label: "Correção máxima x", value: formatarValor4Decimais(getValorCampo('#x1max')), subscript: "1max", unidade: "" },
      { label: "Correção mínima x", value: formatarValor4Decimais(getValorCampo('#x1min')), subscript: "1min", unidade: "" },
      { label: "Número de dentes para medida W calculado - Z", value: getValorCampo('#zw1calc'), subscript: "1", unidade: "" },
      { label: "Número de dentes para medida W adotado - Z", value: getValorCampo('#zw1_adotado'), subscript: "1", unidade: "" },
      { label: "Largura minima para medir W b", value: getValorCampo('#larguraMinima1'), subscript: "1min", unidade: "" },
      { label: "Medida W", value: getValorCampo('#Wxmax1'), subscript: "max1", unidade: "" },
      { label: "Medida W", value: getValorCampo('#Wxmin1'), subscript: "min1", unidade: "" },
      { label: "Diâmametro da esfera para medida M calculado DM", value: getValorCampo('#d1calc'), subscript: "1", unidade: "mm" },
      { label: "Diâmametro da esfera para medida M adotado - DM", value: getValorCampo('#d1adotado'), subscript: "1", unidade: "mm" },
      { label: "Medida M", value: getValorCampo('#Mdnom1'), subscript: "dnom1", unidade: "" },
      { label: "Medida M", value: getValorCampo('#Mdmax1'), subscript: "dmax1", unidade: "" },
      { label: "Medida M", value: getValorCampo('#Mdmin1'), subscript: "dmin1", unidade: "" }
    ],

    resultado2: [
      { label: "Diâmetro primitivo d", value: getValorCampo('#d2'), subscript: "2", unidade: "" },
      { label: "Diâmetro de base db", value: getValorCampo('#db2'), subscript: "2", unidade: "" },
      { label: "Diâmetro de trabalho dw", value: getValorCampo('#dw2'), subscript: "2", unidade: "" },
      { label: "Diâm. de cabeça máximo com x nom. da", value: getValorCampo('#da2max'), subscript: "2max", unidade: "" },
      { label: "Diâm. de cabeça mínimo com x nom. da", value: getValorCampo('#da2min'), subscript: "2min", unidade: "" },
      { label: "Diâm. do círculo do pé com x nom. df", value: getValorCampo('#df2'), subscript: "2", unidade: "" },
      { label: "Número de dentes virtuais Z", value: getValorCampo('#zv2_mostrar'), subscript: "v2", unidade: "" },
      { label: "Afastamento inferior da esp. do dente Asne", value: getValorCampo('#asne2'), subscript: "2", unidade: "" },
      { label: "Tolerância da espessura do dente Tsn", value: getValorCampo('#tsn2'), subscript: "2", unidade: "" },
      { label: "Afastamento superior da esp. do dente Asni", value: getValorCampo('#asni2'), subscript: "2", unidade: "" },
      { label: "Espessura nominal no diâmetro primitivo s", value: getValorCampo('#espessura2_normal'), subscript: "n2", unidade: "" },
      { label: "Espessura máxima no diâmetro primitivo s", value: getValorCampo('#espessura2_maxima'), subscript: "2max", unidade: "" },
      { label: "Espessura mínima no diâmetro primitivo s", value: getValorCampo('#espessura2_minima'), subscript: "2min", unidade: "" },
      { label: "Espessura mínima no diâmetro de cabeça s", value: getValorCampo('#sa2'), subscript: "2cmin c/ x nominal", unidade: "" },
      { label: "Espessura mínima no diâmetro de cabeça s", value: getValorCampo('#sa2maxxmax'), subscript: "2cmin  c/ x máximo", unidade: "" },
      { label: "Correção máxima x", value: formatarValor4Decimais(getValorCampo('#x2max')), subscript: "2max", unidade: "" },
      { label: "Correção mínima x", value: formatarValor4Decimais(getValorCampo('#x2min')), subscript: "2min", unidade: "" },
      { label: "Número de dentes para medida W calculado - Z", value: getValorCampo('#zw2calc'), subscript: "2", unidade: "" },
      { label: "Número de dentes para medida W adotado - Z", value: getValorCampo('#zw2_adotado'), subscript: "2", unidade: "" },
      { label: "Largura minima para medir W b", value: getValorCampo('#larguraMinima2'), subscript: "2min", unidade: "" },
      { label: "Medida W", value: getValorCampo('#Wnom2'), subscript: "nom2", unidade: "" },
      { label: "Medida W", value: getValorCampo('#Wxmax2'), subscript: "max2", unidade: "" },
      { label: "Medida W", value: getValorCampo('#Wxmin2'), subscript: "min2", unidade: "" },
      { label: "Diâmametro da esfera para medida M calculado DM", value: getValorCampo('#d2calc'), subscript: "2", unidade: "mm" },
      { label: "Diâmametro da esfera para medida M adotado - DM", value: getValorCampo('#d2adotado'), subscript: "2", unidade: "mm" },
      { label: "Medida M", value: getValorCampo('#Mdnom2'), subscript: "dnom2", unidade: "" },
      { label: "Medida M", value: getValorCampo('#Mdmax2'), subscript: "dmax2", unidade: "" },
      { label: "Medida M", value: getValorCampo('#Mdmin2'), subscript: "dmin2", unidade: "" }
    ]
  };
  return dados[section] || [];
}

function renderizaSecao(dadosSecao, titulo, doc, y, pw) {
  if (dadosSecao.length > 0) {
    const colunaValores = pw - margemDireita;
    const centroPagina = pw / 2;
    const larguraMaximaLabel = 150; // ajuste conforme necessário

    if (titulo === "Dados de Entrada") {
      dadosSecao.forEach(d => {
        if (d.label === "Cliente" || d.label === "Projeto" || d.label === "Referência") {
          let valorFinal = d.value || " ";
          doc.setFont('noto', 'bold');
          doc.text(`${valorFinal}`, centroPagina, y, { align: "center" });
          doc.setFont('noto', 'normal');
          y += ESPACO_LINHA;
        }
      });

      y += 6;
      doc.setFont('noto', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 255);
      doc.text(titulo, margemEsquerda, y);
      doc.setTextColor(0, 0, 0);
      y += 4;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(margemEsquerda, y, pw - margemDireita, y);
      y += ESPACO_TITULO_SECAO;

      doc.setFont('noto', 'normal');
      doc.setFontSize(11);
    } else {
      doc.setFont('noto', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 255);
      doc.text(titulo, margemEsquerda, y);
      doc.setTextColor(0, 0, 0);
      y += 4;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(margemEsquerda, y, pw - margemDireita, y);
      y += ESPACO_TITULO_SECAO;

      doc.setFont('noto', 'normal');
      doc.setFontSize(11);
    }

    // Renderiza os campos da seção
    dadosSecao.forEach(d => {
      if (titulo === "Dados de Entrada" && (d.label === "Cliente" || d.label === "Projeto" || d.label === "Referência")) return;

      let xAtual = margemEsquerda;
      let valorFinal = d.value || " ";
      if (d.unidade) valorFinal += ` ${d.unidade}`;

      const linhasLabel = doc.splitTextToSize(d.label, larguraMaximaLabel);

      if (d.subscript) {
        // Renderiza múltiplas linhas com subscrito apenas na primeira
        linhasLabel.forEach((linha, idx) => {
          if (idx === 0) {
            const largura = textoComSubscrito(doc, xAtual, y, linha, d.subscript);
            doc.text(`${valorFinal}`, colunaValores, y, { align: "right" });
          } else {
            doc.text(linha, xAtual, y);
          }
          y += ESPACO_LINHA;
        });
      } else {
        // Sem subscrito, renderiza normalmente
        linhasLabel.forEach((linha, idx) => {
          doc.text(linha, xAtual, y);
          if (idx === 0) {
            doc.text(`${valorFinal}`, colunaValores, y, { align: "right" });
          }
          y += ESPACO_LINHA;
        });
      }

      // Linha cinza de separação
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(margemEsquerda, y - 4, pw - margemDireita, y - 4);
      doc.setDrawColor(0, 0, 0);

      // Verifica quebra de página
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFont('noto', 'normal');
        doc.setFontSize(11);
      }
    });

    y += ESPACO_LINHA;
  }
  return y;
}

function visualizarPdfcalculo1() {
  Promise.all([
    fetch('Fontes_PDF/NotoSans-Regular.txt').then(r => r.text()),
    fetch('Fontes_PDF/NotoSans-Bold.txt').then(r => r.text()),
    fetch('imagens/LogoEnengcomfundo.png').then(res => res.blob()).then(blob => URL.createObjectURL(blob))
  ])
  .then(([base64FonteRegular, base64FonteBold, logoUrl]) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();

    doc.addFileToVFS('NotoSans-Regular.ttf', base64FonteRegular);
    doc.addFont('NotoSans-Regular.ttf', 'noto', 'normal');
    doc.addFileToVFS('NotoSans-Bold.ttf', base64FonteBold);
    doc.addFont('NotoSans-Bold.ttf', 'noto', 'bold');

    doc.setFont('noto', 'normal');
    doc.setFontSize(15);
    let y = ESPACO_TITULO_PRINCIPAL;

    const img = new Image();
    img.src = logoUrl;
    img.onload = function() {
      const imgWidth = 40;
      const aspectRatio = img.width / img.height;
      const imgHeight = imgWidth / aspectRatio;
      const imgX = pw - imgWidth - 10;
      const imgY = 15;
      doc.addImage(logoUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);

doc.setFont('noto', 'bold');
doc.setTextColor(0, 0, 255); // Azul
doc.text('CÁLCULO DAS CARACTERÍSTICAS GEOMÉTRICAS', margemEsquerda, y, { align: 'left' });
y += 9;
doc.text('DE ENGRENAGENS CILÍNDRICAS', margemEsquerda, y, { align: 'left' });
doc.setTextColor(0, 0, 0); // Volta ao preto
      y += 20;

      y = renderizaSecao(coletarCamposPorSecao('entrada'), 'Dados de Entrada', doc, y, pw);
      y = renderizaSecao(coletarCamposPorSecao('geral'), 'Resultados Gerais', doc, y, pw);
      // *** Aqui entra a quebra de página manual ***
      doc.addPage();
      y = 25; // Ou qualquer valor que você usa para o topo da página
      y = renderizaSecao(coletarCamposPorSecao('resultado1'), 'Engrenagem 1', doc, y, pw);
      // *** Aqui entra a quebra de página manual ***
      doc.addPage();
      y = 25; // Ou qualquer valor que você usa para o topo da página
      y = renderizaSecao(coletarCamposPorSecao('resultado2'), 'Engrenagem 2', doc, y, pw);

      // Aqui entra o alerta:
      y = renderizaAvisoEspessura(doc, y, pw);

function renderizaAvisoEspessura(doc, y, pw) {
  const sa1maxxmax = extrairNumero(getValorCampo('#sa1maxxmax'));
  const sa2maxxmax = extrairNumero(getValorCampo('#sa2maxxmax'));
  const saminimo   = extrairNumero(getValorCampo('#sa-minimo'));

  doc.setFont('noto', 'normal');
  doc.setFontSize(12);
  y += 20;

  if (!isNaN(sa1maxxmax) && !isNaN(saminimo) && sa1maxxmax < saminimo) {
    doc.setTextColor(255, 0, 0);
    const msg = [
      'Atenção: a espessura no diâmetro de cabeça da engrenagem 1 esta menor que o',
      'mínimo permitido.'
    ];
    doc.text(msg, margemEsquerda, y);
    y += msg.length * 7;
  }

  if (!isNaN(sa2maxxmax) && !isNaN(saminimo) && sa2maxxmax < saminimo) {
    doc.setTextColor(255, 0, 0);
    const msg = [
      'Atenção: a espessura no diâmetro de cabeça da engrenagem 2 esta menor que o',
      'mínimo permitido.'
    ];
    doc.text(msg, margemEsquerda, y);
    y += msg.length * 7;
  }

  doc.setTextColor(0, 0, 0);
  return y;
}

      adicionarRodape(doc);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
  })
  .catch(err => {
    console.error('Erro ao carregar fontes ou gerar PDF:', err);
    alert('Erro ao gerar PDF: ' + err.message);
  });
}

function adicionarRodape(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dataAtual = new Date().toLocaleString();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('noto', 'normal');
    doc.setFontSize(9);
    doc.text('www.eneng.com.br', margemEsquerda, pageHeight - 10);
    doc.text(dataAtual, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`${i}/${pageCount}`, pageWidth - margemDireita, pageHeight - 10, { align: 'right' });
  }
}

window.visualizarPdfcalculo1 = visualizarPdfcalculo1;
