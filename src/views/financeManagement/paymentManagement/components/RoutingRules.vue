<template>
  <div class="routing-rules-warp">
    <el-button
      v-show="type !== 'view' && isOwner"
      @click="(dialogVisible = true), (handelRulesType = 'add'), resetForm()"
      type="text"
      class="fr mb10"
      >{{ $t("新增路由规则") }}</el-button
    >
    <el-table
      class="routing-rules"
      header-cell-class-name="my-theme-color-header"
      :data="tableState.data"
      row-key="id"
      tooltip-effect="dark"
      :border="false"
      show-overflow-tooltip="true"
      stripe
    >
      <el-table-column align="center" :label="$t('顺序')" width="80" prop="row">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('规则名称')"
        prop="ruleName"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
        align="center"
        min-width="150"
        :label="$t('规则描述')"
        prop="ruleDesc"
      >
      </el-table-column>
      <el-table-column
        align="center"
        min-width="120"
        :label="$t('最近修改时间')"
        prop="updateTime"
      >
        <template slot-scope="scope">
          <span>{{ DateTimeUtils.dateClockTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="80"
        :label="$t('操作人')"
        prop="operationUserName"
      >
      </el-table-column>
      <el-table-column align="center" :label="$t('操作')" min-width="200">
        <template slot-scope="{ row }">
          <el-button type="text" @click="showRuleInfo(row.id, 'edit')">{{
            $t("编辑")
          }}</el-button>
          <el-button type="text" @click="handleDelete(row.id)">{{
            $t("删除")
          }}</el-button>
          <el-button type="text" @click="showRuleInfo(row.id, 'view')">{{
            $t("查看")
          }}</el-button>
          <el-space>
            <span class="handle-target-wrap ml10">
              <img src="../../../../assets/drag.png" class="handle-target"
            /></span>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('路由规则')"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-form
        v-if="dialogVisible"
        :disabled="handelRulesType === 'view'"
        :rules="formRules"
        label-width="140px"
        ref="ruleForm"
        :model="formState"
        v-loading="loading"
      >
        <el-form-item prop="ruleName" :label="$t('规则名称')">
          <el-input
            :maxlength="100"
            :placeholder="$t('请输入')"
            class="w200"
            v-model="formState.ruleName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="ruleDesc" :label="$t('规则描述')">
          <el-input
            :placeholder="$t('请输入')"
            type="textarea"
            :maxlength="250"
            style="width: 375px"
            rows="2"
            v-model="formState.ruleDesc"
          ></el-input>
        </el-form-item>
        <el-form-item prop="conditionReq" :label="$t('设定条件')">
          <SetConditions
            @changeSelect="
              (val) => {
                formState.conditionReq = val;
              }
            "
            ref="conditions"
        /></el-form-item>
        <el-form-item prop="paymentMethodsReqList" :label="$t('设定渠道')">
          <ChannelTable ref="channelTable" />
        </el-form-item>
      </el-form>
      <span
        v-show="handelRulesType !== 'view'"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="submit">{{ $t("确定") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, ref, onMounted, unref } from "@vue/composition-api";
import SetConditions from "./SetConditions.vue";
import ChannelTable from "./ChannelTable.vue";
import Sortable from "sortablejs";
import { deepClone } from "@/utils/handleData";
const { id } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  components: {
    SetConditions,
    ChannelTable,
  },
  setup(props, { root, emit, refs }) {
    const isOwner = [1020, 2696, 263, 3086, 1686, 1084].includes(
      id
    ); /* 产品要求只有肖赫,王婧,陈东旭,王江涛,罗潇艳有权限,恶心的硬编码 */
    const tableState = reactive({
      loading: false,
      data: [],
    });
    const handelRulesType = ref("add");
    const formState = ref({
      programId: root.$route.query.id,
      ruleName: "",
      ruleDesc: "",
      conditionReq: "",
      paymentMethodsReqList: "",
    });
    const validateCondition = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error(root.$t("请完善设定条件")));
      }
      let flag = value.some((e) => {
        return (
          !e.conditionCode.length ||
          !e.conditionOperator.length ||
          !e.conditionValue.length
        );
      });
      if (flag) callback(new Error(root.$t("请完善设定条件")));
    };
    const validateScale = async (rule, value, callback) => {
      let flag = value.some((e) => {
        let scaleNum = 0;
        e.channelReqList.forEach((t) => {
          scaleNum += t.scale - 0;
        });
        return scaleNum !== 0 && scaleNum !== 100;
      });
      if (flag)
        callback(new Error(root.$t("设置的单个支付方式占比总和需等于100%")));
    };
    const formRules = {
      ruleName: {
        required: true,
        message: root.$t("请输入"),
        trigger: "blur",
      },
      ruleDesc: {
        required: true,
        message: root.$t("请输入"),
        trigger: "blur",
      },
      conditionReq: {
        required: true,
        validator: validateCondition,
        trigger: "change",
      },
      paymentMethodsReqList: {
        required: true,
        validator: validateScale,
        trigger: "_",
      },
    };
    const dialogVisible = ref(false);
    const handleClose = () => {
      dialogVisible.value = false;
    };
    const submit = async () => {
      const paymentMethodsReqList = [];
      refs.channelTable.tableState.data.forEach((e) => {
        let item = {
          channelReqList: [],
        };
        item.payMethodId = e.id;
        e.channelRespList.forEach((t) => {
          let tItem = {};
          tItem.payChannelId = t.id;
          tItem.scale = t.scale;
          item.channelReqList.push(tItem);
        });
        paymentMethodsReqList.push(item);
      });
      formState.value.paymentMethodsReqList = paymentMethodsReqList;
      await refs.ruleForm.validate();
      const conditionReq = [];
      refs.conditions.basicConditionList.forEach((e) => {
        switch (e.conditionCode) {
          case "PAYMENT_TYPE":
            if (e.conditionOperator === "in") {
              conditionReq.push({
                isSubScribe: 1,
                termType: 0 /* 条件类型枚举 0:是否支持订阅;1:用户区域 */,
              });
            } else {
              conditionReq.push({ isSubScribe: 0, termType: 0 });
            }
            break;
          case "REGION":
            conditionReq.push({
              termOperations: e.conditionOperator,
              countryList: e.conditionValue,
              termType: 1,
            });
            break;
        }
      });
      formState.value.conditionReq = conditionReq;
      delete formState.value.conditionList;
      handelRulesType.value === "add"
        ? await root.$Api.financeManagement.reqAddRulesOfProgram(
            formState.value
          )
        : await root.$Api.financeManagement.reqUpdateRules({
            ...formState.value,
            rulesId: rulesId.value,
          });
      root.$message.success(root.$t("操作成功"));
      reqRulesDetail();
      dialogVisible.value = false;
    };
    const reqRulesDetail = async () => {
      try {
        const res = await root.$Api.financeManagement.reqRulesOfProgram(
          root.$route.query.id
        );
        Object.assign(tableState, {
          data: res ?? [],
        });
      } finally {
        createRowDrop();
      }
    };
    const rulesId = ref(0);
    const loading = ref(false);
    const showRuleInfo = async (id, type) => {
      rulesId.value = id;
      handelRulesType.value = type;
      loading.value = true;
      const res = await root.$Api.financeManagement.reqRulesInfo(rulesId.value);
      dialogVisible.value = true;
      formState.value = res;
      /* 设定条件回显 */
      const basicConditionList = [];
      res.conditionList.forEach((e) => {
        if (e.hasOwnProperty("countryList")) {
          basicConditionList.push({
            conditionCode: "REGION",
            conditionOperator: e.termOperations,
            conditionValue: e.countryList,
          });
          setTimeout(() => {
            refs.conditions.$refs["region"][0].selectId = e.countryList;
          }, 200);
        } else {
          basicConditionList.push({
            conditionCode: "PAYMENT_TYPE",
            conditionOperator: e.isSubScribe === 1 ? "in" : "notin",
            conditionValue: ["SUBSCRIBE"],
          });
        }
      });
      formState.value.conditionReq = basicConditionList;
      setTimeout(() => {
        refs.conditions.basicConditionList = basicConditionList;
      }, 1);
      /* 占比回显 */
      let channeleMap = {};
      res.paymentMethodsReqList.forEach((e) => {
        let scaleMap = {};
        e.channelRespList.forEach((t) => {
          scaleMap[t.channelName] = t.scale;
        });
        channeleMap[e.payMethodId] = scaleMap;
      });
      setTimeout(async () => {
        refs.channelTable.tableState.data.forEach((e) => {
          e.channelRespList.forEach((t) => {
            t.scale = channeleMap[e.id]?.[t.channelName] * 1 || 0;
          });
        });
        await refs.ruleForm.clearValidate();
        loading.value = false;
      }, 1000);
    };
    const createRowDrop = () => {
      try {
        const tbody = document.querySelector(
          `.routing-rules .el-table__body-wrapper tbody`
        );
        Sortable.create(tbody, {
          handle: ".handle-target",
          animation: 150,
          async onEnd({ newIndex, oldIndex }) {
            if (newIndex === oldIndex) return;
            const copyTableData = deepClone(unref(tableState.data));
            const currentRow = copyTableData.splice(oldIndex, 1)[0];
            await root.$Api.financeManagement.reqSortRules({
              rulesId: currentRow.id,
              sort: newIndex + 1,
            });
            root.$message.success(root.$t("操作成功"));
            copyTableData.splice(newIndex, 0, currentRow);
            Object.assign(tableState, {
              data: copyTableData ?? [],
            });
          },
        });
      } catch (e) {
        console.log(e);
      }
    };
    const resetForm = async () => {
      setTimeout(async () => {
        formState.value = {
          programId: root.$route.query.id,
          ruleName: "",
          ruleDesc: "",
          conditionReq: "",
          paymentMethodsReqList: "",
        };
        refs.conditions.basicConditionList = [
          {
            conditionCode: "",
            conditionOperator: "",
            conditionValue: [],
          },
        ];
        refs.channelTable.tableState.data.forEach((e) => {
          e.channelRespList.forEach((t) => {
            t.scale = 0;
          });
        });
      }, 500);
    };
    const handleDelete = async (rulesId) => {
      await root.$confirm(root.$t("是否确认删除此规则吗?"), root.$t("提示"), {
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
        type: "warning",
      });
      await root.$Api.financeManagement.reqDeleteProgramRules(rulesId);
      root.$message.success(root.$t("操作成功"));
      reqRulesDetail();
    };
    onMounted(() => {
      reqRulesDetail();
    });
    return {
      tableState,
      formState,
      formRules,
      dialogVisible,
      type: root.$route.query.type,
      handelRulesType,
      loading,
      isOwner,
      handleClose,
      submit,
      showRuleInfo,
      resetForm,
      handleDelete,
    };
  },
};
</script>
<style scoped lang="scss">
.routing-rules-warp {
  padding: 20px;
  .handle-target-wrap {
    vertical-align: middle;
    background: #fff;
    .handle-target {
      display: inline-block;
      width: 20px;
      height: 15px;
      position: relative;
      top: 3px;
      cursor: pointer;
      .el-icon-s-operation {
        color: #333;
      }
    }
  }
}
</style>
