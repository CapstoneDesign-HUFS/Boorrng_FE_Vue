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

<!--   <div class="light-test-button" @click="showSignal">
    <span>신호등 정보</span>
  </div> -->

  <!--속도 출력 테스트-->

  <!-- <div class="speed-button" @click="toggleSpeedMeasurement">
    <span>{{ speedMeasurement.isActive ? '속도 측정 중지' : '속도 측정 시작' }}</span>
  </div> -->

  <!-- template 섹션에 추가 -->
  <div v-if="showSpeedDisplay" class="speed-display">
    <div class="speed-value">{{ speedMeasurement.displaySpeedKmh }}</div>
    <!-- <div class="speed-unit">km/h</div> -->
    <div class="speed-unit">km/h</div>
  </div>



  <SignalModal 
    :initialIntersectionName="selectedIntersection ? selectedIntersection.name : '로딩 중...'"
    :intersectionId="selectedIntersection ? selectedIntersection.itst_id : null"
    v-if="this.showSignalModal===true" @closeModal="closeSignalModal" />
  
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
import routeData from '../assets/mocks/route.js';
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
      //currentLocation: {lat: 37.59445276, lon: 127.07909440}, // 예지다움 오피스텔

      isSearched: false, // 검색 여부

      
      // 경로 관련
      route: null,
      routeLines: [],
      // mock 데이터
      routeData: routeData,


      // 신호등 관련
      intersections: [],
      signalnMarkers: [],

      selectedIntersection: null,

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

      // 실시간 속도 측정
      watchPositionId: null,
      speedMeasurement: {
        isActive: false,
        currentSpeed: 0,  // m/s
        avgSpeed: 0,      // m/s
        distance: 0,      // meters
        startTime: null,
        lastPosition: null,
        positions: [],
        displaySpeedKmh: '0.0',  // 화면에 표시할 km/h 속도
      },
      showSpeedDisplay: false,
      speedBuffer: [], // 최근 속도 값을 저장할 배열
      speedBufferSize: 5, // 평균에 사용할 값의 개수 (더 큰 값 = 더 부드러운 변화)

    };
  },
  watch: {
    // 스토어의 requestRoute 상태 감시
    '$store.state.requestRoute': {
      immediate: true,
      handler(value) {
        if (value && this.$store.state.selectedDestination) {
          console.log('스토어에서 경로 요청 감지');
          this.showRoute(this.$store.state.selectedDestination);
          // 플래그 초기화
          this.$store.commit('clearRouteRequest');
        }
      }
    }
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

/*     const query = this.$route.query;
    if (query.requestRoute === 'true') {
      console.log("경로 요청됨");
      this.showRoute();
    } */
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
      
      // 예지다움 오피스텔을 현위치로 사용
      this.map.setCenter(new Tmapv3.LatLng(this.currentLocation.lat, this.currentLocation.lon));
      this.createGpsMarker(this.currentLocation.lat, this.currentLocation.lon);
      this.showSignal();


      /* console.log('현재 위치로 이동');
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
      } */
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
    // 역지오코딩
    getAddressFromCoords() {
      // API 요청을 위한 파라미터 설정
      const params = {
        version: 1,
        lat: this.currentLocation.lat,
        lon: this.currentLocation.lon,
        coordType: 'WGS84GEO',
        addressType: 'A10'  // A10: 도로명 주소
      };
      
      // 이미 설정된 tmapApi 인스턴스 사용
      this.tmapApi.get('/geo/reversegeocoding', { params })
        .then(response => {
          // 응답 데이터에서 주소 정보 추출
          const addressInfo = response.data.addressInfo;
          
          // 전체 주소 표시
          const address = addressInfo.fullAddress;
          const gugun = addressInfo.gu_gun;
          const legalDong = addressInfo.legalDong;
          const bunji = addressInfo.bunji;
          const addressName = `${gugun} ${legalDong} ${bunji}`;
          const departure = {
            name: addressName,
            lat: this.currentLocation.lat,
            lon: this.currentLocation.lon,
          }
          this.$store.commit('setCurrentDeparture', departure);
          
          console.log('현재 주소 정보 가져오기 성공:', address);
        })
        .catch(error => {
          console.error('주소 정보 가져오기 실패:', error);
        });
    },
    // 검색 처리 메소드 추가
    async handleSearch(query) {
      console.log('검색어:', query);
      this.isSearched = true; // 검색 결과 페이지 표시
      console.log('검색 완료? ', this.isSearched);

      this.getAddressFromCoords(); // 역지오코딩 호출

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

    // 2. 신호등 요청(json-server)
    async showSignal() {
      await this.getIntersectionLocation()
      console.log("신호등 위치(this):", this.intersections);

      // 기존 마커 제거 (필요시)
      if (this.signalMarkers) {
        this.signalMarkers.forEach(marker => marker.setMap(null));
      }
      this.signalMarkers = [];

      for (let i = 0; i < this.intersections.length; i++) {
        const intersection = this.intersections[i];
        const lat = intersection['latitude'];
        const lon = intersection['longitude'];
        console.log(`교차로 마커 생성: ${intersection.name}, 위치: ${lat}, ${lon}`);
        
        // 신호등 마커 생성
        const signalMarker = new Tmapv3.Marker({
          position: new Tmapv3.LatLng(lat, lon),
          icon: new URL('../assets/images/traffic-lights-icon.png', import.meta.url).href,
          iconSize: new Tmapv3.Size(50, 50),
          map: this.map,
          title: intersection.name
        });
        
        // 마커에 클릭 이벤트 추가
        signalMarker.on('click', () => {
          this.handleSignalMarkerClick(intersection);
        });
        
        // 마커 관리를 위해 배열에 추가
        this.signalMarkers.push(signalMarker);
      }
    },
    // 신호등 위치 요청
    async getIntersectionLocation() {
      console.log("신호등 위치 요청");
      try{
        const url = `https://woodzverse.pythonanywhere.com/map/traffic-lights/nearby/?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&radius=500`
        
        // const response = await axios.get('http://localhost:3000/intersections');
        const response = await axios.get(url);
        // 실제 API URL로 변경
        // const url = `http://woodzverse.pythonanywhere.com/map/traffic-lights/nearby/?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lon}&radius=1000`
        // const response = await axios.get(url)
        
        console.log("신호등 위치:", response.data);
        
        if (Array.isArray(response.data)) {
          console.log("데이터는 배열 형식입니다. 길이:", response.data.length);
          this.intersections = response.data;
          console.log("this.intersections 저장 후:", this.intersections);
        } else {
          console.error("API 응답이 배열이 아닙니다:", response.data);
          this.intersections = []; // 기본값으로 초기화
        }
        // 여기에 신호등 위치를 처리하는 로직 추가
        // this.signalLocation = {lat: 37.5682795, lon: 126.9876861};
        // this.signalState = response.data['signals'][0]['signalColor'];
        // this.remaingSeconds = response.data['signals'][0]['remaingSeconds'];
      } catch (error) {
        console.error("신호등 위치 요청 오류", error);
      }
    },

    async handleSignalMarkerClick(intersection) {
      console.log("신호등 마커 클릭됨", intersection);
      // 신호등 마커 클릭 시 처리할 로직 
      this.selectedIntersection = intersection;
      this.map.setCenter(new Tmapv3.LatLng(intersection.latitude, intersection.longitude));

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
        // const response = await this.tmapApi.get('http://localhost:3000/tmap_raw'); // 로컬 서버
        const response = this.routeData.routes.tmap_raw; // mock 데이터
        // console.log("경로 정보:", response.data.features); // 로컬 서버 버전
        
        //const features = response.data.features; // 로컬 서버 버전
        const features = response.features;
        
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
            if (feature.properties.pointType === "SP") {
              // 시작점
              markerType = "start";
              startPoint = latLng;
            } else if (feature.properties.pointType === "EP") {
              // 도착점
              markerType = "end";
              endPoint = latLng;
            } else if (feature.properties.pointType === "GP") {
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
        if (startPoint && endPoint) {
          const bounds = new Tmapv3.LatLngBounds(startPoint, endPoint);

          // 1. 기본 fitBounds 실행
          this.map.fitBounds(bounds);
          // 2. 추가 여백 설정
          const padding = { top: 140, bottom: 280, left: 50, right: 50 };
          this.map.fitBounds(bounds, padding);
        } else {
          console.log("시작점 또는 끝점이 정의되지 않았습니다.");
          // 기본 지도 중심 설정
          if (startPoint) {
            this.map.setCenter(startPoint);
          } else if (endPoint) {
            this.map.setCenter(endPoint);
          }
        }
        
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

    // 6. 실시간 속도 측정 시작
    startSpeedMeasurement() {
      if (this.speedMeasurement.isActive) return;
      
      console.log("보행 속도 측정 시작");
      this.speedMeasurement.isActive = true;
      this.speedMeasurement.startTime = new Date();
      this.speedMeasurement.positions = [];
      this.speedMeasurement.distance = 0;
      this.speedMeasurement.currentSpeed = 0;
      this.speedMeasurement.avgSpeed = 0;
      this.speedMeasurement.lastPosition = null;
      this.showSpeedDisplay = true;
      
      // 위치 추적 시작
      if (navigator.geolocation) {
        this.watchPositionId = navigator.geolocation.watchPosition(
          this.handlePositionUpdate,
          (error) => {
            console.error('위치 추적 오류:', error);
            alert('위치 정보를 가져오는 데 실패했습니다.');
            this.stopSpeedMeasurement();
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        alert('이 브라우저는 Geolocation을 지원하지 않습니다.');
      }
    },

    // 위치 업데이트 핸들러
    handlePositionUpdate(position) {
      const currentPosition = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        timestamp: new Date(),
        accuracy: position.coords.accuracy
      };
      
      // 첫 위치인 경우
      if (!this.speedMeasurement.lastPosition) {
        this.speedMeasurement.lastPosition = currentPosition;
        this.speedMeasurement.positions.push(currentPosition);
        return;
      }
      
      // 이전 위치와 현재 위치 사이의 거리 계산 (미터 단위)
      const distance = this.calculateDistance(
        this.speedMeasurement.lastPosition.lat,
        this.speedMeasurement.lastPosition.lon,
        currentPosition.lat,
        currentPosition.lon
      );
      
      // 시간 차이 계산 (초 단위)
      const timeDiff = (currentPosition.timestamp - this.speedMeasurement.lastPosition.timestamp) / 1000;
      
      // 현재 속도 계산 (m/s)
      /* if (timeDiff > 0) {
        // 정확도가 너무 낮은 경우 필터링 (예: 50m 이상인 경우)
        if (currentPosition.accuracy <= 50) {
          this.speedMeasurement.currentSpeed = distance / timeDiff;
          this.speedMeasurement.distance += distance;
          
          // 평균 속도 계산 (m/s)
          const totalTime = (currentPosition.timestamp - this.speedMeasurement.startTime) / 1000;
          if (totalTime > 0) {
            this.speedMeasurement.avgSpeed = this.speedMeasurement.distance / totalTime;
          }
          
          // 표시용 km/h 속도 변환 (소수점 한 자리까지)
          // this.speedMeasurement.displaySpeedKmh = (this.speedMeasurement.currentSpeed * 3.6).toFixed(1);
          this.speedMeasurement.displaySpeedKmh = this.speedMeasurement.currentSpeed.toFixed(1); */
      if (timeDiff > 0) {
        if (currentPosition.accuracy <= 20) { // 정확도 필터링
          // 현재 속도 계산
          const currentSpeed = distance / timeDiff;
          
          // 속도 버퍼에 현재 속도 추가
          this.speedBuffer.push(currentSpeed);
          
          // 버퍼 크기 유지
          if (this.speedBuffer.length > this.speedBufferSize) {
            this.speedBuffer.shift(); // 가장 오래된 값 제거
          }
          
          // 이동 평균 계산 (비정상적으로 큰 값은 제외)
          let validSpeeds = [...this.speedBuffer];
          if (validSpeeds.length >= 3) {
            // 중간값 필터링을 위해 속도 정렬
            validSpeeds.sort((a, b) => a - b);
            
            // 너무 크거나 작은 값(이상치) 제거 (상위 25%, 하위 25% 제거)
            const startIdx = Math.floor(validSpeeds.length * 0.25);
            const endIdx = Math.ceil(validSpeeds.length * 0.75);
            validSpeeds = validSpeeds.slice(startIdx, endIdx);
          }
          
          // 필터링된 속도의 평균 계산
          const avgSpeed = validSpeeds.reduce((sum, speed) => sum + speed, 0) / 
                          (validSpeeds.length || 1);
          
          // 평균 속도를 현재 속도로 설정
          this.speedMeasurement.currentSpeed = avgSpeed;
          
          // 표시용 km/h 속도 변환 (소수점 한 자리까지)
          this.speedMeasurement.displaySpeedKmh = (avgSpeed * 3.6).toFixed(1);
          
          // 현재 위치 저장
          this.speedMeasurement.positions.push(currentPosition);
          this.speedMeasurement.lastPosition = currentPosition;
          
          // 지도 위치 업데이트
          this.updateMapWithCurrentPosition(currentPosition);
        }
      }
    },
    
    // 두 지점 간의 거리 계산 (Haversine 공식)
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000; // 지구 반경 (미터)
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      return R * c; // 미터 단위 거리
    },
    
    // 지도 위치 업데이트
    updateMapWithCurrentPosition(position) {
      // 현재 위치로 지도 중심 이동
      this.map.setCenter(new Tmapv3.LatLng(position.lat, position.lon));
      
      // GPS 마커 생성/업데이트
      this.createGpsMarker(position.lat, position.lon);
    },
    
    // 속도 측정 종료
    stopSpeedMeasurement() {
      if (!this.speedMeasurement.isActive) return;
      
      console.log("보행 속도 측정 종료");
      
      if (this.watchPositionId !== null) {
        navigator.geolocation.clearWatch(this.watchPositionId);
        this.watchPositionId = null;
      }
      
      this.speedMeasurement.isActive = false;
      this.showSpeedDisplay = false;
      
      // 측정 결과 출력
      console.log("측정 결과:");
      console.log(`총 이동 거리: ${this.speedMeasurement.distance.toFixed(2)}m`);
      console.log(`평균 속도: ${(this.speedMeasurement.avgSpeed * 3.6).toFixed(2)}km/h`);
      console.log(`경과 시간: ${((new Date() - this.speedMeasurement.startTime) / 1000).toFixed(0)}초`);
    },
    toggleSpeedMeasurement() {
      if (this.speedMeasurement.isActive) {
        this.endGuidanceTemp();    // 활성화 상태일 때 종료 메서드를 호출
      } else {
        this.startGuidanceTemp();  // 비활성화 상태일 때 시작 메서드를 호출
      }
    },
    startGuidanceTemp() {
      console.log("경로 안내 시작");
      // 여기에 경로 안내 시작 로직 추가
      this.showRouteInfoModal = false;
      this.showRouteHeader = true;
      this.showSearchBox = false;
      this.showLocationButton = false;
      this.$store.commit('setHomePageState', false); // BottomNav 설정

      // 속도 측정 시작
      this.startSpeedMeasurement();

    },
    endGuidanceTemp() {
      console.log("경로 안내 종료");
      this.showRouteInfoModal = false;
      this.showRouteHeader = false;
      this.showSearchBox = true;
      this.showLocationButton = true;
      this.$store.commit('setHomePageState', true); // BottomNav 설정

      // 속도 측정 종료
      this.stopSpeedMeasurement();

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



/* 속도 측정 임시 */
/* style 섹션에 추가 */
.speed-display {
  position: fixed;
  top: 100px; /* RouteHeader 아래에 위치 */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  text-align: center;
  font-family: Arial, sans-serif;
  z-index: 900;
  width: 160px;
}

.speed-value {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 4px;
}

.speed-unit {
  font-size: 16px;
  opacity: 0.8;
}
.speed-button {
  position: fixed;
  right: 20px;
  bottom: 150px; /* 다른 버튼들 위에 위치하도록 조정 */
  background-color: #FF5722; /* 오렌지 색상으로 구분 */
  color: white;
  padding: 12px 16px;
  border-radius: 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 900;
  cursor: pointer;
  font-weight: bold;
}

.speed-button:active {
  background-color: #E64A19; /* 클릭 시 더 어두운 색상 */
}
</style>