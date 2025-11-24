<template>
  <div class="interactionJob" v-loading="interactionJobLoading" element-loading-spinner="el-icon-loading"
    element-loading-text="加载中" element-loading-background="rgba(20, 34, 58, 0.8)">
    <div v-if="
      homeworkInfoShow &&
      (homeworkInfo.qmStatus === 6 || homeworkInfo.qmStatus === 7)
    ">
      <section class="msgBox">
        <header class="msgTitle">
          <b class="title">{{ $t("学生信息") }}</b>
        </header>
        <main>
          <dl class="contentBox">
            <dt v-if="currentLang === 'zh'" class="label">{{ $t("学生") }}</dt>
            <dt v-else>{{ $t("homeworkStudent") }}</dt>
            :
            <dd class="contentMsg">{{ studentInfo.studentName }}</dd>
          </dl>
          <dl class="contentBox">
            <dt v-if="currentLang === 'zh'" class="label">{{ $t("课时") }}</dt>
            <dt v-else>{{ $t("homeworkLesson") }}</dt>
            :
            <dd class="contentMsg">{{ studentInfo.lessonName }}</dd>
          </dl>
        </main>
      </section>

      <section class="msgBox">
        <header class="msgTitle">
          <b class="title">{{ $t("完成情况") }}</b>
        </header>
        <main>
          <dl class="contentBox">
            <dt>{{ $t("作业是否完成") }}</dt>
            :
            <dd class="contentMsg">
              <i class="fc">{{
                homeworkInfo.qmStatus === 6 || homeworkInfo.qmStatus === 7
                  ? `${$t("是")}`
                  : `${$t("否")}`
              }}</i>
            </dd>
          </dl>
          <dl v-if="homeworkInfo.finishTime" class="contentBox">
            <dt>{{ $t("作业提交时间") }}</dt>
            :
            <dd class="contentMsg">
              {{ DateTimeUtils.dateClockTimeMin(homeworkInfo.finishTime) }}
            </dd>
          </dl>
          <template v-if="!showInteractiveAssignmentH5">
            <dl class="contentBox">
              <dt>{{ $t("作业练习用时") }}</dt>
              :
              <dd class="contentMsg">
                <i class="fc">{{ homeworkInfo.time }}</i>{{ homeworkInfo.company === 0 ? $t("分钟") : $t("秒") }}
              </dd>
            </dl>
            <dl class="contentBox">
              <dt>{{ $t("题目统计信息") }}</dt>
              :
              <dd v-if="currentLang === 'zh'" class="contentMsg">
                共计{{ homeworkInfo.questionCount }}题，学生作答<i class="fc">{{
                  homeworkInfo.answerCount
                }}</i>次。
              </dd>
              <dd v-else class="contentMsg">
                Total Questions: {{ homeworkInfo.questionCount }}，Attempts
                Made: <i class="fc">{{ homeworkInfo.answerCount }}</i>。
              </dd>
            </dl>
          </template>
          <template v-else>
            <dl class="contentBox">
              <a class="link-text" @click.prevent="goReportPage">{{
                $t("查看答题报告")
              }}</a>
            </dl>
            <dl v-if="!isLearnosity" class="contentBox">
              <a class="link-text" @click.prevent="goAnalysisPage">{{
                $t("查看答题明细和解析")
              }}</a>
            </dl>
          </template>
        </main>
      </section>

      <el-table v-if="!showInteractiveAssignmentH5" :data="tableData" style="width: 100%" max-height="500px"
        :header-cell-style="{
          background: '#f1f1f1',
          color: '#000',
          fontSize: '14px',
        }">
        <el-table-column type="expand">
          <template slot-scope="props">
            <section class="topicInfo">
              <div>{{ getQuestionType(props.row.questionType) }}</div>
              <div>{{ getSubQuestionType(props.row.subQuestionType) }}</div>
              <div v-if="props.row.title">
                <b class="textTitle">{{ $t("题干") }}：</b>
                <span class="textConcent">{{ props.row.title }}</span>
              </div>
              <div>
                <b class="textTitle">{{ $t("正确选项") }}：</b>
                <span class="textConcent">{{ props.row.rightContent }}</span>
              </div>
              <div v-for="(item, key) in props.row.optionDesc.split(',')" :key="key">
                <b class="textTitle">{{ getOption(key) }}：</b>
                <span class="textConcent">{{ item }}</span>
              </div>
            </section>
          </template>
        </el-table-column>
        <el-table-column :label="$t('题号')" prop="questionNum" width="120px">
          <template slot-scope="scope">
            <span v-if="currentLang === 'zh'">第{{ scope.row.questionNum }}题</span>
            <span v-else>Question{{ scope.row.questionNum }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('答对所用次数')" prop="answerCorrectCount" />
        <el-table-column :label="$t('答对用时')" prop="useSecond">
          <template slot-scope="scope">
            <span>{{ scope.row.useSecond }}{{ $t("秒") }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180" align="center" :label="$t('操作')">
          <template slot-scope="scope">
            <el-button type="text" @click="checkDetail(scope.row)">{{
              $t("查看详情")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" style="margintop: 20px" @click="lookOver">{{
        $t("查看完成")
      }}</el-button>
    </div>
    <div v-else class="noData">
      {{
        homeworkInfo.qmStatus === 0
          ? $t("No Assignment Yet")
          : `${studentInfo.studentName} ${$t("暂未提交作业")}`
      }}
    </div>
  </div>
</template>

<script>
import { getStorage } from "@/utils/handleStorage";
import { goAssessmentPage, getQueryByUrl } from "./helper";
export default {
  props: {
    currentLang: { type: String, default: "" },
    studentInfo: { type: Object, default: () => ({}) },
    homeworkType: { type: Number, default: -1 },
    // 学科类型：0-中文，1-英文，2-数学，3-音乐
    subjectType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tableData: [],
      homeworkInfo: {
        qmStatus: 0,
      },
      homeworkInfoShow: false,
      interactionJobLoading: false,
    };
  },
  computed: {
    // 是否是Learnosity作业
    isLearnosity() {
      return this.homeworkInfo?.interactiveHomeworkProvider === 1;
    },
    // 显示H5互动作业
    showInteractiveAssignmentH5() {
      return this.subjectType === 2 || this.isLearnosity;
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    checkDetail(row) {
      window.open(row.redirectUrl);
    },
    initData() {
      let { lessonId, virtualClassId, studentUserId, classTypeId } =
        this.$route.query;
      this.interactionJobLoading = true;
      this.$Api.studentManagement
        .homeworkInfo(
          +virtualClassId,
          +studentUserId,
          +classTypeId,
          +lessonId,
          this.homeworkType
        )
        .then(({ status, data: { code, data } }) => {
          if (code === 200) {
            this.tableData = data?.homeWorkStudentDataDto?.questionInfo;
            this.homeworkInfo = {
              qmStatus: data?.qmStatus,
              finishTime: data?.homeWorkStudentDataDto?.finishTime,
              time: data?.homeWorkStudentDataDto?.time ?? "0",
              questionCount: data?.homeWorkStudentDataDto?.questionCount ?? "0",
              answerCount: data?.homeWorkStudentDataDto?.answerCount ?? "0",
              company: data?.homeWorkStudentDataDto?.company,
              interactiveHomeworkProvider: data?.interactiveHomeworkProvider,
              learnosityActivityId: data?.learnosityActivityId,
            };
            this.homeworkInfoShow = true;
          } else {
            (this.tableData = []), (this.homeworkInfo = {});
          }
        })
        .catch(() => (this.homeworkInfoShow = false))
        .finally(() => (this.interactionJobLoading = false));
    },
    lookOver() {
      this.$router.push({
        path: "/studentManagement/studentInfo",
        query: {
          studentId: this.$route.query.studentUserId,
          studentName: this.$route.query.studentName,
        },
      });
    },
    getOption(key) {
      switch (key) {
        case 0:
          return "A";
        case 1:
          return "B";
        case 2:
          return "C";
        case 3:
          return "D";
        case 4:
          return "E";
        case 5:
          return "F";
      }
    },
    getQuestionType(type) {
      switch (type) {
        case 1:
          return this.$t("单选题");
        case 2:
          return this.$t("多选题");
        case 3:
          return this.$t("跟读题");
        case 4:
          return this.$t("连线题");
        case 7:
          return this.$t("写字题");
        case 17:
          return this.$t("填空题");
        case 3001:
          return this.$t("英文单选");
        case 3003:
          return this.$t("英文跟读");
        case 3004:
          return this.$t("英文连线");
      }
    },
    getSubQuestionType(type) {
      switch (type) {
        case 1:
          return this.$t("听音选字词句");
        case 2:
          return this.$t("看字词句发音");
        case 3:
          return this.$t("连线");
        case 4:
          return this.$t("听音选图");
        case 5:
          return this.$t("看图发字词句音");
        case 6:
          return this.$t("看字词句选图");
        case 7:
          return this.$t("看图填空");
        case 8:
          return this.$t("看图选字词句");
        case 9:
          return this.$t("问答跟读");
        case 10:
          return this.$t("词卡跟读");
        case 11:
          return this.$t("全屏跟读");
        case 12:
          return this.$t("写字");
        case 27:
        case 29:
          return this.$t("拼音跟读");
        case 35:
          return this.$t("听音选句子");
        case 3001:
          return this.$t("英文听音选单词");
        case 3003:
          return this.$t("英文连线");
        case 3004:
          return this.$t("英文听音选图");
        case 3005:
          return this.$t("英文看图发音");
        case 3006:
          return this.$t("英文看字选图");
        case 3007:
          return this.$t("英文看图填空");
        case 3008:
          return this.$t("英文看图选字");
        case 3035:
          return this.$t("英文听音选句");
      }
    },
    getAssignmentPage(path) {
      let { lessonId, virtualClassId, studentUserId, classTypeId } =
        this.$route.query;
      const userInfo = JSON.parse(getStorage("userInfo"));
      const token = userInfo.jwtToken;
      const baseUrl = `${process.env.VUE_APP_H5_URL}/assignment/#`;
      const url = `${baseUrl}${path}?virtualClassId=${virtualClassId}&studentUserId=${studentUserId}&lessonId=${lessonId}&classTypeId=${classTypeId}&token=${token}&source=ops`;
      window.open(url);
    },
    goReportPage() {
      if (this.isLearnosity) {
        const { studentUserId } = this.$route.query;
        this.goLearnosityPage('/report', {
          userId:studentUserId,
        });
      } else {
        this.getAssignmentPage("/report");
      }
    },
    goAnalysisPage() {
      this.getAssignmentPage("/report/analysis");
    },
    goLearnosityPage(path, query) {
      const { lessonId } = this.$route.query;
      const query2 = {
        ...query,
        activityTemplateId: this.homeworkInfo.learnosityActivityId,
        bizId: lessonId, // 课后传lessonId
        bizType: 1, // 课后
        xlng: this.$i18n.locale,
      };
      goAssessmentPage(path, query2);
    },
  },
};
</script>

<style lang="scss" scoped>
.interactionJob {
  .msgBox {
    margin: 0 0 20px;
  }

  .msgTitle {
    padding: 10px 15px;
    background: rgb(240, 239, 239);

    .title {
      font-size: 16px;
    }
  }

  .contentBox {
    display: flex;
    padding: 10px 15px;
    border-bottom: 1px solid rgb(236, 236, 236);

    .label {
      letter-spacing: 4px;
    }
  }

  .topicInfo {
    display: flex;
    // justify-content: space-around;
    flex-wrap: wrap;

    & div {
      margin: 0 30px 10px 0;
    }

    .textTitle {
      float: left;
    }

    .textConcent {
      display: inline-block;
      max-width: 150px;
      white-space: normal;
      word-break: break-all;
    }
  }

  .fc {
    font-style: normal;
    color: rgb(97, 104, 222);
  }

  dl {
    margin: 0;
    padding: 0;
    font-size: 14px;

    dd {
      margin: 0 0 0 15px;
    }
  }

  .noData {
    padding: 20px;
  }
}

.link-text {
  color: #007bff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
