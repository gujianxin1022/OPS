 <template>
  <el-table v-loading='loading' :data="tableData" style="width: 100%" :empty-text="$t('暂无数据')">
    <el-table-column prop="startTime" :label="$t('试听时间')" width="180">
      <template slot-scope="scope">
        {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('试听课程')" width="180">
      <template slot-scope="scope">
        {{ currentLang === "en" ? scope.row.courseEn : scope.row.courseZh }}
      </template>
    </el-table-column>
    <el-table-column prop="tutorUserName" :label="$t('试听老师')">
      <template slot-scope="scope">
        {{ scope.row.tutorUserName }}
      </template>
    </el-table-column>
    <el-table-column prop="address" :label="$t('试听回放')">
      <template slot-scope="scope">
        <el-button
          type="text"
          v-if="scope.row.mp4Url"
          @click="handleOpenVideoPlay(scope.row.mp4Url)"
          >{{ $t("试听回放") }}>></el-button
        >
        <el-button type="text" disabled v-else
          >{{ $t("暂无试听回放") }}>></el-button
        >
      </template>
    </el-table-column>
    <el-table-column prop="address" :label="$t('试听课反馈')">
      <template slot-scope="scope">
        <el-button
          type="text"
          v-if="scope.row.firstReportId"
          @click="
            handleGoFirstCallback(
              scope.row.firstReportId,
              scope.row.classTypeId
            )
          "
          >{{ $t("试听课反馈") }}>></el-button
        >
        <el-button type="text" disabled v-else
          >{{ $t("暂无试听课反馈") }}>></el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
  <script>
import { mapGetters } from "vuex";

export default {
  name: "auditionInformation" /* 试听课信息展示列表 */,
  props: {
    studentLearningPlanId: {
      type: String,
      default: "",
    },
    studentUserId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  mounted() {
    this.getTrailInfo();
  },
  methods: {
    async getTrailInfo() {
      this.loading = true;
      try {
        const {
          status,
          data: { code, data },
        } = await this.$Api.task.getAuditionClassInfo(
          this.studentLearningPlanId,
          this.studentUserId
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        this.tableData = data || [];
      } finally {
        this.loading=false
      }
    },
    handleOpenVideoPlay(mp4Url) {
      window.open(mp4Url);
    },
    handleGoFirstCallback(firstReportId, classTypeId) {
      if (!firstReportId) {
        return;
      }
      window.open(
        `/reportManagement/feedbackAuditSuccessed?reportId=${firstReportId}&classTypeId=${classTypeId}`
      );
    },
  },
};
</script>