// Arquivo: modais.js (corrigido e completo)

document.addEventListener('DOMContentLoaded', function () {
    // Fecha modal ao clicar no "X"
    document.querySelectorAll('.fechar-modal').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'none';
        });
    });

    // Fecha modal ao clicar fora da modal
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) overlay.style.display = 'none';
        });
    });

    // Funções globais para abertura de modais
    window.abrirModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.error(`Modal com ID '${id}' não encontrado.`);
        }
    };

    window.abrirModalModulos = function () {
        window.abrirModal('modalImagem');
    };
    window.abrirModalZ1 = () => abrirModal('modalImagemZ1');
    window.abrirModalRelacaoLD = () => abrirModal('modalRelacaoLD');
    window.abrirModalImagemDeslizamento = () =>
        abrirModal('modalImagemDeslizamento');
    window.abrirModalImagemX1geral = () => abrirModal('modalImagemX1geral');
    window.abrirmodalImagemX1resistenciaaflexao = () =>
        abrirModal('modalImagemX1resistenciaaflexao');
    window.abrirmodalImagemX1undercut = () =>
        abrirModal('modalImagemX1undercut');
    window.abrirModalAnguloAlfa = () => abrirModal('modalAnguloAlfa');
    window.abrirModalAnguloBeta = () => abrirModal('modalAnguloBeta');
    window.abrirModalEntreCentros = () => abrirModal('ModalEntreCentros');
    window.abrirModalTabelaClassePrecisao = () =>
        abrirModal('modalTabelaClassePrecisao');
    window.abrirModalAdendo = () => abrirModal('modalAdendo');
    window.abrirModalEspessuraMinima = () => abrirModal('modalEspessuraMinima');
    window.abrirModalToleranciaExterno = () => abrirModal('modalToleranciaExterno');


    // Formulário
    window.abrirFormulasModal = function () {
        const modal = document.getElementById('formulasModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.fecharFormulasModal = function () {
        const modal = document.getElementById('formulasModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    const btnFormulas = document.getElementById('btnFormulas');
    if (btnFormulas) {
        btnFormulas.addEventListener('click', abrirFormulasModal);
    }

    // Clicar fora da modal-content fecha o modal de fórmulas
    document.addEventListener('click', function (event) {
        const modal = document.getElementById('formulasModal');
        const content = modal?.querySelector('.modal-content');
        if (
            modal?.style.display === 'flex' &&
            !content?.contains(event.target) &&
            modal.contains(event.target)
        ) {
            fecharFormulasModal();
        }
    });

    window.abrirModal = function (id) {
        // Fecha todos os modais abertos
        document.querySelectorAll('.modal-overlay').forEach((modal) => {
            modal.style.display = 'none';
        });

        // Abre o modal solicitado
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.error(`Modal com ID '${id}' não encontrado.`);
        }
    };
});
