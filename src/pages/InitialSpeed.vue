<template>
  <div class="phone-frame">
    <div class="content">      
      <div class="main-title">
        <h1 class="title-text">{{ name }} 님을 위한<br><span class="title-highlight">{{ age }}대 {{ genderText }}</span><br>평균 보행속도 추천</h1>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>추천 속도 불러오는 중...</p>
      </div>
      
      <template v-else>
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
          <button class="next-button" @click="saveSettings" :disabled="isSaving">
            {{ isSaving ? '저장 중...' : '다음으로' }}
          </button>
        </div>
      </template>
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
import { mapGetters } from 'vuex';

export default {
  name: 'InitialSpeed',
  data() {
    return {
      name: '',
      age: '',
      gender: '',
      minSelectedSpeed: null,
      maxSelectedSpeed: null,
      showModal: false,
      modalMessage: '',
      loading: true,
      isSaving: false,
      speedOptions: []
    };
  },
  computed: {
    ...mapGetters(['getAccessToken', 'getUser']),
    genderText() {
      return this.gender === 1 ? '남성' : '여성';
    }
  },
  created() {
    // 먼저 사용자 정보를 가져와서 속도가 이미 설정되어 있는지 확인
    this.checkUserSettings();
  },
  methods: {
    async checkUserSettings() {
      try {
        this.loading = true;
        const token = this.getAccessToken;
        
        if (!token) {
          this.showError('로그인이 필요합니다.');
          return;
        }
        
        // 사용자 정보 조회 API 호출
        const response = await axios.get('https://woodzverse.pythonanywhere.com/member/info/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = response.data;
        
        // 사용자 정보 설정
        this.name = userData.nickname || '사용자';
        this.gender = userData.gender;
        this.age = userData.age ? Math.floor(userData.age / 10) * 10 : '20';
        
        // 속도 설정 여부 확인을 제거하고 바로 추천 속도 가져오기
        this.fetchRecommendedSpeeds();
        
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        
        // 오류 응답 코드에 따른 처리
        if (error.response) {
          if (error.response.status === 404) {
            console.log('API 엔드포인트를 찾을 수 없습니다. 기본 추천 속도를 사용합니다.');
          } else if (error.response.status === 401) {
            this.showError('인증이 필요합니다. 다시 로그인해주세요.');
            // 로그인 페이지로 리디렉션 옵션
            // this.$router.push({ name: "SignIn" });
            return;
          }
        }
        
        // 기본값 설정
        this.name = this.getUser?.nickname || '사용자';
        this.gender = this.getUser?.gender || 1;
        this.age = this.getUser?.age ? Math.floor(this.getUser.age / 10) * 10 : '20';
        
        // 오류가 발생해도 추천 속도는 가져오도록 시도
        this.fetchRecommendedSpeeds();
      }
    },
    async fetchRecommendedSpeeds() {
      try {
        this.loading = true;
        //const token = this.getAccessToken;
        const token = this.$store.getters.getAccessToken; // Vuex에서 토큰 가져오기
        console.log('토큰:', token);
        
        if (!token) {
          this.showError('로그인이 필요합니다.');
          return;
        }

        // 추천 속도 API 호출
        const response = await axios.get('https://woodzverse.pythonanywhere.com/member/velocity/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const { recommendations } = response.data;
        
        // 서버에서 받은 추천 속도로 옵션 업데이트
        this.speedOptions = [
          { name: '천천히', value: parseFloat(recommendations.slow.toFixed(2)) },
          { name: '보통', value: parseFloat(recommendations.normal.toFixed(2)) },
          { name: '빠르게', value: parseFloat(recommendations.fast.toFixed(2)) }
        ];
        
        // 기본값 설정 (보통)
        this.minSelectedSpeed = recommendations.slow;
        this.maxSelectedSpeed = recommendations.normal;
        
      } catch (error) {
        console.error('추천 속도를 가져오는 중 오류 발생:', error);
        
        // API가 없거나 오류가 발생한 경우 기본 속도 옵션 설정
        // 성별과 나이에 따라 다른 기본값 설정 - 예시일 뿐 실제 데이터는 다를 수 있음
        let baseSpeed = 1.2;
        
        // 성별에 따른 조정 (남성:1, 여성:2 가정)
        if (this.gender === 2) {
          baseSpeed = 1.1; // 여성은 약간 낮게 설정
        }
        
        // 나이에 따른 조정
        let ageNum = parseInt(this.age);
        if (ageNum >= 50) {
          baseSpeed -= 0.2; // 50대 이상은 낮게
        } else if (ageNum >= 40) {
          baseSpeed -= 0.1; // 40대는 약간 낮게
        } else if (ageNum <= 20) {
          baseSpeed += 0.1; // 20대 이하는 약간 높게
        }
        
        // 기본 속도 옵션 설정
        this.speedOptions = [
          { name: '천천히', value: parseFloat((baseSpeed - 0.2).toFixed(2)) },
          { name: '보통', value: parseFloat(baseSpeed.toFixed(2)) },
          { name: '빠르게', value: parseFloat((baseSpeed + 0.2).toFixed(2)) }
        ];
        
        // 기본값 설정
        this.minSelectedSpeed = this.speedOptions[0].value;
        this.maxSelectedSpeed = this.speedOptions[1].value;
        
        // 에러 모달 대신 콘솔에만 표시 (사용자 경험 향상)
      } finally {
        this.loading = false;
      }
    },
    selectOption(type, speed) {
      if (type === 'min') {
        this.minSelectedSpeed = speed;
      } else if (type === 'max') {
        this.maxSelectedSpeed = speed;
      }
    },
    showError(message) {
      this.modalMessage = message;
      this.showModal = true;
    },
    async saveSettings() {
      // 선택 여부 확인
      if (this.minSelectedSpeed === null || this.maxSelectedSpeed === null) {
        this.showError('최저속도와 최고속도를 모두 선택해주세요.');
        return;
      }
        
      // 최저/최고 속도 비교
      if (this.minSelectedSpeed > this.maxSelectedSpeed) {
        this.showError('최고속도는 최저속도보다 빠르거나 같아야 합니다.');
        return;
      }
      
      try {
        this.isSaving = true;
        const token = this.getAccessToken;
        
        if (!token) {
          this.showError('로그인이 필요합니다.');
          return;
        }
        
        // 한 번의 API 호출로 최저 및 최고 속도 모두 설정
        await axios.put('https://woodzverse.pythonanywhere.com/member/info/edit/', {
          min_speed: this.minSelectedSpeed,
          max_speed: this.maxSelectedSpeed
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // 다음 페이지로 이동
        this.$router.replace({ name: "Home" });
        
      } catch (error) {
        console.error('설정 저장 중 오류 발생:', error);
        this.showError('설정을 저장하는 중 오류가 발생했습니다.');
      } finally {
        this.isSaving = false;
      }
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
  background: #cccccc;
  cursor: not-allowed;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(141, 229, 87, 0.3);
  border-radius: 50%;
  border-top: 4px solid #8de557;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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