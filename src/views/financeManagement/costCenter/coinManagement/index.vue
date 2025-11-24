<template>
  <div class="integral-management">
    <div>
      <top-stats></top-stats>
    </div>
    <div class="tab-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('积分发放')" name="coinSend">
          <coin-send-list></coin-send-list>
        </el-tab-pane>
        <el-tab-pane :label="$t('积分消耗')" name="coinConsume">
          <coin-consume-list></coin-consume-list>
        </el-tab-pane>
        <el-tab-pane :label="$t('用户列表')" name="coinUserList">
          <coin-user-list></coin-user-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import TopStats from "./components/topStats";
import CoinSendList from "./components/coinSendList";
import CoinConsumeList from "./components/coinConsumeList";
import CoinUserList from "./components/coinUserList";
export default {
  name: "coinManagement",
  components: {
    TopStats,
    CoinSendList,
    CoinConsumeList,
    CoinUserList,
  },
  data() {
    return {
      activeName: "coinSend",
    };
  },
};
</script>
<style lang="scss" scoped>
.tab-box {
  padding: 15px;
}
</style>
