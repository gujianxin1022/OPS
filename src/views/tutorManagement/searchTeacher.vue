<template>
  <div class="search-teacher-list-warp">
    <header class="header-tab">
      <el-radio-group v-model="businessLine" @change="handleChangeSubject">
        <el-radio-button
          v-if="Per.handleTabsPer('teach.tutorMT.searchTeacher.businessLineZh')"
          :label="1"
          >{{ $t("中文") }}</el-radio-button
        >
        <el-radio-button
          v-if="Per.handleTabsPer('teach.tutorMT.searchTeacher.businessLineEn')"
          :label="2"
          >{{ $t("英文") }}</el-radio-button
        >
        <el-radio-button
          v-if="
            Per.handleTabsPer('teach.tutorMT.searchTeacher.businessLineMath')
          "
          :label="3"
          >{{ $t("数学") }}</el-radio-button
        >
      </el-radio-group>
    </header>
    <screen-wrapper
      v-if="businessLine != 2"
      @search="search"
      :screenTitle="$t('filter queries')"
    >
      <screen-item :label="$t('老师类型')" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.fullWork" :placeholder="$t('请选择')">
          <el-option
            v-for="item in fullWorkList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('老师区域')" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.localArea" :placeholder="$t('请选择')">
          <el-option
            v-for="item in localAreaList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('在岗状态')"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer(
            'teach.tutorMT.searchTeacher.ftFilterByTeacherStatus'
          )
        "
      >
        <el-select
          v-model="screenData.working"
          :placeholder="$t('请选择')"
          @change="search"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('开放状态')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="screenData.hide"
          :placeholder="$t('请选择')"
          @change="search"
        >
          <el-option
            v-for="item in openList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('变更原因')" :part="4" :label-width="labelWidth">
        <el-select v-model="screenData.hideReason" :placeholder="$t('请选择')">
          <el-option
            v-for="item in reasonList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('教师管理人员')"
        :part="4"
        :label-width="labelWidth"
      >
        <FilterByTeachManager
          @changeSelect="
            (val) => {
              screenData.tmUserId = val;
              search();
            }
          "
        />
      </screen-item>
      <screen-item :label="$t('语言标签')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="languageList"
          multiple
          :collapse-tags="true"
          filterable
          allow-create
          default-first-option
          :placeholder="$t('请选择语言标签')"
        >
          <el-option
            v-for="item in languageLabelListData"
            :key="item.configId"
            :label="item.configValue"
            :value="item.configId"
          ></el-option>
        </el-select>
      </screen-item>
      <screen-item
        v-if="businessLine === 1"
        :label="$t('教师风格')"
        :label-width="labelWidth"
      >
        <FilterByTeachingStyleNew
          ref="FilterByTeachingStyleNew"
          @changeStyleSelect="
            (styleIds) => {
              styleList = styleIds;
            }
          "
          :subjectType="businessLine - 1"
        />
      </screen-item>
      <screen-item
        v-if="businessLine === 3"
        :label="$t('教师风格')"
        :label-width="labelWidth"
      >
        <FilterByTeachingStyleNew
          ref="FilterByTeachingStyleNew"
          @changeStyleSelect="
            (styleIds) => {
              styleList = styleIds;
            }
          "
          :subjectType="businessLine - 1"
        />
      </screen-item>

      <screen-item :label="$t('课程包')" :part="4" :label-width="labelWidth">
        <el-select
          filterable
          v-model="screenData.packageId"
          clearable
          :loading="packageLoading"
          :placeholder="$t('请选择')"
          @change="getEditionLevel"
        >
          <el-option
            v-for="item in coursePackageList"
            :key="item.packageId"
            :label="
              currentLang === `zh`
                ? item.packageName
                : item.coursePackageNameList[1].name
            "
            :value="item.packageId"
          >
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('版本')" :part="4" :label-width="labelWidth">
        <el-select
          filterable
          v-model="screenData.packageTreeId"
          clearable
          :loading="packageTreeLoading"
          :placeholder="$t('版本')"
          @change="handlePackageTreeChange"
        >
          <el-option
            v-for="item of editionList"
            :key="item.packageTreeId"
            :label="
              currentLang === 'en'
                ? item.editionNameOpsEn
                : item.editionNameOpsZh
            "
            :value="item.packageTreeId"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('级别')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="screenData.levelId"
          clearable
          :loading="levelLoading"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item of levelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('schedule-Class Size')"
        :part="4"
        :label-width="labelWidth"
        v-if="
          Per.handleButtonPer('teach.tutorMT.searchTeacher.ftFilterByClassType')
        "
      >
        <el-select v-model="screenData.classTypeId" :placeholder="$t('请选择')">
          <el-option
            v-for="item in classOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('是否绑定企微')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          v-model="screenData.isBindWecom"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option :label="$t('是')" :value="1" />
          <el-option :label="$t('否')" :value="0" />
        </el-select>
      </screen-item>

      <screen-item :label="$t('签约状态')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="contactStatus"
          clearable
          multiple
          :placeholder="$t('请选择')"
          @change="search"
        >
          <el-option
            v-for="item in contactOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('能否续签')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="screenData.isCanRenewal"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in isCanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('收藏/黑名单')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          v-model="screenData.personalListType"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in blackAndCollectForTeacherList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item :label="$t('薪酬标签')" :part="4" :label-width="labelWidth">
        <el-select
          v-model="screenData.salaryLabel"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in salaryLabelList"
            :key="item.code"
            :label="item.description"
            :value="item.code"
          />
        </el-select>
      </screen-item>

      <screen-item
        :label="$t('Payoneer绑定状态')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          v-model="screenData.isPayoneerRegister"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in isPayoneerRegisteStatusList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </screen-item>

      <screen-item
        :label="$t('Payoneer审核状态')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-select
          v-model="screenData.isPayoneer"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in isPayoneerStatusList"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('教师')"
        :part="5"
        v-if="
          Per.handleButtonPer(
            'teach.tutorMT.searchTeacher.ftFilterByTeacherName'
          )
        "
        :label-width="currentLang == 'en' ? '140' : labelWidth"
      >
        <FilterByUserAccount
          @change="
            (params) => {
              userParams = params;
            }
          "
        />
      </screen-item>
      <div v-if="false">
        <screen-item
          :label="$t('选择日期')"
          :part="4"
          :label-width="labelWidth"
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.ftFilterByDateTime'
            )
          "
        >
          <el-date-picker
            type="dates"
            v-model="dates"
            :placeholder="$t('选择一个或多个日期')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="chooseDates"
          >
          </el-date-picker>
        </screen-item>
        <screen-item
          :label="$t('时间筛选规则')"
          :part="5"
          :label-width="currentLang == 'en' ? '140' : labelWidth"
        >
          <el-radio-group v-model="screenData.dateType">
            <el-radio :label="1">{{ $t("一个即符合") }}</el-radio>
            <el-radio :label="2">{{ $t("全部符合") }}</el-radio>
          </el-radio-group>
        </screen-item>
        <screen-item
          :label="$t('日期')"
          :part="1"
          :label-width="labelWidth"
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.ftFilterByDateTime'
            )
          "
        >
          <el-button-group>
            <el-button
              v-for="(val, key) in searchReqData"
              :key="key"
              :type="val.length > 0 ? 'primary' : 'plain'"
              @click="chooseWeek(val, key)"
              >{{ key }}</el-button
            >
          </el-button-group>
        </screen-item>
        <screen-item :label="$t('time')" :part="1" :label-width="labelWidth">
          <el-checkbox-group v-model="times">
            <el-checkbox
              v-for="(item, index) in date"
              :key="index"
              style="width: 50px"
              :value="item.lab"
              :label="item.val"
            />
          </el-checkbox-group>
        </screen-item>
      </div>
    </screen-wrapper>
    <div v-if="businessLine !== 2" style="padding: 20px; display: block">
      <span class="mb10">
        <div
          :style="`padding-right:20px;display:inline-block;font-size: 12px; color: #666;width:${labelWidth}px;text-align:right`"
        >
          {{ $t("日期间关系") }}
        </div>
        <el-switch
          :active-value="2"
          :inactive-value="1"
          style="vertical-align: baseline"
          v-model="screenData.dateType"
          :active-text="$t('一个即符合')"
          :inactive-text="$t('全部符合')"
        >
        </el-switch>
      </span>
      <span class="mb10">
        <span
          :style="`padding-right:10px;display:inline-block;font-size: 12px; color: #666;width:${labelWidth}px;text-align:right`"
          >{{ $t("课程时长") }}</span
        >
        <el-switch
          :active-value="55"
          :inactive-value="25"
          style="vertical-align: baseline"
          v-model="screenData.duration"
          :active-text="$t('55分钟')"
          :inactive-text="$t('25分钟')"
        >
        </el-switch>
      </span>
      <div
        :style="`padding-bottom: 10px;margin-left:${labelWidth}px;margin-top:10px`"
      >
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
    </div>
    <FilterPanel
      :subjectType="1"
      @handleSearch="
        (params) => {
          search(params);
        }
      "
      :showExamineStatus="
        !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
      "
      :filterProps="enFormalFilterProps"
      v-if="businessLine == 2"
    ></FilterPanel>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button
          type="primary"
          @click="handleBatchHttpAgreement"
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.batchConfigurationOpenStatus'
            )
          "
        >
          {{ $t("批量发送服务协议") }}
        </el-button>
        <el-button
          type="primary"
          @click="handleBatchConfigOpenStatus"
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.batchConfigurationOpenStatus'
            )
          "
        >
          {{ $t("批量配置开放状态") }}
        </el-button>
        <el-button
          v-if="Per.handleButtonPer('teach.tutorMT.searchTeacher.batchAssign')"
          type="primary"
          @click="handleBatchAssign"
        >
          {{ $t("批量分配") }}
        </el-button>
        <el-button
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.CreateNewAccountForTeacher'
            )
          "
          type="primary"
          @click="teacherAccountVisible = true"
        >
          {{ $t("创建老师账号") }}
        </el-button>
        <el-button
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.CreateNewAccountForTeacher'
            )
          "
          type="primary"
          @click="showBatchCreatDialog = true"
        >
          {{ $t("批量创建老师账号") }}
        </el-button>
      </div>
      <el-table
        ref="singleTable"
        v-loading="loading"
        tooltip-effect="dark"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :data="Screeningresults"
        border
        highlight-current-row
        style="width: 100%; margin-top: 20px"
        @sort-change="sortChange"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        @selection-change="handleSelectionChange"
        :key="tableKey"
      >
        <el-table-column type="selection" />
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang === 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (currentPage - 1) * perPage + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          property="username"
          :label="$t('ID')"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                @click="handleShowTeacherCard(scope.row)"
                v-if="
                  Per.handleButtonPer(
                    'teach.tutorMT.searchTeacher.ViewTeacherPopupDetails'
                  )
                "
                type="text"
                >{{ scope.row.id }}</el-button
              >
              <div v-else>
                <router-link
                  v-if="
                    Per.handleButtonPer(
                      'teach.tutorMT.teacherFile.tfViewTeacherFile'
                    )
                  "
                  target="_blank"
                  :to="{
                    path: `/tutorManagement/teacherInfo?id=${
                      scope.row.id
                    }&teacherName=${
                      scope.row.realName ? scope.row.realName : ''
                    }`,
                  }"
                >
                  <el-button type="text">{{ scope.row.id }}</el-button>
                </router-link>
                <span v-else>{{ scope.row.username }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          v-if="businessLine != 2"
          property="identityName"
          :label="$t('真实姓名')"
          align="center"
          width="120"
        />
        <el-table-column
          property="realName"
          :label="$t('昵称')"
          align="center"
          width="120"
        />
        <el-table-column
          property="tmUsername"
          :label="$t('教师管理人员')"
          :width="currentLang === 'en' ? 180 : 150"
          align="center"
        />
        <el-table-column
          property="gender"
          :label="$t('my-home-Gender')"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <div>{{ Filters.mapGender(scope.row.gender, currentLang) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('国家')" width="100" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.nationality ? scope.row.nationality : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('教师电话')" width="140" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone ? scope.row.phone : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
          :label="$t('类型')"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.localArea === 1 ? $t("新加坡老师") : $t("其他地区老师")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="teach_age"
          :label="$t('my-home-Teaching Experience')"
          align="center"
          :width="currentLang === 'en' ? '140' : '100'"
        >
          <template slot-scope="scope">
            <div>
              {{ Constants.teachAgoComputed(scope.row.teachingStartTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="rating" :label="$t('评分')" align="center" />
        <el-table-column
          property="currentStudentNum"
          sortable="custom"
          :class-name="sortChange('totalStudentNum')"
          :label="$t('学生数量')"
          align="center"
          :width="currentLang === 'en' ? 160 : 100"
        />
        <el-table-column
          property="currentClassNum"
          :label="$t('小班数量')"
          align="center"
          sortable="custom"
          :width="currentLang === 'en' ? 180 : 100"
          :class-name="sortChange('currentClassNum')"
        />
        <el-table-column
          property="totalCourseNum"
          sortable="custom"
          :label="$t('累计完成课节')"
          :width="currentLang === 'en' ? 260 : 150"
          :class-name="sortChange('totalCourseNum')"
          align="center"
        />
        <el-table-column
          property="totalFirstCourseStudentNum"
          sortable="custom"
          :class-name="sortChange('totalFirstCourseStudentNum')"
          :label="$t('累计试听学生')"
          :width="currentLang === 'en' ? 230 : 150"
          align="center"
        />
        <el-table-column
          property="totalFirstCourseRechargeStudentNum"
          sortable="custom"
          :class-name="sortChange('totalFirstCourseRechargeStudentNum')"
          :label="$t('累计试听后充值学生')"
          :width="currentLang === 'en' ? 250 : 180"
          align="center"
        />
        <el-table-column
          property="firstCourseStudentRechargeRate"
          :label="$t('总转化率')"
          align="center"
          :width="currentLang === 'en' ? 140 : 100"
          sortable="custom"
          :class-name="sortChange('firstCourseStudentRechargeRate')"
        >
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.firstCourseStudentRechargeRate != 0 &&
                scope.row.firstCourseStudentRechargeRate != null
              "
              >{{
                (scope.row.firstCourseStudentRechargeRate * 100).toFixed(1)
              }}%</span
            >
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('教师类型')" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fullWork | mapFullWork }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('在岗状态')" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ $t(Filters.getWorkingTxt(scope.row.working)) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('薪酬标签')" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.salaryLabel">
              {{ scope.row.salaryLabel }}
              <!-- <a @click="handleChangeSalaryLabel(scope.row)" style="color: #7580e5;cursor: pointer;font-weight: 500;">更换</a> -->
            </span>
            <span v-else>
              暂无
              <!-- <a @click="handleChangeSalaryLabel()" style="color: #7580e5;cursor: pointer;font-weight: 500;">添加</a> -->
            </span>
          </template>
        </el-table-column>
        <!-- 新增Payoneer绑定状态列 -->
        <el-table-column
          :label="$t('Payoneer绑定状态')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              getPayoneerRegisterStatusText(
                scope.row.isPayoneerRegister,
                currentLang
              )
            }}</span>
          </template>
        </el-table-column>
        <!-- 新增Payoneer审核状态列 -->
        <el-table-column
          :label="$t('Payoneer审核状态')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              getPayoneerStatusText(scope.row.isPayoneer, currentLang)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('开放状态')" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ $t(Filters.getOpenTxt(scope.row.hide)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
          :label="$t('变更原因')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ $t(Filters.getReasonTxt(scope.row.hideReason)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
          :label="$t('是否绑定企微')"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isBindWecom === 1 ? $t("是") : $t("否") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="workingTime"
          :label="$t('上岗时间')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.workingTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
          :label="$t('软件协议')"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.serviceAgreementStatus == 1 ? $t("已签") : $t("未签")
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :label="$t('服务协议')"
          align="center"
          width="140"
          v-if="
            businessLine === 1 &&
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
        >
          <template slot-scope="scope">
            <span>{{
              Filters.laborAgreementStatusFilters(
                scope.row.laborAgreementStatus,
                currentLang
              )
            }}</span>
            <el-popover
              v-if="
                Filters.laborAgreementStatusFilters(
                  scope.row.laborAgreementStatus,
                  currentLang
                ) == $t('已签')
              "
              placement="bottom"
              width="200"
              trigger="hover"
            >
              <img
                style="width: 200px; height: auto"
                :src="scope.row.signFileUrl"
                alt=""
              />
              <el-button
                type="text"
                slot="reference"
                @click="serviceAgrement(scope.row.laborAgreementFileUrl)"
                >{{ $t("查看") }}</el-button
              >
            </el-popover>
          </template>
        </el-table-column> -->
        <el-table-column
          :label="$t('三方协议')"
          align="center"
          width="140"
          v-if="
            businessLine === 1 &&
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
        >
          <template slot-scope="scope">
            <span>{{
              Filters.laborAgreementStatusFilters(
                scope.row.tripartiteAgreementStatus,
                currentLang
              )
            }}</span>
            <el-popover
              v-if="
                Filters.laborAgreementStatusFilters(
                  scope.row.tripartiteAgreementStatus,
                  currentLang
                ) == $t('已签')
              "
              placement="bottom"
              width="200"
              trigger="hover"
            >
              <img
                style="width: 200px; height: auto"
                :src="scope.row.signFileUrl"
                alt=""
              />
              <el-button
                @click="tripartite(scope.row.tripartiteAgreementFileUrl)"
                type="text"
                slot="reference"
                >{{ $t("查看") }}</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('服务协议')"
          align="center"
          :width="currentLang === 'en' ? '200' : '160'"
          v-if="
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
        >
          <template slot-scope="{ row }">
            {{ getContract(row.contractStatus) }}
            <el-button
              v-if="
                Per.handleButtonPer(
                  'teach.tutorMT.searchTeacher.serviceAgreement'
                ) &&
                (row.contractStatus === 1 ||
                  row.contractStatus === 2 ||
                  row.contractStatus === 3)
              "
              type="text"
              @click="openProtocolVisible(row)"
              >{{ $t("View") }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('能否续签')"
          align="center"
          width="140"
          v-if="
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
        >
          <template slot="header">
            <span>{{ $t("能否续签") }}</span>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="
                $t('标记不能续签的教师，在续签期将不能在教师端操作续签。')
              "
            >
              <i class="el-icon-question" slot="reference" />
            </el-popover>
          </template>
          <template slot-scope="{ row }">
            <span>{{ getCanRenewal(row.isCanRenewal) }}</span>
            <el-popconfirm
              :title="$t('确认变更老师能否签约的状态')"
              :confirm-button-text="$t('确定')"
              :cancel-button-text="$t('取消')"
              @confirm="handleChange(row)"
            >
              <el-button
                v-if="
                  row.isCanRenewal !== null &&
                  row.isCanRenewal !== undefined &&
                  row.isCanRenewal !== '' &&
                  Per.handleButtonPer('teach.tutorMT.searchTeacher.renewal')
                "
                slot="reference"
                type="text"
                >{{ $t("变更") }}</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            Per.handleButtonPer(
              'teach.tutorMT.searchTeacher.ftAssignTeacherManagers'
            ) &&
            !Per.handleButtonPer('teach.tutorMT.searchTeacher.isBookFilterEn')
          "
          :label="$t('操作')"
          align="center"
          width="70"
        >
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="teachManagementPerson(scope.row)"
              type="text"
              size="small"
            >
              {{ $t("student-management-Assign") }}
            </el-button>
            <el-button
              v-if="scope.row.signFileUrl && businessLine === 1"
              @click.native.prevent="getOutYourSign(scope.row.id)"
              type="text"
              size="small"
            >
              {{ $t("驳回") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :pageSizes="[10, 20, 50, 100]"
        :current-page="pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <TeacherMtDialog
      v-if="teacherMtDialog"
      :dialogVisible="teacherMtDialog"
      :teachPersonlist="teachPersonlist"
      :teachersData="multipleSelection"
      @getTableData="getTableData"
      @close="teacherMtDialog = false"
    ></TeacherMtDialog>
    <ProtocolDialog
      v-if="protocolVisible"
      :dialogVisible.sync="protocolVisible"
      :tutorContractList="tutorContractList"
    />
    <ModifyTeacherOpenStatus
      v-if="modifyTeacherOpenStatusInfoVisible"
      :tableData="multipleSelection"
      :visible.sync="modifyTeacherOpenStatusInfoVisible"
      :hide="screenData.hide"
      :working="screenData.working"
      @ok="search"
    />
    <sendServiceAgreement
      v-if="sendServiceAgreementVisible"
      :tableData="multipleSelection"
      :visible.sync="sendServiceAgreementVisible"
      :businessLine="businessLine"
      @ok="search"
    />
    <salaryLabelChange
      v-if="salaryLabelChangeVisible"
      :tableData="salaryLabelChangeRowData"
      :visible.sync="salaryLabelChangeVisible"
      @ok="search"
    />
    <CreateTeacherAccountDialog
      v-if="teacherAccountVisible"
      :dialogVisible.sync="teacherAccountVisible"
      :parentBusinessLine="businessLine"
      @updateTabel="getTableData"
    />
    <batchCreatTeacher
      v-if="showBatchCreatDialog"
      :visible.sync="showBatchCreatDialog"
      @uploadSuccess="search"
    />
    <TeacherCard
      v-if="showTeacherCard"
      :showTeacherCard="showTeacherCard"
      @closeTeacherCardDialog="showTeacherCard = false"
      :tutorId="tutorId"
      :showOPSCollect="
        Per.handleButtonPer(
          'teach.tutorMT.searchTeacher.ViewTeacherPopupDetails.showOPSCollect'
        )
      "
      :showBlacklist="
        Per.handleButtonPer(
          'teach.tutorMT.searchTeacher.ViewTeacherPopupDetails.showBlacklistOperate'
        ) && businessLine === 2
      "
      :showAppointmentBtn="
        Per.handleButtonPer(
          'teach.tutorMT.searchTeacher.ViewTeacherPopupDetails.showAppointmentBtn'
        )
      "
      :showRequestCourseBtn="
        Per.handleButtonPer(
          'teach.tutorMT.searchTeacher.ViewTeacherPopupDetails.showRequestCourseBtn'
        )
      "
      :realName="realName"
    ></TeacherCard>
  </div>
</template>
<script>
import salaryLabelChange from "./_dialog/salaryLabelChange";
import sendServiceAgreement from "./_dialog/sendServiceAgreement";
import ModifyTeacherOpenStatus from "./_dialog/ModifyTeacherOpenStatus";
import TeacherMtDialog from "./teacherInfoSub/teacherMtDialog";
import CreateTeacherAccountDialog from "./components/createTeacherAccountDialog.vue";
import batchCreatTeacher from "./components/batchCreatTeacher.vue";
import { mapGetters } from "vuex";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";
import ProtocolDialog from "./components/protocolDialog.vue";
import FilterPanel from "@/components/NewFilter/FilterPanel";
import { filterParams } from "@/components/NewFilter/filterFiledNameMap";
import { getTagName } from "@/components/NewFilter/filterFiledNameMap";
import {
  getPayoneerRegisterStatusText,
  getPayoneerStatusText,
} from "@/components/NewFilter/filterFiledNameMap";
import BookTimePeriodPanel from "@/components/NewFilter/BookTimePeriodPanel.vue";
import TeacherCard from "@/views/groupManagement/components/teacherCard.vue";
import {
  blackAndCollectForTeacherList,
  isPayoneerRegisteStatusList,
  isPayoneerStatusList,
} from "@/components/NewFilter/enumerate.js";
import moment from "moment";
import { deepClone } from "@/utils/handleData";
import { logEvent } from "@/utils/analyticsNew";
import FilterByTeachingStyleNew from "@/components/FilterItem/TeacherFilter/FilterByTeachingStyleNew";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";

export default {
  name: "searchTeacher",
  components: {
    TeacherMtDialog,
    ProtocolDialog,
    ModifyTeacherOpenStatus,
    salaryLabelChange,
    sendServiceAgreement,
    CreateTeacherAccountDialog,
    FilterByTeachManager,
    batchCreatTeacher,
    FilterPanel,
    BookTimePeriodPanel,
    TeacherCard,
    FilterByTeachingStyleNew,
    FilterByUserAccount,
  },
  data() {
    return {
      userParams: {},
      tableKey: 0,
      panelParams: null,
      blackAndCollectForTeacherList,
      isPayoneerRegisteStatusList,
      isPayoneerStatusList,
      showTeacherCard: false,
      tutorId: "",
      realName: "",
      bookTimes: [],
      modifyTeacherOpenStatusInfoVisible: false,
      sendServiceAgreementVisible: false,
      salaryLabelChangeVisible: false,
      dates: [],
      searchReqData: {},
      currentKey: "",
      teachPersonlist: [],
      teacherMtDialog: false,
      week: [],
      loading: false, // 加载loading
      currentPage: 1,
      total: 0,
      perPage: 50,
      dateDay: "", // 点击点击周几
      labelWidth: "100",
      date_day: "", // 日期  自己选择的
      times: [], // 时间
      Screeningresults: [], // 筛选结果
      localAreaList: [],
      fullWorkList: [],
      statusList: [
        { label: "全部", value: "" },
        ...this.Constants.workingForTeacherList,
      ],
      openList: [
        { label: "全部", value: "" },
        ...this.Constants.openForTeacherList,
      ],
      reasonList: [{ label: "全部", value: "" }, ...this.Constants.reasonList],
      screenData: {
        fullWork: "",
        localArea: "",
        status: "",
        working: "",
        tmUserId: "",
        orderBy: "",
        hide: "",
        classTypeId: "",
        packageId: "",
        packageTreeId: "",
        courseEditionId: "",
        levelId: "",
        isCanRenewal: "", // 能否签约
        isBindWecom: "",
        dateType: 2,
        duration: 55,
        examineStatus: "3",
        salaryLabel: "", // 薪酬标签
        isPayoneerRegister: "",
        isPayoneer: "",
      },
      contactStatus: [], // 签约状态
      pageSize: 50,
      pageNum: 1,
      date: [
        { val: "0:00", lab: "00:00:00" },
        { val: "0:30", lab: "00:30:00" },
        { val: "1:00", lab: "01:00:00" },
        { val: "1:30", lab: "01:30:00" },
        { val: "2:00", lab: "02:00:00" },
        { val: "2:30", lab: "02:30:00" },
        { val: "3:00", lab: "03:00:00" },
        { val: "3:30", lab: "03:30:00" },
        { val: "4:00", lab: "04:00:00" },
        { val: "4:30", lab: "04:30:00" },
        { val: "5:00", lab: "05:00:00" },
        { val: "5:30", lab: "05:30:00" },
        { val: "6:00", lab: "06:00:00" },
        { val: "6:30", lab: "06:30:00" },
        { val: "7:00", lab: "07:00:00" },
        { val: "7:30", lab: "07:30:00" },
        { val: "8:00", lab: "08:00:00" },
        { val: "8:30", lab: "08:30:00" },
        { val: "9:00", lab: "09:00:00" },
        { val: "9:30", lab: "09:30:00" },
        { val: "10:00", lab: "10:00:00" },
        { val: "10:30", lab: "10:30:00" },
        { val: "11:00", lab: "11:00:00" },
        { val: "11:30", lab: "11:30:00" },
        { val: "12:00", lab: "12:00:00" },
        { val: "12:30", lab: "12:30:00" },
        { val: "13:00", lab: "13:00:00" },
        { val: "13:30", lab: "13:30:00" },
        { val: "14:00", lab: "14:00:00" },
        { val: "14:30", lab: "14:30:00" },
        { val: "15:00", lab: "15:00:00" },
        { val: "15:30", lab: "15:30:00" },
        { val: "16:00", lab: "16:00:00" },
        { val: "16:30", lab: "16:30:00" },
        { val: "17:00", lab: "17:00:00" },
        { val: "17:30", lab: "17:30:00" },
        { val: "18:00", lab: "18:00:00" },
        { val: "18:30", lab: "18:30:00" },
        { val: "19:00", lab: "19:00:00" },
        { val: "19:30", lab: "19:30:00" },
        { val: "20:00", lab: "20:00:00" },
        { val: "20:30", lab: "20:30:00" },
        { val: "21:00", lab: "21:00:00" },
        { val: "21:30", lab: "21:30:00" },
        { val: "22:00", lab: "22:00:00" },
        { val: "22:30", lab: "22:30:00" },
        { val: "23:00", lab: "23:00:00" },
        { val: "23:30", lab: "23:30:00" },
      ],
      classOption: [],
      languageLabelListData: [], //获取语言标签
      languageList: [], //选择语言标签
      editionList: [],
      coursePackageList: [],
      levelList: [],
      packageLoading: false,
      packageTreeLoading: false,
      levelLoading: false,
      businessLine: 2,
      protocolVisible: false,
      isCanOptions: [],
      contactOptions: [],
      tutorContractList: [],
      multipleSelection: [],
      teacherAccountVisible: false,
      showBatchCreatDialog: false,
      enFormalFilterProps: [],
      salaryLabelList: [],
    };
  },
  watch: {
    times(newData) {
      if (newData.length > 3) {
        this.$notify({
          message: this.$t("最多只能选三个"),
          type: "warning",
        });
        this.times.shift();
      }
      if (this.date_day) {
        this.times = newData;
      } else {
        this.searchReqData[this.currentKey] = newData;
      }
    },
    currentLang() {
      this.initData();
    },
    date_day(newData) {
      if (newData != null) {
        this.times = [];
        this.getWeek(6);
        this.searchReqData[this.currentKey] = [];
      } else {
        this.times = [];
        this.date_day = "";
        this.searchReqData[this.currentKey] = this.times;
      }
    },
    "screenData.packageTreeId"(newVal) {
      if (newVal === "") {
        this.screenData.courseEditionId = "";
      }
    },
  },
  created() {
    this.setBusinessLine();
    this.initData();
    this.getTableData();
    this.getTeachPerson();
    this.getLanguage();
    this.getPackageList();
    this.getSalaryLabelList();
  },
  mounted() {
    if (
      this.Per.handleButtonPer("teach.tutorMT.searchTeacher.isBookFilterEn")
    ) {
      this.enFormalFilterProps = [
        "bookTeacherKey",
        "teachingStyleIds",
        "gender",
        "teachingYearList",
        "nationalityList",
        "ageGroupList",
        "preferredTeachingAgeGroupIds",
        "educationLevelList",
        "credentialList",
        "ethnicityList",
        "accentList",
        "studentCountList",
        "doneCountList",
        "ticketRateList",
        "absenceRateV2List",
        "slotCountList",
        "complaintRateList",
        "packageId",
        "packageTreeId",
        "levelId",
        "personalListType",
        "hide",
        "teacherKey",
        "examineStatus",
        "salaryLabel",
        "isPayoneerRegister",
        "isPayoneer",
      ];
    } else {
      this.enFormalFilterProps = ["allProps"];
    }
    this.getWeek(6);
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    getTagName,
    getPayoneerRegisterStatusText,
    getPayoneerStatusText,
    // 获取薪酬标签数据
    getSalaryLabelList() {
      this.$Api.tutorManagement
        .getSalaryLabelsList(this.businessLine)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.salaryLabelList = [
              {
                code: "",
                description: this.$t("全部"),
              },
              ...data.data,
            ];
          }
        });
    },
    handleShowTeacherCard(item) {
      this.tutorId = item.id;
      this.realName = item.realName;
      this.showTeacherCard = true;
    },
    handleChangeSubject(val) {
      this.contactStatus = []; // 清空签约状态
      this.styleList = [];
      this.salaryLabelList = [];
      this.screenData.salaryLabel = "";
      this.screenData.isPayoneerRegister = "";
      this.screenData.isPayoneer = "";
      this.tableKey++;
      this.panelParams = null;
      this.bookTimes = [];
      if (val !== 2) {
        this.getTableData();
        this.getSalaryLabelList();
      }
      this.multipleSelection = [];
    },
    addOption() {
      let index = this.bookTimes.length - 1;
      if (this.bookTimes.length >= 3) {
        return this.$notify.warning(this.$t("选项最多$个").replace("$", "3"));
      }
      this.bookTimes.splice(index + 1, 0, {
        key: new Date().getTime(),
        value: "",
      });
      this.$nextTick(() => {
        setTimeout(() => {
          let refName = `bookTime${index + 1}`;
          this.$refs[refName][0].show = true;
        }, 100);
      });
    },
    deleteOption(index) {
      this.bookTimes.splice(index, 1);
    },
    handleChange(val) {
      let params = {
        tutorUserId: val.id,
        isCanRenewal: val.isCanRenewal === 0 ? 1 : 0, // 变更时要取反 0-不可 1-可
      };
      this.$Api.tutorManagement
        .renewalStatus(params)
        .then(({ status, data: { code, data } }) => {
          if (code === 200) {
            this.getTableData();
          }
        });
    },
    openProtocolVisible(row) {
      this.protocolVisible = true;
      this.tutorContractList = row.tutorContractList;
    },
    getContract(val) {
      switch (val) {
        case 0:
          return this.$t("未签");
        case 1:
          return this.$t("已签（非续签期）");
        case 2:
          return this.$t("已签（续签期）");
        case 3:
          return this.$t("已过期");
        default:
          return "--";
      }
    },
    getCanRenewal(val) {
      switch (val) {
        case 0:
          return this.$t("不能续签");
        case 1:
          return this.$t("能续签");
        default:
          return "--";
      }
    },
    setBusinessLine() {
      if (
        this.Per.handleTabsPer("teach.tutorMT.searchTeacher.businessLineZh")
      ) {
        this.businessLine = 1;
      } else if (
        this.Per.handleTabsPer("teach.tutorMT.searchTeacher.businessLineEn")
      ) {
        this.businessLine = 2;
      } else if (
        this.Per.handleTabsPer("teach.tutorMT.searchTeacher.businessLineMath")
      ) {
        this.businessLine = 3;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBatchAssign() {
      if (!this.multipleSelection.length)
        return this.$message.warning(this.$t("请选择教师"));
      this.teacherMtDialog = true;
    },
    handleChangeSalaryLabel(row) {
      this.salaryLabelChangeRowData = row;
      this.salaryLabelChangeVisible = true;
    },
    // 批量发送服务协议
    handleBatchHttpAgreement() {
      // 中文和数学
      if (this.businessLine === 1 || this.businessLine === 3) {
        if (this.contactStatus.length !== 1 || this.contactStatus[0] !== "0") {
          return this.$message.warning(this.$t("签约状态只能选择未签"));
        }
      } else {
        // 英文
        if (this.panelParams.contractStatusStr !== 0) {
          return this.$message.warning(this.$t("签约状态只能选择未签"));
        }
      }
      if (!this.multipleSelection.length) {
        return this.$message.warning(this.$t("请选择教师"));
      }
      this.sendServiceAgreementVisible = true;
    },
    // 批量配置开放状态
    handleBatchConfigOpenStatus() {
      if (this.businessLine === 2) {
        if (
          !this.Per.handleButtonPer(
            "teach.tutorMT.searchTeacher.isBookFilterEn"
          ) &&
          this.panelParams.working != 1
        ) {
          return this.$message.warning(this.$t("请选择在岗状态为在岗"));
        }
        if (!this.panelParams.hide || this.panelParams.hide == "" /* 全部 */)
          return this.$message.warning(this.$t("请选择开放状态"));
      } else {
        if (this.screenData.working != 1 /* 在岗 */)
          return this.$message.warning(this.$t("请选择在岗状态为在岗"));
        if (!this.screenData.hide || this.screenData.hide == "" /* 全部 */)
          return this.$message.warning(this.$t("请选择开放状态"));
      }
      if (!this.multipleSelection.length)
        return this.$message.warning(this.$t("请选择教师"));
      this.modifyTeacherOpenStatusInfoVisible = true;
    },
    // 获取课程包列表
    async getPackageList() {
      try {
        this.packageLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryClassPackageList({});
        if (status !== 200 || code !== 200) return Promise.reject();
        this.coursePackageList = data;
      } finally {
        this.packageLoading = false;
      }
    },
    // 获取课包对应的版本信息
    async getEditionLevel() {
      this.screenData.packageTreeId = "";
      this.screenData.courseEditionId = "";
      this.editionList = [];
      this.screenData.levelId = "";
      this.levelList = [];
      try {
        this.packageTreeLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.queryPackageTreeList({
          packageId: this.screenData.packageId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.editionList = data;
      } finally {
        this.packageTreeLoading = false;
      }
    },
    // 获取版本对应的level信息
    async handlePackageTreeChange(val) {
      if (val === "") return;
      this.screenData.levelId = "";
      this.levelList = [];
      this.screenData.courseEditionId = this.editionList.find(
        (item) => item.packageTreeId === val
      )?.courseRootId;
      try {
        this.levelLoading = true;
        const {
          status,
          data: { code, data },
        } = await this.$Api.groupManagement.getCourseHierarchyData({
          packageId: this.screenData.packageId,
          packageTreeId: this.screenData.packageTreeId,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.levelList = data;
      } finally {
        this.levelLoading = false;
      }
    },
    // 自定义选择日期
    chooseDates(val) {
      this.times = [];
      if (!val || val.length <= 0) {
        this.searchReqData = {};
        this.getWeek(6);
        return;
      }
      val && val.sort();
      if (val.length > 7) {
        const num = val.length - 7;
        this.dates = val.splice(0, 7);
        this.$notify({
          message:
            this.$t("最多选择7天,已经为你剔除最后") + num + this.$t("天"),
          type: "warning",
        });
      }
      let obj = {};
      this.dates.forEach((e, i) => {
        if (!i) this.currentKey = e;
        obj[e] = [];
      });
      this.searchReqData = obj;
    },
    // 点击一周按钮
    chooseWeek(val, key) {
      this.date_day = "";
      this.currentKey = key;
      this.times = this.searchReqData[key];
    },
    initData() {
      this.week = [
        this.$t("周日"),
        this.$t("周一"),
        this.$t("周二"),
        this.$t("周三"),
        this.$t("周四"),
        this.$t("周五"),
        this.$t("周六"),
      ];
      this.localAreaList = [
        {
          label: this.$t("全部地区"),
          value: "",
        },
        {
          label: this.$t("新加坡"),
          value: 1,
        },
        {
          label: this.$t("其他"),
          value: 2,
        },
      ];
      this.fullWorkList = [
        {
          label: this.$t("全部"),
          value: "",
        },
        {
          label: this.$t("兼职老师"),
          value: 0,
        },
        {
          label: this.$t("全职老师"),
          value: 1,
        },
      ];
      this.classOption = [
        {
          value: "",
          label: this.$t("my-home-4-All"),
        },
        {
          value: 1,
          label: this.$t("1对1"),
        },
        {
          value: 2,
          label: this.$t("小班课"),
        },
        {
          value: 3,
          label: this.$t("大班课"),
        },
      ];
      this.contactOptions = [
        {
          value: "0",
          label: this.$t("未签"),
        },
        {
          value: "1",
          label: this.$t("已签（非续签期）"),
        },
        {
          value: "2",
          label: this.$t("已签（续签期）"),
        },
        {
          value: "3",
          label: this.$t("已过期"),
        },
      ];
      this.isCanOptions = [
        {
          value: "1",
          label: this.$t("能续签"),
        },
        {
          value: "0",
          label: this.$t("不能续签"),
        },
      ];
    },
    getLanguage() {
      this.$Api.tutorManagement.getExamineDic(5).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.languageLabelListData = data.data.map((item) => {
            return {
              configId: item.id,
              configType: item.type,
              configValue: item.typeKey,
              id: 0,
            };
          });
        }
      });
    },
    serviceAgrement(url) {
      window.open(url, "_blank");
    },
    tripartite(url) {
      window.open(url, "_blank");
    },
    getOutYourSign(tutorUserId) {
      this.$confirm(
        this.$t("此操作将驳回老师签名, 是否继续?"),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("my-home-Confirm"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      ).then(() => {
        this.$Api.tutorManagement
          .getOutTutorsSign(tutorUserId)
          .then(({ status, data }) => {
            if (status == 200 && data.code == 200) {
              this.$notify({
                message: this.$t("驳回成功"),
                type: "success",
              });
              this.getTableData();
            }
          });
      });
    },
    getTeachPerson() {
      this.$Api.systemManagement
        .getThisRoleUserList({
          roleId: this.Constants.teacherMtCode,
          pageNum: 1,
          pageSize: 1000,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.teachPersonlist = [
              {
                username: this.$t("全部"),
                id: "",
              },
              ...data.data.list,
            ];
          }
        });
    },
    getTableData() {
      let { pageSize, pageNum } = this;
      if (
        typeof this.panelParams === "object" &&
        this.panelParams !== null &&
        !Array.isArray(this.panelParams)
      ) {
        this.panelParams.businessLine = this.businessLine;
      } else {
        this.screenData.languageIds = this.languageList;
        this.screenData.teachingStyleIds = this.styleList;
        this.screenData.contractStatusStr = this.contactStatus.join(",");
      }
      this.screenData.businessLine = this.businessLine;
      if (this.bookTimes.length && this.businessLine !== 2) {
        let preferTimeRangeList = [];
        if (this.bookTimes && this.bookTimes.length) {
          let arr = deepClone(this.bookTimes);
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
          this.screenData.preferTimeRangeList = preferTimeRangeList;
        }
      } else {
        this.screenData.preferTimeRangeList = [];
      }
      this.Screeningresults = [];
      this.loading = true;
      let reqParams = filterParams(
        typeof this.panelParams === "object" &&
          this.panelParams !== null &&
          !Array.isArray(this.panelParams)
          ? this.panelParams
          : {...this.screenData,...this.userParams}
      );
      if (
        this.businessLine === 2 &&
        this.Per.handleButtonPer("teach.tutorMT.searchTeacher.isBookFilterEn")
      ) {
        reqParams.working = 1;
      }
      this.$Api.tutorManagement
        .getTutorList(pageNum, pageSize, reqParams)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.Screeningresults = data.data.list;
            this.total = data.data.total;
            logEvent("submit_do_search_teacher_list", "查找老师", {
              businessLine: reqParams.businessLine,
              searchTeacherData: JSON.stringify(reqParams),
              total: this.total,
            });
          }
          this.loading = false;
        });
    },
    teachManagementPerson(row) {
      this.$refs.singleTable.clearSelection();
      this.$refs.singleTable.toggleRowSelection(row);
      this.teacherMtDialog = true;
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.pageNum = currentPage;
      this.currentPage = currentPage;
      this.getTableData();
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.pageSize = perPage;
      this.perPage = perPage;
      this.pageNum = 1;
      this.getTableData();
    },
    search(params) {
      if (params) {
        this.panelParams = deepClone(params);
      }
      this.currentPage = 1;
      this.pageNum = 1;
      this.getTableData(params);
    },
    changeDate() {
      this.dateDay = "";
    },
    getWeek(num) {
      const date = new Date();
      var isCurrentDay = date.getDate();
      const isCurrentMonth = date.getMonth();
      const isCurrentYear = date.getFullYear();
      const calendatArr = [];
      for (var i = 0; i < num + 1; i++) {
        var newDate = new Date(isCurrentYear, isCurrentMonth, isCurrentDay + i);
        let days =
          newDate.getDate() < 9 ? "0" + newDate.getDate() : newDate.getDate();
        const month =
          newDate.getMonth() + 1 < 9
            ? "0" + (newDate.getMonth() + 1)
            : newDate.getMonth() + 1;
        days = newDate.getFullYear() + "-" + month + "-" + days;
        calendatArr.push({
          date: days,
          week: this.week[newDate.getDay()],
        });
        if (i <= 0) this.currentKey = `${days}(${this.week[newDate.getDay()]})`;
        this.searchReqData[`${days}(${this.week[newDate.getDay()]})`] = [];
      }
    },
    timeChange(time) {
      var d = new Date(time);
      var datetime =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return datetime;
    },
    sortChange(column) {
      let str = column.prop;
      if (column.order === "ascending") {
        // 升序
        this.screenData.orderBy = str;
      } else if (column.order === "descending") {
        // 降序
        this.screenData.orderBy = "-" + str;
      } else {
        return;
      }
      this.getTableData();
    },
  },
};
</script>
<style lang="scss" scoped>
.header-tab {
  padding: 20px 15px 0;
}
</style>
<style lang="scss">
.search-teacher-list-warp {
  .el-radio__label {
    font-size: 12px !important;
  }
}
</style>
