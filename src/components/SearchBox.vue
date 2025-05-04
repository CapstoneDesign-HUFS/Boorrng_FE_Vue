<template>
    <div class="search-container">
      <div class="search-bar">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          class="search-input" 
          placeholder="목적지 검색"
          v-model="searchQuery"
          @keypress.enter="search"
        >
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBox',
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      search() {
        this.$emit('search', this.searchQuery);
      }
    }
  }
  </script>
  
  <style scoped>
  .search-container {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    z-index: 100; /* 지도보다 높은 z-index 설정 */
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 50px;
    padding: 10px 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    box-sizing: border-box;
  }
  
  .search-icon {
    color: #777;
    margin-right: 15px;
  }
  
  .search-input {
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
    color: #333;
  }
  
  .search-input::placeholder {
    color: #999;
  }
  </style>