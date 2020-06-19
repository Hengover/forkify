// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchViews';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 * - Search object
 * - Current recipe object
 * - Shoppign list object
 * = Liked recepies
 */
const state = {};

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

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
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