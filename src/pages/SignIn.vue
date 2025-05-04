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
                <input type="text" class="input-field" placeholder="아이디" v-model="formData.username">
                
                <div class="password-field">
                <input :type="passwordType" class="input-field" placeholder="비밀번호" v-model="formData.password">
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
            </div>

            <button class="btn" @click="login">로그인</button>
            <p class="signup-text">아직 회원이 아니신가요? <a class="signup-link" @click="signup">회원가입</a></p>

            <svg class="wave-decoration" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.75,0,116.21,29.87,181.06,54.47,229.93,74.39,280.09,70.22,321.39,56.44Z" fill="#c6f264"></path>
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignIn',
    data() {
        return {
            formData: {
                username: '',
                password: ''
            },
            passwordType: 'password'
        };
    },
    methods: {
        togglePasswordVisibility() {
            // 비밀번호 타입을 'password'와 'text' 사이에서 토글
            this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
        },
        login() {
            // 로그인 로직 구현
            console.log('로그인 시도:', this.formData);
            this.$router.replace({name : 'InitialSpeed'})
            // 여기에 실제 로그인 API 호출 또는 라우팅 로직을 추가할 수 있습니다
        },
        signup() {
            // 회원가입 페이지로 이동
            this.$router.replace({ name: 'SignUp' });
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
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(141, 229, 87, 0.4);
    }
    
    .btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(141, 229, 87, 0.3);
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