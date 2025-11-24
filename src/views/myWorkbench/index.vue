<template>
  <div class="workbench-wrap">
    <div class="workbench-content">
      <el-tabs
        type="card"
        v-model="activeTabs"
      >
        <el-tab-pane
          v-if="Per.handleTabsPer('teach.myWorkbench.myclass')"
          :label="$t('my-home-My Classes')"
          name="myClass"
        >
          <MyClass
            v-if="activeTabs === 'myClass'"
            :nowUserInfo="nowUserInfo"
            :deptType="deptType"
            :activeTabs="activeTabs"
          ></MyClass>
        </el-tab-pane>
        <el-tab-pane
          v-if="Per.handleTabsPer('teach.myWorkbench.myCustomer')"
          :nowUserInfo="nowUserInfo"
          :label="$t('my-home-My Customers')"
          name="myCustomer"
        >
          <MyCustomer
            v-if="activeTabs === 'myCustomer'"
            :nowUserInfo="nowUserInfo"
            :deptType="deptType"
            :activeTabs="activeTabs"
          ></MyCustomer>
        </el-tab-pane>
        <el-tab-pane
          v-if="Per.handleTabsPer('teach.myWorkbench.myStudent')"
          :label="$t('my-home-My Students')"
          name="myStudent"
        >
          <MyStudent
            v-if="activeTabs === 'myStudent'"
            :nowUserInfo="nowUserInfo"
            :deptType="deptType"
            :activeTabs="activeTabs"
          ></MyStudent>
        </el-tab-pane>
        <el-tab-pane
          v-if="Per.handleTabsPer('teach.myWorkbench.myDeal')"
          :label="$t('my-home-My Orders')"
          name="myDeal"
        >
          <MyDeal
            v-if="activeTabs === 'myDeal'"
            :nowUserInfo="nowUserInfo"
            :deptType="deptType"
            :activeTabs="activeTabs"
          ></MyDeal>
        </el-tab-pane>
        <el-tab-pane
          v-if="Per.handleTabsPer('teach.myWorkbench.myTeacher')"
          :label="$t('my-home-My Teachers')"
          name="myTeacher"
        >
          <MyTeacher
            v-if="activeTabs === 'myTeacher'"
            :nowUserInfo="nowUserInfo"
            :deptType="deptType"
            :activeTabs="activeTabs"
          ></MyTeacher>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import MyClass from "./sub/MyClass";
import MyCustomer from "./sub/MyCustomer";
import MyStudent from "./sub/MyStudent";
import MyDeal from "./sub/MyDeal";
import MyTeacher from "./sub/MyTeacher";
import { mapGetters } from 'vuex';
export default {
  name: 'myworkbench',
  components: {
    MyClass,
    MyCustomer,
    MyStudent,
    MyDeal,
    MyTeacher,
  },
  data () {
    return {
      activeTabs: "",
      deptType: 0,
      topSelectData: [
      ]
    };
  },
  watch: {
    currentLang () {
      this.topSelectData = [
        { label: this.$t('my-home-My Desk'), value: 0 },
        { label: this.$t('my-home-My Team'), value: 1 }
      ]
    }
  },
  computed: {
    nowUserInfo () {
      return JSON.parse(window.localStorage.getItem("userInfo"));
    },
    ...mapGetters(['currentLang'])
  },
  created () {
    this.initData()
    this.activeTabs = "myClass";
  },
  methods: {
    initData () {
      this.topSelectData = [
        { label: this.$t('my-home-My Desk'), value: 0 },
        { label: this.$t('my-home-My Team'), value: 1 }
      ]
    }
  }
};
</script>
<style lang="scss">
.workbench-wrap {
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding: 5px 10px;
  .el-tabs--border-card > .el-tabs__header {
    background-color: #fff !important;
  }
  .top-select {
    position: relative;
    .weather {
      position: absolute;
      right: 20px;
      top: 30%;
    }
  }
  .top-select span {
    margin-right: 10px;
  }
  .workbench-content {
    width: 100%;
  }
  .top-select {
    // background-color: #f3f6f9;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  .choose-select {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>