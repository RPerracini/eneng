$(document).ready(function () {
    function formatFlag(option) {
      if (!option.id) return option.text;
      const flag = $(option.element).data('flag');
      const img = flag ? `<img src="imagens/flags/${flag}.png" style="width: 20px; margin-right: 5px;">` : '';
      return $(`<span>${img}${option.text}</span>`);
    }
  
    $('#ddi-select').select2({
      templateResult: formatFlag,
      templateSelection: formatFlag,
      minimumResultsForSearch: -1 // desativa a busca se preferir
    });
  });
  