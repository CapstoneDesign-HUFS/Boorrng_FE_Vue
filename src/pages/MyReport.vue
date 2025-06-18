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
  import axios from 'axios';

  
  export default {
    name: 'MyReport',
    data() {
      return {
        userData: {
          nickname: '',
          email: '',
          gender: 0,
          age: 0,
          min_speed: 0,
          max_speed: 0
        },

        weeklyChartInstance: null,
        trendChartInstance: null,
        weeklyData: {
          labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
          datasets: [
            {
              label: '이동거리',
              // data: [450, 280, 150, 470, 300, 180, 320],
              data: [0, 573, 0, 0, 0, 264, 700],
              backgroundColor: '#3450db'
            },
            /* {
              label: '이동시간',
              // data: [120, 240, 100, 310, 230, 90, 260],
              data: [120, 240, 100, 310, 230, 90, 260],
              backgroundColor: '#73e0a9'
            } */
          ]
        },
        trendData: {
          labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
          datasets: [
            {
              label: '평균속도',
              data: [0, 1.41, 0, 0, 0, 1.6, 1.4],
              borderColor: '#3450db',
              backgroundColor: 'rgba(100, 149, 237, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 3
            }
          ]
        },

        weeklyDataDefault: {
          labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
          datasets: [
            {
              label: '이동거리',
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: '#3450db'
            },
          ]
        },
        trendDataDefault: {
          labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
          datasets: [
            {
              label: '평균속도',
              data: [0, 0, 0, 0, 0, 0, 0],
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
      async initCharts() {

        const accessToken = this.$store.getters.getAccessToken;
        
        if (!accessToken) {
          this.error = '로그인이 필요합니다.';
          this.loading = false;
          this.$router.push('/login');
          return;
        }
        
        // API 엔드포인트 주소 확인
        const apiUrl = 'https://woodzverse.pythonanywhere.com/member/info/';
        console.log('API 요청 URL:', apiUrl);
        
        await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then(response => {
          this.userData = response.data;
          console.log('사용자 정보:', this.userData);
          this.$store.commit('setUserData', this.userData);
          this.loading = false;
        })
        .catch(error => {
          console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
          this.error = '사용자 정보를 가져오는 중 오류가 발생했습니다.';
          this.loading = false;
          
          // 토큰이 만료되었거나 유효하지 않은 경우 로그인 페이지로 리디렉션
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            this.$store.dispatch('logout');
            this.$router.push('/login');
          }
        });

        console.log('userData:', this.userData.email);

        if (this.userData.email === 'mjkim0323@gmail.com') {
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
        } else {
          const weeklyCtx = this.$refs.weeklyChart.getContext('2d')
          this.weeklyChartInstance = new Chart(weeklyCtx, {
            type: 'bar',
            data: this.weeklyDataDefault,
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
            data: this.trendDataDefault,
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