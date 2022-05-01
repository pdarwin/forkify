import previewView from "./previewView";
import View from "./View";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errMsg = "Sem marcadores. Escolha uma receita e marque-a! :D";
  _msg = "Sucesso!";

  addhandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join("");
  }
}
export default new BookmarksView();
