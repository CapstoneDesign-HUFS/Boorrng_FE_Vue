<template>

  <!-- <SearchResultPage v-if="isSearched" :searchResults="searchResults" @back="isSearched = false" /> -->

  
  <router-view class="fullscreen-child"></router-view>
  <div class="tmap-page">
    <div id="map_div" class="map-container"></div>
  </div>
  <SearchBox v-if="showSearchBox===true" @search="handleSearch" />
  <LocationButton v-if="showLocationButton===true" @locate="handleLocationClick" />
    <div class="route-test-button" @click="showRoute">
    <span>경로 테스트</span>
  </div>
  <div class="light-test-button" @click="showSignal">
    <span>신호등 정보</span>
  </div>
  <SignalModal v-if="this.showSignalModal===true" @closeModal="closeSignalModal" />
  
  <RouteInfoModal v-if="showRouteInfoModal" @startGuidance="startGuidance"/>
  <RouteHeader v-if="showRouteHeader" @close="endGuidance"/>
</template>

<script>
import SearchBox from '../components/SearchBox.vue';
import LocationButton from '../components/LocationButton.vue';
import SearchResultPage from './SearchResultPage.vue';
import SignalModal from '../components/SignalModal.vue';
import RouteInfoModal from '@/components/RouteInfoModal.vue';
import RouteHeader from '@/components/RouteHeader.vue';
import axios from 'axios';
import dotenv from 'dotenv';

export default {
  name: 'TMap',
  components: {
    SearchBox,
    LocationButton,
    SearchResultPage,
    SignalModal,
    RouteInfoModal,
    RouteHeader,
  },
  data() {
    return {
      map: null,
      searchResults: null,
      tmapKey: import.meta.env.VITE_APP_TMAP, // .env 파일에서 TMap API 키 가져오기
      tmapApi: null,
      currentLocation: {lat: 37.594453, lon: 127.079074}, // 예지다움 오피스텔

      isSearched: false, // 검색 여부

      
      // 경로 관련
      route: null,
      routeLines: [],


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

      showRouteHeader: false,
      showRouteInfoModal: false,
      showSearchBox: true,
      showLocationButton: true,

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
        
        this.$store.commit('setHomePageState', false); // BottomNav 설정

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
  
    // 1. 현재 위치로 이동 처리 메소드 추가
    handleLocationClick() {
      console.log('현재 위치로 이동 버튼 클릭됨');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log('현재 위치:', lat, lon);
          
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
        iconSize: new Tmapv3.Size(70, 70), // 작게 설정
        map: this.map
      });
    },

    // 2. 신호등 상태 요청(json-server)
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
        icon: new URL('../assets/images/traffic-lights-icon.png', import.meta.url).href,
        iconSize: new Tmapv3.Size(50, 50), // 작게 설정
        map: this.map
      });
      this.signalMarker.on('click', this.handleSignalMarkerClick)
    },
    handleSignalMarkerClick(event) {
      console.log("신호등 마커 클릭됨", event);
      // 신호등 마커 클릭 시 처리할 로직 
      this.showSignalModal = true;
    },
    closeSignalModal() {
      this.showSignalModal = false;
    },


    // 3. 경로 요청 및 표시
    async showRoute() {
      console.log("경로 테스트 버튼 클릭됨");

      this.showRouteHeader = true;
      this.showRouteInfoModal = true;
      this.showSearchBox = false;
      this.showLocationButton = false;
      this.$store.commit('setHomePageState', false); // BottomNav 숨김

      try {
        // 기존 경로 객체가 있다면 삭제
        if (this.routeLines && this.routeLines.length > 0) {
          this.routeLines.forEach(line => line.setMap(null));
        }
        if (this.markerPoints && this.markerPoints.length > 0) {
          this.markerPoints.forEach(marker => marker.setMap(null));
        }
        
        this.routeLines = [];
        this.markerPoints = [];
        
        // 경로 데이터를 가져옴 (로컬 파일이나 서버에서)
        const response = await this.tmapApi.get('http://localhost:3000/tmap_raw');
        console.log("경로 정보:", response.data.features);
        
        const features = response.data.features;
        
        // 경로의 시작점과 끝점 좌표를 저장할 변수
        let startPoint, endPoint;
        
        // 경로 데이터 처리
        for (let i = 0; i < features.length; i++) {
          const feature = features[i];
          
          /* if (feature.geometry.type === "LineString"){
            const coordinates = feature.geometry.coordinates;
            coordinates.forEach(coord => {
              console.log(i + " 구간 좌표:", coord[0], coord[1]);
            });
          } */


          // LineString 타입의 요소만 처리 (실제 경로 라인)
          if (feature.geometry.type === "LineString") {
            const coordinates = feature.geometry.coordinates;
            const latLngArr = coordinates.map(coord => 
              new Tmapv3.LatLng(coord[1], coord[0])
            );

            console.log(i + " 구간 좌표:", latLngArr);
            
            // 경로 라인 생성
            const polyline = new Tmapv3.Polyline({
              path: latLngArr, // 경로 좌표 배열: [LatLng, LatLng, ...]
              strokeColor: "#5760E5",
              strokeWeight: 5,
              strokeOpacity: 1,
              map: this.map
            });
            
            this.routeLines.push(polyline);
          } 
          // Point 타입의 요소 처리 (시작점, 경유지, 회전지점)
          else if (feature.geometry.type === "Point") {
            const coord = feature.geometry.coordinates;
            const latLng = new Tmapv3.LatLng(coord[1], coord[0]);
            
            // 포인트 타입에 따라 마커 설정
            let markerType;
            if (feature.properties.pointType === "S") {
              // 시작점
              markerType = "start";
              startPoint = latLng;
            } else if (feature.properties.pointType === "E") {
              // 도착점
              markerType = "end";
              endPoint = latLng;
            } else if (feature.properties.pointType === "N") {
              // 회전지점
              // markerType = "waypoint";
              continue;
            } else {
              continue; // 다른 포인트 타입은 처리하지 않음
            }
            
            // 마커 이미지 설정
            let markerImg, markerSize;
            if (markerType === "start") {
              markerImg = "../assets/images/start.png";
              markerSize = new Tmapv3.Size(28, 28);
            } else if (markerType === "end") {
              markerImg = "../assets/images/end.png";
              markerSize = new Tmapv3.Size(28, 28);
            } else {
              // 경유지는 작은 원형 마커로 표시
              // markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png";
              // markerSize = new Tmapv3.Size(12, 12);
            }
            
            // 마커 생성
            const marker = new Tmapv3.Marker({
              position: latLng,
              icon: new URL(markerImg, import.meta.url).href,
              iconSize: markerSize,
              title: feature.properties.name,
              map: this.map
            });
            
            this.markerPoints.push(marker);
          }
        }
        
        // 시작점과 끝점으로 bounds 설정
        const bounds = new Tmapv3.LatLngBounds(startPoint, endPoint);

        // 1. 기본 fitBounds 실행
        this.map.fitBounds(bounds);
        // 2. 추가 여백 설정 (예: 20px)
        const padding = { top: 140, bottom: 280, left: 50, right: 50 };
        this.map.fitBounds(bounds, padding);
        
        // 경로 정보 저장
        this.route = response.data;
        
      } catch (error) {
        console.error("경로 요청 오류", error);
      }
    },

    // 4. 경로 안내 시작
    startGuidance() {
      console.log("경로 안내 시작");
      // 여기에 경로 안내 시작 로직 추가
      this.showRouteInfoModal = false;
      this.showRouteHeader = true;
      this.showSearchBox = false;
      this.showLocationButton = false;
      this.$store.commit('setHomePageState', false); // BottomNav 설정
    },

    // 5. 경로 안내 종료
    endGuidance() {
      console.log("경로 안내 종료");
      this.showRouteInfoModal = false;
      this.showRouteHeader = false;
      this.showSearchBox = true;
      this.showLocationButton = true;
      this.$store.commit('setHomePageState', true); // BottomNav 설정

      try {
        // 경로 객체 삭제
        if (this.routeLines && this.routeLines.length > 0) {
          this.routeLines.forEach(line => line.setMap(null));
        }
        if (this.markerPoints && this.markerPoints.length > 0) {
          this.markerPoints.forEach(marker => marker.setMap(null));
        }
      }
      catch (error) {
        console.error("경로 종료 오류", error);
      }
    },
  
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
  right: 200px;
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

.light-test-button {
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

.light-test-button:active {
  background-color: #1976D2;
}
</style>