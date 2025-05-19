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
            },


            // 인증 토큰
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
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

        // 인증 관련
        SET_ACCESS_TOKEN(state, token) {
            state.accessToken = token
            state.isAuthenticated = !!token
        },
        SET_REFRESH_TOKEN(state, token) {
            state.refreshToken = token
        },
        SET_USER(state, user) {
            state.user = user
        },
        CLEAR_AUTH(state) {
            state.accessToken = null
            state.refreshToken = null
            state.user = null
            state.isAuthenticated = false
        }
    },
    getters: {
        isAuthenticated: state => !!state.accessToken,
        getUser: state => state.user,
        getAccessToken: state => state.accessToken,
        getRefreshToken: state => state.refreshToken
    },
    actions: {
        login({ commit }, data) {
          // 토큰을 localStorage에도 백업으로 저장 (선택 사항)
          if (data.access) localStorage.setItem('accessToken', data.access)
          if (data.refresh) localStorage.setItem('refreshToken', data.refresh)
          
          // Vuex 상태 업데이트
          commit('SET_ACCESS_TOKEN', data.access)
          commit('SET_REFRESH_TOKEN', data.refresh)
          commit('SET_USER', data.user)
        },
        logout({ commit }) {
          // localStorage에서 제거
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          
          // Vuex 상태 초기화
          commit('CLEAR_AUTH')
        },
        // 페이지 새로고침 시 localStorage에서 데이터 복구
        initAuth({ commit }) {
          const accessToken = localStorage.getItem('accessToken')
          const refreshToken = localStorage.getItem('refreshToken')
          const user = localStorage.getItem('user')
          
          if (accessToken) {
            commit('SET_ACCESS_TOKEN', accessToken)
            commit('SET_REFRESH_TOKEN', refreshToken)
            
            if (user) {
              commit('SET_USER', JSON.parse(user))
            }
          } else {
            commit('CLEAR_AUTH')
          }
        }
    },
})
export default store;