import { API_URL } from "./config";
import { getJson } from "./helpers";

export const state = { recipe: {} };

export const loadRecipe = async id => {
  try {
    const data = await getJson(`${API_URL}/${id}`);

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
    console.error(err, "😘");
  }
};
