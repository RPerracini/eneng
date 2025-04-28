// modal.js - Versão com debug
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM carregado!'); // Debug 1

    const modal = document.getElementById('avisoModal');
    const btnAviso = document.getElementById('btnAviso');
    const spanClose = document.querySelector('.close-modal');

    console.log('Elementos:', { modal, btnAviso, spanClose }); // Debug 2

    if (!modal || !btnAviso || !spanClose) {
        console.error('Elementos não encontrados!');
        return;
    }

    btnAviso.addEventListener('click', () => {
        console.log('Botão clicado!'); // Debug 3
        modal.style.display = 'block';
    });

    spanClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
