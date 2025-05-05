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
                    'position-top-left': index === 7 }"
        >
        <div class="progress-ring">
            <svg width="60" height="60" viewBox="0 0 60 60">
            <!-- Background circle -->
            <circle
                cx="30"
                cy="30"
                r="24"
                fill="transparent"
                stroke="#F0F0F0"
                stroke-width="6"
            />
            <!-- Progress circle -->
            <circle
                cx="30"
                cy="30"
                r="24"
                fill="transparent"
                :stroke="light.isRed ? '#FF5A6E' : '#8DE557'"
                stroke-width="6"
                stroke-dasharray="150.72"
                :stroke-dashoffset="calculateDashOffset(light.timeRemaining, light.totalTime)"
                transform="rotate(-90 30 30)"
            />
            </svg>
            <div class="time-remaining" :class="{ 'red-text': light.isRed, 'green-text': !light.isRed }">
            {{ light.timeRemaining }}
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {
name: 'SignalModal',
props: {
    intersectionName: {
    type: String,
    default: 'OOO'
    }
},
data() {
    return {
    trafficLights: [
        { direction: '북', isRed: false, timeRemaining: 21, totalTime: 60 },
        { direction: '북동', isRed: true, timeRemaining: 9, totalTime: 60 },
        { direction: '동', isRed: true, timeRemaining: 8, totalTime: 60 },
        { direction: '남동', isRed: true, timeRemaining: 8, totalTime: 60 },
        { direction: '남', isRed: true, timeRemaining: 8, totalTime: 60 },
        { direction: '남서', isRed: true, timeRemaining: 8, totalTime: 60 },
        { direction: '서', isRed: true, timeRemaining: 8, totalTime: 60 },
        { direction: '북서', isRed: true, timeRemaining: 8, totalTime: 60 }
    ]
    };
},
methods: {
    closeModal() {
        this.$emit('closeModal');
    },
    calculateDashOffset(remaining, total) {
    // SVG circle circumference is 2πr = 2 * 3.14159 * 24 ≈ 150.72
    const circumference = 150.72;
    const percentageComplete = 1 - (remaining / total);
    return circumference * percentageComplete;
    },
    updateTrafficLight(index, isRed, timeRemaining, totalTime) {
    if (index >= 0 && index < this.trafficLights.length) {
        this.trafficLights[index].isRed = isRed;
        this.trafficLights[index].timeRemaining = timeRemaining;
        this.trafficLights[index].totalTime = totalTime;
    }
    },
    // 모든 신호등 상태를 한번에 업데이트
    updateAllLights(lightsData) {
    if (Array.isArray(lightsData) && lightsData.length === 8) {
        this.trafficLights = lightsData;
    }
    }
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