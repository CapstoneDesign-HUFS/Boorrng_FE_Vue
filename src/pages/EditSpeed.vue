<template>
  <div class="phone-frame">
    <div class="content">      
      <div class="main-title">
        <h1 class="title-text">{{ name }} 님을 위한<br><span class="title-highlight">{{ age }}대 {{ genderText }}</span><br>평균 보행속도 추천</h1>
      </div>
      
      <div v-if="loading" class="loading">
        추천 속도를 불러오는 중...
      </div>
      
      <div v-else>
        <div class="speed-section">
          <h2 class="section-title">최저속도를 설정해주세요</h2>
          <div class="speed-options">
            <div 
              v-for="option in speedOptions" 
              :key="`min-${option.value}`"
              class="speed-option" 
              :class="{ selected: minSelectedSpeed === option.value }" 
              @click="selectOption('min', option.value)"
            >
              <div class="speed-name">{{ option.name }}</div>
              <div class="speed-value">{{ option.value }}m/s</div>
            </div>
          </div>
        </div>
        
        <div class="speed-section">
          <h2 class="section-title">최고속도를 설정해주세요</h2>
          <div class="speed-options">
            <div 
              v-for="option in speedOptions" 
              :key="`max-${option.value}`"
              class="speed-option" 
              :class="{ selected: maxSelectedSpeed === option.value }" 
              @click="selectOption('max', option.value)"
            >
              <div class="speed-name">{{ option.name }}</div>
              <div class="speed-value">{{ option.value }}m/s</div>
            </div>
          </div>
        </div>
        
        <div class="button-container">
          <button class="cancel-button" @click="cancel">취소</button>
          <button class="next-button" @click="saveSettings" :disabled="saving">
            {{ saving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>
    
    <svg class="wave-decoration" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.75,0,116.21,29.87,181.06,54.47,229.93,74.39,280.09,70.22,321.39,56.44Z" fill="#c6f264"></path>
    </svg>

    <!-- 모달 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <button class="btn save" @click="showModal = false">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditSpeed',
  data() {
    return {
      name: '',
      age: '',
      gender: 0,
      minSelectedSpeed: null,
      maxSelectedSpeed: null,
      showModal: false,
      modalMessage: '',
      loading: true,
      saving: false,
      speedOptions: [
        { name: '느리게', value: 0.9 },
        { name: '보통', value: 1.3 },
        { name: '빠르게', value: 1.7 }
      ],
      userData: {
        min_speed: null,
        max_speed: null
      }
    };
  },
  computed: {
    genderText() {
      return this.gender === 1 ? '남성' : 
             this.gender === 2 ? '여성' : '기타';
    }
  },
  created() {
    this.fetchUserInfo();
    this.fetchRecommendations();
  },
  methods: {
    fetchUserInfo() {
      const accessToken = this.$store.getters.getAccessToken;
      
      if (!accessToken) {
        this.modalMessage = '로그인이 필요합니다.';
        this.showModal = true;
        this.$router.push('/login');
        return;
      }
      
      axios.get('https://woodzverse.pythonanywhere.com/member/info/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(response => {
        const userData = response.data;
        this.name = userData.nickname;
        this.gender = userData.gender;
        this.age = Math.floor(userData.age / 10) * 10; // 10대, 20대 등으로 표시
        
        // 사용자의 현재 속도 설정
        this.userData.min_speed = userData.min_speed;
        this.userData.max_speed = userData.max_speed;
        
        // 현재 설정된 속도로 선택
        if (userData.min_speed) {
          this.minSelectedSpeed = userData.min_speed;
        }
        
        if (userData.max_speed) {
          this.maxSelectedSpeed = userData.max_speed;
        }
      })
      .catch(error => {
        console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
        this.modalMessage = '사용자 정보를 가져오는 중 오류가 발생했습니다.';
        this.showModal = true;
        
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.$store.dispatch('logout');
          this.$router.push('/login');
        }
      });
    },
    
    fetchRecommendations() {
      const accessToken = this.$store.getters.getAccessToken;
      console.log('Access Token:', accessToken);
      
      if (!accessToken) {
        return;
      }
      
      axios.get('https://woodzverse.pythonanywhere.com/member/velocity/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(response => {
        const recommendations = response.data.recommendations;
        
        // 추천 속도로 속도 옵션 업데이트
        this.speedOptions = [
          { name: '느리게', value: recommendations.slow },
          { name: '보통', value: recommendations.normal },
          { name: '빠르게', value: recommendations.fast }
        ];
        
        this.loading = false;
        
        // 이미 설정된 속도가 없는 경우 기본값 설정
        if (this.minSelectedSpeed === null) {
          this.minSelectedSpeed = recommendations.slow;
        }
        
        if (this.maxSelectedSpeed === null) {
          this.maxSelectedSpeed = recommendations.fast;
        }
      })
      .catch(error => {
        console.error('추천 속도를 가져오는 중 오류가 발생했습니다:', error);
        // 추천을 가져오지 못해도 기본값으로 진행
        this.loading = false;
      });
    },
      
    selectOption(type, speed) {
      if (type === 'min') {
        this.minSelectedSpeed = speed;
      } else if (type === 'max') {
        this.maxSelectedSpeed = speed;
      }
    },
      
    saveSettings() {
      // 선택 여부 확인
      if (this.minSelectedSpeed === null || this.maxSelectedSpeed === null) {
        this.modalMessage = '최저속도와 최고속도를 모두 선택해주세요.';
        this.showModal = true;
        return;
      }
        
      // 최저/최고 속도 비교
      if (this.minSelectedSpeed > this.maxSelectedSpeed) {
        this.modalMessage = '최고속도는 최저속도보다 빠르거나 같아야 합니다.';
        this.showModal = true;
        return;
      }
      
      this.saving = true;
      
      // 설정 저장 API 호출
      const accessToken = this.$store.getters.getAccessToken;
      
      // 최저 속도 저장
      axios.put('https://woodzverse.pythonanywhere.com/member/info/edit/', {
        min_speed: this.minSelectedSpeed
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        // 최고 속도 저장
        return axios.put('https://woodzverse.pythonanywhere.com/member/info/edit/', {
          max_speed: this.maxSelectedSpeed
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
      })
      .then(response => {
        this.saving = false;
        this.modalMessage = '속도 설정이 저장되었습니다.';
        this.showModal = true;
        
        // 스토어 업데이트
        this.$store.commit('setUserData', {
          nickname: response.data.nickname,
          birthdate: response.data.birthdate,
          gender: response.data.gender,
          min_speed: this.minSelectedSpeed,
          max_speed: this.maxSelectedSpeed
        });
        console.log('속도 설정이 저장되었습니다:', this.$store.state.userData.min_speed, this.$store.state.userData.max_speed);
        
        // 마이페이지로 이동
        setTimeout(() => {
          this.$router.push('/my-page');
        }, 1500);
      })
      .catch(error => {
        this.saving = false;
        console.error('속도 설정을 저장하는 중 오류가 발생했습니다:', error);
        this.modalMessage = '속도 설정을 저장하는 중 오류가 발생했습니다.';
        this.showModal = true;
      });
    },
      
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5ffed;
}

.phone-frame {
  width: 100%;
  height: 100vh;
  background: linear-gradient(165deg, #f5ffed 0%, #e8f9db 100%);
  overflow: hidden;
  position: relative;
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top, 50px) 24px 40px;
  overflow-y: auto;
  position: relative;
  z-index: 2;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #555;
}

.main-title {
  margin-top: 80px;
  margin-bottom: 50px;
}

.title-text {
  font-size: 36px;
  font-weight: 800;
  color: #333;
  line-height: 1.3;
}

.title-highlight {
  color: #75cc55;
  background: linear-gradient(90deg, #75cc55, #00d3a9);
  background-clip: text;
  font-weight: 800;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.speed-section {
  margin-bottom: 36px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin-bottom: 16px;
}

.speed-options {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.speed-option {
  flex: 1;
  height: 90px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(200, 240, 175, 0.6);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.speed-option.selected {
  background: rgba(141, 229, 87, 0.15);
  border: 2px solid #8de557;
  box-shadow: 0 4px 12px rgba(141, 229, 87, 0.2);
}

.speed-option:active {
  transform: translateY(2px);
}

.speed-name {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
}

.speed-value {
  font-size: 14px;
  color: #777;
}

.button-container {
  display: flex;
  gap: 12px;
  margin-top: 40px;
  position: relative;
  z-index: 3;
}

.cancel-button{
  flex: 1;
  height: 60px;
  border-radius: 16px;
  background: white;
  color: rgb(85, 85, 85);
  font-weight: 600;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(141, 229, 87, 0.3);
}

.cancel-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 8px rgba(141, 229, 87, 0.3);
}

.next-button {
  flex: 1;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(90deg, #c6f264, #8de557);
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(141, 229, 87, 0.3);
}

.next-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 8px rgba(141, 229, 87, 0.3);
}

.next-button:disabled {
  background: #aaa;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.wave-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  z-index: 1;
  opacity: 0.15;
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 20px 30px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

.modal-content p {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn.save {
  padding: 10px 20px;
  background: #8de557;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

@media screen and (max-width: 390px) {
  .speed-name {
    font-size: 14px;
  }
  
  .speed-value {
    font-size: 12px;
  }

  .title-text {
    font-size: 32px;
  }
}

@supports (padding-top: env(safe-area-inset-top)) {
  .content {
    padding-top: calc(env(safe-area-inset-top) + 30px);
    padding-left: calc(env(safe-area-inset-left) + 24px);
    padding-right: calc(env(safe-area-inset-right) + 24px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 40px);
  }
}
</style>