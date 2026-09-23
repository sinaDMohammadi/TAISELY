/* =========================
   Mobile Menu
========================= */

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute(
      'aria-label',
      open ? 'بستن منو' : 'باز کردن منو'
    );
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'باز کردن منو');
    });
  });
}


/* =========================
   Dark / Light Mode
========================= */

const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-toggle-label');

function getSavedTheme() {
  try {
    return localStorage.getItem('taisely-theme');
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('taisely-theme', theme);
  } catch (error) {
    // اگر localStorage در دسترس نبود، سایت همچنان کار می‌کند.
  }
}

function updateThemeButton() {
  if (!themeToggle) return;

  const darkMode = document.documentElement.classList.contains('dark-mode');

  themeToggle.setAttribute('aria-pressed', String(darkMode));

  themeToggle.setAttribute(
    'aria-label',
    darkMode ? 'فعال کردن حالت روز' : 'فعال کردن حالت شب'
  );

  if (themeLabel) {
    themeLabel.textContent = darkMode ? 'روز' :  شب';
  }
}


/* تم ذخیره‌شده را اعمال کن */
const savedTheme = getSavedTheme();

if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
} else {
  document.documentElement.classList.remove('dark-mode');
}

updateThemeButton();


if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const darkMode =
      document.documentElement.classList.toggle('dark-mode');

    saveTheme(darkMode ? 'dark' : 'light');

    updateThemeButton();
  });
}


/* =========================
   Toast — Products
========================= */

document.querySelectorAll('[data-soon]').forEach(button => {
  button.addEventListener('click', () => {
    const oldToast = document.querySelector('.toast');

    if (oldToast) {
      oldToast.remove();
    }

    const toast = document.createElement('div');

    toast.className = 'toast';
    toast.textContent = 'این محصول فعلاً در حال آماده‌سازی است.';

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2200);
  });
});


/* =========================
   Search + Pagination
========================= */

function setupCollection(options) {
  const {
    itemSelector,
    searchSelector,
    paginationSelector,
    emptySelector,
    filterSelector = null,
    perPage = 9
  } = options;

  const items = Array.from(document.querySelectorAll(itemSelector));
  const searchInput = document.querySelector(searchSelector);
  const pagination = document.querySelector(paginationSelector);
  const emptyState = document.querySelector(emptySelector);

  if (!items.length) {
    return;
  }

  let currentPage = 1;
  let currentQuery = '';
  let currentCategory = 'all';

  const filters = filterSelector
    ? Array.from(
        document.querySelectorAll(
          `${filterSelector} [data-category]`
        )
      )
    : [];


  function getFilteredItems() {
    return items.filter(item => {
      const text = item.textContent.toLowerCase();

      const category =
        item.dataset.category || 'all';

      const matchesSearch =
        !currentQuery ||
        text.includes(currentQuery);

      const matchesCategory =
        currentCategory === 'all' ||
        category === currentCategory;

      return matchesSearch && matchesCategory;
    });
  }


  function renderPagination(totalPages) {
    if (!pagination) return;

    pagination.innerHTML = '';

    /*
      اگر فقط یک صفحه وجود دارد،
      pagination را نشان نمی‌دهیم.
    */
    if (totalPages <= 1) {
      pagination.hidden = true;
      return;
    }

    pagination.hidden = false;


    /* قبلی */

    const previousButton = document.createElement('button');

    previousButton.type = 'button';
    previousButton.className = 'pagination-button';
    previousButton.textContent = 'صفحه قبل';
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        render();
        scrollToResults();
      }
    });

    pagination.appendChild(previousButton);


    /* شماره صفحات */

    for (let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement('button');

      pageButton.type = 'button';
      pageButton.className = 'pagination-button pagination-number';
      pageButton.textContent = page;

      if (page === currentPage) {
        pageButton.classList.add('current');
        pageButton.setAttribute('aria-current', 'page');
      }

      pageButton.addEventListener('click', () => {
        currentPage = page;
        render();
        scrollToResults();
      });

      pagination.appendChild(pageButton);
    }


    /* بعدی */

    const nextButton = document.createElement('button');

    nextButton.type = 'button';
    nextButton.className = 'pagination-button';
    nextButton.textContent = 'صفحه بعد';
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        render();
        scrollToResults();
      }
    });

    pagination.appendChild(nextButton);
  }


  function scrollToResults() {
    const firstItem = document.querySelector(itemSelector);

    if (firstItem) {
      firstItem.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }


  function render() {
    const filteredItems = getFilteredItems();

    const totalPages = Math.max(
      1,
      Math.ceil(filteredItems.length / perPage)
    );


    if (currentPage > totalPages) {
      currentPage = totalPages;
    }


    /* ابتدا همه را مخفی کن */

    items.forEach(item => {
      item.hidden = true;
    });


    /* فقط آیتم‌های صفحه فعلی را نمایش بده */

    const start =
      (currentPage - 1) * perPage;

    const end =
      start + perPage;

    filteredItems
      .slice(start, end)
      .forEach(item => {
        item.hidden = false;
      });


    /* Empty state */

    if (emptyState) {
      emptyState.hidden =
        filteredItems.length !== 0;
    }


    renderPagination(totalPages);
  }


  /* =========================
     Search
  ========================= */

  if (searchInput) {
    searchInput.addEventListener('input', event => {
      currentQuery =
        event.target.value
          .trim()
          .toLowerCase();

      currentPage = 1;

      render();
    });
  }


  /* =========================
     Filters
  ========================= */

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      currentCategory =
        filter.dataset.category || 'all';

      currentPage = 1;


      filters.forEach(button => {
        button.classList.remove('active-tag');
      });

      filter.classList.add('active-tag');

      render();
    });
  });


  render();
}


/* =========================
   Blog
========================= */

setupCollection({
  itemSelector: '.blog-row',
  searchSelector: '#blog-search',
  paginationSelector: '#blog-pagination',
  emptySelector: '#blog-empty',
  filterSelector: '#blog-filters',
  perPage: 9
});


/* =========================
   Products
========================= */

setupCollection({
  itemSelector: '.product-card',
  searchSelector: '#product-search',
  paginationSelector: '#product-pagination',
  emptySelector: '#product-empty',
  perPage: 9
});
