<template>
    <div class="result-item">
        <div class="result-info">
          <h3 class="result-name">{{ result.name }}</h3>
          <div class="result-details">
            <span class="result-distance">{{ result.radius * 1000 }}m</span>
            <span class="result-address">{{ `${result.upperAddrName} ${result.middleAddrName} ${result.roadName} ${result.firstBuildNo}`}}</span>
          </div>
        </div>
        <div @click="getRoute" class="arrow-button" role="button" tabindex="0" aria-label="경로탐색">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
</template>
<script>
export default{
  name: 'DestinationSearchItem',
  props: {
    result: Object, // 검색결과 1개 - response.data["searchPoiInfo"]["pois"]의 원소 하나
  },
  methods: {
    getRoute() {
      this.$store.commit('setSelectedDestination', {
        name: this.result.name,
        lat: this.result.noorLat,
        lon: this.result.noorLon,
        distance: this.result.radius * 1000,
      });

      // 경로 탐색 구현해야 함
      console.log("getRoute() 호출됨", this.$store.state.selectedDestination);
    }
  }
}
</script>

<style scoped>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Apple SD Gothic Neo', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    html, body {
      width: 100%;
      overflow-x: hidden;
      position: relative;
      min-height: 100vh;
      color: #333;
    }
    .result-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid rgba(200, 240, 175, 0.3);
      width: 100%;
      box-sizing: border-box;
    }
    
    .result-info {
      flex: 1;
      min-width: 0; /* This is crucial for text-overflow to work */
      padding-right: 10px;
    }
    
    .result-name {
      font-size: 17px;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
      text-align: left;
    }
    
    .result-details {
      display: flex;
      align-items: center;
    }
    
    .result-distance {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin-right: 8px;
    }
    
    .result-address {
      font-size: 14px;
      color: #888;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 10px);
    }
    
    .arrow-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c6f264, #8de557);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 10px rgba(141, 229, 87, 0.3);
      cursor: pointer;
      border: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .arrow-button:hover, .arrow-button:focus {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(141, 229, 87, 0.4);
    }
    
    .arrow-button:active {
      transform: scale(0.98);
    }
</style>