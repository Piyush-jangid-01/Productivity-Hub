const API_KEY = "1e0d0111d30e4d1a9eef8382e99acff4";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
  fetchNews("trending");
});

async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  bindData(data.articles);
}

function bindData(articles) {
  if (!articles) return;

  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.textContent = article.title;
  newsDesc.textContent = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  newsSource.textContent = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let currSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);

  const navItem = document.getElementById(id);

  if (currSelectedNav) {
    currSelectedNav.classList.remove("active");
  }

  currSelectedNav = navItem;
  currSelectedNav.classList.add("active");
}

const searchbutton = document.getElementById("search-button");
const searchtext = document.getElementById("search-text");

searchbutton?.addEventListener("click", () => {
  const query = searchtext.value;
  if (!query) return;
  fetchNews(query);
  if (currSelectedNav) {
    currSelectedNav.classList.remove("active");
    currSelectedNav = null;
  }
  searchtext.value = null;
});
