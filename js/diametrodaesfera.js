
// calculoDoDiametroDaEsfera.js
function degToRad(deg) {
  return deg * Math.PI / 180;
}

function calculoDoDiametroDaEsfera() {
  const z1 = parseFloat(document.getElementById('z1').value);
  const z2 = parseFloat(document.getElementById('z2').value);
  const aw = parseFloat(document.getElementById('aw').value);
  const alphaNdeg = parseFloat(document.getElementById('alfa').value);
  const betaDeg = parseFloat(document.getElementById('beta').value);
  const x1 = parseFloat(document.getElementById('x1').value);
  const x2 = parseFloat(document.getElementById('x2').value);
  const mn = parseFloat(document.getElementById('mn').value);

  const alphaN = degToRad(alphaNdeg);
  const beta = degToRad(betaDeg);

  const AlfaT = Math.atan(Math.tan(alphaN) / Math.cos(beta));

  const evoAlphaT = Math.tan(AlfaT) - AlfaT;
  const evoAlphaN = Math.tan(alphaN) - alphaN;

  function calcularDiametroEsfera(z, x) {
    const znw = z * (evoAlphaT / evoAlphaN);
    const betaV = Math.atan(((z + 2 * x * Math.cos(beta)) / z) * Math.tan(beta));

    const cosAlphaNm = (Math.cos(alphaN) * Math.cos(beta)) /
      (Math.cos(betaV) * (1 + 2 * (x / z) * Math.cos(beta)));
    const alphaNm = Math.acos(cosAlphaNm);

    const kDM = (znw / Math.PI) * (Math.tan(alphaNm) - 2 * (x / znw) * Math.tan(alphaN) - evoAlphaN) + 0.5;
    const alphaKn = (kDM * Math.PI) / znw;

    const dm = znw * mn * Math.cos(alphaN) * (Math.tan(alphaKn) - Math.tan(alphaNm));

    return dm;
  }

  const dm1 = calcularDiametroEsfera(z1, x1);
  const dm2 = calcularDiametroEsfera(z2, x2);

  document.getElementById('d1calc').value = dm1.toFixed(1);
  document.getElementById('d2calc').value = dm2.toFixed(1);
}

function aproximarAnguloPorInvInvoluta(inv) {
  if (typeof inv !== 'number' || isNaN(inv)) return NaN;
  let alpha = Math.min(1, Math.sqrt(inv));
  const erro = 1e-12;
  for (let i = 0; i < 100; i++) {
    const f = Math.tan(alpha) - alpha - inv;
    const df = (1 / Math.pow(Math.cos(alpha), 2)) - 1;
    if (Math.abs(df) < 1e-10) break;
    const alphaNovo = alpha - f / df;
    if (!isFinite(alphaNovo)) return NaN;
    if (Math.abs(f) < erro) return alphaNovo;
    alpha = alphaNovo;
  }
  return alpha;
}

function safeParseFloat(value) {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.-]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function calcularMdEngrenagem(engrenagem) {
  const snNominal = safeParseFloat(document.getElementById(`espessura${engrenagem}_normal`).textContent);
  const snMinimo  = safeParseFloat(document.getElementById(`espessura${engrenagem}_minima`).textContent);
  const snMaximo  = safeParseFloat(document.getElementById(`espessura${engrenagem}_maxima`).textContent);

  const d  = safeParseFloat(document.getElementById(`d${engrenagem}`).textContent);
  const db = safeParseFloat(document.getElementById(`db${engrenagem}`).textContent);
  const z  = parseInt(document.getElementById(`z${engrenagem}`).value);
  const DM = safeParseFloat(document.getElementById(`d${engrenagem}adotado`).value);

  const alfadeg = parseFloat(document.getElementById('alfa').value);
  const alfa = degToRad(alfadeg);
  const beta = degToRad(parseFloat(document.getElementById('beta').value));
  const betab = degToRad(parseFloat(document.getElementById('beta_b').value));

  const AlfaT = Math.atan(Math.tan(alfa) / Math.cos(beta));
  const invAlphaT = Math.tan(AlfaT) - AlfaT;

  function calcularMd(sn) {
    const A = sn / (d * Math.cos(beta));
    const invAlphaKt = A + (DM / (db * Math.cos(betab))) + invAlphaT - (Math.PI / z);
    const alphaKt = aproximarAnguloPorInvInvoluta(invAlphaKt);
    const C = db / (2 * Math.cos(alphaKt));
    return (z % 2 === 0) ? 2 * C + DM : 2 * C * Math.cos((Math.PI / 2) / z) + DM;
  }

  return {
    Mdnom: calcularMd(snNominal),
    Mdmin: calcularMd(snMaximo),
    Mdmax: calcularMd(snMinimo)
  };
};
