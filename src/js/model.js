import { API_URL, KEY, RESULTS_PER_PAGE } from "./config";
import { getJson, sendJson } from "./helpers";

export const state = {
  recipe: {},
  search: { query: "", results: [], page: 1, resultsPerPage: RESULTS_PER_PAGE },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;

  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  });
};

export const loadRecipe = async id => {
  try {
    const data = await getJson(`${API_URL}${id}`);

    state.recipe = createRecipeObject(data);

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

const persistBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  // Adiciona o marcador
  state.bookmarks.push(recipe);

  // Marca a receita atual como marcada
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
};

export const removeBookmark = id => {
  // Remove o marcador
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Marca a receita atual como desmarcada
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith("ingredient") && entry[1])
      .map(ing => {
        const ingArray = ing[1].replaceAll(" ", "").split(",");

        if (ingArray.length !== 3)
          throw new Error(
            "Formato de ingrediente errado! Por favor use o formato: 'quantidade, unidade, descrição'"
          );

        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };

    const data = await sendJson(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = () => {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = () => {
  localStorage.clear("bookmarks");
};

//clearBookmarks();
