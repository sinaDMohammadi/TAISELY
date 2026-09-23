document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     MOBILE MENU
  ========================= */

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (menuButton && nav) {

    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');

      menuButton.setAttribute(
        'aria-expanded',
        String(open)
      );
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* =========================
     DARK / LIGHT MODE
  ========================= */

  const themeButton = document.querySelector('.theme-toggle');

  const savedTheme = localStorage.getItem('taisely-theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  function updateThemeButton() {

    if (!themeButton) {
      return;
    }

    const dark = document.body.classList.contains('dark-mode');

    themeButton.textContent = dark ? 'روز' : 'شب';

    themeButton.setAttribute(
      'title',
      dark ? 'حالت روز' : 'حالت شب'
    );

    themeButton.setAttribute(
      'aria-label',
      dark ? 'فعال کردن حالت روز' : 'فعال کردن حالت شب'
    );
  }

  updateThemeButton();

  if (themeButton) {

    themeButton.addEventListener('click', () => {

      const dark = document.body.classList.toggle('dark-mode');

      localStorage.setItem(
        'taisely-theme',
        dark ? 'dark' : 'light'
      );

      updateThemeButton();
    });
  }


  /* =========================
     COMING SOON BUTTONS
  ========================= */

  document.querySelectorAll('[data-soon]').forEach(button => {

    button.addEventListener('click', () => {

      const oldToast = document.querySelector('.toast');

      if (oldToast) {
        oldToast.remove();
      }

      const toast = document.createElement('div');

      toast.className = 'toast';

      toast.textContent =
        'این محصول فعلاً در حال آماده‌سازی است.';

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2200);

    });

  });


  /* =========================
     BLOG SEARCH + FILTER +
     PAGINATION
  ========================= */

  const blogList = document.querySelector('#blog-list');

  if (blogList) {

    const blogItems = Array.from(
      blogList.querySelectorAll('.blog-row')
    );

    const searchInput =
      document.querySelector('#blog-search');

    const categoryButtons =
      document.querySelectorAll('[data-category]');

    const pagination =
      document.querySelector('#blog-pagination');

    const resultsInfo =
      document.querySelector('#blog-results-info');

    const emptyState =
      document.querySelector('#blog-empty');

    const itemsPerPage = 9;

    let currentCategory = 'ALL';
    let currentPage = 1;

    function normalizeText(value) {

      return value
        .toLowerCase()
        .trim()
        .replace(/ي/g, 'ی')
        .replace(/ك/g, 'ک');
    }

    function getFilteredBlogItems() {

      const searchTerm = searchInput
        ? normalizeText(searchInput.value)
        : '';

      return blogItems.filter(item => {

        const category =
          item.dataset.category || '';

        const searchableText =
          normalizeText(
            item.dataset.search ||
            item.textContent
          );

        const categoryMatch =
          currentCategory === 'ALL' ||
          category === currentCategory;

        const searchMatch =
          !searchTerm ||
          searchableText.includes(searchTerm);

        return categoryMatch && searchMatch;
      });
    }

    function renderBlog() {

      const filteredItems =
        getFilteredBlogItems();

      const totalPages =
        Math.max(
          1,
          Math.ceil(
            filteredItems.length / itemsPerPage
          )
        );

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      blogItems.forEach(item => {
        item.style.display = 'none';
      });

      const start =
        (currentPage - 1) * itemsPerPage;

      const end =
        start + itemsPerPage;

      filteredItems
        .slice(start, end)
        .forEach(item => {
          item.style.display = 'grid';
        });

      if (emptyState) {
        emptyState.hidden =
          filteredItems.length !== 0;
      }

      if (resultsInfo) {

        if (filteredItems.length === 0) {
          resultsInfo.textContent = '';
        } else {
          resultsInfo.textContent =
            `${filteredItems.length} مطلب`;
        }
      }

      renderPagination(
        pagination,
        totalPages,
        currentPage,
        page => {
          currentPage = page;
          renderBlog();

          window.scrollTo({
            top: blogList.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      );
    }

    categoryButtons.forEach(button => {

      button.addEventListener('click', () => {

        currentCategory =
          button.dataset.category || 'ALL';

        currentPage = 1;

        categoryButtons.forEach(btn => {
          btn.classList.remove('active-tag');
        });

        button.classList.add('active-tag');

        renderBlog();
      });

    });

    if (searchInput) {

      searchInput.addEventListener(
        'input',
        () => {
          currentPage = 1;
          renderBlog();
        }
      );
    }

    const params =
      new URLSearchParams(window.location.search);

    const urlCategory =
      params.get('category');

    if (urlCategory) {

      const matchingButton =
        document.querySelector(
          `[data-category="${urlCategory.toUpperCase()}"]`
        );

      if (matchingButton) {

        currentCategory =
          urlCategory.toUpperCase();

        categoryButtons.forEach(btn => {
          btn.classList.remove('active-tag');
        });

        matchingButton.classList.add('active-tag');
      }
    }

    renderBlog();
  }


  /* =========================
     PRODUCTS SEARCH +
     PAGINATION
  ========================= */

  const productList =
    document.querySelector('#product-list');

  if (productList) {

    const productItems =
      Array.from(
        productList.querySelectorAll('.product-card')
      );

    const searchInput =
      document.querySelector('#product-search');

    const pagination =
      document.querySelector('#product-pagination');

    const resultsInfo =
      document.querySelector('#product-results-info');

    const emptyState =
      document.querySelector('#product-empty');

    const itemsPerPage = 9;

    let currentPage = 1;

    function normalizeText(value) {

      return value
        .toLowerCase()
        .trim()
        .replace(/ي/g, 'ی')
        .replace(/ك/g, 'ک');
    }

    function getFilteredProducts() {

      const searchTerm = searchInput
        ? normalizeText(searchInput.value)
        : '';

      return productItems.filter(item => {

        const searchableText =
          normalizeText(
            item.dataset.search ||
            item.textContent
          );

        return (
          !searchTerm ||
          searchableText.includes(searchTerm)
        );
      });
    }

    function renderProducts() {

      const filteredProducts =
        getFilteredProducts();

      const totalPages =
        Math.max(
          1,
          Math.ceil(
            filteredProducts.length / itemsPerPage
          )
        );

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      productItems.forEach(item => {
        item.style.display = 'none';
      });

      const start =
        (currentPage - 1) * itemsPerPage;

      const end =
        start + itemsPerPage;

      filteredProducts
        .slice(start, end)
        .forEach(item => {
          item.style.display = 'flex';
        });

      if (emptyState) {
        emptyState.hidden =
          filteredProducts.length !== 0;
      }

      if (resultsInfo) {

        if (filteredProducts.length === 0) {
          resultsInfo.textContent = '';
        } else {
          resultsInfo.textContent =
            `${filteredProducts.length} محصول`;
        }
      }

      renderPagination(
        pagination,
        totalPages,
        currentPage,
        page => {
          currentPage = page;
          renderProducts();

          window.scrollTo({
            top: productList.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      );
    }

    if (searchInput) {

      searchInput.addEventListener(
        'input',
        () => {
          currentPage = 1;
          renderProducts();
        }
      );
    }

    renderProducts();
  }


  /* =========================
     PAGINATION GENERATOR
  ========================= */

  function renderPagination(
    container,
    totalPages,
    currentPage,
    onPageChange
  ) {

    if (!container) {
      return;
    }

    container.innerHTML = '';

    /*
      اگر فقط یک صفحه وجود دارد،
      Pagination نمایش داده نمی‌شود.
    */

    if (totalPages <= 1) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';

    const previous =
      document.createElement('button');

    previous.type = 'button';
    previous.className = 'page-btn page-prev';
    previous.textContent = 'قبلی ←';
    previous.disabled = currentPage === 1;

    previous.addEventListener('click', () => {

      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }

    });

    container.appendChild(previous);


    for (let page = 1; page <= totalPages; page++) {

      const button =
        document.createElement('button');

      button.type = 'button';
      button.className = 'page-btn';

      if (page === currentPage) {
        button.classList.add('current-page');
      }

      button.textContent = page;

      button.addEventListener('click', () => {
        onPageChange(page);
      });

      container.appendChild(button);
    }


    const next =
      document.createElement('button');

    next.type = 'button';
    next.className = 'page-btn page-next';
    next.textContent = 'بعدی →';
    next.disabled =
      currentPage === totalPages;

    next.addEventListener('click', () => {

      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }

    });

    container.appendChild(next);
  }

});
