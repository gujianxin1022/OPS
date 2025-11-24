<template>
  <div class="leftReportHeader">
    <div class="headerLangBtns">
      <span
        v-for="item in leftReportHeaderLangList"
        :key="item.value"
        :class="{ active: item.value === langFlag }"
        @click="changeLangFlag(item.value)"
        >{{ item.text }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    langFlag:{
      type: Number,
      default: null,
    },
    leftReportHeaderLangList: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 切换中英文
    changeLangFlag(value) {
      this.$emit("changeLangFlag", value);
    },
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.leftReportHeader {
  display: flex;
  justify-content: space-between;
  .headerLangBtns {
    span {
      width: 50px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      margin: 0 10px;
      cursor: pointer;
      color: #666;
    }
    .active {
      color: #000;
    }
  }
}
</style>
