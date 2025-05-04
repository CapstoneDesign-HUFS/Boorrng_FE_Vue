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
        <div class="input-row">
          <input type="text" class="input-field" placeholder="아이디" v-model="formData.username">
          <button class="check-button" @click="checkDuplicateId">중복확인</button>
        </div>
      </div>
      
      <div class="form-group">
        <input :type="passwordType" class="input-field" placeholder="비밀번호" v-model="formData.password">
        <div class="eye-icon" @click="togglePasswordVisibility('password')">
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
      
      <div class="form-group">
        <input :type="confirmPasswordType" class="input-field" placeholder="비밀번호 확인" v-model="formData.confirmPassword">
        <div class="eye-icon" @click="togglePasswordVisibility('confirmPassword')">
          <svg v-if="confirmPasswordType === 'password'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <input type="text" class="input-field" placeholder="이름" v-model="formData.name">
      </div>
      
      <div class="form-group">
        <div class="input-row">
          <select id="birth-year" class="input-field" v-model="formData.birthYear">
            <option value="" disabled selected>출생연도</option>
            <option v-for="year in birthYears" :key="year" :value="year">{{ year }}년</option>
          </select>
          
          <select class="input-field" v-model="formData.gender">
            <option value="" disabled selected>성별</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
      </div>
      
      <div class="terms-container">
        <div class="custom-checkbox" :class="{ checked: formData.termsAgreed }" @click="toggleTermsAgreement"></div>
        <span class="terms-text">약관에 동의합니다.<a @click="this.showTerms=true" class="terms-link">약관 보기</a></span>
      </div>
      
      <button class="submit-button" @click="submitForm">회원가입</button>
      
      <p class="login-text">이미 가입하셨나요? <a @click="login" class="login-link">로그인하기</a></p>
      
      <svg class="wave-decoration" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.75,0,116.21,29.87,181.06,54.47,229.93,74.39,280.09,70.22,321.39,56.44Z" fill="#c6f264"></path>
      </svg>
    </div>
  </div>

  <Terms2 @close="this.showTerms=false" v-if="showTerms" />
</template>

<script>
import Terms from "../components/Terms.vue"
export default {
  name: 'SignUp',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        birthYear: '',
        gender: '',
        termsAgreed: false
      },
      passwordType: 'password',
      confirmPasswordType: 'password',
      birthYears: [],
      showTerms: false,
    }
  },
  components: {
    Terms,
  },
  methods: {
    login() {
      this.$router.replace({ name: 'SignIn' });
    },
    generateBirthYears() {
      const currentYear = new Date().getFullYear();
      const startYear = 1950;
      
      for (let year = currentYear - 10; year >= startYear; year--) {
        this.birthYears.push(year);
      }
    },
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
      } else if (field === 'confirmPassword') {
        this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
      }
    },
    checkDuplicateId() {
      // API 호출 로직 구현
      if (this.formData.username) {
        alert('아이디 중복 확인 중...');
        // 실제로는 서버에 API 요청을 보내서 확인해야 합니다
        setTimeout(() => {
          alert('사용 가능한 아이디입니다.');
        }, 1000);
      } else {
        alert('아이디를 입력해주세요.');
      }
    },
    toggleTermsAgreement() {
      this.formData.termsAgreed = !this.formData.termsAgreed;
    },
    validateForm() {
      if (!this.formData.username) {
        alert('아이디를 입력해주세요.');
        return false;
      }
      if (!this.formData.password) {
        alert('비밀번호를 입력해주세요.');
        return false;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return false;
      }
      if (!this.formData.name) {
        alert('이름을 입력해주세요.');
        return false;
      }
      if (!this.formData.birthYear) {
        alert('출생연도를 선택해주세요.');
        return false;
      }
      if (!this.formData.gender) {
        alert('성별을 선택해주세요.');
        return false;
      }
      if (!this.formData.termsAgreed) {
        alert('약관에 동의해주세요.');
        return false;
      }
      return true;
    },
    submitForm() {
      if (this.validateForm()) {
        alert('회원가입이 완료되었습니다!');
        // 서버에 회원가입 요청을 보내는 로직 추가
        console.log('Form submitted:', this.formData);
      }
    }
  },
  mounted() {
    this.generateBirthYears();
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

.check-button {
  min-width: 100px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(90deg, #c6f264, #8de557);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(141, 229, 87, 0.2);
}

.check-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(141, 229, 87, 0.3);
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
/*   z-index: 1; */
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(141, 229, 87, 0.4);
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
</style>