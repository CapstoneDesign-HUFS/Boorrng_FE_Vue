<template>
  <div class="signin-container">
      <div class="content">
          <div class="brand-area">
              <div class="logo-container">
              <div class="logo-bg"></div>
              <img class="logo" src="../assets/images/logo.png" alt="Alien Character">
              </div>
              <h1 class="brand-title">로그인</h1>
              <!-- <h2 class="brand-subtitle">RUN OR NOT</h2> -->
          </div>

          <div class="form-area">
              <input type="email" class="input-field" placeholder="이메일" v-model="formData.email">
              
              <div class="password-field">
              <input :type="passwordType" class="input-field" placeholder="비밀번호" v-model="formData.password" @keyup.enter="loginUser">
              <div class="eye-icon" @click="togglePasswordVisibility">
                  <svg v-if="passwordType === 'password'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"></line>
                  </svg>
                  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                  </svg>
              </div>
              </div>
              
              <p v-if="error" class="error-message">{{ error }}</p>
          </div>

          <button class="btn" @click="loginUser" :disabled="isLoggingIn">
              {{ isLoggingIn ? '로그인 중...' : '로그인' }}
          </button>
          <p class="signup-text">아직 회원이 아니신가요? <a class="signup-link" @click="signup">회원가입</a></p>

          <svg class="wave-decoration" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.75,0,116.21,29.87,181.06,54.47,229.93,74.39,280.09,70.22,321.39,56.44Z" fill="#c6f264"></path>
          </svg>
      </div>
      
      <AlertModal :show="showAlert" :message="alertMessage" :type="alertType" @close="showAlert = false"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';
import AlertModal from "@/components/AlertModal.vue";

export default {
  name: 'SignIn',
  components: {
      AlertModal
  },
  data() {
      return {
          formData: {
              email: '',
              password: ''
          },
          passwordType: 'password',
          isLoggingIn: false,
          error: '',
          showAlert: false,
          alertMessage: '',
          alertType: 'info'
      };
  },
  computed: {
      ...mapGetters(['isAuthenticated', 'getUser'])
  },
  methods: {
      ...mapActions(['login']),
      togglePasswordVisibility() {
          // 비밀번호 타입을 'password'와 'text' 사이에서 토글
          this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
      },
      showAlertMessage(message, type = 'info') {
          this.alertMessage = message;
          this.alertType = type;
          this.showAlert = true;
      },
      redirectAfterLogin(user) {
          // 사용자의 보행 속도 설정 여부 확인
          // 아래 코드는 API 응답 구조에 따라 수정 필요
          const isWalkingSpeedSet = user.walking_speed || user.hasSetWalkingSpeed;
          
          // 첫 사용자(보행 속도 미설정)인 경우 InitialSpeed 페이지로 이동
          // 아닌 경우 메인 페이지 또는 홈 페이지로 이동
          setTimeout(() => {
              if (!isWalkingSpeedSet) {
                  this.$router.replace({name: 'InitialSpeed'});
              } else {
                  this.$router.replace({name: 'Home'});  // 또는 다른 메인 페이지
              }
          }, 1000);
      },
      async loginUser() {
          if (!this.validateForm()) {
              return;
          }
          
          this.isLoggingIn = true;
          this.error = '';
          
          try {
              // API 요청 데이터
              const requestData = {
                  email: this.formData.email,
                  password: this.formData.password
              };
              
              console.log('로그인 시도:', requestData);
              
              // 로그인 API 호출
              const loginResponse = await axios.post('http://woodzverse.pythonanywhere.com/member/login/', requestData);
              
              console.log('로그인 성공:', loginResponse.data);
              
              // Vuex 액션을 통해 인증 정보 저장
              this.login({
                  access: loginResponse.data.access,
                  refresh: loginResponse.data.refresh,
                  user: loginResponse.data.user
              });
              
              this.showAlertMessage('로그인이 완료되었습니다!', 'success');
              
              // 액세스 토큰 가져오기
              const accessToken = loginResponse.data.access;
              
              // 사용자 상세 정보 API 호출하여 보행 속도 설정 여부 확인
              try {
                  const userInfoResponse = await axios.get('https://woodzverse.pythonanywhere.com/member/info/', {
                      headers: {
                          'Authorization': `Bearer ${accessToken}`
                      }
                  });
                  
                  console.log('사용자 정보 로드 성공:', userInfoResponse.data);
                  
                  const userDetailData = userInfoResponse.data;
                  
                  // 보행 속도 설정 여부 확인 후 리다이렉션
                  if (userDetailData.min_speed !== null && userDetailData.min_speed !== undefined &&
                      userDetailData.max_speed !== null && userDetailData.max_speed !== undefined) {
                      // 보행 속도가 설정되어 있으면 홈 페이지로 이동
                      setTimeout(() => {
                          this.$router.replace({name: 'Home'});
                      }, 1000);
                  } else {
                      // 보행 속도가 설정되어 있지 않으면 InitialSpeed 페이지로 이동
                      setTimeout(() => {
                          this.$router.replace({name: 'InitialSpeed'});
                      }, 1000);
                  }
              } catch (userInfoError) {
                  console.error('사용자 정보 로드 오류:', userInfoError);
                  // 사용자 정보를 가져오는 데 실패한 경우에도 InitialSpeed 페이지로 이동
                  // (속도 설정이 되어 있는지 확실하지 않으므로 안전하게 속도 설정 페이지로 이동)
                  setTimeout(() => {
                      this.$router.replace({name: 'InitialSpeed'});
                  }, 1000);
              }
          } catch (error) {
              console.error('로그인 오류:', error);
              
              if (error.response) {
                  // HTTP 오류 응답이 있는 경우
                  if (error.response.status === 401) {
                      this.error = '이메일 또는 비밀번호가 올바르지 않습니다.';
                      this.showAlertMessage('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
                  } else if (error.response.data && error.response.data.detail) {
                      this.error = error.response.data.detail;
                      this.showAlertMessage(error.response.data.detail, 'error');
                  } else {
                      this.error = '로그인 중 오류가 발생했습니다.';
                      this.showAlertMessage('로그인 중 오류가 발생했습니다.', 'error');
                  }
              } else {
                  this.error = '서버와 통신 중 오류가 발생했습니다.';
                  this.showAlertMessage('서버와 통신 중 오류가 발생했습니다.', 'error');
              }
          } finally {
              this.isLoggingIn = false;
          }
      },
      validateForm() {
          this.error = '';
          
          // 이메일 검증
          if (!this.formData.email) {
              this.error = '이메일을 입력해주세요.';
              return false;
          }
          
          // 이메일 형식 검증
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(this.formData.email)) {
              this.error = '올바른 이메일 형식이 아닙니다.';
              return false;
          }
          
          // 비밀번호 검증
          if (!this.formData.password) {
              this.error = '비밀번호를 입력해주세요.';
              return false;
          }
          
          return true;
      },
      signup() {
          // 회원가입 페이지로 이동
          this.$router.replace({ name: 'SignUp' });
      },
  },
  created() {
      // 이미 로그인된 사용자는 보행 속도 설정 여부에 따라 리다이렉션
    if (this.isAuthenticated && this.getUser) {
        // 액세스 토큰 가져오기
        const accessToken = this.getAccessToken;
        
        // 사용자 상세 정보 API 호출
        axios.get('https://woodzverse.pythonanywhere.com/member/info/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            const userDetailData = response.data;
            
            // 보행 속도 설정 여부 확인
            if (userDetailData.min_speed !== null && userDetailData.min_speed !== undefined &&
                userDetailData.max_speed !== null && userDetailData.max_speed !== undefined) {
                this.$router.replace({name: 'Home'});
            } else {
                this.$router.replace({name: 'InitialSpeed'});
            }
        })
        .catch(error => {
            console.error('사용자 정보 로드 오류:', error);
            // 오류 발생 시 InitialSpeed 페이지로 이동 (안전한 선택)
            this.$router.replace({name: 'InitialSpeed'});
        });
    }
  }
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .signin-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(165deg, #f5ffed 0%, #e8f9db 100%);
      overflow-x: hidden;
  }
  
  .content {
    height: 100%;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    padding: 40px 24px;
  }
  
  .brand-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .logo-container {
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .logo-bg {
    position: absolute;
    width: 140px;
    height: 140px;
    background: linear-gradient(135deg, #9be15d 0%, #00e3ae 100%);
    border-radius: 50%;
    opacity: 0.25;
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.2; }
    50% { transform: scale(1.05); opacity: 0.3; }
    100% { transform: scale(0.95); opacity: 0.2; }
  }
  
  .logo {
    width: 90px;
    height: 90px;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
  
  .brand-title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 1s ease-out 0.2s both;
    margin-bottom: 6px;
  }
  
  .brand-subtitle {
    font-size: 18px;
    font-weight: 500;
    color: #666;
    letter-spacing: 0.5px;
    animation: fadeIn 1s ease-out 0.4s both;
  }
  
  .form-area {
    margin-bottom: 20px;
    width: 100%;
  }
  
  .input-field {
    width: 100%;
    height: 56px;
    margin-bottom: 16px;
    border-radius: 16px;
    border: 2px solid rgba(200, 240, 175, 0.6);
    background: rgba(255, 255, 255, 0.8);
    padding: 0 20px;
    font-size: 16px;
    color: #333;
    transition: all 0.2s ease;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #75cc55;
    box-shadow: 0 2px 8px rgba(117, 204, 85, 0.2);
  }
  
  .input-field::placeholder {
    color: #aaa;
  }
  
  .password-field {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .password-field .input-field {
    margin-bottom: 0;
    padding-right: 50px; /* 눈 아이콘을 위한 공간 확보 */
  }
  
  .eye-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    cursor: pointer;
    z-index: 5;
    transition: color 0.2s ease;
  }
  
  .eye-icon:hover {
    color: #75cc55;
  }
  
  .error-message {
    color: #e53935;
    font-size: 14px;
    margin-top: 12px;
    text-align: center;
  }
  
  .btn {
    width: 100%;
    padding: 16px 20px;
    border-radius: 16px;
    font-weight: 600;
    text-align: center;
    font-size: 18px;
    transition: all 0.2s ease;
    border: none;
    outline: none;
    cursor: pointer;
    margin-bottom: 16px;
    background: linear-gradient(90deg, #c6f264, #8de557);
    color: white;
    box-shadow: 0 4px 12px rgba(141, 229, 87, 0.3);
  }
  
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(141, 229, 87, 0.4);
  }
  
  .btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(141, 229, 87, 0.3);
  }
  
  .btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .signup-text {
    text-align: center;
    font-size: 14px;
    color: #777;
  }
  
  .signup-link {
    color: #75cc55;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .signup-link:hover {
    color: #00d3a9;
    text-decoration: underline;
  }
  
  .wave-decoration {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: -1;
    opacity: 0.15;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  /* 반응형 디자인을 위한 미디어 쿼리 */
  @media (max-width: 480px) {
    .content {
      padding: 30px 20px;
    }
    
    .logo-container {
      width: 120px;
      height: 120px;
    }
    
    .logo-bg {
      width: 120px;
      height: 120px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
    }
    
    .brand-title {
      font-size: 28px;
    }
    
    .brand-subtitle {
      font-size: 16px;
    }
  }
</style>