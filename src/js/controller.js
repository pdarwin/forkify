import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

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

    //1) Carregar a receita
    await model.loadRecipe(id);

    //2) Renderizar a receita
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

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
