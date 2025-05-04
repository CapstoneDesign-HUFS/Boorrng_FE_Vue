<template>
    <div class="container">
      <h2 class="page-title">내 걸음 리포트</h2>
      
      <div class="section-title">주간 이동현황</div>
      <div class="chart-box">
        <canvas ref="weeklyChart"></canvas>
      </div>
      
      <div class="section-title">평균 보행속도 추이</div>
      <div class="chart-box">
        <canvas ref="trendChart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto'
  
  export default {
    name: 'MyReport',
    data() {
      return {
        weeklyChartInstance: null,
        trendChartInstance: null,
        weeklyData: {
          labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              label: '이동거리',
              data: [450, 280, 150, 470, 300, 180, 320],
              backgroundColor: '#3450db'
            },
            {
              label: '이동시간',
              data: [120, 240, 100, 310, 230, 90, 260],
              backgroundColor: '#73e0a9'
            }
          ]
        },
        trendData: {
          labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              label: '평균속도',
              data: [1.15, 1.22, 1.34, 1.45, 1.25, 1.37, 1.42],
              borderColor: '#3450db',
              backgroundColor: 'rgba(100, 149, 237, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 3
            }
          ]
        }
      }
    },
    created() {
      //console.log("MyReport created called")
      this.$store.commit('setNavMenu', 0);
    },
    mounted() {
      this.initCharts()
    },
    methods: {
      initCharts() {
        // 주간 이동거리/시간 바차트
        const weeklyCtx = this.$refs.weeklyChart.getContext('2d')
        this.weeklyChartInstance = new Chart(weeklyCtx, {
          type: 'bar',
          data: this.weeklyData,
          options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
              y: { beginAtZero: true }
            }
          }
        })
  
        // 월별 평균속도 선차트
        const trendCtx = this.$refs.trendChart.getContext('2d')
        this.trendChartInstance = new Chart(trendCtx, {
          type: 'line',
          data: this.trendData,
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                min: 0,
                suggestedMax: 1.6,
                ticks: {
                  stepSize: 0.2
                }
              }
            }
          }
        })
      }
    },
    beforeUnmount() {
      // 차트 인스턴스 정리
      if (this.weeklyChartInstance) {
        this.weeklyChartInstance.destroy()
      }
      if (this.trendChartInstance) {
        this.trendChartInstance.destroy()
      }
    }
  }
  </script>
  
  <style>
  .container {
    padding: 2rem 2rem 6rem;
  }
  
  .page-title {
    margin-top: 50px;
    text-align: center;
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 1s ease-out 0.2s both;
    margin-bottom: 50px;
  }
  
  .section-title {
    font-weight: 600;
    font-size: 1rem;
    margin: 1.6rem 0 0.8rem;
    color: #333;
  }
  
  .chart-box {
    background: white;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  }
  
  canvas {
    width: 100% !important;
    height: auto !important;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>