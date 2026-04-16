(() => {
  const searchInput = document.querySelector('[data-service-search]');
  const categorySelect = document.querySelector('[data-service-category-select]');
  const cards = Array.from(document.querySelectorAll('[data-service-card]'));
  const countLabel = document.querySelector('[data-service-count]');
  const emptyState = document.querySelector('[data-service-empty]');
  const resetButton = document.querySelector('[data-service-reset]');

  if (!searchInput || !categorySelect || cards.length === 0) {
    return;
  }

  const indexedCards = cards.map((card) => ({
    element: card,
    text: card.textContent.toLowerCase(),
    category: (card.dataset.category || 'all').toLowerCase(),
  }));

  const applyFilters = () => {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    let visibleCount = 0;

    indexedCards.forEach((item) => {
      const categoryMatch = category === 'all' || item.category === category;
      const searchMatch = !query || item.text.includes(query);
      const isVisible = categoryMatch && searchMatch;

      item.element.classList.toggle('is-hidden', !isVisible);
      item.element.setAttribute('aria-hidden', String(!isVisible));

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (countLabel) {
      countLabel.textContent = `${visibleCount} qyzmet tabyldy`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      searchInput.value = '';
      categorySelect.value = 'all';
      applyFilters();
      searchInput.focus();
    });
  }

  applyFilters();
})();
