
const apiKey = 'c98e96b2f4f14797b49197fd04b23d73'; 
const newsContainer = document.getElementById('news-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const paginationContainer = document.getElementById('pagination');
const categorySelect = document.getElementById('category-select');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let currentPage = 1;
const articlesPerPage = 5;
let newsArticles = [];

const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    const categoryUrl = selectedCategory 
        ? `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=${apiKey}`
        : url;
    fetchNews(categoryUrl);
});

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    const searchUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}`;
    fetchNews(searchUrl);
});

async function fetchNews(apiUrl = url) {
    try {
        loadingSpinner.style.display = 'block';
        const response = await fetch(apiUrl);
        const data = await response.json();
        loadingSpinner.style.display = 'none';

        if (data.articles.length > 0) {
            newsArticles = data.articles;
            currentPage = 1; 
            displayArticles(newsArticles);
        } else {
            newsContainer.innerHTML = '';
            errorMessage.textContent = 'No news articles available at the moment.';
        }
    } catch (error) {
        loadingSpinner.style.display = 'none';
        errorMessage.textContent = 'Error fetching news. Please try again later.';
    }
}

function displayArticles(articles) {
    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const paginatedArticles = articles.slice(start, end);

    newsContainer.innerHTML = ''; 
    paginatedArticles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');
        articleDiv.innerHTML = `
            <img src="${article.urlToImage || ''}" alt="${article.title}" />
            <h2>${article.title}</h2>
            <p><strong>Source:</strong> ${article.source.name}</p>
            <p><strong>Published:</strong> ${new Date(article.publishedAt).toLocaleDateString()}</p>
            <p>${article.description || 'No description available.'}</p>
        `;
        newsContainer.appendChild(articleDiv);
    });

    createPaginationButtons(articles.length);
}

function createPaginationButtons(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            displayArticles(newsArticles);
        });
        paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            displayArticles(newsArticles);
        });
        paginationContainer.appendChild(nextButton);
    }
}

fetchNews();