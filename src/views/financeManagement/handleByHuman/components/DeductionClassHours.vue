<template>
  <el-dialog
    custom-class="deduction-calss-hours"
    width="1200px"
    :title="$t('扣减课时')"
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
      <el-form-item
        prop="studentUserId"
        :label="$t('选择学生')"
      >
        <el-select
          clearable
          :placeholder="$t('请选择')"
          v-model="formState.studentUserId"
          @change="handleStudentChange"
        >
          <el-option
            :key="item.id"
            :label="item.realName"
            :value="item.id"
            v-for="item in formState.studentList"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="coursePackageId"
        :label="$t('课程包名称')"
        :rules="[{ required: true, message: $t('请选择'), trigger: 'change' }]"
      >
        <el-select
          :placeholder="$t('请选择课程包')"
          v-model="formState.coursePackageId"
          @change="handleProductChange"
        >
          <el-option
            v-for="item in formState.productTypeList"
            :key="item.coursePackageId"
            :label="isZh ? item.coursePackageName : item.coursePackageNameEn"
            :value="item.coursePackageId"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('课时总数')">
        <el-input
          disabled
          v-model="formState.classHoursBalance"
        />
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
          :style="{ width: isZh ? '515px' : '565px' }"
          :maxlength="100"
          :placeholder="$t('请输入减课时原因（10字符～100字符）')"
          :autosize="{ minRows: 1, maxRows: 3 }"
          type="textarea"
          v-model="formState.remark"
        />
      </el-form-item>
      <el-form-item
        :label="$t('课时明细')"
        style="width: 100%"
      />
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      height="45vh"
    >
      <el-table-column
        prop="id"
        width="110px"
        :label="$t('课时明细ID')"
      />
      <el-table-column
        prop="typeName"
        width="110px"
        :label="$t('课时类别')"
      />
      <el-table-column
        prop="balance"
        width="100px"
        :label="$t('课时数')"
      />
      <el-table-column
        prop="sourceName"
        width="100px"
        :label="$t('课时来源')"
      />
      <el-table-column
        prop="unitPriceCurrency"
        width="100px"
        :label="$t('课单价')"
      />
      <el-table-column
        width="130px"
        prop="originalUnitPriceCurrency"
        :label="$t('原始课单价')"
      />
      <el-table-column
        prop="costFirstNameZh"
        width="140px"
        :label="$t('一级成本名称')"
      />
      <el-table-column
        prop="costSecondNameZh"
        width="150px"
        :label="$t('二级成本名称')"
      />
      <el-table-column
        prop="describeZh"
        width="140px"
        :label="$t('中文描述')"
      />
      <el-table-column
        prop="createTime"
        width="140px"
        :label="$t('获得时间')"
      />
      <el-table-column
        :label="$t('扣减数量')"
        fixed="right"
        width="140px"
      >
        <template slot-scope="{ row }">
          <el-input-number
            :disabled="
              row.balance <= 0 ||
              (formState.reasonId === ZeroPointFiveReaSonId &&
                !(row.balance % 1)) ||
              (formState.reasonId !== ZeroPointFiveReaSonId && row.balance % 1)
            "
            :min="0"
            :max="
              formState.reasonId === ZeroPointFiveReaSonId ? 0.5 : row.balance
            "
            :precision="formState.reasonId === ZeroPointFiveReaSonId ? 1 : 0"
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
  watch,
} from "@vue/composition-api";
import {
  searchReasonList,
  getClassHoursBalanceById,
  removeParentClassHoursBalance,
  getStudentListByParentId,
} from "@/api/financeManagement";
import { getStudentProductList } from "@/api/studentManagement";

const { id, username } = JSON.parse(localStorage.userInfo);

const ZeroPointFiveReaSonId = 10185;

export default {
  name: "deductionClassHours",
  props: {
    visible: { type: Boolean, default: false },
  },
  setup (props, { root, emit, refs }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");

    const formState = reactive({
      oldAccountIsError: false,
      studentUserId: null,
      parentUserId: null,
      coursePackageId: null,
      classHoursBalance: null,
      reasonId: null,
      remark: null,
      studentList: [],
      productTypeList: [],
      deductionReasonList: [],
    });

    const tableState = reactive({
      tableLoading: false,
      tableData: [],
      deductionsTotal: computed(() =>
        tableState.tableData.reduce((a, b) => (a += b.deductionBalance || 0), 0)
      ),
    });

    watch(
      () => formState.reasonId,
      (val, oldVal) => {
        if (val === ZeroPointFiveReaSonId || oldVal === ZeroPointFiveReaSonId) {
          tableState.tableData.forEach((v) => {
            v.deductionBalance = 0;
          });
        }
      }
    );

    const validateAccount = async (_, value, callback) => {
      if (!value) {
        handleResetData();
        return callback(new Error(root.$t("请输入")));
      }
      if(!/^[0-9]{10,}$/.test(value)){
          return callback(new Error(root.$t("账号不存在或格式错误")));
        }
      await nextTick();
      refs.ruleForm.clearValidate();
      try {
        await getStudentList(value);
      } catch {
        handleResetData();
        formState.oldAccountIsError = true;
        return callback(new Error(root.$t("家长账号不存在")));
      }
    };

    const getStudentList /* 学生列表 */ = async (value) => {
      const {
        status,
        data: { code, data },
      } = await getStudentListByParentId({parentUserId:value, status:1});
      if (status !== 200 || code !== 200 || data.length <= 0) return Promise.reject();
      formState.studentList = markRaw(data);
    };

    const getProductTypeList /* 产品类型列表 */ = async () => {
      const { parentUserId, studentUserId } = formState;
      const {
        status,
        data: { code, data },
      } = await getStudentProductList({ parentUserId, studentUserId });
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.productTypeList = markRaw(data || []);
    };

    const handleStudentChange = () => {
      Object.assign(formState, {
        classHoursBalance: null,
        coursePackageId: null,
        productTypeList: [],
      });
      tableState.tableData = [];
      getProductTypeList();
    };

    const handleProductChange = async () => {
      try {
        formState.classHoursBalance = null;
        Object.assign(tableState, { tableData: [], tableLoading: true });
        const { parentUserId, coursePackageId, studentUserId } = formState;
        const {
          status,
          data: { code, data },
        } = await getClassHoursBalanceById({
          parentUserId,
          coursePackageId,
          studentUserId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        formState.classHoursBalance = data.count ?? "--";
        formState.parentUserId = data.parentUserId;
        tableState.tableData = data.classDetailsInfoResps.map((v) => ({
          ...v,
          createTime: moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
          deductionBalance: 0,
        }));
      } finally {
        tableState.tableLoading = false;
      }
    };

    const handleResetData = () => {
      Object.assign(formState, {
        oldAccountIsError: false,
        parentUserId: null,
        studentUserId: null,
        classHoursBalance: null,
        studentList: [],
        productTypeList: [],
      });
      refs.ruleForm.resetFields();
      Object.assign(tableState, { tableData: [], tableLoading: false });
    };

    const handleClose = () => {
      emit("update:visible", false);
      handleResetData();
    };

    const verifyDecimal = async () => {
      return new Promise((resolve, reject) => {
        const rows = tableState.tableData.filter((v) => v.deductionBalance);
        if (
          formState.reasonId === ZeroPointFiveReaSonId &&
          rows.some(
            (v) =>
              (!(v.balance % 1) && v.deductionBalance) ||
              (v.balance % 1 && v.deductionBalance !== 0.5)
          )
        ) {
          root.$notify({
            message: root.$t("只允许扣减0.5课时"),
            type: "error",
          });
          return reject();
        }
        if (
          formState.reasonId !== ZeroPointFiveReaSonId &&
          rows.some((v) => v.deductionBalance % 1)
        ) {
          root.$notify({
            message: root.$t("整数课时不允许扣减小数"),
            type: "error",
          });
          return reject();
        }
        resolve();
      });
    };

    const handleOk = async () => {
      await refs.ruleForm.validate();
      await verifyDecimal();
      await root.$confirm(
        root.$t("确认扣减$课时").replace("$", tableState.deductionsTotal),
        root.$t("提示"),
        {
          type: "warning",
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
        }
      );
      const { parentUserId, coursePackageId, reasonId, remark, studentUserId } =
        formState;
      const {
        status,
        data: { code },
      } = await removeParentClassHoursBalance({
        parentUserId,
        studentUserId,
        coursePackageId,
        reasonId,
        remark,
        createUserName: username,
        createUserId: id,
        classHourDetailsReqs: tableState.tableData
          .filter((v) => v.deductionBalance)
          .map((v) => ({
            id: v.id,
            accountClass: v.accountClass,
            balance: v.balance,
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
      } = await searchReasonList(id, { lessonMark: 1 });
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.deductionReasonList = markRaw(
        data.filter((v) => v.type === 4 /* 原因类型: 冲红 */)
      );
    };

    onMounted(queryReasonList);

    return {
      isZh,
      ZeroPointFiveReaSonId,
      formState,

      ...toRefs(tableState),

      validateAccount,
      handleStudentChange,
      handleProductChange,
      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .deduction-calss-hours {
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
    .el-table .cell {
      text-overflow: clip;
    }
  }
}
</style>
