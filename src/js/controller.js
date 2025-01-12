import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/SearchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/PaginationView.js';
import bookmarkView from './views/bookmarkView.js';
import customRecipeView from './views/customRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 1. Loading recipe
    await model.getRecipe(id);
    const { recipe } = model.state;

    //update result view to mark selected search result
    resultsView.update(model.getSearchResultsPerPage());

    //2. rendering recipe
    recipeView.render(model.state.recipe);

    //update bookmarks view
    bookmarkView.update(model.state.bookmarks);
    //test servings update
    //controlServings();
  } catch (err) {
    //console.log(err);
    recipeView.renderError(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPerPage());
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPerPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.isBookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarkOnInitialLoad = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlCustomRecipe = async function (newrecipe) {
  try {
    //render spinner
    customRecipeView.renderSpinner();
    await model.uploadRecipe(newrecipe);
    console.log(model.state.recipe);
    //render recipe
    recipeView.render(model.state.recipe);
    //success message display
    customRecipeView.renderSuccess();
    //render bookmark view
    bookmarkView.render(model.state.bookmarks);
    //change url
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      customRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.error(err);
    customRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipies);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addServingsHandler(controlServings);
  recipeView.addBookmarksHandler(controlBookmark);
  bookmarkView.addHandlerRender(controlBookmarkOnInitialLoad);
  customRecipeView.uploadFormDataHandler(controlCustomRecipe);
};
init();
