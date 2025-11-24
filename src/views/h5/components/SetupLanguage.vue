<template>
  <!-- 切换语言 -->
  <el-dropdown trigger="click" @command="handleCommand">
    <span class="el-dropdown-link">
      {{ currentLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">{{ item.label
        }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { setup } from "@/assets/locales/index";
export default {
  data() {
    return {
      options: [
        { value: 'zh', label: '中文' },
        { value: 'en', label: 'ENG' },
      ],
    }
  },
  computed: {
    currentVal() {
      return this.$i18n.locale;
    },
    currentLabel() {
      return this.options.find(item => item.value === this.currentVal)?.label ?? '';
    }
  },
  methods: {
    handleCommand(val) {
      if (val == this.currentVal) {
        return;
      }
      setup(val);
    },
  }
}
</script>
