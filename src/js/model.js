import { API_URL } from "./config";
import { getJson } from "./helpers";

export const state = { recipe: {}, search: { query: "", results: [] } };

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
