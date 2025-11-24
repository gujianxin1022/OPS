<template>
  <div class="course-tree-config">
    <div
      class="course-tree-item"
      v-for="(configItem, configIdx) of configList"
      :key="configItem.packageTreeId"
    >
      <div class="course-tree-item-info">
        <span>
          {{ isEn ? configItem.editionNameOpsEn : configItem.editionNameOpsZh }}
        </span>
        <span>{{ $t("课程树Id") }}: {{ configItem.packageTreeId }}</span>
        <span>
          {{ $t("学科") }}:
          {{ $t(SUBJECT_TYPE_CODE_NAME[configItem.subject]) }}
        </span>
        <span>{{ $t("课程时长$分钟").replace("$", configItem.duration) }}</span>
        <span>
          {{ $t("总共$节课").replace("$", configItem.lessonIdList.length) }}
        </span>
        <span>
          <span>{{ $t("课酬单位") }}: </span>
          <el-select
            disabled
            style="width: auto"
            v-model="configItem.salaryUnit"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item of optionsState.salaryUnitList"
              :key="item.value"
              :label="isEn ? item.nameEn : item.nameZh"
              :value="item.value"
            />
          </el-select>
        </span>
      </div>
      <el-form
        inline
        :key="configItem.key"
        :model="configItem"
        :ref="`form_${configIdx}`"
      >
        <!--------------------------- 上课薪酬 --------------------------->
        <div class="salary">
          <div class="title">
            <span>
              {{ $t("上课薪酬") }}
            </span>
            <span>
              <el-button
                type="primary"
                :disabled="isEdit"
                @click="handleCopy(configItem)"
              >
                {{ $t("复制") }}
              </el-button>
              <el-button :disabled="isEdit" @click="handlePaste(configIdx)">
                {{ $t("粘贴") }}
              </el-button>
            </span>
          </div>
          <el-table :data="optionsState.salaryList" border>
            <el-table-column
              :label="
                configItem.subject === SUBJECT_TYPE.CHINESE || classType === CLASS_TYPE.LIVE_1V1
                  ? $t('老师等级')
                  : $t('老师身份')
              "
            >
              <template slot-scope="{ row }">
                {{ $t(row.teacherGrade) }}
                {{
                  `(${getUnitByCode(configItem.salaryUnit)}/${
                    configItem.duration
                  }${$t("分钟")})`
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(value, key, salaryIdx) in configItem.subject === SUBJECT_TYPE.CHINESE || classType === CLASS_TYPE.LIVE_1V1
                ? INIT_SALARY_ROW_DATA
                : { p0: void 0 }"
              :key="salaryIdx"
              :label="
                salaryIdx === 0
                  ? configItem.subject === SUBJECT_TYPE.CHINESE || classType === CLASS_TYPE.LIVE_1V1
                    ? salaryIdx
                    : `(${getUnitByCode(configItem.salaryUnit)}/${
                        configItem.duration
                      }${$t('分钟')})`
                  : salaryIdx
              "
            >
              <template slot-scope="{ $index }">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="
                    $index === 0 ? `normalRule.${key}` : `trialRule.${key}`
                  "
                >
                  <el-input-number
                    :placeholder="$t('请输入')"
                    :controls="false"
                    :min="0"
                    :max="MAX_SALARY"
                    :precision="SALARY_PRECISION"
                    :disabled="isEdit"
                    v-model="
                      configItem[$index === 0 ? 'normalRule' : 'trialRule'][key]
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--------------------------- 转化奖励 --------------------------->
        <div
          class="transfer-award"
          v-if="
            // configItem.subject === SUBJECT_TYPE.CHINESE &&
            packageType == COURSE_PACKAGE_TYPE.AUDITION_PACKAGE
          "
        >
          <div class="title">{{ $t("转化奖励") }}</div>
          <el-form-item
            prop="transferAward"
            :show-message="false"
            :label="$t('转化一人奖励')"
            :rules="{ required: true, trigger: 'blur' }"
          >
            <el-input-number
              :placeholder="$t('请输入')"
              :controls="false"
              :min="0"
              :max="MAX_SALARY"
              :precision="SALARY_PRECISION"
              :disabled="isEdit"
              v-model="configItem.transferAward"
            />
            {{ getUnitByCode(configItem.salaryUnit) }}
          </el-form-item>
        </div>
        <!--------------------------- 全勤奖励 --------------------------->
        <div
          class="full-attend-award"
          v-if="
            configItem.subject !== SUBJECT_TYPE.CHINESE &&
            packageType == COURSE_PACKAGE_TYPE.SYSTEM_COURSE_PACKAGE && 
            classType === CLASS_TYPE.LIVE_SMALL_CLASS
          "
        >
          <div class="title">{{ $t("全勤激励") }}</div>
          <el-form-item
            prop="fullAttendReward"
            :show-message="false"
            :label="$t('每节课奖励')"
            :rules="{ required: true, trigger: 'blur' }"
          >
            <el-input-number
              :placeholder="$t('请输入')"
              :controls="false"
              :min="0"
              :max="MAX_SALARY"
              :precision="SALARY_PRECISION"
              :disabled="isEdit"
              v-model="configItem.fullAttendReward"
            />
            {{ getUnitByCode(configItem.salaryUnit) }}
          </el-form-item>
        </div>

        <!--------------------------- 补贴奖励 --------------------------->
        <div class="subsidy" v-if="configItem.subject === SUBJECT_TYPE.CHINESE">
          <div class="title">{{ $t("补贴奖励(仅兼职老师)") }}</div>
          <template>
            <!-- 历史数据样式 -->
            <el-table
              v-if="isEdit && configItem.isHistoryData"
              :data="optionsState.subsidyList"
              border
            >
              <el-table-column prop="name" :label="$t('名称')">
                <template slot-scope="{ row }">
                  {{ $t(row.name) }}
                </template>
              </el-table-column>
              <el-table-column
                :label="`${$t('补贴')}(${getUnitByCode(
                  configItem.salaryUnit
                )}/${configItem.duration}${$t('分钟')})`"
              >
                <template slot-scope="{ $index }">
                  <el-form-item
                    :prop="
                      $index === 0
                        ? 'subsidyReward.smallClass'
                        : 'subsidyReward.wee'
                    "
                    :show-message="false"
                    :rules="{ required: true, trigger: 'blur' }"
                  >
                    <el-input-number
                      :placeholder="$t('请输入')"
                      :controls="false"
                      :min="0"
                      :max="MAX_SALARY"
                      :precision="SALARY_PRECISION"
                      :disabled="isEdit"
                      v-model="
                        configItem.subsidyReward[
                          $index === 0 ? 'smallClass' : 'wee'
                        ]
                      "
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <!-- 20230824优化后数据样式 -->
            <el-table v-else :data="optionsState.subsidyList" border>
              <el-table-column prop="name" :label="$t('名称')">
                <template slot-scope="{ row }">
                  {{ $t(row.name) }}
                </template>
              </el-table-column>
              <el-table-column
                :label="`${$t('补贴')}(${getUnitByCode(
                  configItem.salaryUnit
                )}/${configItem.duration}${$t('分钟')})`"
              >
                <template slot-scope="{ $index }">
                  <div
                    v-for="(ladder, index) in $index === 0
                      ? weeLadder
                      : smallClassLadder"
                    :key="ladder"
                  >
                    <el-form-item
                      :prop="
                        $index === 0
                          ? `subsidyReward.smallClass.${ladder.key}`
                          : `subsidyReward.wee.${ladder.key}`
                      "
                      :show-message="false"
                      :rules="{ required: true, trigger: 'blur' }"
                    >
                      <span class="salaryUnit-label">{{ ladder.label }}:</span>
                      <el-input-number
                        :placeholder="$t('请输入')"
                        :controls="false"
                        :min="0"
                        :max="MAX_SALARY"
                        :precision="SALARY_PRECISION"
                        :disabled="isEdit"
                        v-model="
                          configItem.subsidyReward[
                            $index === 0 ? 'smallClass' : 'wee'
                          ][ladder.key]
                        "
                      />
                    </el-form-item>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--------------------------- 出席奖惩 --------------------------->
        <div class="reward-details">
          <div class="title">{{ $t("出席奖惩") }}</div>
          <el-table :data="configItem.rewardDetails" border>
            <el-table-column
              :width="isEn ? '580px' : '530px'"
              v-for="(item, idx) of Object.values(REWARD_DETAILS_COLUMN_KEYS)"
              :key="idx"
              :label="$t(REWARD_DETAILS_COLUMN_KEY_NAME[item])"
            >
              <template slot-scope="{ row, $index }">
                <span v-if="$index === 0">{{ item === REWARD_DETAILS_COLUMN_KEYS.STUDENT_ATTEND ? $t("不生效") : $t("老师缺席") }}</span>
                <span v-else-if="item !== REWARD_DETAILS_COLUMN_KEYS.STUDENT_ATTEND" class="reward-details-operation-item">
                  <el-form-item
                    :show-message="false"
                    :rules="{ required: true, trigger: 'blur' }"
                    :prop="'rewardDetails.' + $index + `.${item}.leftValue`"
                  >
                    <el-input-number
                      :placeholder="$t('请输入')"
                      :controls="false"
                      :min="0"
                      :precision="DURATION_PRECISION"
                      :disabled="isEdit"
                      v-model="row[item]['leftValue']"
                      @change="handleLeftValueChange(row, item)"
                    />
                    <span style="margin: 0 4px">{{ $t("分钟") }}</span>
                  </el-form-item>
                  <el-select :disabled="isEdit" v-model="row[item]['leftCode']">
                    <el-option
                      v-for="item of optionsState.comparisonOperatorList"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                    />
                  </el-select>
                  <span style="margin: 0 4px">
                    {{
                      item === REWARD_DETAILS_COLUMN_KEYS.CLASS_DURATION
                        ? $t("时长")
                        : $t(REWARD_DETAILS_COLUMN_KEY_NAME[item])
                    }}
                  </span>
                  <el-select
                    :disabled="isEdit"
                    v-model="row[item]['rightCode']"
                  >
                    <el-option
                      v-for="item of optionsState.comparisonOperatorList"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                    />
                  </el-select>
                  <el-form-item
                    style="margin: 0 4px"
                    :show-message="false"
                    :rules="{ required: true, trigger: 'blur' }"
                    :prop="'rewardDetails.' + $index + `.${item}.rightValue`"
                  >
                    <el-input-number
                      :placeholder="$t('请输入')"
                      :controls="false"
                      :min="row[item]['leftValue'] ? row[item]['leftValue'] : 0"
                      :precision="DURATION_PRECISION"
                      :disabled="isEdit"
                      v-model="row[item]['rightValue']"
                    />
                    <span>{{ $t("分钟") }}</span>
                  </el-form-item>
                </span>
                <span v-else class="reward-details-operation-item">
                  <el-select :disabled="isEdit" v-model="row[item]">
                    <el-option
                      v-for="item of optionsState.studentAttendOperatorList"
                      :key="item.value"
                      :label="$t(item.label)"
                      :value="item.value"
                    />
                  </el-select>
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('薪酬发放(百分比)')" width="200px">
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="'rewardDetails.' + $index + `.giveSalary`"
                >
                  <el-input-number
                    :placeholder="$t('请输入')"
                    :controls="false"
                    :min="0"
                    :max="MAX_PERCENTAGE"
                    :precision="PERCENTAGE_PRECISION"
                    :disabled="isEdit"
                    v-model="row.giveSalary"
                  />
                  <span>%</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :width="isEn ? '250px' : '200px'">
              <template #header>
                <div class="flex-wrapper flex-column-center">
                  <span class="mr10">{{ $t("薪酬扣款") }}</span>
                  <el-select
                    :disabled="isEdit"
                    style="width: 120px"
                    v-model="configItem.reduceSalaryUnit"
                    @change="handleReduceSalaryUnitChange(configItem)"
                  >
                    <el-option
                      v-for="item of getReduceSalaryUnitListBySubjectType(
                        configItem.reduceSalaryUnit
                      )"
                      :key="item.value"
                      :label="isEn ? item.nameEn : item.nameZh"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </template>
              <template slot-scope="{ row, $index }">
                <el-form-item
                  :show-message="false"
                  :rules="{ required: true, trigger: 'blur' }"
                  :prop="'rewardDetails.' + $index + `.reduceSalary`"
                >
                  <el-input-number
                    :placeholder="$t('请输入')"
                    :controls="false"
                    :min="0"
                    :max="
                      configItem.reduceSalaryUnit === PERCENTAGE
                        ? MAX_PERCENTAGE
                        : MAX_SALARY
                    "
                    :precision="
                      configItem.reduceSalaryUnit === PERCENTAGE
                        ? PERCENTAGE_PRECISION
                        : SALARY_PRECISION
                    "
                    :disabled="isEdit"
                    v-model="row.reduceSalary"
                  />
                  {{ getUnitByCode(configItem.reduceSalaryUnit) }}
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('操作')" width="100px">
              <template slot-scope="{ $index }">
                <span v-if="$index === 0">{{ $t("此项不可删除") }}</span>
                <template v-else>
                  <el-button
                    type="text"
                    @click="handleAdd(configIdx)"
                    :disabled="isEdit"
                  >
                    {{ $t("新增") }}
                  </el-button>
                  <el-button
                    type="text"
                    :disabled="isEdit"
                    v-if="configItem.rewardDetails.length > 2"
                    @click="handleDelete(configIdx, $index)"
                  >
                    {{ $t("删除") }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  watch,
  computed,
  ref,
  unref,
  set,
} from "@vue/composition-api";
import { cloneDeep } from "lodash-es";
import {
  SUBJECT_TYPE,
  SUBJECT_TYPE_CODE_NAME,
  COURSE_PACKAGE_TYPE,
  CLASS_TYPE
} from "@/utils/constants";

const MAX_PERCENTAGE /* 百分比最大值 */ = 100;
const PERCENTAGE_PRECISION /* 百分比小数位 */ = 0;
const MAX_SALARY /* 薪酬最大值 */ = 9999.99;
const SALARY_PRECISION /* 薪酬小数位 */ = 2;
const DURATION_PRECISION /* 时长小数位 */ = 0;

const INIT_SALARY_ROW_DATA /*上课薪酬ROW初始化数据*/ = Array.from({
  length: 8,
}).reduce((pre, _, idx) => ((pre[`p${idx}`] = void 0), pre), {});

const PERCENTAGE = 0;
const CNY = 2;
const USD = 3;
const PERCENTAGE_INFO = {
  nameZh: "百分比",
  nameEn: "Percentage",
  value: PERCENTAGE,
};
const CNY_INFO = { nameZh: "人民币", nameEn: "CNY", value: CNY };
const USD_INFO = { nameZh: "美元", nameEn: "USD", value: USD };

const REWARD_DETAILS_COLUMN_KEYS /* 出席奖惩COLUMN_KEY(迟到、早退、时长、学生出席) */ = {
  BELATED_DURATION: "belatedDuration",
  EARLY_DURATION: "earlyDuration",
  CLASS_DURATION: "classDuration",
  STUDENT_ATTEND: "studentAttend",
};
const INIT_REWARD_DETAILS_ROW_ITEM_DATA /* 出席奖惩ROW(迟到、早退、时长)初始化公共数据 */ =
  {
    leftValue: void 0,
    leftCode: 0 /* 不生效 */,
    rightValue: void 0,
    rightCode: 0 /* 不生效 */,
  };
const INIT_REWARD_DETAILS_ROW_DATA /* 出席奖惩ROW初始化公共数据 */ = {
  [REWARD_DETAILS_COLUMN_KEYS.BELATED_DURATION]: {
    ...INIT_REWARD_DETAILS_ROW_ITEM_DATA,
  },
  [REWARD_DETAILS_COLUMN_KEYS.EARLY_DURATION]: {
    ...INIT_REWARD_DETAILS_ROW_ITEM_DATA,
  },
  [REWARD_DETAILS_COLUMN_KEYS.CLASS_DURATION]: {
    ...INIT_REWARD_DETAILS_ROW_ITEM_DATA,
  },

  studentAttend: void 0,
  giveSalary: void 0,
  reduceSalary: void 0,
};
const REWARD_DETAILS_COLUMN_KEY_NAME /* 出席奖惩COLUMN_KEY 转 NAME */ = {
  [REWARD_DETAILS_COLUMN_KEYS.BELATED_DURATION]: "迟到",
  [REWARD_DETAILS_COLUMN_KEYS.EARLY_DURATION]: "早退",
  [REWARD_DETAILS_COLUMN_KEYS.CLASS_DURATION]: "老师上课时长",
  [REWARD_DETAILS_COLUMN_KEYS.STUDENT_ATTEND]: "学生出席",
};

let copyInfo = null;

export default {
  props: {
    isEdit: { type: Boolean, default: false },
    packageType: { type: Number, default: void 0 },
    courseTreeList: { type: Array, default: () => [] },
    ruleDetailsList: { type: Array, default: () => [] },
    classType: { type: Number, default: void 0 },
  },
  setup(props, { root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const configList = ref([]);

    const optionsState = reactive({
      salaryUnitList: [CNY_INFO, USD_INFO],
      comparisonOperatorList: [
        { label: "不生效", value: 0 },
        { label: "<", value: 1 },
        { label: "≤", value: 2 },
        { label: "=", value: 3 },
      ],
      subsidyList: [{ name: "小班课补贴" }, { name: "凌晨补贴" }],
      salaryList: [{ teacherGrade: "全职课酬" }, { teacherGrade: "兼职课酬" }],

      studentAttendOperatorList: [
        { label: "不生效", value: 0 },
        { label: "是", value: 1 },
        { label: "否", value: 2 }
      ]
    });

    watch(
      () => props.courseTreeList,
      (val) => !props.isEdit && formatConfigList(val)
    );
    watch(
      () => props.ruleDetailsList,
      (val) => {
        val.forEach((e) => {
          const dataType = typeof e.subsidyReward.smallClass;
          e.isHistoryData = dataType !== "object";
        });
        configList.value = val;
      }
    );

    const formatConfigList = (rawData) => {
      configList.value = rawData.map((item) => {
        const isZhSubjectType = item.subject === SUBJECT_TYPE.CHINESE;
        let salaryUnit;
        if (props.isEdit) {
          salaryUnit = isZhSubjectType ? CNY : USD;
        } else {
          salaryUnit = USD;
        }
        return {
          ...item,
          key: 0,
          reduceSalaryUnit /*薪酬扣款 */: salaryUnit,
          transferAward /* 转化奖励 */: void 0,
          fullAttendReward /* 全勤激励 */: void 0,
          salaryUnit /* 课酬单位 */,
          normalRule /* 全职课酬 */: isZhSubjectType || props.classType === CLASS_TYPE.LIVE_1V1
            ? { ...INIT_SALARY_ROW_DATA }
            : { p0: void 0 },
          trialRule /* 兼职课酬 */: isZhSubjectType || props.classType === CLASS_TYPE.LIVE_1V1
            ? { ...INIT_SALARY_ROW_DATA }
            : { p0: void 0 },
          subsidyReward /* 补贴奖励 */: isZhSubjectType
            ? // ? { smallClass: void 0, wee: void 0 }
              { smallClass: {}, wee: {} }
            : null,
          rewardDetails /* 出席奖惩 */: Array.from({ length: 2 }, (_, idx) =>
            idx
              ? cloneDeep(INIT_REWARD_DETAILS_ROW_DATA)
              : { giveSalary: void 0, reduceSalary: void 0 }
          ),
        };
      });
    };

    const getUnitByCode = (code) => {
      const currencyUnit = {
        [CNY]: CNY_INFO,
        [USD]: USD_INFO,
        [PERCENTAGE]: { nameZh: "%", nameEn: "%" },
      };
      return currencyUnit[code][unref(isEn) ? "nameEn" : "nameZh"];
    };

    const getReduceSalaryUnitListBySubjectType = (salaryUnit) => {
      return [
        PERCENTAGE_INFO,
        salaryUnit === 2 ? CNY_INFO : USD_INFO,
      ];
    };

    const handleAdd = (configIdx) => {
      configList.value[configIdx].rewardDetails.push(
        cloneDeep(INIT_REWARD_DETAILS_ROW_DATA)
      );
    };

    const handleDelete = async (configIdx, attendanceIdx) => {
      await root.$confirm(root.$t("您确定删除该规则吗"), root.$t("提示"), {
        type: "warning",
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
      });
      configList.value[configIdx].rewardDetails.splice(attendanceIdx, 1);
    };

    const handleValidate = async () => {
      await Promise.all(
        configList.value.map((_, idx) => refs[`form_${idx}`][0].validate())
      );
    };

    const handleLeftValueChange = (row, key) => {
      const value = row[key].leftValue;
      if (!value) return;
      if (row[key].rightValue < value) row[key].rightValue = void 0;
    };

    const handleReduceSalaryUnitChange = (configItem) => {
      configItem.rewardDetails.forEach((item) => (item.reduceSalary = void 0));
    };

    const handleCopy = (configItem) => {
      copyInfo = cloneDeep(configItem);
      root.$message.success(root.$t("复制成功"));
    };

    const handlePaste = (configIdx) => {
      if (!copyInfo) return root.$message.error(root.$t("请先复制"));
      const configItem = unref(configList)[configIdx];
      if (configItem.subject !== copyInfo.subject)
        return root.$message.error(root.$t("学科不一致"));
      const _copyInfo = cloneDeep(copyInfo);
      set(configList.value, configIdx, {
        ...configItem,
        reduceSalaryUnit: _copyInfo.reduceSalaryUnit,
        transferAward: _copyInfo.transferAward,
        fullAttendReward: _copyInfo.fullAttendReward,
        salaryUnit: _copyInfo.salaryUnit,
        normalRule: _copyInfo.normalRule,
        trialRule: _copyInfo.trialRule,
        subsidyReward: _copyInfo.subsidyReward,
        rewardDetails: _copyInfo.rewardDetails,
        key: configItem.key + 1,
      });
      root.$message.success(root.$t("粘贴成功"));
    };

    return {
      COURSE_PACKAGE_TYPE,
      SUBJECT_TYPE,
      SUBJECT_TYPE_CODE_NAME,
      CLASS_TYPE,
      MAX_PERCENTAGE,
      PERCENTAGE_PRECISION,
      MAX_SALARY,
      SALARY_PRECISION,
      DURATION_PRECISION,
      PERCENTAGE,
      INIT_SALARY_ROW_DATA,
      REWARD_DETAILS_COLUMN_KEYS,
      REWARD_DETAILS_COLUMN_KEY_NAME,
      isEn,
      configList,
      optionsState,
      handleValidate /* expose */,
      handleAdd,
      handleDelete,
      getUnitByCode,
      getReduceSalaryUnitListBySubjectType,
      handleLeftValueChange,
      handleReduceSalaryUnitChange,
      handleCopy,
      handlePaste,
      weeLadder: [
        { label: root.$t("小于等于1节课消"), key: "p1" },
        { label: root.$t("2节课消"), key: "p2" },
        { label: root.$t("3节课消"), key: "p3" },
        { label: root.$t("4节课消"), key: "p4" },
        { label: root.$t("5节课消"), key: "p5" },
        { label: root.$t("大于等于6节课消"), key: "p6" },
      ],
      smallClassLadder: [
        { label: root.$t("课堂开始时间") + ": 00:00:00 - 00:59:59", key: "p1" },
        { label: root.$t("课堂开始时间") + ": 01:00:00 - 01:59:59", key: "p2" },
        { label: root.$t("课堂开始时间") + ": 02:00:00 - 02:59:59", key: "p3" },
        { label: root.$t("课堂开始时间") + ": 03:00:00 - 03:59:59", key: "p4" },
        { label: root.$t("课堂开始时间") + ": 04:00:00 - 04:59:59", key: "p5" },
        { label: root.$t("课堂开始时间") + ": 05:00:00 - 05:59:59", key: "p6" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.course-tree-config {
  font-size: 14px;
  min-height: 50vh;
  .course-tree-item {
    padding-top: 24px;
    border-bottom: 1px solid #dcdfe6;
    &:nth-child(2n) {
      background: #f1f1f1;
      ::v-deep .el-table {
        th {
          background: #f1f1f1;
        }
        td {
          background: #f1f1f1;
        }
      }
    }
    &-info {
      display: flex;
      align-items: center;
      > span {
        flex: 1;
        margin-right: 8px;
        &:last-child {
          display: flex;
          align-items: center;
          margin-right: 0;
          > span {
            width: 90px;
          }
        }
      }
    }
    .salary,
    .transfer-award,
    .subsidy,
    .reward-details {
      margin: 24px 0;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .el-form-item {
        margin: 0;
      }
    }

    .salary,
    .full-attend-award,
    .subsidy,
    .reward-details {
      margin: 24px 0;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .el-form-item {
        margin: 0;
      }
    }

    .subsidy {
      .salaryUnit-label {
        display: inline-block;
        width: 350px;
        padding-right: 10px;
        text-align: center;
      }
    }
    ::v-deep .salary {
      .el-input-number {
        width: auto;
        .el-input__inner {
          padding: 0;
        }
      }
    }
    ::v-deep .reward-details {
      &-operation-item {
        .el-input-number {
          width: 80px;
          .el-input__inner {
            padding: 0;
          }
        }
        .el-select {
          width: 100px;
        }
      }
    }
  }
}
</style>
