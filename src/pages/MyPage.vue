<template>
    <div class="container">
      <h2 class="page-title">마이페이지</h2>
      <div class="profile-circle">{{ profileInitial }}</div>
      <div class="username">{{ userData.name }}</div>
      <div class="user-meta">{{ userData.gender }} · {{ userData.age }}세<br>{{ userData.userId }}</div>
      
      <a class="setting-card" @click="editSpeed">
        <div class="setting-left">
          <!-- 설정 아이콘 (SVG) -->
          <div class="setting-icon">
            <svg width="24" height="24" fill="none" stroke="#38c16f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .69.4 1.31 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.59.2 1.1.61 1.51 1.09h.09a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div class="setting-texts">
            <div class="label">보행속도 설정</div>
            <div class="sub">현재 {{ userData.speedMin }}m/s - {{ userData.speedMax }}m/s</div>
          </div>
        </div>
        <!-- 오른쪽 화살표 아이콘 (SVG) -->
        <svg class="arrow-icon" width="20" height="20" fill="none" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MyPage',
    data() {
      return {
        userData: {
          name: '김민지',
          gender: '여성',
          age: 22,
          userId: 'mjkim0323',
          speedMin: 1.23,
          speedMax: 1.45,
          settingLink: 'edit-speed.html'
        }
      }
    },
    created() {
      this.$store.commit('setNavMenu', 2);
    },
    computed: {
      profileInitial() {
        return this.userData.name.charAt(0)
      }
    },
    methods: {
        editSpeed(){
            this.$router.push({name: "EditSpeed"});
        }
    }
  }
  </script>
  
  <style>
  .container {
    padding: 2rem 1rem 6rem;
    text-align: center;
  }
  
  .page-title {
    margin-top: 80px;
    color: #38c16f;
    font-size: 36px;
    font-weight: 700;
    background: linear-gradient(90deg, #75CC55, #00d3a9);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent; /* 일부 브라우저용 */
    animation: fadeIn 1s ease-out 0.2s both;
    margin-bottom: 50px;
  }
   
  .profile-circle {
    width: 100px;
    height: 100px;
    background: linear-gradient(314.72deg, #00E3AE 12.93%, #9BE15D 84.29%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 36px;
    margin: 0 auto 0.5rem;
    box-shadow: 0 0 0 4px white;
  }
  
  .username {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 0.3rem;
  }
  
  .user-meta {
    font-size: 14px;
    color: #777;
    margin-bottom: 3rem;
  }
  
  .setting-card {
    text-decoration: none;
    background: white;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    max-width: 90%;
    margin: 0 auto;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .setting-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
   
  .setting-left {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  
  .setting-icon {
    background: #e6f5e6;
    padding: 0.6rem;
    border-radius: 0.8rem;
  }
  
  .setting-texts {
    text-align: left;
  }
  
  .setting-texts .label {
    color: black;
    font-weight: 700;
    font-size: 1.3rem;
  }
  
  .setting-texts .sub {
    font-size: 0.85rem;
    color: #555;
  }
  
  .arrow-icon {
    stroke: #9bcf9f;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>