const tabelaAsne = [
  { min: 0, max: 10, valores: { a: 100, ab: 85, b: 70, bc: 58, c: 48, cd: 40, d: 33, e: 22, f: 10, g: 5 } },
  { min: 10, max: 50, valores: { a: 135, ab: 110, b: 95, bc: 75, c: 65, cd: 54, d: 44, e: 30, f: 14, g: 7 } },
  { min: 50, max: 125, valores: { a: 180, ab: 150, b: 125, bc: 105, c: 85, cd: 70, d: 60, e: 40, f: 19, g: 9 } },
  { min: 125, max: 280, valores: { a: 250, ab: 200, b: 170, bc: 140, c: 115, cd: 95, d: 80, e: 56, f: 25, g: 12 } },
  { min: 280, max: 560, valores: { a: 330, ab: 280, b: 230, bc: 190, c: 155, cd: 130, d: 110, e: 75, f: 35, g: 17 } },
  { min: 560, max: 1000, valores: { a: 450, ab: 370, b: 310, bc: 260, c: 210, cd: 175, d: 145, e: 100, f: 48, g: 22 } },
  { min: 1000, max: 1600, valores: { a: 600, ab: 500, b: 420, bc: 340, c: 290, cd: 240, d: 200, e: 135, f: 64, g: 30 } },
  { min: 1600, max: 2500, valores: { a: 820, ab: 680, b: 560, bc: 460, c: 390, cd: 320, d: 270, e: 180, f: 85, g: 41 } },
  { min: 2500, max: 4000, valores: { a: 1100, ab: 920, b: 760, bc: 620, c: 520, cd: 430, d: 360, e: 250, f: 115, g: 56 } },
  { min: 4000, max: 6300, valores: { a: 1500, ab: 1250, b: 1020, bc: 840, c: 700, cd: 580, d: 480, e: 330, f: 155, g: 75 } },
  { min: 6300, max: 8000, valores: { a: 2000, ab: 1650, b: 1350, bc: 1150, c: 940, cd: 780, d: 640, e: 450, f: 210, g: 100 } }
];

function buscarAsne(diametro, categoria) {
  const d = parseFloat(diametro?.replace(",", "."));
  if (isNaN(d) || !categoria) return "-";
  const faixa = tabelaAsne.find(row => d > row.min && d <= row.max);
  return faixa ? `-${faixa.valores[categoria]} µm` : "Fora da faixa";

}

function atualizarAsneMicrons() {
  const categoria = document.getElementById("desvioPermitido")?.value;

  const d1 = document.getElementById("d1_input")?.value;
  const d2 = document.getElementById("d2")?.textContent;

  const asne1 = buscarAsne(d1, categoria);
  const asne2 = buscarAsne(d2, categoria);

  document.getElementById("asne1").textContent = asne1;
  document.getElementById("asne2").textContent = asne2;

  calcularAsni();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("d1_input")?.addEventListener("input", atualizarAsneMicrons);
  document.getElementById("desvioPermitido")?.addEventListener("change", atualizarAsneMicrons);

  // Se #d2 for atualizado por JS, observe via MutationObserver:
  const d2Node = document.getElementById("d2");
  if (d2Node) {
    new MutationObserver(atualizarAsneMicrons).observe(d2Node, { childList: true });
  }

  atualizarAsneMicrons();
});
