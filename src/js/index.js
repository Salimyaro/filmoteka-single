import "regenerator-runtime/runtime.js";
import Pagination from "./pagination";
import api from "./api";
import refs from "./refs";
import cardsTpl from "../hbs/card.hbs";
import fullCardsTpl from "../hbs/full-info-card.hbs";
import * as basicLightbox from "basiclightbox";

let localWanted = JSON.parse(localStorage.getItem("watched")) || [];
let localQueue = JSON.parse(localStorage.getItem("queue")) || [];

refs.content.addEventListener("click", onGalleryClick);

const homePageOptions = {
  pageType: "trending",
  currentPage: 1,
  currentTotalPages: null,
};

const searchOptions = {
  pageType: "search",
  query: null,
  currentPage: null,
  currentTotalPages: null,
};

if (refs.body.dataset.page === "home") {
  makeFirstPage();
  refs.searchForm.addEventListener("submit", onSearch);
}

if (refs.body.dataset.page === "library") {
  refs.watchedBTN.addEventListener("click", renderWatched);
  refs.queueBTN.addEventListener("click", renderQueue);
  renderWatched();
}

async function renderWatched() {
  refs.watchedBTN.classList.add("--active");
  refs.queueBTN.classList.remove("--active");
  const watchedDataArray = await Promise.all(
    JSON.parse(localStorage.getItem("watched")).map((id) => api.fetchById(id))
  );
  watchedDataArray.map(
    (obj) => (obj.genre_ids = obj.genres.map((value) => value.name).join(", "))
  );
  refs.content.innerHTML = cardsTpl(watchedDataArray);
}

async function renderQueue() {
  refs.watchedBTN.classList.remove("--active");
  refs.queueBTN.classList.add("--active");
  const watchedDataArray = await Promise.all(
    JSON.parse(localStorage.getItem("queue")).map((id) => api.fetchById(id))
  );
  watchedDataArray.map(
    (obj) => (obj.genre_ids = obj.genres.map((value) => value.name).join(", "))
  );
  refs.content.innerHTML = cardsTpl(watchedDataArray);
}

async function makeFirstPage() {
  await renderTrending(homePageOptions.currentPage);
  Pagination.init(homePageOptions);
}

export async function renderTrending(p) {
  const { page, results, total_pages } = await api.fetchTrending(p);
  homePageOptions.currentPage = page;
  homePageOptions.currentTotalPages = total_pages;
  const data = await makeData(results);
  refs.content.innerHTML = cardsTpl(data);
}

export async function renderSearch(p, q) {
  const { page, results, total_pages } = await api.fetchSearch(p, q);
  searchOptions.currentPage = page;
  if (searchOptions.query !== q) {
    searchOptions.currentPage = 1;
  }
  searchOptions.currentTotalPages = total_pages;
  const data = await makeData(results);
  refs.content.innerHTML = cardsTpl(data);
}

async function onSearch(e) {
  e.preventDefault();
  searchOptions.query = e.target.elements.query.value;
  await renderSearch(searchOptions.currentPage, searchOptions.query);
  Pagination.init(searchOptions);
}

async function makeData(results) {
  const { genres } = await api.fetchGenres();
  const data = results.map((obj) => {
    obj.genre_ids = obj.genre_ids
      .map((id) => genres.find((obj) => obj.id === id).name)
      .join(", ");
    obj.release_date = obj.release_date.slice(0, 4);
    return obj;
  });
  return data;
}

async function onGalleryClick({ target: { nodeName, dataset } }) {
  if (nodeName === "UL") return;
  const data = await api.fetchById(dataset.id);
  const markup = fullCardsTpl(data);
  const instance = basicLightbox.create(markup);
  instance.show();
  const watchedBTN = document.getElementById("add-to-watched");
  const queueBTN = document.getElementById("add-to-queue");

  if (localWanted.includes(data.id)) {
    watchedBTN.textContent = "remove from watched";
    watchedBTN.classList.add("--active");
  }
  if (localQueue.includes(data.id)) {
    queueBTN.textContent = "remove from queue";
    queueBTN.classList.add("--active");
  }

  document
    .getElementById("modal-close")
    .addEventListener("click", instance.close);

  watchedBTN.addEventListener("click", onAddToWatchedClick);
  queueBTN.addEventListener("click", onAddToQueueClick);

  function onAddToWatchedClick(e) {
    if (!localWanted.includes(data.id)) {
      localWanted.push(data.id);
      watchedBTN.textContent = "remove from watched";
      watchedBTN.classList.add("--active");
    } else {
      localWanted.splice(localWanted.indexOf(data.id), 1);
      watchedBTN.textContent = "add to watched";
      watchedBTN.classList.remove("--active");
    }
    if (localQueue.includes(data.id)) {
      localQueue.splice(localQueue.indexOf(data.id), 1);
      queueBTN.textContent = "add to queue";
      queueBTN.classList.remove("--active");
    }
    localStorage.setItem("watched", JSON.stringify(localWanted));
    localStorage.setItem("queue", JSON.stringify(localQueue));
    refresh();
     if (refs.body.dataset.page === "home") instance.close();
  }

  function onAddToQueueClick(e) {
    if (!localQueue.includes(data.id)) {
      localQueue.push(data.id);
      queueBTN.textContent = "remove from queue";
      queueBTN.classList.add("--active");
    } else {
      localQueue.splice(localQueue.indexOf(data.id), 1);
      queueBTN.textContent = "add to queue";
      queueBTN.classList.remove("--active");
    }
    if (localWanted.includes(data.id)) {
      localWanted.splice(localWanted.indexOf(data.id), 1);
      watchedBTN.textContent = "add to queue";
      watchedBTN.classList.remove("--active");
    }
    localStorage.setItem("queue", JSON.stringify(localQueue));
    localStorage.setItem("watched", JSON.stringify(localWanted));
    refresh();

    if (refs.body.dataset.page === "home") instance.close();
  }
}

function refresh() {
  if (refs.body.dataset.page === "library") {
    if (refs.watchedBTN.classList.contains("--active")) {
      renderWatched();
    }
    if (refs.queueBTN.classList.contains("--active")) {
      renderQueue();
    }
  }
}
