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
        <LeftReportInfo
          v-if="judge && unitData"
          :langFlag="langFlag"
          :unitData="unitData"
          :isShowHistory="isShowHistory"
        />
        <div v-else class="leftReportInfo">
          <template v-if="pageData">
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
                  {{ pageData.realName || pageData.studentUserName }} recently
                  completed lesson Level{{ pageData.courseLevel }} Unit{{
                    pageData.unit || pageData.unitNo
                  }}
                  , the unit evaluation. This class is designed to see whether
                  {{ pageData.realName || pageData.studentUserName }} has
                  learned the new skills taught in the previous classes. The
                  scores are based on the teacher's evaluations of
                  {{ pageData.realName || pageData.studentUserName }}'s
                  performance in the lesson.
                  {{ pageData.trealName || pageData.tutorUserName }} has also
                  provided written feedback and tips to keep improving.
                </p>
                <p v-else>
                  恭喜{{
                    pageData.realName || pageData.studentUserName
                  }}完成了Level{{ pageData.courseLevel }} Unit{{
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
                :data="
                  langFlag == 1
                    ? pageData.skillAssessmentZh
                    : pageData.skillAssessmentEn
                "
                border
                style="width: 100%"
                stripe
                :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
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
                  width="250"
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
          </template>
        </div>
      </div>
      <div class="rightSubmit">
        <template v-if="judge">
          <div>
            <h4>{{ $t("单元报告审核") }}</h4>
            <div class="radios">
              <span>{{ $t("审核结论") }}</span>
              <el-radio-group v-model="radio">
                <el-radio :label="3">{{ $t("通过") }}</el-radio>
                <el-radio :label="2">{{ $t("不通过") }}</el-radio>
              </el-radio-group>
            </div>
            <div>
              <p>{{ $t("评语") }}</p>
              <el-input
                type="textarea"
                v-model="remark"
                :rows="10"
                :placeholder="$t('请输入对老师单元报告的评语')"
              ></el-input>
            </div>
            <div class="submitBtns">
              <el-button
                v-show="
                  radio !== 2 &&
                  Per.handleButtonPer(
                    'teach.reportMT.unitReport.urApprovedAndSaved'
                  )
                "
                @click="justSave"
                >{{ $t("preservation") }}</el-button
              >
              <el-button
                v-if="
                  (radio === 2 &&
                    Per.handleButtonPer(
                      'teach.reportMT.unitReport.urReviewFailAndSendToTeacher'
                    )) ||
                  (radio !== 2 &&
                    Per.handleButtonPer(
                      'teach.reportMT.unitReport.urApprovedAndSentToStudents'
                    ))
                "
                type="primary"
                @click="saveAndFeedbackToTeacher"
                >{{
                  radio === 2 ? $t("保存并反馈给老师") : $t("保存并发送给学生")
                }}</el-button
              >
            </div>
          </div>
          <div
            v-if="
              unitData && unitData.unitResult && unitData.unitResult.length > 0
            "
          >
            <!-- <div class="beforeSubmit">
              <p>
                {{ $t("审核结论") }}：<span>{{
                  unitData.unitResult[0].status | mapUnitReportStatus
                }}</span>
              </p>
              <p>
                {{ $t("Reviewer") }}：<span>{{
                  unitData.unitResult[0].examiner
                }}</span>
              </p>
              <p>
                {{ $t("Audit time") }}：<span>{{
                  DateTimeUtils.dateClockTime(
                    unitData.unitResult[0].examineTime
                  )
                }}</span>
              </p>
              <p>{{ $t("评语") }}：</p>
              <p>
                <span>{{ unitData.unitResult[0].remark }}</span>
              </p>
            </div> -->
          </div>
        </template>
        <template v-else>
          <div>
            <h4>{{ $t("单元报告审核") }}</h4>
            <div class="radios">
              <span>{{ $t("审核结论") }}</span>
              <el-radio-group v-model="radio">
                <el-radio :label="3">{{ $t("通过") }}</el-radio>
                <el-radio :label="2">{{ $t("不通过") }}</el-radio>
              </el-radio-group>
            </div>
            <div>
              <p>{{ $t("评语") }}</p>
              <el-input
                type="textarea"
                v-model="remark"
                :rows="10"
                :placeholder="$t('请输入对老师单元报告的评语')"
              ></el-input>
            </div>
            <div class="submitBtns">
              <el-button
                v-show="
                  radio !== 2 &&
                  Per.handleButtonPer(
                    'teach.reportMT.unitReport.urApprovedAndSaved'
                  )
                "
                @click="justSave"
                >{{ $t("preservation") }}</el-button
              >
              <el-button
                v-if="
                  (radio === 2 &&
                    Per.handleButtonPer(
                      'teach.reportMT.unitReport.urReviewFailAndSendToTeacher'
                    )) ||
                  (radio !== 2 &&
                    Per.handleButtonPer(
                      'teach.reportMT.unitReport.urApprovedAndSentToStudents'
                    ))
                "
                type="primary"
                @click="saveAndFeedbackToTeacher"
                >{{
                  radio === 2 ? $t("保存并反馈给老师") : $t("保存并发送给学生")
                }}</el-button
              >
            </div>
          </div>
          <!-- <div v-if="pageData.unitResult && pageData.unitResult.length > 0">
            <div class="beforeSubmit">
              <p>
                {{ $t("审核结论") }}：<span>{{
                  pageData.unitResult[0].status | mapUnitReportStatus
                }}</span>
              </p>
              <p>
                {{ $t("Reviewer") }}：<span>{{
                  pageData.unitResult[0].examiner
                }}</span>
              </p>
              <p>
                {{ $t("Audit time") }}：<span>{{
                  DateTimeUtils.dateClockTime(
                    pageData.unitResult[0].examineTime
                  )
                }}</span>
              </p>
              <p>{{ $t("评语") }}：</p>
              <p>
                <span>{{ pageData.unitResult[0].remark }}</span>
              </p>
            </div>
          </div> -->
        </template>
        <UnitReportRejectRecord
          @showHistoryVersion="showHistoryVersion"
          @reqCurrentAuditedReport="reqCurrentAuditedReport"
          v-if="rejectRecordList.length >= 1"
          :list="rejectRecordList"
          :isAudited="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import {
  getUnitReportDetails,
  auditUnitReport,
  unitReportDdetail,
  getUnitReportEditionType,
  JudgeNewAndOld
} from "@/api/unitReportManagement/";
import AuditedTopMessage from "@/views/reportManagement/unitReportSub/components/auditedTopMessage.vue";
import LeftReportHeader from "@/views/reportManagement/unitReportSub/components/leftReportHeader.vue";
import LeftReportInfo from "@/views/reportManagement/unitReportSub/components/leftReportInfo.vue";
import UnitReportRejectRecord from "@/views/reportManagement/unitReportSub/components/unitReportRejectRecord.vue";




export default {
  name: "audited",
  components: {
    AuditedTopMessage,
    LeftReportHeader,
    LeftReportInfo,
    UnitReportRejectRecord,
  },
  data() {
    return {
      radio: 3,
      remark: "",
      langFlag: 1,
      leftReportHeaderLangList: [],
      pageData: null,
      // 新数据
      unitData: null,
      // 判断
      judge: null,
      isFoundationEdition: false, // 是否是基础版本
      isFoundation: false, //是否是基础版本的新报告数据
      rejectRecordList: [],
      isShowHistory: false,
    };
  },
  computed: {
    ...mapState({
      routesMemoryList: (state) => state.tabs.routesMemoryList,
    }),
  },
  methods: {
    reqCurrentAuditedReport() {
      this.isShowHistory = false;
      this.handleVersion(this.$route.query.version);
    },
    // 查看历史版本报告内容
    showHistoryVersion(params) {
      this.isShowHistory = true;
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
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
    }),
    initData() {
      this.leftReportHeaderLangList = [
        {
          text: this.$t("中文版"),
          value: 1,
        },
        {
          text: this.$t("英文版"),
          value: 2,
        },
      ];
    },
    changeLangFlag(value) {
      this.langFlag = value;
      this.isFoundationEdition && this.reqIsFoundationUnitReport();
    },
    justSave() {
      if (this.remark === "") {
        this.$notify({
          message: this.$t("请输入评语"),
        });
        return;
      } else {
        if (this.judge === true) {
          auditUnitReport({
            unitReportId: this.unitData.id,
            status: 4,
            remark: this.remark,
            // report_result_id: this.pageData.id
          }).then((res) => {
            if (res.data.code === 200) {
              this.$notify({
                message: this.$t("保存成功"),
                type: "success",
              });
              let item, index;
              this.routesMemoryList.forEach((routeItem, routeIndex) => {
                if (routeItem.path === "/reportManagement/audited") {
                  item = routeItem;
                  index = routeIndex;
                }
              });
              this.$store.commit("DELETE_ROUTE", [item, index]);
              this.$router.push("/reportManagement/unitReport");
            }
          });
        } else {
          auditUnitReport({
            unitReportId: this.pageData.id,
            status: 4,
            remark: this.remark,
            // report_result_id: this.pageData.id
          }).then((res) => {
            if (res.data.code === 200) {
              this.$notify({
                message: this.$t("保存成功"),
                type: "success",
              });
              let item, index;
              this.routesMemoryList.forEach((routeItem, routeIndex) => {
                if (routeItem.path === "/reportManagement/audited") {
                  item = routeItem;
                  index = routeIndex;
                }
              });
              this.$store.commit("DELETE_ROUTE", [item, index]);
              this.$router.push("/reportManagement/unitReport");
            }
          });
        }
      }
    },
    saveAndFeedbackToTeacher() {
      if (this.remark === "") {
        this.$notify({
          message: this.$t("请输入评语"),
        });
        return;
      } else {
        if (this.judge === true) {
          auditUnitReport({
            status: this.radio,
            remark: this.remark,
            unitReportId: this.unitData.id,
          }).then((res) => {
            if (res.data.code == 200) {
              this.$notify({
                message: this.$t("保存并发送成功"),
                type: "success",
              });
              let item, index;
              this.routesMemoryList.forEach((routeItem, routeIndex) => {
                if (routeItem.path === "/reportManagement/audited") {
                  item = routeItem;
                  index = routeIndex;
                }
              });
              this.$store.commit("DELETE_ROUTE", [item, index]);
              this.$router.push("/reportManagement/unitReport");
            }
          });
        } else {
          auditUnitReport({
            status: this.radio,
            remark: this.remark,
            unitReportId: this.pageData.id,
          }).then((res) => {
            if (res.data.code == 200) {
              this.$notify({
                message: this.$t("保存并发送成功"),
                type: "success",
              });
              let item, index;
              this.routesMemoryList.forEach((routeItem, routeIndex) => {
                if (routeItem.path === "/reportManagement/audited") {
                  item = routeItem;
                  index = routeIndex;
                }
              });
              this.$store.commit("DELETE_ROUTE", [item, index]);
              this.$router.push("/reportManagement/unitReport");
            }
          });
        }
      }
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
      }
      this.unitData = unitData;
    },
  },
  created() {
    this.initData();
    this.setPageTitle(this.$t("待审核"));
    this.unitReportId = this.$route.query.reportId;
    this.handleVersion(this.$route.query.version);
  },
};
</script>
<style lang="scss" scoped>
.beforeSubmit {
  margin: 10px 0;
  border-top: 2px dotted #cccccc;
  span {
    color: #666;
  }
}
.auditedBottomMessage {
  display: flex;
  overflow-x: auto;
  height: calc(100vh - 104px);
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
      > h4 {
        width: 100%;
        text-align: center;
        font-weight: normal;
        font-size: 16px;
      }
      > p {
        line-height: 24px;
      }
      .textearMesg {
        font-size: 14px;
        line-height: 25px;
        color: #666;
      }
    }
  }
  .rightSubmit {
    width: 400px;
    font-size: 14px;
    padding: 10px 20px;
    background-color: #eee;
    height: 100%;
    overflow-y: scroll;
    h4 {
      width: 100%;
      font-size: 16px;
      text-align: center;
      font-weight: normal;
      margin-bottom: 40px;
    }
    .radios {
      margin-bottom: 30px;
      span {
        margin-right: 20px;
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
