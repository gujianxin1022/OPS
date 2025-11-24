<template>
  <!-- 二级三级菜单 -->
  <el-menu
    class="second-wrapper user-select-no"
    active-text-color="#fff"
    :default-active="currentPath"
    :text-color="variables.menuText"
    :style="{
      background: themeColor,
      width: sidebar.opened ? '180px' : '60px',
    }"
    :collapse="isCollapse"
    :unique-opened="true"
  >
    <!-- 调用列表组件 -->
    <SubMenu
      :learn-manager-task-total="learnManagerTaskTotal"
      :menuList="secondMenuMap"
    ></SubMenu>
  </el-menu>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import variables from "@/styles/variables.scss";
import SubMenu from "../SubMenu/index";
export default {
  components: {
    SubMenu,
  },
  data() {
    return {
      learnManagerTaskTotal: 0,
    };
  },
  created() {
    for (let key in this.taskList) {
      this.learnManagerTaskTotal += this.taskList[key].length;
    }
  },
  computed: {
    secondMenuMap() {
      let moduleMenuIndex =
        this.moduleMenuIndex === "null" || this.moduleMenuIndex === null
          ? 0
          : this.moduleMenuIndex;
      if (this.menuMap[moduleMenuIndex].children) {
        return this.menuMap[moduleMenuIndex].children;
      } else {
        return [];
      }
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    ...mapGetters([
      "menuMap",
      "themeColor",
      "moduleMenuIndex",
      "secondMenuIndex",
      "currentPath",
      "sidebar",
      "taskList",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.second-wrapper {
  transition: width 0.28s;
  &:hover,
  &:focus {
    outline: none;
  }
}
</style>
