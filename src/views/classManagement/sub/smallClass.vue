<template>
  <div class="onebyone-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <!-- 上课日期 -->
      <screen-item
        :label="$t('课程开始日期')"
        :part="4"
        :label-width="currentLang == 'en' ? 110 : labelWidth"
      >
        <el-radio-group v-model="screenData.searchDay" @change="changeRadion">
          <el-radio-button label="0">{{ $t("my-home-Today") }}</el-radio-button>
          <el-radio-button label="1">
            {{ $t("my-home-Tomorrow") }}
          </el-radio-button>
          <el-radio-button label="2">
            {{ $t("my-home-The Day After Tomorrow") }}
          </el-radio-button>
          <el-radio-button label="7">
            {{ $t("my-home-Next 7 Days") }}
          </el-radio-button>
        </el-radio-group>
      </screen-item>
      <!-- 上课时间 -->
      <screen-item
        :label="$t('课程开始时间')"
        :part="4"
        style="margin-right: 30px"
        :label-width="labelWidth"
      >
        <el-date-picker
          v-model="applyDate"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          size="small"
          :default-time="['00:00:00', '23:59:59']"
          @change="timeChange"
        />
      </screen-item>
      <!-- 课程包 -->
      <screen-item :label="$t('可教课程')" :label-width="labelWidth" :part="10">
        <FilterByCoursePackage
          @changeEditionSelect="
            (val) => {
              screenData.coursePackageId = val;
            }
          "
          :classType="2"
        />
      </screen-item>
      <!-- 版本 -->
      <screen-item :label="$t('版本')" :label-width="labelWidth" :part="10">
        <FilterByEditionInPackage
          @changeSelect="
            (val) => {
              screenData.packageTreeId = val;
            }
          "
          :coursePackageId="screenData.coursePackageId"
        />
      </screen-item>
      <!-- 级别 -->
      <screen-item
        :label="$t('级别')"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByLevelInPackage
          @changeSelect="
            (val) => {
              levelId = val;
            }
          "
          :coursePackageId="screenData.coursePackageId"
          :packageTreeId="screenData.packageTreeId"
          @changeUnitOptions="
            (val) => {
              unitList = val;
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('单元')"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByUnitInPackage
          @changeSelect="
            (val) => {
              unitId = val;
            }
          "
          :levelId="levelId"
          :unitList="unitList"
          @changeLessonOptions="
            (val) => {
              lessonOptionsList = val;
            }
          "
        />
      </screen-item>
      <!-- lesson -->
      <screen-item
        :label="$t('Lesson')"
        :label-width="currentLang == 'en' ? 120 : labelWidth"
      >
        <FilterByLessonInPackage
          @changeSelect="
            (val) => {
              screenData.lessonIdList = val.join(',');
            }
          "
          :unitId="unitId"
          :lessonOptionsList="lessonOptionsList"
        />
      </screen-item>
      <!-- 课堂类型 -->
      <screen-item
        :label="$t('my-home-1-Class Type')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select v-model="screenData.courseType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in courseOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <!-- 是否异常 -->
      <screen-item
        :label="$t('my-home-Ended Status')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          style="width: 100px"
          v-model="screenData.exception"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in exceptionOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <!-- 是否新老师 -->
      <screen-item
        :label="$t('my-home-2-Teacher Status')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select v-model="screenData.teacher" :placeholder="$t('请选择')">
          <el-option
            v-for="item in teacherOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <!-- 学生用户名 -->
      <screen-item
        :label="$t('glb-student')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input
          v-model.trim="screenData.studentName"
          :placeholder="
            $t('glb-input') +
            (currentLang == 'en' ? $t('glb-...') : '学生用户名')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <!-- 是否代课 -->
      <screen-item
        :label="$t('my-home-Substitute Teacher or Not')"
        :part="4"
        :label-width="currentLang == 'en' ? 165 : labelWidth"
      >
        <el-select
          v-model="screenData.hasAbsentTutor"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in isAbsentList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <!-- 课堂模式 -->
      <screen-item :label="$t('课堂模式')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="screenData.virtualclassTypeId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in modeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
       <screen-item
        :label="$t('教师')"
        :part="10"
        :label-width="currentLang == 'en' ? 140 : labelWidth"
      >
        <FilterByUserAccount
          @change="
            (params) => {
              userParams = params;
            }
          "
        />
      </screen-item>
    </screen-wrapper>
    <div class="center-status mt10">
      <el-button-group>
        <el-button :type="type == 1 ? 'primary' : ''" @click="changeType(1)">
          {{ $t("全部") }}
        </el-button>
        <el-button :type="type == 2 ? 'primary' : ''" @click="changeType(2)">
          {{ $t("未开始") }}
        </el-button>
        <el-button :type="type == 3 ? 'primary' : ''" @click="changeType(3)">
          {{ $t("正在上课") }}
        </el-button>
        <el-button :type="type == 4 ? 'primary' : ''" @click="changeType(4)">
          {{ $t("已结束") }}
        </el-button>
      </el-button-group>
      <el-button
        style="margin-bottom: 10px; position: absolute; right: 0"
        type="primary"
        slot="header-right"
        v-show="conversionFlag()"
        @click="batchConversion"
        >{{ $t("schedule-Batch classroom conversion") }}</el-button
      >
    </div>
    <div class="table-wrap">
      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">
            {{ (screenData.page - 1) * screenData.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          sortable
          align="center"
          :label="$t('课程开始时间(北京)')"
          :width="currentLang == 'en' ? 200 : 160"
          prop="startTime"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('班级名称')"
          width="180"
          prop="studentName"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/groupManagement/classInfo`,
                query: { id: scope.row.classId, type: 2 },
              }"
            >
              <el-button type="text">{{ scope.row.classNameZh }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          :label="$t('glb-student')"
          :width="280"
          prop="studentName"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.memberVOList"
              :key="item.studentUserId"
              style="margin: 0"
            >
              <el-button type="text">
                <router-link
                  :to="{
                    path: `/studentManagement/studentInfo`,
                    query: {
                      studentId: item.studentUserId,
                      studentName: item.studentName,
                    },
                  }"
                  >{{ item.studentName }}</router-link
                >
              </el-button>
              <template v-if="type == 3">
                <el-tag
                  type="success"
                  v-if="item.virtualStudentStatus == '3'"
                  >{{ $t("已到") }}</el-tag
                >
                <el-tag type="danger" v-if="item.virtualStudentStatus == '1'">{{
                  $t("未到")
                }}</el-tag>
              </template>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('家长ID')"
          width="180"
          prop="parentName"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.memberVOList"
              :key="item.parentUserId"
              style="margin: 0"
            >
              <el-button type="text">
                <router-link
                  :to="{
                    path: `/studentManagement/parentInfo`,
                    query: { parentUserId: item.parentUserId },
                  }"
                  >{{ item.parentUserId }}</router-link
                >
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('schedule-课表')"
          width="180"
          :prop="currentLang === 'en' ? 'lessonDescEN' : 'lessonDescZH'"
        />
        <!-- 课程类型 -->
        <el-table-column
          align="center"
          :label="$t('my-home-1-Class Type')"
          :width="labelWidth"
        >
          <template slot-scope="scope">
            <p
              v-for="(item, index) in scope.row.memberVOList"
              :key="index"
              :class="item.courseType == 0 ? 'red' : 'green'"
            >
              {{ Filters.getCourseType(item.courseType, currentLang === "en") }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('教师ID')"
          width="180"
          prop="name"
        >
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorId}&teacherName=${scope.row.tutorRealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Teacher\'s Nickname')"
          :width="250"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tutorRealName }}</span>
            <template v-if="type == 3">
              <el-tag
                type="success"
                v-if="scope.row.virtualTeacherStatus == '3'"
                >{{ $t("上课中") }}</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.virtualTeacherStatus == '1'"
                >{{ $t("未到") }}</el-tag
              >
              <el-tag
                type="warning"
                v-if="scope.row.virtualTeacherStatus == '2'"
                >{{ $t("已到未上课") }}</el-tag
              >
            </template>
          </template>
        </el-table-column>
        <!-- 教管名称 -->
        <el-table-column
          align="center"
          :label="$t('教师管理人员')"
          :width="currentLang === 'en' ? 180 : 150"
          prop="tmUserName"
        />
        <!-- 教管名称 -->
        <el-table-column align="center" width="140" :label="$t('教师出席')">
          <template slot-scope="{ row }">
            {{
              Constants.getTeacherAttendStatus(
                currentLang,
                row.teacherAttendStatus
              )
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="140" :label="$t('学生出席')">
          <template slot-scope="{ row }">
            <p v-for="item in row.memberVOList" :key="item.studentUserId">
              {{
                Constants.getStudentAttendStatus(
                  currentLang,
                  item.studentAttendStatus
                )
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Lesson Taught')"
          width="180"
          prop="totalNumberOfClass"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-2-Teacher Status')"
          :width="currentLang == 'en' ? 110 : 100"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.totalNumberOfClass > 0 ? $t("不是") : $t("是")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('glb-Last Lesson Teacher')"
          width="150"
          prop="lastTeacher"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.lastTeacher">
              {{ scope.row.lastTeacher }}
            </span>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('glb-Class Mode')"
          :width="150"
          prop="name"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.virtualclassType | virtualclassType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('房间号')"
          :width="150"
          prop="roomId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('schedule-Time for students to enter class')"
          :width="currentLang == 'en' ? 200 : 180"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.memberVOList"
              :key="item.parentUserId"
              style="margin: 0"
            >
              <span>
                {{
                  DateTimeUtils.dateClockTime(item.enterTime).split(" ")[1] ||
                  "未知"
                }}
                ~
                {{
                  DateTimeUtils.dateClockTime(item.leaveTime).split(" ")[1] ||
                  "未知"
                }}
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="teacherStartTime"
          :label="$t('教师进出课堂时间')"
          :width="currentLang == 'en' ? 210 : 180"
        >
          <template slot-scope="scope">
            <el-button @click="viewClassRoomLog(scope.row)" type="text">
              <span>
                {{
                  DateTimeUtils.dateClockTime(scope.row.teacherStartTime).split(
                    " "
                  )[1] || "未知"
                }}
                ~
                {{
                  DateTimeUtils.dateClockTime(scope.row.teacherEndTime).split(
                    " "
                  )[1] || "未知"
                }}
              </span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          :label="$t('老师上下课时间')"
        >
          <template slot-scope="{ row }">
            <span>
              {{
                DateTimeUtils.dateClockTime(row.roomStartTime).split(" ")[1] ||
                "未知"
              }}
              ~
              {{
                DateTimeUtils.dateClockTime(row.roomEndTime).split(" ")[1] ||
                "未知"
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('顾问&学管')" width="150">
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.memberVOList"
              :key="item.studentUserId"
            >
              <el-popover placement="top-start" width="200" trigger="click">
                <div v-loading="infoLoading">
                  <p>{{ $t("学管") }}：{{ currentXgName }}</p>
                  <p>{{ $t("顾问") }}：{{ currentGwName }}</p>
                </div>
                <el-button
                  type="text"
                  slot="reference"
                  @click="getXgGw(item, scope.row)"
                  >{{ $t("点击查看") }}</el-button
                >
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('my-home-Stduent\'s Device')"
          width="150"
          prop="equipment"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.memberVOList"
              :key="item.parentUserId"
              style="margin: 0"
            >
              <span v-if="item.equipment">{{ item.equipment }}</span>
              <span v-else>---</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('schedule-Substitute Teacher')"
          :width="currentLang == 'en' ? 140 : 120"
          prop="absentTutorUser"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.absentTutorUser">
              {{ scope.row.absentTutorUser }}
            </span>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          :label="$t('my-home-Abnormal Reason')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.finishStatus | abnormalFinishedResult }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop :label="$t('操作')" width="350">
          <template slot-scope="scope">
            <!-- 旁听 -->
            <el-button
              v-if="
                scope.row.visitStatus == 1 &&
                Per.handleButtonPer('teach.classMT.scheduling.scVisit')
              "
              type="text"
              @click="clickHandlerMonitor(scope.row.id)"
              >{{ $t("旁听") }}</el-button
            >
            <!-- 旁听 -->
            <!-- 课堂转换 -->
            <el-button
              v-if="
                (scope.row.appointmentStatus == 2 ||
                  scope.row.appointmentStatus == 1) &&
                Per.handleButtonPer(
                  'teach.classMT.scheduling.scTransferOneClassType'
                )
              "
              type="text"
              @click="clickHandlerRevert(scope.row)"
              >{{ $t("my-home-Transfer Classroom") }}</el-button
            >
            <!-- 课堂转换 -->
            <!-- 安排代课 -->
            <el-button
              v-show="
                Per.handleButtonPer(
                  'teach.classMT.scheduling.scArrangeSubstitute'
                )
              "
              v-if="
                type == 2 ||
                screenData.searchDay == 1 ||
                screenData.searchDay == 2 ||
                screenData.searchDay == 7 ||
                scope.row.appointmentStatus == 1
              "
              type="text"
              @click="clickHandlerSubstitute(scope.row.id, 'Tutor', scope.row)"
              >{{ $t("my-home-Arrange Substitute Teacher") }}</el-button
            >
            <!-- 安排代课 -->
            <!-- 教师评语 -->
            <el-button
              v-if="
                scope.row.appointmentStatus == 3 ||
                scope.row.appointmentStatus == 4
              "
              type="text"
              @click="clickHandlerComment(scope.row.id, 'Student', scope.row)"
              >{{ $t("my-home-Teacher Feedback") }}</el-button
            >
            <!-- 教师评语 -->
            <!-- 学生反馈 -->
            <el-button
              v-if="
                (scope.row.appointmentStatus == 3 ||
                  scope.row.appointmentStatus == 4) &&
                Per.handleButtonPer(
                  'teach.classMT.scheduling.scStudentFeedback'
                )
              "
              type="text"
              @click="clickHandlerComment(scope.row.id, 'Tutor', scope.row)"
              >{{ $t("my-home-Student Feedback") }}</el-button
            >
            <!-- 学生反馈 -->
            <!-- 课堂回放 -->
            <el-button
              v-if="
                (scope.row.appointmentStatus == 3 ||
                  scope.row.appointmentStatus == 4) &&
                Per.handleButtonPer('teach.classMT.scheduling.scClassPlayback')
              "
              type="text"
              @click="clickHandlerPlayback(scope.row.id)"
              >{{ $t("课堂回放") }}</el-button
            >
            <!-- 课堂回放 -->
          </template>
        </el-table-column>
        <!-- 操作 -->
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.page"
        :pageSizes="[10, 20, 50, 100, 200]"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <!-- 单个课堂转换 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('my-home-Transfer Classroom')"
      :visible.sync="singleConversion"
      :before-close="closeSingleChangeFrom"
      width="30%"
      center
    >
      <div class="margin">
        <el-form
          ref="singleChangeFrom"
          :model="singleChangeFrom"
          :rules="changeClassrules"
        >
          <el-form-item
            :label="$t('教室类型')"
            label-width="80px"
            prop="virtualclassType"
          >
            <el-radio-group v-model="singleChangeFrom.virtualclassType">
              <el-radio :label="1">{{ $t("拓课云") }}</el-radio>
              <!-- <el-radio :label="2">{{ $t("百家云") }}</el-radio> -->
              <el-radio :label="3">{{ $t("LingoAce") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因" label-width="80px" prop="reason">
            <el-input
              v-model="singleChangeFrom.reason"
              minlength="10"
              maxlength="200"
              placeholder="请详细描述默认教室原因，不少于10字符"
              style="width: 80%"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSingleChangeFrom">
          {{ $t("later") }}
        </el-button>
        <el-button
          type="primary"
          @click="sureSingleConversion"
          :loading="sureSingleConversionLoading"
          >{{ $t("Determine conversion") }}</el-button
        >
      </span>
    </el-dialog>
    <!-- 批量课堂转换 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('schedule-Batch classroom conversion')"
      :visible.sync="conversionDialog"
      width="30%"
      center
      :before-close="handleCloseConversionDialog"
    >
      <div class="margin">
        <el-form
          ref="batchChangeFrom"
          :model="batchChangeFrom"
          :rules="changeClassrules"
        >
          <el-form-item
            :label="$t('教室类型')"
            label-width="80px"
            prop="virtualclassType"
          >
            <el-radio-group v-model="batchChangeFrom.virtualclassType">
              <el-radio :label="1">{{ $t("拓课云") }}</el-radio>
              <el-radio :label="3">{{ $t("LingoAce") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因" label-width="80px" prop="reason">
            <el-input
              v-model="batchChangeFrom.reason"
              minlength="10"
              maxlength="200"
              placeholder="请详细描述默认教室原因，不少于10字符"
              style="width: 80%"
            />
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="“批量固定默认教室”的原因相同，若实际为不同原因，请分别操作。"
            >
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseConversionDialog">
          {{ $t("later") }}
        </el-button>
        <el-button
          type="primary"
          @click="sureConversion"
          :loading="sureConversionLoading"
          >{{ $t("Determine conversion") }}</el-button
        >
      </span>
    </el-dialog>
    <!-- 安排代课 -->
    <SubstituteClass
      :currentType="currentType"
      :substituteFlag="substituteFlag"
      :currentClassInfo="currentClassInfo"
      @closeSubstituteFlag="closeSubstituteFlag"
      @getTableData="getTableData"
    ></SubstituteClass>
    <!-- 老师评语和学生反馈 -->
    <TeacherComments
      v-if="teacherComments"
      :teacherComments="teacherComments"
      :teacherInfo="teacherInfo"
      :commentsLoading="commentsLoading"
      :valuationrate="valuationrate"
      :studentFeedback="studentFeedback"
      :titleName="titleName"
      @getTableData="getTableData"
      @closeTeacherComments="closeTeacherComments"
    ></TeacherComments>
    <!-- 异常审核 -->
    <abnomalReview
      @closeAbnomalReview="closeAbnomalReview"
      :virtualclassData="virtualclassData"
      :abnormalLog="abnormalLog"
      @getTableData="getTableData"
      :currentType="currentType"
      :virtualclassId="virtualclassId"
    ></abnomalReview>
    <ClassCallBack
      :classType="2"
      :show="showCallBack"
      :currentCallBackId="currentCallBackId"
      @close="handleCloseCallBack"
    ></ClassCallBack>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('教室时间轴')"
      :visible.sync="showClassroomLog"
      width="680px"
    >
      <ClassRoomLog
        :classTypeId="2"
        :virtualclassId="currentRow.id"
        v-if="showClassroomLog"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showClassroomLog = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  virtualclassMonitor,
  virtualclassComment,
} from "@/api/classManagement/";
import SubstituteClass from "../../myWorkbench/components/substituteClass";
import TeacherComments from "../../myWorkbench/components/teacherComments";
import AbnomalReview from "../../myWorkbench/components/abnomalReview";
import ClassCallBack from "../../../components/ClassCallBack";
import { mapState, mapMutations, mapGetters } from "vuex";
import { deepClone } from "../../../utils/handleData";
import FilterByCoursePackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByCoursePackage";
import FilterByEditionInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByEditionInPackage";
import FilterByLevelInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByLevelInPackage";
import FilterByUnitInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByUnitInPackage";
import FilterByLessonInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByLessonInPackage";
import ClassRoomLog from "../components/ClassRoomLog.vue";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

import { COURSE_TYPE } from "@/utils/constants";
export default {
  components: {
    SubstituteClass,
    TeacherComments,
    AbnomalReview,
    ClassCallBack,
    FilterByCoursePackage,
    FilterByEditionInPackage,
    FilterByLevelInPackage,
    FilterByUnitInPackage,
    FilterByLessonInPackage,
    ClassRoomLog,
    FilterByUserAccount
  },
  data() {
    return {
      userParams: {},
      showClassroomLog: false,
      currentRow: {},
      unitList: [],
      lessonOptionsList: [],
      modeOption: [],
      editionList: [],
      singleConversion: false,
      currentSingleConversion: {},
      sureSingleConversionLoading: false,
      showCallBack: false,
      currentCallBackId: "",
      // 是否代课
      isAbsentList: [],
      // 是否新老师
      teacherOption: [],
      // 是否异常
      exceptionOption: [],
      // 课堂类型
      courseOption: [],
      labelWidth: "100",
      levelId: "",
      unitId: "",
      screenData: {
        lessonIdList: "",
        virtualclassTypeId: "",
        searchDay: 0, // 0 1 2 7
        startTime: null, // 时间段start_time  2019-07-24 12:00:00 end_time  2019-07-24 12:00:00
        endTime: null,
        classType: "", // 班型  oneonone  smallclass
        courseType: "", // 课程类型 0 试听课 1正式课
        teacher: "", // 新老师 new，老老师old
        programmeName: "", // 版本 Advanced高级 国际International
        studentName: "", // 学生姓名
        pageSize: 50,
        page: 1,
        appointStatus: "", // start未开始, started正在进行，finish结束
        ordering: "start_time", // 按上课时间排序
        exception: "",
        hasAbsentTutor: "", //代课
        coursePackageId: "",
        packageTreeId: "",
      },
      type: 1,
      loading: false,
      tableData: [],
      total: 0,
      applyDate: [],
      conversionList: [],
      conversionDialog: false,
      sureConversionLoading: false,
      substituteFlag: false, //代课
      currentClassInfo: {}, // 当前课堂信息
      teacherInfo: {
        teacherName: "",
        classTime: "",
        classType: "",
        course: "",
      },
      commentsLoading: false,
      valuationrate: {
        comment: [], // 评价
        valuation: [], // 评分
      },
      titleName: "",
      teacherComments: false, // 老师评语
      studentFeedback: true, // 学生反馈
      studentAll: [],
      abnormalLog: false, //异常审核
      virtualclassId: 0,
      virtualclassData: {
        submitter: "", // 老师
        submit_time: "", // 提交时间
        end_reason: "", // 异常类型
        check_result: "", // 审核原因
        check_code: 1, // 审核结果 1学生缺席2老师缺席3学生老师均未出席
        student_amount: "", // 学生罚金
        teacher_amount: "", // 老师补偿
        check_user: "", // 审核人
        check_time: "", // 审核时间
      },
      currentType: "smallClass",
      coursePackageLoading: false,
      packageTreeLoading: false,
      currentXgName: "",
      currentGwName: "",
      infoLoading: false,
      singleChangeFrom: {
        virtualclassType: "",
        reason: "",
      },
      batchChangeFrom: {
        virtualclassType: "",
        reason: "",
      },
      changeClassrules: {
        virtualclassType: [
          { required: true, message: this.$t("请选择"), trigger: "change" },
        ],
        reason: [
          { required: true, message: this.$t("请输入"), trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      schedulingTabsIndex: (state) => state.remberTags.schedulingTabsIndex,
      schedulingPage: (state) => state.remberTags.schedulingPage,
      schedulingSearchData: (state) => state.remberSearch.schedulingSearchData,
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
      currentLang: (state) => state.app.currentLang,
    }),
    ...mapGetters(["xgList", "gwList"]),
  },
  watch: {
    currentLang(newData) {
      this.initData();
    },
    levelId(levelId) {
      if (levelId === "") {
        this.screenData.lessonIdList = "";
        return;
      }
      this.reqLessonIdsByLevel(levelId);
    },
  },
  methods: {
    /* 查看教室日志 */
    viewClassRoomLog(row) {
      this.currentRow = row;
      this.showClassroomLog = true;
    },
    // 获取对应level下的lessonId集合
    async reqLessonIdsByLevel(levelId) {
      try {
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.getLessonIdsByLevel({
          packageId: this.screenData.coursePackageId,
          packageTreeId: this.screenData.packageTreeId,
          levelId: levelId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.screenData.lessonIdList = data?.lessonIdList.join(",") || [];
      } catch (err) {
        console.log(err);
      }
    },
    ...mapMutations([
      "setSchedulingTabsIndex",
      "setSchedulingPage",
      "setSchedulingSearchData",
    ]),
    getXgGw(student, item) {
      this.infoLoading = true;
      this.$Api.groupManagement
        .getGwXg(student.studentUserId, item.coursePackageId)
        .then(({ data }) => {
          if (data.code !== 200) return Promise.reject();
          const { studentLearnManagerInfo, studentAdvisorInfoList } = data.data;
          this.currentXgName = studentLearnManagerInfo
            ? studentLearnManagerInfo.xgUserName
            : "";
          this.currentGwName =
            studentAdvisorInfoList && studentAdvisorInfoList.length
              ? studentAdvisorInfoList[0].adviserUserName
              : "";
          this.infoLoading = false;
        })
        .catch(() => {
          this.currentXgName = "";
          this.currentGwName = "";
          this.infoLoading = false;
        });
    },
    getCoursePackageName(item) {
      return (
        item.coursePackageNameList.find((t) =>
          this.currentLang === "en"
            ? t.languageCode === "EN"
            : t.languageCode === "CN"
        )?.name || item.packageName
      );
    },
    closeSingleChangeFrom() {
      this.singleConversion = false;
      this.$refs.singleChangeFrom.resetFields();
    },
    sureSingleConversion() {
      this.$refs.singleChangeFrom.validate((valid) => {
        if (valid) {
          this.sureSingleConversionLoading = true;
          let ids = [this.currentSingleConversion.id];
          this.$Api.classManagement
            .classArrangementCrConMoreSmallClass({
              virtualClassIds: ids,
              ...this.singleChangeFrom,
            })
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("transfer successfully"),
                  type: "success",
                });
                this.getTableData();
                this.closeSingleChangeFrom();
              } else {
                this.$notify({
                  message: this.$t("transfer failed"),
                  type: "error",
                });
              }
            })
            .finally(() => (this.sureSingleConversionLoading = false));
        } else {
          return false;
        }
      });
    },
    initData() {
      this.isAbsentList = [
        {
          value: "",
          label: this.$t("全部"),
        },
        {
          value: 1,
          label: this.$t("是"),
        },
        {
          value: 0,
          label: this.$t("否"),
        },
      ];
      // 是否新老师
      this.teacherOption = [
        {
          value: "",
          label: this.$t("全部"),
        },
        {
          value: 1,
          label: this.$t("my-home-New Teacher"),
        },
        {
          value: 0,
          label: this.$t("my-home-Experienced Teacher"),
        },
      ];
      // 是否异常
      this.exceptionOption = [
        {
          value: "",
          label: this.$t("全部"),
        },
        {
          value: 4,
          label: this.$t("是"),
        },
        {
          value: 3,
          label: this.$t("否"),
        },
      ];
      // 课堂类型
      this.courseOption = [
        {
          value: COURSE_TYPE.TRIAL,
          label: this.$t("my-home-Trial Lesson"),
        },
        {
          value: COURSE_TYPE.PAID,
          label: this.$t("my-home-Paid Lesson"),
        },
      ];
      // 课堂模式
      this.modeOption = [
        {
          value: "",
          label: this.$t("全部"),
        },
        {
          value: 1,
          label: this.$t("拓课云"),
        },
        {
          value: 2,
          label: this.$t("百家云"),
        },
        {
          value: 3,
          label: this.$t("LingoAce"),
        },
      ];
    },
    handleCloseCallBack() {
      this.showCallBack = false;
    },
    sortChange(column) {
      if (column.prop === "startTime" && column.order === "ascending") {
        // 升序
        this.screenData.ordering = "start_time";
      } else if (column.prop === "startTime" && column.order === "descending") {
        // 降序
        this.screenData.ordering = "start_time desc";
      } else {
        return;
      }
      this.screenData.page = 1;
      this.getTableData();
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.screenData.page = currentPage;
      this.setSchedulingPage(currentPage);
      this.getTableData();
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.screenData.page = 1;
      this.perPage = perPage;
      this.getTableData();
    },
    // searchDay 发生改变
    changeRadion(val) {
      this.type = 1;
      this.applyDate = [];
      this.tableType = val;
      this.screenData.startTime = null;
      this.screenData.endTime = null;
      this.screenData.appointStatus = "";
      this.getTableData();
    },
    // 关闭异常审核
    closeAbnomalReview() {
      this.abnormalLog = false;
    },
    // 课堂回放
    clickHandlerPlayback(virtualclassId) {
      this.currentCallBackId = virtualclassId;
      this.showCallBack = true;
    },
    // 关闭老师评语 && 学生反馈
    closeTeacherComments() {
      this.teacherComments = false;
      this.valuationrate = [];
    },
    // 老师评语 && 学生反馈
    clickHandlerComment(virtualclassId, target, obj) {
      this.studentAll = [];
      this.teacherInfo.teacherName = obj.tutorUsername;
      this.teacherInfo.classTime = obj.startTime;
      this.teacherInfo.classType = "小班课";
      this.studentFeedback = target === "Student";
      this.titleName =
        target === "Student"
          ? this.$t("my-home-Teacher Feedback")
          : this.$t("my-home-Student Feedback");
      this.teacherInfo.course = {
        lessonDescEN: obj.lessonDescEN,
        lessonDescZH: obj.lessonDescZH,
      };
      this.commentsLoading = true;
      virtualclassComment(virtualclassId, target).then((res) => {
        this.commentsLoading = false;
        this.valuationrate = res.data.data || [];
        this.teacherComments = true;
      });
    },
    // close 安排代课 dialog
    closeSubstituteFlag() {
      this.substituteFlag = false;
    },
    // open 安排代课 dialog
    clickHandlerSubstitute(virtualclassId, target, obj) {
      this.currentType = "smallClass";
      this.substituteFlag = true;
      this.currentClassInfo = obj;
    },
    // 旁听
    clickHandlerMonitor(virtualclassId) {
      virtualclassMonitor(2, virtualclassId).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          window.open(`${data.data.entryPath}?subRole=2`, "_blank");
        }
      });
    },
    // 复选课堂记录到list
    handleSelectionChange(val) {
      this.conversionList = val;
    },
    // 课堂转换
    clickHandlerRevert(scopeRow) {
      this.singleConversion = true;
      this.currentSingleConversion = deepClone(scopeRow);
      this.singleChangeFrom.virtualclassType = scopeRow.virtualclassType;
    },
    // 关闭批量上传dialog
    handleCloseConversionDialog() {
      this.conversionDialog = false;
      this.$refs.batchChangeFrom.resetFields();
    },
    // 批量课堂转换
    batchConversion() {
      if (this.conversionList.length == 0) {
        this.$notify({
          message: this.$t("pls choose class"),
          type: "warning",
        });
      } else {
        this.conversionDialog = true;
      }
    },
    // 确定转换
    sureConversion() {
      this.$refs.batchChangeFrom.validate((valid) => {
        if (valid) {
          this.sureConversionLoading = true;
          let ids = [];
          this.conversionList.forEach((item) => ids.push(item.id));
          this.$Api.classManagement
            .classArrangementCrConMoreSmallClass({
              virtualClassIds: ids,
              ...this.batchChangeFrom,
            })
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                if (data.data.failedCount == 0) {
                  this.$notify({
                    message: this.$t("transfer successfully"),
                    type: "success",
                  });
                } else if (data.data.successCount == 0) {
                  this.$notify({
                    message: this.$t("transfer failed"),
                    type: "error",
                  });
                } else {
                  this.$notify({
                    message:
                      this.currentLang == "en"
                        ? `${data.data.successCount} successful conversion and ${data.data.failedCount} failed`
                        : `转换成功${data.data.successCount}条，失败${data.data.failedCount}条`,
                    type: "warning",
                  });
                }
                this.getTableData();
                this.handleCloseConversionDialog();
              }
            })
            .finally(() => (this.sureConversionLoading = false));
        } else {
          return false;
        }
      });
    },
    // 修改中部课堂状态tab
    changeType(type) {
      this.tableData = null;
      this.type = type;
      // this.setSchedulingTabsIndex(type);
      this.screenData.appointStatus =
        type === 1
          ? ""
          : type === 2
          ? "start"
          : type === 3
          ? "started"
          : "finish";
      this.setSchedulingPage(1);
      this.screenData.page = 1;
      this.getTableData();
    },
    changeTypeFn(type) {
      this.type = type;
      // this.setSchedulingTabsIndex(type);
      this.screenData.appointStatus =
        type === 1
          ? ""
          : type === 2
          ? "start"
          : type === 3
          ? "started"
          : "finish";
      this.getTableData();
    },
    // 搜索
    search() {
      this.screenData.page = 1;
      this.getTableData();
    },
    // 改变上课时间的时间
    timeChange() {
      if (this.applyDate) {
        this.screenData.startTime = new Date(`${this.applyDate[0]}`);
        this.screenData.endTime = new Date(`${this.applyDate[1]}`);
        this.screenData.searchDay = "";
        this.tableType = "";
      } else {
        this.screenData.startTime = null;
        this.screenData.endTime = null;
        this.screenData.searchDay = 0;
        this.type = 1;
        this.screenData.appointStatus = "";
      }
    },
    conversionFlag() {
      if (
        this.type == 3 ||
        this.type == 2 ||
        this.screenData.searchDay == 1 ||
        this.screenData.searchDay == 2 ||
        this.screenData.searchDay == 7
      ) {
        return true;
      } else {
        return false;
      }
    },
    getTableData() {
      this.loading = true;
      this.tableData = [];
      this.$Api.classManagement
        .getSchedulingSmallClassList({ ...this.screenData, ...this.userParams })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
          this.loading = false;
        });
    },
  },
  created() {
    this.initData();
    if (Object.keys(this.schedulingSearchData).length !== 0) {
      this.screenData = { ...this.screenData, ...this.schedulingSearchData };
    }
    this.getTableData();
  },
};
</script>
<style lang="scss" scoped>
.onebyone-wrap {
  width: 100%;
  height: 100%;
  .center-status {
    padding: 0 10px;
    box-sizing: border-box;
  }
  .table-wrap {
    padding: 0 10px;
    box-sizing: border-box;
  }
}
.red {
  color: #fe6d6f;
}
.green {
  color: #59c247;
}
</style>
