import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeViews.js';
import { func } from 'assert-plus';
import searchView from './views/searchView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import BookmarksView from './views/BookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

const recipeContainer = document.querySelector('.recipe');

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    await model.loadRecipe(id);
    // const { recipe } = model.state;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());

    recipeView.render(model.state.recipe);
    // resultsView.update(model.getSearchResultsPage);
    // controlServings();
    BookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();

    if (!query) return;
    resultsView.renderSpinner();
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage) {
  console.log(goToPage);
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};
// controlSearchResults();

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};
const controlAddRecipes = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    BookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
  setTimeout(function () {
    location.reload();
  }, MODAL_CLOSE_SEC * 1000);
};
const init = function () {
  BookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addhandlerrender(controlRecipes);
  recipeView.addhandlerUpdateServings(controlServings);
  recipeView.addhandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipes);
};

init();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
