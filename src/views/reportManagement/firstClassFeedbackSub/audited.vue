<template>
  <div class="auditedPageWrapper" v-loading="loading">
    <!-- 顶部信息 -->
    <div class="auditedTopMessage">
      <div>
        <p>
          {{ $t("提交老师") }}：
          <span>{{ pageData.tutorRealName }}</span>
        </p>
        <p>
          {{ $t("my-home-Student") }}：
          <span>{{ pageData.studentRealName }}</span>
        </p>
        <p>
          {{ $t("schedule-Class Time") }}：
          <span>{{ DateTimeUtils.dateClockTime(pageData.startTime) }}</span>
        </p>
      </div>
      <div>
        <p>
          {{ $t("Teacher's telephone") }}：
          <span>{{ pageData.tutorPhone }}</span>
        </p>
        <p>
          {{ $t("my-home-Parent") }}：
          <span>{{ pageData.parentUserName }}</span>
        </p>
        <p>
          {{ $t("my-home-2-Lesson Detail") }}：
          <span>
            {{ pageData.courseEditionId | mapEdtion }}
            Level{{ pageData.courseLevel }} Lesson{{ pageData.lessonNo }}</span
          >
        </p>
      </div>
      <div>
        <p>
          {{ $t("my-home-Submission Time") }}：
          <span>{{ DateTimeUtils.dateClockTime(pageData.submitTime) }}</span>
        </p>
        <p>
          {{ $t("提交次数") }}：
          <span>{{ pageData.submitCount }}</span>
        </p>
        <p>
          {{ $t("课程顾问") }}：
          <span>{{ pageData.adviserUserName }}</span>
        </p>
      </div>
      <div>
        <p>
          {{ $t("my-home-student-Gender") }}：
          <span>{{ pageData.studentGender === 1 ? "男" : "女" }}</span>
        </p>
        <p>
          {{ $t("my-home-Age") }}：
          <span>{{ pageData.studentAge }}岁</span>
        </p>
      </div>
    </div>
    <!-- 底部信息 -->
    <div class="auditedBottomMessage">
      <div class="leftReport">
        <div class="leftReportHeader">
          <div class="headerLangBtns" v-if="templateType === 'old'">
            <span
              v-for="item in leftReportHeaderLangList"
              :key="item.value"
              :class="{ active: item.value === langFlag }"
              @click="changeLangFlag(item.value)"
              >{{ item.text }}</span
            >
          </div>
        </div>
        <div class="leftReportInfo" v-if="templateType === 'new'">
          <p>
            恭喜{{
              pageData.studentRealName
            }}完成第一节课，我们根据孩子上课表现，提供本次课的学习报告，帮助您更多的了解孩子学习情况及中文水平。
          </p>
          <p v-if="pageData.suggestInfo">
            建议级别：<span style="color: red; display: inline"
              >{{ pageData.suggestInfo }}</span
            >
          </p>
          <div class="course-knowledge-point">
            <p class="title-name">一、课程知识点</p>
            <div class="content">
              <template v-if="pageData.knowledgePointList">
                <p
                  class="color666"
                  v-for="(item, index) in pageData.knowledgePointList"
                  :key="index"
                >
                  · {{ item.knowledgePoint }}
                </p>
              </template>
              <template v-else>
                <p class="color666">无</p>
              </template>
              <div class="summary">
                <p class="title">总结或补充：</p>
                <p class="color666">{{ pageData.knowledgeDesc }}</p>
              </div>
            </div>
          </div>
          <div class="ability-assessment">
            <p class="title-name">二、能力评估</p>
            <div class="content">
              <p
                class="ability-item"
                v-for="(item, index) in powerAssessmentList"
                :key="index"
              >
                <span class="color666">{{ item.starName }}</span>
                <el-rate
                  v-model="item.starVal"
                  disabled
                  disabled-void-color="#caced4"
                ></el-rate>
              </p>
            </div>
          </div>
          <div v-if="pageData.versions === 1" class="class-performance">
            <p class="title-name">三、课堂表现反馈</p>
            <div class="content color666">
              <span class="ib">课堂表现</span>
              <el-radio-group
                v-model="classPerformanceObj['课堂表现']"
                disabled
              >
                <el-radio :label="1">活跃</el-radio>
                <el-radio :label="2">中等</el-radio>
                <el-radio :label="3">安静</el-radio>
              </el-radio-group>
            </div>
            <div class="content color666">
              <span class="ib">配合度</span>
              <el-radio-group v-model="classPerformanceObj['配合度']" disabled>
                <el-radio :label="1">配合</el-radio>
                <el-radio :label="2">中等</el-radio>
                <el-radio :label="3">不配合</el-radio>
              </el-radio-group>
            </div>
            <div class="content color666">
              <span class="ib">学生基础</span>
              <el-radio-group
                v-model="classPerformanceObj['学生基础']"
                disabled
              >
                <el-radio :label="1">较高</el-radio>
                <el-radio :label="2">中等</el-radio>
                <el-radio :label="3">较低</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 荣誉 -->
          <div v-if="pageData.versions === 2">
            <p class="title-name">三、课堂表现</p>
            <div class="content color666">
              <span class="mr20" v-for="item in honorList" :key="item">{{
                item
              }}</span>
            </div>
          </div>
          <p class="copywriting">{{ pageData.lessionShowOtherDesc }}</p>
          <el-divider></el-divider>
          <div class="internal-feedback">内部反馈（以下内容家长不可见）</div>
          <template v-if="pageData.versions !== 2">
            <div class="parent-communication">
              <p class="title-name">家长沟通情况：</p>
              <div class="content">
                <el-radio-group v-model="pageData.userParentTalkLevel" disabled>
                  <el-radio :label="1">极难沟通</el-radio>
                  <el-radio :label="2">较难沟通</el-radio>
                  <el-radio :label="3">适中</el-radio>
                  <el-radio :label="4">较易沟通</el-radio>
                  <el-radio :label="5">好沟通</el-radio>
                </el-radio-group>
                <p>{{ pageData.userParentTalkOther }}</p>
              </div>
            </div>
            <div class="parent-communication">
              <p class="title-name">学生性格、家庭背景：</p>
              <div class="content">
                {{ pageData.studentParentOtherDesc }}
              </div>
            </div>
          </template>
          <div class="parent-communication">
            <p class="title-name">其他反馈：</p>
            <div class="content">
              {{ pageData.otherDesc }}
            </div>
          </div>
        </div>
        <div class="leftReportInfo" v-else>
          <h4>首次课报告</h4>
          <p>
            祝贺{{
              pageData.studentRealName
            }}小朋友在LingoAce完成了首次课的学习！
          </p>
          <div class="unitResult">
            <p>一、给学生家长的反馈</p>
            <div>
              <p>本次课文选用</p>

              <p class="textearMesg" v-if="langFlag === 1">
                <span v-html="pageData.courseInfoZh"></span>
              </p>
              <p class="textearMesg" v-else>
                <span v-html="pageData.courseInfoEn"></span>
              </p>
            </div>
            <div>
              <p>核心知识点与课堂要求</p>
              <p class="textearMesg" v-if="langFlag === 1">
                <span v-html="pageData.coreKnowledgeZh"></span>
              </p>
              <p class="textearMesg" v-else>
                <span v-html="pageData.coreKnowledgeEn"></span>
              </p>
            </div>
            <div>
              <p>补充知识点</p>
              <p class="textearMesg" v-if="langFlag === 1">
                <span v-html="pageData.addKnowledgeZh"></span>
              </p>
              <p class="textearMesg" v-else>
                <span v-html="pageData.addKnowledgeEn"></span>
              </p>
            </div>
            <div>
              <p>本次课堂反馈</p>
              <span>{{
                langFlag === 1
                  ? pageData.classroomFeedBackZh
                  : pageData.classroomFeedBackEn
              }}</span>
            </div>
            <div>
              <p>二、给LingoAce的反馈</p>
              <p>与家长沟通及建议</p>
              <p class="textearMesg" v-if="langFlag === 1">
                <span v-html="pageData.communicationSuggestionZh"></span>
              </p>
              <p class="textearMesg" v-else>
                <span v-html="pageData.communicationSuggestionEn"></span>
              </p>
            </div>
            <div>
              <p>建议教材等级与课时</p>
              <p class="textearMesg" v-if="langFlag === 1">
                <span v-html="pageData.suggestCourseInfoZh"></span>
              </p>
              <p class="textearMesg" v-else>
                <span v-html="pageData.suggestCourseInfoEn"></span>
              </p>
            </div>
          </div>
          <div class="teacherComments">
            <div>
              <div>
                <p>学生性格</p>
                <p class="textearMesg" v-if="langFlag === 1">
                  <span v-html="pageData.studentCharacterZh"></span>
                </p>
                <p class="textearMesg" v-else>
                  <span v-html="pageData.studentCharacterEn"></span>
                </p>
              </div>
              <div>
                <p>学生其他背景</p>
                <p class="textearMesg" v-if="langFlag === 1">
                  <span v-html="pageData.studentBackgroundZh"></span>
                </p>
                <p class="textearMesg" v-else>
                  <span v-html="pageData.studentBackgroundEn"></span>
                </p>
              </div>
              <div>
                <p>需要课程顾问协助</p>
                <p class="textearMesg" v-if="langFlag === 1">
                  <span v-html="pageData.advisorAssistanceZh"></span>
                </p>
                <p class="textearMesg" v-else>
                  <span v-html="pageData.advisorAssistanceEn"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightSubmit">
        <div>
          <h4>{{ $t("首课反馈审核") }}</h4>
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
                  'teach.reportMT.firstClassFeedback.flfViewSuccessAndSave'
                )
              "
              @click="justSave"
              >{{ $t("preservation") }}</el-button
            >
            <el-button
              v-if="
                (radio === 2 &&
                  Per.handleButtonPer(
                    'teach.reportMT.firstClassFeedback.flfViewFailedAndSendToTeacher'
                  )) ||
                (radio !== 2 &&
                  Per.handleButtonPer(
                    'teach.reportMT.firstClassFeedback.flfViewSuccessAndSendToStudent'
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
          class="beforeSubmit"
          v-for="(item, index) in firstReportAuditList"
          :key="index"
        >
          <p>
            {{ $t("审核结论") }}：<span>{{
              item.status | mapUnitReportStatus
            }}</span>
          </p>
          <p>
            {{ $t("Reviewer") }}：<span>{{ item.auditUserName }}</span>
          </p>
          <p>
            {{ $t("Audit time") }}：<span>{{
              DateTimeUtils.dateClockTime(item.createTime)
            }}</span>
          </p>
          <p>{{ $t("评语") }}：</p>
          <p>
            <span>{{ item.remark }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import {
  getFirstClassFeedbackDetails,
  auditFirstClassFeedback,
} from "@/api/unitReportManagement/";
export default {
  name: "feedbackAudited",
  data() {
    return {
      loading: false,
      radio: 3,
      langFlag: 1,
      remark: "",
      pageData: {
        tutorRealName: "",
        studentRealName: "",
        startTime: "",
        tutorPhone: "",
        parentUserName: "",
        courseEditionId: "",
        courseLevel: "",
        lessonNo: "",
        commitTime: "",
        submitCount: "",
        adviserUserName: "",
        studentGender: "",
        studentAge: "",
        submitCount: "",
        courseInfoZh: "",
        courseInfoEn: "",
        coreKnowledgeZh: "",
        coreKnowledgeEn: "",
        addKnowledgeZh: "",
        addKnowledgeEn: "",
        classroomFeedbackZh: "",
        classroomFeedbackEn: "",
        communicationSuggestionZh: "",
        communicationSuggestionEn: "",
        suggestCourseInfoZh: "",
        suggestCourseInfoEn: "",
        studentCharacterZh: "",
        studentCharacterEn: "",
        studentBackgroundZh: "",
        studentBackgroundEn: "",
        advisorAssistanceZh: "",
        advisorAssistanceEn: "",
      },
      reportResultId: null,
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
      templateType: null,
      powerAssessmentList: [],
      classPerformanceObj: {},
      honorList: [],
    };
  },
  methods: {
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
    }),
    changeLangFlag(value) {
      this.langFlag = value;
    },
    justSave() {
      if (this.remark === "") {
        this.$notify({
          message: "请输入评语",
        });
        return;
      } else {
        auditFirstClassFeedback({
          firstReportId: this.pageData.firstReportId,
          status: 4,
          remark: this.remark,
        }).then((res) => {
          if (res.data.code === 200) {
            this.$notify({
              message: "保存成功",
              type: "success",
            });
            this.$router.push("/reportManagement/firstClassFeedback");
          }
        });
      }
    },
    saveAndFeedbackToTeacher() {
      auditFirstClassFeedback({
        firstReportId: this.pageData.firstReportId,
        status: this.radio,
        remark: this.remark,
      }).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            type: "success",
            message: "success",
          });
          this.$router.push("/reportManagement/firstClassFeedback");
        }
      });
    },
    replaceBr(str) {
      if (str != null) {
        return str.replace(/\n|\r\n/g, "<br>");
      } else {
        return "";
      }
    },
  },
  created() {
    this.setPageTitle("待审核");
    let reportId = this.$route.query.reportId;
    let classTypeId = this.$route.query.classTypeId;
    this.loading = true;
    getFirstClassFeedbackDetails(reportId, classTypeId).then((res) => {
      this.pageData = res.data.data.firstReportDetail;
      this.templateType = this.pageData.templateId ? "new" : "old";
      this.firstReportAuditList = res.data.data.firstReportAuditList;
      if (this.firstReportAuditList.length !== 0) {
        this.firstReportAuditList.sort((a, b) => {
          return b.firstReportAuditId - a.firstReportAuditId;
        });
        this.reportResultId = this.firstReportAuditList[0];
        if (this.reportResultId) {
          if (
            this.reportResultId.status ===
            this.ApiConstants.reportPassButNotSend
          ) {
            this.remark = this.reportResultId.remark;
          }
        }
      }
      if (this.pageData.templateId) {
        this.templateType = "new";
        this.powerAssessmentList = JSON.parse(this.pageData.powerAppraiseIds);
        if (this.pageData.versions === 2) {
          /* 处理荣誉 */
          if (!this.pageData.courseFirstHonorList) return;
          this.honorList = [];
          this.pageData.courseFirstHonorList.forEach((e) => {
            this.honorList.push(e.name);
          });
        }
        if (this.pageData.versions === 1) {
          let classPerformanceOriginObj = JSON.parse(
            this.pageData.lessionShowIds
          );
          classPerformanceOriginObj.forEach((item, index) => {
            this.$set(this.classPerformanceObj, item.showName, item.showVal);
          });
        }
      } else {
        this.templateType = "old";
        this.pageData.courseInfoZh = this.replaceBr(this.pageData.courseInfoZh);
        this.pageData.courseInfoEn = this.replaceBr(this.pageData.courseInfoEn);
        this.pageData.coreKnowledgeZh = this.replaceBr(
          this.pageData.coreKnowledgeZh
        );
        this.pageData.coreKnowledgeEn = this.replaceBr(
          this.pageData.coreKnowledgeEn
        );
        this.pageData.addKnowledgeZh = this.replaceBr(
          this.pageData.addKnowledgeZh
        );
        this.pageData.addKnowledgeEn = this.replaceBr(
          this.pageData.addKnowledgeEn
        );
        this.pageData.classroomFeedbackZh = this.replaceBr(
          this.pageData.classroomFeedbackZh
        );
        this.pageData.classroomFeedbackEn = this.replaceBr(
          this.pageData.classroomFeedbackEn
        );
        this.pageData.communicationSuggestionZh = this.replaceBr(
          this.pageData.communicationSuggestionZh
        );
        this.pageData.communicationSuggestionEn = this.replaceBr(
          this.pageData.communicationSuggestionEn
        );
        this.pageData.suggestCourseInfoZh = this.replaceBr(
          this.pageData.suggestCourseInfoZh
        );
        this.pageData.suggestCourseInfoEn = this.replaceBr(
          this.pageData.suggestCourseInfoEn
        );
        this.pageData.studentCharacterZh = this.replaceBr(
          this.pageData.studentCharacterZh
        );
        this.pageData.studentCharacterEn = this.replaceBr(
          this.pageData.studentCharacterEn
        );
        this.pageData.studentBackgroundZh = this.replaceBr(
          this.pageData.studentBackgroundZh
        );
        this.pageData.studentBackgroundEn = this.replaceBr(
          this.pageData.studentBackgroundEn
        );
        this.pageData.advisorAssistanceZh = this.replaceBr(
          this.pageData.advisorAssistanceZh
        );
        this.pageData.advisorAssistanceEn = this.replaceBr(
          this.pageData.advisorAssistanceEn
        );
      }

      this.loading = false;
    });
  },
};
</script>
<style lang="scss" scoped>
.color666 {
  // color: #666;
}
.beforeSubmit {
  margin: 10px 0;
  border-top: 2px dotted #cccccc;
  span {
    color: #666;
  }
}
.auditedPageWrapper {
  .auditedTopMessage {
    display: flex;
    font-size: 14px;
    display: flex;
    div {
      margin: 0 26px;
      span {
        color: rgb(167, 167, 167);
      }
    }
  }
}
.auditedBottomMessage {
  display: flex;
  overflow-x: auto;
  height: auto;
  .leftReport {
    width: 700px;
    height: 100%;
    background: #f5f5f5;
    font-size: 14px;
    padding: 30px 40px;
    .leftReportHeader {
      display: flex;
      justify-content: space-between;
      width: 100%;
      position: relative;
      margin-bottom: 40px;
      .headerLangBtns {
        position: absolute;
        right: 0;
        span {
          width: 50px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          margin: 0 10px;
          cursor: pointer;
          color: #666;
        }
        .active {
          color: #000;
        }
      }
    }
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
        line-height: 20px;
        color: #666;
      }
      .title-name {
        color: rgb(218, 196, 110);
        font-size: 16px;
        .content {
          font-size: 14px;
          color: initial;
        }
      }
      .course-knowledge-point {
        .content {
          padding-left: 20px;
        }
      }
      .ability-assessment {
        .content {
          padding-left: 20px;
          .ability-item {
            display: flex;
            > span {
              margin-right: 20px;
            }
          }
        }
      }
      .class-performance {
        .content {
          padding-left: 20px;
          margin-bottom: 15px;
          > span.ib {
            display: inline-block;
            width: 100px;
          }
        }
        .copywriting {
          text-indent: 20px;
          line-height: 20px;
        }
      }
      .internal-feedback {
        text-align: center;
        margin-bottom: 20px;
      }
      .parent-communication {
        > .content {
          padding-left: 20px;
        }
        .title-name {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .rightSubmit {
    width: 400px;
    background-color: #eee;
    font-size: 14px;
    padding: 10px 20px;
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
