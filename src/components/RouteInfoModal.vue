<template>
<div class="route-info-modal">
    <div class="modal">
    <div class="content">
        <div class="info">
        <div class="info-row">
            <span class="label">예상소요시간</span>
            <span class="value">{{formattedTime}}</span>
        </div>
        <div class="info-row">
            <span class="label">예상이동거리</span>
            <span class="value">{{formattedDistance}}</span>
        </div>
        </div>
        <div class="icon-box" @click="startGuidance">
        <div class="circle">
            <img src="../assets\images\running.png" alt="속도안내 버튼">
        </div>
        <span class="icon-label">속도안내</span>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'RouteInfoModal',
  data() {
    return {
      modalMessage: '',
    };
  },
  props: {
    distance: {
      type: Number, // 또는 적절한 타입
      required: true
    },
    time: {
      type: Number, // 또는 적절한 타입
      required: true
    }
  },
  computed: {
    formattedTime() {
      if (this.time > 60) {
        // 60초 이상이면 분 단위로 변환
        return `약 ${(this.time / 60).toFixed(1)}분`;
      } else {
        // 60초 미만이면 초 단위로 표시
        return `약 1분`;
      }
    },
    formattedDistance() {
      if (this.distance < 1000) {
        // 1000 미만이면 미터(m) 단위로 표시
        return `${Math.round(this.distance)}m`;
      } else {
        // 1000 이상이면 킬로미터(km) 단위로 표시하고 소수점 한 자리까지 표현
        return `${(this.distance / 1000).toFixed(1)}km`;
      }
    }
  },
  methods: {
    startGuidance() {
      console.log('Guidance started');
      this.$emit('startGuidance');
    },
    
    format(){

        if (this.adjusted_time > 60){
          this.adjusted_time = (this.adjusted_time / 60).toFixed(1); // 분 단위로 변환
          console.log("예측 시간(분):", this.adjusted_time);
        } else {
          this.adjusted_time = this.adjusted_time.toFixed(1); // 초 단위로 표시
          console.log("예측 시간(초):", this.adjusted_time);
        }

        if (this.total_distance > 1000) {
          this.total_distance = (this.total_distance / 1000).toFixed(1); // km 단위로 변환
          console.log("총 거리(km):", this.total_distance);
        } else {
          this.total_distance = this.total_distance.toFixed(1); // 미터 단위로 표시
          console.log("총 거리(m):", this.total_distance);
        }
    }
  },
};
</script>

<style scoped>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    }

    /* .route-info-modal {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100vh;
      padding-bottom: 50px;

      z-index: 1000;
      position: fixed;
    } */
    .route-info-modal {
      position: fixed;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      padding-bottom: 50px;
      z-index: 1000;
    }

    .modal {
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      padding: 20px 24px;
      width: 100%;
      /* max-width: 350px; */
      width: 350px; /* 고정 너비 설정 */
      margin: 0 10px;
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 0px;
      width: 70%;
      padding-left: 4px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 6px 0;
    }

    .label {
      color: #777;
      font-size: 16px;
      white-space: nowrap;
      font-weight: 400;
      margin-right: 40px;
    }

    .value {
      font-weight: 600;
      font-size: 16px;
      color: #333;
      text-align: right;
      margin-left: auto;
    }

    .icon-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .circle {
      background: linear-gradient(135deg, #d6ff8d 0%, #a3e956 100%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 8px rgba(160, 230, 92, 0.3);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .circle:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(160, 230, 92, 0.5);
    }

    .circle:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px rgba(160, 230, 92, 0.4);
    }

    .icon-label {
      margin-top: 6px;
      font-size: 12px;
      color: #333;
      text-align: center;
    }

    img {
      width: 50%;
    }

    @media (max-width: 360px) {
      .modal {
        width: 100%;
        padding: 16px 20px;
      }

      .label, .value {
        font-size: 15px;
      }

      .circle {
        width: 45px;
        height: 45px;
      }

      .icon {
        width: 20px;
        height: 20px;
      }
    }
</style>