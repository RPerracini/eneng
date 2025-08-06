const tabelaTsn = [
  { min: 0, max: 10, valores: [3, 5, 8, 12, 20, 30, 50, 80, 30, 200] },
  { min: 10, max: 50, valores: [5, 8, 12, 20, 30, 50, 80, 130, 200, 300] },
  { min: 50, max: 125, valores: [6, 10, 16, 25, 40, 60, 100, 160, 250, 400] },
  { min: 125, max: 280, valores: [8, 12, 20, 30, 50, 80, 130, 200, 300, 500] },
  { min: 280, max: 560, valores: [10, 16, 25, 40, 60, 100, 160, 250, 400, 600] },
  { min: 560, max: 1000, valores: [12, 20, 30, 50, 80, 130, 200, 300, 500, 800] },
  { min: 1000, max: 1600, valores: [16, 25, 40, 60, 100, 160, 250, 400, 600, 1000] },
  { min: 1600, max: 2500, valores: [20, 30, 50, 80, 130, 200, 300, 500, 800, 1300] },
  { min: 2500, max: 4000, valores: [25, 40, 60, 100, 160, 250, 400, 600, 1000, 1600] },
  { min: 4000, max: 6300, valores: [30, 50, 80, 130, 200, 300, 500, 800, 1300, 2000] },
  { min: 6300, max: Infinity, valores: [40, 60, 100, 160, 250, 400, 600, 1000, 1600, 2400] }
];

function buscarTsn(diametro, grauTolerancia) {
  const d = parseFloat(diametro?.replace(",", "."));
  const grau = parseInt(grauTolerancia);
  if (isNaN(d) || isNaN(grau) || grau < 21 || grau > 30) return "-";
  const faixa = tabelaTsn.find(row => d > row.min && d <= row.max);
return faixa ? `-${faixa.valores[grau - 21]} µm` : "Fora da faixa";
}

function atualizarTsnMicrons() {
  const grau = document.getElementById("grauTolerancia")?.value;
  const d1 = document.getElementById("d1_input")?.value;
  const d2 = document.getElementById("d2")?.textContent;

  const tsn1 = buscarTsn(d1, grau);
  const tsn2 = buscarTsn(d2, grau);

  document.getElementById("tsn1").textContent = tsn1;
  document.getElementById("tsn2").textContent = tsn2;

  calcularAsni();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("d1_input")?.addEventListener("input", atualizarTsnMicrons);
  document.getElementById("grauTolerancia")?.addEventListener("change", atualizarTsnMicrons);

  const d2Node = document.getElementById("d2");
  if (d2Node) {
    new MutationObserver(atualizarTsnMicrons).observe(d2Node, { childList: true });
  }

  atualizarTsnMicrons();
});

function calcularAsni() {
  const asne1Str = document.getElementById("asne1").textContent;
  const asne2Str = document.getElementById("asne2").textContent;
  const tsn1Str = document.getElementById("tsn1").textContent;
  const tsn2Str = document.getElementById("tsn2").textContent;

  const num = s => parseFloat((s || "").replace("µm", "").replace(",", "."));

  const sum = (a, b) => isNaN(a) || isNaN(b) ? "-" : `${a + b} µm`;

  const asni1 = sum(num(asne1Str), num(tsn1Str));
  const asni2 = sum(num(asne2Str), num(tsn2Str));

  document.getElementById("asni1").textContent = asni1;
  document.getElementById("asni2").textContent = asni2;
}
