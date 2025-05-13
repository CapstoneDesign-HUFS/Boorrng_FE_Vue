<template>

     <router-view></router-view>
     <BottomNav v-if="!$route.meta.hideBottomNav && $store.state.homePageState" />
</template>

<script>
import BottomNav from "./components/BottomNav.vue";
export default {
  name: "App",
  components: {
    BottomNav : BottomNav,
  }
};
</script>

<style>
  html, body, #app {
    min-height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    background: linear-gradient(165deg, #f5ffed 0%, #e8f9db 100%);
  }
</style>
