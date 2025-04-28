$(document).ready(function () {
  $('#ddi').select2({
    templateResult: formatOption,
    templateSelection: formatOption,
    minimumResultsForSearch: -1
  });

  function formatOption(state) {
    if (!state.id) return state.text;
    const flagCode = $(state.element).data('flag');
    if (!flagCode) return state.text;
    return $(`
      <span class="flag-option">
        <img src="imagens/flags/${flagCode}.svg" alt="${state.text}" />
        ${state.text}
      </span>
    `);
  }
});
