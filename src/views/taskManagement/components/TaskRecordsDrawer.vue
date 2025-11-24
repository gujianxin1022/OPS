<template>
  <div class="task-records-drawer-warp">
    <el-tabs
      style="height: 100%"
      stretch
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="任务记录" name="first">
        <FollowUpRecords class="content" />
      </el-tab-pane>
      <el-tab-pane label="外呼记录" name="second">
        <CallRecord class="content"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import FollowUpRecords from "@/views/taskManagement/components/FollowUpRecords.vue";
import CallRecord from "@/views/taskManagement/components/CallRecord.vue";
import { onMounted, ref, reactive, computed } from "@vue/composition-api";

export default {
  components: { FollowUpRecords,CallRecord },

  setup(props, { root, emit }) {
    const activeName = ref("first");
    return {
      activeName,
    };
  },
};
</script>
<style scoped lang="scss">
.task-records-drawer-warp {
  width: 840px;
  padding:0 20px;
  height: 95%;
  .content {
    padding-top: 20px;
  }
}
</style>
<style>
.task-records-drawer-warp {
        .el-tabs__content{
                height: 100%;   
        }
  .el-tab-pane {
    height: 100%;
  }
}
</style>
