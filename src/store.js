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
            },
            requestRoute: false,
            homePageState: true, 
            currentDeparture: {
                name: '',
                lat: 0,
                lng: 0,
            }
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
        },
        setRequestRoute(state, request) {
            state.requestRoute = request;
        },
        clearRouteRequest(state) {
            state.requestRoute = false;
        },
        setCurrentDeparture(state, departure) {
            state.currentDeparture = departure;
        },
    },
})
export default store;