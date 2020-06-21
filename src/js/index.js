// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchViews';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shoppign list object
 * = Liked recepies
 */
const state = {};

/**Search conroller */
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); //Get input from form

    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search!')
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //cancels the default event action
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); //Return closest element  
     
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //Return data atributes string
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }
})


/**
 * Recipe controller
 */

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', ''); //Return entire url( in this case - hash symbole - id)
    console.log(id);

    if(id) {
        //Prepare UI for changes

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {
           //Get recipe data
            await state.recipe.getRecipe();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            //Render recipe
            console.log(state.recipe);

        } catch (err) {
            alert('Error processing recipe!')
        }
        
    }
};

/*
window.addEventListener('hashchange', controlRecipe); //When we change hash this return controlRecipe function
window.addEventListener('load', controlRecipe); //It fired whenever page located (For example - when user load page from sidebar)
*/

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));