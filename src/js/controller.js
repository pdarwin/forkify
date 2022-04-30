import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

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

    //3)Renderizar os resultados da busca
    resultsView.render(model.state.search.results);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
