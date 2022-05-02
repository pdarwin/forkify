import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Atualiza a vista de resultados para selecionar o resultado escolhido
    resultsView.update(model.getSearchResultsByPage());

    //1) Atualiza vista marcadores
    bookmarksView.update(model.state.bookmarks);

    //2) Carregar a receita
    await model.loadRecipe(id);

    //0) Renderizar a receita
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    //1) Vai buscar a query de busca
    const query = searchView.getQuery();
    if (!query) return;

    //2) Carregar resultados da busca
    await model.loadSearchResults(query);

    //3) Renderizar os resultados da busca
    resultsView.render(model.getSearchResultsByPage());

    //4) Renderizar os botões de paginação iniciais
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlPagination = goToPage => {
  //3) Renderizar novos resultados da busca
  resultsView.render(model.getSearchResultsByPage(goToPage));

  //4) Renderizar novos botões de paginação iniciais
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Atualiza as porções (o estado)
  model.updateServings(newServings);

  // Atualiza a vista
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  //1) Adicionar/remover marcador
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //2 Atualizar lista de receitas
  recipeView.update(model.state.recipe);

  //3) Renderizar marcadores
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    //Mostrar o spinner
    addRecipeView.renderSpinner();

    //Carrega a nova receita
    await model.uploadRecipe(newRecipe);

    //Renderiza a nova receita
    recipeView.render(model.state.recipe);

    //Mostra mensagem de sucesso
    addRecipeView.renderMsg();

    //Renderizar bookmark
    bookmarksView.render(model.state.bookmarks);

    //Atualizar o ID nas URLs
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //Fechar form
    setTimeout = () => {
      addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000;
    };
  } catch (err) {
    console.error("💩", err);
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addhandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
