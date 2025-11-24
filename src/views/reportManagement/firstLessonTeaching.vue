<template>
  <div class="unitReportWrapper">
    <screen-wrapper
      @search="search"
      :screenTitle="$t('filter queries')"
    >
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonSupervisionByTime'
          )
        "
        :label="$t('Date')"
        :part="2"
        label-width="60"
        style="margin-left: 20px; padding-left: 0px; padding-right: 0px"
      >
        <el-radio-group
          v-model="screenData.searchDay"
          @change="changeRadion"
        >
          <el-radio-button label="0">{{ $t("my-home-Today") }}</el-radio-button>
          <el-radio-button label="-1">{{
            $t("my-home-Yesterday")
          }}</el-radio-button>
          <el-radio-button label="-2">{{ $t("前天") }}</el-radio-button>
          <el-radio-button label="-7">{{
            $t("my-home-In The Past 7 Days")
          }}</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="applyDate"
          style="margin-left: 27px; width: 210px"
          type="daterange"
          value-format="yyyy-MM-dd"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          size="small"
          @change="timeChange"
        />
      </screen-item>
      <screen-item
        :label="$t('我的范围')"
        style="margin-left: -10px"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonRange'
          )
        "
      >
        <CommonTree
          @get_seleParams="get_seleParams"
          Teaching="Teaching"
        ></CommonTree>
      </screen-item>
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonByEdition'
          )
        "
        style="margin-left: -20px"
        :label="$t('版本')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          filterable
          clearable
          v-model="screenData.courseEditionId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in editionList"
            :key="item.editionId"
            :label="currentLang=='en'?item.editionNameEn:item.editionNameZh"
            :value="item.editionId"
          />
        </el-select>
      </screen-item>
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonByLevel'
          )
        "
        :label="$t('级别')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.courseLevel"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in levelList"
            :key="item.courseLevel"
            :label="item.courseName"
            :value="item.courseLevel"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('my-home-Student')"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonByStudent'
          )
        "
      >
        <el-input
          clearable
          v-model.trim="screenData.studentUserName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '...' : '学生名字')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('家长id')"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonByParent'
          )
        "
      >
        <el-input
          clearable
          v-model.trim="screenData.parentUserId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? ' ' : '') + $t('家长id')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonByTeacher'
          )
        "
        :label="$t('教师')"
        :part="4"
        :label-width="labelWidth"
      >
        <span style="display: inline-block; width: 412px;">
          <FilterByUserAccount
            @change="
              (params) => {
                userParams = params;
              }
            "
          />
        </span>
      </screen-item>
      <screen-item
        :label="$t('家长是否已读')"
        :part="4"
        :label-width="currentLang === 'en' ? '240' : '100'"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonByRead'
          )
        "
      >
        <el-select
          clearable
          filterable
          v-model="screenData.readStatus"
          :placeholder="$t('请输入')"
        >
          <el-option
            v-for="(item, index) in readList"
            :key="index"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </screen-item>
    </screen-wrapper>
    <el-button-group
      v-if="tableType == 1"
      class="type-btn"
    >
      <el-button
        size="medium"
        :type="type == null ? 'primary' : ''"
        @click="changeType(null)"
        v-if="Per.handleButtonPer('teach.reportMT.firstLessonTeaching.LessonAllStatus')"
      >{{ $t('全部') }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 1 ? 'primary' : ''"
        @click="changeType(1)"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonWaitingSubmit'
          )
        "
      >
        {{ $t("to be submitted") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 2 ? 'primary' : ''"
        @click="changeType(2)"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonWaitingReview'
          )
        "
      >{{ $t("待审核") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 3 ? 'primary' : ''"
        @click="changeType(3)"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonReviewFailed'
          )
        "
      >{{ $t("审核未通过") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 4 ? 'primary' : ''"
        @click="changeType(4)"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.firstLessonTeaching.LessonReviewSuccess'
          )
        "
      >{{ $t("审核通过") }}
      </el-button>
    </el-button-group>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
    >
      <el-table
        v-show="type === null"
        :data="allData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        ref="allTable"
        :row-class-name="tableRowClassNameAll"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师真实姓名')"
          prop="identityName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('授课时间')"
          prop="startTime"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教管老师')"
          prop="tmUserName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="tutorRealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('my-home-Curriculum')"
          prop="add"
          width="190"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.courseEditionId | mapEdtion }} Level{{
                scope.row.courseLevel
              }}
              Lesson{{ scope.row.lessonNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="studentRealName"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                goStudentDetail(
                  scope.row.studentUserId,
                  scope.row.studentRealName
                )
              "
              type="text"
            >
              {{ scope.row.studentRealName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentUserId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goParentDetail(scope.row.parentUserId)"
            >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-student-Gender')"
          :width="currentLang === 'en' ? 120 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.studentGender === 1 ? $t("male") : $t("female")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Age')"
          prop="studentAge"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgTutorUserName"
          :width="currentLang === 'en' ? 120 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('试听课反馈提交时间')"
          :width="currentLang === 'en' ? 210 : 150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('海报与短链记录')"
          :width="currentLang === 'en' ? 200 : 130"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.templateDesc | feedArray }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('feedBack家长是否查看')"
          :width="currentLang === 'en' ? 220 : 100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.readStatus === 0 ? $t("未读") : $t("已读")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStNoPass &&
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
              type="text"
              @click="goAuditedFailedPage(scope.row, $event)"
            >{{ $t("查看") }}
            </el-button>
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStPass &&
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
              type="text"
              @click="goAuditedSuccessedPage(scope.row, $event)"
            >{{ $t("查看") }}
            </el-button>
            <el-button
              v-if="
                (scope.row.status === ApiConstants.reportPassButNotSend ||
                  scope.row.status === ApiConstants.reportStSubmit) &&
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
              type="text"
              @click="goAuditedPage(scope.row, $event)"
            >{{ $t("Audit") }}
            </el-button>
            <!-- 先暂时隐藏罚金按钮 -->
            <!-- <el-button
              type="text"
              @click="deductMoneyEvent(scope.row)"
            >{{
              $t("Fine")
            }}</el-button> -->
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStPass &&
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonWithdraw'
                )
              "
              type="text"
              @click="withdrawReportEn(scope.row)"
            >{{ $t("撤回") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 待提交 -->
      <el-table
        v-show="type === 1"
        :data="submittedTableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('授课时间')"
          prop="startTime"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师真实姓名')"
          prop="identityName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="tutorRealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          :label="$t('教管老师')"
          prop="tmUserName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-
          :label="$t('my-home-Curriculum')"
          prop="add"
          width="190"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.courseEditionId | mapEdtion }} Level{{
                scope.row.courseLevel
              }}
              Lesson{{ scope.row.lessonNo }}</span>
          </template>
        </el->
        <el-table-column
          :label="$t('学生名字')"
          prop="studentRealName"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                goStudentDetail(
                  scope.row.studentUserId,
                  scope.row.studentRealName
                )
              "
              type="text"
            >
              {{ scope.row.studentRealName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentUserId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goParentDetail(scope.row.parentUserId)"
            >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Age')"
          prop="studentAge"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 120 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('my-home-Approval Status')"
          prop="add"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapUnitReportStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="150"
          align="center"
        >
          <!-- <template slot-scope="scope">
            <el-button
              type="text"
              v-if="
                Per.handleButtonPer('teach.reportMT.firstLessonTeaching.LessonFine')
              "
              @click="deductMoneyEvent(scope.row)"
            >{{ $t("Fine") }}
            </el-button>
          </template> -->
        </el-table-column>
      </el-table>
      <!-- 待审核 start-->
      <el-table
        v-show="type === 2"
        :data="auditedTableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        ref="auditedTable"
        :row-class-name="tableRowClassNameAudited"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('授课时间')"
          prop="startTime"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师真实姓名')"
          prop="identityName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="tutorRealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          :label="$t('教管老师')"
          prop="tmUserName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Curriculum')"
          prop="add"
          width="190"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.courseEditionId | mapEdtion }} Level{{
                scope.row.courseLevel
              }}
              Lesson{{ scope.row.lessonNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="studentRealName"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                goStudentDetail(
                  scope.row.studentUserId,
                  scope.row.studentRealName
                )
              "
              type="text"
            >
              {{ scope.row.studentRealName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentUserId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goParentDetail(scope.row.parentUserId)"
            >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-student-Gender')"
          :width="currentLang === 'en' ? 120 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.studentGender === 1 ? $t("male") : $t("female")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Age')"
          prop="studentAge"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgTutorUserName"
          :width="currentLang === 'en' ? 120 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('试听课反馈提交时间')"
          :width="currentLang === 'en' ? 210 : 150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('提交次数')"
          prop="submitCount"
          :width="currentLang === 'en' ? 170 : 80"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('my-home-Approval Status')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapUnitReportStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goAuditedPage(scope.row, $event)"
              v-if="
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
            >{{ $t("Audit") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 待审核 end-->
      <!-- 审核未通过 start-->
      <el-table
        v-show="type === 3"
        :data="auditFailedTableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        ref="auditFailedTable"
        :row-class-name="tableRowClassNameAuditFailed"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('授课时间')"
          prop="startTime"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师真实姓名')"
          prop="identityName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="tutorRealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          :label="$t('教管老师')"
          prop="tmUserName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Curriculum')"
          prop="add"
          width="190"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.courseEditionId | mapEdtion }} Level{{
                scope.row.courseLevel
              }}
              Lesson{{ scope.row.lessonNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="studentRealName"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                goStudentDetail(
                  scope.row.studentUserId,
                  scope.row.studentRealName
                )
              "
              type="text"
            >
              {{ scope.row.studentRealName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentUserId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goParentDetail(scope.row.parentUserId)"
            >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-student-Gender')"
          :width="currentLang === 'en' ? 120 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.studentGender === 1 ? $t("male") : $t("female")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Age')"
          prop="studentAge"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="student_user.parent_user.adviser_user_name"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 120 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('试听课反馈提交时间')"
          :width="currentLang === 'en' ? 210 : 150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('提交次数')"
          prop="submitCount"
          :width="currentLang === 'en' ? 170 : 80"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Reviewer')"
          prop="auditUserName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Audit time')"
          prop="auditTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.auditTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Approval Status')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapUnitReportStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goAuditedFailedPage(scope.row, $event)"
              v-if="
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
            >{{ $t("查看") }}
            </el-button>
            <!-- <el-button
              type="text"
              @click="deductMoneyEvent(scope.row)"
              v-if="
                Per.handleButtonPer('teach.reportMT.firstLessonTeaching.LessonFine')
              "
            >{{ $t("Fine") }}
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 审核未通过 end-->

      <!-- 审核通过 start-->
      <el-table
        v-show="type === 4"
        :data="auditSuccessedTableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        ref="auditSuccessedTable"
        :row-class-name="tableRowClassNameAuditSuccessed"
        @sort-change="sortChange"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('授课时间')"
          prop="startTime"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师真实姓名')"
          prop="identityName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="tutorRealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          :label="$t('教管老师')"
          prop="tmUserName"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="studentRealName"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="
                goStudentDetail(
                  scope.row.studentUserId,
                  scope.row.studentRealName
                )
              "
              type="text"
            >
              {{ scope.row.studentRealName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentUserName"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goParentDetail(scope.row.parentUserId)"
            >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-student-Gender')"
          :width="currentLang === 'en' ? 120 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.studentGender === 1 ? $t("male") : $t("female")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Age')"
          prop="studentAge"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgTutorUserName"
          :width="currentLang === 'en' ? 120 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('试听课反馈提交时间')"
          :width="currentLang === 'en' ? 210 : 150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('提交次数')" prop="submitCount" :width="currentLang === 'en' ? 170 : 80"
                         align="center"></el-table-column>
        <el-table-column :label="$t('Reviewer')" prop="auditUserName" width="150" align="center"></el-table-column>
        <el-table-column :label="$t('Audit time')" prop="auditTime" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.auditTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('my-home-Approval Status')" width="150" align="center">
          <template>
            <span>{{ $t('审核通过') }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          :label="$t('海报与短链记录')"
          :width="currentLang === 'en' ? 200 : 130"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.status !== 3">{{ $t("未发送") }}</span>
            <span v-else>{{ scope.row.templateDesc }}</span> -->
            <!-- <span v-for="(item,index) in scope.row.templateDesc" :key="index">{{ item | getFeedRecord }}</span> -->
            <span>{{ scope.row.templateDesc | feedArray }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('feedBack家长是否查看')"
          :width="currentLang === 'en' ? 220 : 100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.readStatus === 0 ? $t("未读") : $t("已读")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStPass &&
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
              type="text"
              @click="goAuditedSuccessedPage(scope.row, $event)"
            >{{ $t("查看") }}
            </el-button>
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportPassButNotSend &&
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonViewFLF'
                )
              "
              type="text"
              @click="goAuditedPage(scope.row, $event)"
            >{{ $t("Audit") }}
            </el-button>
            <!-- <el-button
              type="text"
              @click="deductMoneyEvent(scope.row)"
            >{{
              $t("Fine")
            }}</el-button> -->
            <el-button
              v-if="
                Per.handleButtonPer(
                  'teach.reportMT.firstLessonTeaching.LessonWithdraw'
                )
              "
              type="text"
              @click="withdrawReportEn(scope.row)"
            >{{ $t("撤回") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 审核通过 end-->
    </custom-card>
    <!-- 分页 -->
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      :title="$t('Fine')"
      :visible.sync="deductMoneyFlag"
      width="550px"
    >
      <el-form>
        <el-form-item>
          <div
            style="display: flex"
            v-if="appealStopTime"
          >
            <span>{{ $t("Fine") }}：</span>
            <div style="width: 400px">
              <el-input
                v-model="relationContent"
                :placeholder="
                  $t('glb-input') +
                  (currentLang == 'en' ? ' ' : '') +
                  $t('罚金金额，单位为人民币元')
                "
              />
            </div>
            <span>{{ $t("元") }}</span>
          </div>
          <div
            style="display: flex"
            class="mt10"
            v-if="appealStopTime"
          >
            <span>{{ $t("student-info-Notes") }}：</span>
            <div style="width: 400px">
              <el-input
                v-model="relationRemark"
                :placeholder="
                  $t('glb-input') +
                  (currentLang == 'en' ? ' ' : '') +
                  $t('罚金原因备注信息')
                "
              />
            </div>
          </div>
          <div
            class="relation-content-list"
            v-if="relationList.length != 0"
          >
            <div
              v-for="(item, index) in relationList"
              :key="index"
            >
              <p>{{ $t("金额") }}：{{ item.money }} {{ $t("元") }}</p>
              <p>{{ $t("student-info-Notes") }}：{{ item.remark }}</p>
              <p>
                {{ $t("time") }}：{{
                  DateTimeUtils.dateClockTime(item.createTime)
                }}
              </p>
              <p>{{ $t("罚款人") }}：{{ item.userName }}</p>
            </div>
          </div>
          <div
            v-if="relationList.length === 0 && !appealStopTime"
            style="width: 100%; text-align: center"
          >
            {{ $t("暂无数据") }}
          </div>
        </el-form-item>
        <el-form-item class="btn-wrapper text-center">
          <el-button
            v-if="appealStopTime"
            @click="deductMoneyFlag = false"
          >{{
            $t("取消")
          }}</el-button>
          <el-button
            v-if="appealStopTime"
            type="primary"
            :loading="sureRelationLoading"
            @click="sureDeductMoneyFn"
          >
            {{ $t("确定罚款") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <withdrawReport />
    <withdrawReport
      :showWithdrawu="showWithdrawu"
      :withdrawuData="withdrawuData"
      @closeWithdrawu="closeWithdrawu"
      :reportType="reportType"
      @getFirstClassList="getListAJAX"
    />
  </div>
</template>

<script>
import {
  getFirstTeachingFeedbackList,
  deductionMoney,
} from "@/api/unitReportManagement/";
import { mapState, mapMutations, mapGetters } from "vuex";
import withdrawReport from "./unitReportSub/withdrawReport";
import CommonTree from "./commonTree/index.vue"
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import { parentIdValidate } from '@/utils/reg.js'

export default {
  name: "firstLessonTeaching",
  components: {
    withdrawReport,
    CommonTree,
    FilterByUserAccount,
  },
  data () {
    return {
      editionList: [],
      topSelectData: [],
      activatedRefresh: false,
      reportType: "first",
      deductMoneyFlag: false,
      relationContent: "",
      sureRelationLoading: false,
      tableType: 1,
      type: 1,
      loading: false,
      tableHeight: window.innerHeight - 200 || 300,
      currentPage: 1,
      pageSize: 50,
      relationRemark: "",
      relationList: [],
      total: 0,
      moneyObj: {},
      withdrawuData: {},
      showWithdrawu: false,
      sendParentList: [],
      labelWidth: "80",
      role: [],
      applyDate: [],
      userParams: {},
      screenData: {
        courseEditionId: "",
        courseLevel: "",
        // deptType:0,
        // xgAdviserUserId: "",
        studentUserName: "",
        page: "",
        pageSize: "",
        status: "",
        sendParent: "",
        auditUserName: "",
        searchDay: 0,
        startTime: "",
        endTime: "",
        // tmUserId: "",
        readStatus: "",
        templateDesc: "",
        parentUserId: ""
      },
      submittedTableData: [
        {
          add: "待提交",
        },
      ],
      auditedTableData: [
        {
          add: "待审核",
        },
      ],
      auditFailedTableData: [
        {
          add: "审核不通过",
        },
      ],
      auditSuccessedTableData: [
        {
          add: "审核通过",
        },
      ],
      allData: [],
      appealStopTime: true,
      readList: [],
    };
  },
  computed: {
    ...mapState({
      firstClassFeedbackTabsIndex: (state) =>
        state.remberTags.firstClassFeedbackTabsIndex,
      firstClassFeedbackPage: (state) =>
        state.remberTags.firstClassFeedbackPage,
      firstClassSearchData: (state) => state.remberSearch.firstClassSearchData,
      feedbackAuditedScrollTop: (state) =>
        state.remberScroll.feedbackAuditedScrollTop,
      feedbackAuditFailedScrollTop: (state) =>
        state.remberScroll.feedbackAuditFailedScrollTop,
      feedbackAuditSuccessedScrollTop: (state) =>
        state.remberScroll.feedbackAuditSuccessedScrollTop,
      feedbackAllScrollTop: (state) => state.remberScroll.feedbackAllScrollTop,
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
      tmList: (state) => state.user.tmList,
    }),
    ...mapGetters(["currentLang"]),
    levelList () {
      let result = this.editionList.find(
        item => item.editionId == this.screenData.courseEditionId
      );
      if (result != undefined) {
        return result.courseLevelInfoList || []
      } else {
        return [];
      }
    },
  },
  watch: {
    type (newData, oldData) {
      this.getListAJAX();
    },
    deductMoneyFlag (newData, oldData) {
      if (!newData) {
        this.relationContent = "";
      }
    },
    currentLang () {
      this.initData();
    },
  },
  methods: {
    ...mapMutations([
      "setFirstClassFeedbackTabsIndex",
      "setFirstClassFeedbackPage",
      "setFirstClassSearchData",
      "setFeedbackAuditedScrollTop",
      "setFeedbackAuditFailedScrollTop",
      "setFeedbackAuditSuccessedScrollTop",
      "setFeedbackAllScrollTop",
    ]),
    // 获取课程版本
    reqCourseEdition () {
      this.$Api.base.courseEdition().then(({ data }) => {
        if (data.code === 200) {
          this.editionList = data.data || [];
          this.editionList.unshift({
            editionId: '',
            editionNameEn: 'all',
            editionNameZh: '全部',
            courseLevelInfoList: []
          })
        }
      });
    },
    goStudentDetail (sid, sname) {
      this.$router.push(
        `/studentManagement/studentInfo?studentId=${sid}&studentName=${sname}`
      );
    },
    goParentDetail (pid) {
      this.$router.push(`/studentManagement/parentInfo?parentUserId=${pid}`);
    },
    initData () {
      this.sendParentList = [
        {
          value: "无记录",
          lable: this.$t("无记录"),
        },
        {
          value: "有记录",
          lable: this.$t("有记录"),
        },
        {
          value: "IN海报",
          lable: this.$t("IN海报"),
        },
        {
          value: "IN短链",
          lable: this.$t("IN短链"),
        },
        {
          value: "EN海报",
          lable: this.$t("EN海报"),
        },
        {
          value: "EN短链",
          lable: this.$t("EN短链"),
        },
        {
          value: "TN海报",
          lable: this.$t("TN海报"),
        },
        {
          value: "TN短链",
          lable: this.$t("TN短链"),
        },
        {
          value: "CN海报",
          lable: this.$t("CN海报"),
        },
        {
          value: "CN短链",
          lable: this.$t("CN短链"),
        },
      ];
      this.readList = [
        {
          value: 0,
          lable: this.$t("未读"),
        },
        {
          value: 1,
          lable: this.$t("已读"),
        },
      ];
      this.topSelectData = [
        { label: this.$t("my-home-My Desk"), value: 0 },
        { label: this.$t("my-home-My Team"), value: 1 },
      ];
    },
    closeWithdrawu () {
      this.showWithdrawu = false;
    },
    withdrawReportEn (rowData) {
      this.withdrawuData = rowData;
      this.showWithdrawu = true;
    },
    changeRadion (val) {
      this.applyDate = [];
      this.screenData.startTime = "";
      this.screenData.endTime = "";
    },
    timeChange () {
      if (this.applyDate) {
        this.screenData.startTime = new Date(`${this.applyDate[0]} 00:00`);
        this.screenData.endTime = new Date(`${this.applyDate[1]} 23:59:59`);
        this.screenData.searchDay = "";
      } else {
        this.screenData.startTime = null;
        this.screenData.endTime = null;
        this.screenData.searchDay = "";
        this.type = 1;
      }
    },
    search () {
      if (this.screenData && this.screenData.parentUserId && !parentIdValidate(this, this.screenData.parentUserId)) {
        return;
      }
      this.screenData.page = 1;
      this.currentPage = 1;
      this.getListAJAX();
    },
    getListAJAX () {
      this.loading = true;
      this.currentPage = this.firstClassFeedbackPage;
      this.screenData.page = this.firstClassFeedbackPage;
      this.screenData.pageSize = this.pageSize;
      this.screenData.status = this.type == null ? this.type : this.type - 1;
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      // 合并用户参数
      Object.assign(params, this.userParams);
      getFirstTeachingFeedbackList(
        this.screenData.page,
        this.screenData.pageSize,
        params
      ).then((res) => {
        if (res.status === 200) {
          this.loading = false;
          this.total = res.data.data.total;
          switch (this.type) {
            case null:
              this.allData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAll();
                }, 0);
              } catch (error) { }
              break;
            case this.ApiConstants.reportStNoSubmit + 1:
              this.submittedTableData = res.data.data.list;
              break;
            case this.ApiConstants.reportStSubmit + 1:
              this.auditedTableData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAudited();
                }, 0);
              } catch (error) { }
              break;
            case this.ApiConstants.reportStNoPass + 1:
              this.auditFailedTableData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAuditFailed();
                }, 0);
              } catch (error) { }
              break;
            case this.ApiConstants.reportStPass + 1:
              this.auditSuccessedTableData = res.data.data.list;
              // this.getResult(this.auditSuccessedTableData)
              try {
                setTimeout(() => {
                  this.goBeforeScrollAuditSuccessed();
                }, 0);
              } catch (error) { }
              break;
            default:
              break;
          }
        }
      });
    },
    getCurrentPage (currentPage) {
      this.currentPage = currentPage;
      this.setFirstClassFeedbackPage(currentPage);
      this.getListAJAX();
    },
    getPerPage (perPage) {
      this.pageSize = perPage;
      this.getListAJAX();
    },
    deductMoneyEvent (item) {
      this.relationList = item.fineResult ? [...item.fineResult] : [];
      this.moneyObj = item;
      let lastStartYear = new Date(this.moneyObj.startTime).getFullYear(),
        thisYear = new Date().getFullYear(),
        lastStartMonth = new Date(this.moneyObj.startTime).getMonth(),
        thisMonth = new Date().getMonth();
      if/* 本年 */(lastStartYear === thisYear) {
        if /* 不是本月*/(lastStartMonth !== thisMonth) {
          this.getAppealStopTime()
        } else {
          this.appealStopTime = true
        }
      } else {
        if /* 是上个本月*/(thisMonth - lastStartMonth === -11) {
          this.getAppealStopTime()
        } else {
          this.appealStopTime = false
        }
      }
      this.deductMoneyFlag = true;
    },
    handleClose () {
      this.deductMoneyFlag = false;
      this.sureRelationLoading = false;
      this.relationContent = "";
    },
    sureDeductMoneyFn () {
      this.sureRelationLoading = true;
      let money = this.relationContent * 1;
      // 判断用户填写的是否为负数
      if (money <= 0) {
        this.$notify({
          message: "罚款失败，金额有误",
        });
        this.sureRelationLoading = false;
        return;
      }
      this.$confirm("确认罚款？")
        .then((_) => {
          deductionMoney({
            reportId: this.moneyObj.firstReportId,
            money: money,
            remark: this.relationRemark,
            type: 2,
          }).then((res) => {
            if (res.data.code === 200) {
              this.$notify({
                message: "罚款成功",
                type: "success",
              });
              this.deductMoneyFlag = false;
              this.sureRelationLoading = false;
              this.relationContent = "";
              this.relationRemark = "";
              this.getListAJAX();
            } else if (res.data.code === 1) {
              this.sureRelationLoading = false;
            }
          });
        })
        .catch((_) => { });
    },
    goBeforeScrollAll () {
      if (this.$refs.allTable) {
        if (Object.keys(this.feedbackAllScrollTop).length != 0) {
          this.$refs.allTable.bodyWrapper.scrollTop =
            this.feedbackAllScrollTop.scrollTop;
        }
      }
    },
    goBeforeScrollAudited () {
      if (this.$refs.auditedTable) {
        if (Object.keys(this.feedbackAuditedScrollTop).length != 0) {
          this.$refs.auditedTable.bodyWrapper.scrollTop =
            this.feedbackAuditedScrollTop.scrollTop;
        }
      }
    },
    goBeforeScrollAuditFailed () {
      if (this.$refs.auditFailedTable) {
        if (Object.keys(this.feedbackAuditFailedScrollTop).length != 0) {
          this.$refs.auditFailedTable.bodyWrapper.scrollTop =
            this.feedbackAuditFailedScrollTop.scrollTop;
        }
      }
    },
    goBeforeScrollAuditSuccessed () {
      if (this.$refs.auditSuccessedTable) {
        if (Object.keys(this.feedbackAuditSuccessedScrollTop).length != 0) {
          this.$refs.auditSuccessedTable.bodyWrapper.scrollTop =
            this.feedbackAuditSuccessedScrollTop.scrollTop;
        }
      }
    },
    goAuditedPage (item, e) {
      if (this.type == this.ApiConstants.reportStSubmit + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditedTableData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAuditedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == this.ApiConstants.reportStPass + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditSuccessedTableData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAuditSuccessedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == null || this.type == "") {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.allData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAllScrollTop({
          scrollTop,
          ind,
        });
      }

      this.activatedRefresh = true;
      this.$router.push(
        `/reportManagement/feedbackAudited?reportId=${item.firstReportId}&classTypeId=${item.classTypeId}`
      );
    },
    goAuditedFailedPage (item, e) {
      if (this.type === this.ApiConstants.reportStNoPass + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditFailedTableData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAuditFailedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == null || this.type == "") {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.allData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAllScrollTop({
          scrollTop,
          ind,
        });
      }

      this.$router.push(
        `/reportManagement/feedbackAuditFailed?reportId=${item.firstReportId}&classTypeId=${item.classTypeId}`
      );
    },
    goAuditedSuccessedPage (item, e) {
      if (this.type === this.ApiConstants.reportStPass + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditSuccessedTableData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAuditSuccessedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == null || this.type == "") {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.allData.findIndex(
          (items) => items.id == item.firstReportId
        );
        this.setFeedbackAllScrollTop({
          scrollTop,
          ind,
        });
      }

      this.$router.push(
        `/reportManagement/feedbackAuditSuccessed?reportId=${item.firstReportId}&classTypeId=${item.classTypeId}`
      );
    },
    changeType (type) {
      this.setFirstClassFeedbackTabsIndex(type);
      this.type = type;

      this.setFirstClassFeedbackPage(1);

      this.setFeedbackAuditedScrollTop(0);
      this.setFeedbackAuditFailedScrollTop(0);
      this.setFeedbackAuditSuccessedScrollTop(0);
      this.currentPage = 1;
      this.screenData.page = 1;
    },
    indexMethod (index) {
      return index + 1;
    },
    sortChange (column) {
      if (column.prop === "user_num" && column.order === "ascending") {
        // 升序
        this.screenData.ordering = "user_num";
      } else if (column.prop === "user_num" && column.order === "descending") {
        // 降序
        this.screenData.ordering = "-user_num";
      } else {
        return;
      }
      this.getListAJAX();
    },
    getSortClass (key) {
      const sort = this.screenData.ordering;
      return sort === `${key}`
        ? "ascending"
        : sort === `-${key}`
          ? "descending"
          : "";
    },
    tableRowClassNameAudited ({ row, rowIndex }) {
      if (rowIndex === this.feedbackAuditedScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    tableRowClassNameAuditFailed ({ row, rowIndex }) {
      if (rowIndex === this.feedbackAuditFailedScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    tableRowClassNameAuditSuccessed ({ row, rowIndex }) {
      if (rowIndex === this.feedbackAuditSuccessedScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    tableRowClassNameAll ({ row, rowIndex }) {
      if (rowIndex === this.feedbackAllScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    getAppealStopTime () {
      this.$Api.appealManagement
        .getAppealStopTime()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            let timeo = data.data.find(
              (item) => item.typeKey === this.ApiConstants.appealStopTime
            );
            if (+new Date() > +new Date(timeo.stopTime)) {
              this.appealStopTime = false;
            } else {
              this.appealStopTime = true;
            }
          }
        });
    },
    //获取范围组件的值
    get_seleParams (val, valName) {
      if (valName === "userIdList") {
        this.screenData.userIdStr = val.join(',')
      }
    }
  },
  activated () {
    if (this.activatedRefresh) this.getListAJAX();
    this.activatedRefresh = false;
  },
  created () {
    this.reqCourseEdition()
    this.initData();
    this.type = this.firstClassFeedbackTabsIndex;
    if (Object.keys(this.firstClassSearchData).length !== 0) {
      this.screenData = { ...this.screenData, ...this.firstClassSearchData };
    }
    this.getListAJAX();
  },
};
</script>
<style lang="scss" scoped>
.type-btn {
  margin: 10px 15px;
}

.relation-content-list {
  line-height: 34px;
  border-top: 1px dotted #ccc;
  margin-top: 10px;

  div {
    border-bottom: 1px dotted #ccc;
  }

  p {
    margin: 0;
  }
}
</style>
