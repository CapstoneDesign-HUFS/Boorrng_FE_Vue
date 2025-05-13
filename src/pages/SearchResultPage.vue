<template>
    <div class="search-page">
      <div class="container">
        <div class="search-header">
          <div class="back-button" @click="goBack">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </div>
          <div class="search-text">{{searchQuery}}</div>
        </div>
        
        <div class="results-header">
          <h1 class="results-title">{{searchQuery}}</h1>
          <p class="results-count">{{searchCount}}개의 검색 결과</p>
        </div>

        <DestinationSearchItem
            v-for="(result, index) in searchResults"
            :key="index"
            :result="result" />
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  import DestinationSearchItem from '@/components/DestinationSearchItem.vue';
  export default {
    name: 'SearchResultPage',

    components: {
      DestinationSearchItem,
    },

    methods: {
      goBack() {
        this.$store.commit('setHomePageState', true); 
        this.$router.push('/home');
      }
    },

    computed: {
        ...mapState(['searchQuery', 'searchResults', 'searchCount']),
    }
  }
  </script>
  
  <style scoped>
  /* 리셋 스타일 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Apple SD Gothic Neo', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  /* 전체 페이지 스타일 - 최상위 요소 */
  .search-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, #f5ffed, #e8f9db);
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1000;
  }
  
  /* 컨테이너 스타일 */
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }
  
  /* 검색 헤더 스타일 */
  .search-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    gap: 12px;
    background-color: white;
    padding-top: 40px; /* 노치 여백 */
    /* padding-top: calc(env(safe-area-inset-top) + 16px); */ /* 노치 여백 자동 조정 */
    width: 100%;
  }
  
  .back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .search-text {
    font-size: 16px;
    font-weight: 500;
  }
  
  /* 결과 헤더 스타일 */
  .results-header {
    padding: 20px 20px 15px 20px;
    margin-top: 10px;
    border-bottom: 1px solid rgba(200, 240, 175, 0.3);
    text-align: left;
    width: 100%;
  }
  
  .results-title {
    font-size: 26px;
    font-weight: 700;
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .results-count {
    font-size: 14px;
    color: #777;
  }
  </style>