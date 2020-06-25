// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeViews';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shoppign list object
 * = Liked recepies
 */
const state = {};
window.state = state;

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) searchView.highLightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {
           //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

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

/**
 * List controller
 */

const controlList = () => {
    //Create a new list if there in none yet
    if (!state.list) state.list = new List();

    //Add each ingredients to the list and Ui
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle event and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; //Get id

    //Handle the delte item
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
        
    //Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { //.btn-decrease * - Any child of the .btn-decrease 
        //Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
});

