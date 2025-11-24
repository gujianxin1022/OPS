<template>
  <div class="leave-class-info-list-container">
    <el-table
      :key="key"
      height="500px"
      :data="tableData"
      style="width: 100%"
      v-loading="isLoading"
    >
      <el-table-column width="50" fixed align="center" :label="$t('序号')">
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          activeType === LEAVE_CLASS_TYPE.OCCUPANCY ||
          activeType === LEAVE_CLASS_TYPE.USED
        "
        prop="leaveTime"
        :label="$t('调课时间')"
      >
        <template slot-scope="{ row }">
          {{ DateTimeUtils.dateClockTime(row.adjustTime) || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCourseCols.includes(activeType)"
        prop="className"
        :label="$t('使用班级')"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="goClass(row)">
            {{ isEn ? row.className : row.classNameZh }}
          </el-button>
          <el-tag class="mr5" type="danger" v-if="row.ageLabel">
            {{ Filters.ageLabelFilter(row.ageLabel, isEn) }}
          </el-tag>
          <el-tag class="mr5" type="danger" v-if="row.languageLabel">
            {{ Filters.languageLabelFilter(row.languageLabel, isEn) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCourseCols.includes(activeType)"
        prop="name"
        :label="$t('使用课程')"
      >
        <template slot-scope="{ row }">
          {{ isEn ? row.lessonDescEN : row.lessonDescZH }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showCourseCols.includes(activeType)"
        prop="startTime"
        :label="$t('课程时间')"
      >
        <template slot-scope="{ row }">
          {{ DateTimeUtils.dateClockTime(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showTimeCols.includes(activeType)"
        prop="grantTime"
        :label="$t('获取时间')"
      >
        <template slot-scope="{ row }">
          {{ DateTimeUtils.dateClockTime(row.grantTime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showTimeCols.includes(activeType)"
        prop="grantType"
        :label="$t('获取原因')"
      >
        <template slot-scope="{ row }">
          {{ Filters.getSendReasonFilter(row.grantType, isEn) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeType === LEAVE_CLASS_TYPE.FAILURE"
        prop="validEndTime"
        :label="$t('失效时间')"
      >
        <template slot-scope="{ row }">
          {{ DateTimeUtils.dateClockTime(row.validEndTime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeType === LEAVE_CLASS_TYPE.FAILURE"
        prop="reason"
        :label="$t('失效原因')"
      >
        {{ $t("到期失效") }}
      </el-table-column>
      <el-table-column
        v-if="activeType !== LEAVE_CLASS_TYPE.FAILURE"
        prop="validEndTime"
        :label="$t('到期日')"
      >
        <template slot-scope="{ row }">
          {{ DateTimeUtils.dateClockTime(row.validEndTime) }}
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :current-page="pageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  toRefs,
  computed,
  ref,
  reactive,
  watch,
  onMounted,
  unref,
} from "@vue/composition-api";
import { LEAVE_CLASS_TYPE } from "@/utils/constants";
export default defineComponent({
  props: {
    courseType: {
      type: Number,
      defalult: null,
    },
    activeType: {
      type: Number,
      defalult: null,
    },
    studentId: {
      type: Number,
      defalult: null,
    },
  },
  setup(props, { root, emit }) {
    const showTimeCols = [LEAVE_CLASS_TYPE.NO_USE, LEAVE_CLASS_TYPE.FAILURE];
    const showCourseCols = [LEAVE_CLASS_TYPE.OCCUPANCY, LEAVE_CLASS_TYPE.USED];
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const tableData = ref(null);
    const pageState = reactive({
      pageNum: 1,
      pageSize: 50,
      total: 0,
    });

    const isLoading = ref(false);

    const url = computed(() => {
      switch (props.activeType) {
        case LEAVE_CLASS_TYPE.NO_USE:
          return "getNoUseAdjustmentCourseInfoList";
        case LEAVE_CLASS_TYPE.OCCUPANCY:
          return "getOccupyAdjustmentCourseInfoList";
        case LEAVE_CLASS_TYPE.USED:
          return "getUsedAdjustmentCourseInfoList";
        case LEAVE_CLASS_TYPE.FAILURE:
          return "getExpiredAdjustmentCourseInfoList";
      }
    });
    const key = ref(0);
    watch(
      () => props.activeType,
      () => {
        pageState.pageNum = 1;
        getData();
        key.value++;
      }
    );
    const getCurrentPage = (page) => {
      pageState.pageNum = page;
      getData();
    };

    const getPerPage = (perPage) => {
      pageState.pageSize = perPage;
      getData();
    };
    const goClass = (row) => {
      window.open(
        `/groupManagement/classInfo?id=${row.classId}&type=2`,
        "_blank"
      );
    };
    const getData = () => {
      isLoading.value = true;
      const { studentId, courseType } = props;
      root.$Api.studentManagement[unref(url)](
        studentId,
        courseType,
        pageState.pageNum,
        pageState.pageSize
      )
        .then(({ status, data: { code, data } }) => {
          if (code != 200 || status !== 200) return Promise.reject();
          tableData.value = data.list;
          isLoading.value = false;
          pageState.total = data.total;
        })
        .catch(() => {
          tableData.value = [];
          isLoading.value = false;
        });
    };

    onMounted(() => {
      getData();
    });

    return {
      isLoading,
      url,
      LEAVE_CLASS_TYPE,
      ...toRefs(pageState),
      isEn,
      tableData,
      showTimeCols,
      showCourseCols,
      key,
      getData,
      getCurrentPage,
      goClass,
      getPerPage,
    };
  },
});
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
