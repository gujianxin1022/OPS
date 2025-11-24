<template>
  <!-- 任务模板详情 -->
  <div class="task-template-warp" v-loading="loading">
    <el-steps :active="activeStep" align-center>
      <el-step :title="$t('第一部分')"></el-step>
      <el-step :title="$t('第二部分')"></el-step>
      <el-step :title="$t('第三部分')"></el-step>
      <el-step :title="$t('第四部分')"></el-step>
      <el-step :title="$t('第五部分')"></el-step>
    </el-steps>
    <firstStep
      ref="firstStep"
      v-show="activeStep === 0"
      @toNextStep="toNextStep"
    />
    <secondStep
      ref="secondStep"
      v-show="activeStep === 1"
      @toNextStep="toNextStep"
      @toPreStep="toPreStep"
    />
    <thirdStep
      ref="thirdStep"
      v-show="activeStep === 2"
      @toNextStep="toNextStep"
      @toPreStep="toPreStep"
    />
    <fourthStep
      ref="fourthStep"
      v-show="activeStep === 3"
      @toNextStep="toNextStep"
      @toPreStep="toPreStep"
    />
    <fifthStep
      ref="fifthStep"
      v-show="activeStep === 4"
      @handelSubmit="submit"
      @toPreStep="toPreStep"
    />
  </div>
</template>

<script>
import {
  onMounted,
  ref,
  unref,
  computed,
  getCurrentInstance,
} from "@vue/composition-api";
import firstStep from "./components/templateSteps/firstStep.vue";
import secondStep from "./components/templateSteps/secondStep.vue";
import thirdStep from "./components/templateSteps/thirdStep.vue";
import fourthStep from "./components/templateSteps/fourthStep.vue";
import fifthStep from "./components/templateSteps/fifthStep.vue";
import { deepClone } from "@/utils/handleData";
import { withNewTaskTemplate } from "./dataConfig/communicate";

export default {
  data() {
    return {
      isSave: false,
    };
  },
  components: {
    firstStep,
    secondStep,
    thirdStep,
    fourthStep,
    fifthStep,
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const proxy = getCurrentInstance();
    const activeStep = ref(0);
    const routesMemoryList = computed(
      () => root.$store.state.tabs.routesMemoryList
    );
    const deleteTabPage = async () => {
      let item, index;
      const routes = unref(routesMemoryList);
      routes.forEach((routeItem, routeIndex) => {
        if (routeItem.name === "taskTemplate") {
          item = routeItem;
          index = routeIndex;
        }
      });
      root.$notify.success(root.$t("操作成功"));
      await resetForm();
      setTimeout(() => {
        root.$router.push(`/task/taskManagement`);
        root.$store.commit("DELETE_ROUTE", [item, index]);
      }, 800);
      withNewTaskTemplate.value = true;
    };
    /* 重置5部分表单 */
    const resetForm = async () => {
      refs["firstStep"].reset();
      refs["secondStep"].$refs["myForm"].resetFields();
      refs["thirdStep"].reset();
      refs["fourthStep"].reset();
      refs["fifthStep"].$refs["myForm"].resetFields();
      activeStep.value = 0;
    };
    const toNextStep = () => {
      activeStep.value++;
    };
    const toPreStep = () => {
      activeStep.value--;
    };
    const editType = root.$route.query.type;
    const submit = async () => {
      let params = {
        taskInfo: refs.firstStep.finalData,
        targetUser: refs.secondStep.finalData,
        triggerCondition: refs.thirdStep.finalData,
        taskCompletionCondition: refs.fourthStep.finalData,
        otherInformation: refs.fifthStep.finalData,
      };
      if (
        params.taskCompletionCondition.timeLimitMode ==
        2 /* 固定到日期的要校验失效时间设置是否是过去时间 */
      ) {
        let expirationTimeStamp = new Date(
          params.taskCompletionCondition.fixedExpirationTime
        ).getTime();
        let nowStamp = new Date().getTime();
        if (expirationTimeStamp < nowStamp) {
          refs["fifthStep"].loading = false;
          return root.$notify.warning(
            root.$t("第四部分失效时间设定是过去时间,请调整后再保存")
          );
        }
      }
      if (
        params.triggerCondition.triggerType == 2 &&
        params.triggerCondition.circulationMode ==
          2 /* 单一时间触发要校验具体时间设置是否是过去时间 */
      ) {
        let cycleTimeStamp = new Date(
          params.triggerCondition.cycleTime
        ).getTime();
        let nowStamp = new Date().getTime();
        if (cycleTimeStamp < nowStamp) {
          refs["fifthStep"].loading = false;
          return root.$notify.warning(
            root.$t("第三部分具体时间设定是过去时间,请调整后再保存")
          );
        }
      }
      /* 第三部分没有任务生成条件-具体事件没有单元课下课事件的不允许勾选第5部分的单元报告参考信息 */
      if (params.otherInformation.taskReferenceItem.includes("2")) {
        if (
          ![
            2, 3, 22, 23, 24, 41
          ] /* 2:单元课下课;3:偶数单元课下课 ;22:老师填写完单元报告(所有单元课正常下课)23:老师填写完单元报告(偶数单元课正常下课);24:某学科分配后老师首次填写单元报告；41:单元报告低分预警 */
            .includes(params.triggerCondition.event)
        ) {
          refs["fifthStep"].loading = false;
          return root.$notify.warning(
            root.$t(
              "您没有配置单元报告相关的任务生成条件,不能设置[单元报告]任.务参考信息"
            )
          );
        }
      }
      try {
        if (editType === "edit") {
          params.id = root.$route.query.id;
          await root.$Api.taskManagement.reqUpdateTemplate(
            root.$route.query.id,
            params
          );
        } else {
          await root.$Api.taskManagement.reqSubmitAddTemplate(params);
        }
        proxy.data.isSave = true;
        deleteTabPage();
      } finally {
        refs["fifthStep"].loading = false;
      }
    };
    const operationType = ref("");
    const loading = ref(false);
    const getDetail = async () => {
      const { id, type } = root.$route.query;
      operationType.value = type || "add";
      if (id) {
        loading.value = true;
        try {
          const res = await root.$Api.taskManagement.reqTemplateInfo(id);
          setFirstInfo(deepClone(res.taskInfo));
          setSecondInfo(deepClone(res.targetUser));
          setThirdInfo(deepClone(res.triggerCondition));
          setFourthInfo(deepClone(res.taskCompletionCondition));
          setFifthInfo(deepClone(res.otherInformation));
        } finally {
          loading.value = false;
        }
      }
    };
    const setFirstInfo = (taskInfo) => {
      if (operationType.value === "copy") {
        /* 复制模板要清空名称 */
        taskInfo.taskNameCn = "";
        taskInfo.taskNameEn = "";
      }
      refs["firstStep"].firstFormState = taskInfo;
      refs["firstStep"].watchRoleType = taskInfo.roleType;
      refs["firstStep"].$refs["region"].selectId = taskInfo.regionList;
      if (taskInfo.roleType === 3) return;
      setTimeout(() => {
        refs["firstStep"].$refs["department"].defaultNodes =
          taskInfo.postIdList;
        refs["firstStep"].$refs["department"].handleCheckChangeArea();
      }, 100);
    };
    const setSecondInfo = (targetUser) => {
      if (operationType.value === "copy" || operationType.value === "edit") {
        if (targetUser.targetUserGroupId?.length) {
          setTimeout(() => {
            refs["secondStep"].uploadType = targetUser.targetUserType + "";
            refs["secondStep"].$refs["CustomUpload"].fileList = [
              { name: `${targetUser.targetUserGroupId}.xlsx` },
            ];
            refs["secondStep"].$refs["CustomUpload"].targetUserGroupId =
              targetUser.targetUserGroupId;
          }, 100);
        }
      }
      refs["secondStep"].secondFormState = targetUser;
      setTimeout(() => {
        /* 这里要加延迟,不然获取不到basicCondition组建 */
        if (targetUser.basicConditionList?.length) {
          refs["secondStep"].$refs["basicCondition"].basicConditionList =
            targetUser.basicConditionList;
        }
        if (targetUser.behavioralConditionList?.length) {
          refs["secondStep"].$refs[
            "behavioralCondition"
          ].behaviorConditionList = targetUser.behavioralConditionList;
        }
      }, 1000);
    };
    const setThirdInfo = (triggerCondition) => {
      if (triggerCondition.specialConditionList?.length) {
        let idArr = [];
        triggerCondition.specialConditionList.forEach((e) => {
          idArr.push(e.id);
        });
        triggerCondition.specialConditionList = idArr;
      }
      setTimeout(() => {
        refs["thirdStep"].thirdFormState = triggerCondition;
      }, 1000);
    };
    const setFourthInfo = (taskCompletionCondition) => {
      setTimeout(() => {
        refs["fourthStep"].fourthFormState = taskCompletionCondition;
        taskCompletionCondition.completeConfigList[0].contactInformation =
          taskCompletionCondition.completeConfigList[0].contactInformation.split(
            ","
          );
        if (taskCompletionCondition?.completeConfigList?.length >= 2) {
          refs["fourthStep"].showAbnormal = true;
          taskCompletionCondition.completeConfigList[1].contactInformation =
            taskCompletionCondition.completeConfigList[1].contactInformation.split(
              ","
            );
        }
        refs["fourthStep"].fourthFormState.normalCompleteConfig =
          taskCompletionCondition.completeConfigList[0];
        let abCompleteConfig = taskCompletionCondition
          .completeConfigList[1] || {
          contactInformation: [],
          associatedRecord: 1,
          taskCompletionType: 1,
          formItemList: [],
        };
        root.$set(
          refs["fourthStep"].fourthFormState,
          "abnormalCompleteConfig",
          abCompleteConfig
        );
        refs["fourthStep"].$refs["chooseFieldNormal"].setSelectedTable(
          taskCompletionCondition.completeConfigList[0].formItemList || []
        );
        refs["fourthStep"].$refs["chooseFieldAbnormal"].setSelectedTable(
          taskCompletionCondition?.completeConfigList[1]?.formItemList || []
        );
      }, 1000);
    };
    const setFifthInfo = (otherInformation) => {
      otherInformation.taskReferenceItem =
        otherInformation.taskReferenceItem?.split(",") || [];
      refs["fifthStep"].fifthFormState = otherInformation;
    };

    onMounted(() => {
      getDetail();
    });
    return {
      editType,
      isEn,
      activeStep,
      loading,
      toNextStep,
      toPreStep,
      submit,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave) return next();
    this.$confirm(
      this.$t("关闭后将不会保存页面中修改的内容, 确定要关闭并离开该页面吗?"),
      this.$t("交易 - 提示"),
      {
        confirmButtonText: this.$t("离开页面"),
        cancelButtonText: this.$t("继续编辑"),
        type: "warning",
      }
    )
      .then((_) => {
        next();
      })
      .catch((_) => {});
  },
};
</script>
<style lang="scss" scoped>
.task-template-warp {
  padding: 24px;
  font-family: PingFangSC-Semibold, PingFang SC;
}
</style>
