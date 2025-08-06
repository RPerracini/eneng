document.addEventListener("DOMContentLoaded", function () {
    const campos = [
        document.getElementById("mn"),
        document.getElementById("z1"),
        document.getElementById("z2"),
    ];

    const botaoReset = document.getElementById("btnReset");
    const campoFinal = document.getElementById("z2");
    const divMensagem = document.getElementById("mensagemAviso1");

    let camposBloqueados = false;

    function bloquearCampos1() {
        camposBloqueados = true;
        campos.forEach(campo => campo.readOnly = true);
    }

    function liberarCampos1() {
        camposBloqueados = false;
        campos.forEach(campo => campo.readOnly = false);
    }

    function exibirMensagem1(texto) {
        divMensagem.textContent = texto;
        divMensagem.style.display = "block";

        setTimeout(() => {
            divMensagem.style.display = "none";
        }, 3000);
    }

    campoFinal.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            setTimeout(() => {
                bloquearCampos1();
            }, 0);
        }
    });

    campoFinal.addEventListener("blur", function () {
        bloquearCampos1();
    });

    campos.forEach(campo => {
        campo.addEventListener("focus", function () {
            if (camposBloqueados) {
                exibirMensagem1("Esses campos estão bloqueados. Use o botão 'Resetar' para liberá-los.");
                campo.blur();
            }
        });

        campo.addEventListener("click", function () {
            if (camposBloqueados) {
                exibirMensagem1("Esses campos estão bloqueados. Use o botão 'Resetar' para liberá-los.");
            }
        });
    });

    botaoReset.addEventListener("click", function () {
        liberarCampos1();
    });
});
