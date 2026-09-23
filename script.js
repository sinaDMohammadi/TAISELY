/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {

  menuButton.addEventListener("click", () => {

    const isOpen = nav.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen
        ? "بستن منو"
        : "باز کردن منو"
    );

  });


  nav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "باز کردن منو"
      );

    });

  });

}


/* =========================================
   DARK / LIGHT MODE
========================================= */

const themeToggle =
  document.querySelector(".theme-toggle");

const root =
  document.documentElement;


function getDarkMode() {

  return root.classList.contains(
    "dark-mode"
  );

}


function updateThemeButton() {

  if (!themeToggle) {
    return;
  }


  const darkMode = getDarkMode();

  const label =
    themeToggle.querySelector(
      ".theme-toggle-label"
    );


  if (darkMode) {

    if (label) {
      label.textContent = "روز";
    }

    themeToggle.setAttribute(
      "aria-label",
      "فعال کردن حالت روز"
    );

    themeToggle.setAttribute(
      "title",
      "حالت روز"
    );

    themeToggle.setAttribute(
      "aria-pressed",
      "true"
    );

  } else {

    if (label) {
      label.textContent = "شب";
    }

    themeToggle.setAttribute(
      "aria-label",
      "فعال کردن حالت شب"
    );

    themeToggle.setAttribute(
      "title",
      "حالت شب"
    );

    themeToggle.setAttribute(
      "aria-pressed",
      "false"
    );

  }

}


if (themeToggle) {

  updateThemeButton();


  themeToggle.addEventListener(
    "click",
    () => {

      const darkMode =
        !getDarkMode();


      root.classList.toggle(
        "dark-mode",
        darkMode
      );


      try {

        localStorage.setItem(
          "taisely-theme",
          darkMode
            ? "dark"
            : "light"
        );

      } catch (error) {
        // localStorage ممکن است توسط مرورگر مسدود شده باشد.
      }


      updateThemeButton();

    }
  );

}


/* =========================================
   TOAST FOR COMING SOON
========================================= */

function showToast(message) {

  const existingToast =
    document.querySelector(".toast");

  if (existingToast) {
    existingToast.remove();
  }


  const toast =
    document.createElement("div");

  toast.className = "toast";

  toast.textContent = message;

  document.body.appendChild(toast);


  setTimeout(() => {

    if (toast.parentNode) {
      toast.remove();
    }

  }, 2200);

}


document
  .querySelectorAll("[data-soon]")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        showToast(
          "این محصول فعلاً در حال آماده‌سازی است."
        );

      }
    );

  });


/* =========================================
   GENERIC PAGINATION + SEARCH
========================================= */

function setupCollection(options) {

  const {
    itemSelector,
    searchSelector,
    filterSelector,
    paginationSelector,
    emptySelector,
    perPage = 9
  } = options;


  const items =
    Array.from(
      document.querySelectorAll(
        itemSelector
      )
    );


  if (!items.length) {
    return;
  }


  const searchInput =
    searchSelector
      ? document.querySelector(
          searchSelector
        )
      : null;


  const filterButtons =
    filterSelector
      ? Array.from(
          document.querySelectorAll(
            `${filterSelector} [data-category]`
          )
        )
      : [];


  const pagination =
    paginationSelector
      ? document.querySelector(
          paginationSelector
        )
      : null;


  const emptyState =
    emptySelector
      ? document.querySelector(
          emptySelector
        )
      : null;


  let currentPage = 1;

  let activeCategory = "all";

  let searchQuery = "";


  function getFilteredItems() {

    const normalizedQuery =
      searchQuery
        .trim()
        .toLowerCase();


    return items.filter((item) => {

      const category =
        item.dataset.category ||
        "all";


      const matchesCategory =
        activeCategory === "all" ||
        category === activeCategory;


      const text =
        item.textContent
          .toLowerCase();


      const matchesSearch =
        !normalizedQuery ||
        text.includes(
          normalizedQuery
        );


      return (
        matchesCategory &&
        matchesSearch
      );

    });

  }


  function renderPagination(totalPages) {

    if (!pagination) {
      return;
    }


    if (totalPages <= 1) {

      pagination.innerHTML = "";

      pagination.hidden = true;

      return;

    }


    pagination.hidden = false;


    let html = "";


    html += `
      <button
        type="button"
        class="pagination-prev"
        data-page="${currentPage - 1}"
        ${currentPage === 1 ? "disabled" : ""}
      >
        صفحه قبل
      </button>
    `;


    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {

      html += `
        <button
          type="button"
          class="pagination-number ${
            page === currentPage
              ? "active"
              : ""
          }"
          data-page="${page}"
          ${
            page === currentPage
              ? 'aria-current="page"'
              : ""
          }
        >
          ${page}
        </button>
      `;

    }


    html += `
      <button
        type="button"
        class="pagination-next"
        data-page="${currentPage + 1}"
        ${
          currentPage === totalPages
            ? "disabled"
            : ""
        }
      >
        صفحه بعد
      </button>
    `;


    pagination.innerHTML = html;


    pagination
      .querySelectorAll("[data-page]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            if (
              button.disabled
            ) {
              return;
            }


            const targetPage =
              Number(
                button.dataset.page
              );


            if (
              !Number.isFinite(
                targetPage
              )
            ) {
              return;
            }


            currentPage =
              targetPage;


            render();


            const target =
              document.querySelector(
                itemSelector
              );


            if (target) {

              target.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });

            }

          }
        );

      });

  }


  function render() {

    const filteredItems =
      getFilteredItems();


    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredItems.length /
          perPage
        )
      );


    if (
      currentPage > totalPages
    ) {

      currentPage =
        totalPages;

    }


    items.forEach((item) => {

      item.hidden = true;

    });


    const start =
      (currentPage - 1) *
      perPage;


    const end =
      start + perPage;


    filteredItems
      .slice(start, end)
      .forEach((item) => {

        item.hidden = false;

      });


    if (emptyState) {

      emptyState.hidden =
        filteredItems.length !== 0;

    }


    renderPagination(
      totalPages
    );

  }


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        searchQuery =
          searchInput.value;


        currentPage = 1;

        render();

      }
    );

  }


  filterButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          activeCategory =
            button.dataset.category ||
            "all";


          filterButtons.forEach(
            (otherButton) => {

              otherButton.classList.toggle(
                "active-tag",
                otherButton === button
              );

            }
          );


          currentPage = 1;

          render();

        }
      );

    }
  );


  render();

}


/* =========================================
   BLOG
========================================= */

setupCollection({

  itemSelector: ".blog-row",

  searchSelector: "#blog-search",

  filterSelector: "#blog-filters",

  paginationSelector: "#blog-pagination",

  emptySelector: "#blog-empty",

  perPage: 9

});


/* =========================================
   PRODUCTS
========================================= */

setupCollection({

  itemSelector: ".product-card",

  searchSelector: "#product-search",

  filterSelector: null,

  paginationSelector: "#product-pagination",

  emptySelector: "#product-empty",

  perPage: 9

});
