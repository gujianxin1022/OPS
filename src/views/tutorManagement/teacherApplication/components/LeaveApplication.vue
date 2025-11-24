<template>
  <div class="leave-application-wrap" v-loading="loading">
    <div class="leave-info">
      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("请假类型") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <span>{{ $t(columnMap.typeStatus[detailInfo.type]) }}</span>
        </el-col></el-row
      >

      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("开始时间") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <span>{{ DateTimeUtils.dateClockTime(detailInfo.startTime) }}</span>
        </el-col></el-row
      >

      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("结束时间") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <span>{{ DateTimeUtils.dateClockTime(detailInfo.endTime) }}</span>
        </el-col></el-row
      >
      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("请假原因") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <span>{{ detailInfo.reasonTypeDesc }}</span>
        </el-col></el-row
      >
      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("详细原因") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <span>{{ detailInfo.reasonDesc }}</span>
        </el-col></el-row
      >
      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("图片上传") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <el-image
            v-show="detailInfo.fileUrl"
            style="width: 150px; height: 150px"
            :src="detailInfo.fileUrl"
            fit="contain"
            :preview-src-list="[detailInfo.fileUrl]"
          ></el-image> </el-col
      ></el-row>
      <el-row :gutter="10">
        <el-col :span="isEn ? 5 : 4" class="label"
          >{{ $t("请假课堂详情") }}:</el-col
        >
        <el-col :span="isEn ? 19 : 20" class="value">
          <BasicTable
            header-cell-class-name="my-theme-color-header"
            :height="tableHeight"
            border
            :data="tableState.data"
            :column="tableState.columns" /></el-col
      ></el-row>
    </div>
    <el-form
      :disabled="detailInfo.examineStatus !== 1"
      :model="formState"
      :rules="rules"
      ref="myForm"
      :label-width="isEn ? '166px' : '130px'"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('审核')" prop="examineStatus">
        <el-radio-group
          @change="
            () => {
              formState.examineReason = '';
            }
          "
          v-model="formState.examineStatus"
        >
          <el-radio :label="2">{{ $t("通过") }}</el-radio>
          <el-radio :label="3">{{ $t("不通过") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="formState.examineStatus === 3"
        :label="$t('原因')"
        prop="examineReason"
      >
        <el-input
          :autosize="{ minRows: 4 }"
          maxlength="200"
          show-word-limit
          type="textarea"
          v-model="formState.examineReason"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button
        v-show="
          propsRow.operationType === 'review' && detailInfo.examineStatus === 1
        "
        @click="submit"
        :loading="submitLoading"
        type="primary"
        >{{ $t("提交审核") }}</el-button
      >
    </div>
  </div>
</template>
<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { columnMap } from "../dataConfig";
import BasicTable from "@/components/table/basic-table";

export default {
  props: {
    row: { type: Object, default: {} },
  },
  components: { BasicTable },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const loading = ref(false);
    const detailInfo = ref({});
    const formState = ref({
      examineStatus: null,
      examineReason: "",
    });
    const rules = {
      examineStatus: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      examineReason: {
        required: true,
        message: root.$t("请输入"),
        trigger: "change",
      },
    };
    const reqLeaveDetail = async () => {
      try {
        loading.value = true;
        const res = await root.$Api.tutorManagement.getTutorLeaveDetail(
          props.row.id
        );
        detailInfo.value = res;
        tableState.data = res.virtualClassList;
        formState.value.examineStatus =
          res.examineStatus === 1 ? null : res.examineStatus;
        formState.value.examineReason = res.examineReason;
      } catch {
        emit("close");
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      reqLeaveDetail();
    });
    const tableState = reactive({
      data: [],
      columns: computed(() => {
        return [
          {
            render: (h, { $index }) => $index + 1,
            width: 50,
            type: "expand",
            render: (h, { row }) => (
              <el-form label-position="left" class="demo-table-expand">
                <el-form-item
                  style="margin-bottom :0px"
                  label={root.$t("班型") + ":"}
                >
                  <span>
                    {root.Filters.mapClassType(row.classTypeId, isEn.value)}
                  </span>
                </el-form-item>
                <el-form-item
                  style="margin-bottom :0px"
                  label={root.$t("课程类型") + ":"}
                >
                  <span>
                    {root.Filters.getCourseType(row.courseType, isEn.value)}
                  </span>
                </el-form-item>
                <el-form-item
                  style="margin-bottom :0px"
                  label={root.$t("课程进度") + ":"}
                >
                  <span>
                    {isEn.value ? row.lessonDescEN : row.lessonDescZH}
                  </span>
                </el-form-item>
                <el-form-item
                  style="margin-bottom :0px"
                  label={root.$t("是否单元课") + ":"}
                >
                  <span>
                    {row.unitReport == 1 ? root.$t("是") : root.$t("否")}
                  </span>
                </el-form-item>
                <el-form-item
                  style="margin-bottom :0px"
                  label={root.$t("交接信息") + ":"}
                >
                  <span>{row.handoverInfo}</span>
                </el-form-item>
              </el-form>
            ),
          },
          {
            label: root.$t("开始时间"),
            prop: "startTime",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.startTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("结束时间"),
            prop: "endTime",
            minWidth: 150,
            render: (_, { row }) => {
              return (
                <span>
                  {row.createTime
                    ? root.DateTimeUtils.dateClockTime(row.endTime)
                    : "-"}
                </span>
              );
            },
          },
          {
            label: root.$t("学生姓名"),
            prop: "parentUserId",
            minWidth: 120,
            render: (h, { row }) =>
              row.classTypeId == 1 ? (
                <el-button type="text">
                  <router-link
                    target="_blank"
                    to={{
                      name: `studentInfo`,
                      query: {
                        studentId: row.studentInfo.id,
                        studentName: row.studentInfo.realName,
                      },
                    }}
                  >
                    {row.studentInfo.realName}
                  </router-link>
                </el-button>
              ) : (
                <div>
                  {row.studentMemberInfoList.map(function (item) {
                    return (
                      <el-button type="text">
                        <router-link
                          target="_blank"
                          to={{
                            name: `studentInfo`,
                            query: {
                              studentId: item.studentInfo.id,
                              studentName: item.studentInfo.realName,
                            },
                          }}
                        >
                          {item.studentInfo.realName}
                        </router-link>
                      </el-button>
                    );
                  })}
                </div>
              ),
          },
        ];
      }),
    });
    const submitLoading = ref(false);
    const submit = async () => {
      await refs["myForm"].validate();
      try {
        submitLoading.value = true;
        await root.$confirm(root.$t("确定要提交审核吗"), root.$t("提示"), {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
          type: "warning",
        });
        await root.$Api.tutorManagement.reqTutorLeaveExamine(
          props.row.id,
          formState.value
        );
        root.$message.success(root.$t("操作成功"));
        emit("refresh");
        emit("close");
      } finally {
        submitLoading.value = false;
      }
    };
    return {
      propsRow: props.row,
      isEn,
      loading,
      detailInfo,
      columnMap,
      tableState,
      formState,
      rules,
      submitLoading,
      submit,
    };
  },
};
</script>
<style scoped lang="scss">
.leave-application-wrap {
  width: 800px;
  height: 100%;
  font-size: 14px;
  padding-right: 10px;
  position: relative;
  .leave-info {
    color: #666666;
    .el-row {
      margin-bottom: 10px;
    }
    .label {
      text-align: right;
    }
  }
  .footer {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
