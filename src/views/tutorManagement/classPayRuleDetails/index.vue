<template>
  <div class="class-payRule-modification">
    <el-form :inline="true" :model="formState" ref="form">
      <el-form-item
        prop="ruleName"
        :label="$t('规则名称')"
        :label-width="isEn ? '110px' : '80px'"
        :rules="{ required: true, message: $t('请输入') }"
      >
        <el-input
          style="width: 200px"
          v-model="formState.ruleName"
          :maxlength="30"
          :placeholder="$t('请输入')"
        />
      </el-form-item>
      <el-form-item
        prop="packageId"
        :label="$t('关联课包')"
        :label-width="isEn ? '220px' : '80px'"
        :rules="{ required: true, message: $t('请选择') }"
      >
        <el-select
          style="width: 200px"
          v-model="formState.packageId"
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          @change="handleCoursePackageChange"
        >
          <el-option
            v-for="item of formState.coursePackageList"
            :key="item.packageId"
            :label="isEn ? item.nameEn : item.nameZh"
            :value="item.packageId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="effectiveTime"
        :label="$t('生效时间')"
        :label-width="isEn ? '180px' : '80px'"
        :rules="{ required: true, validator: validatorEffectiveTime }"
      >
        <el-date-picker
          style="width: 200px"
          type="datetime"
          v-model="formState.effectiveTime"
          :disabled="isEdit"
          :placeholder="$t('请选择')"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-form-item
        prop="expireTime"
        :label="$t('失效时间')"
        :label-width="isEn ? '110px' : '80px'"
        :rules="{ required: true, validator: validatorExpireTime }"
      >
        <el-date-picker
          style="width: 200px"
          type="datetime"
          v-model="formState.expireTime"
          :placeholder="$t('请选择')"
          :default-time="defaultTime"
        />
      </el-form-item>
      <br />
      <div class="flex-wrapper flex-space-between">
        <div>
          <el-form-item
            class="mr30"
            :label="`${$t('学科')}:`"
            :label-width="isEn ? '110px' : '80px'"
          >
            {{
              $t(SUBJECT_TYPE_CODE_NAME[coursePackageInfo.subjectType]) || "--"
            }}
          </el-form-item>
          <el-form-item :label="`${$t('课包类型')}:`" class="mr30">
            {{
              $t(COURSE_PACKAGE_TYPE_CODE_NAME[coursePackageInfo.typeCode]) ||
              "--"
            }}
          </el-form-item>
          <el-form-item :label="`${$t('上课形态')}:`" class="mr30">
            {{ $t(CLASS_TYPE_CODE_NAME[coursePackageInfo.classType]) || "--" }}
          </el-form-item>
          <el-form-item :label="`${$t('课程树数量')}:`">
            {{ formState.coursePackageTreeList.length || "--" }}
          </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
          <el-button
            type="primary"
            class="mr20"
            @click="handleSubmit"
            :loading="submitLoading"
            :disabled="!formState.coursePackageTreeList.length"
          >
            {{ $t("保存") }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <CourseTreeConfig
      v-if="coursePackageInfo.subjectType === SUBJECT_TYPE.CHINESE"
      v-loading="courseTreeConfigLoading"
      ref="courseTreeConfigForm"
      :ruleDetailsList="ruleDetailsList"
      :courseTreeList="formState.coursePackageTreeList"
      :packageType="coursePackageInfo.typeCode"
      :isEdit="isEdit"
    />
    <CourseTreeEnMathConfig
      v-if="coursePackageInfo.subjectType !== SUBJECT_TYPE.CHINESE"
      v-loading="courseTreeConfigLoading"
      ref="courseTreeEnMathConfigForm"
      :ruleDetailsList="ruleDetailsList"
      :courseTreeList="formState.coursePackageTreeList"
      :packageType="coursePackageInfo.typeCode"
      :classType="coursePackageInfo.classType"
      :isEdit="isEdit"
    />
  </div>
</template>

<script>
import { SUBJECT_TYPE } from "@/utils/constants";
import moment from "moment";
import { cloneDeep, isObject } from "lodash-es";
import {
  computed,
  onMounted,
  reactive,
  ref,
  nextTick,
} from "@vue/composition-api";
import {
  SUBJECT_TYPE_CODE_NAME,
  CLASS_TYPE_CODE_NAME,
  COURSE_PACKAGE_TYPE_CODE_NAME,
} from "@/utils/constants";

import CourseTreeConfig from "./components/CourseTreeConfig";
import CourseTreeEnMathConfig from "./components/CourseTreeEnMathConfig";

const { id: createUserId } = JSON.parse(localStorage.userInfo);

export default {
  components: {
    CourseTreeConfig,
    CourseTreeEnMathConfig
  },
  setup(props, { root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const isEdit = !!root.$route.query.ruleId;

    const courseTreeConfigLoading = ref(false);

    const submitLoading = ref(false);

    const ruleDetailsList = ref([]);

    const coursePackageInfo = reactive({
      typeCode: void 0,
      subjectType: void 0,
      classType: void 0,
    });

    const formState = reactive({
      ruleName: void 0,
      packageId: void 0,
      effectiveTime: null,
      expireTime: null,
      coursePackageList: [],
      coursePackageTreeList: [],
    });

    const validatorEffectiveTime = (rule, value, callback) => {
      if (isEdit) return callback();
      if (value === null) {
        callback(new Error(root.$t("请选择")));
      } else if (new Date(value).getTime() < Date.now()) {
        callback(new Error(root.$t("生效时间不能小于当前时间")));
      } else {
        callback();
      }
    };

    const validatorExpireTime = (rule, value, callback) => {
      if (value === null) {
        callback(new Error(root.$t("请选择")));
      } else if (new Date(value).getTime() < Date.now()) {
        callback(new Error(root.$t("失效时间不能小于当前时间")));
      } else if (
        new Date(value).getTime() < new Date(formState.effectiveTime).getTime()
      ) {
        callback(new Error(root.$t("失效时间不能小于生效时间")));
      } else {
        callback();
      }
    };

    const handleCoursePackageChange = async () => {
      courseTreeConfigLoading.value = true;
      await queryPackageTreeList().finally(
        () => (courseTreeConfigLoading.value = false)
      );
    };

    const queryPackageTreeList = async () => {
      formState.coursePackageTreeList = [];
      Object.assign(
        coursePackageInfo,
        formState.coursePackageList.find(
          (item) => item.packageId === formState.packageId
        )
      );
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryPackageTreeList({
        packageId: formState.packageId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.coursePackageTreeList = data;
      return data;
    };

    const queryCoursePackageList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement.queryClassPackageList({
        subjectType: +root.$route.query.subjectType,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      formState.coursePackageList = data.map((v) => {
        let nameZh, nameEn;
        v.coursePackageNameList?.forEach(({ languageCode, name }) => {
          if (languageCode === "CN") nameZh = name;
          if (languageCode === "EN") nameEn = name;
        });
        return { ...v, nameZh, nameEn };
      });
    };

    const getSalaryRuleDetail = async () => {
      const { ruleId } = root.$route.query;
      const result = await root.$Api.tutorManagement.getSalaryRuleDetail({
        ruleId,
      });
      return result;
    };

    const handleSubmitAdd = async () => {

      let courseTreeConfigForm = refs.courseTreeConfigForm;
      if (coursePackageInfo.subjectType !== SUBJECT_TYPE.CHINESE) {
        courseTreeConfigForm = refs.courseTreeEnMathConfigForm;
      }

      await Promise.all([
        refs.form.validate(),
        courseTreeConfigForm.handleValidate(),
      ]);

      await root.$confirm(
        root.$t(
          "新增规则一旦生效，则不能删除，只能对规则名称和失效时间进行编辑，确定保存嘛"
        ),
        root.$t("提示"),
        {
          type: "warning",
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确定"),
        }
      );

      const { coursePackageList, coursePackageTreeList, ...formParams } =
        formState;

    
      const configList = cloneDeep(courseTreeConfigForm.configList);

      const params = {
        ...formParams,
        createUserId,
        subjectType: coursePackageInfo.subjectType,
        packageType: coursePackageInfo.typeCode,
        ruleDetails: configList.map((ruleItem) => {
          const {
            packageTreeId,
            salaryUnit,
            subsidyReward,
            transferAward,
            fullAttendReward,
            normalRule,
            trialRule,
            rewardDetails,
            reduceSalaryUnit,
            subject: subjectType,
            courseRootId: courseTreeId,
          } = ruleItem;
          const absentSalary = rewardDetails.shift();
          return {
            createUserId,
            subjectType,
            packageTreeId,
            courseTreeId,
            salaryUnit,
            transferAward,
            fullAttendReward,
            normalRule: JSON.stringify(normalRule),
            trialRule: JSON.stringify(trialRule),
            subsidyReward: subsidyReward && JSON.stringify(subsidyReward),
            absentSalary: JSON.stringify({ ...absentSalary, reduceSalaryUnit }),
            rewardDetails: rewardDetails.map((rewardItem) => ({
              ...rewardItem,
              createUserId,
              reduceSalaryUnit,
              earlyDuration: JSON.stringify(rewardItem.earlyDuration),
              classDuration: JSON.stringify(rewardItem.classDuration),
              belatedDuration: JSON.stringify(rewardItem.belatedDuration),
            })),
          };
        }),
      };
      await root.$Api.tutorManagement.insertSalaryRule(params);
      root.$message.success(root.$t("添加成功"));
    };

    const handleSubmitUpdate = async () => {
      await refs.form.validate();
      const { ruleName, expireTime } = formState;
      await root.$Api.tutorManagement.upateSalaryRule({
        ruleId: root.$route.query.ruleId,
        updateId: createUserId,
        ruleName,
        expireTime,
      });
      root.$message.success(root.$t("修改成功"));
    };

    const handleSubmit = async () => {
      try {
        submitLoading.value = true;
        const { ruleId } = root.$route.query;
        ruleId ? await handleSubmitUpdate() : await handleSubmitAdd();
        root.$router.push({ name: "classPayRules" });
      } finally {
        submitLoading.value = false;
      }
    };

    const handleCancel = async () => {
      await root.$confirm(root.$t("确定要取消吗"), root.$t("提示"), {
        type: "warning",
        cancelButtonText: root.$t("取消"),
        confirmButtonText: root.$t("确定"),
      });
      root.$router.push({ name: "classPayRules" });
    };

    onMounted(async () => {
      await queryCoursePackageList();
      const { ruleId, packageId, effectiveTime, expireTime, ruleName } =
        root.$route.query;

      if (!ruleId) return;

      Object.assign(formState, {
        ruleName,
        packageId: +packageId,
        effectiveTime: effectiveTime,
        expireTime: expireTime,
      });
      nextTick(() => refs.form.clearValidate());

      courseTreeConfigLoading.value = true;
      const [ruleDetailData, packageTreeData] = await Promise.all([
        getSalaryRuleDetail(),
        queryPackageTreeList(),
      ]).finally(() => (courseTreeConfigLoading.value = false));
      const coursePackageTreeMap = packageTreeData.reduce(
        (pre, next) => ((pre[next.packageTreeId] = next), pre),
        {}
      );
      ruleDetailsList.value = ruleDetailData.map((ruleItem) => {
        const item = coursePackageTreeMap[ruleItem.packageTreeId];
        return {
          ...ruleItem,
          ...item,
          duration: item?.duration ?? 0,
          lessonIdList: item?.lessonIdList ?? []
        }
      });
    });

    return {
      SUBJECT_TYPE_CODE_NAME,
      CLASS_TYPE_CODE_NAME,
      COURSE_PACKAGE_TYPE_CODE_NAME,
      SUBJECT_TYPE,
      isEn,
      isEdit,
      coursePackageInfo,
      formState,
      courseTreeConfigLoading,
      ruleDetailsList,
      defaultTime: moment().format("HH:mm:ss"),

      validatorEffectiveTime,
      validatorExpireTime,
      handleCoursePackageChange,
      handleSubmit,
      handleCancel,
    };
  },
};
</script>

<style lang="scss" scoped>
.class-payRule-modification {
  padding: 24px;
}
</style>
