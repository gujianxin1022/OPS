<template>
  <!-- 2.0，3.0报告数据 -->
  <div class="leftReportInfo">
    <h4>{{ $t("单元报告") }}</h4>
    <template>
      <!-- 3.0 -->
      <div class="report3-warp" :key="url" v-if="$route.query.version == 4">
        <iframe
          v-if="unitData"
          frameborder="0"
          scrolling="auto"
          style=""
          :src="url"
        />
      </div>
      <!-- 其他 -->
      <div v-else>
        <p>
          祝贺{{
            unitData.realName || unitData.studentUserName
          }}小朋友学完了Level{{ unitData.courseLevel }} Unit{{
            unitData.unit || unitData.unitNo
          }}的全部课程！我们根据孩子这段时间的上课表现和进步情况，提供本单元的学习报告，希望可以让您对孩子的学习情况有更多了解。
        </p>
        <div class="unitResult">
          <p class="unit-center">{{ $t("单元知识点评分") }}</p>
          <el-table
            border
            :data="
              langFlag === 1
                ? unitData.knowledgeAssessmentZh
                : unitData.knowledgeAssessmentEn
            "
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              :label="$t('知识点')"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="content"
              :label="$t('知识点内容')"
              align="center"
            >
              <template slot-scope="scope">
                <p></p>
                <div v-for="(item, index) in scope.row.content" :key="index">
                  {{ item.str }}
                  <p></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              :label="$t('评分')"
              align="center"
              width="100"
            >
            </el-table-column>
          </el-table>
          <p class="unit-center">{{ $t("单元技能表现点评分") }}</p>
          <el-table
            border
            :data="
              langFlag === 1
                ? unitData.skillAssessmentZh
                : unitData.skillAssessmentEn
            "
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              :label="$t('知识点')"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="content"
              :label="$t('知识点内容')"
              align="center"
            >
              <template slot-scope="scope">
                <p></p>
                <div v-for="(item, index) in scope.row.content" :key="index">
                  {{ item.str }}
                  <p></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              :label="$t('评分')"
              align="center"
              width="100"
            >
            </el-table-column>
          </el-table>
          <!-- 学习建议 -->
          <div class="unit-alone">
            {{ $t("学习建议") }}
            <textarea
              :disabled="true"
              v-model="unitData.learningSuggestionZh"
              v-if="langFlag == 1"
              class="textareas"
            ></textarea>
            <textarea
              :disabled="true"
              v-model="unitData.learningSuggestionEn"
              v-else
              class="textareas"
            ></textarea>
          </div>
          <p class="unit-center">{{ $t("课堂表现") }}</p>
          <el-table
            border
            :data="
              langFlag === 1
                ? unitData.performanceAssessmentZh
                : unitData.performanceAssessmentEn
            "
            style="width: 100%"
          >
            <el-table-column
              prop="title"
              :label="$t('知识点')"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="content"
              :label="$t('知识点内容')"
              align="center"
            >
              <template slot-scope="scope">
                <p></p>
                <div v-for="(item, index) in scope.row.content" :key="index">
                  {{ item.str }}
                  <p></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              :label="$t('评分')"
              align="center"
              width="100"
            >
            </el-table-column>
          </el-table>
          <!-- 教师评语 -->
          <div class="unit-alone">
            {{ $t("教师评语") }}
            <textarea
              :disabled="true"
              v-model="unitData.teacherEvaluationZh"
              v-if="langFlag == 1"
              class="textareas"
            ></textarea>
            <textarea
              :disabled="true"
              v-model="unitData.teacherEvaluationEn"
              v-else
              class="textareas"
            ></textarea>
          </div>
          <p>{{ $t("用户反馈") }}</p>
          <p class="unit-Satisfaction">
            {{ $t("单元报告满意度") }}
            <el-rate
              v-if="unitData.courseUnitReportFeedback"
              disabled-void-color="#8B8686"
              v-model="unitData.courseUnitReportFeedback.stars"
              disabled
            ></el-rate>
          </p>
          <p class="unit-Satisfaction">
            {{ $t("反馈内容") }}：<span
              v-if="unitData.courseUnitReportFeedback"
              >{{ unitData.courseUnitReportFeedback.content }}</span
            >
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    unitData: {
      type: Object,
      default: null,
    },
    langFlag: {
      type: Number,
      default: -1,
    },
    isShowHistory: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url: "",
      encryptedId: "",
    };
  },
  watch: {
    langFlag(val) {
      this.reqReport3IframeUrl();
    },
    isShowHistory(val) {
      this.reqReport3IframeUrl();
    },
    historyId(val) {
      this.reqReport3IframeUrl();
    },
  },
  computed: {
    historyId() {
      return this.unitData.historyId;
    },
  },
  async mounted() {
    this.reqReport3IframeUrl();
  },
  methods: {
    async reqReport3IframeUrl() {
      if (this.$route.query.version != 4) return;
      const {
        status,
        data: { code, data },
      } = await this.$Api.unitReportManagement.getReport3Url(
        this.unitData.id,
        this.langFlag === 1 ? "zh" : this.langFlag === 2 ? "en" : "fr"
      );
      if (status !== 200 || code !== 200) return Promise.reject();
      if (this.isShowHistory) {
        this.encryptedId =
          await this.$Api.unitReportManagement.getEncryptionReslut(
            this.unitData.historyId
          );
      }
      this.url = `${data}&status=1&device=phone&historyId=${
        this.isShowHistory ? this.encryptedId : ""
      }`;
    },
  },
};
</script>

<style lang="scss" scoped>
.leftReportInfo {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: scroll;
  > h4 {
    width: 100%;
    text-align: center;
    font-weight: normal;
    font-size: 16px;
  }
  > p {
    line-height: 24px;
  }
  .unit-center {
    text-align: center;
    font-weight: bold;
  }
  .unit-alone {
    margin-top: 20px;
  }
  .unit-Satisfaction {
    font-size: 12px;
    display: flex;
    .el-rate {
      margin-left: 5px;
      font-weight: bold;
    }
    span {
      width: 88%;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .report3-warp {
    width: 500px;
    height: 700px;
    margin: 0 auto;
    iframe {
      background-color: white;
      border: none;
      width: 100%;
      height: 100%;
    }
  }
}
::v-deep .el-table .cell {
  padding-left: 0;
  text-align: center;
  padding-right: 0;
}
hr {
  background-color: #ebeef5;
  border-top: none;
}
.textareas {
  width: 100%;
  height: 100px;
  max-width: 100%;
  max-height: 100px;
  resize: none;
  overflow-y: scroll;
}
.el-table td div {
  text-align: left;
}
</style>
