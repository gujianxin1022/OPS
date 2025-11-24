<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" class="first-wrapper user-select-no">
    <div
      v-for="(item, index) in firstMenuMap"
      :key="index"
      class="first-item text-center"
      @click="clickFirstMenu(index)"
    >
      <i :class="`iconfont ${item.icon}`" /><br>
      <div class="menu-text">{{ currentLang == 'en' ? item.nameEn : item.nameZh }}</div>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    firstMenuMap() {
      return this.menuMap[this.moduleMenuIndex].children
    },
    ...mapGetters([
      'menuMap',
      'themeColor',
      'moduleMenuIndex',
      'currentLang'
    ])
  },
  methods: {
    clickFirstMenu(index) {
      this.setFirstMenuIndex(index)
    },
    ...mapMutations({
      'setFirstMenuIndex': 'SET_FIRST_MENU_INDEX'
    })
  }
}
</script>

<style lang="scss" scoped>
.first-wrapper {
  width: 70px;
  background-color: #444;
  .first-item {
    position: relative;
    padding: 10px 0;
    width: 60px;
    cursor: pointer;
    color: #fff;
    .menu-text {
      margin-top: 10px;
      width: 100%;
      height: 20px;
      font-size: 12px;
    }
    .line {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0px;
      margin: auto;
      display: block;
      content: '';
      width: 0;
      height: 0;
      border: 12px solid transparent;
      opacity: 0;
    }
    &.active {
      .line {
        opacity: 1;
      }
    }
  }
}
</style>
