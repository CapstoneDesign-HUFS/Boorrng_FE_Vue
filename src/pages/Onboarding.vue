<template>
    <div class="onboarding-container">
      <div class="content">
        <div class="logo-container">
          <div class="logo-bg"></div>
          <img class="logo" src="../assets/images/logo.png" alt="Alien Logo">
        </div>
        <h1 class="title">띠까마까</h1>
        <h2 class="subtitle">RUN OR NOT</h2>
        <div class="buttons-container">
          <button class="btn btn-primary" @click="handleStart">새로 시작하기</button>
          <button class="btn btn-secondary" @click="handleLogin">로그인</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Onboarding',
    data() {
      return {
        // 필요한 상태 데이터가 있다면 이곳에 추가
      }
    },
    methods: {
      handleStart() {
        console.log('새로 시작하기 클릭됨');
        // 새로 시작하기 기능 구현
        // this.$router.push('/signup'); // 라우터가 있는 경우 사용
        this.$router.replace({ name: 'SignUp' });
      },
      handleLogin() {
        console.log('로그인 클릭됨');
        // 로그인 기능 구현
        // this.$router.push('/login'); // 라우터가 있는 경우 사용
        this.$router.push({ name: 'SignIn' });
      }
    },
    mounted() {
      console.log('온보딩 페이지가 마운트됨');
      // 컴포넌트 마운트 시 필요한 로직 구현
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
  
  .onboarding-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    background-color: linear-gradient(165deg, #f5ffed 0%, #e8f9db 100%);
    overflow-x: hidden;
  }
  
  .content {
    width: 100%;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .logo-container {
    position: relative;
    margin-bottom: 40px;
    width: 180px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .logo-bg {
    position: absolute;
    width: 180px;
    height: 180px;
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
    width: 120px;
    height: 120px;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .title {
    margin-bottom: -10px;
    font-size: 37px;
    font-weight: 700;
    color: #333;
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 1s ease-out 0.2s both;
    text-align: center;
  }
  
  .subtitle {
    margin-bottom: 60px;
    font-size: 18px;
    font-weight: 500;
    color: #666;
    letter-spacing: 0.5px;
    animation: fadeIn 1s ease-out 0.4s both;
    text-align: center;
  }
  
  .buttons-container {
    width: 100%;
  }
  
  .btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    font-weight: 600;
    text-align: center;
    font-size: 16px;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    cursor: pointer;
    animation: slideUp 0.5s ease-out both;
  }
  
  .btn-primary {
    background: linear-gradient(90deg, #75cc55, #00d3a9);
    color: white;
    box-shadow: 0 4px 12px rgba(117, 204, 85, 0.3);
    margin-bottom: 12px;
    animation-delay: 0.6s;
  }
  
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(117, 204, 85, 0.5);
  }
  
  .btn-primary:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(117, 204, 85, 0.4);
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #555;
    border: 1px solid rgba(0, 0, 0, 0.08);
    animation-delay: 0.8s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .btn-secondary:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* 모바일 환경에서도 중앙 정렬되도록 미디어 쿼리 추가 */
  @media screen and (max-width: 480px) {
    .content {
      padding: 40px 24px;
      max-width: 100%;
    }
    
    .logo-container {
      margin-bottom: 30px;
    }
    
    .subtitle {
      margin-bottom: 40px;
    }
  }
  </style>