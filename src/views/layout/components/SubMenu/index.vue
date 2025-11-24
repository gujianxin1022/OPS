<template>
  <div>
    <template v-for="list in menuList">
      <el-submenu v-if="list.children" :key="list.id" :index="String(list.id)">
        <template slot="title">
          <i v-if="list.icon !== 'icon-gongzuotai'"
            :class="list.icon && list.icon.startsWith('el-icon-') ? list.icon : `iconfont ${list.icon}`" />
          <i v-else :class="`iconfont-ali ${list.icon}`" />
          <span v-if="sidebar.opened">{{
            currentLang == "en" ? list.nameEn : list.nameZh
            }}</span>
        </template>
        <!-- 当 children 的项不为空时，递归调用SubMenu组件 -->
        <SubMenu :menuList="list.children"></SubMenu>
      </el-submenu>
      <el-menu-item v-else-if="hidden(list)" :index="list.url" :key="list.code" :class="`menu-${list.code}`"
        @click="clickSecondMenu(list)">
        <el-badge v-if="list.code === 'myTask' && totalTask !== 0" :value="totalTask" :max="99" class="item">
          <span>
            <i v-if="list.icon !== 'icon-gongzuotai'" :class="`iconfont ${list.icon}`" />
            <i v-else :class="`iconfont-ali ${list.icon}`" />
            <span>{{ currentLang == "en" ? list.nameEn : list.nameZh }}</span>
          </span>
        </el-badge>
        <span v-else>
          <i v-if="list.icon !== 'icon-gongzuotai'"
            :class="list.icon && list.icon.startsWith('el-icon-') ? list.icon : `iconfont ${list.icon}`" />
          <i v-else :class="`iconfont-ali ${list.icon}`" />
          <span>{{ currentLang == "en" ? list.nameEn : list.nameZh }}</span>
          <!-- 我的消息-未读数，直接在文字后面添加标记 -->
          <el-badge v-if="list.code === 'Messages' && imUnreadCount" class="inline-badge" :value="imUnreadCount"
            :max="99"></el-badge>
          <!-- 离职待交接员工-未处理数 -->
          <el-badge v-if="list.code === 'leaveHandoverEmployees' && awaitingResignationEmployeeBadgeCount" class="inline-badge" :value="awaitingResignationEmployeeBadgeCount"
            :max="99"></el-badge>
        </span>
      </el-menu-item>
    </template>
  </div>
</template>
<style></style>
<script>
import { mapGetters } from "vuex";

export default {
  name: "SubMenu", //模板名称
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
    learnManagerTaskTotal: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "device",
      "currentLang",
      "taskList",
      "totalTask",
      "awaitingResignationEmployeeBadgeCount"
    ]),
    imUnreadCount() {
      return this.$store.state.im.unreadMessageCount;
    },
  },
  mounted() { },
  methods: {
    clickSecondMenu(listInfo) {
      this.$router.push({
        path: listInfo.url,
      });
    },
    hidden(list) {
      let has = this.HiddenMenu.hiddenMenuLists.find(
        (item) => item == list.url
      );
      if (has) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-badge ::v-deep .el-badge__content {
  top: 9px;
  right: 0;
}

.inline-badge {
  top: -0.8em;
}
</style>
<style lang="scss">
// el-icon 样式
.side-wrapper .el-menu-item {

  [class^=el-icon-] {
    width: auto;
    font-size: 16px;
    margin-right: 0;
  }
}
</style>
