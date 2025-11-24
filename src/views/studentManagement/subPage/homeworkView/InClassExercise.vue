<!-- 课堂练习 -->
<template>
  <div class="in-class-exercise">
    <template v-if="dataInfo">
      <p>
        <a v-if="isFinished" class="link-text" @click.prevent="goStudentReportPage">{{
          $t("查看课堂练习")
          }}</a>
        <span v-else>{{ `${studentName} ${$t("暂未提交作业")}` }}</span>
      </p>
      <p>
        <a class="link-text" @click.prevent="goClassReportPage">{{
          $t("查看班级报告")
          }}</a>
      </p>
    </template>
    <p v-else>
      {{ $t("暂无课堂练习数据") }}
    </p>
  </div>
</template>

<script>
import { goAssessmentPage, getQueryByUrl } from "./helper";

export default {
  data() {
    return {
      dataInfo: null,
    };
  },
  computed: {
    // 学生是否已经完成作业
    isFinished() {
      return this.dataInfo && this.dataInfo.homeworkStatus === 2;
    },
    studentName() {
      return this.$route.query.studentName;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let { lessonId, virtualClassId, studentUserId, classTypeId } =
        this.$route.query;
      this.dataInfo = null;
      // 获取作业信息
      this.$Api.studentManagement.getStudentLiveRoomHomework({
        virtualClassId,
        studentUserId,
        lessonId,
        classTypeId,
      }).then((res) => {
        this.dataInfo = res.data.data;
      });
    },
    goPageCommon(baseUrl, orgUrl, query) {
      // 截取原始url中的参数
      const orgUrlQuery = getQueryByUrl(orgUrl);
      const query2 = {
        ...orgUrlQuery,
        ...query,
        bizType: 2, // 课中
        xlng: this.$i18n.locale,
      };
      const bizId = this.dataInfo.laClassId; // 电子教室roomId
      if (bizId) {
        query2.bizId = bizId;
      }
      goAssessmentPage(baseUrl, query2);
    },
    goPreviewPage() {
      const info = this.dataInfo;
      if (info) {
        // 接口的地址不准确，重新拼接
        this.goPageCommon('/items2', info.assignmentUrl, {
          userId: 'staff', // 预览专用 userId
        });
      }
    },
    goStudentReportPage() {
      const info = this.dataInfo;
      if (info) {
        const { studentUserId } = this.$route.query;
        this.goPageCommon('/report', info.reportUrl, {
          userId: studentUserId,
        });
      }
    },
    goClassReportPage() {
      const info = this.dataInfo;
      if (info) {
        const orgUrl = info.reportUrl || info.assignmentUrl;
        this.goPageCommon('/report/class', orgUrl, {
          userId: 'staff', // 预览专用 userId
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.in-class-exercise {
  padding: 0 20px;
}

.link-text {
  color: #007bff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
