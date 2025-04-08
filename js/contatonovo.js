// contatonovo.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contato-form");
  const arquivosInput = document.getElementById("arquivos");
  const listaArquivos = document.getElementById("lista-arquivos");
  const tamanhoTotalDiv = document.getElementById("tamanho-total");
  const botaoEnviar = form.querySelector("button[type='submit']");

  const camposObrigatorios = [
    document.getElementById("nome"),
    document.getElementById("email"),
    document.getElementById("mensagem")
  ];

  function validarFormulario() {
    const todosPreenchidos = camposObrigatorios.every(campo => campo.value.trim() !== "");
    const captchaRespondido = grecaptcha.getResponse().trim() !== "";

    if (todosPreenchidos && captchaRespondido) {
      botaoEnviar.disabled = false;
      botaoEnviar.style.opacity = "1";
      botaoEnviar.style.cursor = "pointer";
    } else {
      botaoEnviar.disabled = true;
      botaoEnviar.style.opacity = "0.6";
      botaoEnviar.style.cursor = "not-allowed";
    }
  }

  camposObrigatorios.forEach(campo => {
    campo.addEventListener("input", validarFormulario);
  });

  window.validarRecaptcha = validarFormulario; // usado pelo reCAPTCHA callback

  arquivosInput.addEventListener("change", () => {
    const arquivos = Array.from(arquivosInput.files);
    listaArquivos.innerHTML = "";

    if (arquivos.length > 5) {
      alert("Você pode enviar no máximo 5 arquivos.");
      arquivosInput.value = "";
      tamanhoTotalDiv.textContent = "";
      return;
    }

    let totalBytes = 0;

    arquivos.forEach(arquivo => {
      const item = document.createElement("div");
      item.textContent = `${arquivo.name} (${(arquivo.size / 1024 / 1024).toFixed(2)} MB)`;
      listaArquivos.appendChild(item);
      totalBytes += arquivo.size;
    });

    const totalMB = totalBytes / 1024 / 1024;
    tamanhoTotalDiv.textContent = `Total: ${totalMB.toFixed(2)} MB`;

    if (totalMB > 20) {
      alert("O tamanho total dos arquivos não pode ultrapassar 20 MB.");
      arquivosInput.value = "";
      listaArquivos.innerHTML = "";
      tamanhoTotalDiv.textContent = "";
    }
  });
});
