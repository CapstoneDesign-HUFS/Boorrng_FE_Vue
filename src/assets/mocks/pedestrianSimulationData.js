// pedestrianSimulationData.js
// 보행자 이동 시뮬레이션을 위한 데이터 (7-8분 이동)
// 서울중랑우체국 신호등 주기: 녹색 41초, 적색 109초

/**
 * 보행자 이동 시뮬레이션 데이터
 * 실제 사용자가 이동하는 것처럼 데이터가 변화하는 시뮬레이션
 * 세그먼트 1: 55초, 전체 약 7-8분(450초) 동안 걷는 경로를 시뮬레이션
 * 서울중랑우체국 교차로 신호등 50m 지점에서 최적속도 테스트
 * 수정: 초록불이지만 사용자 보행속도 범위로는 건널 수 없는 케이스 테스트
 */

const pedestrianSimulationData = {
  // 시작 시간 (밀리초 타임스탬프)
  startTime: Date.now(),
  
  // 시뮬레이션 설정
  settings: {
    // 평균 보행 속도 (m/s)
    walkingSpeed: 1.2,
    
    // 사용자 설정 보행 속도 범위
    userSpeedRange: {
      min: 0.8,  // 최소 속도 (m/s)
      max: 1.5   // 최대 속도 (m/s)
    },
    
    // 위치 업데이트 간격 (밀리초)
    updateInterval: 1000,
    
    // 시뮬레이션 속도 배수 (실제 시간보다 몇 배 빠르게 진행할지)
    speedMultiplier: 1.2
  },
  
  // 경로 정보 (출발지부터 도착지까지의 세그먼트)
  route: [
    {
      // 세그먼트 1: 출발점 ~ 첫 번째 신호등
      points: [
        { lat: 37.594531013087924, lng: 127.07904162053583, timestamp: 0 },
        { lat: 37.59455045657362, lng: 127.07911383562528, timestamp: 12 },
        { lat: 37.59461434284174, lng: 127.0793804761806, timestamp: 25 },
        { lat: 37.59474767058826, lng: 127.07993042228148, timestamp: 40 },
        { lat: 37.59475322629914, lng: 127.07997486251902, timestamp: 55 }
      ],
      // 세그먼트 끝에 있는 신호등 정보
      trafficLight: {
        position: { lat: 37.5950098, lng: 127.0803091 },
        name: "동일로지하차도",
        cycleTime: {
          red: 60,    // 빨간불 지속 시간 (초)
          green: 30   // 초록불 지속 시간 (초)
        },
        // 시뮬레이션 시작 시 신호등 초기 상태
        initialState: {
          isRed: false,       // 초록불 상태로 시작 (가정)
          elapsedTime: 10     // 초록불 상태에서 10초 경과 (20초 후 빨간불로 변경)
        }
      }
    },
    {
      // 세그먼트 2: 첫 번째 신호등 ~ 두 번째 신호등 (서울중랑우체국까지)
      points: [
        { lat: 37.59475322629914, lng: 127.07997486251902, timestamp: 55 },
        { lat: 37.59487822148119, lng: 127.08051369875824, timestamp: 90 },
        { lat: 37.5949115514899, lng: 127.08054425058121, timestamp: 120 },
        { lat: 37.59493099417442, lng: 127.08057202527489, timestamp: 150 },
        { lat: 37.59495599297049, lng: 127.080666460404, timestamp: 180 },
        { lat: 37.5951032101953, lng: 127.08133861719767, timestamp: 210 },
        { lat: 37.59528375722892, lng: 127.08203021571533, timestamp: 240 },
        { lat: 37.5954559716481, lng: 127.08270792684657, timestamp: 270 },
        { lat: 37.59560596487646, lng: 127.08329953534378, timestamp: 320 },
        // 서울중랑우체국 신호등 50m 지점 (테스트 포인트)
        { lat: 37.595689292527936, lng: 127.08352173494954, timestamp: 350 }
      ],
      // 세그먼트 끝에 있는 신호등 정보 (서울중랑우체국)
      trafficLight: {
        position: { lat: 37.5958166, lng: 127.0834891 },
        name: "서울중랑우체국",
        cycleTime: {
          red: 109,   // 빨간불 지속 시간 (초)
          green: 41   // 초록불 지속 시간 (초)
        },
        // 시뮬레이션 시작 시 신호등 초기 상태
        // 수정: 350초에 보행자가 50m 지점에 도착했을 때 초록불이 약 32초 지난 시점이 되도록 설정
        initialState: {
          isRed: true,       // 빨간불 상태로 시작
          elapsedTime: 77    // 빨간불 상태에서 77초 경과 (32초 후인 318초 시점에 초록불로 변경)
        }
      }
    },
    {
      // 세그먼트 3: 두 번째 신호등 ~ 도착지
      points: [
        { lat: 37.595689292527936, lng: 127.08352173494954, timestamp: 350 },
        { lat: 37.595772615571505, lng: 127.08348840227951, timestamp: 370 },
        { lat: 37.59585316116024, lng: 127.0834550696886, timestamp: 390 },
        { lat: 37.59595592623726, lng: 127.08341340389062, timestamp: 410 },
        { lat: 37.59603647753584, lng: 127.08369670911954, timestamp: 430 },
        { lat: 37.59611980658985, lng: 127.08399667941774, timestamp: 440 },
        { lat: 37.596319798463604, lng: 127.08483548619215, timestamp: 450 }
      ],
      // 이 세그먼트에는 신호등 없음
      trafficLight: null
    }
  ],
  
  // 실시간 보행 시뮬레이션을 위한 위치 데이터 (약 450초)
  positionData: [
    // 초기 위치 (출발점)
    { timestamp: 0, lat: 37.594531013087924, lng: 127.07904162053583 },
    
    // 세그먼트 1 (0-55초)
    { timestamp: 5, lat: 37.59453708249619, lng: 127.07906265253258 },
    { timestamp: 10, lat: 37.59454315190447, lng: 127.07908368452932 },
    { timestamp: 12, lat: 37.59455045657362, lng: 127.07911383562528 },
    { timestamp: 17, lat: 37.59457500000000, lng: 127.07925000000000 },
    { timestamp: 22, lat: 37.59459500000000, lng: 127.07935000000000 },
    { timestamp: 25, lat: 37.59461434284174, lng: 127.0793804761806 },
    { timestamp: 30, lat: 37.59465000000000, lng: 127.07955000000000 },
    { timestamp: 35, lat: 37.59468000000000, lng: 127.07970000000000 },
    { timestamp: 40, lat: 37.59474767058826, lng: 127.07993042228148 },
    { timestamp: 45, lat: 37.59474900000000, lng: 127.07995000000000 },
    { timestamp: 50, lat: 37.59475100000000, lng: 127.07996500000000 },
    { timestamp: 55, lat: 37.59475322629914, lng: 127.07997486251902 },
    
    // 세그먼트 2 (55-350초)
    { timestamp: 60, lat: 37.59476000000000, lng: 127.08005000000000 },
    { timestamp: 70, lat: 37.59478000000000, lng: 127.08020000000000 },
    { timestamp: 80, lat: 37.59480000000000, lng: 127.08035000000000 },
    { timestamp: 90, lat: 37.59487822148119, lng: 127.08051369875824 },
    { timestamp: 100, lat: 37.59489000000000, lng: 127.08052500000000 },
    { timestamp: 110, lat: 37.59490000000000, lng: 127.08053500000000 },
    { timestamp: 120, lat: 37.5949115514899, lng: 127.08054425058121 },
    { timestamp: 130, lat: 37.59492000000000, lng: 127.08055500000000 },
    { timestamp: 140, lat: 37.59492800000000, lng: 127.08056500000000 },
    { timestamp: 150, lat: 37.59493099417442, lng: 127.08057202527489 },
    { timestamp: 160, lat: 37.59494000000000, lng: 127.08059000000000 },
    { timestamp: 170, lat: 37.59495000000000, lng: 127.08062000000000 },
    { timestamp: 180, lat: 37.59495599297049, lng: 127.080666460404 },
    { timestamp: 190, lat: 37.59497000000000, lng: 127.08080000000000 },
    { timestamp: 200, lat: 37.59500000000000, lng: 127.08105000000000 },
    { timestamp: 210, lat: 37.5951032101953, lng: 127.08133861719767 },
    { timestamp: 220, lat: 37.59520000000000, lng: 127.08165000000000 },
    { timestamp: 230, lat: 37.59524000000000, lng: 127.08185000000000 },
    { timestamp: 240, lat: 37.59528375722892, lng: 127.08203021571533 },
    { timestamp: 250, lat: 37.59535000000000, lng: 127.08235000000000 },
    { timestamp: 260, lat: 37.59540000000000, lng: 127.08245000000000 },
    { timestamp: 270, lat: 37.5954559716481, lng: 127.08270792684657 },
    { timestamp: 280, lat: 37.59548000000000, lng: 127.08285000000000 },
    { timestamp: 290, lat: 37.59550000000000, lng: 127.08295000000000 },
    { timestamp: 300, lat: 37.59552000000000, lng: 127.08305000000000 },
    { timestamp: 310, lat: 37.59555000000000, lng: 127.08315000000000 },
    { timestamp: 320, lat: 37.59560596487646, lng: 127.08329953534378 },
    { timestamp: 330, lat: 37.59563000000000, lng: 127.08338000000000 },
    { timestamp: 340, lat: 37.59566000000000, lng: 127.08345000000000 },
    // 서울중랑우체국 신호등 50m 지점 도착 (초록불 32초 경과 시점)
    { timestamp: 350, lat: 37.595689292527936, lng: 127.08352173494954 },
    
    // 세그먼트 3 (350-450초)
    // 15초 뒤 재계산 시점
    { timestamp: 365, lat: 37.59575000000000, lng: 127.08350000000000 },
    { timestamp: 370, lat: 37.595772615571505, lng: 127.08348840227951 },
    { timestamp: 380, lat: 37.59581000000000, lng: 127.08347000000000 },
    { timestamp: 390, lat: 37.59585316116024, lng: 127.0834550696886 },
    { timestamp: 400, lat: 37.59590000000000, lng: 127.08344000000000 },
    { timestamp: 410, lat: 37.59595592623726, lng: 127.08341340389062 },
    { timestamp: 420, lat: 37.59600000000000, lng: 127.08355000000000 },
    { timestamp: 430, lat: 37.59603647753584, lng: 127.08369670911954 },
    { timestamp: 440, lat: 37.59611980658985, lng: 127.08399667941774 },
    { timestamp: 450, lat: 37.596319798463604, lng: 127.08483548619215 }
  ],
  
  // 신호등 상태 데이터 (시간에 따른 신호등 상태 변화)
  trafficLightStates: [
    // 첫 번째 신호등 (동일로지하차도)
    {
      id: "TL001",
      position: { lat: 37.5950098, lng: 127.0803091 },
      name: "동일로지하차도",
      states: [
        // 시작 시 신호등 상태: 초록불, 10초 경과 (20초 후 빨간불 시작)
        { timestamp: 0, isRed: false, remainingTime: 20 },
        // 20초 후 빨간불로 변경
        { timestamp: 20, isRed: true, remainingTime: 60 },
        // 80초 후 다시 초록불로 변경
        { timestamp: 80, isRed: false, remainingTime: 30 },
        // 110초 후 다시 빨간불로 변경
        { timestamp: 110, isRed: true, remainingTime: 60 },
        // 계속해서 90초 주기로 반복
        { timestamp: 170, isRed: false, remainingTime: 30 },
        { timestamp: 200, isRed: true, remainingTime: 60 },
        { timestamp: 260, isRed: false, remainingTime: 30 },
        { timestamp: 290, isRed: true, remainingTime: 60 },
        { timestamp: 350, isRed: false, remainingTime: 30 },
        { timestamp: 380, isRed: true, remainingTime: 60 },
        { timestamp: 440, isRed: false, remainingTime: 30 }
      ]
    },
    
    // 두 번째 신호등 (서울중랑우체국) - 수정된 주기 적용
    {
      id: "TL002",
      position: { lat: 37.5958166, lng: 127.0834891 },
      name: "서울중랑우체국",
      states: [
        // 시작 시 신호등 상태: 빨간불, 77초 경과 (32초 후인 318초 시점에 초록불로 변경)
        { timestamp: 0, isRed: true, remainingTime: 32 },
        // 32초 후 초록불로 변경 (318초 시점)
        { timestamp: 32, isRed: false, remainingTime: 41 },
        // 73초 후 다시 빨간불로 변경 (359초 시점)
        { timestamp: 73, isRed: true, remainingTime: 109 },
        // 계속해서 150초 주기로 반복 (41초 초록불 + 109초 빨간불)
        { timestamp: 182, isRed: false, remainingTime: 41 },
        { timestamp: 223, isRed: true, remainingTime: 109 },
        // 수정: 318초에 초록불 시작, 350초에 보행자 50m 지점 도착 (초록불 32초 경과)
        { timestamp: 332, isRed: false, remainingTime: 41 },
        { timestamp: 373, isRed: true, remainingTime: 109 }
      ]
    }
  ],
  
  // 신호등 최적 보행 속도 권장 데이터
  speedRecommendations: [
    // 첫 번째 신호등 접근 시
    { 
      timestamp: 30, 
      nextTrafficLight: "TL001",
      distance: 40, 
      recommendedSpeed: 1.3, 
      message: "이 속도로 이동하면 초록불에 도착할 수 있습니다.",
      caseType: "케이스2"
    },
    
    // 첫 번째 신호등 통과 후
    { 
      timestamp: 100, 
      nextTrafficLight: "TL002",
      distance: 350, 
      recommendedSpeed: 1.2, 
      message: "일정한 속도로 이동하세요.",
      caseType: "없음"
    },
    
    // 서울중랑우체국 신호등 100m 지점 접근 시
    { 
      timestamp: 300, 
      nextTrafficLight: "TL002",
      distance: 100, 
      recommendedSpeed: 1.0, 
      message: "조금 느리게 걸으면 신호 변경 시점에 도착할 수 있습니다.",
      caseType: "케이스3"
    },
    
    // 서울중랑우체국 신호등 50m 지점 도착 시 (테스트 포인트)
    { 
      timestamp: 350, 
      nextTrafficLight: "TL002",
      distance: 50, 
      recommendedSpeed: 2.0, // 사용자 속도 범위(최대 1.5 m/s)를 벗어나는 속도
      message: "현재 초록불이지만 사용자 보행속도 범위로는 건널 수 없는 상황입니다. 15초 후 다시 계산합니다.",
      caseType: "초록불_불가능" // 초록불이지만 사용자 보행속도 범위로는 건널 수 없는 케이스
    },
    
    // 15초 후 재계산 시점
    { 
      timestamp: 365, 
      nextTrafficLight: "TL002",
      distance: 42, // 15초 동안 약 8m 이동
      recommendedSpeed: 0.8, // 최소 보행속도로 설정
      message: "지금 바로 최소 보행속도(0.8m/s)로 출발하세요. 신호등에 도착 후 약 51초 기다리면 초록불이 됩니다.",
      caseType: "빨간불_즉시출발", // 빨간불이지만 즉시 출발하는 케이스
      waitTime: 0 // 출발 전 대기 시간 없음
    },
    
    // 두 번째 신호등 통과 후 목적지 접근 시
    { 
      timestamp: 400, 
      nextTrafficLight: null,
      distance: 80, 
      recommendedSpeed: 1.1, 
      message: "도착지까지 평소 속도로 이동하세요.",
      caseType: "없음"
    }
  ],
  
  // 테스트를 위한 추가 데이터 - 서울중랑우체국 신호등 50m 지점에서의 상황
  testCase: {
    // 테스트 시점 (timestamp: 350)
    timestamp: 350,
    
    // 신호등까지 거리
    distanceToTrafficLight: 50,
    
    // 신호등 상태
    trafficLightState: {
      isRed: false,         // 초록불 상태
      elapsedTime: 32,      // 초록불 32초 경과
      remainingTime: 9      // 초록불 남은 시간 9초
    },
    
    // 사용자 설정 보행속도 범위를 벗어나는 최적 속도
    optimalSpeed: 2.0,      // m/s (50m ÷ 9초 = 5.56m/s, 현실적으로 불가능하여 2.0m/s로 설정)
    
    // 보행자가 신호등에 도달하는 데 걸리는 시간 (50m ÷ 1.5m/s = 약 33.3초)
    // 초록불 남은 시간 9초보다 오래 걸려 현재 보행속도 범위로는 불가능
    estimatedArrivalTime: 33.3,
    
    // 케이스 정보
    caseType: "초록불_불가능", // 초록불이지만 사용자 보행속도 범위로는 건널 수 없는 케이스
    
    // 안내 메시지
    message: "현재 초록불이지만 사용자 보행속도 범위로는 건널 수 없는 상황입니다. 15초 후 다시 계산합니다."
  },
  
  // 15초 후 재계산 테스트 케이스
  recalculatedTestCase: {
    // 재계산 시점 (timestamp: 365)
    timestamp: 365,
    
    // 신호등까지 거리 (15초 동안 약 8m 이동)
    distanceToTrafficLight: 42,
    
    // 신호등 상태
    trafficLightState: {
      isRed: true,          // 빨간불 상태
      elapsedTime: 6,       // 빨간불 6초 경과
      remainingTime: 103    // 빨간불 남은 시간 103초
    },
    
    // 즉시 출발 시나리오 (대기시간 최소화)
    immediateStartScenario: {
      // 사용자 최소 보행속도
      walkingSpeed: 0.8,     // m/s (최소 보행 속도)
      
      // 신호등까지 걸리는 시간
      walkingTime: 52.5,     // 초 (42m ÷ 0.8m/s = 52.5초)
      
      // 신호등 도착 시간
      arrivalTime: 417.5,    // 초 (365초 + 52.5초 = 417.5초)
      
      // 다음 초록불 시작 시간
      nextGreenStart: 468,   // 초 (359초에 빨간불 시작 + 109초 = 468초)
      
      // 신호등에서 기다려야 하는 시간
      waitTimeAtSignal: 50.5, // 초 (468초 - 417.5초 = 50.5초)
      
      // 출발 전 대기 시간
      waitTimeBeforeStart: 0, // 초 (즉시 출발)
      
      // 안내 메시지
      message: "지금 바로 최소 보행속도(0.8m/s)로 출발하세요. 신호등에 도착 후 약 51초 기다리면 초록불이 됩니다."
    },
    
    // 케이스 정보
    caseType: "빨간불_즉시출발",  // 빨간불 상태에서 즉시 출발
    
    // 안내 메시지
    message: "지금 바로 최소 보행속도(0.8m/s)로 출발하세요. 신호등에 도착 후 약 51초 기다리면 초록불이 됩니다."
  }
};

export default pedestrianSimulationData;