import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    pageNumber: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    imageUrl: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const getRecipe = async function (id) {
  try {
    const recipeObj = await AJAX(`${API_URL}${id}?key=${KEY}`);
    console.log(recipeObj);
    // const data = await fetch(
    //   `${API_URL}/${id}`
    //   // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    // );
    // const recipeObj = await data.json();
    // if (!data.ok) throw new Error(`${recipeObj.message} (${data.status})`);

    //let { recipe } = recipeObj.data;
    state.recipe = createRecipeObject(recipeObj);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.isBookmarked = true;
    } else {
      state.recipe.isBookmarked = false;
    }
    console.log(state.recipe);
  } catch (err) {
    //console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.pageNumber = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPerPage = function (
  pageNum = state.search.pageNumber
) {
  state.search.pageNumber = pageNum;
  const start = (pageNum - 1) * state.search.resultsPerPage;
  const end = pageNum * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.map(ingredient => {
    ingredient.quantity =
      ingredient.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

// export const updateBookmarks = function (recipe) {
//   state.recipe.isBookmarked = !state.recipe.isBookmarked;
//   if (state.recipe.isBookmarked) state.bookmarks.push(recipe);
// };

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  if (id === state.recipe.id) state.recipe.isBookmarked = false;
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const ingArr = entry[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format, please use correct format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    console.log(state.bookmarks);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
