<template>
  <div class="user-content-warp">
    <el-row :gutter="20" style="border-bottom: 1px solid #dcdfe6">
      <el-col :span="isEn ? 8 : 8" class="label">{{ $t("家长账号") }}:</el-col>
      <el-col :span="isEn ? 16 : 16" class="value">
        <router-link
          target="_blank"
          :to="{
            name: `parentInfo`,
            query: { parentUserId: userState.parentUserId },
          }"
          @click=""
        >
          <span class="router-btn">{{ userState.parentUserName }}</span>
        </router-link>
      </el-col>
      <el-col :span="isEn ? 8 : 8" class="label">{{ $t("学生姓名") }}:</el-col>
      <el-col :span="isEn ? 16 : 16" class="value">
        <div
          v-for="student in userState.studentList"
          :key="student.studentUserId"
        >
          <el-tag
            style="
              border: none;
              background-color: transparent;
              margin-top: -4px;
              padding-right: 0px;
            "
            :type="student.studentName === curStudent.studentName ? '' : 'info'"
            class="student"
            @click="changeStudent(student)"
            >{{ student.studentName }}</el-tag
          >
          <router-link
            target="_blank"
            :to="{
              path: `/studentManagement/studentInfo`,
              query: {
                studentId: student.studentUserId,
                studentName: student.studentName,
              },
            }"
            @click=""
          >
            <i class="el-icon-link" style="cursor: pointer; color: #7580e5"></i>
          </router-link>
        </div>
      </el-col>
      <el-col :span="isEn ? 8 : 8" class="label">{{ $t("学科") }}:</el-col>
      <el-col :span="isEn ? 16 : 16" class="value">
        <el-tag
          style="
            border: none;
            background-color: transparent;
            margin-top: -4px;
            height: 0px;
            cursor: pointer;
          "
          :type="item === curSubjectId ? '' : 'info'"
          v-for="item in curStudent.subjectList"
          :key="item"
          @click="changeSubject(item)"
          >{{ $t(SUBJECT_TYPE_CODE_NAME[item]) }}</el-tag
        >
      </el-col>
    </el-row>
    <el-tabs
      v-show="curStudent.subjectList && curStudent.subjectList.length"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="$t('行为数据')" name="behavioralData">
        <div class="behavioral-data" v-if="behaviorData">
          <div class="mb5" style="font-weight: 100">
            {{ $t("以下数据按照学科维度展示，最近更新时间") }}:
            {{ DateTimeUtils.dateClockTime(behaviorData.etlTime) || "-" }}
          </div>
          <div class="clearfix">
            <div class="title">{{ $t("课消") }}</div>
            <template>
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("上次完课内容") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.lastCompletedVirtualClassCourseProgress || "-"
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("上次完课时间") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    DateTimeUtils.dateClockTime(
                      behaviorData.lastClassEndTime
                    ) || "-"
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("下次完课时间") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    DateTimeUtils.dateClockTime(
                      behaviorData.nextClassStartTime
                    ) || "-"
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本周正常完课") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.classCompletedThisWeekNum }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20"
                ><el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本周已约未上") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.classScheduledThisWeekNum }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本周预计完课") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.classPlannedCompletedThisWeekNum
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20"
                ><el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本月正常完课") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.classCompletedThisMonthNum }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本月已约未上") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.classScheduledThisMonthNum }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20"
                ><el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本月预计完课") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.classPlannedCompletedThisMonthNum
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20"
                ><el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("历史平均月完课") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.beforeThereMonthCompletedNum }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("三周约课对比") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>
                    {{ behaviorData.classCompletedLastWeekNum }} :
                    {{ behaviorData.classPlannedCompletedThisWeekNum }} :
                    {{ behaviorData.classScheduledNextWeekNum }}</span
                  >
                </el-col></el-row
              >
              <el-row :gutter="20"
                ><el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("三月约课对比") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>
                    {{ behaviorData.classCompletedLastMonthNum }} :
                    {{ behaviorData.classPlannedCompletedThisMonthNum }} :
                    {{ behaviorData.classScheduledNextMonthNum }}</span
                  >
                </el-col></el-row
              >
            </template>
          </div>
          <div class="clearfix">
            <div class="title">{{ $t("续费") }}</div>
            <template v-if="behaviorData">
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("学生课时") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.studentAccountBalance }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("家长课时") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.parentAccountBalance }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("家长积分") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.parentCoinBalance }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("N签") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.studentOrderNum }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本月是否有订单") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.thisMonthHasOrder === 0 ? $t("无") : $t("有")
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("上次续费时间") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>
                    {{
                      DateTimeUtils.dateClockTime(behaviorData.lastOrderTime) ||
                      "-"
                    }}</span
                  >
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("累计完课") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.classCompletedTotalNum || "-" }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("家长账户优惠券") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{ behaviorData.couponListStr || "-" }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("订单情况") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  {{
                    $t("待支付") +
                    "：" +
                    behaviorData.parentOrderPaymentPendingNum
                  }},
                  {{
                    $t("已支付") +
                    "：" +
                    behaviorData.parentOrderPaymentCompletedNum
                  }},
                  {{
                    $t("已取消") +
                    "：" +
                    behaviorData.parentOrderPaymentCancelNum
                  }}
                </el-col></el-row
              >
            </template>
          </div>
          <div class="clearfix">
            <div class="title">{{ $t("转介绍") }}</div>
            <template v-if="behaviorData">
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("剩余打卡次数") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.parentRemainingPunchInNum || "-"
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("上次打卡时间") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    DateTimeUtils.dateClockTime(
                      behaviorData.parentRemainingPunchInTime
                    ) || "-"
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本周是否上传") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.parentRemainingPunchInUpload === 0
                      ? $t("否")
                      : $t("是")
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本周是否打卡") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.parentRemainingPunchIn === 0
                      ? $t("否")
                      : $t("是")
                  }}</span>
                </el-col></el-row
              >
              <el-row :gutter="20">
                <el-col :span="isEn ? 8 : 8" class="label"
                  >{{ $t("本月已打卡次数") }}:</el-col
                >
                <el-col :span="isEn ? 16 : 16" class="value">
                  <span>{{
                    behaviorData.parentRemainingPunchInThisMonthNum || "0"
                  }}</span>
                </el-col></el-row
              >
            </template>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('基础数据')" name="basicData">
        <div class="basic-data" v-if="studentInfo">
          <div class="clearfix">
            <div class="title">{{ $t("学生信息") }}</div>
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("在校年级") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ studentInfo.grade || "-" }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col style="height: auto" :span="isEn ? 8 : 8" class="label"
                >{{ $t("学生母语") }}:</el-col
              >
              <el-col style="height: auto" :span="isEn ? 16 : 16" class="value">
                <span>{{ studentInfo.nativeLanguage || "-" }}</span>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("学生名字备注") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ studentInfo.studentNickName || "-" }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("期望的教学风格") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ getTeachStyleLabel(studentInfo.teachingStyle) }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("家庭语言环境") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  studentInfo.languageSituation
                    ? Filters.languageEnvironmentMap(
                        studentInfo.languageSituation,
                        currentLang
                      )
                    : "-"
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("学生特点") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  studentInfo.studentCharacteristics
                    ? studentInfo.studentCharacteristics
                    : "-"
                }}</span>
              </el-col></el-row
            >
          </div>
          <div class="clearfix" v-if="studentInfo.zhSubject">
            <div class="title">{{ $t("学科信息") }}</div>
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("是否学过拼音") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.yesOrNoConfigMap(
                    studentInfo.zhSubject.pinyin,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("中文听说能力") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.chineseAbilityMap(
                    studentInfo.zhSubject.listenSpeakAbility,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("中文识字量") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  $t(Filters.wordMap(studentInfo.zhSubject.literacy)) || "-"
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("中文写字量") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  $t(Filters.wordMap(studentInfo.zhSubject.writeAmount)) || "-"
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("中文学习经历") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ getMultiLabel("chineseExperience") || "-" }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("中文使用情况") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.chineseUsingMap(
                    studentInfo.zhSubject.chineseUse,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("中文使用语言") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.standardOrNotLangMap(
                    studentInfo.zhSubject.chineseUseLanguage,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("家长期望和要求") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ getMultiLabel("parentExpect") || "-" }}</span>
              </el-col></el-row
            >
          </div>
          <div class="clearfix" v-if="studentInfo.enSubject">
            <div class="title">{{ $t("学科信息") }}</div>
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("英文学习经历") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ getMultiLabel("englishExperience") || "-" }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("英文学习年限") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{ studentInfo.enSubject.studyYears || "-" }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("是否学过自拼") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.yesOrNoConfigMap(
                    studentInfo.enSubject.learnedPhonics,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("英文词汇水平") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  getWordLevel(studentInfo.enSubject.vocabularyLevel) || "-"
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("英文听说能力") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.englishAbilityMap(
                    studentInfo.enSubject.listenSpeakLevel,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20">
              <el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("英文阅读水平") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.englishReadLevelListMap(
                    studentInfo.enSubject.readingLevel,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("英文书写水平") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>{{
                  Filters.englishWriteLevelListMap(
                    studentInfo.enSubject.writingLevel,
                    currentLang
                  )
                }}</span>
              </el-col></el-row
            >
            <el-row :gutter="20"
              ><el-col :span="isEn ? 8 : 8" class="label"
                >{{ $t("定级测试结果") }}:</el-col
              >
              <el-col :span="isEn ? 16 : 16" class="value">
                <span>
                  {{ studentInfo.enSubject.placementTestScore || "-" }}</span
                >
              </el-col></el-row
            >
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { unref, watch, ref, onMounted, computed } from "@vue/composition-api";
import { SUBJECT_TYPE_CODE_NAME } from "@/utils/constants";

export default {
  props: {
    taskId: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currentLang = computed(() => root.$store.getters.currentLang);

    const activeName = ref("behavioralData");
    const userState = ref({});
    const reqSopParent = async () => {
      try {
        const res = await root.$Api.taskManagement.reqSopParentAndStudentInfo(
          props.taskId
        );
        userState.value = res;
        changeStudent(res.studentList[0]);
      } finally {
      }
    };
    const curStudent = ref({});
    const studentInfo = ref(null);
    const behaviorData = ref({});
    watch(
      curStudent,
      (student) => {
        if (student && student.subjectList && student.subjectList.length) {
          changeSubject(student.subjectList[0]);
        } else {
          studentInfo.value = null;
          behaviorData.value = null;
        }
      },
      {
        immediate: true,
      }
    );

    const curSubjectId = ref("");
    const changeStudent = (student) => {
      curStudent.value = student;
    };
    const changeSubject = (id) => {
      curSubjectId.value = id;
      reqSopStudentBehaviorData();
      reqSopStudentInfo();
    };
    const reqSopStudentBehaviorData = async () => {
      try {
        const res = await root.$Api.taskManagement.reqSopStudentBehaviorData({
          studentId: curStudent.value.studentUserId,
          subjectId: curSubjectId.value,
        });

        let couponListStr = "";
        if (res?.couponList && res.couponList.length > 0) {
          couponListStr = res.couponList.join(",");
          res.couponListStr = couponListStr;
        }
        behaviorData.value = res;
      } finally {
      }
    };
    const reqSopStudentInfo = async () => {
      try {
        const {
          status,
          data: { code, data },
        } = await root.$Api.studentManagement.getStudentDetails(
          curStudent.value.studentUserId,
          curSubjectId.value
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        if (data.zhSubject) {
          data.zhSubject = transferDataFromZoho(data.zhSubject);
        }
        if (data.ehSubject) {
          data.ehSubject = transferDataFromZoho(data.ehSubject);
        }
        studentInfo.value = data;
      } finally {
      }
    };
    const getTeachStyleLabel = (styles) => {
      if (!styles || !styles.length) {
        return "-";
      }
      return styles.map((item) => root.$t(item.typeKey)).join("、");
    };
    const transferDataFromZoho = (subjectData) => {
      const subject = JSON.parse(JSON.stringify(subjectData));
      try {
        if (subject) {
          for (let key in subject) {
            if (subject.hasOwnProperty(key) && subject[key]) {
              // zoho同步过来的是否枚举为Yes OR NO ops存储枚举为true OR false 1_yes 1_no 0_yes 0_yes
              if (key === "learnedPhonics" || key === "pinyin") {
                const reg = subject[key].match(/(^\d{1}_)/);
                if (reg) {
                  subject[key] = subject[key].slice(2);
                }
                const matchArrYes = ["Yes", "是", "yes", "1"];
                const matchArrNo = ["no", "No", "否", "0"];
                if (
                  matchArrYes.includes(subject[key]) ||
                  matchArrNo.includes(subject[key])
                ) {
                  subject[key] = matchArrYes.includes(subject[key])
                    ? true
                    : false;
                } else {
                  subject[key] = /^true$/.test(subject[key]);
                }
              } else if (
                key === "writeAmount" ||
                (key === "literacy" &&
                  (subject[key].length > 1 || subject[key] === 0))
              ) {
                const list = unref(isEn)
                  ? root.Constants.wordListEn
                  : root.Constants.wordList;
                subject[key] =
                  list.find((item) => item.label === subject[key])?.value ||
                  subject[key];
              } else if (
                key === "chineseExperience" ||
                key === "parentExpect" ||
                key === "englishExperience"
              ) {
                // 这几项zoho传来的是多选，格式为['1_xxx', '2_xxx']，除了特殊情况englishExperience，下面会有说明
                // ops多选，格式为'1,2,3'
                if (key === "englishExperience") {
                  // 英文学习经历---ops：多选，格式为'1,2,3'；zoho传来的是单选,格式为‘1_xxx’, 并且要兼容后续zoho多选,格式为"[1_xxx,2_xxx]"
                  if (
                    subject[key].includes("[") ||
                    subject[key].includes("【")
                  ) {
                    //兼容zoho多选
                    const value = subject[key];
                    const arr = value
                      .slice(1, value.length - 1)
                      .replaceAll("，", ",")
                      .split(",");
                    let ids = [];
                    arr.map((t) => {
                      t = t.replace(/(^\s*)|(\s*$)/g, "");
                      const reg = t.match(/(^\d{1}_)/);
                      if (reg) {
                        ids.push(reg[0].slice(0, 1));
                      }
                    });
                    subject[key] = ids;
                  } else {
                    const matchContent = subject[key].match(/(\d{1}_)/);
                    if (matchContent) {
                      // zoho单选
                      subject[key] = [matchContent[0].slice(0, 1)];
                    } else if (
                      (subject[key] && subject[key].includes(",")) ||
                      /^[0-9]*$/.test(subject[key])
                    ) {
                      // 多选处理：线上手填的数据可能是[xxx, yyy]类似这种，与ops[1, 2]区分开，真的要吐了
                      const isFromOps = subject[key]
                        .split(",")
                        .every((item) => /^[0-9]*$/.test(item));
                      if (isFromOps) {
                        subject[key] = subject[key].split(",");
                      }
                    }
                    // else 剩下的都是ops手填-纯字符串，只做回显，不做编辑联动
                  }
                } else {
                  // 多选
                  if (
                    (subject[key] && subject[key].includes("[")) ||
                    subject[key].includes("【")
                  ) {
                    const value = subject[key];
                    const arr = value
                      .slice(1, value.length - 1)
                      .replaceAll("，", ",")
                      .split(",");
                    let ids = [];
                    arr.map((t) => {
                      t = t.replace(/(^\s*)|(\s*$)/g, "");
                      const reg = t.match(/(^\d{1}_)/);
                      if (reg) {
                        ids.push(reg[0].slice(0, 1));
                      }
                    });
                    subject[key] = ids;
                  } else if (
                    subject[key] &&
                    (subject[key].includes(",") ||
                      /^[0-9]*$/.test(subject[key]))
                  ) {
                    // 多选处理：线上手填的数据可能是[xxx, yyy]类似这种，与ops[1, 2]区分开
                    const isFromOps = subject[key]
                      .split(",")
                      .every((item) => /^[0-9]*$/.test(item));
                    if (isFromOps) {
                      subject[key] = subject[key].split(",");
                    }
                  } else {
                    // else 剩下的都是ops手填-纯字符串，只做回显，不做编辑联动
                    if (typeof subject[key] === "string") {
                      subject[key] = [];
                    }
                  }
                }
              } else if (subject[key].match(/(\d{1}_)/)) {
                // 单选项  zoho传来的是'1_xxx', ops的格式为'1'
                const content = subject[key].match(/(\d{1}_)/);
                subject[key] = content[0].slice(0, 1);
              }
              // 剩余的都是手填的，只有字符串（区别于zoho与ops）
            }
          }
        }
        return subject || {};
      } catch (err) {
        console.log(err);
      }
    };
    const getMultiLabel = (key) => {
      const zhSubject = studentInfo.value.zhSubject;
      const enSubject = studentInfo.value.enSubject;
      if (key === "chineseExperience") {
        if (typeof zhSubject.chineseExperience === "string") {
          return zhSubject.chineseExperience;
        }
        const zhChineseExprience = (zhSubject.chineseExperience || []).map(
          (id) => {
            return (
              root.Constants.learningExperience(isEn.value).find(
                (item) => id == item.value
              )?.label || ""
            );
          }
        );
        return zhChineseExprience.join("、");
      } else if (key === "parentExpect") {
        if (typeof zhSubject.parentExpect === "string") {
          return zhSubject.parentExpect;
        }
        const zhparentExpect = (zhSubject.parentExpect || []).map((id) => {
          return (
            root.Constants.parentalExpectations(isEn.value).find(
              (item) => id == item.value
            )?.label || ""
          );
        });
        return zhparentExpect.join("、");
      } else if (key === "englishExperience") {
        if (typeof enSubject.englishExperience === "string") {
          return enSubject.englishExperience;
        }
        const enExprience = (enSubject.englishExperience || []).map((id) => {
          return (
            root.Constants.learningExperienceEn(isEn.value).find(
              (item) => id == item.value
            )?.label || ""
          );
        });
        return enExprience.join("、");
      }
    };
    const getWordLevel = (val) => {
      if (!val) {
        return;
      }
      const label = isEn.value
        ? val.replace("单词", "Words")
        : val.replace("Words", "单词");
      if (studentInfo.value.enSubject?.vocabularyLevel) {
        studentInfo.value.enSubject.vocabularyLevel = label;
      }
      return label;
    };
    onMounted(() => {
      reqSopParent();
    });
    return {
      isEn,
      activeName,
      userState,
      curStudent,
      SUBJECT_TYPE_CODE_NAME,
      behaviorData,
      studentInfo,
      currentLang,
      curSubjectId,
      changeStudent,
      getTeachStyleLabel,
      getMultiLabel,
      getWordLevel,
      changeSubject,
    };
  },
};
</script>
<style lang="scss" scoped>
.user-content-warp {
  overflow: hidden;
  color: #666666;
  font-size: 12px;
  .router-btn {
    color: #7e8ae7;
    cursor: pointer;
  }
  .title {
    color: #333333;
    border-left: 2px solid #a0a7e6;
    padding-left: 6px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .label {
    text-align: right;
    margin-bottom: 10px;
  }
  .value {
    margin-bottom: 10px;
    .student {
      display: inline-block;
      cursor: pointer;
    }
  }
  ::v-deep .el-tabs__nav-scroll {
    width: 50%;
    margin: 0 auto;
  }
  .behavioral-data,
  .basic-data {
    padding-top: 20px;
  }
}
</style>
