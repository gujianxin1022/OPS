<template>
  <div class="auditedPageWrapper">
    <!-- 顶部信息 -->
    <div class="auditedTopMessage" v-if="pageData != null">
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
    <div class="auditedBottomMessage" v-if="pageData != null">
      <div class="leftReport">
        <div class="switchBtn" v-if="templateType === 'new'">
          <el-button
            v-for="item in languageBtnList"
            :key="item"
            :type="lang === item.type ? 'primary' : ''"
            @click="switchLanguages(item.type)"
            >{{ item.label }}</el-button
          >
        </div>
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
          <!-- 欢迎语 -->
          <p>
            {{ staticText.start }}{{ pageData.studentRealName
            }}{{ staticText.opening }}{{ staticText.level }}
          </p>
          <p v-if="pageData.suggestInfo">
            {{ lang === "EN" ? "Suggested level" : "建议级别" }}：<span
              style="color: red; display: inline"
              >{{ pageData.suggestInfo }}</span
            >
          </p>
          <!-- 课程知识点 -->
          <template>
            <div v-if="pageData.versions !== 2" class="course-knowledge-point">
              <p class="title-name">{{ staticText.firstTitle }}</p>
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
                  <p class="title">{{ lang === "EN" ? "Summary or supplement" : "总结或补充" }}：</p>
                  <p class="color666">{{ pageData.knowledgeDesc }}</p>
                </div>
              </div>
            </div>
            <div v-else class="course-knowledge-point">
              <p class="title-name">{{ staticText.firstTitle }}</p>
              <div class="content">
                <template v-if="pageData.knowledgePointV2List">
                  <p
                    class="color666"
                    v-for="(item, index) in pageData.knowledgePointV2List"
                    :key="index"
                  >
                    {{ item.title }}：
                    <span v-if="item.contentList">
                      <span
                        class="point-tag"
                        v-for="content in item.contentList"
                        :key="content.multiId"
                        >{{ content.content }}</span
                      >
                    </span>
                  </p>
                </template>
                <template v-else>
                  <p class="color666">无</p>
                </template>
                <div class="summary">
                  <p class="title">{{ lang === "EN" ? "Summary or supplement" : "总结或补充" }}：</p>
                  <p class="color666">{{ pageData.knowledgeDesc }}</p>
                </div>
              </div>
            </div>
          </template>

          <!-- 能力评估 -->
          <div class="ability-assessment">
            <p class="title-name">{{ staticText.sencedTitle }}</p>
            <div class="content">
              <p
                class="ability-item"
                v-for="(item, index) in powerAssessmentList"
                :key="index"
              >
                <span v-if="lang === 'CN'" class="color666">{{
                  item.starName
                }}</span>
                <span v-else class="color666">{{ item.nowLanguageName }}</span>
                <el-rate
                  v-model="item.starVal"
                  disabled
                  disabled-void-color="#caced4"
                ></el-rate>
              </p>
            </div>
          </div>
          <!-- 课堂表现反馈 -->
          <div v-if="pageData.versions !== 2" class="class-performance">
            <p class="title-name">{{ staticText.thirdTitle }}</p>
            <div class="content color666">
              <span class="ib">{{ staticText.firstLabel }}</span>
              <el-radio-group
                v-model="classPerformanceObj['课堂表现']"
                disabled
              >
                <el-radio :label="1">{{
                  staticText.firstLabelRadio1
                }}</el-radio>
                <el-radio :label="2">{{
                  staticText.firstLabelRadio2
                }}</el-radio>
                <el-radio :label="3">{{
                  staticText.firstLabelRadio3
                }}</el-radio>
              </el-radio-group>
            </div>
            <div class="content color666">
              <span class="ib">{{ staticText.secondLabel }}</span>
              <el-radio-group v-model="classPerformanceObj['配合度']" disabled>
                <el-radio :label="1">{{
                  staticText.secondLabelRadio1
                }}</el-radio>
                <el-radio :label="2">{{
                  staticText.secondLabelRadio2
                }}</el-radio>
                <el-radio :label="3">{{
                  staticText.secondLabelRadio3
                }}</el-radio>
              </el-radio-group>
            </div>
            <div class="content color666">
              <span class="ib">{{ staticText.thirdLabel }}</span>
              <el-radio-group
                v-model="classPerformanceObj['学生基础']"
                disabled
              >
                <el-radio :label="1">{{
                  staticText.thirdLabelRadio1
                }}</el-radio>
                <el-radio :label="2">{{
                  staticText.thirdLabelRadio2
                }}</el-radio>
                <el-radio :label="3">{{
                  staticText.thirdLabelRadio3
                }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 荣誉 -->
          <div v-if="pageData.versions === 2">
            <p class="title-name">{{ staticText.honorTitle }}</p>
            <div class="content color666">
              <span class="mr20" v-for="item in honorList" :key="item">{{
                item
              }}</span>
            </div>
          </div>
          <!-- 老师反馈 -->
          <p class="copywriting">{{ pageData.lessionShowOtherDesc }}</p>
          <!-- 家长不可见 -->
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
                  <el-radio :label="6">未沟通</el-radio>
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
            <div class="parent-communication">
              <p class="title-name">薄弱能力项：</p>
              <div class="content">
                <el-checkbox-group
                  v-if="weakList.length > 0"
                  v-model="weakList"
                >
                  <el-checkbox
                    disabled
                    v-for="item in powerAssessmentList"
                    :key="item"
                    :label="item.starName"
                  ></el-checkbox>
                </el-checkbox-group>
                <p>{{ pageData.vulnerablePowerDesc }}</p>
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
              <p class="textearMesg" v-if="langFlag === 1">
                <span v-html="pageData.classroomFeedbackZh"></span>
              </p>
              <p class="textearMesg" v-else>
                <span v-html="pageData.classroomFeedbackEn"></span>
              </p>
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
        <button
          style="width: 0px; height: 0px; border: none"
          ref="copyBtn"
          v-clipboard:copy="copyStrings"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        ></button>
        <div class="h5">
          <feedbackPoster
            :pageData="pageData"
            :username="pageData.studentRealName"
            :lang="lang"
            :subjectType="pageData.subjectType"
            :reportId="reportId"
            @createLink="createLink"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { deepClone } from "@/utils/handleData";
import axios from "axios";
const jstz = require("@/utils/jstz");
const timezone = jstz.jstz.determine();
const ua = navigator.userAgent.toLowerCase();
import datetime from "@/utils/datetime_utils";
import { getDevice } from "@/utils/handleData";

import {
  getFirstClassFeedbackDetails,
  getFirstClassFeedbackDetailsMap,
  recordTemplage,
} from "@/api/unitReportManagement/";
import feedbackPoster from "./feedbackPoster";
export default {
  name: "feedbackAuditSuccessed",
  components: { feedbackPoster },
  data() {
    return {
      reportId: "",
      weakList: [],
      radio: 3,
      langFlag: 1,
      loading: false,
      pageData: null,
      templateType: null,
      powerAssessmentList: [],
      classPerformanceObj: {},
      copyStrings: "",
      languageBtnList: [],
      lang: "CN",
      staticText: {},
      classTyeId: "",
      honorList: [],
      honorKeyList: [],
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    currentLang() {
      this.inData();
      this.getFeedBackDetails(this.classTyeId);
    },
  },
  methods: {
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
    }),
    inData() {
      leftReportHeaderLangList: [
        {
          text: this.$t("feedBack中文版"),
          value: 1,
        },
        {
          text: this.$t("feedBack英文版"),
          value: 2,
        },
      ];
    },
    changeLangFlag(value) {
      this.langFlag = value;
    },
    replaceBr(str) {
      if (str != null) {
        return str.replace(/\n|\r\n/g, "<br>");
      } else {
        return "";
      }
    },
    // 切换语言版本
    async switchLanguages(type) {
      const {
        status,
        data: { code, data },
      } = await getFirstClassFeedbackDetailsMap(this.pageData.templateId, type);
      if (status !== 200 || code !== 200) return Promise.reject();
      let powerAppraiseMap = data.powerAppraiseMap;
      this.powerAssessmentList.forEach((e, i) => {
        Object.keys(powerAppraiseMap).forEach((key) => {
          if (key.startsWith(e.starName)) {
            e.nowLanguageName = powerAppraiseMap[key].name;
            this.$set(this.powerAssessmentList, i, e);
          }
        });
      });
      if (this.pageData.versions === 2) {
        this.honorList = [];
        this.honorKeyList.forEach((honorName) => {
          Object.keys(data.honorDescMap).forEach((key) => {
            if (key.startsWith(honorName)) {
              this.honorList.push(data.honorDescMap[key].name);
            }
          });
        });
        this.reqgKnowledgePoints(type);
      }
      this.lang = type;
      this.changeStaticText(type);
    },
    async reqgKnowledgePoints(type) {
      console.log(process.env.VUE_APP_API_LMS_FACADE);
      const url = `${process.env.VUE_APP_API_LMS_FACADE}/facade/student/course/first/report/get/multi/lang?firstReportId=${this.pageData.firstReportId}`;
      axios({
        url: url,
        method: "get",
        data: {},
        responseType: "application/json",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
          "X-LNG": type,
          "X-TZ": timezone.name() + " " + datetime.getTimeZone(),
          "X-DEVICE": getDevice(ua),
        },
      }).then((response) => {
        if (response.status !== 200 || response.data.code !== 200)
          return Promise.reject();
        this.pageData.knowledgePointV2List =
          response.data.data.courseKnowledgePointV2;
      });
    },
    // 翻译静态文字语言
    changeStaticText(type) {
      switch (type) {
        case "IN":
          this.staticText = {
            start: "Selamat",
            opening: "sudah menyelesaikan kelas pertama di LingoAce!",
            level:
              "Laporan pembelajaran ini kami tulis berdasarkan performa anak pada saat kelas untuk membantu para orang tua murid dalam memahami level mandarin anak.",
            firstTitle: "1. Titik pengetahuan kursus",
            sencedTitle: "2. penilaian kemampuan",
            thirdTitle: "3. Balasan prestasi ruang kelas",
            honorTitle: "3.Kehormatan Kelas",
            firstLabel: "Performasi ruang kelas",
            firstLabelRadio1: "aktif",
            firstLabelRadio2: "sekunder",
            firstLabelRadio3: "Diamlah.",
            secondLabel: "Tingkat yang cocok",
            secondLabelRadio1: "koordinasi",
            secondLabelRadio2: "sekunder",
            secondLabelRadio3: "Jangan bekerja sama",
            thirdLabel: "Yayasan mahasiswa",
            thirdLabelRadio1: "higher",
            thirdLabelRadio2: "sekunder",
            thirdLabelRadio3: "Lebih rendah",
          };
          break;
        case "TN":
          this.staticText = {
            start: "ขอแสดงความยินดีกับน้อง",
            opening: "ที่เรียนกับ LingoAce จบบทเรียนแรก!",
            level:
              "เราสร้างรายงานการเรียนรู้สำหรับหลักสูตรนี้โดยพิจารณาจากผลการเรียนของบุตรหลานท่านเพื่อช่วยให้ท่านได้เข้าใจประสิทธิภาพในชั้นเรียนของบุตรหลานมากยิ่งขึ้น",
            firstTitle: "ความรู้หลักสูตร",
            sencedTitle: "การประเมินความสามารถ",
            thirdTitle: "ข้อเสนอแนะการปฏิบัติงานในชั้นเรียน",
            honorTitle: "เกียรตินิยมในห้องเรียน",
            firstLabel: "การนำเสนอในชั้นเรียน",
            firstLabelRadio1: "มีชีวิตชีวา",
            firstLabelRadio2: "ค่ากลาง",
            firstLabelRadio3: "สงัด",
            secondLabel: "พอดี",
            secondLabelRadio1: "จับคู่ผสมพันธุ์",
            secondLabelRadio2: "ค่ากลาง",
            secondLabelRadio3: "ซึ่งไม่เหมาะสม",
            thirdLabel: "นักเรียนมูลนิธิ",
            thirdLabelRadio1: "เหนือกว่า",
            thirdLabelRadio2: "ค่ากลาง",
            thirdLabelRadio3: "ความหยาบช้า",
          };
          break;
        case "EN":
          this.staticText = {
            start: "Congratulations to",
            opening: "for the completion of first lesson in LingoAce.",
            level:
              "Here is the learning report based on your child's performance in class. ",
            firstTitle: "1、 Course knowledge points",
            sencedTitle: "2、 Capacity assessment",
            thirdTitle: "3、 Classroom performance feedback",
            honorTitle: "3、Classroom Honors",
            firstLabel: "Classroom performance",
            firstLabelRadio1: "active",
            firstLabelRadio2: "secondary",
            firstLabelRadio3: "quiet",
            secondLabel: "Matching degree",
            secondLabelRadio1: "coordination",
            secondLabelRadio2: "secondary",
            secondLabelRadio3: "Don't cooperate",
            thirdLabel: "Student foundation",
            thirdLabelRadio1: "higher",
            thirdLabelRadio2: "secondary",
            thirdLabelRadio3: "Lower",
          };
          break;
        default:
          this.staticText = {
            start: "祝贺",
            opening: "小朋友在LingoAce完成了第一节课！",
            level:
              "我们根据孩子上课表现，提供本次课程的学习报告，帮助您了解孩子的学习水平。",
            firstTitle: "一、课程知识点",
            sencedTitle: "二、能力评估",
            thirdTitle: "三、课堂表现反馈",
            honorTitle: "三、课堂表现",
            firstLabel: "课堂表现",
            firstLabelRadio1: "活跃",
            firstLabelRadio2: "中等",
            firstLabelRadio3: "安静",
            secondLabel: "配合度",
            secondLabelRadio1: "配合",
            secondLabelRadio2: "中等",
            secondLabelRadio3: "不配合",
            thirdLabel: "学生基础",
            thirdLabelRadio1: "较高",
            thirdLabelRadio2: "中等",
            thirdLabelRadio3: "较低",
          };
      }
    },
    // 记录生成图片或短链
    async record() {
      let params = {
        language: this.lang,
        reportId: this.reportId,
        type: "短链",
      };
      await recordTemplage(params);
    },
    // 生成h5短链
    createLink(url) {
      let langNum;
      switch (this.lang) {
        case "EN":
          langNum = "2";
          break;
        case "TN":
          langNum = "3";
          break;
        case "IN":
          langNum = "4";
          break;
        default:
          langNum = "1";
      }
      let reporturl = process.env.VUE_APP_H5_URL + "/study/#/report/trialClass";
      let params = {
        longUrl:
          this.lang === "FR"
            ? url
            : process.env.VUE_APP_H5_URL +
              `/activity/mounting/ClueReport/index.html?` +
              encodeURIComponent(
                `reportId=${this.reportId}&parentUserId=${this.pageData.parentUserId}&terminal=OPS&subject=${this.pageData.subjectType}&materiel=STR&reporturl=${reporturl}&language=${langNum}&from=LZ`
              ),
        codeLength: 6,
      };
      this.$Axios({
        method: "post",
        url: `${process.env.VUE_APP_SHORTCHAIN_API}/api/shortlink`,
        data: params,
      }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.copyStrings = data.data.shortUrl;
          setTimeout(() => {
            this.$refs.copyBtn.click();
          }, 300);
        } else {
          this.$notify.error({
            title: "错误",
            message: data.message,
          });
        }
      });
    },
    onCopy() {
      this.$message.success("短链已复制到剪切板！");
      this.record();
    },
    onError() {
      this.$message.error("抱歉，复制失败！");
    },
    getFeedBackDetails(classTypeId) {
      getFirstClassFeedbackDetails(this.reportId, classTypeId).then((res) => {
        this.pageData = res.data.data.firstReportDetail;
        if (this.pageData.templateId) {
          this.templateType = "new";
          this.powerAssessmentList =
            JSON.parse(this.pageData.powerAppraiseIds) || [];
          if (this.pageData.versions !== 2) {
            /* 处理课堂表现 */
            let classPerformanceOriginObj = JSON.parse(
              this.pageData.lessionShowIds
            );
            classPerformanceOriginObj.forEach((item, index) => {
              this.$set(this.classPerformanceObj, item.showName, item.showVal);
            });
          }
          if (this.pageData.versions === 2) {
            /* 处理荣誉 */
            if (!this.pageData.courseFirstHonorList) return;
            let honorList = [];
            this.pageData.courseFirstHonorList.forEach((e) => {
              honorList.push(e.name);
            });
            this.honorList = deepClone(honorList);
            this.honorKeyList = deepClone(honorList);
          }
          if (
            this.pageData.nowLanguage &&
            this.pageData.nowLanguage.length > 0
          ) {
            this.languageBtnList = [];
            this.pageData.nowLanguage.split(",").forEach((e) => {
              let label;
              switch (e) {
                case "EN":
                  label = this.currentLang == "en" ? "English" : "英文版";
                  break;
                case "TN":
                  label = this.currentLang == "en" ? "Thailand" : "泰语版";
                  break;
                case "IN":
                  label = this.currentLang == "en" ? "Bahasa" : "印尼语版";
                  break;
                case "FR":
                  label = this.currentLang == "en" ? "Bahasa" : "法语版";
                  break;
                default:
                  label = this.currentLang == "en" ? "Chinese" : "中文版";
              }
              this.languageBtnList.push({ type: e, label });
            });
          }
          this.changeStaticText("CN");
          // 薄弱能力项
          if (
            this.pageData.vulnerablePower &&
            this.pageData.vulnerablePower.length > 0
          ) {
            this.weakList = this.pageData.vulnerablePower.split(",");
          }
          if (
            this.pageData.lessionShowOtherDesc &&
            this.pageData.lessionShowOtherDesc.length > 0
          ) {
            this.pageData.lessionShowOtherDesc =
              this.pageData.lessionShowOtherDesc.replace(
                /{username}/g,
                this.pageData.studentRealName
              );
          }
        } else {
          this.templateType = "old";
          this.pageData.courseInfoZh = this.replaceBr(
            this.pageData.courseInfoZh
          );
          this.pageData.courseInfoEn = this.replaceBr(
            this.pageData.courseInfoEn
          );
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
  },
  created() {
    this.loading = true;
    this.setPageTitle("审核未通过");
    this.reportId = this.$route.query.reportId;
    let classTypeId = this.$route.query.classTypeId;
    this.classTyeId = classTypeId;
    this.getFeedBackDetails(classTypeId);
  },
};
</script>
<style lang="scss" scoped>
.auditedPageWrapper {
  overflow: auto;
  .auditedTopMessage {
    display: flex;
    font-size: 14px;
    display: flex;
    div {
      margin: 0 40px;
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
    background: #f5f5f5;
    font-size: 14px;
    padding: 30px 40px;
    .switchBtn {
      text-align: right;
    }
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
        .point-tag {
          background-color: #ecf5ff;
          display: inline-block;
          padding: 0 10px;
          line-height: 24px;
          font-size: 12px;
          color: #409eff;
          border: 1px solid #d9ecff;
          border-radius: 4px;
          box-sizing: border-box;
          margin-bottom: 10px;
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
    width: 500px;
    font-size: 14px;
    padding: 10px 20px;
    background-color: #eee;
    .btnBox {
      margin-top: 100px;
      button {
        display: block;
        margin: 0 auto;
        margin-top: 20px;
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
