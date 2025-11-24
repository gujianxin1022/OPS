<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端打开菜单时的遮罩层 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 头部导航栏 -->
    <navbar />
    <!-- 主要内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <sidebar class="sidebar-container" />
      <!-- 右侧主要内容 -->
      <el-container class="main-container">
        <app-main />
      </el-container>
    </el-container>
    <CustomerService v-if="!isDevelopment"></CustomerService>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import CustomerService from "@/components/CustomerService/index.vue";
import wecomeApi from "@/components/WeCome/api.js";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    CustomerService,
  },
  data() {
    return {
      timer: null,
      taskNum: 0,
      isDevelopment: process.env.NODE_ENV === "development",
    };
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters(["totalTask", "currentLang"]),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    ...mapActions(["getNewTaskStatus", "fetchAwaitingResignationEmployeeCount"]),
    handleClickOutside() {
      this.closeSideBar({ withoutAnimation: false });
    },
    ...mapMutations({
      closeSideBar: "CLOSE_SIDEBAR",
    }),
    checkNewTask() {
      this.getNewTaskStatus().then((res) => {
        if (res.code !== 50001) {
          this.taskNum = res.data;
          if (this.taskNum === 0) return;
          let message = "";
          switch (this.currentLang) {
            case "en":
              message = `<p>You have ${this.taskNum || 0} tasks</p>`;
              break;
            case "zh":
              message = `<p>您有${this.taskNum || 0}个任务</p>`;
              break;
            default:
              break;
          }
          this.$notify({
            message: message,
            type: "warning",
            showClose: true,
            dangerouslyUseHTMLString: true,
          });
        }
        this.timer = setTimeout(this.checkNewTask, 60000 * 5);
      });
    },
    // 检查用户的企业微信绑定状态
    checkUserWeComeStatus() {
      // 如果是绑定企业页面的路由，无需检查
      const routeName = 'wecome-bind';
      if (this.$route.name !== routeName) {
        wecomeApi.getUserWecomeBindUrl().then(url => {
          // 需要绑定
          if (url) {
            console.log('需要绑定', url);
            this.$router.push({
              name: routeName,
              params: {
                // 仅可使用一次，刷新页面不保留。所以不使用 query 传参
                initBindUrl: url,
              }
            });
          }
        });
      }
    }
  },
  created() {
    this.checkNewTask();
    this.$eventBus.$on("clearTimer", () => {
      if (this.timer) clearTimeout(this.timer);
    });
    this.checkUserWeComeStatus();
    // 如果具有查看 离职待交接员工 菜单权限，则获取待离职员工数量
    if (this.Per.hasPermission('system.leaveHandoverEmployees')) {
      this.fetchAwaitingResignationEmployeeCount();
    }
  },
};
</script>
