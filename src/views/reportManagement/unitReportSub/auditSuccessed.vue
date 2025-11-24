<template>
  <div class="auditedPageWrapper">
    <!-- 顶部信息 -->
    <AuditedTopMessage :pageData="judge ? unitData : pageData" />
    <!-- 底部信息 -->
    <div class="auditedBottomMessage">
      <div class="leftReport">
        <LeftReportHeader
          :langFlag="langFlag"
          :leftReportHeaderLangList="leftReportHeaderLangList"
          @changeLangFlag="changeLangFlag"
        />
        <!-- 2.0，3.0报告数据 -->
        <LeftReportInfo
          v-if="judge && unitData"
          :langFlag="langFlag"
          :unitData="unitData"
          :isShowHistory="isShowHistory"
        />
        <!-- 1.0,1.1报告数据 -->
        <div v-else class="leftReportInfo">
          <div v-if="pageData">
            <h4>
              {{
                isFoundation
                  ? langFlag === 1
                    ? "单元学习报告"
                    : "Unit Report"
                  : "单元学习报告"
              }}
            </h4>
            <template>
              <template v-if="isFoundation">
                <p v-if="langFlag === 2">
                  {{ pageData.realName }} recently completed lesson Level{{
                    pageData.courseLevel
                  }}
                  Unit{{ pageData.unit || pageData.unitNo }} , the unit
                  evaluation. This class is designed to see whether
                  {{ pageData.realName || pageData.studentUserName }} has
                  learned the new skills taught in the previous classes. The
                  scores are based on the teacher's evaluations of
                  {{ pageData.realName || pageData.studentUserName }}'s
                  performance in the lesson.
                  {{ pageData.trealName || pageData.tutorUserName }} has also
                  provided written feedback and tips to keep improving.
                </p>
                <p v-else>
                  恭喜{{ pageData.realName }}完成了Level{{
                    pageData.courseLevel
                  }}
                  Unit{{
                    pageData.unit || pageData.unitNo
                  }}测评课，本节课旨在考查{{
                    pageData.realName || pageData.studentUserName
                  }}是否具备了前几节课所学习的语言技能。分数是基于老师对{{
                    pageData.realName || pageData.studentUserName
                  }}在课堂上的表现而得出的，老师也根据孩子的学习情况留下了更为详尽与个性化的文字评价，帮助孩子不断进步
                </p>
              </template>
              <p v-else>
                祝贺{{
                  pageData.realName || pageData.studentUserName
                }}小朋友学完了Level{{ pageData.courseLevel }} Unit{{
                  pageData.unit || pageData.unitNo
                }}的全部课程！我们根据孩子这段时间的上课表现和进步情况，提供本单元的学习报告，希望可以让您对孩子的学习情况有更多了解。
              </p>
            </template>
            <div class="unitResult">
              <p>
                {{
                  isFoundation
                    ? langFlag === 1
                      ? "一、单元技能测试结果"
                      : "Part 1 Skills Assessment"
                    : "一、单元技能测试结果"
                }}
              </p>
              <el-table
                stripe
                :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
                :data="
                  langFlag == 1
                    ? pageData.skillAssessmentZh
                    : pageData.skillAssessmentEn
                "
                border
                style="width: 100%"
              >
                <el-table-column
                  prop="skill"
                  :label="
                    isFoundation
                      ? langFlag == 1
                        ? '单元技能'
                        : 'Skills'
                      : '单元技能'
                  "
                  align="center"
                  width="150"
                ></el-table-column>
                <el-table-column
                  v-if="!isFoundation"
                  label="单元学习前"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-rate v-model="scope.row.before" disabled></el-rate>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  align="center"
                  :label="
                    isFoundation
                      ? langFlag == 1
                        ? '技能掌握情况'
                        : 'Performance'
                      : '单元学习后'
                  "
                >
                  <template slot-scope="scope">
                    <el-rate v-model="scope.row.after" disabled></el-rate>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="teacherComments">
              <p>
                {{
                  isFoundation
                    ? langFlag == 1
                      ? "二、学习反馈"
                      : "Part 2 Next Steps"
                    : "二、授课老师点评"
                }}
              </p>
              <div>
                <div>
                  <p>
                    {{
                      isFoundation
                        ? langFlag === 1
                          ? "教师评语"
                          : "Teacher's Feedback"
                        : "课程表现"
                    }}
                  </p>
                  <p
                    class="textearMesg"
                    v-html="pageData.classroomPerformanceZh"
                    v-if="langFlag == 1"
                  ></p>
                  <p
                    class="textearMesg"
                    v-html="pageData.classroomPerformanceEn"
                    v-else
                  ></p>
                </div>
                <div v-if="!isFoundation">
                  <p>提升空间</p>
                  <p
                    class="textearMesg"
                    v-html="pageData.improvementPointZh"
                    v-if="langFlag == 1"
                  ></p>
                  <p
                    class="textearMesg"
                    v-html="pageData.improvementPointEn"
                    v-else
                  ></p>
                </div>
                <div>
                  <p>
                    {{
                      isFoundation
                        ? langFlag === 1
                          ? "学习建议"
                          : "Recommendations"
                        : "学习建议"
                    }}
                  </p>
                  <p
                    class="textearMesg"
                    v-html="pageData.learningSuggestionZh"
                    v-if="langFlag == 1"
                  ></p>
                  <p
                    class="textearMesg"
                    v-html="pageData.learningSuggestionEn"
                    v-else
                  ></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightSubmit">
        <div v-if="judge">
          <h4>{{ $t("单元报告审核") }}</h4>
          <template v-if="unitData">
            <div
              class="beforeSubmit"
              v-if="unitData.unitResult && unitData.unitResult.length > 0"
            >
              <div class="text">
                <p>
                  {{ $t("审核结论") }}：
                  <span>{{
                    unitData.unitResult[0].status | mapUnitReportStatus
                  }}</span>
                </p>
                <p>
                  {{ $t("Reviewer") }}：
                  <span>{{ unitData.unitResult[0].examiner }}</span>
                </p>
                <p>
                  {{ $t("Audit time") }}：
                  <span>{{
                    DateTimeUtils.dateClockTime(
                      unitData.unitResult[0].examineTime
                    )
                  }}</span>
                </p>
              </div>
              <div class="msg">
                <p>{{ $t("评语") }}：</p>
                <div>{{ unitData.unitResult[0].remark }}</div>
              </div>
            </div>
          </template>

          <div
            style="
              text-align: center;
              padding-top: 30px;
              border: 1px solid transparent;
            "
          >
            <button
              style="width: 0px; height: 0px; border: none"
              ref="copyBtn"
              v-clipboard:copy="copyStrings"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></button>
            <el-button
              type="primary"
              size="small"
              class="createBtn"
              @click="createLink"
              v-if="langFlag == 1"
              >{{ $t("复制H5单元报告短链-中文") }}</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="createBtn"
              @click="createLink"
              v-if="langFlag == 2"
              >{{ $t("复制H5单元报告短链-英文") }}</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="createBtn"
              @click="createLink"
              v-if="langFlag == 3"
              >{{ $t("复制H5单元报告短链-法语") }}</el-button
            >
          </div>
        </div>
        <div v-else>
          <h4>{{ $t("单元报告审核") }}</h4>
          <template v-if="pageData">
            <div
              class="beforeSubmit"
              v-if="pageData.unitResult && pageData.unitResult.length > 0"
            >
              <div class="text">
                <p>
                  {{ $t("审核结论") }}：
                  <span>{{
                    pageData.unitResult[0].status | mapUnitReportStatus
                  }}</span>
                </p>
                <p>
                  {{ $t("Reviewer") }}：
                  <span>{{ pageData.unitResult[0].examiner }}</span>
                </p>
                <p>
                  {{ $t("Audit time") }}：
                  <span>{{
                    DateTimeUtils.dateClockTime(
                      pageData.unitResult[0].examineTime
                    )
                  }}</span>
                </p>
              </div>
              <div class="msg">
                <p>{{ $t("评语") }}：</p>
                <div>{{ pageData.unitResult[0].remark }}</div>
              </div>
            </div>
          </template>
          <div
            style="
              text-align: center;
              padding-top: 30px;
              border: 1px solid transparent;
            "
          >
            <button
              style="width: 0px; height: 0px; border: none"
              ref="copyBtn"
              v-clipboard:copy="copyStrings"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></button>
            <el-button
              type="primary"
              size="small"
              class="createBtn"
              @click="createLink"
              v-if="langFlag == 1"
              >{{ $t("复制H5单元报告短链-中文") }}</el-button
            >
            <el-button
              type="primary"
              size="small"
              class="createBtn"
              @click="createLink"
              v-else
              >{{ $t("复制H5单元报告短链-英文") }}</el-button
            >
          </div>
        </div>
        <UnitReportRejectRecord
          @showHistoryVersion="showHistoryVersion"
          v-if="rejectRecordList.length > 1"
          :list="rejectRecordList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import {
  getUnitReportDetails,
  unitReportCopy,
  unitReportDdetail,
  getUnitReportEditionType,
  JudgeNewAndOld,
} from "@/api/unitReportManagement/";
import AuditedTopMessage from "@/views/reportManagement/unitReportSub/components/auditedTopMessage.vue";
import LeftReportHeader from "@/views/reportManagement/unitReportSub/components/leftReportHeader.vue";
import LeftReportInfo from "@/views/reportManagement/unitReportSub/components/leftReportInfo.vue";
import UnitReportRejectRecord from "@/views/reportManagement/unitReportSub/components/unitReportRejectRecord.vue";
export default {
  name: "auditSuccessed",
  components: {
    AuditedTopMessage,
    LeftReportHeader,
    LeftReportInfo,
    UnitReportRejectRecord,
  },
  data() {
    return {
      radio: 3,
      value1: 2,
      langFlag: 1,
      leftReportHeaderLangList: [
        {
          text: "中文版",
          value: 1,
        },
        {
          text: "英文版",
          value: 2,
        },
      ],
      pageData: null,
      unitData: null,
      copyStrings: "",
      unitReportId: "",
      unitLanguage: "",
      judge: null,
      isFoundationEdition: false, // 是否是基础版本
      isFoundation: false, //是否是基础版本的新报告数据
      rejectRecordList: [],
      isShowHistory: false,
    };
  },
  watch: {
    langFlag(newData) {
      switch (newData) {
        case 1:
          this.unitLanguage = "zh";
          break;
        case 2:
          this.unitLanguage = "en";
          break;
        case 3:
          this.unitLanguage = "fr";
          break;
      }
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    // 查看历史版本报告内容
    showHistoryVersion(params) {
      this.isShowHistory = params.index !== 0;
      if (
        params.info.hasOwnProperty("EN") ||
        params.info.hasOwnProperty("CN")
      ) {
        /* 单元报告3.0 */
        this.$set(this.unitData, "historyId", params.id);
      } else {
        if (params.info.reportType == 1 || params.info.reportType == 3) {
          this.HandleVersionOneData(params.info, "history");
        } else {
          this.HandleOtherVersionOneData(params.info, "history");
        }
      }
    },
    async reqISFoundationEdition() {
      const {
        status,
        data: { code, data },
      } = await JudgeNewAndOld(this.$route.query.reportId);
      if (status !== 200 || code !== 200) return Promise.reject();
      this.isFoundationEdition = data === 3; /* data:1 基础版  2其他 */
      this.isFoundationEdition && this.reqIsFoundationUnitReport();
    },
    // 判断是否是基础版且是新数据修改页面展示（出此需求的产品脑子不好，这种需求多了，代码无法维护）
    async reqIsFoundationUnitReport() {
      // 单元技能数组中字段 before（单元学习前评分） = -1则是新数据，否则是旧数据
      let isNewData = false;
      let isEnglishReport = this.langFlag === 2; /*  1 -> 中文   2 -> 英文*/
      let skillAssessment = isEnglishReport
        ? this.pageData.skillAssessmentEn
        : this.pageData.skillAssessmentZh;
      if (skillAssessment === null || skillAssessment.length === 0) {
        this.isFoundation = false;
        return;
      }
      isNewData = skillAssessment.some((e) => {
        if (e.before === -1) return true;
      });
      // 接口判断是否是基础版
      if (!isNewData) return (this.isFoundation = false);
      this.isFoundation = true;
    },
    // 通过版本id查询是否是英文直播课单元报告
    async isEnglishUnitReport(courseEditionId) {
      const {
        status,
        data: { code, data },
      } = await this.$Api.teacherManagement.getUnitReportType({
        courseEditionId: courseEditionId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      return !!data;
    },
    // 通过版本id查询是否是英文直播课单元报告
    async isEnglishUnitReport(courseEditionId) {
      const {
        status,
        data: { code, data },
      } = await this.$Api.teacherManagement.getUnitReportType({
        courseEditionId: courseEditionId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      return !!data;
    },
    onCopy(e) {
      this.$message.success("短链已复制到剪切板！");
    },
    onError(e) {
      this.$message.error("抱歉，复制失败！");
    },
    // 生成h5短链
    createLink() {
      unitReportCopy(this.unitReportId, this.unitLanguage).then((res) => {
        if (res.status === 200 && res.data && res.data.code === 200) {
          this.copyStrings = res.data.data;
          setTimeout(() => {
            this.$refs.copyBtn.click();
          }, 300);
        } else {
          this.$notify.error({
            message: res.data.message,
          });
        }
      });
    },
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
    }),
    changeLangFlag(value) {
      this.langFlag = value;
      this.isFoundationEdition && this.reqIsFoundationUnitReport();
    },
    replaceBr(str) {
      if (str != null) {
        return str.replace(/\n|\r\n/g, "<br>");
      } else {
        return "";
      }
    },
    async handleVersion(version) {
      /* 单元报告版本 1:1.0；2:2.0；3:1.1；4:3.0 */
      if (version == 1 || version == 3) {
        const {
          status,
          data: { code, data },
        } = await getUnitReportDetails(this.unitReportId);
        if (status !== 200 || code !== 200) return Promise.reject();
        this.pageData = data;
        this.HandleVersionOneData(JSON.parse(JSON.stringify(data)));
      } else {
        const {
          status,
          data: { code, data },
        } = await unitReportDdetail(this.unitReportId);
        if (status !== 200 || code !== 200) return Promise.reject();
        this.unitData = data;
        this.HandleOtherVersionOneData(JSON.parse(JSON.stringify(data)));
      }
    },
    /* 处理 1.0；1.1单元报告详情 */
    HandleVersionOneData(pageData, type) {
      this.judge = false;
      if (pageData.unitResult) {
        pageData.unitResult.sort((a, b) => {
          return b.reportResultId - a.reportResultId;
        });
        if (type !== "history") {
          this.reportResultId = pageData.unitResult[0];
          if (this.reportResultId) {
            if (
              this.reportResultId.status ===
              this.ApiConstants.reportPassButNotSend
            ) {
              this.remark = this.reportResultId.remark;
            }
          }
          this.rejectRecordList = pageData.unitResult || [];
        }
      }
      if (type === "history") {
        pageData.unitResult = this.pageData.unitResult || [];
      }
      pageData.skillAssessmentZh &&
        (pageData.skillAssessmentZh = JSON.parse(pageData.skillAssessmentZh));
      pageData.skillAssessmentEn &&
        (pageData.skillAssessmentEn = JSON.parse(pageData.skillAssessmentEn));
      this.reqISFoundationEdition();
      pageData.classroomPerformanceZh = this.replaceBr(
        pageData.classroomPerformanceZh
      );
      pageData.classroomPerformanceEn = this.replaceBr(
        pageData.classroomPerformanceEn
      );
      pageData.improvementPointZh = this.replaceBr(pageData.improvementPointZh);
      pageData.improvementPointEn = this.replaceBr(pageData.improvementPointEn);
      pageData.learningSuggestionZh = this.replaceBr(
        pageData.learningSuggestionZh
      );
      pageData.learningSuggestionEn = this.replaceBr(
        pageData.learningSuggestionEn
      );
      this.pageData = pageData;
    },
    /* 处理 2.0；3.0单元报告详情 */
    async HandleOtherVersionOneData(unitData, type) {
      this.judge = true;
      if (
        await this.isEnglishUnitReport(
          unitData.courseEdition || unitData.editionId
        )
      ) {
        this.leftReportHeaderLangList = [
          {
            text: "英文版",
            value: 2,
          },
          {
            text: "法语版",
            value: 3,
          },
        ];
        this.langFlag = 2;
      }
      unitData.skillAssessmentZh &&
        (unitData.skillAssessmentZh = JSON.parse(unitData.skillAssessmentZh));
      unitData.skillAssessmentEn &&
        (unitData.skillAssessmentEn = JSON.parse(unitData.skillAssessmentEn));
      unitData.performanceAssessmentZh &&
        (unitData.performanceAssessmentZh = JSON.parse(
          unitData.performanceAssessmentZh
        ));
      unitData.performanceAssessmentEn &&
        (unitData.performanceAssessmentEn = JSON.parse(
          unitData.performanceAssessmentEn
        ));
      unitData.knowledgeAssessmentZh &&
        (unitData.knowledgeAssessmentZh = JSON.parse(
          unitData.knowledgeAssessmentZh
        ));
      unitData.knowledgeAssessmentEn &&
        (unitData.knowledgeAssessmentEn = JSON.parse(
          unitData.knowledgeAssessmentEn
        ));
      if (type !== "history") {
        this.rejectRecordList = unitData.unitResult || [];
      } else {
        unitData.unitResult = this.unitData.unitResult || [];
      }
      this.unitData = unitData;
    },
  },
  created() {
    this.unitLanguage = this.currentLang;
    this.setPageTitle("审核通过");
    this.unitReportId = this.$route.query.reportId;
    this.handleVersion(this.$route.query.version);
  },
};
</script>
<style lang="scss" scoped>
.beforeSubmit {
  margin: 15px 0;
  border-top: 2px dotted #ccc;
  span {
    color: #666;
  }
}
.auditedBottomMessage {
  display: flex;
  overflow-x: auto;
  height: calc(100vh - 104px);
  width: 100%;
  .leftReport {
    width: 700px;
    height: 100%;
    background: #f5f5f5;
    font-size: 14px;
    padding: 30px 40px;
    overflow: scroll;
    .leftReportInfo {
      width: 100%;
      display: flex;
      flex-direction: column;
      h4 {
        width: 100%;
        text-align: center;
        font-weight: normal;
        font-size: 16px;
      }
      p {
        line-height: 24px;
      }
      .textearMesg {
        font-size: 14px;
        line-height: 20px;
        color: #666;
      }
    }
  }
  .rightSubmit {
    width: 600px;
    background-color: #eee;
    font-size: 14px;
    padding: 10px 20px;
    overflow: auto;
    .text {
      display: flex;
      flex-direction: column;
      p {
        margin-right: 20px;
      }
    }
    h4 {
      width: 100%;
      font-size: 16px;
      text-align: center;
      font-weight: normal;
      margin-bottom: 40px;
    }
    .msg {
      div {
        line-height: 20px;
        color: rgb(167, 167, 167);
      }
    }
  }
  .submitBtns {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
