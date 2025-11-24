<template>
  <div class="h5-container">
    <router-view v-if="isAuth" />
    <WeComeAuth v-else @success="isAuth = true" />
  </div>
</template>

<script>
import WeComeAuth from '../../components/WeCome/WeComeAuth.vue';

export default {
  components: {
    WeComeAuth,
  },
  data() {
    let isAuth = false;
    try {
      const jsonStr = localStorage.getItem('userInfo');
      console.log('jsonStr:', jsonStr);
      if (jsonStr) {
        const userInfo = JSON.parse(jsonStr);
        if (userInfo && userInfo.jwtToken && userInfo.jwtExpireTime) {
          const expTime = new Date(userInfo.jwtExpireTime).getTime();
          if (expTime > Date.now()) {
            isAuth = true;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return {
      isAuth
    }
  },
  methods: {
    debug() {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
      script.onload = () => {
        new window.VConsole();
      };
      document.body.appendChild(script);
    },
  },
  created() {
    // if (process.env.NODE_ENV !== 'development') {
    //   this.debug();
    // }
    console.log('process.env:', process.env);
  },
}
</script>

<style lang="scss" scoped>
.h5-container {
  margin: 0 auto;
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;
}
</style>
