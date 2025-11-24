<template>
  <div class="history-course-list-warp">
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      height="400"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      style="width: 100%"
      :border="false"
    >
      <el-table-column align="center" :label="$t('序号')" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.usageType == 2">{{
            $t("异常补课")
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('上课时间')" align="center">
        <template slot-scope="scope">
          <span
            >{{ DateTimeUtils.dateClockTime(scope.row.startTime) }} ({{
              Filters.mapWeek(
                new Date(scope.row.startTime).getDay(),
                currentLang === "en"
              )
            }})</span
          >
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('my-home-Curriculum')"
        :prop="currentLang == 'en' ? 'lessonDescEN' : 'lessonDescZH'"
        align="center"
      />
      <el-table-column
        prop="tutorIdentityName"
        :label="$t('教师用户名')"
        align="center"
      >
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.tutorIdentityName"
            target="_blank"
            :to="{
              path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.tutorRealName}`,
            }"
          >
            <el-button type="text">{{ scope.row.tutorIdentityName }}</el-button>
          </router-link>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tutorIdentityName"
        :label="$t('my-home-Teacher\'s Nickname')"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tutorRealName"
        :label="$t('老师真实姓名')"
        align="center"
      >
      </el-table-column>
      <el-table-column align="center" :label="$t('课堂状态')">
        <template slot-scope="scope">
          <span v-if="!scope.row.status">-</span>
          <span v-else>{{
            scope.row.status === 3 ? "正常结束" : "异常结束"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作')">
        <template slot-scope="scope">
          <!-- 回放 -->
          <el-button
            type="text"
            @click="clickHandlerPlayback(scope.row.virtualclassId)"
            >{{ $t("回放") }}</el-button
          >
          <!-- 课堂学生 -->
          <el-popover
            placement="left"
            width="400"
            trigger="click"
            @show="reqClassMember(scope.row.virtualclassId)"
          >
            <div
              v-loading="popoverLoading"
              v-if="classMemberList && repairMemberList"
            >
              <div v-if="classMemberList.length > 0">
                <p>{{ $t("班级学生") }}</p>
                <el-form label-width="160px">
                  <el-form-item
                    v-for="(item, index) in classMemberList"
                    :key="index"
                    :label="item.studentRealName"
                  >
                    <el-tag v-if="item.isLeave == 1" size="mini">{{
                      $t("请假")
                    }}</el-tag>
                    <el-tag
                      type="success"
                      v-if="item.isAdjust == 1"
                      size="mini"
                      >{{ $t("调课") }}</el-tag
                    >
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="repairMemberList.length > 0">
                <p>{{ $t("补课学生") }}</p>
                <el-form label-width="160px">
                  <el-form-item
                    v-for="(item, index) in repairMemberList"
                    :key="index"
                    :label="item.studentRealName"
                  >
                    <el-tag v-if="item.isLeave == 1" size="mini">{{
                      $t("请假")
                    }}</el-tag>
                    <el-tag
                      type="success"
                      v-if="item.isAdjust == 1"
                      size="mini"
                      >{{ $t("调课") }}</el-tag
                    >
                  </el-form-item>
                </el-form>
              </div>
              <div
                v-if="
                  classMemberList.length <= 0 && repairMemberList.length <= 0
                "
              >
                {{ $t("暂无学生") }}
              </div>
            </div>
            <el-button type="text" slot="reference">{{
              $t("课堂学生")
            }}</el-button>
          </el-popover>
          <!-- 异常补课 -->
          <el-button
            v-if="
              scope.row.status == 4 &&
              scope.row.repairVritualclassId == null &&
              (scope.row.leaveStudentCount > 0 ||
                scope.row.actualStudentCount > 0)
            "
            type="text"
            @click="handelClick(scope.row)"
            size="small"
          >
            {{ $t("异常补课") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :current-page="pageNum"
      @getCurrentPage="getGroupCurrentPage"
      @getPerPage="getGroupPerPage"
    />
    <!-- 异常补课弹窗 -->
    <el-dialog
      :title="$t('异常补课')"
      :visible.sync="showDialog"
      width="600px"
      @close="handleClose"
    >
      <div class="history-dialog">
        <el-row>
          <el-col :span="12">
            <el-row :gutter="10">
              <el-col :span="8">{{ $t("补课日期") }}</el-col>
              <el-col :span="16">
                <el-date-picker
                  v-model="date"
                  type="date"
                  @change="changeTime"
                  value-format='"yyyy-MM-dd'
                  :placeholder="$t('选择日期')"
                  :picker-options="pickerOptions"
                >
                </el-date-picker
              ></el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">{{ $t("补课时间") }}</el-col>
          <el-col :span="20">
            <el-select v-model="timeInd" :placeholder="$t('选择时间段')">
              <el-option
                v-for="(ite, i) in Constants.startClassTimeData"
                :key="i"
                :label="ite.label"
                :value="ite.value"
              ></el-option>
            </el-select>
            <el-time-select
              v-model="time"
              :picker-options="Constants.startClassTimeOfData[timeInd]"
              :placeholder="$t('选择时间')"
              @change="changeTime"
            >
            </el-time-select>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="4">{{ $t("补课老师") }}</el-col>
          <el-col :span="20">
            <el-button
              style="padding: 0"
              @click="showMatchTeacherDialog"
              v-if="!teacher"
              type="text"
              >{{ $t("请选择补课老师") }}</el-button
            >
            <el-button
              style="padding: 0"
              @click="showMatchTeacherDialog"
              v-if="teacher"
              type="text"
              >{{ $t("重新选择") }}</el-button
            >
            <div v-if="teacher">
              <p>{{ $t("账号") }}：{{ teacher.userName }}</p>
              <p>{{ $t("姓名") }}：{{ teacher.identityName }}</p>
              <p>{{ $t("昵称") }}：{{ teacher.realName }}</p>
              <p>{{ $t("电话") }}：{{ teacher.phone }}</p>
              <p>
                {{ $t("状态") }}：{{
                  teacherStatus(teacher.status, teacher.hide, teacher.working)
                }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t("取消") }}</el-button>
        <el-button :disabled="!disableBtn" type="primary" @click="submit">{{
          $t("创建异常补课")
        }}</el-button>
      </span>
    </el-dialog>
    <MatchTeacher
      @close="closeMatchTeacher"
      :show="showMatchTeacher"
      :matchTeacherTime="matchTeacherTime"
      :classTimetableIds="classTimetableIds"
      :changeOrSetStatus="changeOrSetStatus"
      :groupDetailsInfo="groupDetailsInfo"
      :groupScale="groupScale"
      :isFromCreate="false"
      @choose="chooseTeacher"
    ></MatchTeacher>
    <ClassCallBack
      :classType="groupDetailsInfo.classTypeId"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="handleCloseCallBack"
    ></ClassCallBack>
  </div>
</template>

<script>
import {
  repMemberlist,
  getHistoryList,
  repairException,
} from "@/api/groupManagement";
import MatchTeacher from "../components/matchTeacher.vue";
import ClassCallBack from "../../../components/ClassCallBack";
import { mapGetters } from "vuex";

import moment from "moment";
export default {
  name: "historyCourseList",
  components: {
    MatchTeacher,
    ClassCallBack,
  },
  props: {
    classId: {
      type: "String",
      default: "",
    },
    groupId: {
      type: "String",
      default: "",
    },
    classTimetableIds: {
      type: Array,
      default: () => [],
    },
    changeOrSetStatus: {
      type: String,
      default: "",
    },
    groupDetailsInfo: {
      type: Object,
      default: () => {},
    },
    groupScale: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      teacher: null,
      pageNum: 1,
      pageSize: 50,
      list: [],
      total: 1,
      loading: false,
      optRow: {},
      showDialog: false,
      timeInd: "",
      date: "",
      time: "",
      reqData: {},
      classMemberList: null, //班级学生
      repairMemberList: null, //补课学生
      popoverLoading: false,
      showMatchTeacher: false,
      matchTeacherTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      showCallBack: false,
      currentCallBackId: "",
      currentCBclassTypeId: 0,
    };
  },
  computed: {
    disableBtn() {
      if (this.date == null) return false;
      if (this.time == null) return false;
      return (
        this.teacher != null && this.date.length > 0 && this.time.length > 0
      );
    },
    ...mapGetters(["currentLang"]),
  },
  mounted() {
    this.reqList();
  },
  methods: {
    teacherStatus(status, hide, working) {
      if (status == 1 && working == 0 && hide == 1) {
        // 未上岗
        return this.$t("my-home-Not On-Board Yet");
      } else if (status == 1 && working == 0 && hide == 0) {
        // 未上岗
        return this.$t("my-home-Not On-Board Yet");
      } else if (status == 1 && working == 1 && hide == 0) {
        // 在岗
        return this.$t("my-home-On Duty");
      } else if (status == 1 && working == 1 && hide == 1) {
        // 老生可见
        return this.$t("my-home-Restricted Visibility");
      } else if (status == 0 && working == 0 && hide == 1) {
        // 离岗
        return this.$t("my-home-Resigned");
      } else if (status == 2 && working == 1 && hide == 1) {
        // 黑名单
        return this.$t("my-home-Blacklist");
      }
    },
    //关闭异常补课弹窗
    handleClose() {
      this.teacher = null;
      this.timeInd = "";
      this.date = "";
      this.time = "";
    },
    //选择补课老师
    chooseTeacher(teacher) {
      this.teacher = teacher;
      this.showMatchTeacher = false;
    },
    // 修改时间
    changeTime() {
      let time = `${this.date} ${this.time}`;
    },
    // 选择补课老师
    showMatchTeacherDialog() {
      if (this.date.length <= 0 || this.time <= 0) {
        this.$notify({
          showClose: true,
          message: this.$t("请先选择补课日期和时间"),
          type: "warning",
        });
        return;
      }
      this.matchTeacherTime = [];
      this.matchTeacherTime.push(
        moment(`${this.date} ${this.time}`).toISOString()
      );
      this.showMatchTeacher = true;
    },
    //请求班级学生
    reqClassMember(virtualclassId) {
      this.popoverLoading = true;
      repMemberlist(virtualclassId).then((res) => {
        if (res.status == 200 && res.data.code == 200) {
          this.classMemberList = res.data.data.classMemberList || [];
          this.repairMemberList = res.data.data.repairMemberList || [];
          this.popoverLoading = false;
        }
      });
    },
    reqList() {
      this.loading = true;
      getHistoryList(this.classId, this.pageNum, this.pageSize).then((res) => {
        this.list = res.data?.data?.list ?? [];
        this.total = res.data?.data?.total;
        this.pageNum = res.data?.data?.pageNum;
        this.loading = false;
      });
    },
    getGroupCurrentPage(page) {
      this.pageNum = page;
      this.reqList();
    },
    getGroupPerPage(perPage) {
      this.pageSize = perPage;
      this.reqList();
    },
    handelClick(row) {
      this.optRow = row;
      this.showDialog = true;
    },
    submit() {
      let reqData = {
        classId: this.classId,
        startTime: moment(`${this.date} ${this.time}`).toISOString(),
        tutorUserId: this.teacher.tutorUserId,
        virtualclassId: this.optRow.virtualclassId,
      };
      repairException(reqData).then((res) => {
        if (res.status == 200 && res.data.code == 200) {
          this.showDialog = false;
          this.reqList();
        }
      });
    },
    //关闭匹配老师
    closeMatchTeacher() {
      this.showMatchTeacher = false;
    },
    // 课堂回放
    clickHandlerPlayback(virtualclassId) {
      this.currentCallBackId = virtualclassId;
      this.showCallBack = true;
    },
    handleCloseCallBack() {
      this.showCallBack = false;
    },
  },
};
</script>

<style scoped lang='scss'>
.history-course-list-warp {
}
</style>
<style lang='scss'>
.history-dialog {
  .el-row {
    margin-bottom: 10px;
  }
  .el-input--small .el-input__inner {
    // width: 160px !important;
  }
}
</style>
