export function initDirectory(): void {
  const root = document.querySelector('[data-directory]');
  if (!root) return;

  const allItems = [...root.querySelectorAll('[data-tool], [data-tool-card]')];
  const rows = [...root.querySelectorAll<HTMLElement>('tr[data-tool]')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-tool-card]')];
  const search = root.querySelector('[data-search]');
  const sort = root.querySelector('[data-sort]');
  const count = root.querySelector('[data-results-count]');
  const announce = root.querySelector('[data-announcement]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const tray = root.querySelector('[data-compare-tray]');
  const compareButton = root.querySelector<HTMLButtonElement>(
    '[data-open-compare]',
  );
  const projectBase = ((root as HTMLElement).dataset.base ?? '/').replace(
    /\/+$/,
    '',
  );
  const selected = new Set<string>(
    JSON.parse(sessionStorage.getItem('ptt-compare') || '[]'),
  );
  const params = new URLSearchParams(location.search);
  const keyMap: Record<string, string> = {
    category: 'category',
    license: 'license',
    deployment: 'deployment',
    status: 'status',
    language: 'language',
    protocol: 'protocol',
    pick: 'pick',
  };
  const values = (key: string) =>
    [
      ...root.querySelectorAll<HTMLInputElement>(
        `[data-filter="${key}"]:checked`,
      ),
    ].map((input) => input.value);
  const matches = (item: Element) => {
    const query = (search as HTMLInputElement)?.value.toLowerCase() || '';
    const text =
      `${item.getAttribute('data-name')} ${item.getAttribute('data-vendor')} ${item.getAttribute('data-description')} ${item.getAttribute('data-tags')} ${item.getAttribute('data-category')} ${item.getAttribute('data-language')} ${item.getAttribute('data-protocol')}`.toLowerCase();
    if (query && !text.includes(query)) return false;
    for (const key of Object.keys(keyMap)) {
      const wanted = values(key);
      if (
        wanted.length &&
        !wanted.some((value) =>
          (item.getAttribute(`data-${key}`) || '').split('|').includes(value),
        )
      )
        return false;
    }
    return true;
  };
  const syncUrl = () => {
    const next = new URLSearchParams();
    if ((search as HTMLInputElement).value)
      next.set('q', (search as HTMLInputElement).value);
    for (const key of Object.keys(keyMap))
      values(key).forEach((value) => next.append(key, value));
    if ((sort as HTMLSelectElement).value !== 'name')
      next.set('sort', (sort as HTMLSelectElement).value);
    history.replaceState(
      null,
      '',
      `${location.pathname}${next.toString() ? `?${next}` : ''}`,
    );
  };
  const update = () => {
    const matchState = new Map(allItems.map((item) => [item, matches(item)]));
    const visible = allItems.filter((item) => matchState.get(item));
    allItems.forEach((item) => {
      (item as HTMLElement).hidden = !matchState.get(item);
    });
    const sortItems = (a: HTMLElement, b: HTMLElement) => {
      const field = (sort as HTMLSelectElement).value;
      if (field === 'released') {
        const aYear = a.dataset.released
          ? Number(a.dataset.released)
          : Number.NaN;
        const bYear = b.dataset.released
          ? Number(b.dataset.released)
          : Number.NaN;
        if (!Number.isFinite(aYear)) return Number.isFinite(bYear) ? 1 : 0;
        if (!Number.isFinite(bYear)) return -1;
        return aYear - bYear;
      }
      return (a.dataset[field] || '').localeCompare(
        b.dataset[field] || '',
        undefined,
        { numeric: true },
      );
    };
    const sorted = [...rows].sort(sortItems);
    sorted.forEach((item) => rows[0]?.parentElement?.append(item));
    const sortedCards = [...cards].sort(sortItems);
    sortedCards.forEach((item) => cards[0]?.parentElement?.append(item));
    if (count)
      count.textContent = String(
        visible.filter((item) => item.matches('tr')).length,
      );
    if (announce)
      announce.textContent = `${visible.filter((item) => item.matches('tr')).length} results`;
    if (empty)
      empty.hidden = visible.filter((item) => item.matches('tr')).length !== 0;
    syncUrl();
  };
  root
    .querySelectorAll<HTMLInputElement>('[data-filter]')
    .forEach((input) => input.addEventListener('change', update));
  search?.addEventListener('input', update);
  sort?.addEventListener('change', update);
  root
    .querySelectorAll<HTMLButtonElement>('[data-clear-filters]')
    .forEach((button) =>
      button.addEventListener('click', () => {
        root
          .querySelectorAll<HTMLInputElement>('[data-filter]')
          .forEach((input) => {
            input.checked = false;
          });
        (search as HTMLInputElement).value = '';
        update();
      }),
    );
  const restore = (key: string, value: string) =>
    root
      .querySelectorAll<HTMLInputElement>(
        `[data-filter="${key}"][value="${CSS.escape(value)}"]`,
      )
      .forEach((input) => {
        input.checked = true;
        const subDetails = input.closest('details');
        if (subDetails) subDetails.open = true;
      });
  let hasActiveFilters = false;
  params.forEach((value, key) => {
    if (key === 'q' && search) (search as HTMLInputElement).value = value;
    else if (key === 'sort' && sort) (sort as HTMLSelectElement).value = value;
    else if (keyMap[key]) {
      restore(key, value);
      hasActiveFilters = true;
    }
  });
  if (hasActiveFilters) {
    const disclosure =
      root.querySelector<HTMLDetailsElement>('.filter-disclosure');
    if (disclosure) disclosure.open = true;
  }
  const renderCompare = () => {
    root
      .querySelectorAll<HTMLInputElement>('[data-compare]')
      .forEach((input) => {
        input.checked = selected.has(input.dataset.compare || '');
      });
    sessionStorage.setItem('ptt-compare', JSON.stringify([...selected]));
    if (tray) (tray as HTMLElement).hidden = selected.size === 0;
    const chipBox = root.querySelector('[data-compare-chips]');
    if (chipBox) {
      chipBox.replaceChildren(
        ...[...selected].map((slug) => {
          const chip = document.createElement('span');
          chip.className = 'compare-chip';
          const label = document.createElement('span');
          label.textContent =
            root.querySelector(`[data-tool="${CSS.escape(slug)}"] .tool-name`)
              ?.textContent || slug;
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'compare-chip-remove';
          remove.setAttribute(
            'aria-label',
            `Remove ${label.textContent} from Test Rig`,
          );
          remove.textContent = '×';
          remove.addEventListener('click', () => {
            selected.delete(slug);
            renderCompare();
          });
          chip.append(label, remove);
          return chip;
        }),
      );
    }
    const compareCount = root.querySelector('[data-compare-count]');
    if (compareCount)
      compareCount.textContent = `${selected.size} / 3 selected`;
    if (compareButton) {
      compareButton.disabled = selected.size < 2;
      compareButton.onclick = () => {
        location.href = `${projectBase}/compare?tools=${[...selected].join(',')}`;
      };
    }
  };
  const compareFeedback = root.querySelector<HTMLElement>(
    '[data-compare-feedback]',
  );
  let compareFeedbackTimer: ReturnType<typeof setTimeout> | undefined;
  root.querySelectorAll<HTMLInputElement>('[data-compare]').forEach((input) =>
    input.addEventListener('change', () => {
      if (input.checked && selected.size >= 3) {
        input.checked = false;
        if (compareFeedback) {
          compareFeedback.textContent = 'Maximum 3 tools';
          clearTimeout(compareFeedbackTimer);
          compareFeedbackTimer = setTimeout(() => {
            compareFeedback.textContent = '';
          }, 1800);
        }
        return;
      }
      if (input.checked) selected.add(input.dataset.compare!);
      else selected.delete(input.dataset.compare!);
      renderCompare();
    }),
  );
  renderCompare();
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((button) =>
    button.addEventListener('click', () => {
      root
        .querySelectorAll<HTMLButtonElement>('[data-view]')
        .forEach((item) => {
          item.classList.remove('selected');
          item.setAttribute('aria-pressed', String(item === button));
        });
      button.classList.add('selected');
      root.classList.toggle('grid-mode', button.dataset.view === 'grid');
    }),
  );
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    if (
      event.key === '/' &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    ) {
      event.preventDefault();
      (search as HTMLInputElement)?.focus();
    }
  });
  const palette = root.querySelector<HTMLElement>('[data-palette]');
  const paletteInput = root.querySelector<HTMLInputElement>(
    '[data-palette-search]',
  );
  const paletteResults = root.querySelector<HTMLElement>(
    '[data-palette-results]',
  );
  const paletteOpener = root.querySelector<HTMLElement>('[data-palette-open]');
  const paletteCategories = [
    ...new Set(
      allItems.map((item) => item.getAttribute('data-category') || ''),
    ),
  ];
  const paletteFilters = [
    'Open Source',
    'Commercial',
    'Freemium',
    'Cloud',
    'Self-hosted',
    'Active',
    'Discontinued',
    'Unknown',
  ].map((value) => ({ label: `Filter: ${value}`, filter: value }));
  const openPalette = () => {
    if (!palette) return;
    palette.hidden = false;
    paletteInput?.focus();
    renderPalette('');
  };
  const closePalette = () => {
    if (palette) palette.hidden = true;
    paletteOpener?.focus();
  };
  let paletteIndex = 0;
  const renderPalette = (query: string) => {
    if (!paletteResults) return;
    const toolsEntries = [
      ...root.querySelectorAll<HTMLAnchorElement>('tr[data-tool] .tool-name'),
    ].map((link) => ({ label: link.textContent || '', href: link.href }));
    const entries = [
      ...toolsEntries,
      ...paletteCategories.map((cat) => ({
        label: `Category: ${cat}`,
        href: `${projectBase}/categories/${cat.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`,
      })),
      ...paletteFilters,
    ];
    const filtered = entries
      .filter((entry) =>
        entry.label.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 12);
    paletteResults.replaceChildren();
    filtered.forEach((entry, index) => {
      const item = document.createElement('href' in entry ? 'a' : 'button');
      item.className = 'palette-item focus-ring';
      item.textContent = entry.label;
      item.dataset.paletteIndex = String(index);
      if ('href' in entry) (item as HTMLAnchorElement).href = entry.href;
      if ('filter' in entry)
        (item as HTMLButtonElement).addEventListener('click', () => {
          const input = root.querySelector<HTMLInputElement>(
            `[data-filter][value="${CSS.escape(entry.filter)}"]`,
          );
          if (input) {
            input.checked = true;
            update();
          }
          closePalette();
        });
      paletteResults.append(item);
    });
    paletteIndex = 0;
  };
  const movePalette = (delta: number) => {
    const items = [
      ...(paletteResults?.querySelectorAll<HTMLElement>('.palette-item') || []),
    ];
    if (!items.length) return;
    paletteIndex = (paletteIndex + delta + items.length) % items.length;
    items.forEach((item, index) =>
      item.classList.toggle('selected', index === paletteIndex),
    );
    items[paletteIndex]?.focus();
  };
  paletteInput?.addEventListener('input', () =>
    renderPalette(paletteInput.value),
  );
  root
    .querySelector('[data-palette-open]')
    ?.addEventListener('click', openPalette);
  root
    .querySelector('[data-palette-close]')
    ?.addEventListener('click', closePalette);
  palette?.addEventListener('click', (event) => {
    if (event.target === palette) closePalette();
  });
  paletteInput?.addEventListener('keydown', (event) => {
    const items = [
      ...(paletteResults?.querySelectorAll<HTMLElement>('.palette-item') || []),
    ];
    if (
      (event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
      items.length
    ) {
      event.preventDefault();
      movePalette(event.key === 'ArrowDown' ? 1 : -1);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      items[paletteIndex]?.click();
    }
  });
  paletteResults?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      movePalette(event.key === 'ArrowDown' ? 1 : -1);
    }
  });
  palette?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [
      ...palette.querySelectorAll<HTMLElement>('button, input, a[href]'),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openPalette();
    }
    if (event.key === 'Escape' && palette && !palette.hidden) closePalette();
  });
  update();
}

initDirectory();
