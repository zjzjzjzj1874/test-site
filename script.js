document.addEventListener("DOMContentLoaded", async () => {
  const articlesContainer = document.getElementById("articles-container");
  const articleCardTemplate = document.getElementById("article-card-template");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const mainNav = document.getElementById("main-nav");
  const siteLogo = document.getElementById("site-logo");
  const noResultsP = document.getElementById("no-results");

  let allArticles = [];

  // Helper to get query parameter from URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  async function fetchAllArticles() {
    try {
      const response = await fetch("articles.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      allArticles = data.articles;
    } catch (error) {
      console.error("Error fetching all articles:", error);
      articlesContainer.innerHTML =
        "<p class='text-red-500 text-center col-span-full'>加载文章失败，请稍后再试。</p>";
      allArticles = [];
    }
  }

  function renderArticles(articlesToRender) {
    articlesContainer.innerHTML = "";
    if (articlesToRender.length === 0) {
      noResultsP.classList.remove("hidden");
      return;
    }
    noResultsP.classList.add("hidden");

    articlesToRender.forEach((article) => {
      const cardClone = articleCardTemplate.content.cloneNode(true);
      const anchorTag = cardClone.querySelector(".article-card");

      // *** IMPORTANT CHANGE HERE ***
      // Link to the pre-rendered HTML file in the 'articles' directory
      anchorTag.href = `articles/article-${article.id}.html`;

      anchorTag.querySelector(".news-img").src =
        article.imageUrl ||
        "https://placehold.co/600x400/E2E8F0/AAAAAA?text=新闻图片";
      anchorTag.querySelector(".news-img").onerror = function () {
        this.src =
          "https://placehold.co/600x400/E2E8F0/AAAAAA?text=图片加载失败";
      };
      anchorTag.querySelector(".news-img").alt = article.title;
      anchorTag.querySelector(".news-title").textContent = article.title;
      anchorTag.querySelector(".news-source").textContent = article.source;
      anchorTag.querySelector(".news-date").textContent = new Date(
        article.publishedAt
      ).toLocaleDateString("zh-CN");
      anchorTag.querySelector(".news-description").textContent =
        article.description.substring(0, 120) + "...";

      articlesContainer.appendChild(cardClone);
    });
  }

  async function filterAndRenderArticles() {
    if (allArticles.length === 0) {
      await fetchAllArticles();
    }

    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterSource = getQueryParam("source") || "全部";

    let filteredArticles = allArticles;

    if (filterSource !== "全部") {
      filteredArticles = filteredArticles.filter(
        (article) => article.source === filterSource
      );
    }

    if (searchTerm) {
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.description.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          (article.sensitiveKeywords &&
            article.sensitiveKeywords.some((keyword) =>
              keyword.toLowerCase().includes(searchTerm)
            ))
      );
    }
    renderArticles(filteredArticles);
    setActiveNavLink(
      document.querySelector(`.nav-link[data-source="${filterSource}"]`)
    );
  }

  function setActiveNavLink(activeLink) {
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  // Event Listeners
  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.classList.contains("nav-link")) {
      // Navigation links now use direct hrefs, browser handles reload
    }
  });

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const currentSource = getQueryParam("source");
    let newUrl = "index.html";
    const params = new URLSearchParams();
    if (currentSource && currentSource !== "全部") {
      params.append("source", currentSource);
    }
    if (searchTerm) {
      params.append("q", encodeURIComponent(searchTerm));
    }
    if (params.toString()) {
      newUrl += `?${params.toString()}`;
    }
    window.location.href = newUrl;
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click();
    }
  });

  siteLogo.addEventListener("click", () => {
    searchInput.value = "";
    window.location.href = "index.html";
  });

  // Initial load logic for index.html
  const initialSearchTerm = getQueryParam("q");
  if (initialSearchTerm) {
    searchInput.value = initialSearchTerm;
  }
  filterAndRenderArticles();
});
