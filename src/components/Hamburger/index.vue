<template>
  <div
    :class="{'stuff':isActive, 'open':!isActive, 'desktop-active':!isActive && device !== 'mobile', 'mobile-active':!isActive && device === 'mobile', 'desktop': device !== 'mobile', 'mobile': device === 'mobile'}"
    class="hamburger flex-wrapper flex-direction-column flex-space-between"
    :style="{backgroundImage:`url(${isActive?staff:open})`,backgroundSize: '100%'}"
    @click="toggleClick"
  >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import staff from '../../assets/stuff.png'
import open from '../../assets/open.png'
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      staff: staff,
      open: open
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ])
  }
}
</script>

<style lang="scss" scoped>
.stuff {
  // background-image: url('../../assets/stuff.png');
  background-size: 24px 24px;
}
.open {
  // background-image: url('../../assets/open.png');
  background-size: 24px 24px;
}
.hamburger {
  cursor: pointer;
  width: 26px;
  height: 26px;
  transition: all 0.28s;
  .line {
    width: 100%;
    height: 3px;
    background-color: #333;
    transition: all .38s;
    -webkit-transition: all .38s;
  }
  &.desktop {
    .line {
      transform: rotate(0deg);
      opacity: 1;
    }
  }
  &.desktop-active {
    .line1 {
      transform: rotate(45deg) translate(6px, 6px);
    }
    .line2 {
      opacity: 0;
      transform: rotate(90deg);
    }
    .line3 {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
  &.mobile {
    .line1 {
      transform: rotate(45deg) translate(6px, 6px);
    }
    .line2 {
      opacity: 0;
      transform: rotate(90deg);
    }
    .line3 {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
  &.mobile-active {
    .line {
      transform: rotate(0deg);
      opacity: 1;
    }
  }
}
</style>
