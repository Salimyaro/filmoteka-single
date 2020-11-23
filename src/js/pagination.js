import refs from "./refs";
import api from "./api";
import { renderTrending, renderSearch } from "./index";

const Pagination = {
  code: "",
  pageType: null,

  Extend: function (data) {
    Pagination.pageType = data.pageType;
    Pagination.size = data.size;
    Pagination.page = data.page;
    Pagination.step = data.step;
    Pagination.query = data.query;
  },

  Add: function (s, f) {
    for (let i = s; i < f; i++) {
      Pagination.code += "<a>" + i + "</a>";
    }
  },

  Last: function () {
    Pagination.code +=
      "<i>...</i><a class='pagination__last'>" + Pagination.size + "</a>";
  },

  First: function () {
    Pagination.code += "<a class='pagination__first'>1</a><i>...</i>";
  },

  Click: function () {
    Pagination.page = +this.innerHTML;
    api.page = +this.innerHTML;
    if (Pagination.pageType === "trending") renderTrending();
    if (Pagination.pageType === "search") renderSearch();

    Pagination.Start();
  },

  Prev: function () {
    Pagination.page -= 1;
    api.page -= 1;
    if (Pagination.page < 1) {
      Pagination.page = 1;
      api.page = 1;
    }
    if (Pagination.pageType === "trending") renderTrending();
    if (Pagination.pageType === "search") renderSearch();
    Pagination.Start();
  },

  Next: function () {
    Pagination.page += 1;
    api.page += 1;
    if (Pagination.page > Pagination.size) {
      Pagination.page = Pagination.size;
      api.page = Pagination.size;
    }
    if (Pagination.pageType === "trending") renderTrending();
    if (Pagination.pageType === "search") renderSearch();
    Pagination.Start();
  },

  Bind: function () {
    const a = Pagination.e.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
      if (+a[i].innerHTML === Pagination.page) a[i].className = "current";
      a[i].addEventListener("click", Pagination.Click, false);
    }
  },

  Finish: function () {
    Pagination.e.innerHTML = Pagination.code;
    Pagination.code = "";
    Pagination.Bind();
  },

  Start: function () {
    if (Pagination.size < Pagination.step * 2 + 6) {
      Pagination.Add(1, Pagination.size + 1);
    } else if (Pagination.page < Pagination.step * 2 + 1) {
      Pagination.Add(1, Pagination.step * 2 + 2);
      Pagination.Last();
    } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
      Pagination.First();
      Pagination.Add(
        Pagination.size - Pagination.step * 2,
        Pagination.size + 1
      );
    } else {
      Pagination.First();
      Pagination.Add(
        Pagination.page - Pagination.step,
        Pagination.page + Pagination.step + 1
      );
      Pagination.Last();
    }
    Pagination.Finish();
  },

  Buttons: function (e) {
    const nav = e.getElementsByTagName("a");
    nav[0].addEventListener("click", Pagination.Prev, false);
    nav[1].addEventListener("click", Pagination.Next, false);
  },

  Create: function (e) {
    const html = [
      '<a class="pagination__arrow-back"></a>', // previous button
      "<span></span>", // pagination container
      '<a class="pagination__arrow-forward"></a>', // next button
    ];

    e.innerHTML = html.join("");
    Pagination.e = e.getElementsByTagName("span")[0];
    Pagination.Buttons(e);
  },

  Init: function (e, data) {
    Pagination.Extend(data);
    Pagination.Create(e);
    Pagination.Start();
  },

  init: function ({
    currentTotalPages: size,
    currentPage: page,
    query,
    pageType,
  }) {
    Pagination.Init(refs.pagination, { size, page, query, step: 2, pageType });
  },
};

export default Pagination;
