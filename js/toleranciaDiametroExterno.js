// Tabela simplificada ISO 286 (h7, h8, h9)
const toleranciaISO = [
  { max: 3,     IT7: 6,  IT8: 10, IT9: 14 },
  { max: 6,     IT7: 8,  IT8: 14, IT9: 20 },
  { max: 10,    IT7: 10, IT8: 18, IT9: 27 },
  { max: 18,    IT7: 12, IT8: 22, IT9: 33 },
  { max: 30,    IT7: 15, IT8: 27, IT9: 39 },
  { max: 50,    IT7: 18, IT8: 33, IT9: 46 },
  { max: 80,    IT7: 21, IT8: 39, IT9: 54 },
  { max: 120,   IT7: 25, IT8: 46, IT9: 63 },
  { max: 180,   IT7: 30, IT8: 54, IT9: 72 },
  { max: 250,   IT7: 36, IT8: 63, IT9: 83 },
  { max: 315,   IT7: 43, IT8: 72, IT9: 96 },
  { max: 400,   IT7: 50, IT8: 81, IT9: 109 },
  { max: 500,   IT7: 58, IT8: 93, IT9: 123 },
  { max: 630,   IT7: 67, IT8: 106, IT9: 139 },
  { max: 800,   IT7: 77, IT8: 120, IT9: 156 },
  { max: 1000,  IT7: 89, IT8: 135, IT9: 175 },
  { max: 1250,  IT7: 100,IT8: 150, IT9: 195 },
  { max: 1600,  IT7: 115,IT8: 170, IT9: 220 },
  { max: 2000,  IT7: 130,IT8: 190, IT9: 245 },
  { max: 2500,  IT7: 150,IT8: 215, IT9: 275 },
  { max: 3150,  IT7: 170,IT8: 240, IT9: 310 }
];

// Função para obter tolerância
function getTolerancia(diametro, classe) {
  if (diametro <= 0 || diametro > 3150) {
    return `Diâmetro fora da faixa suportada (0 - 3150 mm).`;
  }

  const linha = toleranciaISO.find(l => diametro <= l.max);
  if (!linha || !linha[`IT${classe}`]) {
    return `Classe de tolerância inválida. Use 7, 8 ou 9.`;
  }

  const IT = linha[`IT${classe}`];
  return {
    diametro,
    classe: `h${classe}`,
    limiteInferior: 0,
    limiteSuperior: IT / 1000  // converter micrômetros para milímetros
  };
}

// Exemplo de uso:
console.log(getTolerancia(45, 7)); // saída: { diametro: 45, classe: 'h7', limiteInferior: 0, limiteSuperior: 0.018 }
