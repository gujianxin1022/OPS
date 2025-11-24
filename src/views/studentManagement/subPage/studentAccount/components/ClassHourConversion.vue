<template>
  <el-dialog
    width="1200px"
    :title="$t('课时转换')"
    :visible="visible"
    :before-close="handleCancel"
  >
    <header class="flex-wrapper flex-row-center">
      <el-radio-group
        v-model="transformType"
        @change="handleTransformTypeChange"
      >
        <el-radio-button :label="STANDARD">
          {{ $t("标准转换") }}
        </el-radio-button>
        <el-radio-button
          :label="SPECIAL"
          v-if="
            Per.handleButtonPer('teach.studentMT.parentInfo.classHourSpecial')
          "
        >
          {{ $t("特殊转换") }}
        </el-radio-button>
      </el-radio-group>
    </header>
    <el-collapse value="">
      <el-collapse-item :title="$t('课程产品等值积分')" name="collapse">
        <div v-for="(item, index) in formState.productList" :key="index">
          {{ isZh ? item.productName : item.productNameEn }} ——
          {{ item.unitCoin }}{{ $t("积分") }}
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-form ref="form" inline label-width="126px" :model="formState">
      <el-form-item
        prop="productIdOut"
        :label="$t('转出产品')"
        :rules="[{ required: true, message: $t(`请选择`), trigger: 'change' }]"
      >
        <el-select
          filterable
          v-model="formState.productIdOut"
          :placeholder="$t('请选择')"
          @change="getCoursePackageIdOut"
        >
          <el-option
            v-for="item in formState.studentProductList"
            :key="item.productId"
            :label="isZh ? item.productName : item.productNameEn"
            :value="item.productId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('可转出课时数')">
        <div>{{ formState.count }}</div>
      </el-form-item>
      <br />
      <el-form-item
        prop="productIdTo"
        :label="$t('转入产品')"
        :rules="[{ required: true, message: $t(`请选择`), trigger: 'change' }]"
      >
        <el-select
          filterable
          v-model="formState.productIdTo"
          :placeholder="$t('请选择')"
          @change="getCoursePackageIdTo"
        >
          <el-option
            v-for="item in formState.productList"
            :key="item.productId"
            :label="isZh ? item.productName : item.productNameEn"
            :value="item.productId"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item
        prop="reasonTransfer"
        :label="$t('转出原因')"
        :rules="[{ required: true, message: $t(`请选择`), trigger: 'change' }]"
      >
        <el-select
          v-model="formState.reasonTransfer"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in formState.reasonList"
            :key="item.id"
            :label="isZh ? item.productName : item.productNameEn"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <BasicTable border stripe :column="columns" :data="tableData" />
    <span slot="footer">
      <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
      <el-button
        type="primary"
        @click="handleOk"
        :loading="submitLoading"
        :disabled="submitDisabled"
      >
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  onMounted,
  ref,
  computed,
  reactive,
  unref,
  watch,
  toRefs,
} from "@vue/composition-api";
import {
  getClassHourReason,
  getClassHourCoin,
  queryStudentClassDetails,
  standardConversionStudentClassHours,
  specialConversionStudentClassHours,
} from "@/api/studentManagement";
import BasicTable from "@/components/table/basic-table";
import moment from "moment";
const STANDARD = 1;
const SPECIAL = 2;
export default {
  name: "ClassHourConversion",
  props: {
    visible: Boolean,
    studentId: String,
    parentUserId: String,
  },
  components: {
    BasicTable,
  },
  setup(props, { root, emit, refs }) {
    const isZh = computed(() => {
      return root.$store.getters.currentLang === "zh";
    });
    const transformType = ref(STANDARD);
    const submitLoading = ref(false);
    const { formState } = useForm(props, { root, refs });
    const { tableState, queryClassHoursDetails } = useTable(
      props,
      { root },
      { transformType, formState }
    );
    const submitDisabled = computed(() =>
      tableState.tableData.every((v) => !v.transferOutClass)
    );

    watch([transformType, () => formState.productIdOut], () => {
      formState.productList.forEach((v) => {
        v.disabled = false;
        if (v.productId !== formState.productIdOut) return;
        v.disabled = unref(transformType) === STANDARD;
      });
    });
    const handleTransformTypeChange = async () => {
      if (transformType.value === 2) {
        formState.productList.push({
          productId: 0,
          coursePackageId: 0,
          productName: "通用试听课时",
          productNameEn: "General Trial",
          unitCoin: 0,
          disabled: false,
        });
      } else {
        formState.productList = formState.productList.filter((item) => {
          return item.productId !== 0;
        });
      }
      refs.form.resetFields();
      [tableState.tableData, formState.count] = [[], "--"];
    };

    const validateEditTable = async () => {
      const { tableData } = tableState;
      if (unref(transformType) === STANDARD) {
        if (tableData.some((v) => v.transferToClass % 1)) {
          root.$notify({
            message: root.$t("转入课时存在小数，无法转换"),
            type: "error",
          });
          return Promise.reject();
        }
      }
      if (unref(transformType) === SPECIAL) {
        if (
          tableData.some(
            (v) =>
              (v.unitPrice && v.transferOutClass && !v.transferToClass) ||
              (!v.transferOutClass && v.transferToClass)
          )
        ) {
          root.$notify({
            message: root.$t("转换课时数信息不完善"),
            type: "error",
          });
          return Promise.reject();
        }
      }
      const { productList, productIdOut, productIdTo } = formState;

      const { totalOut, totalIn } = tableData.reduce(
        (a, b) => ({
          totalIn: (a.totalIn += b.transferToClass),
          totalOut: (a.totalOut += b.transferOutClass),
        }),
        { totalOut: 0, totalIn: 0 }
      );

      if (totalOut > formState.count) {
        root.$notify({
          message: root.$t("转出课时不得大于总课时数"),
          type: "error",
        });
        return Promise.reject();
      }

      const transferOutProd = productList.find(
        (v) => v.productId === productIdOut
      );
      const transferToProd = productList.find(
        (v) => v.productId === productIdTo
      );

      await root.$confirm(
        root.$t("确认将{x}节{m}课程转为{y}节{n}课程吗？", {
          x: totalOut,
          m: unref(isZh)
            ? transferOutProd.productName
            : transferOutProd.productNameEn,
          y: totalIn,
          n: unref(isZh)
            ? transferToProd.productName
            : transferToProd.productNameEn,
        }),
        root.$t("提示"),
        {
          confirmButtonText: root.$t("确定"),
          cancelButtonText: root.$t("取消"),
          type: "warning",
        }
      );
    };

    const handleSubmit = async () => {
      try {
        submitLoading.value = true;
        const {
          productIdOut,
          coursePackageIdOut,
          productIdTo,
          coursePackageIdTo,
          reasonTransfer,
        } = formState;
        const params = {
          studentUserId: +props.studentId,
          productIdOut,
          coursePackageIdOut,
          productIdTo,
          coursePackageIdTo,
          reasonTransfer,
          classDetailsResults: tableState.tableData,
        };
        const {
          status,
          data: { code },
        } =
          unref(transformType) === STANDARD
            ? await standardConversionStudentClassHours(params)
            : await specialConversionStudentClassHours(params);
        if (status !== 200 || code !== 200) return Promise.reject();
        root.$notify.success(root.$t("操作成功"));
      } finally {
        submitLoading.value = false;
      }
    };

    const handleOk = async () => {
      await refs.form.validate();
      await validateEditTable();
      await handleSubmit();
      emit("ok");
      handleCancel();
    };

    const handleCancel = () => {
      refs.form.resetFields();
      formState.count = "--";
      tableState.tableData = [];
      emit("update:visible", false);
    };

    const getCoursePackageIdOut = (val) => {
      const canExchange = formState.productList.some((e) => {
        return e.productId === val;
      });
      if (!canExchange) {
        formState.productIdOut = null;
        tableState.tableData = [];
        root.$notify.error(root.$t("该产品无法转出"));
        return;
      }
      formState.productIdTo = null;
      formState.studentProductList.forEach((item) => {
        if (item.productId === val) {
          return (formState.coursePackageIdOut = item.coursePackageId ?? "");
        }
      });
      queryClassHoursDetails();
    };

    const getCoursePackageIdTo = async (val) => {
      formState.productList.forEach((item) => {
        if (item.productId === val) {
          return (formState.coursePackageIdTo = item.coursePackageId ?? "");
        }
      });
      queryClassHoursDetails();
    };

    return {
      STANDARD,
      SPECIAL,
      isZh,
      submitLoading,
      transformType,
      formState,
      submitDisabled,
      ...toRefs(tableState),
      queryClassHoursDetails,
      handleTransformTypeChange,
      handleCancel,
      handleOk,
      getCoursePackageIdOut,
      getCoursePackageIdTo,
    };
  },
};

const useForm = (props, { root, refs }) => {
  const formState = reactive({
    productIdOut: null,
    coursePackageIdOut: null,
    productIdTo: null,
    coursePackageIdTo: null,
    reasonTransfer: null,
    count: "--",
    studentProductList: [],
    reasonList: [],
    productList: [],
  });

  const queryClassHourReason = async () => {
    const {
      status,
      data: { code, data },
    } = await getClassHourReason();
    if (status !== 200 || code !== 200) return Promise.reject();
    formState.reasonList = data;
  };
  const queryClassHourCoin = async () => {
    const {
      status,
      data: { code, data },
    } = await getClassHourCoin();
    if (status !== 200 || code !== 200) return Promise.reject();
    formState.productList = data;
  };

  // 获取学生拥有产品下拉
  const getStudentProductList = async () => {
    const {
      status,
      data: { code, data },
    } = await root.$Api.studentManagement.getUserAccountProductList(
      props.parentUserId
    );
    if (status !== 200 || code !== 200) return Promise.reject();
    formState.studentProductList = data || [];
  };

  onMounted(() => {
    getStudentProductList();
    queryClassHourReason();
    queryClassHourCoin();
  });

  return {
    formState,
  };
};

const useTable = (props, { root }, { transformType, formState }) => {
  const tableState = reactive({
    columns: [
      { label: root.$t("课时类别"), prop: "typeName" },
      { label: root.$t("课时数"), prop: "balance" },
      { label: root.$t("课时来源"), prop: "sourceName" },
      { label: root.$t("课单价"), prop: "unitPriceCurrency" },
      {
        label: root.$t("原始课单价"),
        width: 120,
        prop: "originalUnitPriceCurrency",
      },
      {
        label: root.$t("当前到期日"),
        prop: "oldExpriedTime",
        width: 200,
        render: (h, { row }) =>
          row.oldExpriedTime &&
          moment(row.oldExpriedTime).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        label: root.$t("转换后到期日"),
        prop: "newExpriedTime",
        width: 200,
        render: (h, { row }) =>
          row.newExpriedTime &&
          moment(row.newExpriedTime).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        fixed: "right",
        label: root.$t("转出课时数->转入课时数"),
        width: 310,
        render: (h, { row }) => {
          return (
            <div>
              <el-input-number
                min={0}
                max={row.balance}
                precision={0}
                value={row.transferOutClass}
                disabled={row.balance <= 0}
                onChange={(value) => handleTransferOutClassChange(value, row)}
              />
              <span style="margin: 0 8px">{"->"}</span>
              <el-input-number
                min={0}
                precision={unref(transformType) === STANDARD ? void 0 : 0}
                disabled={unref(transformType) === STANDARD || row.balance <= 0}
                value={row.transferToClass}
                onChange={(value) => handleTransferToClassChange(value, row)}
              />
            </div>
          );
        },
      },
    ],
    tableData: [],
    tableLoading: false,
  });

  const handleTransferOutClassChange = async (value, row) => {
    value ||= 0;
    row.transferOutClass = value;
    if (unref(transformType) === SPECIAL) return;
    const { unitCoin: unitCoin_in } = formState.productList.find(
      (v) => v.productId === formState.productIdTo
    );
    const { unitCoin: unitCoin_out } = formState.productList.find(
      (v) => v.productId == formState.productIdOut
    );
    row.transferToClass = +(
      Math.round(((value * unitCoin_out) / unitCoin_in) * 10) / 10
    ).toFixed(1);
  };

  const handleTransferToClassChange = (value, row) => {
    row.transferToClass = value || 0;
  };

  const queryClassHoursDetails = async () => {
    [tableState.tableData, formState.count] = [[], "--"];
    try {
      tableState.tableLoading = true;
      const {
        status,
        data: { code, data },
      } = await queryStudentClassDetails({
        studentUserId: props.studentId,
        coursePackageId: formState.coursePackageIdOut, // productIdOut
        convertProductId: formState.productIdTo,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      tableState.tableData = data.classDetailsResults.map((v) => ({
        ...v,
        transferToClass: 0,
        transferOutClass: 0,
      }));
      formState.count = data.count;
    } finally {
      tableState.tableLoading = false;
    }
  };

  return {
    tableState,
    queryClassHoursDetails,
  };
};
</script>

<style lang="scss" scoped>
.el-collapse {
  margin: 16px 0;
}
::v-deep .el-collapse-item__header {
  background: #f4e6fd;
  padding-left: 16px;
}
::v-deep .el-collapse-item__content {
  display: flex;
  flex-wrap: wrap;
  background: #f4e6fd;
  padding-left: 16px;
  div {
    width: 50%;
  }
}
</style>
