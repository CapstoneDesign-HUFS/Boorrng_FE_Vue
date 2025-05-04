import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            nav_menu : 1,
        }
    },
    mutations: {
        setNavMenu(state, menu) {
            //console.log("store.js setNavMenu called");
            state.nav_menu = menu;
        }
    },
})
export default store;