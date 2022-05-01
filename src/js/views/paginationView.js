import icons from "url:../../img/icons.svg";
import View from "./View";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", e => {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    //1.ª página c/ outras páginas
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(true);
    }

    //1.ª página sem outras páginas
    if (curPage === 1 && numPages === 1) {
      return ``;
    }

    //Última página
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(false);
    }

    //Outras páginas

    return this._generateMarkupButton(false) + this._generateMarkupButton(true);
  }

  _generateMarkupButton(next) {
    const curPage = this._data.page;

    return `
        <button data-goto="${
          next ? curPage + 1 : curPage - 1
        }" class="btn--inline pagination__btn--${next ? "next" : "prev"}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
      next ? "right" : "left"
    }"></use>
            </svg>  
            <span>${next ? curPage + 1 : curPage - 1}</span>
        </button>`;
  }
}

export default new PaginationView();
