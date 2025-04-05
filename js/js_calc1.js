document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('meuFormulario');
    if (!form) {
        console.error('Formulário não encontrado. Verifique o ID "meuFormulario".');
        return;
    }

    const btnEnviar = form.querySelector('button[type="submit"]');
    if (!btnEnviar) {
        console.error('Botão de envio não encontrado.');
        return;
    }

    // Configuração inicial do botão
    btnEnviar.style.transition = 'opacity 0.3s ease';
    btnEnviar.style.opacity = '0.6';
    btnEnviar.style.cursor = 'not-allowed';
    btnEnviar.disabled = true;

    // Máscaras para telefone (XXXX-XXXX ou XXXXX-XXXX)
    function aplicarMascaraTelefone(input) {
        if (!input) return;

        input.addEventListener('input', function(e) {
            // Apenas para campos de número (não DDD)
            if (e.target.id.includes('ddd')) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) value = value.substring(0, 2);
                e.target.value = value;
                verificarCamposPreenchidos();
                return;
            }
            
            // Para campos de número (telefone/whatsapp)
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 9) value = value.substring(0, 9);
            
            // Formatação dinâmica (XXXX-XXXX ou XXXXX-XXXX)
            let formattedValue = value;
            if (value.length > 5) {
                formattedValue = formattedValue.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
            } else if (value.length > 4) {
                formattedValue = formattedValue.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
            }

            e.target.value = formattedValue;
            verificarCamposPreenchidos();
        });
    }

    // Verificação de campos preenchidos
    function verificarCamposPreenchidos() {
        const camposObrigatorios = [
            form.elements.nome?.value.trim(),
            form.elements.email?.value.trim(),
            form.elements.ddi_telefone?.value,
            form.elements.ddd_telefone?.value.trim(),
            form.elements.telefone?.value.trim(),
            form.elements.ddi_whatsapp?.value,
            form.elements.ddd_whatsapp?.value.trim(),
            form.elements.whatsapp?.value.trim(),
            form.elements.empresa?.value.trim(),
            form.elements.funcao?.value.trim(),
            [...form.elements.experiencia || []].some(radio => radio.checked)
        ];

        const todosPreenchidos = camposObrigatorios.every(campo => !!campo);
        const telefoneValido = form.elements.telefone?.value.replace(/\D/g, '').length >= 8;
        const whatsappValido = form.elements.whatsapp?.value.replace(/\D/g, '').length >= 8;
        const dddTelefoneValido = form.elements.ddd_telefone?.value.length === 2;
        const dddWhatsappValido = form.elements.ddd_whatsapp?.value.length === 2;

        btnEnviar.disabled = !todosPreenchidos || !telefoneValido || !whatsappValido || !dddTelefoneValido || !dddWhatsappValido;
        btnEnviar.style.opacity = btnEnviar.disabled ? '0.6' : '1';
        btnEnviar.style.cursor = btnEnviar.disabled ? 'not-allowed' : 'pointer';
    }

    // Sincronizar DDIs
    function sincronizarDDIs() {
        const ddiTelefone = document.getElementById('ddi-telefone');
        const ddiWhatsapp = document.getElementById('ddi-whatsapp');
        
        ddiTelefone.addEventListener('change', function() {
            if (this.value === ddiWhatsapp.value) return;
            if (confirm('Deseja usar o mesmo DDI para o WhatsApp?')) {
                ddiWhatsapp.value = this.value;
                verificarCamposPreenchidos();
            }
        });
    }

    // Event listeners
    const eventos = ['input', 'change', 'paste'];
    const camposParaMonitorar = [
        form.elements.nome,
        form.elements.email,
        form.elements.ddi_telefone,
        form.elements.ddd_telefone,
        form.elements.telefone,
        form.elements.ddi_whatsapp,
        form.elements.ddd_whatsapp,
        form.elements.whatsapp,
        form.elements.empresa,
        form.elements.funcao,
        ...(form.elements.experiencia || [])
    ];

    camposParaMonitorar.forEach(campo => {
        if (campo) {
            eventos.forEach(evento => {
                campo.addEventListener(evento, verificarCamposPreenchidos);
            });
        }
    });

    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (btnEnviar.classList.contains('enviando')) return;
        
        btnEnviar.classList.add('enviando');
        btnEnviar.disabled = true;

        const dados = {
            nome: form.elements.nome?.value.trim(),
            email: form.elements.email?.value.trim(),
            ddi_telefone: form.elements.ddi_telefone?.value,
            ddd_telefone: form.elements.ddd_telefone?.value.trim(),
            telefone: form.elements.telefone?.value.trim(),
            ddi_whatsapp: form.elements.ddi_whatsapp?.value,
            ddd_whatsapp: form.elements.ddd_whatsapp?.value.trim(),
            whatsapp: form.elements.whatsapp?.value.trim(),
            empresa: form.elements.empresa?.value.trim(),
            funcao: form.elements.funcao?.value.trim(),
            experiencia: [...form.elements.experiencia || []].find(r => r.checked)?.value
        };

        // Simulação de envio
        setTimeout(() => {
            console.log('Dados do formulário:', dados);
            alert('Formulário enviado com sucesso!');
            form.reset();
            btnEnviar.classList.remove('enviando');
            verificarCamposPreenchidos();
        }, 1000);
    });

    // Aplicar máscaras
    aplicarMascaraTelefone(form.elements.ddd_telefone);
    aplicarMascaraTelefone(form.elements.telefone);
    aplicarMascaraTelefone(form.elements.ddd_whatsapp);
    aplicarMascaraTelefone(form.elements.whatsapp);

    // Inicializar
    sincronizarDDIs();
    verificarCamposPreenchidos();
});