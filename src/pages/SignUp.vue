<template>
  <div class="signup-container">
    <div class="content">
      <div class="header">
        <div class="logo-container">
          <div class="logo-bg"></div>
          <img class="logo" src="../assets/images/logo.png" alt="Alien Character">
        </div>
      </div>
      
      <h1 class="form-title">회원가입</h1>
      
      <div class="form-group">
        <input type="email" class="input-field" placeholder="이메일" v-model="formData.email">
        <p v-if="emailError" class="error-text">{{ emailError }}</p>
      </div>
      
      <div class="form-group">
        <input :type="password1Type" class="input-field" placeholder="비밀번호" v-model="formData.password1">
        <div class="eye-icon" @click="togglePasswordVisibility('password1')">
          <svg v-if="password1Type === 'password'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      
      <div class="form-group">
        <input :type="password2Type" class="input-field" placeholder="비밀번호 확인" v-model="formData.password2">
        <div class="eye-icon" @click="togglePasswordVisibility('password2')">
          <svg v-if="password2Type === 'password'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"></line>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
      </div>
      
      <div class="form-group">
        <input type="text" class="input-field" placeholder="이름" v-model="formData.nickname">
      </div>
      
      <div class="form-group">
        <div class="input-row">
          <input type="date" class="input-field" v-model="formData.birthdate">
          
          <select class="input-field" v-model="formData.gender">
            <option value="" disabled selected>성별</option>
            <option value="1">남성</option>
            <option value="2">여성</option>
          </select>
        </div>
      </div>
      
      <div class="terms-container">
        <div class="custom-checkbox" :class="{ checked: termsAgreed }" @click="toggleTermsAgreement"></div>
        <span class="terms-text">약관에 동의합니다.<a @click="showTerms=true" class="terms-link">약관 보기</a></span>
      </div>
      
      <button class="submit-button" @click="submitForm" :disabled="isSubmitting">
        {{ isSubmitting ? '처리 중...' : '회원가입' }}
      </button>
      
      <p class="login-text">이미 가입하셨나요? <a @click="navigateToLogin" class="login-link">로그인하기</a></p>
      
      <svg class="wave-decoration" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.75,0,116.21,29.87,181.06,54.47,229.93,74.39,280.09,70.22,321.39,56.44Z" fill="#c6f264"></path>
      </svg>
    </div>
  </div>

  <Terms @close="showTerms=false" v-if="showTerms" />
  <AlertModal :show="showAlert" :message="alertMessage" :type="alertType" @close="showAlert = false"/>
</template>

<script>
import Terms from "../components/Terms.vue"
import AlertModal from "@/components/AlertModal.vue";
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  name: 'SignUp',
  data() {
    return {
      formData: {
        email: '',
        password1: '',
        password2: '',
        nickname: '',
        birthdate: '',
        gender: '',
      },
      termsAgreed: false,
      password1Type: 'password',
      password2Type: 'password',
      showTerms: false,
      isSubmitting: false,
      emailError: '',
      passwordError: '',
      showAlert: false,
      alertMessage: '',
      alertType: 'info',
    }
  },
  components: {
    Terms,
    AlertModal,
  },
  methods: {
    ...mapActions(['login']),
    navigateToLogin() {
      this.$router.replace({ name: 'SignIn' });
    },
    togglePasswordVisibility(field) {
      if (field === 'password1') {
        this.password1Type = this.password1Type === 'password' ? 'text' : 'password';
      } else if (field === 'password2') {
        this.password2Type = this.password2Type === 'password' ? 'text' : 'password';
      }
    },
    toggleTermsAgreement() {
      this.termsAgreed = !this.termsAgreed;
    },
    showAlertMessage(message, type = 'info') {
      this.alertMessage = message;
      this.alertType = type;
      this.showAlert = true;
    },
    validateForm() {
      let isValid = true;
      this.emailError = '';
      this.passwordError = '';
      
      // 이메일 검증
      if (!this.formData.email) {
        this.emailError = '이메일을 입력해주세요.';
        isValid = false;
      } else {
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.formData.email)) {
          this.emailError = '올바른 이메일 형식이 아닙니다.';
          isValid = false;
        }
      }
      
      // 비밀번호 검증
      if (!this.formData.password1) {
        this.passwordError = '비밀번호를 입력해주세요.';
        isValid = false;
      } else if (this.formData.password1.length < 8) {
        this.passwordError = '비밀번호는 최소 8자 이상이어야 합니다.';
        isValid = false;
      }
      
      if (this.formData.password1 !== this.formData.password2) {
        this.passwordError = '비밀번호가 일치하지 않습니다.';
        isValid = false;
      }
      
      if (!this.formData.nickname) {
        this.showAlertMessage('이름을 입력해주세요.', 'warning');
        isValid = false;
      }
      
      if (!this.formData.birthdate) {
        this.showAlertMessage('생년월일을 선택해주세요.', 'warning');
        isValid = false;
      }
      
      if (!this.formData.gender) {
        this.showAlertMessage('성별을 선택해주세요.', 'warning');
        isValid = false;
      }
      
      if (!this.termsAgreed) {
        this.showAlertMessage('약관에 동의해주세요.', 'warning');
        isValid = false;
      }
      
      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        // API 요청 데이터 구성
        const requestData = {
          email: this.formData.email,
          password1: this.formData.password1,
          password2: this.formData.password2,
          nickname: this.formData.nickname,
          birthdate: this.formData.birthdate,
          gender: this.formData.gender,
          agreed_terms: this.termsAgreed ? "true" : "false"
        };
        
        console.log('API 요청 데이터:', requestData);
        
        // 서버에 회원가입 요청 보내기
        const response = await axios.post('https://woodzverse.pythonanywhere.com/member/signup/', requestData);
        
        console.log('회원가입 성공:', response.data);
        
        // Vuex를 통해 인증 정보 저장
        if (response.data) {
          this.login({
            access: response.data.access,
            refresh: response.data.refresh,
            user: response.data.user
          });
        }
        
        this.showAlertMessage('회원가입이 완료되었습니다!', 'success');
        
        // 잠시 후 로그인 페이지로 이동
        setTimeout(() => {
          this.$router.push({ name: 'SignIn' });
        }, 1500);
      } catch (error) {
        this.isSubmitting = false;
        
        console.error('회원가입 오류:', error);
        
        if (error.response && error.response.data) {
          // 서버에서 반환한 오류 메시지 처리
          const errorData = error.response.data;
          
          if (errorData.email) {
            this.emailError = errorData.email[0];
            this.showAlertMessage(`이메일 오류: ${errorData.email[0]}`, 'error');
          } else if (errorData.password1) {
            this.passwordError = errorData.password1[0];
            this.showAlertMessage(`비밀번호 오류: ${errorData.password1[0]}`, 'error');
          } else if (errorData.non_field_errors) {
            this.showAlertMessage(`오류: ${errorData.non_field_errors[0]}`, 'error');
          } else {
            this.showAlertMessage('회원가입 중 오류가 발생했습니다.', 'error');
          }
        } else {
          this.showAlertMessage('서버와 통신 중 오류가 발생했습니다.', 'error');
        }
      } finally {
        this.isSubmitting = false;
      }
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
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: linear-gradient(165deg, #f5ffed 0%, #e8f9db 100%);
  overflow-x: hidden;
}
.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 25px; 
  overflow-y: auto;
  z-index: 1;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.logo-container {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-bg {
  position: absolute;
  width: 110px;
  height: 110px;
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
  width: 70px;
  height: 70px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
  background: linear-gradient(90deg, #75cc55, #00d3a9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
  position: relative;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-field {
  width: 100%;
  height: 56px;
  border-radius: 14px;
  border: 2px solid rgba(200, 240, 175, 0.6);
  background: rgba(255, 255, 255, 0.8);
  padding: 0 16px;
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

select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 40px;
}

.eye-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  cursor: pointer;
}

.terms-container {
  display: flex;
  align-items: center;
  margin: 24px 0;
  margin-left: 5px;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgba(200, 240, 175, 0.8);
  background: rgba(255, 255, 255, 0.8);
  margin-right: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-checkbox.checked {
  background: linear-gradient(90deg, #c6f264, #8de557);
  border-color: transparent;
}

.custom-checkbox.checked::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 8px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-text {
  font-size: 14px;
  color: #666;
}

.terms-link {
  color: #75cc55;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(90deg, #c6f264, #8de557);
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(141, 229, 87, 0.3);
  margin-bottom: 16px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(141, 229, 87, 0.4);
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-text {
  text-align: center;
  font-size: 14px;
  color: #777;
}

.login-link {
  color: #75cc55;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
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

.error-text {
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 8px;
}
</style>