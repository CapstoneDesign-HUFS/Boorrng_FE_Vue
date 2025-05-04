<template>
<div class="arrival-modal" v-if="modal_show == true">
  <div class="modal">
    <div class="title">목적지에 도착했습니다</div>
    <div class="divider"></div>

    <div class="info-row">
      <div class="label">소요시간</div>
      <div class="value">25분</div>
    </div>

    <div class="info-row">
      <div class="label">이동거리</div>
      <div class="value">1.2km</div>
    </div>

    <div class="info-row">
      <div class="label">평균속도</div>
      <div class="value">1.4m/s</div>
    </div>

    <div class="close" onclick="">×</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ArrivalModal',
  data() {
    return {
      showModal: false,
      modalMessage: '',
    };
  },
  props: {
    modal_show: Boolean,
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

.arrival-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 30px;
    background: rgba(0, 0, 0, 0.5);
}

.modal {
    width: 100%;
    height: 250px;
    max-width: 400px;
    background: linear-gradient(to left, #E8F9DB 0%, #F5FFED 100%);
    border-radius: 16px;
    padding: 20px 30px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    position: relative;
}

.title {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    white-space: nowrap;
}

.divider {
    border-top: 1px solid #C8F0AF;
    margin: 12px 0;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
    color: #444;
    padding: 0 16px;
}

.label {
    font-size: 16px;
    color: #666;
}

.value {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-left: auto;
}

.close {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    color: #999;
    cursor: pointer;
}

@media (max-width: 480px) {
    .card {
    width: 95%;
    padding: 16px;
    }

    .title {
    font-size: 18px;
    margin-bottom: 16px;
    }

    .info-row {
    margin: 14px 0;
    }
}
</style>