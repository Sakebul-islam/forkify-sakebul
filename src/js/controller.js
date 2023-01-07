import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const { async } = require('q');

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultView.update(model.getSearchResuttsPage());

    // 1) Updating Bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendaring recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    // console.log(resultView);
    // 1) Get search query
    const queary = searchView.getQuery();
    if (!queary) resultView.renderError();

    // 2) Load search results
    await model.loadSearchResults(queary);

    // 3) Render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResuttsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  console.log(goToPage);
  // 1) Render NEW results
  resultView.render(model.getSearchResuttsPage(goToPage));

  // 2) Render NEW initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    // 2) Update recipe view
    recipeView.render(model.state.recipe);

    // 3) Success MEssage
    addRecipeView.renderMessage();

    // 4) Render Bookmark View
    bookmarksView.render(model.state.bookmarks)
    
    // 5) Change ID in URL
window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // 6) Close from window
    setTimeout(function () {
      addRecipeView.toggolWindow();
    }, MODEL_CLOSE_SEC * 1000);



  } catch (err) {
    console.error('✴', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  searchView.cursorFocus();
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome'); 
};
init();
