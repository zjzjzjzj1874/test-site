const fs = require('fs');
const path = require('path');

// Read articles data
const articlesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf-8'));
const articles = articlesData.articles;

const outputDir = path.join(__dirname, 'articles'); // Directory to save generated HTML files

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Basic HTML template for article detail page
// Note: This template no longer includes <script src="article-detail-script.js"></script>
// because the content is embedded directly.
const baseHtmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="article-detail-title-tag">##ARTICLE_TITLE## - 敏感言论测试网站</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="../styles.css"> </head>
<body class="bg-zinc-50 text-zinc-800">

    <header class="bg-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-6 py-5 flex justify-between items-center">
            <h1 class="text-4xl font-extrabold text-blue-700 tracking-tight">
                <a href="../index.html" class="hover:text-blue-800 transition-colors duration-200">敏感言论测试门户</a>
            </h1>
            <nav>
                <a href="../index.html" class="nav-link text-zinc-600 hover:text-blue-700 pb-2 transition-colors duration-200">返回文章列表</a>
            </nav>
        </div>
    </header>

    <main class="container mx-auto px-6 py-10">
        <div id="article-detail-view" class="bg-white p-8 rounded-xl shadow-lg border border-zinc-100">
            <button id="back-button" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 mb-6" onclick="window.location.href='../index.html';">
                &larr; 返回文章列表
            </button>
            <h2 id="detail-title" class="text-4xl font-extrabold mb-6 text-zinc-900 leading-tight">##ARTICLE_TITLE##</h2>
            <img id="detail-image" src="##ARTICLE_IMAGE##" alt="文章图片" class="w-full h-80 object-cover mb-6 rounded-lg shadow-md" onerror="this.src='https://placehold.co/600x400/E2E8F0/AAAAAA?text=图片加载失败';">
            <p class="text-sm text-zinc-500 mb-1">来源: <span id="detail-source" class="font-medium">##ARTICLE_SOURCE##</span></p>
            <p class="text-xs text-zinc-400 mb-8">发布于: <span id="detail-date">##ARTICLE_DATE##</span></p>
            <div id="detail-full-content" class="text-zinc-700 prose max-w-none leading-relaxed text-lg">
                ##ARTICLE_CONTENT##
            </div>
            <p id="article-not-found" class="text-red-500 text-center hidden text-2xl py-20"></p> 
        </div>
    </main>

    <footer class="bg-zinc-800 text-zinc-300 py-10 text-center">
        <p class="text-sm">&copy; 2024 敏感言论测试平台。所有内容仅供测试用途。</p>
        <p class="text-xs mt-2">开发者：前端测试团队</p>
    </footer>

    </body>
</html>
`;

articles.forEach(article => {
    const formattedDate = new Date(article.publishedAt).toLocaleDateString('zh-CN');
    const articleHtml = baseHtmlTemplate
        .replace(/##ARTICLE_TITLE##/g, article.title)
        .replace(/##ARTICLE_IMAGE##/g, article.imageUrl || 'https://placehold.co/600x400/E2E8F0/AAAAAA?text=新闻图片')
        .replace(/##ARTICLE_SOURCE##/g, article.source)
        .replace(/##ARTICLE_DATE##/g, formattedDate)
        .replace(/##ARTICLE_CONTENT##/g, article.content); // Use innerHTML for content

    const fileName = `article-${article.id}.html`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, articleHtml, 'utf-8');
    console.log(`Generated ${fileName}`);
});

console.log(`Generated ${articles.length} article detail pages in the '${outputDir}' directory.`);

