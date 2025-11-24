<template>
  <div class="cause-management">
    <el-tabs type="border-card">
      <el-tab-pane
        :label="$t('积分')"
        v-if="
          Per.handleTabsPer(
            'financeMT.costCenter.causeManagement.showCoinReasons'
          )
        "
      >
        <BaseReason :type="COIN" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('课时')"
        v-if="
          Per.handleTabsPer(
            'financeMT.costCenter.causeManagement.showClassHoursReasons'
          )
        "
      >
        <BaseReason :type="CLASS_HOUR" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseReason from "./components/BaseReason.vue";
import { COIN, CLASS_HOUR } from "./components/constants";
export default {
  name: "causeManagement",
  components: { BaseReason },
  setup() {
    return {
      COIN,
      CLASS_HOUR,
    };
  },
};
</script>

<style>
.cause-management {
  padding: 16px;
}
</style>
