document.addEventListener("DOMContentLoaded", async () => {
  const detailTitle = document.getElementById("detail-title");
  const detailImage = document.getElementById("detail-image");
  const detailSource = document.getElementById("detail-source");
  const detailDate = document.getElementById("detail-date");
  const detailFullContent = document.getElementById("detail-full-content");
  const articleNotFound = document.getElementById("article-not-found");
  const documentTitleTag = document.getElementById("article-detail-title-tag");
  const backButton = document.getElementById("back-button");

  // Simulate fetching a single article from a backend API
  // This function now handles fetching the articles.json itself
  async function fetchArticleById(id) {
    try {
      // Simulate an API call to get all articles
      // In a real backend, this would be a call like /api/article?id=xxx
      const response = await fetch("articles.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const allArticles = data.articles; // Assuming articles.json has a top-level 'articles' array

      // Simulate network delay before resolving
      return new Promise((resolve) => {
        setTimeout(() => {
          const article = allArticles.find((a) => a.id === id);
          resolve(article);
        }, 300); // Simulate network delay
      });
    } catch (error) {
      console.error("Error fetching article data:", error);
      // Display an error message to the user
      detailTitle.textContent = "加载文章失败";
      detailFullContent.innerHTML =
        '<p class="text-red-500">无法加载文章内容，请检查网络连接或稍后再试。</p>';
      detailImage.style.display = "none";
      detailSource.textContent = "";
      detailDate.textContent = "";
      articleNotFound.classList.remove("hidden");
      return null; // Return null on error
    }
  }

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id");

  if (articleId) {
    const article = await fetchArticleById(articleId);

    if (article) {
      documentTitleTag.textContent = article.title + " - 敏感言论测试网站";
      detailTitle.textContent = article.title;
      detailImage.src =
        article.imageUrl ||
        "https://placehold.co/600x400/E2E8F0/AAAAAA?text=新闻图片";
      detailImage.alt = article.title;
      detailImage.onerror = function () {
        this.src =
          "https://placehold.co/600x400/E2E8F0/AAAAAA?text=图片加载失败";
      };
      detailSource.textContent = article.source;
      detailDate.textContent = new Date(article.publishedAt).toLocaleDateString(
        "zh-CN"
      );
      detailFullContent.innerHTML = article.content;
      articleNotFound.classList.add("hidden");
    } else {
      detailTitle.textContent = "文章未找到";
      detailImage.style.display = "none";
      detailSource.textContent = "";
      detailDate.textContent = "";
      detailFullContent.innerHTML =
        '<p class="text-zinc-500">您请求的文章不存在或已被删除。</p>';
      articleNotFound.classList.remove("hidden");
    }
  } else {
    detailTitle.textContent = "未指定文章ID";
    detailImage.style.display = "none";
    detailSource.textContent = "";
    detailDate.textContent = "";
    detailFullContent.innerHTML =
      '<p class="text-zinc-500">请通过首页选择一篇文章进行查看。</p>';
    articleNotFound.classList.remove("hidden");
  }

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
