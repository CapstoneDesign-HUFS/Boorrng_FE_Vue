<template>
<div class="modal-overlay" @click.self="closeModal">
    <div class="modal-card">

    <div class="modal-header">
        <h2>{{ intersectionName }} 교차로</h2>
        <button class="close-button" @click="closeModal">×</button>
    </div>
    
    <div class="traffic-grid">
        <!-- 나침반 이미지 -->
        <div class="compass">
            <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#f5f5f5" stroke="#ddd" stroke-width="1" />
                <path d="M50,5 L50,20 M50,80 L50,95 M5,50 L20,50 M80,50 L95,50" stroke="#666" stroke-width="2" />
                <path d="M50,5 L55,20 L50,15 L45,20 Z" fill="#FF5A6E" />
                <text x="50" y="25" text-anchor="middle" font-size="10" fill="#666">N</text>
                <text x="75" y="52" text-anchor="middle" font-size="10" fill="#666">E</text>
                <text x="50" y="80" text-anchor="middle" font-size="10" fill="#666">S</text>
                <text x="25" y="52" text-anchor="middle" font-size="10" fill="#666">W</text>
            </svg>
        </div>
        
        <div 
        v-for="(light, index) in trafficLights" 
        :key="index" 
        class="traffic-light"
        :class="{ 'position-top': index === 0, 
                    'position-top-right': index === 1,
                    'position-right': index === 2,
                    'position-bottom-right': index === 3,
                    'position-bottom': index === 4,
                    'position-bottom-left': index === 5,
                    'position-left': index === 6,
                    'position-top-left': index === 7,
                    'inactive': !light.active }"
        >
        <div class="progress-ring" :class="{'inactive-ring': !light.active}">
            <svg width="60" height="60" viewBox="0 0 60 60">
            <!-- Background circle -->
            <circle
                cx="30"
                cy="30"
                r="24"
                fill="transparent"
                :stroke="light.active ? '#F0F0F0' : '#E0E0E0'"
                stroke-width="6"
            />
            <!-- Progress circle -->
            <circle
                cx="30"
                cy="30"
                r="24"
                fill="transparent"
                :stroke="getStrokeColor(light)"
                stroke-width="6"
                stroke-dasharray="150.72"
                :stroke-dashoffset="calculateDashOffset(light.timeRemaining, light.totalTime)"
                transform="rotate(-90 30 30)"
            />
            </svg>
            <div class="time-remaining" :class="getTimeClass(light)">
            {{ light.active ? light.timeRemaining : '-' }}
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SignalModal',
    props: {
        // 초기 교차로 이름 (API에서 받아오기 전에 표시용)
        initialIntersectionName: {
            type: String,
            default: '로딩 중...'
        },
        // 교차로 위치 정보 (필요한 경우)
        location: {
            type: Object,
            default: () => ({ lat: 0, lon: 0 })
        },
        intersectionId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            isActive: true, // 컴포넌트 활성 상태
            // 실제 데이터는 API에서 가져옴
            intersectionName: this.initialIntersectionName,
            timestamp: '',
            trafficLights: [
            { direction: '북', isRed: false, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '북동', isRed: true, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '동', isRed: true, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '남동', isRed: true, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '남', isRed: true, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '남서', isRed: true, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '서', isRed: true, timeRemaining: 0, totalTime: 60, active: false },
            { direction: '북서', isRed: true, timeRemaining: 0, totalTime: 60, active: false }
            ],
            timers: [], // 각 방향별 타이머 저장
            scheduledFetchTimeout: null, // 예약된 데이터 갱신 타이머
            isTimerRunning: true,
            // 방향 매핑 (API 응답의 방향을 UI의 방향으로 변환)
            directionMap: {
            // 기존 매핑
            '북쪽': 0, '북': 0, 'N': 0, 'North': 0,
            '북동쪽': 1, '북동': 1, 'NE': 1, 'Northeast': 1,
            '동쪽': 2, '동': 2, 'E': 2, 'East': 2,
            '남동쪽': 3, '남동': 3, 'SE': 3, 'Southeast': 3,
            '남쪽': 4, '남': 4, 'S': 4, 'South': 4,
            '남서쪽': 5, '남서': 5, 'SW': 5, 'Southwest': 5,
            '서쪽': 6, '서': 6, 'W': 6, 'West': 6,
            '북서쪽': 7, '북서': 7, 'NW': 7, 'Northwest': 7,
            
            // 새로운 코드 매핑 추가
            'nt': 0, // 북쪽 직진
            'et': 2, // 동쪽 직진
            'st': 4, // 남쪽 직진
            'wt': 6, // 서쪽 직진
            'ne': 1, // 북동쪽
            'nw': 7, // 북서쪽
            'se': 3, // 남동쪽
            'sw': 5  // 남서쪽
            }
        };
    },
    created() {
        console.log("SignalModal 생성됨");
        this.isActive = true;
        this.isTimerRunning = true;
        this.fetchTrafficLightData();
    },
    methods: {
        closeModal() {
            console.log("모달 닫기 요청");
            this.isActive = false; // 비활성 상태로 설정
            this.cleanupAllResources();
            this.$emit('closeModal');
        },
    
        // 모든 리소스 정리
        cleanupAllResources() {
            console.log("모든 리소스 정리");
            
            // 타이머 정리
            this.stopAllCountdowns();
            
            // 예약된 데이터 갱신 타이머 정리
            if (this.scheduledFetchTimeout) {
            clearTimeout(this.scheduledFetchTimeout);
            this.scheduledFetchTimeout = null;
            }
        },
        
        // 원의 대시 오프셋 계산
        calculateDashOffset(remaining, total) {
            const circumference = 150.72;
            const percentageComplete = 1 - (remaining / total);
            return circumference * percentageComplete;
        },
    
        // 신호등 상태에 따른 원 색상 결정
        getStrokeColor(light) {
            if (!light.active) return '#CCCCCC'; // 비활성 상태는 회색
            return light.isRed ? '#FF5A6E' : '#8DE557'; // 활성 상태는 빨간색 또는 초록색
        },
    
        // 시간 표시 클래스 결정
        getTimeClass(light) {
            if (!light.active) return 'gray-text'; // 비활성 상태는 회색 텍스트
            return light.isRed ? 'red-text' : 'green-text'; // 활성 상태는 빨간색 또는 초록색 텍스트
        },
    
        // 서버에서 신호등 데이터 가져오기
        async fetchTrafficLightData() {
            // 비활성 상태면 실행 중지
            if (!this.isActive) {
                console.log("비활성 상태 - 데이터 가져오기 중단");
                return;
            }

            try {
                // 요청 시작 시간 기록
                const requestStartTime = Date.now();
                
                this.stopAllCountdowns();
                
                const url = `https://woodzverse.pythonanywhere.com/map/traffic-lights/signal-status/?itsId=${this.intersectionId}`;
                const response = await axios.get(url);
                
                // 응답 수신 후 경과 시간 계산 (밀리초)
                const elapsedTime = Math.round((Date.now() - requestStartTime) / 1000);
                console.log(`데이터 요청 및 처리 지연: ${elapsedTime}초`);
                
                let signalData = response.data;
                
                if (response.data && response.data["traffic-light"]) {
                    signalData = response.data["traffic-light"];
                }
                
                this.intersectionName = signalData.intersectionName || this.initialIntersectionName;
                this.timestamp = signalData.timestamp || new Date().toISOString();
                
                if (signalData.signals && Array.isArray(signalData.signals)) {
                    // 지연 시간을 보정하여 신호등 데이터 업데이트
                    this.updateTrafficLightsFromAPI(signalData.signals, elapsedTime);
                    this.startActiveCountdowns();
                }
                
                this.scheduleNextDataFetch();
            } catch (error) {
                console.error("신호등 데이터 요청 오류:", error);
                
                if (!this.isActive) return;
                
                this.scheduledFetchTimeout = setTimeout(() => {
                    if (this.isActive) this.fetchTrafficLightData();
                }, 5000);
            }
        },
    
        // API 응답 데이터로 신호등 상태 업데이트
        updateTrafficLightsFromAPI(signals, elapsedTime) {
            console.log("신호등 데이터 업데이트:", signals);
            console.log(`신호 데이터 지연 시간 보정: ${elapsedTime}초`);
            
            this.trafficLights.forEach(light => {
                light.active = false;
            });
            
            signals.forEach(signal => {
                let index = this.getDirectionIndex(signal.direction);
                
                if (index !== -1) {
                    if (signal.signalColor === null || signal.remainingSeconds === null) {
                        this.trafficLights[index] = {
                            direction: this.trafficLights[index].direction,
                            isRed: false,
                            timeRemaining: 0,
                            totalTime: 60,
                            active: false
                        };
                    } else {
                        // 잔여시간에서 지연 시간 차감하여 보정
                        const correctedTime = Math.max(0, Math.round(signal.remainingSeconds) - elapsedTime);
                        
                        this.trafficLights[index] = {
                            direction: this.trafficLights[index].direction,
                            isRed: signal.signalColor === 'red',
                            timeRemaining: correctedTime, // 보정된 시간 사용
                            totalTime: Math.round(signal.remainingSeconds) + 60, // 총 시간도 동일하게 유지
                            active: true
                        };
                    }
                }
            });
        },
    
        // 방향 문자열을 인덱스로 변환
        getDirectionIndex(direction) {
            // 정확히 일치하는 방향이 있으면 사용
            if (this.directionMap[direction] !== undefined) {
            return this.directionMap[direction];
            }
            
            // 부분 일치 검색 ('북쪽' -> '북' 등)
            const directionKey = Object.keys(this.directionMap).find(key => 
            direction.includes(key) || key.includes(direction)
            );
            
            return directionKey ? this.directionMap[directionKey] : -1;
        },
    
        // 활성화된 신호등만 카운트다운 시작
        startActiveCountdowns() {
            // 먼저 타이머 실행 플래그 활성화
            this.isTimerRunning = true;
            this.trafficLights.forEach((light, index) => {
            if (light.active) {
                this.startCountdown(index);
            }
            });
        },
    
        // 특정 방향의 카운트다운 시작
        startCountdown(index) {
            // 비활성 신호등은 카운트다운 하지 않음
            if (!this.trafficLights[index].active) return;
            
            // 기존 타이머가 있으면 정리
            if (this.timers[index]) {
            clearInterval(this.timers[index]);
            this.timers[index] = null;
            }
            console.log(`${this.trafficLights[index].direction} 방향 카운트다운 시작: ${this.trafficLights[index].timeRemaining}초`);
            this.timers[index] = setInterval(() => {
                // 컴포넌트가 비활성화되었거나 타이머가 중지되었으면 실행 중지
                if (!this.isActive || !this.isTimerRunning) {
                clearInterval(this.timers[index]);
                this.timers[index] = null;
                return;
                }
                
                // 시간이 남아있으면 감소
                if (this.trafficLights[index].timeRemaining > 0) {
                this.trafficLights[index].timeRemaining--;
                // console.log(`${this.trafficLights[index].direction} 방향 남은 시간: ${this.trafficLights[index].timeRemaining}초`);
                } 
                // 시간이 0이 되면 타이머 정지 및 데이터 갱신
                else {
                console.log(`${this.trafficLights[index].direction} 방향 시간 종료, 타이머 정지`);
                clearInterval(this.timers[index]);
                this.timers[index] = null;
                
                // 데이터 갱신 트리거
                this.fetchTrafficLightData();
                }
            }, 1000);
        },
    
        // 다음 데이터 갱신 일정 잡기
        scheduleNextDataFetch() {
            // 비활성 상태면 실행 중지
            if (!this.isActive) return;
            
            // 기존 타임아웃 정리
            if (this.scheduledFetchTimeout) {
            clearTimeout(this.scheduledFetchTimeout);
            }
            
            // 활성화된 신호등 중 가장 빨리 끝나는 시간 찾기
            let minRemainingTime = Infinity;
            this.trafficLights.forEach(light => {
            if (light.active && light.timeRemaining < minRemainingTime) {
                minRemainingTime = light.timeRemaining;
            }
            });
            
            // 최소 시간이 없으면(모든 신호등이 비활성) 기본값 사용
            if (minRemainingTime === Infinity) {
            minRemainingTime = 10; // 10초 기본값
            }
            
            // 최소 1초, 최대 60초 후에 갱신
            const fetchDelay = Math.max(1, Math.min(minRemainingTime, 60)) * 1000;
            
            console.log(`${fetchDelay/1000}초 후에 신호등 데이터 갱신 예정`);
            
            // 예정된 시간에 데이터 갱신
            this.scheduledFetchTimeout = setTimeout(() => {
            if (this.isActive) this.fetchTrafficLightData();
            }, fetchDelay);
        },
    
        // 모든 타이머 정지
        stopAllCountdowns() {
            this.isTimerRunning = false;
            this.timers.forEach(timer => {
            if (timer) clearInterval(timer);
            });
            this.timers = [];
        }
        },
        beforeUnmount() {
            console.log("SignalModal 제거됨 (beforeUnmount)");
            this.isActive = false;
            this.isTimerRunning = false;
            this.cleanupAllResources();
        }
};
</script>

<style scoped>
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;

display: flex;
justify-content: center;
align-items: flex-end;
z-index: 1000;
}

.modal-card {
width: 400px;
background-color: white;
border-top-left-radius: 16px;
border-top-right-radius: 16px;
overflow: hidden;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
padding: 16px;
padding-left: 20px;
background-color: #8DE557;
display: flex;
justify-content: space-between;
align-items: center;
}

.modal-header h2 {
color: white;
margin: 0;
font-size: 22px;
font-weight: bold;
}

.close-button {
width: 36px;
height: 36px;
background-color: rgba(255, 255, 255, 0.3);
border: none;
border-radius: 50%;
color: white;
font-size: 20px;
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
}

.traffic-grid {
    padding: 20px;
    height: 280px;
    position: relative;
    width: 280px;
    margin: 0 auto;
}

.traffic-light {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 60px;
    height: 60px;
}

.position-top { top: 20px; left: 110px; }
.position-top-right { top: 50px; right: 50px; }
.position-right { top: 110px; right: 20px; }
.position-bottom-right { bottom: 50px; right: 50px; }
.position-bottom { bottom: 20px; left: 110px; }
.position-bottom-left { bottom: 50px; left: 50px; }
.position-left { top: 110px; left: 20px; }
.position-top-left { top: 50px; left: 50px; }

.progress-ring {
position: relative;
width: 60px;
height: 60px;
}

.time-remaining {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
display: flex;
justify-content: center;
align-items: center;
font-size: 22px;
font-weight: bold;
}

.red-text {
color: #FF5A6E;
}

.green-text {
color: #8DE557;
}

.gray-text {
color: #999999;
}

.inactive {
opacity: 0.7;
}

.inactive-ring {
filter: grayscale(80%);
}

.compass {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.compass img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>