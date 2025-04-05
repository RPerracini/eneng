document.addEventListener("DOMContentLoaded", () => {
    // Carrega o header
    fetch('header-nav.html')
      .then(response => response.text())
      .then(data => document.getElementById('header').innerHTML = data);
  
    // Carrega o footer
    fetch('footer.html')
      .then(response => response.text())
      .then(data => document.getElementById('footer').innerHTML = data);
  
    // Mostra os arquivos selecionados
    const input = document.getElementById("arquivos");
    const fileNames = document.getElementById("file-names");
  
    if (input && fileNames) {
      input.addEventListener("change", () => {
        const files = Array.from(input.files).map(file => file.name);
        fileNames.textContent = files.length
          ? files.join(", ")
          : "Nenhum arquivo selecionado";
      });
    }
  });
  