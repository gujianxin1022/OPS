<template>
  <div class="my-class-info-contain">
    <div class="m-class-info">
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级编号")
        }}</span>
        <span>{{ groupDetailsInfo.classNo }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级中文名称")
        }}</span>
        <span>{{ groupDetailsInfo.classNameZh }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级英文名称")
        }}</span>
        <span>{{ groupDetailsInfo.className }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级规模")
        }}</span>
        <span>{{ groupDetailsInfo.classTypeId | mapClassType }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("收费标准")
        }}</span>
        <span v-if="groupDetailsInfo.classCategory">{{
          groupDetailsInfo.classCategory | mapRechargeRule
        }}</span>
        <span v-else>{{ $t("无") }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("适用产品")
        }}</span>
        <span>{{ groupDetailsInfo.coursePackageName }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级课程")
        }}</span>
        <span>{{
          currentLang == "en"
            ? groupDetailsInfo.lessonDescEN
            : groupDetailsInfo.lessonDescZH
        }}</span>
      </div>
      <div class="item">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("课节总数")
        }}</span>
        <span>{{ groupDetailsInfo.scheduleClassNum }}</span>
      </div>
      <div class="item" v-if="groupDetailsInfo.type === AUTOMATIC_CLASS">
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("班级老师")
        }}</span>
        <span>{{ groupDetailsInfo.tutorRealName }}</span>
      </div>
      <!-- 自动&正式 -->
      <div
        class="item"
        v-if="groupDetailsInfo.type == 1 && groupDetailsInfo.autoClassType == 2"
      >
        <span :class="currentLang === 'en' ? 'en-label' : 'label'">{{
          $t("是否自动续排")
        }}</span>
        <span>{{ groupDetailsInfo.isRenew == 1 ? $t("是") : $t("否") }}</span>
      </div>
      <div class="btn-box">
        <el-button
          type="primary"
          size="mini"
          @click="handleClickChangeClassTeacher"
          v-if="
            groupDetailsInfo.type === AUTOMATIC_CLASS &&
            Per.handleButtonPer('teach.groupMT.groupList.changeClassTeacher')
          "
        >
          {{ $t("更换班级老师") }}
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="showEditGroupProgressDialog()"
          v-if="
            Per.handleButtonPer(
              'teach.groupMT.groupList.clAdjustClassProgress'
            ) && groupScale == 2
          "
          >{{ $t("调整班级进度") }}</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="showEditGroupNameDialog()"
          v-if="
            Per.handleButtonPer('teach.groupMT.groupList.clModifyClassName')
          "
          >{{ $t("修改班级名称") }}</el-button
        >
      </div>
    </div>
    <div class="p10 tr">
      <el-button-group class="mb20 fl">
        <el-button
          size="medium"
          @click="type = 1"
          :type="type == 1 ? 'primary' : ''"
          >{{ $t("上课安排") }}</el-button
        >
        <el-button
          size="medium"
          @click="type = 2"
          :type="type == 2 ? 'primary' : ''"
          >{{ $t("历史课程") }}</el-button
        >
      </el-button-group>
      <template v-if="type == 1">
        <el-button
          class="btn-class-info"
          type="primary"
          @click="showCreateClass"
          v-if="
            Per.handleButtonPer(
              'teach.groupMT.classInfo.cdNewCourseArrangement'
            )
          "
          >{{ $t("新建排课") }}</el-button
        >
        <el-button
          class="btn-class-info"
          type="primary"
          @click="setTeacherMore(Constants.setTeacher)"
          v-if="
            Per.handleButtonPer(
              'teach.groupMT.classInfo.cdBulkArrangementOfTeachers'
            )
          "
          >{{ $t("批量安排老师") }}</el-button
        >
        <el-button
          class="btn-class-info"
          type="primary"
          @click="changeTeacherMore(Constants.changeTeacher)"
          v-if="
            Per.handleButtonPer(
              'teach.groupMT.classInfo.cdChangeTeachersInBatches'
            )
          "
          >{{ $t("批量更换老师") }}</el-button
        >
        <el-button
          class="btn-class-info"
          type="primary"
          @click="deleteItemMore"
          v-if="
            Per.handleButtonPer('teach.groupMT.classInfo.cdDeleteCoursesInBulk')
          "
          >{{ $t("批量删除课程") }}</el-button
        >
      </template>
    </div>
    <!-- 排课列表 start -->
    <el-table
      v-if="type == 1"
      v-loading="classLoading"
      ref="multipleTable"
      :data="groupTimetableList"
      tooltip-effect="dark"
      height="400"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      style="width: 100%"
      :border="false"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" :width="currentLang == 'en' ? 180 : 80">
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
        align="center"
        :prop="currentLang == 'en' ? 'lessonDescEN' : 'lessonDescZH'"
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
        prop="tutorRealName"
        :label="$t('my-home-Teacher\'s Nickname')"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tutorIdentityName"
        :label="$t('老师真实姓名')"
        align="center"
      >
      </el-table-column>
      <el-table-column width="180" align="center" :label="$t('操作')">
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.tutorUserId &&
              Per.handleButtonPer(
                'teach.groupMT.classInfo.cdSingleClassScheduleTeacher'
              )
            "
            @click.native.prevent="
              setTeacher(
                scope.$index,
                groupTimetableList,
                Constants.changeTeacher
              )
            "
            type="text"
            size="small"
          >
            {{ $t("更换老师") }}
          </el-button>
          <el-button
            v-if="
              !scope.row.tutorUserId &&
              Per.handleButtonPer(
                'teach.groupMT.classInfo.cdSingleClassScheduleTeacher'
              )
            "
            @click.native.prevent="
              setTeacher(scope.$index, groupTimetableList, Constants.setTeacher)
            "
            type="text"
            size="small"
          >
            {{ $t("安排老师") }}
          </el-button>
          <el-popconfirm
            v-if="
              Per.handleButtonPer(
                'teach.groupMT.classInfo.cdSingleLessonDeletion'
              )
            "
            :confirmButtonText="$t('删除')"
            :cancelButtonText="$t('不删除')"
            icon="el-icon-info"
            iconColor="red"
            placement="left"
            :title="$t('确定删除本节课吗')"
            @confirm="deleteItem(scope.$index, groupTimetableList)"
          >
            <el-button type="text" size="small" slot="reference">{{
              $t("删除本节课")
            }}</el-button>
          </el-popconfirm>
          <!-- 课堂学生 -->
          <el-popover
            v-if="scope.row.virtualclassId > 0"
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
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      v-if="type == 1"
      class="mb20"
      :total="groupTimetableListTotal"
      :current-page="groupTimetableListPage"
      :pageSize="groupTimetableListPageSize"
      @getCurrentPage="getGroupTimetableListCurrentPage"
      @getPerPage="getGroupTimetableListPerPage"
    />
    <!-- 排课列表 end -->
    <!-- 班级成员 start -->
    <custom-card v-if="type == 1" :title="$t('班级成员')" class="table-wrapper">
      <el-select
        :class="{ 'input-width': currentLang === 'en' }"
        v-if="groupDetailsInfo.classTypeId == 3"
        clearable
        slot="header-right"
        v-model="studentRegFlag"
        :placeholder="$t('是否为大班课用户')"
      >
        <el-option
          v-for="item in studentRegList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
        prefix-icon="el-icon-search"
        style="width: 300px; margin: 0 10px"
        slot="header-right"
        v-model="searchUserName"
        v-if="groupScale != 2"
        :placeholder="$t('请输入学生或者家长按下回车查询')"
        @keyup.enter.native="checkGroupStudents"
      ></el-input>
      <el-button
        v-if="groupDetailsInfo.classTypeId == 3"
        type="primary"
        slot="header-right"
        @click="bigGroupJoin"
        >{{ $t("批量加入") }}</el-button
      >
      <el-button
        type="primary"
        slot="header-right"
        @click="addNewStudent"
        v-if="Per.handleButtonPer('teach.groupMT.classInfo.cdJoinStudents')"
        >{{ $t("加入学生") }}</el-button
      >
      <el-table
        v-loading="classStudentsLoading"
        :data="groupStudentsList"
        height="400px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column
          property="student_user.real_name"
          align="center"
          :label="$t('学生名字')"
          width="120"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/studentManagement/studentInfo`,
                query: {
                  studentId: scope.row.sid,
                  studentName: scope.row.studentName,
                },
              }"
            >
              <el-button type="text">{{ scope.row.studentName }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="160"
          prop="sid"
          :label="$t('学生ID')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          width="160"
          prop="parentName"
          :label="$t('家长ID')"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/studentManagement/parentInfo`,
                query: { parentUserId: scope.row.pid },
              }"
            >
              <el-button type="text">{{ scope.row.pid }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('国家')" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.countryOfResidence }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          :label="$t('my-home-Gender')"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ Filters.mapGender(scope.row.gender, currentLang) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" align="center" :label="$t('my-home-Age')">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="birthday"
          align="center"
          width="220"
          :label="$t('是否为大班课用户')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userSource == 1 ? $t("是") : $t("否") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="countryOfResidence"
          :label="$t('所在地')"
          align="center"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="adviserUserName"
          :label="$t('课程顾问')"
          align="center"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="xgUserName"
          :label="$t('common-Learning Advisor')"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="dateJoinTime"
          align="center"
          :label="$t('加入班级时间')"
          width="210"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.dateJoinTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 150 : 80"
          align="center"
          :label="$t('操作')"
        >
          <template slot-scope="scope">
            <el-button
              v-if="hasRemovePermission(scope.row)"
              type="text"
              size="small"
              @click="deleteFromClass(scope.$index, groupStudentsList)"
              >{{ $t("移出班级") }}</el-button
            >
            <el-button
              v-if="
                Per.handleButtonPer('teach.groupMT.classInfo.translateClass')
              "
              type="text"
              size="small"
              @click="handleTranslate(scope.row)"
              >{{ $t("转班") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pb20 clearfix" v-if="groupScale != 2">
        <custom-pagination
          :total="groupStudentsListTotal"
          :current-page="groupStudentsListPage"
          @getCurrentPage="getGroupCurrentPage"
          @getPerPage="getGroupPerPage"
        />
      </div>
    </custom-card>
    <HistoryCourseList
      v-if="groupDetailsInfo.id && type == 2"
      :classId="groupDetailsInfo.id"
      :groupId="groupId"
      :matchTeacherTime="matchTeacherTime"
      :classTimetableIds="classTimetableIds"
      :changeOrSetStatus="changeOrSetStatus"
      :groupDetailsInfo="groupDetailsInfo"
      :groupScale="groupScale"
    />
    <!-- 班级成员 end -->
    <CreateClassTime
      :groupDetailsInfo="groupDetailsInfo"
      :show="showCreate"
      @getGroupTimetable="handleSearchGroupTimetableList"
      @getGroupInfo="getGroupInfo"
      :hideButton="false"
      @close="showCreate = false"
    ></CreateClassTime>
    <MatchTeacher
      @close="closeMatchTeacher"
      @getGroupTimetable="handleSearchGroupTimetableList"
      :show="showMatchTeacher"
      :matchTeacherTime="matchTeacherTime"
      :classTimetableIds="classTimetableIds"
      :changeOrSetStatus="changeOrSetStatus"
      :groupDetailsInfo="groupDetailsInfo"
      :groupScale="groupScale"
      :subjectType="groupDetailsInfo.subjectType"
    ></MatchTeacher>
    <AddStudent
      :groupDetailsInfo="groupDetailsInfo"
      :show="showAddStudent"
      @close="showAddStudent = false"
      @getGroupInfo="getGroupInfo"
    ></AddStudent>
    <BigGroupJoin
      :show="showBigGroupDialog"
      @close="showBigGroupDialog = false"
      @getGroupInfo="getGroupInfo"
      :groupDetailsInfo="groupDetailsInfo"
    ></BigGroupJoin>
    <!--  修改班级名称-->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('修改班级名称')"
      :visible.sync="editGroupName"
    >
      <el-row>
        <el-col class="flex">
          <span style="width: 100px; margin: 10px 0">{{ $t("班级名称") }}</span>
          <el-input
            v-model.trim="editGroupNameData.newGroupName"
            :placeholder="$t('glb-input') + $t('新的班级名称')"
          />
        </el-col>
        <el-col class="flex">
          <span style="width: 100px; margin: 10px 0">{{
            $t("英文班级名称")
          }}</span>
          <el-input
            v-model.trim="editGroupNameData.newGroupNameEn"
            :placeholder="$t('glb-input') + $t('新的英文班级名称')"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col class="flex jcc">
          <el-button
            class="mt20"
            type="primary"
            size="medium"
            @click="closeGroupNameDialog"
            >{{ $t("取消") }}</el-button
          >
          <el-button
            class="mt20"
            type="primary"
            size="medium"
            @click="submitGroupNameResult"
            >{{ $t("提交") }}</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 补课删除课堂弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="cannotDeleteDialog"
      width="30%"
      append-to-body
      center
      :before-close="handleClose"
    >
      <span
        >计划删除的课堂中包含了<span style="color: red">调入补课的学生</span>
        ，无法删除</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cannotDeleteDialog = false">{{
          $t("我知道了")
        }}</el-button>
      </span>
    </el-dialog>
    <ChangeClassTeacher
      :classId="groupDetailsInfo.id"
      :visible.sync="changeClassTeacherVisible"
      @ok="getGroupInfo"
      :subjectType="groupDetailsInfo.subjectType"
    />
    <!-- 转班 -->
    <TranslateClass
      v-if="showTranslateClassDialog"
      :visible.sync="showTranslateClassDialog"
      @translateSucess="translateSucessCb"
      :refferInfo="currentInfo"
      @closeTranslateDialog="closeTranslateDialog"
    />
    <AdjustClassProgress
      v-if="editGroupProgress"
      @close="editGroupProgress = false"
      :groupDetailsInfo="groupDetailsInfo"
      :visible.sync="editGroupProgress"
      :groupScale="groupScale"
      @refresh="getGroupInfo(), handleSearchGroupTimetableList()"
    />
    <!-- 移除班级原因弹窗 -->
    <ReasonForRemoveClassMember
      :studentId="currentStudentId"
      :classId="groupDetailsInfo.id"
      v-if="showReasonFormDialog"
      :visible.sync="showReasonFormDialog"
      @removeSuccess="removeSuccess"
    />
  </div>
</template>
<script>
import CreateClassTime from "./createClassTime.vue";
import AdjustClassProgress from "./adjustClassProgress.vue";
import MatchTeacher from "./matchTeacher.vue";
import AddStudent from "./addStudent.vue";
import BigGroupJoin from "./bigGroupJoin.vue";
import { mapGetters } from "vuex";
import { AUTOMATIC_CLASS } from "@/utils/constants";
import { getStorage } from "@/utils/handleStorage";
import {
  changeSmallGroupProgress,
  changeBigGroupProgress,
  changeGroupName,
  repMemberlist,
  translateClassBeforeCheck,
} from "@/api/groupManagement";
import HistoryCourseList from "../groupListSub/historyCourseList";
import ChangeClassTeacher from "./changeClassTeacher";
import TranslateClass from "./translateClassDialog.vue";
import { ABNORMAL_CODE } from "@/utils/constants";
import ReasonForRemoveClassMember from "./ReasonForRemoveClassMember.vue";
export default {
  components: {
    CreateClassTime,
    MatchTeacher,
    AddStudent,
    BigGroupJoin,
    HistoryCourseList,
    ChangeClassTeacher,
    TranslateClass,
    AdjustClassProgress,
    ReasonForRemoveClassMember,
  },
  data() {
    return {
      AUTOMATIC_CLASS,
      changeClassTeacherVisible: false,
      showTranslateClassDialog: false,
      type: 1, //上课安排&历史课程->active status
      editGroupProgress: false,
      editGroupName: false,
      editGroupNameData: {
        newGroupName: "",
        newGroupNameEn: "",
        classId: "",
      },
      classStudentsLoading: false,
      popoverLoading: false,
      showBigGroupDialog: false,
      cannotDeleteDialog: false,
      groupId: "",
      multipleSelection: [],
      classLoading: false,
      showAddStudent: false, // 显示加入学生弹窗
      showCreate: false, // 显示新建排课弹窗
      showMatchTeacher: false, // 安排老师弹窗
      //学生列表
      groupStudentsList: [], //班级成员列表
      groupStudentsListPageSize: 50,
      groupStudentsListPage: 1,
      //预排课列表
      groupTimetableList: [],
      groupTimetableListPage: 1,
      groupTimetableListPageSize: 50,
      groupTimetableListTotal: 0,
      //班级信息
      groupDetailsInfo: {}, //班级信息
      matchTeacherTime: [], // 预排课的时间列表
      classTimetableIds: [], //课表的标识列表
      changeOrSetStatus: "", //记录更换老师或者设置老师的状态标识
      studentRegList: [
        { label: "全部", value: -1 },
        { label: "是", value: "bigclass" },
        { label: "否", value: "other" },
      ],
      studentRegFlag: "",
      searchUserName: null,
      classMemberList: null, //班级学生
      repairMemberList: null, //补课学生
      currentInfo: {
        sid: null,
        classId: null,
        coursePackageId: null,
        studentName: "",
      },
      showReasonFormDialog: false,
      currentStudentId: null,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  watch: {
    studentRegFlag() {
      this.getGroupStudents();
    },
    type(newVal) {
      newVal === 1 && this.handleSearchGroupTimetableList();
    },
  },
  methods: {
    closeTranslateDialog() {
      this.showTranslateClassDialog = false;
      this.getGroupStudents();
    },
    translateSucessCb() {},
    handleClickChangeClassTeacher() {
      this.changeClassTeacherVisible = true;
    },
    // 获取当前登录用户是否是该学员学管
    hasRemovePermission(student) {
      const userInfo = JSON.parse(getStorage("userInfo"));
      let userType = userInfo.userType;
      let userId = userInfo.id;
      // 有学管角色
      if (userType.includes(3)) {
        // 是名下学生 || 权限树有权限
        if (
          (student.xgUserId && userId === student.xgUserId) ||
          this.Per.handleButtonPer("teach.groupMT.classInfo.cdMoveOutOfClass")
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        // 其他角色，直接走权限树
        return this.Per.handleButtonPer(
          "teach.groupMT.classInfo.cdMoveOutOfClass"
        );
      }
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
    // 调整班级进度
    showEditGroupProgressDialog() {
      this.editGroupProgress = true;
    },
    // 修改班级名称
    showEditGroupNameDialog(classObj) {
      this.editGroupNameData = {
        newGroupName: "",
        newGroupNameEn: "",
        classId: this.groupDetailsInfo.id,
        classTypeId: this.groupDetailsInfo.classTypeId,
      };
      this.editGroupName = true;
    },
    // 转班
    async handleTranslate(item) {
      const {
        status,
        data: { code },
      } = await translateClassBeforeCheck(
        item.sid,
        this.groupDetailsInfo.id
      ).finally(() => {});
      const { id, coursePackageId } = this.groupDetailsInfo;
      this.currentInfo.sid = item.sid;
      this.currentInfo.studentName = item.studentName;
      this.currentInfo.classId = id;
      this.currentInfo.coursePackageId = coursePackageId;
      if (code === ABNORMAL_CODE.hasLeaveClassCode) {
        this.$confirm(this.$t("转班请假校验"))
          .then((_) => {
            this.showTranslateClassDialog = true;
          })
          .catch((_) => {});
      }

      if (code === ABNORMAL_CODE.transferedInRecentTimeCode) {
        this.$confirm(this.$t("该学员在30天有过转班记录，是否继续转班"))
          .then((_) => {
            this.showTranslateClassDialog = true;
          })
          .catch((_) => {});
      }

      if (code === ABNORMAL_CODE.bothLeaveClassAndTransferedCode) {
        this.$confirm(this.$t("转班请假校验")).then((_) => {
          this.$confirm(this.$t("该学员在30天有过转班记录，是否继续转班")).then(
            (_) => {
              this.showTranslateClassDialog = true;
            }
          );
        });
      }

      if (status !== 200 || code !== 200) return Promise.reject();
      this.showTranslateClassDialog = true;
    },
    /**
     * 提交修改班级中英文名称
     */
    submitGroupNameResult() {
      const { newGroupName, newGroupNameEn, classId, classTypeId } =
        this.editGroupNameData;
      if (newGroupName === "" || newGroupNameEn === "") {
        this.$notify({
          message: "班级名称不能为空",
          type: "error",
        });
        return;
      }
      changeGroupName({
        classId: classId,
        classNameEn: newGroupNameEn,
        className: newGroupName,
        classTypeId: classTypeId,
      }).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            showClose: true,
            message: res.data.message,
            type: "success",
          });
          this.editGroupName = false;
          this.getGroupInfo();
        } else {
          this.$notify({
            showClose: true,
            message: res.data.message,
            type: "error",
          });
        }
      });
    },
    closeGroupNameDialog() {
      this.editGroupNameData = {
        newGroupNameEn: "",
        newGroupName: "",
        classId: "",
      };
      this.editGroupName = false;
    },
    checkGroupStudents() {
      this.groupStudentsListPage = 1;
      this.getGroupStudents();
    },
    getGroupPerPage(perPage) {
      this.groupStudentsListPageSize = perPage;
      this.getGroupStudents();
    },
    getGroupCurrentPage(page) {
      this.groupStudentsListPage = page;
      this.getGroupStudents();
    },
    //大班课批量加入
    bigGroupJoin() {
      this.showBigGroupDialog = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setTeacher(index, data, str) {
      //  未批量
      this.changeOrSetStatus = str;
      this.matchTeacherTime = [data[index].startTime];
      this.classTimetableIds = [data[index].id];
      this.showMatchTeacher = true;
    },
    setTeacherMore(str) {
      // 批量安排
      if (this.multipleSelection.length == 0) {
        this.$notify({
          message:
            this.currentLang == "en"
              ? "Please select the courses that need to be arranged in batches"
              : "请先选择需要批量安排老师的课程",
          type: "warning",
        });
        return;
      } else {
        // 判断选中的课程中是否存在已有课程安排过老师
        let flag = this.multipleSelection.some(
          (item) => item.tutorUsername != null
        );
        if (flag) {
          this.$notify({
            message:
              this.currentLang == "en"
                ? "There are courses with teachers in the selected course, please check"
                : "所选课程中存在已安排老师的课程，请排查",
            type: "error",
          });
          return;
        }
        this.changeOrSetStatus = str;
        this.multipleSelection.forEach((item) => {
          this.matchTeacherTime.push(item.startTime);
          this.classTimetableIds.push(item.id);
        });
        this.showMatchTeacher = true;
      }
    },
    changeTeacherMore(str) {
      if (this.multipleSelection.length == 0) {
        this.$notify({
          message:
            this.currentLang == "en"
              ? "Please select the courses that need to change teachers in batches"
              : "请先选择需要批量更换老师的课程",
          type: "warning",
        });
        return;
      } else {
        //判断所选课程是否有课程未安排老师
        let flag = this.multipleSelection.some(
          (item) => item.tutorUsername === null
        );
        if (flag) {
          this.$notify({
            message:
              this.currentLang == "en"
                ? "There are no teacher courses in the selected course, please check"
                : "所选课程中存在未安排老师的课程，请排查",
            type: "error",
          });
          return;
        } else {
          this.changeOrSetStatus = str;
          this.multipleSelection.forEach((item) => {
            this.matchTeacherTime.push(item.startTime);
            this.classTimetableIds.push(item.id);
          });
          this.showMatchTeacher = true;
        }
      }
    },
    deleteTimetabel(dataArray) {
      if (this.groupDetailsInfo.classTypeId == 2) {
        this.$Api.groupManagement
          .cancelSmallClassTimeTabel({
            classId: this.groupDetailsInfo.id,
            classTimetableIdList: dataArray,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.handleSearchGroupTimetableList();
              this.getGroupInfo();
              this.$notify({
                message: this.$t("取消预排课成功"),
                type: "success",
              });
            }
          });
      } else {
        this.$Api.groupManagement
          .cancelBigClassTimeTabel({
            classId: this.groupDetailsInfo.id,
            classTimetableIdList: dataArray,
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.handleSearchGroupTimetableList();
              this.getGroupInfo();
              this.$notify({
                message: this.$t("取消预排课成功"),
                type: "success",
              });
            }
          });
      }
    },
    deleteItem(index, data) {
      let dataArray = [data[index].id];
      this.deleteTimetabel(dataArray);
    },
    deleteItemMore() {
      if (this.multipleSelection.length == 0) {
        this.$notify({
          message:
            this.currentLang == "en"
              ? "Please select the courses to be deleted in batch"
              : "请先选中需要批量删除的课程",
          type: "warning",
        });
        return;
      }
      this.$confirm(this.$t("确定删除选中课程吗？"))
        .then((_) => {
          let deleteArr = [];
          this.multipleSelection.forEach((item) => {
            deleteArr.push(item.id);
          });
          this.deleteTimetabel(deleteArr);
        })
        .catch((_) => {});
    },
    addNewStudent() {
      this.showAddStudent = true;
    },
    deleteFromClass(index, data) {
      if (this.groupDetailsInfo.classTypeId == 2) {
        this.currentStudentId = data[index].sid;
        this.showReasonFormDialog = true;
      } else {
        this.$Api.groupManagement
          .removeBigClassStudent({
            class_id: this.groupDetailsInfo.id,
            student_id: data[index].sid,
          })
          .then((res) => {
            if (res.data.code == 200) {
              if (this.groupStudentsList.length == 1)
                this.handleSearchGroupTimetableList();
              this.getGroupStudents();
              this.$notify({
                message: res.data.message,
                type: "success",
              });
            }
          });
      }
    },
    removeSuccess() {
      if (this.groupStudentsList.length == 1)
        this.handleSearchGroupTimetableList();
      this.getGroupStudents();
    },

    closeMatchTeacher() {
      this.showMatchTeacher = false;
      this.classTimetableIds = [];
      this.matchTeacherTime = [];
    },
    showCreateClass() {
      this.showCreate = true;
    },
    getGroupInfo() {
      if (this.groupScale == 2) {
        this.$Api.classManagement
          .getSmallClassBaseInfo(this.groupId)
          .then(({ status, data }) => {
            this.groupDetailsInfo = data.data;
          });
      } else {
        this.$Api.classManagement
          .getBigClassBaseInfo(this.groupId)
          .then(({ status, data }) => {
            this.groupDetailsInfo = data.data;
          });
      }
      this.getGroupStudents();
    },
    handleSearchGroupTimetableList() {
      this.groupTimetableListPage = 1;
      this.getGroupTimetable();
    },
    getGroupTimetableListCurrentPage(page) {
      this.groupTimetableListPage = page;
      this.getGroupTimetable();
    },
    getGroupTimetableListPerPage(perPage) {
      this.groupTimetableListPageSize = perPage;
      this.getGroupTimetable();
    },
    getGroupTimetable() {
      this.classLoading = true;
      const {
        groupTimetableListPage: pageNum,
        groupTimetableListPageSize: pageSize,
        groupId,
      } = this;
      if (this.groupScale == 2) {
        this.$Api.groupManagement
          .getGroupDetailsTimetable(pageNum, pageSize, groupId)
          .then((res) => {
            if (res.data.code === 200) {
              this.groupTimetableList = res.data.data?.list ?? [];
              this.groupTimetableListTotal = res.data.data?.total ?? 0;
            }
            this.classLoading = false;
          });
      } else {
        this.$Api.groupManagement
          .getBigGroupDetailsTimetable(pageNum, pageSize, groupId)
          .then((res) => {
            if (res.data.code === 200) {
              this.groupTimetableList = res.data.data?.list ?? [];
              this.groupTimetableListTotal = res.data.data?.total ?? 0;
            }
            this.classLoading = false;
          });
      }
    },
    getGroupStudents() {
      this.classStudentsLoading = true;
      if (this.groupScale == 2) {
        this.$Api.groupManagement
          .getGroupStudents(this.groupId, this.searchUserName)
          .then((res) => {
            this.groupStudentsList = res.data.data;
            this.classStudentsLoading = false;
          });
      } else {
        this.$Api.groupManagement
          .getBigGroupStudents(
            this.groupId,
            this.groupStudentsListPage,
            this.groupStudentsListPageSize,
            this.searchUserName,
            this.studentRegFlag
          )
          .then((res) => {
            this.groupStudentsList = res.data.data.list;
            this.groupStudentsListTotal = res.data.data.total;
            this.classStudentsLoading = false;
          });
      }
    },
  },
  created() {
    if (this.$route.query.id) {
      window.sessionStorage.setItem("group", JSON.stringify(this.$route.query));
    }
    if (window.sessionStorage.getItem("group")) {
      this.groupId = JSON.parse(window.sessionStorage.getItem("group")).id;
      this.groupScale = JSON.parse(window.sessionStorage.getItem("group")).type;
    } else {
      this.groupId = this.$route.query.id;
      this.groupScale = this.$route.query.type;
    }
    this.getGroupInfo();
    this.handleSearchGroupTimetableList();
  },
};
</script>
<style lang="scss">
.my-class-info-contain {
  .flex {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 !important;
    span {
      display: inline-block;
      width: 37px;
    }
  }
  .jcc {
    justify-content: center;
  }

  .active {
    background-color: #5cc2d0;
    border: 1px solid #5cc2d0;
    color: white;
  }
}
.m-class-info {
  font-size: 14px;
  line-height: 2;
  padding: 20px 0;
  position: relative;
  span {
    display: inline-block;
  }
  // span:nth-child(odd) {
  //   width: 150px;
  // }
  .label {
    width: 150px;
  }
  .en-label {
    width: 230px;
  }
  .table-wrapper {
    margin-top: 10px;
  }
  .btn-class-info {
    margin-bottom: 10px;
  }
  .input-width {
    .el-input__inner {
      width: 248px !important;
    }
  }
  .btn-box {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
