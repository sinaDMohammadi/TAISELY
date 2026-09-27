/*
  TAISELY Blog
  برای اضافه‌کردن مطلب جدید، فقط یک آبجکت جدید به آرایه posts اضافه کنید.
  تاریخ با فرمت YYYY-MM-DD نوشته شود.
*/

const posts = [
  {
    title: "ممنوعیت رسانه‌های اجتماعی برای کودکان ",
    excerpt: " ممنوعیت رسانه‌های اجتماعی برای ایمن نگه داشتن کودکان کافی نیست ",
    category: "social media",
    date: "2026-09-27",
    icon: "fa-brands fa-instagram",
    url: "social-media-kids.html"
  },
  {
    title: "نمونه مطلب اول؛ آینده فناوری به کدام سمت می‌رود؟",
    excerpt: "این فقط یک محتوای نمونه است. عنوان، خلاصه، دسته‌بندی و تاریخ هر مطلب را از همین‌جا تغییر دهید.",
    category: "فناوری",
    date: "2026-09-25",
    icon: "fa-microchip",
    url: "#"
  },
  {
    title: "انرژی و مسئله بزرگ ذخیره‌سازی برق",
    excerpt: "چرا ذخیره‌سازی انرژی یکی از قطعات مهم پازل گذار به شبکه‌های انرژی آینده است؟",
    category: "انرژی",
    date: "2026-09-18",
    icon: "fa-bolt",
    url: "#"
  },
  {
    title: "باتری‌های نسل بعد چه تفاوتی دارند؟",
    excerpt: "مروری بر ایده‌هایی که می‌توانند عملکرد و هزینه باتری‌ها را در سال‌های آینده تغییر دهند.",
    category: "علم",
    date: "2026-09-14",
    icon: "fa-battery-three-quarters",
    url: "#"
  },
  {
    title: "چرا نیمه‌رساناها برای اقتصاد جهان مهم‌اند؟",
    excerpt: "از گوشی و خودرو تا دیتاسنتر؛ تراشه‌ها چگونه به زیرساخت اقتصاد دیجیتال تبدیل شده‌اند؟",
    category: "کسب‌وکار",
    date: "2026-09-10",
    icon: "fa-memory",
    url: "#"
  },
  {
    title: "داده؛ سوخت اقتصاد دیجیتال",
    excerpt: "داده چگونه جمع‌آوری، پردازش و به تصمیم‌های تجاری و محصولات دیجیتال تبدیل می‌شود؟",
    category: "کسب‌وکار",
    date: "2026-09-06",
    icon: "fa-database",
    url: "#"
  },
  {
    title: "فضای ابری دقیقاً چه کاری انجام می‌دهد؟",
    excerpt: "یک توضیح ساده درباره زیرساختی که بخش بزرگی از سرویس‌های اینترنتی روی آن اجرا می‌شوند.",
    category: "فناوری",
    date: "2026-09-02",
    icon: "fa-cloud",
    url: "#"
  },
  {
    title: "آینده خودروهای برقی فقط به باتری وابسته نیست",
    excerpt: "از نرم‌افزار و شبکه شارژ تا زنجیره تأمین؛ اکوسیستم خودروهای برقی را یک‌جا ببینیم.",
    category: "آینده",
    date: "2026-08-28",
    icon: "fa-car-side",
    url: "#"
  },
  {
    title: "دیتاسنترها و رشد تقاضای انرژی",
    excerpt: "افزایش پردازش هوش مصنوعی چه اثری بر زیرساخت برق و طراحی مراکز داده دارد؟",
    category: "انرژی",
    date: "2026-08-22",
    icon: "fa-server",
    url: "#"
  },
  {
    title: "ربات‌ها از کارخانه‌ها فراتر می‌روند",
    excerpt: "اتوماسیون فیزیکی در حال ورود به محیط‌های بیشتری است؛ اما موانع فنی و اقتصادی هنوز جدی‌اند.",
    category: "فناوری",
    date: "2026-08-16",
    icon: "fa-robot",
    url: "#"
  }
];

const POSTS_PER_PAGE = 9;
let currentPage = 1;
let sortMode = "newest";

const grid = document.getElementById("postsGrid");
const pagination = document.getElementById("pagination");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function getSortedPosts() {
  return [...posts].sort((a, b) => {
    const first = new Date(a.date);
    const second = new Date(b.date);
    return sortMode === "newest" ? second - first : first - second;
  });
}

function renderPosts() {
  const sorted = getSortedPosts();
  const totalPages = Math.max(1, Math.ceil(sorted.length / POSTS_PER_PAGE));

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = sorted.slice(start, start + POSTS_PER_PAGE);

  grid.innerHTML = pagePosts.map(post => `
    <article class="post-card">
      <div class="post-image" aria-hidden="true">
        <i class="fa-solid ${post.icon}"></i>
      </div>
      <div class="post-body">
        <div class="post-meta">
          <span class="post-category">${post.category}</span>
          <time datetime="${post.date}">${formatDate(post.date)}</time>
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <a class="read-more" href="${post.url}">
          ادامه مطلب
          <i class="fa-solid fa-arrow-left"></i>
        </a>
      </div>
    </article>
  `).join("");

  renderPagination(totalPages);

  if (pagePosts.length === 0) {
    grid.innerHTML = `<p class="post-excerpt">هنوز مطلبی برای نمایش وجود ندارد.</p>`;
  }
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `
    <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  for (let page = 1; page <= totalPages; page++) {
    html += `
      <button class="page-btn ${page === currentPage ? "active" : ""}" data-page="${page}">
        ${page}
      </button>
    `;
  }

  html += `
    <button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>
      <i class="fa-solid fa-chevron-left"></i>
    </button>
  `;

  pagination.innerHTML = html;
}

pagination.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;

  currentPage = Number(button.dataset.page);
  renderPosts();
  document.getElementById("blog").scrollIntoView({ behavior: "smooth", block: "start" });
});

sortSelect.addEventListener("change", event => {
  sortMode = event.target.value;
  currentPage = 1;
  renderPosts();
});

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("taisely-theme", theme);

  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

const savedTheme = localStorage.getItem("taisely-theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (systemDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
});

document.getElementById("year").textContent = new Date().getFullYear();

renderPosts();
