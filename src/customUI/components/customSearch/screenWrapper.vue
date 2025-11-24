<template>
  <custom-card class="screen-wrapper" :icon="screenIcon" :title="screenTitle">
    <div slot="header-left" class="header-left-wrapper" />
    <div slot="header-right" class="screen-btn-wrapper">
      <div class="close-screen inline-block pointer" @click="toggleOpenScreem">
        <i
          :class="{
            'el-icon-arrow-up': isOpenScreen,
            'el-icon-arrow-down': !isOpenScreen,
          }"
        />
        <span>
          {{ isOpenScreen ? $t("my-home-Fold") : $t("my-home-Unfold") }}
        </span>
      </div>
      <slot name="allFilter" />
      <el-button size="small" @click="reset" v-if="showReset">
        {{ $t("重置") }}
      </el-button>
      <el-button type="primary" size="small" @click="search">
        {{ $t("my-home-Search") }}
      </el-button>
    </div>
    <el-collapse-transition>
      <div v-show="isOpenScreen">
        <div class="screent-content">
          <slot />
        </div>
        <div class="hr-dashed-line"></div>
      </div>
    </el-collapse-transition>
  </custom-card>
</template>
<script>
export default {
  props: {
    screenIcon: {
      type: String,
      default: "",
    },
    screenTitle: {
      type: String,
      default: "筛选查询",
    },
    showReset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpenScreen: true,
    };
  },
  methods: {
    // 展开或收起筛选
    toggleOpenScreem() {
      this.isOpenScreen = !this.isOpenScreen;
    },
    // 点击筛选按钮
    search() {
      this.$emit("search");
    },
    // 点击重置按钮
    reset() {
      this.$emit("reset");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "src/styles/variables.scss";
@import "src/styles/mixin.scss";

.screen-wrapper {
  width: 100%;
  overflow: hidden;

  .header-left-wrapper {
    color: red;
    float: left;
  }

  .screen-btn-wrapper {
    @include font-style(12px, #999);

    .close-screen {
      width: 80px;
    }
  }

  .screent-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 10px 0;
  }
}
</style>
