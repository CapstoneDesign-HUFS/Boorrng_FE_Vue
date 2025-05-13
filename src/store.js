import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            navMenu : 1,
            searchQuery: '',
            searchCount: 0,
            searchResults: [],
            selectedDestination: {
                name: '',
                lat: 0,
                lng: 0,
                distance: 0,
            },
            homePageState: true, 
        }
    },
    mutations: {
        setNavMenu(state, menu) {
            state.navMenu = menu;
        },
        setSearchResults(state, results) {
            state.searchResults = results;
        },
        setSelectedDestination(state, dest) {
            state.selectedDestination = dest;
        },
        setHomePageState(state, stateValue) {
            state.homePageState = stateValue;
        },
        setSearchQuery(state, query) {
            state.searchQuery = query;
        },
        setSearchCount(state, count) {
            state.searchCount = count;
        }
    },
})
export default store;