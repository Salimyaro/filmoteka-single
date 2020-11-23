const BASE_URL = "https://api.themoviedb.org/3";
const KEY = "a376afb1e4846f5a2cea2f835a3f297e";

const API = {
  searchQuery: "",
  page: 1,

  fetchTrending: function (p) {
    if (p) API.page = p;
    return fetch(
      `${BASE_URL}/movie/popular?api_key=${KEY}&language=en-US&page=${API.page}`
    ).then((r) => r.json());
  },

  fetchSearch: function (p, q) {
    if (q) API.searchQuery = q;
    if (p) API.page = p;
    return fetch(
      `${BASE_URL}/search/movie?api_key=${KEY}&language=en-US&page=${API.page}&query=${API.searchQuery}`
    ).then((r) => r.json());
  },

  fetchById: function (id) {
    return fetch(
      `${BASE_URL}/movie/${id}?api_key=${KEY}&language=en-US&page=${API.page}`
    ).then((r) => r.json());
  },

  fetchGenres: function () {
    return fetch(`${BASE_URL}/genre/movie/list?api_key=${KEY}`).then((r) =>
      r.json()
    );
  },
};
export default API;
