<template>
  <div class="teacher-slots-type-list">
    <header>
      <el-radio-group v-model="businessLine" @change="resetSearch">
        <el-radio-button :label="1">{{ $t("中文") }}</el-radio-button>
        <el-radio-button :label="2">{{ $t("英文") }}</el-radio-button>
        <el-radio-button :label="3">{{ $t("数学") }}</el-radio-button>
      </el-radio-group>
    </header>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button @click="showAddTypeDialog = true" type="primary">
          {{ $t("新增类型") }}
        </el-button>
      </div>
      <BasicTable
        :key="tableIndex"
        header-cell-class-name="my-theme-color-header"
        border
        v-loading="tableState.loading"
        :data="tableState.data"
        :column="tableState.columns"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        :pagination="true"
        @pagination="handlePaginationChange"
      />
    </custom-card>
    <el-dialog
      :close-on-click-modal="false"
      :title="
        $t('新增教师类型') +
        '-' +
        Filters.getSubjectLabel(businessLine - 1, isEn ? 'en' : 'zh')
      "
      width="400px"
      center
      :visible.sync="showAddTypeDialog"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :label-width="isEn ? '180px' : '140px'"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('类型名称（中文）')" prop="nameZh">
          <el-input
            clearable
            :maxlength="50"
            v-model="ruleForm.nameZh"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('类型名称（英文）')" prop="nameEn">
          <el-input
            clearable
            :maxlength="50"
            v-model="ruleForm.nameEn"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="creatLoading"
            type="primary"
            @click="submitForm('ruleForm')"
            >{{ $t("立即创建") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <TypeConfigDialog
      v-if="dialogVisible"
      :currentRow="currentRow"
      :dialogVisible.sync="dialogVisible"
      @refreshList="resetSearch"
    />
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "@vue/composition-api";
import FilterByTeacherKey from "@/components/FilterItem/TeacherFilter/FilterByTeacherKey";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";
import BasicTable from "@/components/table/basic-table";
import TypeConfigDialog from "./components/TypeConfigDialog.vue";

export default {
  components: {
    FilterByTeacherKey,
    FilterByTeachManager,
    BasicTable,
    TypeConfigDialog,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const businessLine = ref(1);

    /* 创建类型 */
    const ruleForm = reactive({
      nameZh: "",
      nameEn: "",
    });
    const rules = {
      nameZh: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
        {
          min: 1,
          max: 50,
          message: root.$t("长度在 1 到 50 个字符"),
          trigger: "blur",
        },
      ],
      nameEn: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
        {
          min: 1,
          max: 50,
          message: root.$t("长度在 1 到 50 个字符"),
          trigger: "blur",
        },
      ],
    };
    const creatLoading = ref(false);
    const handleClose = () => {
      ruleForm.nameZh = "";
      ruleForm.nameEn = "";
      refs.ruleForm.clearValidate();
      showAddTypeDialog.value = false;
    };
    const submitForm = async (formName) => {
      await refs[formName].validate();
      try {
        creatLoading.value = true;
        await root.$Api.tutorManagement.reqTeacherTypeCreate({
          businessLine: businessLine.value,
          typeNameEn: ruleForm.nameEn,
          typeNameZh: ruleForm.nameZh,
        });
        root.$notify.success({
          message: root.$t("操作成功"),
        });
        resetSearch();
        handleClose()
      } finally {
        creatLoading.value = false;
      }
    };

    const resetSearch = () => {
      tableState.page = 1;
      reqList();
    };
    const reqParams = ref({
      startTime: "",
      endTime: "",
      teacherUsername: "",
      searchType: "1",
    });
    const handleCalendarChange = (val) => {
      reqParams.value.startTime = val[0];
      reqParams.value.endTime = val[1];
      resetSearch();
    };
    const changeSearchType = (type) => {
      reqParams.value.searchType = type;
      resetSearch();
    };
    const changeSearchValue = (val) => {
      reqParams.value.teacherUsername = val;
      resetSearch();
    };
    const tableIndex = ref(0);
    const reqList = async () => {
      let params = {
        pageNum: tableState.page,
        pageSize: tableState.limit,
        businessLine: businessLine.value,
      };
      try {
        tableIndex.value++;
        tableState.loading = true;
        const res = await root.$Api.tutorManagement.reqQueryTeacherTypeList(
          params
        );
        Object.assign(tableState, {
          data: res.list || [],
          total: res.total,
          loading: false,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const tableState = reactive({
      loading: false,
      data: [],
      page: 1,
      limit: 50,
      total: 0,
      columns: computed(() => {
        return [
          {
            label: root.$t("序号"),
            fixed: "left",
            width: "50",
            render: (h, { $index }) =>
              (tableState.page - 1) * tableState.limit + $index + 1,
          },
          {
            fixed: "left",
            label: root.$t("教师类型"),
            minWidth: 100,
            render: (_, { row }) => {
              return (
                <span>{isEn.value ? row.typeNameEn : row.typeNameZh}</span>
              );
            },
          },
          {
            label: root.$t("教师人数"),
            prop: "tutorNum",
            minWidth: 80,
          },
          {
            label: root.$t("添加时间"),
            prop: "createTime",
            width: "150",
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.createTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("添加人"),
            prop: "createUserName",
            minWidth: 100,
          },
          {
            label: root.$t("可教课包"),
            minWidth: 100,
            render: (_, { row }) => {
              return row.packageInfoList && row.packageInfoList.length ? (
                <div>
                  {row.packageInfoList
                    .map((v) => v.coursePackageName)
                    .join(",")}
                  <el-button
                    onClick={() => setTypePackage(row)}
                    style="display:block;margin:0 auto"
                    type="text"
                  >
                    {root.$t("teacherType设置")}
                  </el-button>
                </div>
              ) : (
                <div>
                  {row.teachPackageType === 1 ? (
                    <span>
                      {root.$t("全部")}
                      <el-button
                        onClick={() => setTypePackage(row)}
                        style="display:block;margin:0 auto"
                        type="text"
                      >
                        {root.$t("teacherType设置")}
                      </el-button>
                    </span>
                  ) : (
                    <el-button
                      onClick={() => setTypePackage(row)}
                      style="display:block;margin:0 auto"
                      type="text"
                    >
                      {root.$t("teacherType设置")}
                    </el-button>
                  )}
                </div>
              );
            },
          },
        ];
      }),
    });
    const dialogVisible = ref(false);
    const currentRow = ref({});
    const setTypePackage = (row) => {
      currentRow.value = row;
      dialogVisible.value = true;
    };
    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      reqList();
    };
    const showAddTypeDialog = ref(false);
    const handelBathCreateSuccess = () => {
      showAddTypeDialog.value = false;
      resetSearch();
    };
    onMounted(() => {
      resetSearch();
    });
    return {
      businessLine,
      isEn,
      reqParams,
      handleCalendarChange,
      reqList,
      tableState,
      resetSearch,
      changeSearchType,
      changeSearchValue,
      handlePaginationChange,
      showAddTypeDialog,
      handelBathCreateSuccess,
      tableIndex,
      ruleForm,
      submitForm,
      rules,
      creatLoading,
      dialogVisible,
      currentRow,
      handleClose,
    };
  },
};
</script>
<style lang="scss" scoped>
.teacher-slots-type-list {
  padding: 20px;
  .el-form-item__label {
    padding: 0;
  }
  .my-calendar {
    border: null;
    border-color: #ccc;
    border-width: 1px;
    border-radius: 4px;
    padding: 6px;
    color: #4a5568;
    overflow: hidden;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
}
</style>
