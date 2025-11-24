<template>
  <div class="teacherInfoWrapper">
    <div
      class="reset-tutor-psw"
      v-if="Per.handleButtonPer('teach.tutorMT.restpassword')"
    >
      <el-button type="primary" @click="showDeviceCheckDrawer"
        >{{ $t("设备检测记录") }}
        <i
          v-if="deviceCheckInfo.deviceCheckCode != 3"
          class="el-icon-warning"
          style="
            margin-top: -15px;
            color: red;
            margin-right: -20px;
            float: right;
          "
        ></i>
        <!-- v-if="!studentInfo.studentName" -->
      </el-button>
      <el-button @click="handleRestTutorPsw">{{ $t("重置密码") }}</el-button>
    </div>
    <el-tabs v-model="activeName" type="card" :style="{marginTop: $i18n.locale === 'en' ? '35px' : '0px'}">
      <el-tab-pane
        v-if="[0, 1, 2, 3, 6].includes(teacherExamineStatus)"
        :label="$t('教师档案')"
        name="teacherArchives"
      >
        <TeacherArchives
          ref="teacherArchives"
          v-if="activeName == 'teacherArchives'"
          :teacherExamineStatus="teacherExamineStatus"
          @updateExamineStatus="updateExamineStatus"
        ></TeacherArchives>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('教学权限')"
        name="teachPower"
        v-if="teacherExamineStatus == 3"
      >
        <TeachPower v-if="activeName == 'teachPower'"></TeachPower>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('老师课酬')"
        name="classRemuneration"
        v-if="teacherExamineStatus == 3"
      >
        <ClassRemuneration
          v-if="activeName == 'classRemuneration'"
        ></ClassRemuneration>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('教师课表')"
        name="teacherTimetable"
        v-if="
          teacherExamineStatus == 3 &&
          Per.handleButtonPer(
            'teach.tutorMT.teacherTimetable.ttViewTeacherTimetable'
          )
        "
      >
        <TeacherTimeTable
          v-if="activeName == 'teacherTimetable'"
          :teacherId="teacherId"
          :teacherName="teacherName"
          :isFromTeacher="true"
        ></TeacherTimeTable>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('教学记录')"
        name="teachRecord"
        v-if="
          teacherExamineStatus == 3 &&
          Per.handleButtonPer(
            'teach.tutorMT.teachingRecord.trViewTeachingRecord'
          )
        "
      >
        <TeachRecord v-if="activeName == 'teachRecord'"></TeachRecord>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('修改记录')"
        name="changeRecord"
        v-if="teacherExamineStatus == 3"
      >
        <changeRecord v-if="activeName == 'changeRecord'"></changeRecord>
      </el-tab-pane>
      <el-tab-pane :label="$t('审核时间轴')" name="examineTimeLine">
        <ExamineTimeLine
          v-if="activeName == 'examineTimeLine' && teacherStage != null"
        ></ExamineTimeLine>
        <div v-else class="without-line">{{ $t("无数据") }}</div>
      </el-tab-pane>
      <el-tab-pane :label="$t('用户评价')" name="userEvaluations" lazy>
        <UserEvaluations :teacherId="teacherId" />
      </el-tab-pane>
      <el-tab-pane :label="$t('质检记录')" name="qualityCheckRecord" lazy>
        <QualityCheckRecord :teacherId="teacherId" v-if="activeName == 'qualityCheckRecord'"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('投诉记录')" name="complainRecord" lazy>
        <ComplainRecord :teacherId="teacherId" v-if="activeName == 'complainRecord'"/>
      </el-tab-pane>
    </el-tabs>

    <el-drawer
      v-if="showDeviceCheckRecords"
      :visible.sync="showDeviceCheckRecords"
      :title="$t('查看设备检测记录')"
      direction="ltr"
      :wrapperClosable="true"
    >
      <TaskDeviceCheckDrawer
         :data="deviceCheckInfo"
      />
    </el-drawer>
  </div>
</template>

<script>
import TeacherArchives from "./teacherInfoSub/TeacherArchives"; //老师档案
import TeachPower from "./teacherInfoSub/TeachPower"; // 教学权限
import TeacherTimeTable from "./teacherInfoSub/TeacherTimetable"; // 老师课表
import TeachRecord from "./teacherInfoSub/TeachRecord"; // 教学记录
import ClassRemuneration from "./teacherInfoSub/ClassRemuneration"; // 老师课酬
import ChangeRecord from "./teacherInfoSub/ChangeRecord"; // 变更记录
import ExamineTimeLine from "./teacherInfoSub/ExamineTimeLine"; // 审核时间轴
import UserEvaluations from './teacherInfoSub/UserEvaluations/index.vue'; // 用户评价
import QualityCheckRecord from './teacherInfoSub/QualityCheckRecord'; // 质检记录
import ComplainRecord from './teacherInfoSub/ComplainRecord'; // 投诉记录
import { mapMutations, mapGetters } from "vuex";
import { reactive } from "@vue/composition-api";
import TaskDeviceCheckDrawer from "@/views/taskManagement/components/taskDeviceCheckDrawer.vue";

export default {
  name: "teacherInfo",
  components: {
    TeacherArchives,
    TeachPower,
    TeacherTimeTable,
    TeachRecord,
    ClassRemuneration,
    ChangeRecord,
    ExamineTimeLine,
    UserEvaluations,
    TaskDeviceCheckDrawer,
    QualityCheckRecord,
    ComplainRecord,
  },
  data() {
    const deviceCheckInfo = reactive({
      deviceCheckCode: 3, // 1:从未做过设备检测 2:最近一次检测结果为，不通过 3:最近一次检测结果为，通过
      userId: "",
    });

    return {
      activeName: "teacherArchives",
      teacherStage: "",
      teacherExamineStatus: "",
      deviceCheckInfo,
      showDeviceCheckRecords: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    teacherId() {
      return this.$route.query.id * 1;
    },
    teacherName() {
      return this.$route.query.teacherName;
    },
  },
  methods: {
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
    }),
    handleRestTutorPsw() {
      console.log(this.$refs.teacherArchives.tutorInfo);
      const isFromSupplier = this.$refs.teacherArchives.tutorInfo.source === 5;
      let tips, tipes, title, sure, cancel;
      if (this.currentLang === "en") {
        tips = "Are you sure to reset the login password for Teacher ";
        tipes = isFromSupplier
          ? " ?"
          : " ? Please remind he/she to check their Email or SMS in time after that.";
        title = "Reset password";
        sure = "determine";
        cancel = "cancel";
      } else {
        tips = "确定要为教师 ";
        tipes = isFromSupplier
          ? "重置密码吗？"
          : " 重置密码吗？操作后请提醒老师及时查看邮箱或短信。";
        title = "重置密码";
        sure = "确定";
        cancel = "取消";
      }
      this.$confirm(
        `${tips}${
          this.$route.query.teacherName ? this.$route.query.teacherName : "当前"
        }${tipes}`,
        title,
        {
          confirmButtonText: sure,
          cancelButtonText: cancel,
          type: "warning",
        }
      ).then(() => {
        this.$Api.tutorManagement
          .resetTutorPassword(this.teacherId)
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              console.log(data);
              if (data.data && isFromSupplier) {
                this.$confirm(
                  `${this.$t("老师的新密码为")}：${data.data}`,
                  this.$t("重置成功"),
                  {
                    confirmButtonText: this.$t("知道了"),
                    showCancelButton: false,
                    type: "success",
                  }
                );
              } else {
                this.$message({
                  type: "success",
                  message: this.$t("重置密码成功"),
                });
              }
            }
          });
      });
    },
    showDeviceCheckDrawer() {
     // await this.getDeviceCheck();
     this.showDeviceCheckRecords = true;
   },

    async getDeviceCheck() {
      // console.log("getDeviceCheck teacherId====", this.teacherId)
      this.deviceCheckInfo.userId = this.teacherId;

      const res = await this.$Api.taskManagement.reqUserLastDeviceCheckResult({
        userId: this.teacherId,
      });
      this.deviceCheckInfo.deviceCheckCode = res ? res.result : 1;
    },

    updateExamineStatus() {
      console.log("updateExamineStatus---------------")
      this.$Api.tutorManagement
        .getTeacherView(this.teacherId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.teacherStage = data.data.stage;
            this.teacherExamineStatus = data.data.examineStatus;
            this.$forceUpdate();
            if ([0, 1, 2, 3, 6].includes(this.teacherExamineStatus)) {
              this.activeName = "teacherArchives";
              if (this.$route.query.tabName)
                this.activeName = this.$route.query.tabName;
            } else {
              this.activeName = "examineTimeLine";
            }
          }
        });
    }
  },
  created() {
    
    this.setPageTitle(this.$route.query.teacherName);
    this.updateExamineStatus();

    this.getDeviceCheck();
  },

  
};
</script>

<style lang="scss" scoped>
.teacherInfoWrapper {
  padding: 15px;
  position: relative;
  .reset-tutor-psw {
    position: absolute;
    right: 15px;
    z-index: 999;
  }
}
.without-line {
  text-align: center;
  color: #666;
  padding-top: 20px;
}
</style>
