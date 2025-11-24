<template>
  <div class="filter-panel">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-if="collapseProps.includes('Basic')"
        :title="$t('基本条件')"
        name="1"
      >
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :inline="true"
        >
          <el-form-item v-if="isShowFilter('fullWork')" :label="$t('老师类型')">
            <el-select
              v-model="basicState.fullWork"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option
                v-for="item in fullWorkList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('localArea')"
            :label="$t('老师区域')"
          >
            <el-select
              v-model="basicState.localArea"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option
                v-for="item in localAreaList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShowFilter('working')" :label="$t('在岗状态')">
            <el-select
              clearable
              v-model="basicState.working"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in workingStatusList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShowFilter('hide')" :label="$t('开放状态')">
            <el-select
              clearable
              v-model="basicState.hide"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in openForTeacherList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShowFilter('status')" :label="$t('老师状态')">
            <el-select
              clearable
              v-model="basicState.status"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in teacherStatusList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="showExamineStatus && isShowFilter('examineStatus')"
            :label="$t('审核状态')"
          >
            <el-select
              v-model="basicState.examineStatus"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in examineStatusList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('hideReason')"
            :label="$t('变更原因')"
          >
            <el-select
              clearable
              v-model="basicState.hideReason"
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in reasonList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="isShowFilter('gender')" :label="$t('性别')">
            <el-select
              v-model="basicState.gender"
              filterable
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option :label="$t('male')" value="1" />
              <el-option :label="$t('female')" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('nationalityList')"
            :label="$t('国籍')"
          >
            <FilterByCountryOfCitizenship
              ref="FilterByCountryOfCitizenship"
              @changeSelect="
                (val) => {
                  basicState.nationalityList = val;
                }
              "
            />
          </el-form-item>
          <!-- <el-form-item
            v-if="isShowFilter('teachingStyleIds')"
            :label="$t('教学风格')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByTeachingStyle"
              :placeholder="$t('请选择教学风格')"
              v-if="teacherStyleListData.length"
              :options="teacherStyleListData"
              @changeSelect="
                (ids) => {
                  basicState.teachingStyleIds = ids;
                }
              "
            />
          </el-form-item> -->
          <el-form-item
            v-if="
              isShowFilter('conversionRateId') && filterProps[0] !== 'allProps'
            "
            :label="$t('转化率标签')"
          >
            <!-- :isDisabled="
                Per.handleButtonPer(
                  'teach.studentMT.studentInfo.sistStudentTimetable.onlyInformalTrialClass'
                )
              " -->
            <FilterByConversionRateLabel
              ref="FilterByConversionRateLabel"
              :initVal="basicState.conversionRateId"
              @changeSelect="
                (val) => {
                  basicState.conversionRateId = val;
                }
              "
              :subjectType="subjectType"
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('packageId')"
            :label="$t('可教课程')"
          >
            <FilterByCoursePackage
              ref="FilterByCoursePackage"
              @changeEditionSelect="
                (val) => {
                  basicState.packageId = val;
                }
              "
              @getCoursePackageName="
                (val) => {
                  packageName = val;
                }
              "
              :classType="1"
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('packageTreeId')"
            :label="$t('版本')"
          >
            <FilterByEditionInPackage
              ref="FilterByEditionInPackage"
              @changeSelect="
                (val) => {
                  basicState.packageTreeId = val;
                }
              "
              @changeName="
                (val) => {
                  packageTreeName = val;
                }
              "
              @changeCourseEditionId="
                (val) => {
                  basicState.courseEditionId = val;
                }
              "
              :coursePackageId="basicState.packageId"
            />
          </el-form-item>
          <el-form-item v-if="isShowFilter('levelId')" :label="$t('级别')">
            <FilterByLevelInPackage
              ref="FilterByLevelInPackage"
              @changeSelect="
                (val) => {
                  basicState.levelId = val;
                }
              "
              @changeName="
                (val) => {
                  levelName = val;
                }
              "
              :coursePackageId="basicState.packageId"
              :packageTreeId="basicState.packageTreeId"
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('isBindWecom')"
            :label="$t('是否绑定企微')"
          >
            <el-select
              v-model="basicState.isBindWecom"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option :label="$t('是')" :value="1" />
              <el-option :label="$t('否')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('contractStatusStr')"
            :label="$t('签约状态')"
          >
            <el-select
              v-model="basicState.contractStatusStr"
              :placeholder="$t('请选择')"
              clearable
              @change="handleSearch"
            >
              <el-option :label="$t('未签')" :value="0" />
              <el-option :label="$t('已签（非续签期）')" :value="1" />
              <el-option :label="$t('已签（续签期）')" :value="2" />
              <el-option :label="$t('已过期')" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('isCanRenewal')"
            :label="$t('能否续签')"
          >
            <el-select
              v-model="basicState.isCanRenewal"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option :label="$t('能续签')" :value="1" />
              <el-option :label="$t('不能续签')" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('languageIds')"
            :label="$t('语言标签')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterBylanguageIds"
              :placeholder="$t('请选择语言标签')"
              v-if="languageLabelListData.length"
              :options="languageLabelListData"
              @changeSelect="
                (ids) => {
                  basicState.languageIds = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('tmUserId')"
            :label="$t('教师管理人员')"
          >
            <FilterByTeachManager
              ref="FilterByTeachManager"
              :placeholder="$t('请选择语教管')"
              v-if="tmUserList.length"
              :options="tmUserList"
              @changeSelect="
                (ids) => {
                  basicState.tmUserId = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('teachingYearList')"
            :label="$t('教学年限')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByTeachingExperience"
              :placeholder="$t('请选择教学年限')"
              :options="teachingYears"
              @changeSelect="
                (ids) => {
                  basicState.teachingYearList = ids;
                }
              "
            />
            <!--  -->
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('ageGroupList')"
            :label="$t('老师年龄段')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByTeacherAgeGroup"
              :options="teacherAgeGroup"
              :placeholder="$t('请选择老师年龄段')"
              @changeSelect="
                (ids) => {
                  basicState.ageGroupList = ids;
                }
              "
            />
          </el-form-item>
          <!-- <el-form-item
            v-if="isShowFilter('preferredTeachingAgeGroupIds')"
            :label="$t('适教年龄段')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByteachingStudentAgeGroup"
              :placeholder="$t('请选择适教年龄段')"
              v-if="teachingStudentAgeGroupList.length"
              :options="teachingStudentAgeGroupList"
              @changeSelect="
                (ids) => {
                  basicState.preferredTeachingAgeGroupIds = ids;
                }
              "
            />
          </el-form-item> -->
          <el-form-item
            v-if="isShowFilter('educationLevelList')"
            :label="$t('教育水平')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByEnTeacherDegree"
              :placeholder="$t('请选择教育水平')"
              v-if="enTeacherDegreeOptions.length"
              :options="enTeacherDegreeOptions"
              @changeSelect="
                (ids) => {
                  basicState.educationLevelList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('credentialList')"
            :label="$t('教师资格证')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByEnCredentialList"
              :placeholder="$t('请选择教师资格证')"
              v-if="enTeacherAptitudeOptions.length"
              :options="enTeacherAptitudeOptions"
              @changeSelect="
                (ids) => {
                  basicState.credentialList = ids;
                }
              "
            />
          </el-form-item>
          <!-- <el-form-item v-if="isShowFilter('accentList')" :label="$t('口音')">
            <FilterByLocalSelectionForTeacher
              ref="FilterByaccentList"
              :placeholder="$t('请选择')"
              :options="accent"
              @changeSelect="
                (ids) => {
                  basicState.accentList = ids;
                }
              "
            />
          </el-form-item> -->
          <el-form-item
            v-if="isShowFilter('ethnicityList')"
            :label="$t('Lingoace')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByEthnicityListList"
              :placeholder="$t('请选择')"
              :options="race"
              @changeSelect="
                (ids) => {
                  basicState.ethnicityList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('personalListType')"
            :label="$t('收藏/黑名单')"
          >
            <el-select
              v-model="basicState.personalListType"
              filterable
              clearable
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in blackAndCollectForTeacherList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('salaryLabel')"
            :label="$t('薪酬标签')"
          >
            <el-select v-model="basicState.salaryLabel" :placeholder="$t('请选择')">
              <el-option
                v-for="item in salaryLabelList"
                :key="item.code"
                :label="item.description"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('isPayoneerRegister')"
            :label="$t('Payoneer绑定状态')"
          >
            <el-select
              v-model="basicState.isPayoneerRegister"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option
                v-for="item in isPayoneerRegisteStatusList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('isPayoneer')"
            :label="$t('Payoneer审核状态')"
          >
            <el-select
              v-model="basicState.isPayoneer"
              :placeholder="$t('请选择')"
              clearable
            >
              <el-option
                v-for="item in isPayoneerStatusList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
            <el-form-item v-if="isShowFilter('teacherKey')||isShowFilter('bookTeacherKey')" :label="$t('教师')">
              <FilterByUserAccount
                ref="filterByUserAccount"
                @change="handleUserAccountChange"
              />
            </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item
        v-if="collapseProps.includes('Business')"
        :title="$t('业务条件')"
        name="2"
      >
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :inline="true"
        >
          <el-form-item
            v-if="isShowFilter('studentCountList')"
            :label="$t('现有学生')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByStudentCount"
              :placeholder="$t('请选择现有学生数')"
              :options="Constants.teacherNumOfStu(isEn)"
              @changeSelect="
                (ids) => {
                  basicState.studentCountList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('doneCountList')"
            :label="$t('完课数量')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterBydoneCount"
              :placeholder="$t('请选择完课数量')"
              :options="Constants.teacherNumOfLessons(isEn)"
              @changeSelect="
                (ids) => {
                  basicState.doneCountList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('slotCountList')"
            :label="$t('放课量')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByOpenLessonTimes"
              :placeholder="$t('请选择放课量')"
              :options="openLessonTimes"
              @changeSelect="
                (ids) => {
                  basicState.slotCountList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('ticketRateList')"
            :label="$t('网络问题')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByNetworkIssues"
              :placeholder="$t('请选择网络问题')"
              :options="networkIssues"
              @changeSelect="
                (ids) => {
                  basicState.ticketRateList = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('absenceRateV2List')"
            :label="$t('旷课情况')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByAbsence"
              :placeholder="$t('请选择旷课情况')"
              :options="absenceOptions"
              @changeSelect="
                (ids) => {
                  basicState.absenceRateV2List = ids;
                }
              "
            />
          </el-form-item>
          <el-form-item
            v-if="isShowFilter('complaintRateList')"
            :label="$t('被投诉次数')"
          >
            <FilterByLocalSelectionForTeacher
              ref="FilterByComplained"
              :placeholder="$t('请选择被投诉次数')"
              :options="timesComplained"
              @changeSelect="
                (ids) => {
                  basicState.complaintRateList = ids;
                }
              "
            />
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item
        v-if="collapseProps.includes('Time')"
        :title="$t('时间条件')"
        name="3"
      >
        <div class="mb5">
          <span style="font-size: 14px; color: #606266; font-weight: 700"
            >{{ $t("日期间关系") }}：</span
          >
          <el-switch
            :active-value="2"
            :inactive-value="1"
            style="vertical-align: baseline"
            v-model="basicState.dateType"
            :active-text="$t('一个即符合')"
            :inactive-text="$t('全部符合')"
          >
          </el-switch>
        </div>
        <div class="mb5">
          <span style="font-size: 14px; color: #606266; font-weight: 700"
            >{{ $t("课程时长") }}：</span
          >
          <el-switch
            :active-value="55"
            :inactive-value="25"
            style="vertical-align: baseline"
            v-model="basicState.duration"
            :active-text="$t('55分钟')"
            :inactive-text="$t('25分钟')"
          >
          </el-switch>
        </div>
        <div style="padding-bottom: 20px">
          <template v-show="bookTimes.length > 0">
            <div
              v-for="(item, index) in bookTimes"
              style="display: inline-block; margin-right: 10px"
              :key="item.key"
            >
              <BookTimePeriodPanel
                :key="item.key"
                :ref="`bookTime${index}`"
                @onSelectDateTime="
                  (date) => {
                    item.value = date;
                  }
                "
                @handleDeleTag="deleteOption(index)"
                :minStartTime="new Date()"
              ></BookTimePeriodPanel>
            </div>
          </template>
          <i
            @click="addOption"
            class="el-icon-plus"
            style="cursor: pointer; color: #7e8ae7; font-weight: 700"
          ></i>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="tags">
      <div class="select-filter clearfix">
        <span>{{ $t("已选择的筛选条件") }}：</span>
        <span class="fr">
          <el-button @click="handleReset"> {{ $t("重置") }}</el-button>
          <el-button @click="handleSearch" type="primary">
            {{ $t("搜索") }}</el-button
          >
        </span>
      </div>
      <span v-for="(value, key) in basicState">
        <template v-if="key!=='identityType'">
        <el-tag
          v-if="
            (value &&
              value.length &&
              !multipleSelection.includes(key) &&
              key !== 'nationalityList' &&
              key !== 'courseEditionId' &&
              key !== 'examineStatus' &&
              key !== 'isPayoneerRegister' &&
              key !== 'isPayoneer') ||
            (typeof value === 'number' && key !== 'courseEditionId') ||
            (typeof value === 'string' && value !== '' && key !== 'courseEditionId' && key !== 'isPayoneerRegister' && key !== 'isPayoneer')
          "
          style="margin-left: 4px; margin-bottom: 3px"
          :key="key"
          :closable="
            key !== 'duration' && key !== 'dateType' && key !== 'examineStatus'
          "
          size="mini"
          type="success"
          @close="deleteTag(key)"
        >
          <span
            v-if="
              (key === 'duration' && collapseProps.includes('Time')) ||
              key === 'identity'
            "
          >
            {{ $t(filedKeyNameMap[key]) }}: {{ value }}
          </span>
          <span v-else-if="key === 'conversionRateId'">
            {{ $t(filedKeyNameMap[key]) }}: {{ conversionRateMap[value] }}
          </span>
          <span v-else-if="key === 'packageId'">
            {{ $t(filedKeyNameMap[key]) }}: {{ packageName }}
          </span>
          <span v-else-if="key === 'packageTreeId'">
            {{ $t(filedKeyNameMap[key]) }}: {{ packageTreeName }}
          </span>
          <span v-else-if="key === 'levelId'">
            {{ $t(filedKeyNameMap[key]) }}: {{ levelName }}
          </span>

          <span v-else-if="key === 'tmUserId'">
            {{ $t(filedKeyNameMap[key]) }}: {{ tmUserMap[value] }}
          </span>
          <span
            v-else-if="
              [
                'fullWork',
                'localArea',
                'working',
                'hide',
                'status',
                'hideReason',
                'isBindWecom',
                'isCanRenewal',
                'contractStatusStr',
                'dateType',
                'personalListType',
                'examineStatus',
                'salaryLabel',
                'isPayoneerRegister',
                'isPayoneer',
              ].includes(key)
            "
          >
            {{ $t(filedKeyNameMap[key]) }}: {{ $t(getTagName(key, value)) }}
          </span>
          <span v-else
            >{{ $t(filedKeyNameMap[key]) }}:
            {{ $t(filedValueNameMap[value - 0]) }}</span
          >
        </el-tag>
        <el-tag
          v-if="key === 'examineStatus' && showExamineStatus"
          style="margin-left: 4px; margin-bottom: 3px"
          :key="key"
          :closable="
            key !== 'duration' && key !== 'dateType' && key !== 'examineStatus'
          "
          size="mini"
          type="success"
          @close="deleteTag(key)"
        >
          {{ $t(filedKeyNameMap[key]) }}: {{ $t(getTagName(key, value)) }}
        </el-tag>
        <el-tag
          v-if="(key === 'isPayoneerRegister' || key === 'isPayoneer') && value !== ''"
          style="margin-left: 4px; margin-bottom: 3px"
          :key="key"
          closable
          size="mini"
          type="success"
          @close="deleteTag(key)"
        >
          {{ $t(filedKeyNameMap[key]) }}: {{ $t(getTagName(key, value)) }}
        </el-tag>
        <span v-if="multipleSelection.includes(key)">
          <el-tag
            v-for="item in value"
            style="margin-left: 4px; margin-bottom: 3px"
            :key="item"
            closable
            size="mini"
            type="success"
            @close="deleteTag(key, item)"
          >
            {{ $t(filedKeyNameMap[key]) }}:
            <span v-if="key === 'languageIds'">
              {{ $t(languageLabelMap[item]) }}
            </span>
            <span v-if="key === 'teachingStyleIds'">
              {{ $t(teacherStyleMap[item]) }}
            </span>
            <span v-if="key === 'preferredTeachingAgeGroupIds'">
              {{ $t(teachingStudentAgeGroupMap[item]) }}
            </span>
            <span v-else>
              {{ $t(getTagName(key, item)) }}
            </span>
          </el-tag>
        </span>
        <span v-if="key === 'nationalityList'">
          <el-tag
            v-for="(item, index) in value"
            style="margin-left: 4px; margin-bottom: 3px"
            :key="item"
            closable
            size="mini"
            type="success"
            @close="deleteTag(key, item, index)"
          >
            {{ $t(filedKeyNameMap[key]) }}:
            {{ isEn ? item.nameEn : item.nameZh }}
          </el-tag>
        </span>
        </template>
      </span>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import FilterByTeachingExperience from "@/components/NewFilter/FilterByTeachingExperience";
import FilterByLocalSelectionForTeacher from "@/components/NewFilter/FilterByLocalSelectionForTeacher";
import FilterByCountryOfCitizenship from "@/components/NewFilter/FilterByCountryOfCitizenship";
import FilterByTeachManager from "@/components/NewFilter/FilterByTeachManager";
import FilterByCoursePackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByCoursePackage";
import FilterByEditionInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByEditionInPackage";
import FilterByLevelInPackage from "@/components/FilterItem/CoursePackageTreeFilter/FilterByLevelInPackage";
import { deepClone } from "@/utils/handleData";
import BookTimePeriodPanel from "./BookTimePeriodPanel.vue";
import moment from "moment";
import FilterByConversionRateLabel from "@/components/FilterItem/TeacherFilter/FilterByConversionRateLabel";

import {
  teachingYears,
  teacherAgeGroup,
  openLessonTimes,
  networkIssues,
  absenceOptions,
  race,
  accent,
  timesComplained,
  fullWorkList,
  localAreaList,
  workingStatusList,
  openForTeacherList,
  teacherStatusList,
  reasonList,
  blackAndCollectForTeacherList,
  examineStatusList,
  isPayoneerRegisteStatusList,
  isPayoneerStatusList,
} from "@/components/NewFilter/enumerate.js";
import {
  filedKeyNameMap,
  filedValueNameMap,
  transformArray,
  getTagName,
  multipleSelection,
  filterParams,
} from "./filterFiledNameMap";
export default {
  name: "FilterPanel",
  props: {
    collapseProps: {
      type: Array,
      default: () => ["Basic", "Business", "Time"],
    },
    filterProps: {
      type: Array,
      default: () => ["allProps"],
    },
    subjectType: {
      /* 0 中文；1 英文  2:数学 */ type: Number,
      default: 0,
    },
    showExamineStatus: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    FilterByUserAccount,
    FilterByTeachingExperience,
    FilterByLocalSelectionForTeacher,
    FilterByCountryOfCitizenship,
    FilterByTeachManager,
    BookTimePeriodPanel,
    FilterByCoursePackage,
    FilterByEditionInPackage,
    FilterByLevelInPackage,
    FilterByConversionRateLabel,
  },
  setup(props, { root, emit, refs }) {
    const isShowFilter = (key) => {
      if (props.filterProps[0] === "allProps") return true;
      return props.filterProps.includes(key);
    };
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const basicState = ref({});
    const bookTimes = ref([]);
    const initBasicState = () => {
      basicState.value = {
        identity: "",
        identityType: "",
        gender: "",
        fullWork: "",
        localArea: "",
        working: "",
        hide: "",
        hideReason: "",
        languageIds: [],
        teachingStyleIds: [],
        teachingYearList: [],
        ageGroupList: [],
        preferredTeachingAgeGroupIds: [],
        educationLevelList: [],
        nationalityList: [],
        studentCountList: [],
        doneCountList: [],
        slotCountList: [],
        ticketRateList: [],
        absenceRateV2List: [],
        complaintRateList: [],
        credentialList: [],
        ethnicityList: [],
        accentList: [],
        tmUserId: "",
        packageId: "",
        packageTreeId: "",
        courseEditionId: "",
        levelId: "",
        isBindWecom: "",
        isCanRenewal: "",
        contractStatusStr: "",
        duration: props.collapseProps.includes("Time") ? 55 : "",
        dateType: props.collapseProps.includes("Time") ? 2 : "",
        status: "",
        conversionRateId: "",
        personalListType: "",
        examineStatus: "3",
        salaryLabel: "",
        isPayoneerRegister: "",
        isPayoneer: "",
      };
      setTimeout(() => {
        emit("handleSearch", basicState.value);
      }, 500);
    };
    const packageName = ref("");
    const packageTreeName = ref("");
    const levelName = ref("");

    const activeName = ref("1");
    const labelPosition = "top";
    const salaryLabelList = ref([]);
    // 获取薪酬标签数据
    const getSalaryLabelList = async () => {
      const res = await root.$Api.tutorManagement.getSalaryLabelsList(2);
      if (res.status === 200 && res.data.code === 200) {
        salaryLabelList.value = [
          {
            code: "",
            description: "全部"
          },
          ...res.data.data
        ];
      }
    };
    const handleUserAccountChange = (searchParams) => {
      if (searchParams && searchParams.identityType && searchParams.identity&& searchParams.identity.length) {
        basicState.value.identity = searchParams.identity;
        basicState.value.identityType = searchParams.identityType;
      } else {
        basicState.value.identity = "";
        basicState.value.identityType = "";
      }
    };
    const handleReset = () => {
      initBasicState();
      refs.FilterByConversionRateLabel &&
        refs.FilterByConversionRateLabel.clear("");
      refs.FilterBylanguageIds && refs.FilterBylanguageIds.clear();
      refs.filterByUserAccount && (refs.filterByUserAccount.inputValue = "");
      refs.FilterByTeachingStyle && refs.FilterByTeachingStyle.clear();
      refs.FilterByTeachingExperience &&
        refs.FilterByTeachingExperience.clear();
      refs.FilterByTeacherAgeGroup && refs.FilterByTeacherAgeGroup.clear();
      refs.FilterByteachingStudentAgeGroup &&
        refs.FilterByteachingStudentAgeGroup.clear();
      refs.FilterByCountryOfCitizenship &&
        refs.FilterByCountryOfCitizenship.clear();
      refs.FilterByStudentCount && refs.FilterByStudentCount.clear();
      refs.FilterBydoneCount && refs.FilterBydoneCount.clear();
      refs.FilterByOpenLessonTimes && refs.FilterByOpenLessonTimes.clear();
      refs.FilterByNetworkIssues && refs.FilterByNetworkIssues.clear();
      refs.FilterByAbsence && refs.FilterByAbsence.clear();
      refs.FilterByEnTeacherDegree && refs.FilterByEnTeacherDegree.clear();
      refs.FilterByEnCredentialList && refs.FilterByEnCredentialList.clear();
      refs.FilterByEthnicityListList && refs.FilterByEthnicityListList.clear();
      refs.FilterByaccentList && refs.FilterByaccentList.clear();
      refs.FilterByComplained && refs.FilterByComplained.clear();
      refs.FilterByCoursePackage && refs.FilterByCoursePackage.clear();
      bookTimes.value = [];
    };
    const deleteTag = (key, item, index) => {
      console.log(key)
      switch (key) {
        case "isBindWecom":
        case "isCanRenewal":
        case "contractStatusStr":
        case "gender":
        case "fullWork":
        case "localArea":
        case "working":
        case "hide":
        case "status":
        case "hideReason":
        case "personalListType":
        case "salaryLabel":
        case "isPayoneerRegister":
        case "isPayoneer":
          basicState.value[key] = "";
          break;
        case "examineStatus":
          basicState.value[key] = "3";
          break;
        case "conversionRateId":
          basicState.value[key] = "";
          refs.FilterByConversionRateLabel.clear("");
        case "identity":
          console.log(34567890)
          basicState.value[key] = ""
          refs.filterByUserAccount.inputValue = "";
          break;
        case "teachingStyleIds":
          refs.FilterByTeachingStyle.delSelected(item);
          break;
        case "teachingYearList":
          refs.FilterByTeachingExperience.delSelected(item);
          break;
        case "ageGroupList":
          refs.FilterByTeacherAgeGroup.delSelected(item);
          break;
        case "preferredTeachingAgeGroupIds":
          refs.FilterByteachingStudentAgeGroup.delSelected(item);
          break;
        case "nationalityList":
          refs.FilterByCountryOfCitizenship.delSelected(item);
          basicState.value.nationalityList.splice(index, 1);
          break;
        case "studentCountList":
          refs.FilterByStudentCount.delSelected(item);
          break;
        case "doneCountList":
          refs.FilterBydoneCount.delSelected(item);
          break;
        case "slotCountList":
          refs.FilterByOpenLessonTimes.delSelected(item);
          break;
        case "ticketRateList":
          refs.FilterByNetworkIssues.delSelected(item);
          break;
        case "absenceRateV2List":
          refs.FilterByAbsence.delSelected(item);
          break;
        case "educationLevelList":
          refs.FilterByEnTeacherDegree.delSelected(item);
          break;
        case "credentialList":
          refs.FilterByEnCredentialList.delSelected(item);
          break;
        case "ethnicityList":
          refs.FilterByEthnicityListList.delSelected(item);
          break;
        case "accentList":
          refs.FilterByaccentList.delSelected(item);
          break;
        case "complaintRateList":
          refs.FilterByComplained.delSelected(item);
          break;
        case "languageIds":
          refs.FilterBylanguageIds.delSelected(item);
          break;
        case "tmUserId":
          refs.FilterByTeachManager.clear();
          basicState.value.tmUserId = "";
          break;
        case "packageId":
          refs.FilterByCoursePackage.clear();
          basicState.value.packageId = "";
          break;
        case "packageTreeId":
          refs.FilterByEditionInPackage.clear();
          basicState.value.packageTreeId = "";
          basicState.value.courseEditionId = "";
          break;
        case "levelId":
          refs.FilterByLevelInPackage.clear();
          basicState.value.levelId = "";
          break;
      }
    };

    /* 接口获取的下拉选项和tag名映射对象 */
    const teachingStudentAgeGroupList = ref([]);
    const teachingStudentAgeGroupMap = ref([]);
    const reqTeachingAgeGroupList = async () => {
      const res = await root.$Api.tutorManagement.getExamineDic(113);
      if (res.status === 200 && res.data.code === 200) {
        teachingStudentAgeGroupList.value = res.data.data.map((item) => ({
          label: item.typeKey,
          value: item.id,
        }));
        teachingStudentAgeGroupMap.value = transformArray(
          teachingStudentAgeGroupList.value
        );
      }
    };
    const languageLabelListData = ref([]);
    const languageLabelMap = ref({});
    const getLanguage = async () => {
      const res = await root.$Api.tutorManagement.getExamineDic(5);
      if (res.status === 200 && res.data.code === 200) {
        languageLabelListData.value = res.data.data.map((item) => ({
          label: item.typeKey,
          value: item.id,
        }));
        languageLabelMap.value = transformArray(languageLabelListData.value);
      }
    };

    const teacherStyleListData = ref([]);
    const teacherStyleMap = ref({});
    const getTeacherStyle = async () => {
      const res = await root.$Api.tutorManagement.reqLableOptionsConfig({
        labelType: 1,
        subjectType: props.subjectType,
      });
      teacherStyleListData.value = res.map((item) => ({
        label: item.name,
        value: item.configId,
      }));
      teacherStyleMap.value = transformArray(teacherStyleListData.value);
    };

    const conversionRateListData = ref([]);
    const conversionRateMap = ref({});
    const getConversionRate = async () => {
      const res = await root.$Api.tutorManagement.reqLableOptionsConfig({
        labelType: 3,
        subjectType: props.subjectType,
      });
      conversionRateListData.value = res.map((item) => ({
        label: item.name,
        value: item.configId,
      }));
      conversionRateMap.value = transformArray(conversionRateListData.value);
    };

    const enTeacherDegreeOptions = ref([]);
    const reqEnTeacherDegreeOptions = async () => {
      const res = await root.$Api.tutorManagement.getTeacherInfoOption(84);
      if (res && res.length) {
        enTeacherDegreeOptions.value = res.map((item) => ({
          label: item,
          value: item,
        }));
      }
    };
    const enTeacherAptitudeOptions = ref([]);
    const reqEnTeacherAptitudeOptions = async () => {
      const res = await root.$Api.tutorManagement.getTeacherInfoOption(85);
      if (res && res.length) {
        enTeacherAptitudeOptions.value = res.map((item) => ({
          label: item,
          value: item,
        }));
      }
    };
    const tmUserList = ref([]);
    const tmUserMap = ref({});
    const reqTmUserList = async () => {
      root.$Api.systemManagement
        .getThisRoleUserList({
          roleId: root.Constants.teacherMtCode,
          pageNum: 1,
          pageSize: 1000,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            tmUserList.value = data.data.list.map((item) => ({
              label: item.username,
              value: item.id + "",
            }));
            tmUserMap.value = transformArray(tmUserList.value);
          }
        });
    };
    onMounted(() => {
      initBasicState(), reqTeachingAgeGroupList();
      getLanguage();
      getTeacherStyle();
      getConversionRate();
      reqEnTeacherDegreeOptions();
      reqEnTeacherAptitudeOptions();
      reqTmUserList();
      getSalaryLabelList();
    });
    const validateBookTimes = (bookTimes) => {
      let flag = true;
      if (bookTimes && bookTimes.length) {
        bookTimes.some((e, i) => {
          if (
            moment(e.value.maxStartTime).isBefore(moment(e.value.minStartTime))
          ) {
            flag = false;
            root.$notify.warning(
              root
                .$t("第$个时间条件，结束时间不得早于开始时间")
                .replace("$", i + 1)
            );
            return !flag;
          }
        });
      }
      return flag;
    };

    const handleSearch = async () => {
      // if (!validateBookTimes(bookTimes.value)) return;
      let params = deepClone(basicState.value);
      let nationalityList = params.nationalityList;
      const nationalityNameArr = [];
      if (nationalityList && nationalityList.length) {
        nationalityList.forEach((e) => {
          nationalityNameArr.push(e.nameZh);
          nationalityNameArr.push(e.nameEn);
        });
      }
      params.nationalityList = nationalityNameArr;
      let preferTimeRangeList = [];
      if (bookTimes.value && bookTimes.value.length) {
        let arr = deepClone(bookTimes.value);
        arr.forEach((e) => {
          if (e.value.maxStartTime !== e.value.minStartTime) {
            e.value.maxStartTime = moment
              .utc(e.value.maxStartTime)
              .subtract(1, "second")
              .toISOString();
          }
          if (typeof e.value !== "string") {
            preferTimeRangeList.push(e.value);
          }
        });
      }
      params.preferTimeRangeList = preferTimeRangeList;
      params = filterParams(params);
      emit("handleSearch", params);
    };

    const addOption = () => {
      let index = bookTimes.value.length - 1;
      if (bookTimes.value.length >= 3) {
        return root.$notify.warning(root.$t("选项最多$个").replace("$", "3"));
      }
      bookTimes.value.splice(index + 1, 0, {
        key: new Date().getTime(),
        value: "",
      });
      root.$nextTick(() => {
        setTimeout(() => {
          let refName = `bookTime${index + 1}`;
          refs[refName][0].show = true;
        }, 100);
      });
    };
    const deleteOption = (index) => {
      bookTimes.value.splice(index, 1);
    };
    return {
      activeName,
      handleUserAccountChange,
      labelPosition,
      basicState,
      deleteTag,
      filedKeyNameMap,
      filedValueNameMap,
      multipleSelection,
      getTagName,
      teachingYears,
      openLessonTimes,
      networkIssues,
      absenceOptions,
      teacherAgeGroup,
      teachingStudentAgeGroupList,
      teachingStudentAgeGroupMap,
      languageLabelListData,
      enTeacherDegreeOptions,
      enTeacherAptitudeOptions,
      isEn,
      handleSearch,
      handleReset,
      bookTimes,
      addOption,
      deleteOption,
      race,
      accent,
      timesComplained,
      fullWorkList,
      localAreaList,
      workingStatusList,
      openForTeacherList,
      blackAndCollectForTeacherList,
      examineStatusList,
      teacherStatusList,
      reasonList,
      languageLabelMap,
      tmUserList,
      tmUserMap,
      packageName,
      packageTreeName,
      levelName,
      isShowFilter,
      teacherStyleListData,
      teacherStyleMap,
      conversionRateListData,
      conversionRateMap,
      salaryLabelList,
      getSalaryLabelList,
      isPayoneerRegisteStatusList,
      isPayoneerStatusList
    };
  },
};
</script>

<style lang="scss">
.filter-panel {
  padding: 20px;
  .el-form-item__label {
    padding: 0;
  }
  .my-title {
    width: 100%;
    .title {
      width: 18%;
      display: inline-block;
    }
  }
  .tags {
    overflow: hidden;
    display: inline-block;
    line-height: 20px;
    margin-top: 10px;
    vertical-align: text-top;
    width: 100%;
    .select-filter {
      font-size: 14px;
      color: #969696;
      width: 100%;
      margin-bottom: 10px;
    }
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
