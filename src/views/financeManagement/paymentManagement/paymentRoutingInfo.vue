<template>
  <div
    class="routing-plan-warp"
    v-loading="loading"
    :style="`height:${tableHeight}px`"
  >
    <div v-show="type === 'edit' && isOwner">
      <el-button
        v-show="!isShowSubmitBtn"
        type="primary"
        style="width: 125px; margin: 20px 20px 0 0"
        class="fr"
        @click="handelEdit"
        >{{ $t("编辑") }}</el-button
      >
      <el-button
        v-show="isShowSubmitBtn"
        style="width: 125px; margin: 20px 20px 0 0"
        class="fr"
        @click="handelCancle"
        >{{ $t("取消") }}</el-button
      >
      <el-button
        v-show="isShowSubmitBtn"
        type="primary"
        style="width: 125px; margin: 20px 20px 0 0"
        class="fr"
        @click="handelSave"
        >{{ $t("保存") }}</el-button
      >
    </div>
    <RoutingPlan ref="routingPlan" />
    <RoutingRules />
  </div>
</template>
<script>
import { onMounted, ref } from "@vue/composition-api";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import FilterBySolutionVersion from "@/components/FilterItem/FinanceFilter/FilterBySolutionVersion";
import RoutingRules from "./components/RoutingRules.vue";
import RoutingPlan from "./components/RoutingPlan.vue";
const { id } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  components: {
    FilterByTimePeriod,
    FilterBySolutionVersion,
    RoutingRules,
    RoutingPlan,
  },
  setup(props, { root, emit, refs }) {
    const isOwner = [1020, 2696, 263, 3086, 1686, 1084].includes(
      id
    ); /* 产品要求只有肖赫,王婧,陈东旭有权限,恶心的硬编码 */
    const handelSave = async () => {
      await refs.routingPlan.$refs.planForm.validate();
      await refs.routingPlan.submit("update");
      refs.routingPlan.isDisabled = true;
      isShowSubmitBtn.value = false;
      await refs.routingPlan.$refs.planForm.clearValidate();
      root.$message.success(root.$t("操作成功"));
      reqDetail();
    };
    const isShowSubmitBtn = ref(false);
    const handelEdit = () => {
      refs.routingPlan.isDisabled = false;
      isShowSubmitBtn.value = true;
    };
    const handelCancle = async () => {
      await refs.routingPlan.$refs.planForm.clearValidate();
      refs.routingPlan.isDisabled = true;
      isShowSubmitBtn.value = false;
      reqDetail();
    };
    const loading = ref(false);
    const reqDetail = async () => {
      loading.value = true;
      try {
        const res = await root.$Api.financeManagement.reqProgramInfo(
          root.$route.query.id
        );
        refs.routingPlan.planState = res;
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      refs.routingPlan.isDisabled = true;
      if (["edit", "view"].includes(root.$route.query.type)) {
        reqDetail();
      }
    });
    return {
      tableHeight: window.innerHeight - 355,
      type: root.$route.query.type,
      isShowSubmitBtn,
      loading,
      isOwner,
      handelSave,
      handelEdit,
      handelCancle,
    };
  },
};
</script>
<style scoped lang="scss">
.routing-plan-warp {
  padding-top: 20px;
  position: relative;
  overflow: hidden;

  .fix-footer {
    position: absolute;
    bottom: 10px;
    left: 0px;
    width: 100%;
    height: 50px;
    //     background: #f4f6f9;
    text-align: center;
    line-height: 50px;
  }
}
</style>
