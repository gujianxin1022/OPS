<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="$t('完善商机信息')"
    :visible.sync="visible"
    width="900px"
    @close="closeDialog"
  >
    <el-form
      ref="formRef"
      :model="dealInfoForm"
      label-width="120px"
      v-loading="loadingForm"
      :rules="rules"
    >
      <el-form-item :label="$t('商机类型')" prop="opportunityType">
        <span v-if="dealFormRefer === 'back'">
          <span v-if="dealInfoForm.opportunityType === 1">{{
            $t("线索转换商机")
          }}</span>
          <span v-if="dealInfoForm.opportunityType === 2">{{
            $t("多孩商机")
          }}</span>
          <span v-else-if="dealInfoForm.opportunityType === 3">{{
            $t("扩科商机")
          }}</span>
          <span v-else-if="dealInfoForm.opportunityType === 4">{{
            $t("续费商机")
          }}</span>
          <span v-else>-</span>
        </span>
        <span v-else>
          <el-radio-group v-model="dealInfoForm.opportunityType">
            <el-radio label="2">{{ $t("多孩商机") }}</el-radio>
            <el-radio label="3">{{ $t("扩科商机") }}</el-radio>
          </el-radio-group>
        </span>
      </el-form-item>

      <div class="col-wrap">
        <el-form-item
          :label="$t('学生')"
          prop="studentUserId"
          :rules="[{ required: true, message: $t('请选择') }]"
        >
          <el-select
            style="width: 220px"
            :disabled="dealFormRefer === 'back'"
            v-model="dealInfoForm.studentUserId"
            clearable
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="ite in studentList"
              :key="ite.id"
              :label="ite.realName"
              :value="ite.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="col-wrap">
        <el-form-item
          :label="$t('学科')"
          prop="subjectType"
          :rules="[{ required: true, message: $t('请选择') }]"
        >
          <el-select
            style="width: 220px"
            :disabled="dealFormRefer === 'back'"
            clearable
            :placeholder="$t('请选择')"
            v-model="dealInfoForm.subjectType"
          >
            <el-option
              v-for="(item, index) in Constants.subjectList(currentLang)"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div
        v-if="
          dealInfoForm.studentUserId &&
          [0, 1, 2, 6].includes(dealInfoForm.subjectType)
        "
      >
        <div class="col-wrap">
          <el-form-item
            :label="$t('学生母语')"
            prop="nativeLanguage"
            :rules="[{ required: true, message: $t('请选择') }]"
          >
            <el-input
              style="width: 220px"
              maxlength="20"
              show-word-limit
              type="text"
              v-model="dealInfoForm.nativeLanguage"
              :placeholder="$t('请输入')"
            ></el-input>
          </el-form-item>
        </div>
        <div class="col-wrap">
          <el-form-item
            :label="$t('家庭语言环境')"
            prop="languageSituation"
            :rules="[{ required: true, message: $t('请选择') }]"
          >
            <el-select
              style="width: 220px"
              clearable
              :placeholder="$t('请选择')"
              v-model="dealInfoForm.languageSituation"
            >
              <el-option
                v-show="!item.hide"
                v-for="item in Constants.languageEnvironmentList(isEn)"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- <div v-if="currentSubject === SUBJECT_TYPE.VOCAB">
          <div class="col-wrap" key="classRequirements">
            <el-form-item
              :label="$t('上课需求')"
              prop="classRequirements"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoClassRequirementsEn
                class="w220"
                :multiple="true"
                :initVal="dealInfoForm.classRequirements"
                @changeSelect="
                  (val) => {
                    dealInfoForm.classRequirements = val;
                  }
                "
              />
            </el-form-item>
          </div>
        </div> -->
        <div v-if="currentSubject === SUBJECT_TYPE.CHINESE">
          <div class="col-wrap" key="pinyin">
            <el-form-item
              :label="$t('是否学过拼音')"
              prop="pinyin"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                class="mr10"
                clearable
                v-model="dealInfoForm.pinyin"
                :placeholder="$t('请选择')"
              >
                <el-option :label="$t('是')" :value="true"></el-option>
                <el-option :label="$t('否')" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="listenSpeakAbility">
            <el-form-item
              :label="$t('中文听说能力')"
              prop="listenSpeakAbility"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                clearable
                :placeholder="$t('请选择')"
                v-model="dealInfoForm.listenSpeakAbility"
              >
                <el-option
                  v-for="item in Constants.chineseAbility(isEn)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <span class="col-wrap" key="chineseUse">
            <el-form-item
              :label="$t('中文使用情况')"
              prop="chineseUse"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.chineseUse"
              >
                <el-option
                  v-for="item in Constants.chineseUsing(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </span>
          <span
            class="col-wrap"
            key="chineseUseLanguage"
            v-if="dealInfoForm.chineseUse !== '4'"
          >
            <el-form-item
              :label="$t('中文使用语言')"
              prop="chineseUseLanguage"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.chineseUseLanguage"
              >
                <el-option
                  v-for="item in Constants.standardOrNotLang(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </span>
          <span key="literacy" class="col-wrap">
            <el-form-item
              :label="$t('中文识字量')"
              prop="literacy"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.literacy"
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
            </el-form-item>
          </span>
          <span key="writeAmount" class="col-wrap">
            <el-form-item
              :label="$t('中文写字量')"
              prop="writeAmount"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.writeAmount"
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
            </el-form-item>
          </span>
          <div key="chineseExperience" class="col-wrap">
            <el-form-item
              :label="$t('中文学习经历')"
              prop="chineseExperience"
              :rules="[
                { required: true, message: $t('请选择'), trigger: 'change' },
              ]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                :collapse-tags="true"
                multiple
                multiple-limit="2"
                v-model="dealInfoForm.chineseExperience"
              >
                <el-option
                  v-for="item in Constants.learningExperience(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div key="parentExpect" class="col-wrap">
            <el-form-item
              :label="$t('家长期望和要求')"
              prop="parentExpect"
              :rules="[
                { required: true, message: $t('请选择'), trigger: 'change' },
              ]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                multiple
                multiple-limit="2"
                clearable
                :collapse-tags="true"
                v-model="dealInfoForm.parentExpect"
              >
                <el-option
                  v-for="item in Constants.parentalExpectations(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div v-if="currentSubject === SUBJECT_TYPE.ENGLISH">
          <div class="col-wrap" key="englishExperience">
            <el-form-item
              :label="$t('英文学习经历')"
              prop="englishExperience"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                multiple
                :collapse-tags="true"
                clearable
                v-model="dealInfoForm.englishExperience"
              >
                <el-option
                  v-for="item in Constants.learningExperienceEn(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="studyYears">
            <el-form-item
              :label="$t('英文学习年限')"
              prop="studyYears"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.studyYears"
              >
                <el-option
                  v-for="item in Constants.learningEnExperienceTime()"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div key="learnedPhonics" class="col-wrap">
            <el-form-item
              :label="$t('是否学过自拼')"
              prop="learnedPhonics"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                class="mr10"
                clearable
                v-model="dealInfoForm.learnedPhonics"
                :placeholder="$t('请选择')"
              >
                <el-option :label="$t('是')" :value="true"></el-option>
                <el-option :label="$t('否')" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="vocabularyLevel">
            <el-form-item
              :label="$t('英文词汇水平')"
              prop="vocabularyLevel"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.vocabularyLevel"
              >
                <el-option
                  v-for="item in Constants.englishWordLevelList(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="listenSpeakLevel">
            <el-form-item
              :label="$t('英文听说能力')"
              prop="listenSpeakLevel"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.listenSpeakLevel"
              >
                <el-option
                  v-for="item in Constants.englishAbility(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="readingLevel">
            <el-form-item
              :label="$t('英文阅读水平')"
              prop="readingLevel"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.readingLevel"
              >
                <el-option
                  v-for="item in Constants.englishReadLevelList(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="writingLevel">
            <el-form-item
              :label="$t('英文书写水平')"
              prop="writingLevel"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <el-select
                style="width: 220px"
                :placeholder="$t('请选择')"
                clearable
                v-model="dealInfoForm.writingLevel"
              >
                <el-option
                  v-for="item in Constants.englishWriteLevelList(isEn)"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-wrap" key="classRequirements">
            <el-form-item
              :label="$t('上课需求')"
              prop="classRequirements"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoClassRequirementsEn
                class="w220"
                :multiple="true"
                :initVal="dealInfoForm.classRequirements"
                @changeSelect="
                  (val) => {
                    dealInfoForm.classRequirements = val;
                  }
                "
              />
            </el-form-item>
          </div>
        </div>
        <div v-if="currentSubject === SUBJECT_TYPE.MATH">
          <div class="col-wrap" key="placementTestLevel">
            <el-form-item
              :label="$t('测评级别')"
              prop="placementTestLevel"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoPlacementTestLevel
                class="w220"
                :initVal="dealInfoForm.placementTestLevel"
                @changeSelect="
                  (val) => {
                    dealInfoForm.placementTestLevel = val;
                  }
                "
              />
            </el-form-item>
          </div>
          <div class="col-wrap" key="salesSuggestedLevel">
            <el-form-item
              :label="$t('顾问建议级别')"
              prop="salesSuggestedLevel"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoSalesSuggestedLevel
                class="w220"
                :initVal="dealInfoForm.salesSuggestedLevel"
                @changeSelect="
                  (val) => {
                    dealInfoForm.salesSuggestedLevel = val;
                  }
                "
              />
            </el-form-item>
          </div>
          <!-- <div class="col-wrap" key="availableLevelsAtThisPeriod">
            <el-form-item
              :label="$t('现阶段可选级别')"
              prop="availableLevelsAtThisPeriod"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoAvailableLevelsAtThisPeriod
                class="w220"
                :initVal="dealInfoForm.availableLevelsAtThisPeriod"
                @changeSelect="
                  (val) => {
                    dealInfoForm.availableLevelsAtThisPeriod = val;
                  }
                "
              />
            </el-form-item>
          </div> -->
          <div class="col-wrap" key="classRequirements">
            <el-form-item
              :label="$t('上课需求')"
              prop="classRequirements"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoClassRequirementsMath
                class="w220"
                :multiple="true"
                :initVal="dealInfoForm.classRequirements"
                @changeSelect="
                  (val) => {
                    dealInfoForm.classRequirements = val;
                  }
                "
              />
            </el-form-item>
          </div>
          <div class="col-wrap" key="knowSingaporeMath">
            <el-form-item
              :label="$t('有无接触过新加坡数学')"
              prop="knowSingaporeMath"
              :rules="[{ required: true, message: $t('请选择') }]"
            >
              <zohoKnowSingaporeMath
                class="w220"
                :initVal="dealInfoForm.knowSingaporeMath"
                @changeSelect="
                  (val) => {
                    dealInfoForm.knowSingaporeMath = val;
                  }
                "
              />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="col-wrap" v-if="dealFormRefer === 'create'">
        <el-form-item
          :label="$t('重复进线渠道码')"
          prop="duplicateChannel"
          :rules="[{ required: true, message: $t('请选择') }]"
        >
          <el-input
            clearable
            style="width: 220px"
            maxlength="20"
            show-word-limit
            type="text"
            v-model="dealInfoForm.duplicateChannel"
            :placeholder="$t('请输入')"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item style="textalign: right">
        <el-button
          :loading="createDealLoading"
          type="primary"
          @click="validateForm"
          class="mr20"
        >
          {{ $t("my-home-Confirm") }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  unref,
} from "@vue/composition-api";
import { SUBJECT_TYPE } from "@/utils/constants";
import { deepClone } from "../../../utils/handleData";
import zohoPlacementTestLevel from "@/components/ZohoStudentFiled/zohoPlacementTestLevel.vue";
import zohoSalesSuggestedLevel from "@/components/ZohoStudentFiled/zohoSalesSuggestedLevel.vue";
import zohoAvailableLevelsAtThisPeriod from "@/components/ZohoStudentFiled/zohoAvailableLevelsAtThisPeriod.vue";
import zohoClassRequirementsMath from "@/components/ZohoStudentFiled/zohoClassRequirementsMath.vue";
import zohoKnowSingaporeMath from "@/components/ZohoStudentFiled/zohoKnowSingaporeMath.vue";
import zohoClassRequirementsEn from "@/components/ZohoStudentFiled/zohoClassRequirementsEn.vue";

export default defineComponent({
  props: {
    currentItem: {
      type: Object,
      dealut: {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    dealFormRefer: {
      type: String,
      dealut: "",
    },
    parentId: {
      type: Number,
      dealut: -1,
    },
    parentUserName: {
      type: String,
      dealut: "",
    },
  },
  components: {
    // StudyCondition,
    // StuFollowLog,
    // ScoreEntry,
    // zohoTrialClassObjective,
    zohoPlacementTestLevel,
    // zohoTrialClassLevel,
    zohoSalesSuggestedLevel,
    zohoAvailableLevelsAtThisPeriod,
    zohoKnowSingaporeMath,
    zohoClassRequirementsMath,
    zohoClassRequirementsEn,
  },
  setup(props, { root, emit, refs }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo"))?.id;
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currentLang = computed(() => root.$store.getters.currentLang);
    const loadingForm = ref(false);
    const yesEnum = true;
    const noEnum = false;
    const dataTpl = {
      languageSituation: "",
      teachingStyle: "",
      pinyin: "",
      listenSpeakAbility: "",
      literacy: "",
      writeAmount: "",
      chineseExperience: [],
      chineseUse: "",
      chineseUseLanguage: "",
      parentExpect: [],
      writingLevel: "",
      englishExperience: [],
      studyYears: "",
      learnedPhonics: "",
      vocabularyLevel: "",
      listenSpeakLevel: "",
      readingLevel: "",
      duplicateChannel: "",
      placementTestLevel: "",
      salesSuggestedLevel: "",
      availableLevelsAtThisPeriod: "",
      classRequirements: "",
      knowSingaporeMath: "",
    };
    const dealInfoForm = reactive({
      opportunityType: "",
      studentUserId: "",
      subjectType: "",
      nativeLanguage: "",
      ...deepClone(dataTpl),
    });
    const studentList = ref(null);
    const currentSubject = ref(0);
    const closeDialog = () => {
      emit("update:visible", false);
    };

    watch(
      () => dealInfoForm.studentUserId,
      (val) => {
        if (val && [0, 1, 2, 6].includes(dealInfoForm.subjectType)) {
          getStudentBaseInfo(val, dealInfoForm.subjectType);
        } else {
          Object.assign(dealInfoForm, dataTpl);
        }
      }
    );

    watch(
      () => dealInfoForm.subjectType,
      (val) => {
        if ([0, 1, 2, 6].includes(val) && dealInfoForm.studentUserId) {
          getStudentBaseInfo(dealInfoForm.studentUserId, val);
        } else {
          Object.assign(dealInfoForm, dataTpl);
          currentSubject.value = SUBJECT_TYPE.CHINESE;
        }
      }
    );

    const rules = computed(() => ({
      opportunityType: [{ required: true, validator: validateType }],
    }));

    const validateType = (rule, value, callback) => {
      if (!value && props.dealFormRefer === "create") {
        callback(new Error(root.$t(`请选择`)));
      } else {
        callback();
      }
    };
    const createDealLoading = ref(false);

    const handleSubmit = () => {
      createDealLoading.value = true;
      const {
        opportunityType,
        studentUserId,
        subjectType,
        nativeLanguage,
        languageSituation,
        pinyin,
        listenSpeakAbility,
        literacy,
        writeAmount,
        chineseExperience,
        chineseUse,
        chineseUseLanguage,
        parentExpect,
        writingLevel,
        englishExperience,
        studyYears,
        learnedPhonics,
        vocabularyLevel,
        listenSpeakLevel,
        readingLevel,
        zhSubjectInfo,
        enSubjectInfo,
        mathSubjectInfo,
        jdcSubjectInfo,
        duplicateChannel,
        placementTestLevel,
        salesSuggestedLevel,
        availableLevelsAtThisPeriod,
        classRequirements,
        knowSingaporeMath,
      } = dealInfoForm;

      const submitParams = {
        parentUserId: +props.parentId,
        laUserId: userId,
        opportunityType: +opportunityType,
        subjectType,
        studentId: studentUserId,
        nativeLanguage,
        languageSituation,
        operateUserId: userId,
        duplicateChannel,
      };
      if (props.dealFormRefer === "back") {
        submitParams.dealId = props.currentItem.id;
      }
      if (subjectType === 0) {
        Object.assign(submitParams, {
          zhSubject: {
            ...zhSubjectInfo,
            pinyin: pinyin ? 1 : 0,
            listenSpeakAbility,
            literacy,
            writeAmount,
            chineseExperience: chineseExperience.join(","),
            chineseUse,
            chineseUseLanguage,
            parentExpect: parentExpect.join(","),
          },
        });
      } else if (subjectType === 1) {
        Object.assign(submitParams, {
          enSubject: {
            ...enSubjectInfo,
            englishExperience: englishExperience.join(","),
            studyYears,
            learnedPhonics: learnedPhonics ? 1 : 0,
            vocabularyLevel,
            listenSpeakLevel,
            readingLevel,
            writingLevel,
            classRequirements: typeof classRequirements === "string"
                ? classRequirements
                : classRequirements.join(","),
          },
        });
      } else if (subjectType === 2) {
        Object.assign(submitParams, {
          mathSubject: {
            ...mathSubjectInfo,
            placementTestLevel,
            salesSuggestedLevel,
            availableLevelsAtThisPeriod,
            classRequirements: typeof classRequirements === "string"
                ? classRequirements
                : classRequirements.join(","),
            knowSingaporeMath,
          },
        });
      } else if (subjectType === 6) {
        Object.assign(submitParams, {
          jdcSubject: {
            ...jdcSubjectInfo,
            classRequirements:
              typeof classRequirements === "string"
                ? classRequirements
                : classRequirements.join(","),
          },
        });
      }
      createDealLoading.value = false;
      try {
        const url =
          props.dealFormRefer === "create"
            ? "saveDealsInfo"
            : "saveBackDealsInfo";
        root.$Api.studentManagement[url](
          studentUserId,
          subjectType,
          submitParams
        )
          .then(({ status, data: { data, code } }) => {
            if (status !== 200 || code !== 200) return Promise.reject();
            root.$notify.success(root.$t("操作成功"));
            emit("saveDealSucess");
          })
          .catch(() => {});
      } finally {
        createDealLoading.value = false;
      }
    };
    const validateForm = () => {
      refs.formRef.validate((valid) => {
        if (valid) {
          handleSubmit();
        } else {
          return false;
        }
      });
    };

    watch(
      () => dealInfoForm.subjectType,
      (subject) => {
        currentSubject.value = subject;
      }
    );

    const getStudentList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.getStudentListByParentAccount(
        props.parentUserName
      );
      if (status !== 200 || code !== 200) return;
      studentList.value = data.studentInfoList;
      const { studentId, subjectType, dealType } = props.currentItem;
      if (props.currentItem.studentId) {
        dealInfoForm.studentUserId = studentId;
        dealInfoForm.subjectType = subjectType;
        dealInfoForm.opportunityType = dealType;
      }
    };

    const getStudentBaseInfo = (id, subjectType) => {
      loadingForm.value = true;
      root.$Api.studentManagement
        .getStudentDetails(id, subjectType)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          const { teachingStyle, languageSituation, nativeLanguage } = data;
          Object.assign(
            dealInfoForm,
            {
              teachingStyle: (teachingStyle || []).map((t) => t.id),
              languageSituation,
              nativeLanguage,
              subjectType,
            },
            deepClone(dataTpl)
          );
          if (subjectType === SUBJECT_TYPE.CHINESE && data.zhSubject) {
            Object.assign(dealInfoForm, transferDataFromZoho(data.zhSubject));
          } else if (subjectType === SUBJECT_TYPE.ENGLISH && data.enSubject) {
            Object.assign(dealInfoForm, transferDataFromZoho(data.enSubject));
          } else if (subjectType === SUBJECT_TYPE.VOCAB && data.jdcSubject) {
            Object.assign(dealInfoForm, transferDataFromZoho(data.jdcSubject));
          }
          dealInfoForm.languageSituation = languageSituation;
          loadingForm.value = false;
        })
        .catch(() => {
          loadingForm.value = false;
        });
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

    onMounted(() => {
      getStudentList();
    });

    return {
      rules,
      SUBJECT_TYPE,
      currentLang,
      studentList,
      yesEnum,
      noEnum,
      isEn,
      dealInfoForm,
      currentSubject,
      loadingForm,
      createDealLoading,
      closeDialog,
      validateForm,
    };
  },
});
</script>
<style lang="scss" scoped>
::v-deep .el-select .el-tag {
  max-width: 100px;
}
.col-wrap {
  display: inline-block;
  width: 40%;
  margin-right: 30px;
}
::v-deep .el-form-item__label {
  word-break: break-word !important;
}
.w220 {
  width: 220px;
}
</style>
