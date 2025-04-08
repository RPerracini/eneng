document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o relógio existe antes de tentar atualizar
    const relogio = document.getElementById("relogio");
    
    // if (relogio) {
    //     // Função para atualizar o relógio
    //     function atualizarRelogio() {
    //         const agora = new Date();
    //         const horas = agora.getHours().toString().padStart(2, '0');
    //         const minutos = agora.getMinutes().toString().padStart(2, '0');
    //         const segundos = agora.getSeconds().toString().padStart(2, '0');
    //         relogio.textContent = `${horas}:${minutos}:${segundos}`;
    //     }

    //     // Atualiza o relógio ao carregar e a cada segundo
    //     atualizarRelogio();
    //     setInterval(atualizarRelogio, 1000);
    // } else {
    //     console.error("Elemento de relógio não encontrado.");
    // }
});
