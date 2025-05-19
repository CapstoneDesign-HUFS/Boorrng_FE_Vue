<template>
    <div class="route-header">
      <div class="route-info">
        <span class="start-location">{{ startLocation }}</span>
        <span class="arrow">→</span>
        <span class="end-location">{{endLocation}}</span>
      </div>
      <button class="close-button" @click="close">
        <span>×</span>
      </button>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  export default {
    name: 'RouteHeader',
    computed: {
      startLocation() {
        return this.$store.state.currentDeparture.name;
      },
      endLocation() {
        return this.$store.state.selectedDestination.name;
      }
    },
    /* props: {
      startLocation: {
        type: String,
        default: '예지다움 오피스텔'
      },
      endLocation: {
        type: String,
        default: 'SC제일은행 상봉역지점'
      }
    }, */
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
  </script>
  
  <style scoped>
  .route-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: white;
    border-bottom: 1px solid #eeeeee;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: fixed; /* relative 대신 fixed 사용 */
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%; /* 너비 지정 */
    padding-top: 40px; /* 노치 여백 */
  }
  
  .route-info {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
  }
  
  .start-location {
    color: #666;
  }
  
  .arrow {
    margin: 0 8px;
    color: #666;
  }
  
  .end-location {
    font-weight: 700;
    color: #333;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  
  .close-button:hover {
    background-color: #f5f5f5;
  }
  </style>