<template>

  <!-- <SearchResultPage v-if="isSearched" :searchResults="searchResults" @back="isSearched = false" /> -->

  
  <router-view class="fullscreen-child"></router-view>
  <div class="tmap-page">
    <div id="map_div" class="map-container"></div>
  </div>
  <SearchBox @search="handleSearch" />
  <LocationButton @locate="handleLocationClick" />

  
  
</template>

<script>
import SearchBox from '../components/SearchBox.vue';
import LocationButton from '../components/LocationButton.vue';
import SearchResultPage from './SearchResultPage.vue';
import axios from 'axios';
import dotenv from 'dotenv';

export default {
  name: 'TMap',
  components: {
    SearchBox,
    LocationButton,
    SearchResultPage,
  },
  data() {
    return {
      map: null,
      searchResults: null,
      tmapKey: import.meta.env.VITE_APP_TMAP, // .env 파일에서 TMap API 키 가져오기
      tmapApi: null,
      currentLocation: {lat: 37.566481622437934, lon: 126.98502302169841},

      isSearched: false, // 검색 여부
    };
  },
  created(){
    this.$store.commit('setNavMenu', 1); // BottomNav 설정
    this.tmapApi = axios.create({
      baseURL: 'https://apis.openapi.sk.com/tmap',
      headers: {
        'appKey': this.tmapKey,
        'Content-Type': 'application/json; charset=UTF-8',
      }
    })
  },
  mounted() {
    // 컴포넌트가 마운트된 후 지도 초기화
    this.$nextTick(() => {
      this.initTmap();
    });
    window.addEventListener('resize', this.resizeMap);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeMap);
  },
  methods: {
    initTmap() {
      /* if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.currentLocation.lat = position.coords.latitude;
          this.currentLocation.lon = position.coords.longitude;
        }, (error) => {
          console.error('위치 정보를 가져오는 데 실패했습니다.', error);
        }, {
          enableHighAccuracy: true, // 높은 정확도 (배터리 소모 증가)
          timeout: 5000,            // 최대 대기 시간
          maximumAge: 0             // 캐시된 위치 정보 사용 안 함
        });
      }
      console.log(this.currentLocation.lat, this.currentLocation.lon); */
      
      if (window.Tmapv3) {
        // 지도 초기화
        this.map = new Tmapv3.Map("map_div", {
          //center: new Tmapv3.LatLng(37.566481622437934, 126.98502302169841),
          center: new Tmapv3.LatLng(this.currentLocation.lat, this.currentLocation.lon),
          width: "100%",
          height: "100%",
          zoom: 16
        });
        
        // 지도 크기 조정
        this.resizeMap();
      } else {
        console.error("TMap API가 로드되지 않았습니다.");
      }
    },
    resizeMap() {
      if (this.map) {
        // 화면 크기에 맞춰 지도 크기 조정
        const screenHeight = window.innerHeight;
        const mapDiv = document.getElementById('map_div');
        mapDiv.style.height = `${screenHeight}px`;
        this.map.resize();
      }
    },
    // 검색 처리 메소드 추가
    async handleSearch(query) {
      console.log('검색어:', query);
      this.isSearched = true; // 검색 결과 페이지 표시
      console.log('검색 완료? ', this.isSearched);

      // 여기에 T Map API를 사용한 검색 및 결과 처리 로직 구현
      // 예: POI 검색, 경로 검색 등
      try {
      // await를 사용하여 Promise가 완료될 때까지 대기
        const response = await this.tmapApi.get('/pois', {
          params: {
            searchKeyword: query,
            version: 1,
            centerLat: this.currentLocation.lat,
            centerLon: this.currentLocation.lon,
            radius: 1, // 검색 반경 (km 단위)
          }
        });
        
        this.$store.commit('setHomePageState', 1); // BottomNav 설정

        // response.data에 실제 응답 데이터 존재
        console.log("검색결과:", response.data["searchPoiInfo"]['pois']['poi']);

        // 검색 결과를 Vuex 스토어에 저장
        this.$store.commit('setSearchQuery', query);
        this.$store.commit('setSearchCount', response.data["searchPoiInfo"]['totalCount']);
        this.$store.commit('setSearchResults', response.data["searchPoiInfo"]['pois']['poi']);

        // 검색 결과 페이지로 이동
        this.$router.push({ name: 'SearchResultPage' });

        
        
        // 필요한 데이터 처리
        /* if (response.data.searchPoiInfo && response.data.searchPoiInfo.pois) {
          this.searchResults = response.data.searchPoiInfo.pois.poi.map(item => {
            return {
              id: item.id,
              name: item.name,
              address: `${item.upperAddrName} ${item.middleAddrName} ${item.lowerAddrName}`,
              lat: item.noorLat,
              lon: item.noorLon
            };
          });
        } else {
          this.searchResults = [];
          console.log("검색 결과가 없습니다.");
        } */
      } catch (error) {
        //alert("API 요청 오류");
        console.log("API 요청 오류", error);
        this.searchResults = [];
      }
    },
    // 현재 위치로 이동 처리 메소드 추가
    handleLocationClick() {
      console.log('현재 위치로 이동 버튼 클릭됨');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // 현재 위치로 지도 중심 이동
          this.map.setCenter(new Tmapv3.LatLng(lat, lon));
          
          // GPS 마커 생성
          this.createGpsMarker(lat, lon);
          
        }, (error) => {
          console.error('위치 정보를 가져오는 데 실패했습니다.', error);
        }, {
          enableHighAccuracy: true, // 높은 정확도 (배터리 소모 증가)
          timeout: 5000,            // 최대 대기 시간
          maximumAge: 0             // 캐시된 위치 정보 사용 안 함
        });
      } else {
        alert('이 브라우저는 Geolocation을 지원하지 않습니다.');
      }
    },
    // GPS 위치를 표시하는 마커 생성
    createGpsMarker(lat, lon) {
      // 기존 GPS 마커가 있으면 삭제
      if (this.gpsMarker) {
        this.gpsMarker.setMap(null);
      }

      // 새 GPS 마커 생성
      this.gpsMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(lat, lon),
        icon: "https://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png", // 빨간색 마커
        //iconSize: new Tmapv3.Size(50, 50), // 작게 설정
        map: this.map
      });
      
      // GPS 정확도를 보여주는 원 추가 (선택사항)
      if (this.accuracyCircle) {
        this.accuracyCircle.setMap(null);
      }
      
      // 정확도 범위를 나타내는 원 (반경: 미터 단위)
      const accuracy = 50; // 예시로 50m 반경 설정
      this.accuracyCircle = new Tmapv3.Circle({
        center: new Tmapv3.LatLng(lat, lon),
        radius: accuracy,
        strokeColor: "#4B89F3",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#4B89F3",
        fillOpacity: 0.2,
        map: this.map
      });
    }
  }
}
</script>

<style scoped>
.tmap-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}
.fullscreen-child {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000; /* 맵보다 위에 표시 */
  background: linear-gradient(to bottom, #f5ffed, #e8f9db);
}
</style>