<template>
  <!-- 一级菜单 -->
  <div
    class="module-wrapper user-select-no"
    :class="{'module-wrapper-vertical flex-wrapper mobile-first-menu': device === 'mobile'}"
  >
    <div
      v-for="(item, index) in menuList"
      :key="index"
      :class="{'active': index == moduleMenuIndex}"
      class="module-item"
      @click="clickModuleTab(index)"
    >
      <i
        v-if="item.icon !== 'icon-gongzuotai'"
        v-show="device == 'mobile'"
        :class="`iconfont ${item.icon}`"
      />
      <i
        v-else
        v-show="device == 'mobile'"
        :class="`iconfont-ali ${item.icon}`"
      />
      <el-badge is-dot :hidden="item._badge === 0">
        <span
        class="module-name">{{ currentLang=='en'?item.nameEn:item.nameZh }}</span>
      </el-badge>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    direction: {
      type: String,
      default: 'horizontal'
    }
  },
  computed: {
    ...mapGetters([
      'menuMap',
      'themeColor',
      'device',
      'moduleMenuIndex',
      'currentLang',
      "awaitingResignationEmployeeBadgeCount"
    ]),
    menuList() {
      return this.menuMap.map(item => {
        const badge = item.code === 'system' ? this.awaitingResignationEmployeeBadgeCount : 0;
        return {
          ...item,
          _badge: badge,
        }
      });
    }
  },
  mounted () {
  },
  methods: {
    clickModuleTab (index) {
      this.setModuleMenuIndex(index)
      this.$emit('currentTabIndex', index)
    },
    ...mapMutations({
      'setModuleMenuIndex': 'SET_MODULE_MENU_INDEX'
    })
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.module-wrapper {
  display: flex;
  .module-item {
    font-size: 14px;
    position: relative;
    text-align: center;
    line-height: 43px;
    border-bottom: 2px solid #fff;
    cursor: pointer;
    transition: all 0.3s;
    color: #444;
    padding-top: 5px;
    margin-left: 20px;
    .module-name {
      margin-left: 5px;
    }
    &.active {
      color: $customPrimaryColor;
      font-size: 18px;
      font-weight: 500;
    }
    ::v-deep .el-badge__content.is-fixed.is-dot {
      top: 10px; // 调整红点位置
    }
  }
  &.module-wrapper-vertical {
    height: auto;
    .module-item {
      padding: 10px 0;
      width: 40px;
      line-height: inherit;
      text-align: center;
    }
  }
  &.mobile-first-menu {
    overflow-x: auto;
    .module-item {
      color: white;
      border: none;
      line-height: 50px;
      padding: 0;
      &.active {
        font-size: 14px;
        background: $focusMenuColor;
      }
      .module-name {
        margin-left: 0;
      }
    }
  }
}
.mobile-first-menu {
  height: 50px !important;
}
</style>

