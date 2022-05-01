import View from "./View";
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errMsg =
    "Não foram encontradas receitas para o termo que procurou! Por favor, tente outra vez;";
  _msg = "Sucesso!";

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
        <a class="preview__link ${
          id === result.id ? "preview__link--active" : ""
        }" href="#${result.id}">
            <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
            </div>
        </a>
    </li>
    `;
  }
}

export default new ResultsView();
