<template>
  <div class="side-wrapper">
    <div v-if="device !== 'mobile'" class="brand"
      :style="{ width: sidebar.opened ? '180px' : '60px', background: themeColor }">
      <div v-if="sidebar.opened" class="logo-text">LingoAce {{ $t("glb-Operation Management System") }}</div>
      <div v-else>
        <img class="smallLogo" :src="smallLogo" alt="">
      </div>
    </div>
    <module-menu v-if="device === 'mobile'" direction="vertical" />
    <second-menu class="second-menu" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ModuleMenu from '../ModuleMenu'
import SecondMenu from '../SecondMenu'
import logo from '@/assets/logo.png'
import smallLogo from '@/assets/logo-little.png'

export default {
  data() {
    return {
      logo: logo,
      smallLogo: smallLogo
    }
  },
  components: { ModuleMenu, SecondMenu },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'routerMap',
      'themeColor',
      'device',
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    imEnabled() {
      return this.$store.getters['im/enabled'];
    }
  },
  watch: {
    imEnabled: {
      handler(val) {
        if (val) {
          // 初始化 IM。 延迟2秒，优先加载其他资源
          setTimeout(() => {
            this.$store.dispatch('im/init');
          }, 2000);
        }
      },
      immediate: true
    }
  }
}

</script>
<style lang="scss" scoped>
@import 'src/styles/variables.scss';

::v-deep .el-submenu__title {
  padding-left: 6px !important;
}

.side-wrapper {
  background: $customPrimaryColor;

  .logo-text {
    color: #fff;
    font-size: 14px;
    text-align: center;
    /*font-weight: bold;*/
  }
}

.brand {
  width: 180px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.28s;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .logo {
    width: 84px;
    height: 44px;
  }

  .smallLogo {
    width: 34px;
    height: 34px;
  }
}
</style>
