<template>
  <div class="unitReportWrapper">
    <!-- 搜索 -->
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item
        :label="$t('Date')"
        :part="2"
        label-width="60"
        style="margin-left: 20px; padding-left: 0px; padding-right: 0px"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFilterByTime')"
      >
        <el-radio-group v-model="screenData.searchDay" @change="changeRadion">
          <el-radio-button label="0">{{ $t("my-home-Today") }}</el-radio-button>
          <el-radio-button label="-1"
            >{{ $t("my-home-Yesterday") }}
          </el-radio-button>
          <el-radio-button label="-2">{{ $t("前天") }}</el-radio-button>
          <el-radio-button label="-7"
            >{{ $t("my-home-In The Past 7 Days") }}
          </el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="applyDate"
          style="margin-left: 27px; width: 200px"
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
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFilterByScope')"
      >
        <CommonTree
          @get_seleParams="get_seleParams"
          isShowLACCSelect="true"
          :hasLAPermission="
            Per.handleButtonPer('teach.reportMT.unitReport.filterByLA')
          "
          :hasCCPermission="
            Per.handleButtonPer('teach.reportMT.unitReport.filterByCC')
          "
          :hasTeachTubePermission="
            Per.handleButtonPer('teach.reportMT.unitReport.filterByTeachTube')
          "
        ></CommonTree>
      </screen-item>
      <screen-item
        v-if="
          Per.handleButtonPer('teach.reportMT.unitReport.urFilterByEdition')
        "
        style="margin-left: -20px"
        :label="$t('版本')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          filterable
          clearable
          v-model="screenData.courseEdition"
          :placeholder="$t('my-home-Select')"
        >
          <el-option
            v-for="item in editionList"
            :key="item.editionId"
            :label="
              currentLang == 'en' ? item.editionNameEn : item.editionNameZh
            "
            :value="item.editionId"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('级别')"
        :part="4"
        :label-width="labelWidth"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFilterByLevel')"
      >
        <el-select
          clearable
          v-model="screenData.courseLevel"
          :placeholder="$t('my-home-Select')"
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
        :label="$t('单元')"
        :part="4"
        :label-width="labelWidth"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFilterByUnit')"
      >
        <el-input
          clearable
          v-model.trim="screenData.courseUnit"
          :placeholder="$t('请输入单元')"
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('是否已发送家长')"
        :part="4"
        label-width="110"
        v-if="
          Per.handleButtonPer(
            'teach.reportMT.unitReport.urFilterByWhetherSentParents'
          )
        "
      >
        <el-select
          clearable
          v-model="screenData.sendParent"
          :placeholder="$t('my-home-Select')"
        >
          <el-option
            v-for="item in sendParentList"
            :key="item.id"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </screen-item>

      <screen-item
        :label="$t('my-home-Student')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input
          clearable
          v-model.trim="screenData.studentName"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? ' ' : '学生名字')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      </screen-item>
      <screen-item :label="$t('家长id')" :part="4" :label-width="labelWidth">
        <el-input
          clearable
          v-model.trim="screenData.parentUserId"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? ' ' : '家长ID')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
      <screen-item
        :label="$t('是否复制H5短链')"
        :part="4"
        :label-width="currentLang === 'en' ? '240' : '110'"
      >
        <el-select
          clearable
          filterable
          v-model="screenData.copyStatus"
          :placeholder="$t('my-home-Select')"
        >
          <el-option
            v-for="(item, index) in copyList"
            :key="index"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('家长是否已读')"
        :part="4"
        :label-width="currentLang === 'en' ? '240' : '100'"
      >
        <el-select
          clearable
          filterable
          v-model="screenData.readStatus"
          :placeholder="$t('my-home-Select')"
        >
          <el-option
            v-for="(item, index) in readList"
            :key="index"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </screen-item>
       <screen-item :label="$t('教师')" :part="4" :label-width="labelWidth">
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
    </screen-wrapper>
    <!-- tabs -->
    <el-button-group v-if="tableType == 1" class="type-btn">
      <el-button
        size="medium"
        :type="type == null ? 'primary' : ''"
        @click="changeType(null)"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urAllStatus')"
        >{{ $t("my-home-4-All") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 1 ? 'primary' : ''"
        @click="changeType(1)"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urPendingStatus')"
        >{{ $t("to be submitted") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 2 ? 'primary' : ''"
        @click="changeType(2)"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urPendingReview')"
        >{{ $t("待审核") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 3 ? 'primary' : ''"
        @click="changeType(3)"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urReviewFailed')"
        >{{ $t("审核未通过") }}
      </el-button>
      <el-button
        size="medium"
        :type="type == 4 ? 'primary' : ''"
        @click="changeType(4)"
        v-if="Per.handleButtonPer('teach.reportMT.unitReport.urReviewSuccess')"
        >{{ $t("审核通过") }}
      </el-button>
    </el-button-group>
    <!-- tables -->
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <!-- 全部 -->
      <el-table
        v-show="type === null"
        :data="allTableData"
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
          :label="$t('本单元结束时间')"
          prop="lastStartTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.lastStartTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师用户名')"
          prop="tutorName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.trealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="trealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Teacher\'s Chinese name')"
          prop="identityName"
          :width="currentLang === 'en' ? 170 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="realName"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goStudentDetail(scope.row.sid, scope.row.realName)"
            >
              {{ scope.row.realName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="goParentDetail(scope.row.parentUserId)"
              type="text"
              >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('版本')"
          prop="unit.unit"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-show="currentLang==='en'">{{ scope.row.courseEdition | mapEdtionEn }}</span>
            <span v-show="currentLang==='zh'">{{ scope.row.courseEdition | mapEdtion }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('级别')"
          prop="unit"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            <span>level {{ scope.row.courseLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('单元')"
          prop="unit"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('单元报告提交时间')"
          prop="submitTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('提交次数')"
          prop="submitCount"
          :width="currentLang === 'en' ? 200 : 90"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 150 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Reviewer')"
          prop="examiner"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Audit time')"
          prop="examineTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.examineTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('审核状态')"
          :width="currentLang === 'en' ? 110 : 90"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapUnitReportStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('是否已发送给家长')"
          :width="currentLang === 'en' ? 200 : 100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status === 3 ? $t("是") : $t("未发送") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('是否复制H5短链')"
          :width="currentLang === 'en' ? 200 : 110"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.copyStatus === 0 ? $t("未复制") : $t("已复制")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长是否查看')"
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
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStNoPass &&
                Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')
              "
              type="text"
              @click="goAuditedFailedPage(scope.row, $event)"
              >{{ $t("查看") }}
            </el-button>
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStPass &&
                Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')
              "
              type="text"
              @click="goAuditedSuccessedPage(scope.row, $event)"
              >{{ $t("查看") }}
            </el-button>
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStPass &&
                Per.handleButtonPer('teach.reportMT.unitReport.urWithdraw')
              "
              type="text"
              @click="withdrawReportEn(scope.row)"
              >{{ $t("撤回") }}
            </el-button>
            <el-button
              v-if="
                (scope.row.status === ApiConstants.reportPassButNotSend ||
                  scope.row.status === ApiConstants.reportStSubmit) &&
                Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')
              "
              type="text"
              @click="goAuditedPage(scope.row, $event)"
              >{{ $t("Audit") }}
            </el-button>
            <!-- <el-button
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFine')"
              type="text"
              @click="deductMoneyEvent(scope.row)"
              >{{ $t("Fine") }}
            </el-button> -->
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
          :label="$t('本单元结束时间')"
          prop="lastStartTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.lastStartTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师用户名')"
          prop="tutorName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.trealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="trealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Teacher\'s Chinese name')"
          prop="identityName"
          :width="currentLang === 'en' ? 170 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="realName"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goStudentDetail(scope.row.sid, scope.row.realName)"
            >
              {{ scope.row.realName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="goParentDetail(scope.row.parentUserId)"
              type="text"
              >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('版本')"
          prop="unit.unit"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-show="currentLang==='en'">{{ scope.row.courseEdition | mapEdtionEn }}</span>
            <span v-show="currentLang==='zh'">{{ scope.row.courseEdition | mapEdtion }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('级别')"
          prop="unit.unit"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            <span>level {{ scope.row.courseLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('单元')"
          prop="unit"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 150 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('是否处罚老师')"
          :width="currentLang === 'en' ? 300 : 150"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.fineResult">{{
              scope.row.fineResult.length == 0 ? "" : $t("已处罚")
            }}</span>
            <span v-else>未处罚</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('备注信息')"
          prop="reportRemark"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="200"
              trigger="click"
              :content="
                scope.row.reportRemark
                  ? scope.row.reportRemark
                  : $t('无备注信息')
              "
            >
              <el-button slot="reference" type="text">{{
                $t("查看备注")
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('student-info-Notes Created by')"
          prop="reportRemarkUserName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="RemarksEvent(scope.row)"
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urRemarks')"
              >{{ $t("student-info-Notes") }}
            </el-button>
            <!-- <el-button
              type="text"
              @click="deductMoneyEvent(scope.row)"
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFine')"
              >{{ $t("Fine") }}
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 待审核 -->
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
          :label="$t('本单元结束时间')"
          prop="lastStartTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.lastStartTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师用户名')"
          prop="tutorName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.trealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="trealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Teacher\'s Chinese name')"
          prop="identityName"
          :width="currentLang === 'en' ? 170 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="realName"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goStudentDetail(scope.row.sid, scope.row.realName)"
            >
              {{ scope.row.realName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="goParentDetail(scope.row.parentUserId)"
              type="text"
              >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('版本')"
          prop="unit"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-show="currentLang==='en'">{{ scope.row.courseEdition | mapEdtionEn }}</span>
            <span v-show="currentLang==='zh'">{{ scope.row.courseEdition | mapEdtion }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('级别')"
          prop="unit.unit"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            <span>level {{ scope.row.courseLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('单元')"
          prop="unit"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('单元报告提交时间')"
          prop="submitTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('提交次数')"
          prop="submitCount"
          :width="currentLang === 'en' ? 200 : 80"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 150 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('审核状态')"
          :width="currentLang === 'en' ? 110 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapUnitReportStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('操作')"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')"
              @click="goAuditedPage(scope.row, $event)"
              >{{ $t("Audit") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 审核未通过 -->
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
        ref="auditFailedTable"
        :row-class-name="tableRowClassNameAuditFailed"
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
          :label="$t('本单元结束时间')"
          prop="lastStartTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.lastStartTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师用户名')"
          prop="tutorName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.trealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="trealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Teacher\'s Chinese name')"
          prop="identityName"
          :width="currentLang === 'en' ? 170 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="realName"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goStudentDetail(scope.row.sid, scope.row.realName)"
            >
              {{ scope.row.realName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="goParentDetail(scope.row.parentUserId)"
              type="text"
              >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('版本')"
          prop="unit"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span v-show="currentLang==='en'">{{ scope.row.courseEdition | mapEdtionEn }}</span>
            <span v-show="currentLang==='zh'">{{ scope.row.courseEdition | mapEdtion }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('级别')"
          prop="unit.unit"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            <span>level {{ scope.row.courseLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('单元')"
          prop="unit"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('单元报告提交时间')"
          prop="submitTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('提交次数')"
          prop="submitCount"
          :width="currentLang === 'en' ? 200 : 80"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 150 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Reviewer')"
          prop="examiner"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Audit time')"
          prop="examineTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.examineTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('审核状态')"
          :width="currentLang === 'en' ? 110 : 120"
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
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')"
              @click="goAuditedFailedPage(scope.row, $event)"
              >{{ $t("查看") }}
            </el-button>
            <!-- <el-button
              type="text"
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFine')"
              @click="deductMoneyEvent(scope.row)"
              >{{ $t("Fine") }}
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 审核通过 -->
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
        @sort-change="sortChange"
        ref="auditSuccessedTable"
        :row-class-name="tableRowClassNameAuditSuccessed"
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
          :label="$t('本单元结束时间')"
          prop="lastStartTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.lastStartTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          :label="$t('教师用户名')"
          prop="tutorName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column align="center" :label="$t('教师ID')" width="180">
          <template slot-scope="scope">
            <router-link
              target="_blank"
              :to="{
                path: `/tutorManagement/teacherInfo?id=${scope.row.tutorUserId}&teacherName=${scope.row.trealName}`,
              }"
            >
              <el-button type="text">{{ scope.row.tutorUserId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('my-home-Teacher\'s Nickname')"
          prop="trealName"
          :width="currentLang === 'en' ? 140 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Teacher\'s Chinese name')"
          prop="identityName"
          :width="currentLang === 'en' ? 170 : 120"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('学生名字')"
          prop="realName"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goStudentDetail(scope.row.sid, scope.row.realName)"
            >
              {{ scope.row.realName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长id')"
          prop="parentId"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="goParentDetail(scope.row.parentUserId)"
              type="text"
              >{{ scope.row.parentUserId }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('版本')"
          prop="unit.unit"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span v-show="currentLang==='en'">{{ scope.row.courseEdition | mapEdtionEn }}</span>
            <span v-show="currentLang==='zh'">{{ scope.row.courseEdition | mapEdtion }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('级别')"
          prop="unit.unit"
          width="70"
          align="center"
        >
          <template slot-scope="scope">
            <span>level {{ scope.row.courseLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('单元')"
          prop="unit"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('单元报告提交时间')"
          prop="submitTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.submitTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('提交次数')"
          prop="submitCount"
          :width="currentLang === 'en' ? 200 : 90"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('课程顾问')"
          prop="adviserUserName"
          :width="currentLang === 'en' ? 150 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('common-Learning Advisor')"
          prop="xgUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('教管老师')"
          prop="tmUserName"
          :width="currentLang === 'en' ? 130 : 100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Reviewer')"
          prop="examiner"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('Audit time')"
          prop="examineTime"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.examineTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('审核状态')"
          :width="currentLang === 'en' ? 110 : 90"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status | mapUnitReportStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('是否已发送给家长')"
          :width="currentLang === 'en' ? 200 : 100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status === 3 ? $t("是") : $t("未发送") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('是否复制H5短链')"
          :width="currentLang === 'en' ? 200 : 110"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.copyStatus === 0 ? $t("未复制") : $t("已复制")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('家长是否查看')"
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
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportStPass &&
                Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')
              "
              type="text"
              @click="goAuditedSuccessedPage(scope.row, $event)"
              >{{ $t("查看") }}
            </el-button>
            <el-button
              v-if="
                scope.row.status === ApiConstants.reportPassButNotSend &&
                Per.handleButtonPer('teach.reportMT.unitReport.urViewUr')
              "
              type="text"
              @click="goAuditedPage(scope.row, $event)"
              >{{ $t("Audit") }}
            </el-button>

            <!-- 先暂时隐藏 -->
            <!-- <el-button
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urFine')"
              type="text"
              @click="deductMoneyEvent(scope.row)"
              >{{ $t("Fine") }}
            </el-button> -->
            <el-button
              type="text"
              v-if="Per.handleButtonPer('teach.reportMT.unitReport.urWithdraw')"
              @click="withdrawReportEn(scope.row)"
              >{{ $t("撤回") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <!-- 分页 -->
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <!-- 罚金弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('Fine')"
      :before-close="deductBeforeClose"
      :visible.sync="deductMoneyFlag"
      width="550px"
    >
      <el-form>
        <el-form-item>
          <div style="display: flex" v-if="appealStopTime">
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
          <div style="display: flex" class="mt10" v-if="appealStopTime">
            <span>{{ $t("student-info-Notes") }}：</span>
            <div style="width: 450px">
              <el-input
                v-model="relationRemark"
                maxlength="255"
                show-word-limit
                :placeholder="
                  $t('glb-input') +
                  (currentLang == 'en' ? ' ' : '') +
                  $t('罚金原因备注信息')
                "
                @input="change($event)"
              />
            </div>
          </div>
          <div class="relation-content-list" v-if="relationList.length != 0">
            <div v-for="(item, index) in relationList" :key="index">
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
          <el-button @click="close" v-if="appealStopTime">{{
            $t("取消")
          }}</el-button>
          <el-button
            v-if="appealStopTime"
            :loading="sureRelationLoading"
            type="primary"
            @click="sureDeductMoneyFn"
          >
            {{ $t("确定罚款") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 备注弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="remarksBeforeClose"
      :title="$t('student-info-Notes')"
      :visible.sync="remarksFlag"
      width="550px"
    >
      <el-form>
        <el-form-item>
          <div>
            <div style="width: 450px">
              <el-input
                maxlength="255"
                type="textarea"
                rows="7"
                v-model="remarksContent"
                :placeholder="$t('填写备注（最多255个字）')"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item class="btn-wrapper text-center">
          <el-button @click="closeRemarks">{{ $t("取消") }}</el-button>
          <el-button
            :loading="sureSubmitRemarksLoading"
            type="primary"
            @click="sureSubmitRemarksFn"
            >{{ $t("my-home-Confirm") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <withdrawReport
      :showWithdrawu="showWithdrawu"
      :withdrawuData="withdrawuData"
      @closeWithdrawu="closeWithdrawu"
      :reportType="reportType"
      @getUnitReportList="getListAJAX"
    />
  </div>
</template>

<script>
import {
  getUnitReportList,
  deductionMoney,
  submitRemarks,
  JudgeNewAndOld,
} from "@/api/unitReportManagement/";
import { mapState, mapMutations, mapGetters } from "vuex";
import withdrawReport from "./unitReportSub/withdrawReport";
import CommonTree from "./commonTree";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "unitReport",
  components: {
    withdrawReport,
    CommonTree,
    FilterByUserAccount,
  },
  data() {
    return {
      topSelectData: [],
      activatedRefresh: false,
      reportType: "unit",
      showWithdrawu: false,
      applyDate: [],
      sendParentList: [],
      userParams: {},
      screenData: {
        courseEdition: "",
        courseLevel: "",
        courseUnit: "",
        studentName: "",
        page: "",
        pageSize: "",
        status: "",
        sendParent: "",
        examineUser: "",
        searchDay: "",
        startTime: "",
        endTime: "",
        copyStatus: "",
        readStatus: "",
        userIdList: [],
        postIdList: [],
        parentUserId: "",
      },
      remarksFlag: false,
      role: [],
      labelWidth: "80",
      currentPage: 1,
      total: 0,
      pageSize: 50,
      deductMoneyFlag: false,
      tableType: 1,
      type: 1,
      sureRelationLoading: false,
      sureSubmitRemarksLoading: false,
      loading: false,
      relationContent: "",
      relationList: [],
      relationRemark: "",
      remarksContent: "",
      tableHeight: window.innerHeight - 200 || 300,
      submittedTableData: [],
      auditedTableData: [],
      auditFailedTableData: [],
      auditSuccessedTableData: [],
      allTableData: [],
      moneyObj: {},
      remarksObj: {},
      withdrawuData: {},
      appealStopTime: true,
      copyList: [],
      readList: [],
      editionList: [],
      types: null,
    };
  },
  computed: {
    ...mapState({
      unitReportTabsIndex: (state) => state.remberTags.unitReportTabsIndex,
      unitReportCurrentPage: (state) => state.remberTags.unitReportCurrentPage,
      unitReportSearchData: (state) => state.remberSearch.unitReportSearchData,
      unitReportAuditedScrollTop: (state) =>
        state.remberScroll.unitReportAuditedScrollTop,
      unitReportAuditFailedScrollTop: (state) =>
        state.remberScroll.unitReportAuditFailedScrollTop,
      unitReportAuditSuccessedScrollTop: (state) =>
        state.remberScroll.unitReportAuditSuccessedScrollTop,
      unitReportAllScrollTop: (state) =>
        state.remberScroll.unitReportAllScrollTop,
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
    }),
    ...mapGetters(["currentLang"]),
    levelList() {
      let result = this.editionList.find(
        (item) => item.editionId == this.screenData.courseEdition
      );
      if (result != undefined) {
        return result.courseLevelInfoList || [];
      } else {
        return [];
      }
    },
  },
  watch: {
    type(newData, oldData) {
      this.getListAJAX();
    },
    currentLang() {
      this.initData();
    },
  },
  methods: {
    async getNew(id) {
      let {
        status,
        data: { code, data },
      } = await JudgeNewAndOld(id);
      if (status !== 200 && code !== 200) return Promise.reject();
      switch (this.types) {
        case 2:
          this.$router.push({
            path: `/reportManagement/audited`,
            query: {
              reportId: id,
              version: data,
            },
          });
          break;
        case 3:
          this.$router.push({
            path: `/reportManagement/auditFailed`,
            query: {
              reportId: id,
              version: data,
            },
          });
          break;
        case 4:
          this.$router.push({
            path: `/reportManagement/auditSuccessed`,
            query: {
              reportId: id,
              version: data,
            },
          });
          break;
        default:
          break;
      }
    },
    ...mapMutations([
      "setUnitReportTabsIndex",
      "setUnitReportOther",
      "setUnitReportCurrentPage",
      "setUnitReportSearchData",
      "setUnitReportAuditedScrollTop",
      "setUnitReportAuditFailedScrollTop",
      "setUnitReportAuditSuccessedScrollTop",
      "setUnitReportAllScrollTop",
    ]),
    // 获取课程版本
    reqCourseEdition() {
      this.$Api.base.courseEdition().then(({ data }) => {
        if (data.code === 200) {
          this.editionList = data.data || [];
          this.editionList.unshift({
            editionId: "",
            editionNameEn: "all",
            editionNameZh: "全部",
            courseLevelInfoList: [],
          });
        }
      });
    },
    goStudentDetail(sid, sname) {
      this.$router.push(
        `/studentManagement/studentInfo?studentId=${sid}&studentName=${sname}`
      );
    },
    goParentDetail(pid) {
      this.$router.push(`/studentManagement/parentInfo?parentUserId=${pid}`);
    },
    initData() {
      this.sendParentList = [
        {
          value: 3,
          lable: this.$t("是"),
        },
        {
          value: 4,
          lable: this.$t("未发送"),
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
      this.copyList = [
        {
          value: 0,
          lable: this.$t("未复制"),
        },
        {
          value: 1,
          lable: this.$t("已复制"),
        },
      ];
      this.topSelectData = [
        { label: this.$t("my-home-My Desk"), value: 0 },
        { label: this.$t("my-home-My Team"), value: 1 },
      ];
    },
    withdrawReportEn(rowData) {
      this.withdrawuData = rowData;
      this.showWithdrawu = true;
    },
    closeWithdrawu() {
      this.showWithdrawu = false;
    },
    change(e) {
      // this.$forceUpdate()
    },
    timeChange() {
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
    changeRadion(val) {
      this.applyDate = [];
      this.screenData.startTime = "";
      this.screenData.endTime = "";
    },
    sureSubmitRemarksFn() {
      this.sureSubmitRemarksLoading = true;
      submitRemarks(this.remarksObj.id, this.remarksContent).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            message: this.$t("提交成功"),
            type: "success",
          });
          this.remarksBeforeClose();
          this.getListAJAX();
        }
      });
    },
    remarksBeforeClose() {
      this.remarksFlag = false;
      this.sureSubmitRemarksLoading = false;
      this.remarksContent = "";
    },
    RemarksEvent(item) {
      this.remarksFlag = true;
      this.remarksContent = item.remark;
      this.remarksObj = item;
    },
    closeRemarks() {
      this.remarksFlag = false;
      this.sureSubmitRemarksLoading = false;
    },
    //获取范围组件的值
    get_seleParams(val, valName, searchType) {
      this.screenData.searchType = +searchType; // 后端要数字类型
      if (valName === "postIdList") {
        this.screenData.postIdList = val;
        this.screenData.userIdList = [];
      } else if (valName === "userIdList") {
        this.screenData.userIdList = val;
        this.screenData.postIdList = [];
      } else if (valName === "clear") {
        this.screenData.userIdList = [];
        this.screenData.postIdList = [];
      }
      this.getListAJAX();
    },
    search() {
      if (
        this.screenData &&
        this.screenData.parentUserId &&
        !parentIdValidate(this, this.screenData.parentUserId)
      ) {
        return;
      }
      this.currentPage = 1;
      this.screenData.page = 1;
      this.getListAJAX();
    },
    getListAJAX() {
      this.loading = true;
      this.currentPage = this.unitReportCurrentPage;
      this.screenData.page = this.unitReportCurrentPage;
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
      getUnitReportList(params).then((res) => {
        if (res.status === 200) {
          this.total = res.data.data?.total;
          switch (this.type) {
            case null:
              this.allTableData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAll();
                }, 0);
              } catch (error) {}
            case 1:
              this.submittedTableData = res.data.data.list;
              break;
            case 2:
              this.auditedTableData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAudited();
                }, 0);
              } catch (error) {}
              break;
            case 3:
              this.auditFailedTableData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAuditFailed();
                }, 0);
              } catch (error) {}
              break;
            case 4:
              this.auditSuccessedTableData = res.data.data.list;
              try {
                setTimeout(() => {
                  this.goBeforeScrollAuditSuccessed();
                }, 0);
              } catch (error) {}
              break;
            default:
              break;
          }

          this.loading = false;
        } else if (res.data.code === 1) {
          this.sureRelationLoading = false;
        }
      });
    },
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      //改变vuex 中存储的 当前页码
      this.setUnitReportCurrentPage(currentPage);
      this.getListAJAX();
    },
    getPerPage(perPage) {
      this.pageSize = perPage;
      this.getListAJAX();
    },
    deductMoneyEvent(item) {
      this.relationList = item.fineResult ? [...item.fineResult] : [];
      this.moneyObj = item;
      let lastStartYear = new Date(this.moneyObj.lastStartTime).getFullYear(),
        thisYear = new Date().getFullYear(),
        lastStartMonth = new Date(this.moneyObj.lastStartTime).getMonth(),
        thisMonth = new Date().getMonth();
      if (/* 本年 */ lastStartYear === thisYear) {
        if (/* 不是本月*/ lastStartMonth !== thisMonth) {
          this.getAppealStopTime();
        } else {
          this.appealStopTime = true;
        }
      } else {
        if (/* 是上个本月*/ thisMonth - lastStartMonth === -11) {
          this.getAppealStopTime();
        } else {
          this.appealStopTime = false;
        }
      }
      this.deductMoneyFlag = true;
    },
    close() {
      this.deductMoneyFlag = false;
      this.sureRelationLoading = false;
      this.relationContent = "";
    },
    deductBeforeClose() {
      this.deductMoneyFlag = false;
      this.sureRelationLoading = false;
      this.relationContent = "";
    },
    sureDeductMoneyFn() {
      let money = this.relationContent * 1;
      if (money <= 0) {
        this.$notify({
          message: this.$t("罚款失败，金额有误"),
          type: "error",
        });
        this.sureRelationLoading = false;
        return;
      }
      if (this.relationRemark == "") {
        this.$notify({
          message: this.$t("请填写备注信息"),
          type: "error",
        });
        this.sureRelationLoading = false;
        return;
      }
      this.$confirm(this.$t("确认罚款？"))
        .then((_) => {
          this.sureRelationLoading = true;
          deductionMoney({
            reportId: this.moneyObj.id,
            money: money,
            remark: this.relationRemark,
            type: 1,
          }).then((res) => {
            if (res.data.code === 200) {
              this.$notify({
                message: this.$t("罚款成功"),
                type: "success",
              });
              this.relationContent = "";
              this.relationRemark = "";
              this.deductMoneyFlag = false;
              this.getListAJAX();
            }
            this.sureRelationLoading = false;
          });
        })
        .catch((_) => {});
    },
    goBeforeScrollAll() {
      if (this.$refs.allTable) {
        if (Object.keys(this.unitReportAllScrollTop).length != 0) {
          this.$refs.allTable.bodyWrapper.scrollTop =
            this.unitReportAllScrollTop.scrollTop;
        }
      }
    },
    goBeforeScrollAudited() {
      if (this.$refs.auditedTable) {
        if (Object.keys(this.unitReportAuditedScrollTop).length != 0) {
          this.$refs.auditedTable.bodyWrapper.scrollTop =
            this.unitReportAuditedScrollTop.scrollTop;
        }
      }
    },
    goBeforeScrollAuditFailed() {
      if (this.$refs.auditFailedTable) {
        if (Object.keys(this.unitReportAuditFailedScrollTop).length != 0) {
          this.$refs.auditFailedTable.bodyWrapper.scrollTop =
            this.unitReportAuditFailedScrollTop.scrollTop;
        }
      }
    },
    goBeforeScrollAuditSuccessed() {
      if (this.$refs.auditSuccessedTable) {
        if (Object.keys(this.unitReportAuditSuccessedScrollTop).length != 0) {
          this.$refs.auditSuccessedTable.bodyWrapper.scrollTop =
            this.unitReportAuditSuccessedScrollTop.scrollTop;
        }
      }
    },
    goAuditedPage(item, e) {
      if (this.type == this.ApiConstants.reportStSubmit + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditedTableData.findIndex(
          (items) => items.id == item.id
        );
        this.setUnitReportAuditedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == this.ApiConstants.reportStPass + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditSuccessedTableData.findIndex(
          (items) => items.id == item.id
        );
        this.setUnitReportAuditSuccessedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == null || this.type == "") {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.allTableData.findIndex((items) => items.id == item.id);
        this.setUnitReportAllScrollTop({
          scrollTop,
          ind,
        });
      }
      this.activatedRefresh = true;
      this.types = 2;
      this.getNew(item.id);
      // this.$router.push(`/reportManagement/audited?reportId=15656`)
    },
    goAuditedFailedPage(item, e) {
      if (this.type === this.ApiConstants.reportStNoPass + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditFailedTableData.findIndex(
          (items) => items.id == item.id
        );
        this.setUnitReportAuditFailedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == null || this.type == "") {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.allTableData.findIndex((items) => items.id == item.id);
        this.setUnitReportAllScrollTop({
          scrollTop,
          ind,
        });
      }
      this.types = 3;
      this.getNew(item.id);
    },
    goAuditedSuccessedPage(item, e) {
      if (this.type === this.ApiConstants.reportStPass + 1) {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.auditSuccessedTableData.findIndex(
          (items) => items.id == item.id
        );
        this.setUnitReportAuditSuccessedScrollTop({
          scrollTop,
          ind,
        });
      } else if (this.type == null || this.type == "") {
        let scrollTop =
          e.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        let ind = this.allTableData.findIndex((items) => items.id == item.id);
        this.setUnitReportAllScrollTop({
          scrollTop,
          ind,
        });
      }
      this.types = 4;
      this.getNew(item.id);
    },
    changeType(type) {
      this.type = type;
      this.types = type;
      //切换tab 把状态存进vuex
      this.setUnitReportTabsIndex(type);
      //同时清空vuex中存储的 当前页为 默认值
      this.setUnitReportCurrentPage(1);
      // vuex中scroll的值回复默认
      this.setUnitReportAuditedScrollTop(0);
      this.setUnitReportAuditFailedScrollTop(0);
      this.setUnitReportAuditSuccessedScrollTop(0);
      this.currentPage = 1;
      this.screenData.page = 1;
    },
    indexMethod(index) {
      return index + 1;
    },
    sortChange(column) {
      if (column.prop === "user_num" && column.order === "ascending") {
        // 升序
        this.screenData.ordering = "user_num";
      } else if (column.prop === "user_num" && column.order === "descending") {
        // 降序
        this.screenData.ordering = "-user_num";
      } else {
        return;
      }
    },
    getSortClass(key) {
      const sort = this.screenData.ordering;
      return sort === `${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
    tableRowClassNameAudited({ row, rowIndex }) {
      if (rowIndex === this.unitReportAuditedScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    tableRowClassNameAuditFailed({ row, rowIndex }) {
      if (rowIndex === this.unitReportAuditFailedScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    tableRowClassNameAuditSuccessed({ row, rowIndex }) {
      if (rowIndex === this.unitReportAuditSuccessedScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    tableRowClassNameAll({ row, rowIndex }) {
      if (rowIndex === this.unitReportAllScrollTop.ind) {
        return "hover-row";
      }
      return "";
    },
    getAppealStopTime() {
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
  },
  activated() {
    if (this.activatedRefresh) this.getListAJAX();
    this.activatedRefresh = false;
  },
  created() {
    this.reqCourseEdition();
    this.initData();
    this.type = this.unitReportTabsIndex;
    if (Object.keys(this.unitReportSearchData).length !== 0) {
      this.screenData = { ...this.screenData, ...this.unitReportSearchData };
    }
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

.mt10 {
  ::v-deep .el-input--small {
    .el-input__inner {
      padding: 0 60px 0 15px;
    }
  }
}
</style>
