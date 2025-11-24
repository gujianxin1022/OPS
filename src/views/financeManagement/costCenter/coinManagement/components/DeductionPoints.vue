<template>
  <el-dialog
    width="1200px"
    custom-class="deduction-points"
    :title="$t('扣减积分')"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleForm"
      :label-width="isZh ? '100px' : '150px'"
      :inline="true"
      :model="formState"
    >
      <el-form-item
        prop="parentUserId"
        :label="$t('家长ID')"
        :rules="[
          { required: true, validator: validateAccount, trigger: 'blur' },
        ]"
      >
        <el-input
          :placeholder="$t('请输入家长ID')"
          v-model.trim="formState.parentUserId"
        />
      </el-form-item>
      <el-form-item :label="$t('积分余额')">
        <el-input disabled v-model="formState.coinBalance" />
      </el-form-item>
      <el-form-item
        prop="reasonId"
        :label="$t('扣减原因')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :placeholder="$t('请选择扣减原因')"
          v-model="formState.reasonId"
        >
          <el-option
            :key="item.id"
            :label="isZh ? item.describeZh : item.describeEn"
            :value="item.id"
            v-for="item in formState.deductionReasonList"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="remark"
        :label="$t('详细理由')"
        :rules="[
          { required: true, message: $t('请输入'), trigger: 'blur' },
          {
            min: 10,
            trigger: 'blur',
            message: $t('详细原因不得少于10字符'),
          },
        ]"
      >
        <el-input
          :maxlength="100"
          :placeholder="$t('请输入减积分原因（10字符～100字符）')"
          :rows="4"
          type="textarea"
          v-model="formState.remark"
        />
      </el-form-item>
      <el-form-item :label="$t('积分明细')" style="width: 100%" />
    </el-form>
    <el-table :data="tableData" v-loading="tableLoading" height="40vh">
      <el-table-column type="index" width="50" :label="$t('序号')" />
      <el-table-column prop="balance" :label="$t('积分获得')" />
      <el-table-column prop="createTime" :label="$t('获得时间')" />
      <el-table-column
        :prop="isZh ? 'describeZh' : 'describeEn'"
        :label="$t('获得原因')"
      />
      <el-table-column :label="$t('扣减数量')">
        <template slot-scope="{ row }">
          <el-input-number
            :disabled="row.balance <= 0"
            :min="0"
            :max="row.balance"
            :precision="0"
            v-model="row.deductionBalance"
          />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button
        type="primary"
        @click="handleOk"
        :disabled="deductionsTotal === 0"
      >
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from "moment";
import {
  reactive,
  computed,
  toRefs,
  onMounted,
  markRaw,
  nextTick,
} from "@vue/composition-api";
import {
  searchReasonList,
  getParentCoinBalance,
  removeParentCoinBalance,
} from "@/api/financeManagement";
import { ABNORMAL_CODE } from "@/utils/constants";
import { parentIdValidate } from "@/utils/reg.js";

const { id, username } = JSON.parse(localStorage.userInfo);

export default {
  name: "deductionPoints",
  props: {
    visible: { type: Boolean, default: false },
  },
  setup(props, { root, emit, refs }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");

    const formState = reactive({
      oldAccount: null,
      coinBalance: null,
      reasonId: null,
      remark: null,
      parentUserId: null,

      deductionReasonList: [],
    });

    const tableState = reactive({
      tableLoading: false,
      tableData: [],
      deductionsTotal: computed(() =>
        tableState.tableData.reduce((a, b) => (a += b.deductionBalance || 0), 0)
      ),
    });

    const validateAccount = async (_, value, callback) => {
      if (!value) {
        handleResetData();
        return callback(new Error(root.$t("请输入")));
      }
      if(!parentIdValidate(root, formState.parentUserId)){
        handleResetData();
        return;
      }
      if (formState.oldAccount === value) return;
      Object.assign(formState, {
        oldAccount: value,
        coinBalance: null,
        reasonId: null,
        remark: null,
      });
      Object.assign(tableState, {
        tableLoading: true,
        tableData: [],
      });
      nextTick(() => refs.ruleForm.clearValidate());
      try {
        const {
          status,
          data: { code, data },
        } = await getParentCoinBalance({ parentUserId: value });
        if (status !== 200 || code !== 200) {
          handleResetData();
          if (code === ABNORMAL_CODE.pointAccountNotExist) {
            return callback(new Error(root.$t("积分账号不存在")));
          }
          return callback(new Error("家长账号不存在"));
        }
        formState.coinBalance = data.availableCoin ?? "--";
        tableState.tableData = data.coinAccountsBalanceInfoResps.map((v) => ({
          ...v,
          createTime: moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
          deductionBalance: 0,
        }));
        callback();
      } catch {
        handleResetData();
        callback(new Error(root.$t("家长账号不存在")));
      } finally {
        tableState.tableLoading = false;
      }
    };

    const handleResetData = () => {
      formState.coinBalance = null;
      formState.parentUserId = null;
      formState.oldAccount = null;
      tableState.tableData = [];
      tableState.tableLoading = false;
    };

    const handleClose = () => {
      emit("update:visible", false);
      refs.ruleForm.resetFields();
      handleResetData();
    };

    const handleOk = async () => {
      await refs.ruleForm.validate();
      await root.$confirm(
        root.$t("确认扣减$积分").replace("$", tableState.deductionsTotal),
        root.$t("提示"),
        {
          type: "warning",
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
        }
      );
      const { reasonId, remark, parentUserId } = formState;
      const {
        status,
        data: { code },
      } = await removeParentCoinBalance({
        parentUserId,
        reasonId,
        remark,
        updateUserName: username,
        updateUserId: id,
        deductionCoinBalanceReqs: tableState.tableData
          .filter((v) => v.deductionBalance)
          .map((v) => ({
            id: v.id,
            balance: v.balance,
            reason: v.reason,
            deductionBalance: v.deductionBalance,
          })),
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      emit("ok");
      handleClose();
    };

    const queryReasonList = async () => {
      const {
        status,
        data: { code, data },
      } = await searchReasonList(id, { coinMark: 1 });
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.deductionReasonList = markRaw(
        data.filter((v) => v.type === 4 /* 原因类型: 冲红 */)
      );
    };

    onMounted(queryReasonList);

    return {
      isZh,
      formState,
      ...toRefs(tableState),

      validateAccount,
      handleOk,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .deduction-points {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0 !important;
  .el-dialog__body {
    .el-form {
      .el-input,
      .el-textarea {
        width: 200px;
      }
    }
  }
}
</style>
