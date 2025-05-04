<template>
    <button class="location-button" title="현재 위치로 이동" @click="handleLocationClick">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"></circle>
        <circle cx="12" cy="12" r="3"></circle>
        <line x1="12" y1="2" x2="12" y2="4"></line>
        <line x1="12" y1="20" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="4" y2="12"></line>
        <line x1="20" y1="12" x2="22" y2="12"></line>
      </svg>
    </button>
  </template>
  
  <script>
  export default {
    name: 'LocationButton',
    methods: {
      handleLocationClick() {
        //alert('현재 위치로 이동합니다.');
        console.log('현재 위치로 이동 버튼이 클릭되었습니다.');
        this.$emit('locate');
      }
    }
  }
  </script>
  
  <style scoped>
  .location-button {
    position: fixed;
    bottom: 110px;
    right: 20px;
    width: 56px;
    height: 56px;
    background: linear-gradient(to right, #8DE557 0%, #C6F264 100%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }
  
  .location-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  
  .location-button:active {
    transform: scale(0.95);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  
  .location-button svg {
    stroke: white;
    width: 30px;  
    height: 30px; 
  }
  </style>