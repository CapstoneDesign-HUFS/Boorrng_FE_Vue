<template>

  <!-- <SearchResultPage v-if="isSearched" :searchResults="searchResults" @back="isSearched = false" /> -->

  
  <router-view class="fullscreen-child"></router-view>
  <div class="tmap-page">
    <div id="map_div" class="map-container"></div>
  </div>
  <SearchBox @search="handleSearch" />
  <LocationButton @locate="handleLocationClick" />
  <!--   <div class="route-test-button" @click="testRouteSearch">
    <span>경로 테스트</span>
  </div> -->
  <div class="route-test-button" @click="showSignal">
    <span>신호등 정보</span>
  </div>
  <SignalModal v-if="this.showSignalModal===true" @closeModal="closeSignalModal" />

  
</template>

<script>
import SearchBox from '../components/SearchBox.vue';
import LocationButton from '../components/LocationButton.vue';
import SearchResultPage from './SearchResultPage.vue';
import SignalModal from '../components/SignalModal.vue';
import axios from 'axios';
import dotenv from 'dotenv';

export default {
  name: 'TMap',
  components: {
    SearchBox,
    LocationButton,
    SearchResultPage,
    SignalModal,
  },
  data() {
    return {
      map: null,
      searchResults: null,
      tmapKey: import.meta.env.VITE_APP_TMAP, // .env 파일에서 TMap API 키 가져오기
      tmapApi: null,
      currentLocation: {lat: 37.566481622437934, lon: 126.98502302169841},

      isSearched: false, // 검색 여부

      
      startMarker: null,
      endMarker: null,
      routeLayer: null,  // 경로 레이어


      // 신호등 관련
      signalLocation: {
        lat: 0,
        lon: 0,
      },
      signalState: {
        signalColor: 'red',
        remaingSeconds: 0, // 초
      },

      showSignalModal: false,

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
        icon: new URL('../assets/images/current-marker.png', import.meta.url).href, 
        iconSize: new Tmapv3.Size(50, 50), // 작게 설정
        map: this.map
      });
    },

    // 신호등 상태 요청(json-server)
    async getSignalState() {
      console.log("신호등 정보 요청");
      try{
        const response = await axios.get('http://localhost:3000/traffic-light');
        console.log("신호등 정보:", response.data);
        // 여기에 신호등 정보를 처리하는 로직 추가
        this.signalLocation = {lat: 37.5682795, lon: 126.9876861};
        this.signalState = response.data['signals'][0]['signalColor'];
        this.remaingSeconds = response.data['signals'][0]['remaingSeconds'];
      } catch (error) {
        console.error("신호등 정보 요청 오류", error);
      }
    },
    // 신호등 카운트다운
    countdownSignal(signal) {
      console.log("신호등 카운트다운:", signal);
      // 여기에 신호등 카운트다운 처리 로직 추가
    },

    async showSignal(){
      await this.getSignalState()
      console.log("신호등 상태:", this.signalState);
      this.map.setCenter(new Tmapv3.LatLng(this.signalLocation.lat, this.signalLocation.lon));

      this.signalMarker = new Tmapv3.Marker({
        position: new Tmapv3.LatLng(this.signalLocation.lat, this.signalLocation.lon),
        map: this.map
      });
      this.signalMarker.on('click', this.handleSignalMarkerClick)
    },
    handleSignalMarkerClick(event) {
      console.log("신호등 마커 클릭됨", event);
      // 여기에 신호등 마커 클릭 시 처리할 로직 추가
      this.showSignalModal = true;
    },
    closeSignalModal() {
      this.showSignalModal = false;
    },

    /*     // API 호출을 통한 경로 검색
    async searchRouteWithAxios(startPoint, endPoint) {
      try {
        // 기존 경로 및 마커 삭제
        this.clearRoute();
        
        // 출발지, 도착지 좌표 설정
        const startLatLng = new Tmapv3.LatLng(startPoint.lat, startPoint.lon);
        const endLatLng = new Tmapv3.LatLng(endPoint.lat, endPoint.lon);
        
        // 출발지 마커 생성
        this.startMarker = new Tmapv3.Marker({
          position: startLatLng,
          icon: "https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png", // 기본 출발지 마커 이미지
          iconSize: new Tmapv3.Size(24, 38),
          map: this.map
        });
        
        // 도착지 마커 생성
        this.endMarker = new Tmapv3.Marker({
          position: endLatLng,
          icon: "https://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png", // 기본 도착지 마커 이미지
          iconSize: new Tmapv3.Size(24, 38),
          map: this.map
        });

        console.log('경로 검색 시작:', startPoint, endPoint);

        // API 직접 호출
        const response = await this.tmapApi.post('/routes/pedestrian', {
          version: 1,
          startX: startPoint.lon,
          startY: startPoint.lat,
          endX: endPoint.lon,
          endY: endPoint.lat,
          reqCoordType: 'WGS84GEO',
          resCoordType: 'WGS84GEO',
          searchOption: '0',
          trafficInfo: 'Y'
        });
        
        console.log('경로 응답:', response.data);
        
        // 응답 데이터를 이용해 경로 그리기
        this.drawRouteFromResponse(response.data);
        
      } catch (error) {
        console.error('경로 검색 중 오류 발생:', error);
        alert('경로 검색 중 오류가 발생했습니다.');
      }
    },

    // 응답 데이터를 이용해 경로 그리기
    drawRouteFromResponse(routeData) {
      if (!routeData || !routeData.features) {
        console.error('유효하지 않은 경로 데이터');
        return;
      }
      
      this.routeLayer = [];
      
      routeData.features.forEach(feature => {
        if (feature.geometry && feature.geometry.type === 'LineString') {
          const coords = feature.geometry.coordinates;
          
          // 경로 좌표 추출
          const points = [];
          coords.forEach(coord => {
            // TMap API는 [경도, 위도] 순서로 좌표를 제공
            points.push(new Tmapv3.LatLng(coord[1], coord[0]));
          });
          
          // 선 스타일 설정
          let strokeColor = '#FF0000'; // 기본 빨간색
          const strokeWeight = 6;
          
          // 교통 정보가 있는 경우 색상 변경
          if (feature.properties && feature.properties.trafficIndex) {
            switch (feature.properties.trafficIndex) {
              case 0: // 정보 없음
                strokeColor = '#636363';
                break;
              case 1: // 원활
                strokeColor = '#19b069';
                break;
              case 2: // 서행
                strokeColor = '#f39019';
                break;
              case 3: // 정체
                strokeColor = '#ff5a5a';
                break;
              case 4: // 심각한 정체
                strokeColor = '#b52e2e';
                break;
            }
          }
          
          // 경로선 생성
          const polyline = new Tmapv3.Polyline({
            path: points,
            strokeColor: strokeColor,
            strokeWeight: strokeWeight,
            strokeOpacity: 0.7,
            map: this.map
          });
          
          // 경로 레이어에 추가
          this.routeLayer.push(polyline);
          
          // 경로 범위에 맞게 지도 조정 (개별 라인별로 하는 것보다 전체 경로에 대해 한 번만 하는 것이 좋음)
          if (this.routeLayer.length === 1) { // 첫 번째 라인일 때만 실행
            const bounds = new Tmapv3.LatLngBounds();
            points.forEach(point => bounds.extend(point));
            this.map.fitBounds(bounds, { padding: 50 });
          }
        }
      });
    },
    testRouteSearch() {
      // 테스트용 출발지/도착지 좌표 (서울역과 광화문)
      const startPoint = { lat: 37.5536, lon: 126.9696 }; // 서울역
      const endPoint = { lat: 37.5726, lon: 126.9760 };   // 광화문
      
      // jQuery 없는 방식으로 경로 검색 테스트
      this.searchRouteWithAxios(startPoint, endPoint);
    },
    // 기존 경로 및 마커 삭제하는 메소드
    clearRoute() {
      // 출발지, 도착지 마커 삭제
      if (this.startMarker) {
        this.startMarker.setMap(null);
        this.startMarker = null;
      }
      
      if (this.endMarker) {
        this.endMarker.setMap(null);
        this.endMarker = null;
      }
      
      // 경로 레이어 삭제
      if (this.routeLayer) {
        if (Array.isArray(this.routeLayer)) {
          this.routeLayer.forEach(layer => {
            if (layer) layer.setMap(null);
          });
        } else {
          this.routeLayer.setMap(null);
        }
        this.routeLayer = null;
      }
    },
 */
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
.route-test-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  background-color: #2196F3;
  color: white;
  padding: 12px 16px;
  border-radius: 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 900;
  cursor: pointer;
  font-weight: bold;
}

.route-test-button:active {
  background-color: #1976D2;
}
</style>