// pedestrianSimulationData.js
// 보행자 이동 시뮬레이션을 위한 데이터 (7분/420초 이동)

/**
 * 보행자 이동 시뮬레이션 데이터
 * 실제 사용자가 이동하는 것처럼 데이터가 변화하는 시뮬레이션
 * 약 7분(420초) 동안 걷는 경로를 시뮬레이션
 */

const pedestrianSimulationData = {
  // 시작 시간 (밀리초 타임스탬프)
  startTime: Date.now(),
  
  // 시뮬레이션 설정
  settings: {
    // 평균 보행 속도 (m/s)
    walkingSpeed: 1.2,
    
    // 위치 업데이트 간격 (밀리초)
    updateInterval: 1000,
    
    // 시뮬레이션 속도 배수 (실제 시간보다 몇 배 빠르게 진행할지)
    speedMultiplier: 1.0
  },
  
  // 경로 정보 (출발지부터 도착지까지의 세그먼트)
  route: [
    {
      // 세그먼트 1: 출발점 ~ 첫 번째 신호등
      points: [
        { lat: 37.594531013087924, lng: 127.07904162053583, timestamp: 0 },
        { lat: 37.59455045657362, lng: 127.07911383562528, timestamp: 15 },
        { lat: 37.59461434284174, lng: 127.0793804761806, timestamp: 30 },
        { lat: 37.59474767058826, lng: 127.07993042228148, timestamp: 45 },
        { lat: 37.59475322629914, lng: 127.07997486251902, timestamp: 60 }
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
          isRed: true,        // 빨간불 상태로 시작
          elapsedTime: 45     // 빨간불 상태에서 45초 경과 (15초 후 초록불로 변경)
        }
      }
    },
    {
      // 세그먼트 2: 첫 번째 신호등 ~ 두 번째 신호등
      points: [
        { lat: 37.59475322629914, lng: 127.07997486251902, timestamp: 60 },
        { lat: 37.59487822148119, lng: 127.08051369875824, timestamp: 90 },
        { lat: 37.5949115514899, lng: 127.08054425058121, timestamp: 105 },
        { lat: 37.59493099417442, lng: 127.08057202527489, timestamp: 120 },
        { lat: 37.59495599297049, lng: 127.080666460404, timestamp: 135 },
        { lat: 37.5951032101953, lng: 127.08133861719767, timestamp: 150 },
        { lat: 37.59528375722892, lng: 127.08203021571533, timestamp: 180 },
        { lat: 37.5954559716481, lng: 127.08270792684657, timestamp: 210 },
        { lat: 37.59560596487646, lng: 127.08329953534378, timestamp: 240 },
        { lat: 37.595689292527936, lng: 127.08352173494954, timestamp: 270 }
      ],
      // 세그먼트 끝에 있는 신호등 정보
      trafficLight: {
        position: { lat: 37.5958166, lng: 127.0834891 },
        name: "서울중랑우체국",
        cycleTime: {
          red: 60,
          green: 30
        },
        // 시뮬레이션 시작 시 신호등 초기 상태
        initialState: {
          isRed: false,       // 초록불 상태로 시작
          elapsedTime: 20     // 초록불 상태에서 20초 경과 (10초 후 빨간불로 변경)
        }
      }
    },
    {
      // 세그먼트 3: 두 번째 신호등 ~ 도착지
      points: [
        { lat: 37.595689292527936, lng: 127.08352173494954, timestamp: 270 },
        { lat: 37.595772615571505, lng: 127.08348840227951, timestamp: 285 },
        { lat: 37.59585316116024, lng: 127.0834550696886, timestamp: 300 },
        { lat: 37.59595592623726, lng: 127.08341340389062, timestamp: 315 },
        { lat: 37.59603647753584, lng: 127.08369670911954, timestamp: 330 },
        { lat: 37.59611980658985, lng: 127.08399667941774, timestamp: 345 },
        { lat: 37.596319798463604, lng: 127.08483548619215, timestamp: 420 }
      ],
      // 이 세그먼트에는 신호등 없음
      trafficLight: null
    }
  ],
  
  // 실시간 보행 시뮬레이션을 위한 위치 데이터 (약 7분/420초)
  positionData: [
    // 초기 위치 (출발점)
    { timestamp: 0, lat: 37.594531013087924, lng: 127.07904162053583 },
    
    // 1분 이내 (0-60초)
    { timestamp: 5, lat: 37.59453708249619, lng: 127.07906265253258 },
    { timestamp: 10, lat: 37.59454315190447, lng: 127.07908368452932 },
    { timestamp: 15, lat: 37.59454922131274, lng: 127.07910471652607 },
    { timestamp: 20, lat: 37.59455529072101, lng: 127.07912574852281 },
    { timestamp: 25, lat: 37.59456136012928, lng: 127.07914678051956 },
    { timestamp: 30, lat: 37.59457047129868, lng: 127.07918082184799 },
    { timestamp: 35, lat: 37.59457958246807, lng: 127.07921486317642 },
    { timestamp: 40, lat: 37.59458869363747, lng: 127.07924890450485 },
    { timestamp: 45, lat: 37.59459780480687, lng: 127.07928294583327 },
    { timestamp: 50, lat: 37.59460691597626, lng: 127.0793169871617 },
    { timestamp: 55, lat: 37.59462121266988, lng: 127.07936874873264 },
    { timestamp: 60, lat: 37.5946355093635, lng: 127.07942051030357 },
    
    // 1-2분 (60-120초)
    { timestamp: 65, lat: 37.59464980605713, lng: 127.07947227187451 },
    { timestamp: 70, lat: 37.59466410275075, lng: 127.07952403344544 },
    { timestamp: 75, lat: 37.59467839944437, lng: 127.07957579501638 },
    { timestamp: 80, lat: 37.59469269613799, lng: 127.07962755658731 },
    { timestamp: 85, lat: 37.59470699283162, lng: 127.07967931815825 },
    { timestamp: 90, lat: 37.59472128952524, lng: 127.07973107972918 },
    { timestamp: 95, lat: 37.59473558621886, lng: 127.07978284130012 },
    { timestamp: 100, lat: 37.59474988291248, lng: 127.07983460287105 },
    { timestamp: 105, lat: 37.59476417960611, lng: 127.07988636444199 },
    { timestamp: 110, lat: 37.59477847629973, lng: 127.07993812601292 },
    { timestamp: 115, lat: 37.59479277299335, lng: 127.07998988758386 },
    { timestamp: 120, lat: 37.59480706968697, lng: 127.08004164915479 },
    
    // 2-3분 (120-180초)
    { timestamp: 125, lat: 37.59482136638059, lng: 127.08009341072573 },
    { timestamp: 130, lat: 37.59483566307422, lng: 127.08014517229666 },
    { timestamp: 135, lat: 37.59484995976784, lng: 127.0801969338676 },
    { timestamp: 140, lat: 37.59486425646146, lng: 127.08024869543853 },
    { timestamp: 145, lat: 37.59487855315508, lng: 127.08030045700947 },
    { timestamp: 150, lat: 37.59489284984871, lng: 127.0803522185804 },
    { timestamp: 155, lat: 37.59490714654233, lng: 127.08040398015134 },
    { timestamp: 160, lat: 37.59492144323595, lng: 127.08045574172227 },
    { timestamp: 165, lat: 37.59493573992958, lng: 127.08050750329321 },
    { timestamp: 170, lat: 37.5949500366232, lng: 127.08055926486414 },
    { timestamp: 175, lat: 37.59496433331682, lng: 127.08061102643508 },
    { timestamp: 180, lat: 37.59497863001044, lng: 127.08066278800601 },
    
    // 3-4분 (180-240초)
    { timestamp: 185, lat: 37.59499292670407, lng: 127.08071454957695 },
    { timestamp: 190, lat: 37.59500722339769, lng: 127.08076631114788 },
    { timestamp: 195, lat: 37.59502152009131, lng: 127.08081807271882 },
    { timestamp: 200, lat: 37.59503581678493, lng: 127.08086983428975 },
    { timestamp: 205, lat: 37.59505632017218, lng: 127.08097335743162 },
    { timestamp: 210, lat: 37.59507682355943, lng: 127.08107688057349 },
    { timestamp: 215, lat: 37.59509732694668, lng: 127.08118040371535 },
    { timestamp: 220, lat: 37.59511783033393, lng: 127.08128392685722 },
    { timestamp: 225, lat: 37.59513833372118, lng: 127.08138744999909 },
    { timestamp: 230, lat: 37.59515883710843, lng: 127.08149097314095 },
    { timestamp: 235, lat: 37.59517934049568, lng: 127.08159449628282 },
    { timestamp: 240, lat: 37.59519984388293, lng: 127.08169801942469 },
    
    // 4-5분 (240-300초)
    { timestamp: 245, lat: 37.59522034727018, lng: 127.08180154256655 },
    { timestamp: 250, lat: 37.59524085065743, lng: 127.08190506570842 },
    { timestamp: 255, lat: 37.59526135404468, lng: 127.08200858885029 },
    { timestamp: 260, lat: 37.59528185743193, lng: 127.08211211199215 },
    { timestamp: 265, lat: 37.59530236081918, lng: 127.08221563513402 },
    { timestamp: 270, lat: 37.59532286420643, lng: 127.08231915827589 },
    { timestamp: 275, lat: 37.59534336759368, lng: 127.08242268141775 },
    { timestamp: 280, lat: 37.59536387098093, lng: 127.08252620455962 },
    { timestamp: 285, lat: 37.59538437436818, lng: 127.08262972770149 },
    { timestamp: 290, lat: 37.59540487775543, lng: 127.08273325084335 },
    { timestamp: 295, lat: 37.59542538114268, lng: 127.08283677398522 },
    { timestamp: 300, lat: 37.59544588452993, lng: 127.08294029712709 },
    
    // 5-6분 (300-360초)
    { timestamp: 305, lat: 37.59546638791718, lng: 127.08304382026895 },
    { timestamp: 310, lat: 37.59548689130443, lng: 127.08314734341082 },
    { timestamp: 315, lat: 37.59550739469168, lng: 127.08325086655269 },
    { timestamp: 320, lat: 37.59552789807893, lng: 127.08335438969455 },
    { timestamp: 325, lat: 37.59554840146618, lng: 127.08345791283642 },
    { timestamp: 330, lat: 37.59556890485343, lng: 127.08356143597829 },
    { timestamp: 335, lat: 37.59558940824068, lng: 127.08366495912015 },
    { timestamp: 340, lat: 37.59560991162793, lng: 127.08376848226202 },
    { timestamp: 345, lat: 37.59563041501518, lng: 127.08387200540389 },
    { timestamp: 350, lat: 37.59565091840243, lng: 127.08397552854575 },
    { timestamp: 355, lat: 37.59566535394081, lng: 127.08357818139982 },
    { timestamp: 360, lat: 37.59567211171006, lng: 127.08359950782196 },
    
    // 6-7분 (360-420초)
    { timestamp: 365, lat: 37.59567886947932, lng: 127.0836208342441 },
    { timestamp: 370, lat: 37.59568562724857, lng: 127.08364216066624 },
    { timestamp: 375, lat: 37.59569238501782, lng: 127.08366348708838 },
    { timestamp: 380, lat: 37.59569914278707, lng: 127.08368481351052 },
    { timestamp: 385, lat: 37.59570590055633, lng: 127.08370613993266 },
    { timestamp: 390, lat: 37.59571265832558, lng: 127.0837274663548 },
    { timestamp: 395, lat: 37.59571941609483, lng: 127.08374879277694 },
    { timestamp: 400, lat: 37.59572617386409, lng: 127.08377011919908 },
    { timestamp: 405, lat: 37.59573293163334, lng: 127.08373214704432 },
    { timestamp: 410, lat: 37.59573968940259, lng: 127.08369417488957 },
    { timestamp: 415, lat: 37.59574644717185, lng: 127.08365620273481 },
    { timestamp: 420, lat: 37.5957532049411, lng: 127.08361823058005 }
  ],
  
  // 신호등 상태 데이터 (시간에 따른 신호등 상태 변화)
  trafficLightStates: [
    // 첫 번째 신호등 (동일로지하차도)
    {
      id: "TL001",
      position: { lat: 37.5950098, lng: 127.0803091 },
      name: "동일로지하차도",
      states: [
        // 시작 시 신호등 상태: 빨간불, 45초 경과 (15초 후 초록불 시작)
        { timestamp: 0, isRed: true, remainingTime: 15 },
        // 15초 후 초록불로 변경
        { timestamp: 15, isRed: false, remainingTime: 30 },
        // 45초 후 다시 빨간불로 변경
        { timestamp: 45, isRed: true, remainingTime: 60 },
        // 105초 후 다시 초록불로 변경
        { timestamp: 105, isRed: false, remainingTime: 30 },
        // 135초 후 다시 빨간불로 변경
        { timestamp: 135, isRed: true, remainingTime: 60 },
        // 계속해서 90초 주기로 반복...
        { timestamp: 195, isRed: false, remainingTime: 30 },
        { timestamp: 225, isRed: true, remainingTime: 60 },
        { timestamp: 285, isRed: false, remainingTime: 30 },
        { timestamp: 315, isRed: true, remainingTime: 60 },
        { timestamp: 375, isRed: false, remainingTime: 30 },
        { timestamp: 405, isRed: true, remainingTime: 60 }
      ]
    },
    
    // 두 번째 신호등 (서울중랑우체국)
    {
      id: "TL002",
      position: { lat: 37.5958166, lng: 127.0834891 },
      name: "서울중랑우체국",
      states: [
        // 시작 시 신호등 상태: 초록불, 20초 경과 (10초 후 빨간불 시작)
        { timestamp: 0, isRed: false, remainingTime: 10 },
        // 10초 후 빨간불로 변경
        { timestamp: 10, isRed: true, remainingTime: 60 },
        // 70초 후 다시 초록불로 변경
        { timestamp: 70, isRed: false, remainingTime: 30 },
        // 100초 후 다시 빨간불로 변경
        { timestamp: 100, isRed: true, remainingTime: 60 },
        // 계속해서 90초 주기로 반복...
        { timestamp: 160, isRed: false, remainingTime: 30 },
        { timestamp: 190, isRed: true, remainingTime: 60 },
        { timestamp: 250, isRed: false, remainingTime: 30 },
        { timestamp: 280, isRed: true, remainingTime: 60 },
        { timestamp: 340, isRed: false, remainingTime: 30 },
        { timestamp: 370, isRed: true, remainingTime: 60 }
      ]
    }
  ],
  
  // 신호등 최적 보행 속도 권장 데이터 (시간에 따른 권장 보행 속도 변화)
  speedRecommendations: [
    // 첫 번째 신호등 접근 시 (빨간불에서 초록불로 변경될 때까지 대기 권장)
    { 
      timestamp: 25, 
      nextTrafficLight: "TL001",
      distance: 42, 
      recommendedSpeed: 0.8, 
      message: "잠시 후 신호가 바뀝니다. 천천히 접근하세요.",
      caseType: "케이스3"
    },
    
    // 첫 번째 신호등 통과 후 두 번째 신호등 접근 시 (초록불에 맞추기 위한 속도 권장)
    { 
      timestamp: 150, 
      nextTrafficLight: "TL002",
      distance: 250, 
      recommendedSpeed: 1.45, 
      message: "이 속도로 이동하면 다음 초록불에 도착할 수 있습니다.",
      caseType: "케이스2"
    },
    
    // 두 번째 신호등 접근 직전 (초록불에 맞추기 위한 속도 조정)
    { 
      timestamp: 225, 
      nextTrafficLight: "TL002",
      distance: 100, 
      recommendedSpeed: 1.8, 
      message: "조금 더 빠르게 걸으면 초록불에 맞출 수 있습니다.",
      caseType: "케이스1"
    },
    
    // 두 번째 신호등 통과 후 목적지 접근 시
    { 
      timestamp: 315, 
      nextTrafficLight: null,
      distance: 60, 
      recommendedSpeed: 1.2, 
      message: "도착지까지 평소 속도로 이동하세요.",
      caseType: "없음"
    }
  ]
};

export default pedestrianSimulationData;