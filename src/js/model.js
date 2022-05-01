import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJson } from "./helpers";

export const state = {
  recipe: {},
  search: { query: "", results: [], page: 1, resultsPerPage: RESULTS_PER_PAGE },
};

export const loadRecipe = async id => {
  try {
    const data = await getJson(`${API_URL}${id}`);

    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  //em algum sítio a página tem de ser resetada a 1 após uma busca
  state.search.page = 1;

  state.search.query = query;

  const data = await getJson(`${API_URL}?search=${query}`);
  console.log(data);

  state.search.results = data.data.recipes.map(e => {
    return {
      id: e.id,
      title: e.title,
      publisher: e.publisher,
      image: e.image_url,
    };
  });

  try {
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsByPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};
