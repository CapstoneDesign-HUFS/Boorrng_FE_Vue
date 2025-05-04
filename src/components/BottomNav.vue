<template>
  <div class="bottom-navigation">
    <div class="nav-item"
         :class="{ active: $store.state.navMenu === 0 }"
         @click="setActiveTab('MyReport')">
      <div class="nav-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M18 20V10" :stroke="$store.state.navMenu === 0 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 20V4" :stroke="$store.state.navMenu === 0 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 20V14" :stroke="$store.state.navMenu === 0 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="nav-label">리포트</div>
    </div>
       
    <div class="nav-item"
         :class="{ active: $store.state.navMenu === 1 }"
         @click="setActiveTab('Home')">
      <div class="nav-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" :stroke="$store.state.navMenu === 1 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <polyline points="9 22 9 12 15 12 15 22" :stroke="$store.state.navMenu === 1 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
        </svg>
      </div>
      <div class="nav-label">홈</div>
    </div>
       
    <div class="nav-item"
         :class="{ active: $store.state.navMenu === 2  }"
         @click="setActiveTab('MyPage')">
      <div class="nav-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" :stroke="$store.state.navMenu === 2 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          <circle cx="12" cy="7" r="4" :stroke="$store.state.navMenu === 2 ? '#38c16f' : '#888888'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle>
        </svg>
      </div>
      <div class="nav-label">MY</div>
    </div>
  </div>
</template>
 
<script>
const MENU = {
  'MyReport' : 0,
  'Home' : 1,
  'MyPage' : 2,
}
export default {
  name: 'BottomNav',
  data() {
    return {
      //activeTab: 'Home',
      
    }
  },
  methods: {
    setActiveTab(tab) {
      //this.activeTab = tab;
      //this.$store.commit('setNavMenu', MENU[tab]);
      this.$router.replace({ name: tab })
      //this.$emit('tab-change', tab);
    }
  }
}
</script>
 
<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  border-top: 1px solid #e2e2e2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-bottom: 50px;
  padding-top: 50px;
}
 
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 33.33%;
  height: 100%;
  cursor: pointer;
  padding-top: 8px;
}
 
.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
 
.nav-label {
  font-size: 12px;
  color: #888888;
}
 
.nav-item.active .nav-label {
  color: #38c16f;
  font-weight: 500;
}
</style>