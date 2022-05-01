import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJson } from "./helpers";

export const state = {
  recipe: {},
  search: { query: "", results: [], page: 1, resultsPerPage: RESULTS_PER_PAGE },
  bookmarks: [],
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

    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async query => {
  state.search.query = query;

  const data = await getJson(`${API_URL}?search=${query}`);

  state.search.results = data.data.recipes.map(e => {
    return {
      id: e.id,
      title: e.title,
      publisher: e.publisher,
      image: e.image_url,
    };
  });

  //em algum sítio a página tem de ser resetada a 1 após uma busca
  state.search.page = 1;

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

export const addBookmark = recipe => {
  // Adiciona o marcador
  state.bookmarks.push(recipe);

  // Marca a receita atual como marcada
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
};

export const removeBookmark = id => {
  // Remove o marcador
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Marca a receita atual como desmarcada
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
};
