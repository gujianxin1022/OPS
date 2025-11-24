<template>
  <div class="student-file-info-wrap">
    <el-card ref="dialog" shadow="hover" class="box-card-base-info">
      <!-- 学科切换区 -->
      <el-radio-group v-model="activeSubject" @change="onSubjectChange">
        <el-radio-button
          v-for="item in SUBJECT_TYPE"
          :key="item"
          :label="item + ''"
          >{{ $t(SUBJECT_TYPE_CODE_NAME[item]) }}
        </el-radio-button>
      </el-radio-group>
      <div class="student-file-info-content-wrap">
        <el-card shadow="hover" v-loading="baseInfoLoading">
          <!-- 操作按钮区 -->
          <div slot="header" class="clearfix baseinfo-header">
            <div class="editstudent-info">
              <el-button
                v-show="showEdit && saveLoading == false"
                @click="closeEdit"
                >{{ $t("取消") }}</el-button
              >
              <el-button
                :loading="saveLoading"
                v-show="showEdit"
                type="primary"
                @click="save"
                >{{ $t("保存") }}
              </el-button>
              <i
                v-show="
                  Per.handleButtonPer(
                    'teach.studentMT.studentInfo.sisfStudentFiles.sisfEditStudentInformation'
                  ) && !showEdit
                "
                class="iconfont ppIcon-approval"
                @click="editStudentInfo"
              />
            </div>
          </div>
          <div class="student-info-content">
            <div class="student-info-content-top">
              <!-- 基础信息start -->
              <div class="base-info-wrap info-wrap">
                <div class="common-title">
                  {{ $t("Basic information") }}
                </div>
                <!-- 名字 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.studentName"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("学生名字") }}
                  </span>
                  <span class="value" v-if="!showEdit">{{
                    studentInfo.studentName ? studentInfo.studentName : "---"
                  }}</span>
                  <el-input
                    v-model="editionCopyData.studentName"
                    v-show="showEdit"
                    style="
                      height: 26px;
                      padding: 0;
                      display: inline-block;
                      width: 200px;
                    "
                  ></el-input>
                </li>
                <!-- 学生ID -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!this.studentId"
                      class="el-icon-warning warning-required"
                    ></i>
                      {{ $t("学生ID") }}
                  </span>
                  <span class="value" v-if="!showEdit">{{this.studentId || "---" }}</span>
                  <el-input
                    v-model="this.studentId"
                    v-show="showEdit"
                    disabled
                    style="
                      height: 26px;
                      padding: 0;
                      display: inline-block;
                      width: 200px;
                    "
                  ></el-input>
                </li>
                <!-- 性别 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.gender"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("学生性别") }}</span
                  >
                  <span class="value" v-if="!showEdit">
                    <span v-if="studentInfo.gender === 1">{{ $t("男") }}</span>
                    <span v-else-if="studentInfo.gender === 2">{{
                      $t("女")
                    }}</span>
                    <span v-else="studentInfo.gender === 2">{{
                      $t("未设置")
                    }}</span>
                  </span>
                  <el-radio-group
                    v-model="editionCopyData.gender"
                    v-show="showEdit"
                    style="height: 26px; position: relative; top: 4px"
                  >
                    <el-radio :label="1">{{ $t("男") }} </el-radio>
                    <el-radio :label="2">{{ $t("女") }} </el-radio>
                  </el-radio-group>
                </li>
                <!-- 出生日期 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.birthday"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("student-management-Date of Birth") }}</span
                  >
                  <span class="value" v-if="!showEdit">{{
                    studentInfo.birthday
                      ? DateTimeUtils.dateClockTime(studentInfo.birthday).split(
                          " "
                        )[0]
                      : "---"
                  }}</span>
                  <el-date-picker
                    v-if="showEdit"
                    v-model="editionCopyData.birthday"
                    type="date"
                    :placeholder="$t('选择日期')"
                  >
                  </el-date-picker>
                </li>
                <!-- 在校年级 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.grade"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("student-info-Study Level in School") }}</span
                  >
                  <span v-if="!showEdit" class="value">{{
                    studentInfo.grade || "---"
                  }}</span>
                  <el-input
                    v-model="editionCopyData.grade"
                    v-else
                    size="small"
                    style="
                      height: 26px;
                      padding: 0;
                      display: inline-block;
                      width: 200px;
                    "
                  ></el-input>
                </li>
                <!-- 学生母语 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.nativeLanguage"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("学生母语") }}
                  </span>
                  <span v-show="!showEdit">{{
                    studentInfo.nativeLanguage
                      ? studentInfo.nativeLanguage
                      : "---"
                  }}</span>
                  <el-input
                    v-model="editionCopyData.nativeLanguage"
                    v-show="showEdit"
                    style="
                      height: 26px;
                      padding: 0;
                      display: inline-block;
                      width: 200px;
                    "
                  ></el-input>
                </li>
                <!-- 学生名字备注 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.studentNickName"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("student-info-Alias") }}
                  </span>
                  <span class="value" v-if="!showEdit">{{
                    studentInfo.studentNickName || "---"
                  }}</span>
                  <el-input
                    v-model="editionCopyData.studentNickName"
                    v-show="showEdit"
                    style="
                      height: 26px;
                      padding: 0;
                      display: inline-block;
                      width: 200px;
                    "
                  ></el-input>
                </li>
                <!-- 期望教学风格 -->
                <li
                  :class="{ 'mt20 wh200': currentLang === 'en' }"
                  style="margin-top: 10px"
                >
                  <span class="label w120">
                    <i
                      v-if="
                        !studentInfo.teachingStyle ||
                        !studentInfo.teachingStyle.length
                      "
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("期望的教学风格") }}</span
                  >
                  <span v-show="!showEdit">{{
                    getTeachStyleLabel(studentInfo.teachingStyle)
                  }}</span>
                  <el-select
                    style="display: inline-block; width: 200px"
                    v-model="editionCopyData.teachingStyle"
                    multiple
                    filterable
                    allow-create
                    multiple-limit="2"
                    default-first-option
                    :collapse-tags="true"
                    v-if="showEdit"
                    :placeholder="$t('请选择')"
                  >
                    <el-option
                      v-for="item in tutorStyleLabelListData"
                      :key="item.id"
                      :label="$t(item.typeKey)"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </li>
                <!-- 家庭语言环境 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">
                    <i
                      v-if="!studentInfo.languageSituation"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{
                      $t("student-info-Student Language Preference at Home")
                    }}</span
                  >
                  <span v-show="!showEdit" class="value">{{
                    studentInfo.languageSituation
                      ? Filters.languageEnvironmentMap(
                          studentInfo.languageSituation,
                          currentLang
                        )
                      : "---"
                  }}</span>
                  <el-select
                    :placeholder="$t('请选择')"
                    v-if="showEdit"
                    clearable
                    v-model="editionCopyData.languageSituation"
                  >
                    <el-option
                      v-show="!item.hide"
                      v-for="item in Constants.languageEnvironmentList(
                        currentLang === 'en'
                      )"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </li>
                <!-- 家长ID -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">{{ $t("家长ID") }} </span>
                  <el-button
                    type="text"
                    @click="goParentDetail(studentInfo.parentUserId)"
                  >
                    {{ studentInfo.parentUserId || "---" }}
                  </el-button>
                </li>
                <!-- 约课开关 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w150">{{
                    $t("student-info-Self-Scheduling")
                  }}</span>
                  <span class="value">
                    <el-switch
                      v-model="appiontClassSwitch"
                      :active-color="activeColor"
                      @change="changeAppiontClassSwitch"
                      inactive-color="#ccc"
                    ></el-switch>
                  </span>
                </li>
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label w120">{{ $t("默认教室类型") }} </span>
                  <span class="value">{{
                    filterVirtualClassType(studentInfo.virtualClassTypeId)
                  }}</span>
                </li>
                <!-- 学生特点 -->
                <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                  <span class="label wh200">
                    <i
                      v-if="!studentInfo.studentCharacteristics"
                      class="el-icon-warning warning-required"
                    ></i>
                    {{ $t("学生特点") }}
                  </span>
                  <el-tooltip
                    style="width: 200px"
                    effect="dark"
                    :content="
                      studentInfo.studentCharacteristics
                        ? studentInfo.studentCharacteristics
                        : '---'
                    "
                    placement="top-start"
                  >
                    <span class="thidden w200" v-show="!showEdit">{{
                      studentInfo.studentCharacteristics
                        ? studentInfo.studentCharacteristics
                        : "---"
                    }}</span>
                  </el-tooltip>
                  <el-input
                    v-model="editionCopyData.studentCharacteristics"
                    v-show="showEdit"
                    maxlength="200"
                    style="
                      height: 26px;
                      padding: 0;
                      display: inline-block;
                      width: 200px;
                    "
                  ></el-input>
                </li>
              </div>
              <!-- 基础信息end-->
              <!-- 学科信息start -->
              <div
                class="subject-info-wrap info-wrap"
                v-if="['0', '1', '2', '6'].includes(activeSubject)"
              >
                <div class="common-title">
                  {{ $t("学科信息") }}
                  <span v-show="activeSubject != 6" style="font-size: 14px"
                    >（{{ $t("教师端可见") }}）</span
                  >
                </div>
                <div
                  v-if="
                    activeSubject == SUBJECT_TYPE.VOCAB &&
                    studentInfo.jdcSubject
                  "
                  class="subject-wrap"
                >
                  <!-- <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.jdcSubject.classRequirements"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课需求") }}</span
                    >
                    <el-tooltip
                      v-if="!showEdit"
                      effect="dark"
                      placement="top-start"
                    >
                      <div slot="content">
                        <p
                          v-for="(item, index) in getClassRequirementslLabelEn(
                            studentInfo.jdcSubject.classRequirements,
                            currentLang === 'en'
                          ).split('、')"
                        >
                          <span v-if="item !== '---'">{{ index + 1 }}. </span
                          >{{ item }}
                        </p>
                        <br />
                      </div>
                      <span
                        style="cursor: pointer"
                        v-if="!showEdit"
                        class="value thidden"
                      >
                        {{
                          getClassRequirementslLabelEn(
                            studentInfo.jdcSubject.classRequirements,
                            currentLang === "en"
                          )
                        }}
                      </span>
                    </el-tooltip>
                    <zohoClassRequirementsEn
                      :multiple="true"
                      v-else
                      :initVal="studentInfo.jdcSubject.classRequirements"
                      @changeSelect="
                        (val) => {
                          editionCopyData.jdcSubject.classRequirements = val;
                        }
                      "
                    />
                  </li> -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.jdcSubject.note"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("备注") }}
                    </span>
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.jdcSubject.note
                          ? studentInfo.jdcSubject.note
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.jdcSubject.note
                          ? studentInfo.jdcSubject.note
                          : "---"
                      }}</span>
                    </el-tooltip>
                    <el-input
                      v-model="editionCopyData.jdcSubject.note"
                      v-show="showEdit"
                      maxlength="2000"
                      type="textarea"
                      show-word-limit
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                </div>
                <!-- 学科信息-英文 -->
                <div
                  v-if="
                    activeSubject == SUBJECT_TYPE.ENGLISH &&
                    studentInfo.enSubject
                  "
                  class="subject-wrap"
                >
                  <!-- 英文学习经历 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.englishExperience"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("英文学习经历") }}</span
                    >
                    <br />
                    <br />
                    <span v-if="!showEdit" class="value w120">{{
                      getMultiLabel("englishExperience") || "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      multiple
                      multiple-limit="2"
                      :collapse-tags="true"
                      clearable
                      v-model="editionCopyData.enSubject.englishExperience"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.learningExperienceEn(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 英文上课需求 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.classRequirements"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课需求") }}</span
                    >
                    <el-tooltip
                      v-if="!showEdit"
                      effect="dark"
                      placement="top-start"
                    >
                      <div slot="content">
                        <p
                          v-for="(item, index) in getClassRequirementslLabelEn(
                            studentInfo.enSubject.classRequirements,
                            currentLang === 'en'
                          ).split('、')"
                        >
                          <span v-if="item !== '---'">{{ index + 1 }}. </span
                          >{{ item }}
                        </p>
                        <br />
                      </div>
                      <span
                        style="cursor: pointer"
                        v-if="!showEdit"
                        class="value thidden"
                      >
                        {{
                          getClassRequirementslLabelEn(
                            studentInfo.enSubject.classRequirements,
                            currentLang === "en"
                          )
                        }}
                      </span>
                    </el-tooltip>

                    <zohoClassRequirementsEn
                      :multiple="true"
                      v-else
                      :initVal="studentInfo.enSubject.classRequirements"
                      @changeSelect="
                        (val) => {
                          editionCopyData.enSubject.classRequirements = val;
                        }
                      "
                    />
                  </li>
                  <!-- 英文学习年限 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.studyYears"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("英文学习年限") }}</span
                    >
                    <br />
                    <br />
                    <span v-if="!showEdit" class="value w120">{{
                      studentInfo.enSubject.studyYears || "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.enSubject.studyYears"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.learningEnExperienceTime()"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 是否学过自拼 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="
                          !studentInfo.enSubject.learnedPhonics &&
                          studentInfo.enSubject.learnedPhonics != false
                        "
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("是否学过自拼") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      Filters.yesOrNoConfigMap(
                        studentInfo.enSubject.learnedPhonics,
                        currentLang
                      )
                    }}</span>
                    <el-radio-group
                      v-else
                      v-model="editionCopyData.enSubject.learnedPhonics"
                    >
                      <el-radio
                        v-for="item in Constants.yesOrNoConfig(
                          currentLang,
                          false
                        )"
                        :key="item.value"
                        :label="item.value"
                        >{{ item.label }}</el-radio
                      >
                    </el-radio-group>
                  </li>
                  <!-- 英文词汇水平 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.vocabularyLevel"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("英文词汇水平") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      getWordLevel(studentInfo.enSubject.vocabularyLevel) ||
                      "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.enSubject.vocabularyLevel"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.englishWordLevelList(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 英文听说能力 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.listenSpeakLevel"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("英文听说能力") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      Filters.englishAbilityMap(
                        studentInfo.enSubject.listenSpeakLevel,
                        currentLang
                      )
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.enSubject.listenSpeakLevel"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.englishAbility(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 英文阅读水平 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.readingLevel"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("英文阅读水平") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      Filters.englishReadLevelListMap(
                        studentInfo.enSubject.readingLevel,
                        currentLang
                      )
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.enSubject.readingLevel"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.englishReadLevelList(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 英文书写水平 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.writingLevel"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("英文书写水平") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      Filters.englishWriteLevelListMap(
                        studentInfo.enSubject.writingLevel,
                        currentLang
                      )
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.enSubject.writingLevel"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.englishWriteLevelList(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 定级测试结果 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.placementTestScore"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("定级测试结果") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      studentInfo.enSubject.placementTestScore || "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.enSubject.placementTestScore"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.resultOfTestLevel()"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.label"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 上课频率 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.classroomFrequency"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课频率") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.enSubject.classroomFrequency
                          ? studentInfo.enSubject.classroomFrequency
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.enSubject.classroomFrequency
                          ? studentInfo.enSubject.classroomFrequency
                          : "---"
                      }}</span>
                    </el-tooltip>
                    <el-input
                      v-model="editionCopyData.enSubject.classroomFrequency"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 约课习惯 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.appointmentHabit"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("约课习惯") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.enSubject.appointmentHabit
                          ? studentInfo.enSubject.appointmentHabit
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.enSubject.appointmentHabit
                          ? studentInfo.enSubject.appointmentHabit
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.enSubject.appointmentHabit"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 上课时段 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.classTime"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课时段") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.enSubject.classTime
                          ? studentInfo.enSubject.classTime
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.enSubject.classTime
                          ? studentInfo.enSubject.classTime
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.enSubject.classTime"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 常用老师 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.commonTeacher"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("常用老师") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.enSubject.commonTeacher
                          ? studentInfo.enSubject.commonTeacher
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.enSubject.commonTeacher
                          ? studentInfo.enSubject.commonTeacher
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.enSubject.commonTeacher"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 学习目的 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.learningPurpose"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("学习目的") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.enSubject.learningPurpose
                          ? studentInfo.enSubject.learningPurpose
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.enSubject.learningPurpose
                          ? studentInfo.enSubject.learningPurpose
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.enSubject.learningPurpose"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 备注 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.enSubject.note"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("备注") }}
                    </span>
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.enSubject.note
                          ? studentInfo.enSubject.note
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.enSubject.note
                          ? studentInfo.enSubject.note
                          : "---"
                      }}</span>
                    </el-tooltip>
                    <!-- <span
                      class="value"
                      v-if="!showEdit"
                    >{{
                      studentInfo.enSubject.note || "---"
                    }}</span> -->
                    <el-input
                      v-model="editionCopyData.enSubject.note"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                </div>
                <!-- 学科信息-中文 -->
                <div
                  v-if="
                    activeSubject == SUBJECT_TYPE.CHINESE &&
                    studentInfo.zhSubject
                  "
                  class="subject-wrap"
                >
                  <!-- 是否学过拼音 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="studentInfo.zhSubject.pinyin === null"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("是否学过拼音") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      Filters.yesOrNoConfigMap(
                        studentInfo.zhSubject.pinyin,
                        currentLang
                      )
                    }}</span>
                    <el-radio-group
                      v-else
                      v-model="editionCopyData.zhSubject.pinyin"
                    >
                      <el-radio
                        v-for="item in Constants.yesOrNoConfig(
                          currentLang,
                          false
                        )"
                        :key="item.value"
                        :label="item.value"
                        >{{ item.label }}</el-radio
                      >
                    </el-radio-group>
                  </li>
                  <!-- 中文听说能力 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.listenSpeakAbility"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{
                        $t(
                          "student-info-Chinese Listening and Speaking Ability"
                        )
                      }}</span
                    >

                    <span v-if="!showEdit" class="value">{{
                      Filters.chineseAbilityMap(
                        studentInfo.zhSubject.listenSpeakAbility,
                        currentLang
                      )
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.zhSubject.listenSpeakAbility"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.chineseAbility(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 中文识字量 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.literacy"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("student-info-Approximate Vocabulary Size") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      Filters.wordMap(studentInfo.zhSubject.literacy) || "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-if="showEdit"
                      clearable
                      v-model="editionCopyData.zhSubject.literacy"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.getWordList(currentLang)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value + ''"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 中文写字量 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.writeAmount"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{
                        $t("student-info-Approximate Writing Capacity")
                      }}</span
                    >
                    <span v-show="!showEdit" class="value">{{
                      Filters.wordMap(studentInfo.zhSubject.writeAmount) ||
                      "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-if="showEdit"
                      clearable
                      v-model="editionCopyData.zhSubject.writeAmount"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.getWordList(currentLang)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value + ''"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 中文学习经历 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="getMultiLabel(`chineseExperience`).length <= 0"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("student-info-Chinese Learning Experience") }}</span
                    >
                    <br />
                    <br />
                    <span v-if="!showEdit" class="value">{{
                      getMultiLabel("chineseExperience") || "---"
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      :collapse-tags="true"
                      multiple
                      multiple-limit="2"
                      v-model="editionCopyData.zhSubject.chineseExperience"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.learningExperience(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                        :disabled="item.disabled"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 中文使用情况-->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.chineseUse"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("中文使用情况") }}</span
                    >
                    <br />
                    <br />
                    <span v-if="!showEdit" class="value">{{
                      Filters.chineseUsingMap(
                        studentInfo.zhSubject.chineseUse,
                        currentLang
                      )
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.zhSubject.chineseUse"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.chineseUsing(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 中文使用语言 -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.chineseUseLanguage"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("中文使用语言") }}</span
                    >
                    <br />
                    <br />
                    <span v-if="!showEdit" class="value">{{
                      Filters.standardOrNotLangMap(
                        studentInfo.zhSubject.chineseUseLanguage,
                        currentLang
                      )
                    }}</span>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      clearable
                      v-model="editionCopyData.zhSubject.chineseUseLanguage"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.standardOrNotLang(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 家长期望和要求 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.parentExpect"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("家长期望和要求") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      v-if="!showEdit"
                      effect="dark"
                      placement="top-start"
                    >
                      <div slot="content">
                        <p
                          v-for="(item, index) in getMultiLabel(
                            'parentExpect'
                          ).split('、')"
                        >
                          <span v-if="item !== '---'">{{ index + 1 }}. </span
                          >{{ item }}
                        </p>
                        <br />
                      </div>
                      <span
                        style="cursor: pointer"
                        v-if="!showEdit"
                        class="value thidden"
                      >
                        {{ getMultiLabel("parentExpect") }}
                      </span>
                    </el-tooltip>
                    <el-select
                      :placeholder="$t('请选择')"
                      v-else
                      multiple
                      multiple-limit="2"
                      clearable
                      :collapse-tags="true"
                      v-model="editionCopyData.zhSubject.parentExpect"
                    >
                      <el-option
                        v-show="!item.hide"
                        v-for="item in Constants.parentalExpectations(
                          currentLang === 'en'
                        )"
                        :key="item.value"
                        :label="$t(item.label)"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </li>
                  <!-- 上课频率 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.classroomFrequency"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课频率") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.zhSubject.classroomFrequency
                          ? studentInfo.zhSubject.classroomFrequency
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.zhSubject.classroomFrequency
                          ? studentInfo.zhSubject.classroomFrequency
                          : "---"
                      }}</span>
                    </el-tooltip>
                    <el-input
                      v-model="editionCopyData.zhSubject.classroomFrequency"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 约课习惯 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.appointmentHabit"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("约课习惯") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.zhSubject.appointmentHabit
                          ? studentInfo.zhSubject.appointmentHabit
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.zhSubject.appointmentHabit
                          ? studentInfo.zhSubject.appointmentHabit
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.zhSubject.appointmentHabit"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 上课时段 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.classTime"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课时段") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.zhSubject.classTime
                          ? studentInfo.zhSubject.classTime
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.zhSubject.classTime
                          ? studentInfo.zhSubject.classTime
                          : "---"
                      }}</span>
                    </el-tooltip>
                    <el-input
                      v-model="editionCopyData.zhSubject.classTime"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 常用老师 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.commonTeacher"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("常用老师") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.zhSubject.commonTeacher
                          ? studentInfo.zhSubject.commonTeacher
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.zhSubject.commonTeacher
                          ? studentInfo.zhSubject.commonTeacher
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.zhSubject.commonTeacher"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 学习目的 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.learningPurpose"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("学习目的") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.zhSubject.learningPurpose
                          ? studentInfo.zhSubject.learningPurpose
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.zhSubject.learningPurpose
                          ? studentInfo.zhSubject.learningPurpose
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.zhSubject.learningPurpose"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                  <!-- 中文备注 -->
                  <li
                    :class="{ 'mt20 wh200': currentLang === 'en' }"
                    style="width: 400px"
                  >
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.zhSubject.note"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("备注") }}</span
                    >
                    <br />
                    <br />
                    <el-tooltip
                      effect="dark"
                      :content="
                        studentInfo.zhSubject.note
                          ? studentInfo.zhSubject.note
                          : '---'
                      "
                      placement="top-start"
                    >
                      <span v-show="!showEdit" class="value thidden">{{
                        studentInfo.zhSubject.note
                          ? studentInfo.zhSubject.note
                          : "---"
                      }}</span>
                    </el-tooltip>

                    <el-input
                      v-model="editionCopyData.zhSubject.note"
                      v-show="showEdit"
                      maxlength="200"
                      style="
                        height: 26px;
                        padding: 0;
                        display: inline-block;
                        width: 200px;
                      "
                    ></el-input>
                  </li>
                </div>
                <!-- 学科信息-数学 -->
                <div
                  v-if="
                    activeSubject == SUBJECT_TYPE.MATH &&
                    studentInfo.mathSubject
                  "
                  class="subject-wrap"
                >
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.mathSubject.placementTestLevel"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("测评级别") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      studentInfo.mathSubject.placementTestLevel
                    }}</span>
                    <zohoPlacementTestLevel
                      v-else
                      :initVal="studentInfo.mathSubject.placementTestLevel"
                      @changeSelect="
                        (val) => {
                          editionCopyData.mathSubject.placementTestLevel = val;
                        }
                      "
                    />
                  </li>
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.mathSubject.salesSuggestedLevel"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("顾问建议级别") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      studentInfo.mathSubject.salesSuggestedLevel
                    }}</span>
                    <zohoSalesSuggestedLevel
                      v-else
                      :initVal="studentInfo.mathSubject.salesSuggestedLevel"
                      @changeSelect="
                        (val) => {
                          editionCopyData.mathSubject.salesSuggestedLevel = val;
                        }
                      "
                    />
                  </li>
                  <!-- <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="
                          !studentInfo.mathSubject.availableLevelsAtThisPeriod
                        "
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("现阶段可选级别") }}</span
                    >
                    <span v-if="!showEdit" class="value">{{
                      getAvailableLevelsAtThisPeriodLabel(
                        studentInfo.mathSubject.availableLevelsAtThisPeriod,
                        currentLang === "en"
                      )
                    }}</span>
                    <zohoAvailableLevelsAtThisPeriod
                      v-else
                      :initVal="
                        studentInfo.mathSubject.availableLevelsAtThisPeriod
                      "
                      @changeSelect="
                        (val) => {
                          editionCopyData.mathSubject.availableLevelsAtThisPeriod =
                            val;
                        }
                      "
                    />
                  </li> -->
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.mathSubject.classRequirements"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("上课需求") }}</span
                    >
                    <el-tooltip
                      v-if="!showEdit"
                      effect="dark"
                      placement="top-start"
                    >
                      <div slot="content">
                        <p
                          v-for="(item, index) in getClassRequirementslLabel(
                            studentInfo.mathSubject.classRequirements,
                            currentLang === 'en'
                          ).split('、')"
                        >
                          <span v-if="item !== '---'">{{ index + 1 }}. </span
                          >{{ item }}
                        </p>
                      </div>
                      <span
                        style="cursor: pointer"
                        v-if="!showEdit"
                        class="value thidden"
                      >
                        {{
                          getClassRequirementslLabel(
                            studentInfo.mathSubject.classRequirements,
                            currentLang === "en"
                          )
                        }}
                      </span>
                    </el-tooltip>
                    <zohoClassRequirementsMath
                      :multiple="true"
                      v-else
                      :initVal="studentInfo.mathSubject.classRequirements"
                      @changeSelect="
                        (val) => {
                          editionCopyData.mathSubject.classRequirements = val;
                        }
                      "
                    />
                  </li>
                  <li :class="{ 'mt20 wh200': currentLang === 'en' }">
                    <span class="label w120">
                      <i
                        v-if="!studentInfo.mathSubject.knowSingaporeMath"
                        class="el-icon-warning warning-required"
                      ></i>
                      {{ $t("有无接触过新加坡数学") }}</span
                    >
                    <span v-if="!showEdit" class="value">
                      {{
                        Filters.yesOrNoConfigMap(
                          studentInfo.mathSubject.knowSingaporeMath,
                          currentLang
                        )
                      }}</span
                    >
                    <zohoKnowSingaporeMath
                      v-else
                      :initVal="studentInfo.mathSubject.knowSingaporeMath"
                      @changeSelect="
                        (val) => {
                          editionCopyData.mathSubject.knowSingaporeMath = val;
                        }
                      "
                    />
                  </li>
                </div>
              </div>
              <!-- 学科信息end -->
              <!-- 测评情况start -->
              <div class="info-wrap">
                <div class="common-title">{{ $t("测评情况") }}</div>
                <li
                  v-if="
                    Per.handleButtonPer('teach.myWorkbench.myStudent.testlink')
                  "
                >
                  <span class="label w120">{{ $t("测评结果") }}</span>
                  <template v-if="activeSubject !== SUBJECT_TYPE.MUSIC">
                    <span class="value">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="testResultUrl"
                        placement="top-start"
                      >
                        <el-button
                          style="margin-left: 10px; font-size: 14px"
                          type="text"
                        >
                          <div
                            @click="testResultlink"
                            class="text-overflow w120"
                          >
                            {{ testResultUrl }}
                          </div>
                        </el-button>
                      </el-tooltip>
                      <el-button type="text" @click="copyLink('testResult')"
                        ><i
                          class="el-icon-document-copy"
                          style="color: #666"
                        ></i>
                      </el-button>
                    </span>
                  </template>
                  <span v-else>--</span>
                </li>
              </div>
              <EvaluationList
                v-if="studentId"
                :studentId="studentId"
                :subjectId="activeSubject"
              />
              <!-- 测评情况end -->
              <ScoreEntry
                v-if="
                  accountStatus !== 3 &&
                  accountStatus !== -1 &&
                  activeSubject <= 2
                "
                :courseType="activeSubject"
                :studentId="studentId"
                :parentUserId="studentInfo.parentUserId"
              ></ScoreEntry>
              <!-- 学员Follow展示 -->
              <StuFollowLog
                v-if="accountStatus !== 3 && accountStatus !== -1"
                :courseType="activeSubject"
                :studentId="studentId"
              />
              <!-- 学习情况 -->
              <StudyCondition
                v-if="studentInfo.parentUserId"
                :studentInfo="studentInfo"
                :studentId="studentId"
                :taskCode="taskCode"
                :courseType="activeSubject"
                @toggleDrawer="toggleDrawer"
                @changePackageType="changePackageType"
                :updateCourseList="updateCourseList"
              />
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
import styles from "../../../styles/variables.scss";
import StudyCondition from "../components/studyCondition.vue";
import { copyLink } from "@/utils/file";
import { SUBJECT_TYPE, SUBJECT_TYPE_CODE_NAME } from "@/utils/constants";
import { filterVirtualClassType } from "../../systemManagement/fixedClassroom/constants";
import StuFollowLog from "../components/stuFollowLog.vue";
import ScoreEntry from "../components/ScoreEntry/index.vue";
import zohoPlacementTestLevel from "@/components/ZohoStudentFiled/zohoPlacementTestLevel.vue";
import zohoSalesSuggestedLevel from "@/components/ZohoStudentFiled/zohoSalesSuggestedLevel.vue";
import zohoAvailableLevelsAtThisPeriod from "@/components/ZohoStudentFiled/zohoAvailableLevelsAtThisPeriod.vue";
import zohoKnowSingaporeMath from "@/components/ZohoStudentFiled/zohoKnowSingaporeMath.vue";
import zohoClassRequirementsMath from "@/components/ZohoStudentFiled/zohoClassRequirementsMath.vue";
import zohoClassRequirementsEn from "@/components/ZohoStudentFiled/zohoClassRequirementsEn.vue";

import {
  getAvailableLevelsAtThisPeriodLabel,
  getClassRequirementslLabel,
  getClassRequirementslLabelEn,
} from "@/utils/zoho_menu.js";
import EvaluationList from "./TestEvaluation/EvaluationList.vue";
export default {
  props: {
    studentId: {
      type: String,
      default: "",
    },
    taskCode: {
      type: String,
      default: "",
    },
    updateCourseList: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    StudyCondition,
    StuFollowLog,
    ScoreEntry,
    zohoPlacementTestLevel,
    zohoSalesSuggestedLevel,
    zohoAvailableLevelsAtThisPeriod,
    zohoKnowSingaporeMath,
    zohoClassRequirementsMath,
    zohoClassRequirementsEn,
    EvaluationList,
  },
  data() {
    return {
      VUE_APP_H5_URL: process.env.VUE_APP_H5_URL,
      baseInfoLoading: false,
      showEdit: false,
      studentInfo: {
        enSubject: {},
        zhSubject: {},
        mathSubject: {},
        jdcSubject: {},
      },
      editionCopyData: {
        enSubject: {},
        zhSubject: {},
        mathSubject: {},
        jdcSubject: {},
      },
      saveLoading: false,
      activeColor: styles.customPrimaryColor,
      activeSubject: "0",
      appiontClassSwitch: true,
      filterVirtualClassType: filterVirtualClassType,
      SUBJECT_TYPE,
      accountStatus: -1,
      userId: JSON.parse(window.localStorage.getItem("userInfo"))?.id,
      SUBJECT_TYPE_CODE_NAME,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    testResultUrl() {
      return `${
        process.env.VUE_APP_LMS_URL
      }/routeway1/evaluation/zoho-search?token=${
        JSON.parse(localStorage.getItem("userInfo")).jwtToken
      }&user_id=${JSON.parse(localStorage.getItem("userInfo")).id}&student_id=${
        this.$route.query.studentId
      }`;
    },
  },
  methods: {
    getAvailableLevelsAtThisPeriodLabel: getAvailableLevelsAtThisPeriodLabel,
    getClassRequirementslLabel: getClassRequirementslLabel,
    getClassRequirementslLabelEn: getClassRequirementslLabelEn,
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
      setStudentLoginTz: "SET_STUDENT_LOGIN_TZ",
      setUserTimeZone: "SET_USER_TIME_ZONE",
      setUserHasDST: "SET_USER_HAS_DST",
    }),
    getTeachStyleLabel(styles) {
      if (!styles || !styles.length) {
        return "---";
      }
      return styles.map((item) => this.$t(item.typeKey)).join("、");
    },
    getWordLevel(val) {
      if (!val) {
        return;
      }
      const label =
        this.currentLang === "en"
          ? val.replace("单词", "Words")
          : val.replace("Words", "单词");
      if (this.editionCopyData.enSubject?.vocabularyLevel) {
        this.editionCopyData.enSubject.vocabularyLevel = label;
      }
      return label;
    },

    getMultiLabel(key) {
      const zhSubject = this.studentInfo.zhSubject;
      const enSubject = this.studentInfo.enSubject;
      const mathSubject = this.studentInfo.mathSubject;
      if (key === "chineseExperience") {
        if (typeof zhSubject.chineseExperience === "string") {
          return zhSubject.chineseExperience;
        }
        const zhChineseExprience = (zhSubject.chineseExperience || []).map(
          (id) => {
            return (
              this.Constants.learningExperience(this.currentLang === "en").find(
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
            this.Constants.parentalExpectations(this.currentLang === "en").find(
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
            this.Constants.learningExperienceEn(this.currentLang === "en").find(
              (item) => id == item.value
            )?.label || ""
          );
        });
        return enExprience.join("、");
      }
    },

    // 修改约课入口状态
    async changeAppiontClassSwitch() {
      let num = +!this.appiontClassSwitch;
      const result = await this.$Api.classManagement.studentOnlySmallclass(
        this.studentId,
        num
      );
      if (result.status == 200 && result.data.code == 200) {
        this.$notify({
          message: result.data.message,
          type: "success",
        });
      }
    },
    // 获取约课开关状态
    getClassSwitch() {
      this.$Api.classManagement
        .managerStudentCourse(this.studentId)
        .then((res) => {
          if (res.data.code == 200 && res.data.data) {
            this.appiontClassSwitch =
              res.data.data.onlySmallclass === 0 ? true : false;
          }
        });
    },
    // 切换学科
    onSubjectChange() {
      this.showEdit = this.showEdit ? !this.showEdit : this.showEdit;
      this.getStudentDetailInfo();
    },
    toggleDrawer(val) {
      this.$emit("toggleDrawer", val);
    },
    changePackageType(val) {
      this.$emit("changePackageType", val);
    },
    async copyLink(type) {
      const url =
        type === "testLink"
          ? `${this.VUE_APP_H5_URL}/evaluate/result/index.html?studentId=${this.$route.query.studentId}`
          : this.testResultUrl;
      await copyLink(url).then(
        () => {
          this.$notify({
            message: this.$t("复制成功"),
            type: "success",
          });
        },
        () => {
          this.$notify({
            message: this.$t("复制失败"),
            type: "error",
          });
        }
      );
    },
    testlink() {
      window.open(
        `${this.VUE_APP_H5_URL}/evaluate/result/index.html?studentId=${this.$route.query.studentId}`,
        "__blank"
      );
    },
    testResultlink() {
      window.open(this.testResultUrl, "__blank");
    },
    goParentDetail(parentUserId) {
      this.$router.push(
        `/studentManagement/parentInfo?parentUserId=${parentUserId}`
      );
    },
    closeEdit() {
      this.showEdit = false;
      this.editionCopyData = JSON.parse(JSON.stringify(this.studentInfo));
    },
    /**
     * 学生基本信息、学科信息 新增与编辑
     */
    save() {
      this.saveLoading = true;
      if (
        this.editionCopyData &&
        (!this.editionCopyData.studentName || !this.editionCopyData.birthday)
      ) {
        this.$notify({
          message: this.$t("学生姓名与出生日期不能为空！"),
          type: "error",
        });
        this.saveLoading = false;
        return;
      }
      this.editionCopyData.studentName =
        this.editionCopyData.studentName.trim();
      if (this.editionCopyData.enSubject) {
        const enSubject = this.editionCopyData.enSubject;
        if (
          enSubject.englishExperience &&
          Array.isArray(enSubject.englishExperience)
        ) {
          this.editionCopyData.enSubject.englishExperience =
            enSubject.englishExperience.join(",");
        }
        if (
          enSubject.classRequirements &&
          Array.isArray(enSubject.classRequirements)
        ) {
          this.editionCopyData.enSubject.classRequirements =
            enSubject.classRequirements.join(",");
        }
      }
      if (this.editionCopyData.zhSubject) {
        const zhSubject = this.editionCopyData.zhSubject;
        if (
          zhSubject.chineseExperience &&
          Array.isArray(zhSubject.chineseExperience)
        ) {
          this.editionCopyData.zhSubject.chineseExperience =
            zhSubject.chineseExperience.join(",");
        }
        if (zhSubject.parentExpect && Array.isArray(zhSubject.parentExpect)) {
          this.editionCopyData.zhSubject.parentExpect =
            zhSubject.parentExpect.join(",");
        }
      }
      if (this.editionCopyData.mathSubject) {
        const mathSubject = this.editionCopyData.mathSubject;
        if (
          mathSubject.classRequirements &&
          Array.isArray(mathSubject.classRequirements)
        ) {
          this.editionCopyData.mathSubject.classRequirements =
            mathSubject.classRequirements.join(",");
        }
      }
      // if (this.editionCopyData.jdcSubject) {
      //   const jdcSubject = this.editionCopyData.jdcSubject;
      //   if (
      //     jdcSubject.classRequirements &&
      //     Array.isArray(jdcSubject.classRequirements)
      //   ) {
      //     this.editionCopyData.jdcSubject.classRequirements =
      //       jdcSubject.classRequirements.join(",");
      //   }
      // }
      const params = {
        ...this.editionCopyData,
        studentId: this.studentId,
        subjectTypeId: this.activeSubject,
      };
      this.$Api.studentManagement.updateStudentInfo(params).then(
        ({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: this.$t("保存成功"),
              type: "success",
            });
            this.studentInfo = {};
            this.saveLoading = false;
            this.baseInfoLoading = true;
            this.getStudentDetailInfo();
            this.closeEdit();
            this.$forceUpdate();
          } else {
            this.saveLoading = false;
          }
        },
        () => {
          this.$notify({
            message: this.$t("保存失败"),
            type: "error",
          });
          this.saveLoading = false;
        }
      );
    },
    editStudentInfo() {
      this.showEdit = !this.showEdit;
      this.editionCopyData = JSON.parse(JSON.stringify(this.studentInfo));
      this.editionCopyData.teachingStyle = (
        this.editionCopyData.teachingStyle || []
      ).map((item) => item.id);
    },
    /**
     * 获取学生信息&学科信息
     */
    getStudentDetailInfo() {
      this.baseInfoLoading = true;
      this.$Api.studentManagement
        .getStudentDetails(this.studentId, this.activeSubject)
        .then(({ data }) => {
          if (data.code === 10002 || data.data.status === 3) {
            this.accountStatus = 3;
            this.$emit("changeAccountStatus", this.accountStatus);
            return (this.baseInfoLoading = false);
          }
          if (data.code !== 200) {
            return Promise.reject();
          }
          this.accountStatus = data.data.status;
          this.$emit("changeAccountStatus", this.accountStatus);
          if (this.accountStatus === 3) {
            return (this.baseInfoLoading = false);
          }
          const transferData = {
            ...data.data,
            enSubject: this.transferDataFromZoho(data.data.enSubject),
            zhSubject: this.transferDataFromZoho(data.data.zhSubject),
            mathSubject: this.transferDataFromZoho(data.data.mathSubject),
            jdcSubject: this.transferDataFromZoho(data.data.jdcSubject),
          };
          this.studentInfo = transferData;
          window.sessionStorage.setItem(
            "parentUserId",
            this.studentInfo.parentUserId
          );
          this.reqTutorStyle();
          if (this.studentInfo.languageSituation) {
            const matchContent = (
              this.studentInfo.languageSituation + ""
            ).match(/(\d{1}_)/);
            if (matchContent) {
              this.studentInfo.languageSituation = matchContent[0].slice(0, 1);
            } else {
              this.studentInfo.languageSituation += "";
            }
          }
          this.editionCopyData = this.studentInfo;
          this.baseInfoLoading = false;
          this.setStudentLoginTz(data.data.loginTz);
          this.setUserTimeZone(data.data.timeZone);
          this.setUserHasDST(data.data.hasDst);
          this.$emit(
            "changeDeleteApplyStatus",
            this.studentInfo.deleteApplyStatus
          );
          this.$emit("emitParentId", this.studentInfo.parentUserId);
          this.$emit("emitSubject", this.activeSubject);
          this.$emit("emitStudentInfo", this.studentInfo);
          this.$emit("getParentID", this.studentInfo.parentUserId);
          this.getClassSwitch();
        })
        .catch(() => {
          this.baseInfoLoading = false;
        });
    },
    /**
     * zoho同步过来的学生都是字符串：学科信息字段均为 {id}_{despcription} || [{id}_{despcription}]类似这种的结构，其中涉及单选及多选 yes or no等。
     * 匹配id做编辑回填
     */
    transferDataFromZoho(subjectData) {
      const subject = JSON.parse(JSON.stringify(subjectData));
      try {
        if (subject) {
          for (let key in subject) {
            if (subject.hasOwnProperty(key) && subject[key]) {
              // zoho同步过来的是否枚举为Yes OR NO ops存储枚举为true OR false 1_yes 1_no 0_yes 0_yes
              if (
                ["learnedPhonics", "pinyin", "knowSingaporeMath"].includes(key)
              ) {
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
                const list =
                  this.currentLang === "en"
                    ? this.Constants.wordListEn
                    : this.Constants.wordList;
                subject[key] =
                  list.find((item) => item.label === subject[key])?.value ||
                  subject[key];
              } else if (
                [
                  "chineseExperience",
                  "parentExpect",
                  "englishExperience",
                  "classRequirements",
                ].includes(key)
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
                    let value = subject[key];
                    const arr =
                      key === "classRequirements"
                        ? value.slice(1, value.length - 1).split(",")
                        : value
                            .slice(1, value.length - 1)
                            .replaceAll("，", ",")
                            .split(",");

                    let ids = [];
                    arr.map((t) => {
                      t = t.replace(/(^\s*)|(\s*$)/g, "");
                      if (key === "classRequirements") {
                        t = t.replace(/"/g, "");
                      }
                      if (t.includes("_")) {
                        ids.push(t.split("_")[0]);
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
                  }
                  // else 剩下的都是ops手填-纯字符串，只做回显，不做编辑联动
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
    },
    /* 获取教学风格下拉 */
    reqTutorStyle() {
      this.$Api.tutorManagement.getExamineDic(4).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          this.tutorStyleLabelListData = data.data;
        }
      });
    },
    getLaConfigInfo() {
      this.$Api.workBench
        .getLaConfigInfo(this.userId)
        .then(({ status, data: { data, code } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          if (data.subjectIds?.length) {
            data.subjectIds = data.subjectIds.split(",")?.sort((a, b) => a - b);
            this.activeSubject = data.subjectIds[0] + "";
          }
          this.getStudentDetailInfo();
        });
    },
  },
  async created() {
    if (this.$route.query.studentId) {
      window.sessionStorage.setItem("student", this.$route.query.studentId);
    }
    await this.getLaConfigInfo();
  },
};
</script>
<style lang="scss" scoped>
.label {
  display: inline-block;
  width: 100px;
  color: #777;
}
.student-file-info-content-wrap {
  margin-top: 15px;
  .student-info-content {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: scroll;
    .info-wrap {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 400px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        font-size: 14px;
        height: 24px;
        .label {
          display: inline-block;
          position: relative;
          margin-right: 30px;
        }
      }
    }
  }
}
.clearfix {
  position: relative;
}
.warning-required {
  color: #f69729;
}
.baseinfo-header {
  width: 100%;
  position: relative;
  .editstudent-info {
    text-align: right;
    cursor: pointer;
  }
}
.common-title {
  width: 100%;
  position: relative;
  font-size: 20px;
  height: 40px;
}
.info-wrap {
  margin-bottom: 30px;
  .subject-wrap {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      display: inline-block;
      align-items: flex-start !important;
      .label {
        width: 120px;
      }
      .value {
        flex: 1;
      }
    }
  }
}
</style>
<style lang="scss">
.student-file-info-wrap {
  height: calc(100vh - 200px);
  overflow-y: scroll;
  .el-tooltip__popper {
    max-width: 260px !important;
  }
  .el-select__tags {
    .el-tag {
      max-width: 100px !important;
    }
  }
}
</style>
<style lang="scss">
.el-tooltip__popper {
  z-index: 9999 !important;
  width: 220px;
}
</style>
