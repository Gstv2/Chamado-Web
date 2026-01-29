export const showMessage = (type, text) => {
  alert(`${type.toUpperCase()}: ${text}`); // Simple placeholder
};

export const setLoading = (element, isLoading) => {
  if (isLoading) {
    element.classList.add('loading');
    element.disabled = true;
    element.dataset.originalText = element.textContent;
    element.textContent = 'Carregando...';
  } else {
    element.classList.remove('loading');
    element.disabled = false;
    if (element.dataset.originalText) {
      element.textContent = element.dataset.originalText;
    }
  }
};
