<template>
  <div class="teacher-archives-wrapper" v-loading="loading">
    <TeacherInfo
      v-if="businessLine === 1 || businessLine === 3"
      ref="teacherInfo"
      :tutorInfo="tutorInfo"
      :childIsUpdate="childIsUpdate"
      :tutorStyleLabelListData="tutorStyleLabelListData"
      :languageLabelListData="languageLabelListData"
      :conversionLabelList="conversionLabelList"
      :typeConfigForTeacherList="typeConfigForTeacherList"
      @updateTeacherInfo="updateTeacherInfoOld"
      @resetTeacherInfo="getTeacherInfo"
    />

    <TeacherInfoEn
      v-if="businessLine === 2"
      ref="teacherInfo"
      :tutorInfo="tutorInfo"
      :childIsUpdate="childIsUpdate"
      :tutorStyleLabelListData="tutorStyleLabelListData"
      :teachingAgeGroup="teachingAgeGroup"
      :languageLabelListData="languageLabelListData"
      :conversionLabelList="conversionLabelList"
      :countryListOptions="countryListOptions"
      :teachingExperienceZh="teachingExperienceZh"
      :teacherExamineStatus="teacherExamineStatus"
      :typeConfigForTeacherList="typeConfigForTeacherList"
      @updateTeacherInfo="updateTeacherInfoOld"
      @resetTeacherInfo="getTeacherInfo"
    />
    <el-collapse v-model="activeNames">
      <el-collapse-item name="0">
        <div slot="title" class="title">
          <span class="left">{{ $t("个人简介") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <PersonalProfile
          ref="personalProfile"
          :tutorInfo="tutorInfo"
          :childIsUpdate="childIsUpdate"
          @updatePersonalProfile="updateTeacherInfoOld"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item name="1">
        <div slot="title" class="title">
          <span class="left">{{ $t("teacherInfo-基础信息") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <BasicInfo
          :tutorInfo="tutorInfo"
          :childIsUpdate="childIsUpdate"
          :timeZoneOptions="timeZoneOptions"
          :countryListOptions="countryListOptions"
          :businessLine="businessLine"
          @updateBasicsInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item
        name="2"
        v-if="
          Per.handleButtonPer('teach.tutorMT.teacherFile.educationBackground')
        "
      >
        <div slot="title" class="title">
          <span class="left">{{ $t("教育背景") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <ChineseEducationBackground
          v-if="businessLine === BUSINESS_LINE.zh"
          :childIsUpdate="childIsUpdate"
          :zhTeacherDegreeOptions="zhTeacherDegreeOptions"
          :educationExperienceZh="educationExperienceZh"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
        <EnglishEducationBackground
          v-else
          :enTeacherDegreeOptions="enTeacherDegreeOptions"
          :childIsUpdate="childIsUpdate"
          :educationExperienceEn="educationExperienceEn"
          :teacherExamineStatus="teacherExamineStatus"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item name="3" v-if="businessLine === BUSINESS_LINE.zh">
        <div slot="title" class="title">
          <span class="left">{{ $t("teacherInfo-教学经历") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <ChineseTeachingExperience
          :childIsUpdate="childIsUpdate"
          :teachingExperienceZh="teachingExperienceZh"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item
        name="4"
        v-if="Per.handleButtonPer('teach.tutorMT.teacherFile.certificate')"
      >
        <div slot="title" class="title">
          <span class="left">{{ $t("资格证书") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <ChineseQualification
          v-if="businessLine === BUSINESS_LINE.zh"
          :mandarinLevelOptions="mandarinLevelOptions"
          :oralEnglishLevelOptions="oralEnglishLevelOptions"
          :minorLanguagesOptions="minorLanguagesOptions"
          :childIsUpdate="childIsUpdate"
          :qualificationZh="qualificationZh"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
        <EnglishQualification
          v-else
          :enTeacherAptitudeOptions="enTeacherAptitudeOptions"
          :childIsUpdate="childIsUpdate"
          :qualificationEn="qualificationEn"
          :teacherExamineStatus="teacherExamineStatus"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item
        name="5"
        v-if="Per.handleButtonPer('teach.tutorMT.teacherFile.bankAccount')"
      >
        <div slot="title" class="title">
          <span class="left">{{ $t("银行账户") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <ChineseBankAccount
          v-if="businessLine === BUSINESS_LINE.zh"
          :childIsUpdate="childIsUpdate"
          :bankAccountZh="bankAccountZh"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
        <EnglishBankAccount
          v-else
          :childIsUpdate="childIsUpdate"
          :bankAccountEn="bankAccountEn"
          :countryListOptions="countryListOptions"
          @updateInfo="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item name="6" v-if="businessLine === BUSINESS_LINE.zh">
        <div slot="title" class="title">
          <span class="left">{{ $t("teacherInfo-其他补充") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <ChineseOtherReplenish
          :otherSupplement="otherSupplement"
          :childIsUpdate="childIsUpdate"
          @updateOther="updateTeacherInfoNew"
          @resetTeacherInfo="getTeacherInfo"
        />
      </el-collapse-item>
      <el-collapse-item name="7">
        <div slot="title" class="title">
          <span class="left">{{ $t("Payonner账户信息") }}</span>
          <span class="right">{{ $t("收起") }}</span>
        </div>
        <div>
          <el-form
            :label-width="'250px'"
          >
            <el-form-item prop="" :label="$t('Payoneer绑定状态')">{{$t(payoneerRegisterStatus)}}</el-form-item>
            <el-form-item prop="" :label="$t('Payoneer审核状态')">{{ $t(payoneerStatus) }}</el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="video-replay">
      <div class="replay-title">
        {{ $t("电子教室录播回放") }} ({{
          $t("当前教师已提交") + eslSubmitCount + $t("次")
        }})
      </div>
      <template v-if="eslDemoVideoUrl">
        <a :href="videoUrl" target="_blank">{{ $t("回放链接") }}</a>
      </template>
      <template v-else>
        {{ $t("暂无") }}
      </template>
    </div>

    <div v-if="teacherExamineStatus == 1">
      <el-input
        v-model="disagreeReson"
        type="text"
        :placeholder="$t('拒绝原因')"
      ></el-input>

      <el-button @click="handleAgree">{{ $t("通过") }}</el-button>
      <el-button @click="handleDisAgree">{{ $t("不通过") }}</el-button>
      <el-button @click="handleUpdate">{{ $t("更新申请") }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  toRefs,
  reactive,
  ref,
  unref,
  watch,
  computed,
  onMounted,
  nextTick,
} from "@vue/composition-api";
import { BUSINESS_LINE } from "./teacherArchivesComponents/constants";
import TeacherInfo from "./teacherArchivesComponents/teacherInfo.vue";
import TeacherInfoEn from "./teacherArchivesComponents/teacherInfoEn.vue";
import PersonalProfile from "./teacherArchivesComponents/personalProfile.vue";
import BasicInfo from "./teacherArchivesComponents/basicInfo.vue";
import ChineseEducationBackground from "./teacherArchivesComponents/chinese/chineseEducationBackground.vue";
import ChineseTeachingExperience from "./teacherArchivesComponents/chinese/chineseTeachingExperience.vue";
import ChineseQualification from "./teacherArchivesComponents/chinese/chineseQualification.vue";
import ChineseBankAccount from "./teacherArchivesComponents/chinese/chineseBankAccount.vue";
import ChineseOtherReplenish from "./teacherArchivesComponents/chinese/chineseOtherReplenish.vue";
import EnglishEducationBackground from "./teacherArchivesComponents/english/englishEducationBackground.vue";
import EnglishQualification from "./teacherArchivesComponents/english/englishQualification.vue";
import EnglishBankAccount from "./teacherArchivesComponents/english/englishBankAccount.vue";
import { logEvent } from "@/utils/analyticsNew";
import { isPayoneerRegisteStatusList, isPayoneerStatusList } from "@/components/NewFilter/enumerate";
export default {
  components: {
    TeacherInfo, // 教师信息
    TeacherInfoEn,
    PersonalProfile, // 个人简介
    BasicInfo, // 基础信息
    ChineseEducationBackground, // 中文 - 教育背景
    ChineseTeachingExperience, // 中文 - 教学经历
    ChineseQualification, // 中文 - 资格证书
    ChineseBankAccount, // 中文 - 银行账户
    ChineseOtherReplenish, // 中文 - 其他补充
    EnglishEducationBackground, // 英文 - 教育背景
    EnglishQualification, // 英文 - 资格证书
    EnglishBankAccount, // 英文 - 银行账户
  },
  props: {
    teacherExamineStatus: { type: Number, default: () => 1 },
  },
  setup(props, { root, emit, refs }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const loading = ref(false);
    const activeNames = reactive(["0", "1", "2", "3", "4", "5", "6","7"]);
    const teacherExamineStatus = ref(1);
    const disagreeReson = ref("");

    teacherExamineStatus.value = props.teacherExamineStatus;

    // 下拉框数据
    const optionObj = reactive({
      teachingAgeGroup: [], //英文-适教年龄段
      tutorStyleLabelListData: [], // 教学风格
      languageLabelListData: [], // 语言标签
      timeZoneOptions: [], // 时区
      minorLanguagesOptions: [], // 小语种
      zhTeacherDegreeOptions: [], // 中文教师最高学历
      mandarinLevelOptions: [], // 普通话等级
      oralEnglishLevelOptions: [], // 英语口语水平
      enTeacherDegreeOptions: [], // 英文教师最高学历
      enTeacherAptitudeOptions: [], // 英文教师资质种类
      countryListOptions: [], // 居住地, 国籍, Bank Location
      conversionLabelList: [], // 转化率标签
      typeConfigForTeacherList: [], //教师类型
    });
    // 各个模块数据
    const moduleInfo = reactive({
      tutorInfo: {}, // 教师信息 & 个人简介 & 基础信息
      educationExperienceZh: {}, // 中文 - 教育背景
      educationExperienceEn: {}, // 英文 - 教育背景
      teachingExperienceZh: {}, // 中文 - 教学经历
      qualificationZh: {}, // 中文 - 资格证书
      qualificationEn: {}, // 英文 - 资格证书
      bankAccountZh: {}, // 中文 - 银行账户
      bankAccountEn: {}, // 英文 - 银行账户
      otherSupplement: {}, // 其他补充
    });
    const businessLine = ref(null); // 所属业务，1：中文直播；2：英文直播
    const childIsUpdate = ref(false);
    const constants = reactive({ BUSINESS_LINE });
    const eslSubmitCount = ref(0); // 提交次数
    const eslDemoVideoUrl = ref(null);

    const videoUrl = computed(() => {
      let url = eslDemoVideoUrl.value;
      if (url) {
        url =
          url +
          `?business=ops&token=${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`;
      }
      return url;
    });

    // 获取教师信息
    const getTeacherInfo = async () => {
      try {
        loading.value = true;
        childIsUpdate.value = false;
        const {
          status,
          data: { code, data },
        } = await root.$Api.tutorManagement.getTeachertutorInfo(
          root.$route.query.id
        );
        if (status !== 200 || code !== 200) return;
        businessLine.value = data?.businessLine;
        eslSubmitCount.value = data?.eslSubmitCount || 0;
        eslDemoVideoUrl.value = data?.eslDemoVideoUrl || "";

        Object.assign(moduleInfo, data);
        optionObj.typeConfigForTeacherList = data.tutorTypeOptionList;
        moduleInfo.tutorInfo = Object.assign(moduleInfo.tutorInfo, {
          teachStyleList: data?.teachStyleList ?? [],
          languageList: data?.languageList ?? [],
          conversionRateList: data?.conversionRateList ?? [],
          preferredTeachingAgeGroupList:
            data?.preferredTeachingAgeGroupList ?? [],
        });
        nextTick(() => updateChildComps());
      } finally {
        loading.value = false;
      }
    };
    // 更新教师信息 - 老接口
    const updateTeacherInfoOld = async ({ moduleName, moduleData }) => {
      try {
        console.log("更新教师信息======", moduleData);
        const {
          status,
          data: { code },
        } = await root.$Api.tutorManagement.updateTeacherInfo(
          root.$route.query.id,
          { ...moduleData, tutorUserId: root.$route.query.id }
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        root.$notify.success("更新成功");
        if (moduleName === "personalProfile")
          refs.personalProfile.syncS3Resources();
        getTeacherInfo();
      } catch {
        if (moduleName === "personalProfile")
          refs.personalProfile.handleEditEvent();
        root.$notify.error("error");
      } finally {
      }
    };
    // 更新教师信息 - 新接口
    const updateTeacherInfoNew = async ({ moduleName, moduleData }) => {
      try {
        let params = { tutorUserId: root.$route.query.id };
        params[moduleName] = moduleData;
        const {
          status,
          data: { code, data },
        } = await root.$Api.tutorManagement.updateTeachertutorInfo(params);
        if (status !== 200 || code !== 200) return root.$notify.error(data);
        root.$notify.success("更新成功");
        // if (moduleName === 'tutorInfo') retrun refs.personalProfile.syncS3Resources();
        getTeacherInfo();
      } catch {
        root.$notify.error("error");
      } finally {
      }
    };
    // 获取下拉数据
    const getConstantData = async () => {
      await Promise.all([
        root.$Api.tutorManagement.reqLableOptionsConfig({
          labelType: 1,
          subjectType: businessLine.value - 1,
        }),
        root.$Api.tutorManagement.getExamineDic(5), // 语言标签
        root.$Api.tutorManagement.getTeacherInfoOption(75), // 时区
        root.$Api.tutorManagement.getExamineDic(5), // 小语种枚举列表
        root.$Api.tutorManagement.getTeacherInfoOption(81), // 中文教师最高学历枚举
        root.$Api.tutorManagement.getTeacherInfoOption(82), // 普通话等级证书枚举
        root.$Api.tutorManagement.getTeacherInfoOption(83), // 英语口语水平枚举
        root.$Api.tutorManagement.getTeacherInfoOption(84), // 英文教师最高学历
        root.$Api.tutorManagement.getTeacherInfoOption(85), // 英文教师资质种类枚举
        root.$Api.tutorManagement.getCountryList({
          "X-LNG": currentLang.value,
        }), // 居住地, 国籍, Bank Location
        // root.$Api.tutorManagement.getExamineDic(9), // 转化率标签列表
        root.$Api.tutorManagement.reqLableOptionsConfig({
          labelType: 3,
          subjectType: businessLine.value - 1,
        }),
        root.$Api.tutorManagement.getExamineDic(113), // 适教年龄段
      ])
        .then((res) => {
          optionObj.tutorStyleLabelListData = setItem(res[0]);
          optionObj.languageLabelListData = setItem(res[1].data.data);
          optionObj.timeZoneOptions = res[2];
          optionObj.minorLanguagesOptions = res[3].data.data;
          optionObj.zhTeacherDegreeOptions = res[4];
          optionObj.mandarinLevelOptions = res[5];
          optionObj.oralEnglishLevelOptions = res[6];
          optionObj.enTeacherDegreeOptions = res[7];
          optionObj.enTeacherAptitudeOptions = res[8];
          optionObj.countryListOptions = res[9];
          optionObj.conversionLabelList = setItem(res[10]);
          optionObj.teachingAgeGroup = setItem(res[11].data.data);
        })
        .catch((err) => {
          console.log(err);
          root.$notify({
            message: root.$t("接口报错"),
            type: "error",
          });
        });
    };
    const setItem = (data) => {
      return data.map((item) => {
        return {
          configId: item.id || item.configId,
          configType: item.type || item.configType,
          configValue: item.typeKey || item.name,
          id: 0,
        };
      });
    };

    // Payoneer状态映射计算属性
    const payoneerRegisterStatus = computed(() => {
      const status = moduleInfo.tutorInfo.isPayoneerRegister;
      const statusItem = isPayoneerRegisteStatusList.find(item => item.value === status?.toString());
      return statusItem ? statusItem.label : status;
    });

    const payoneerStatus = computed(() => {
      const status = moduleInfo.tutorInfo.isPayoneer;
      const statusItem = isPayoneerStatusList.find(item => item.value === status?.toString());
      return statusItem ? statusItem.label : status;
    });

    const handleDisAgree = async () => {
      if (!disagreeReson.value) {
        root.$notify({
          message: root.$t("请填写原因"),
          type: "error",
        });
        return;
      }
      await root.$Api.tutorManagement.handleAgree({
        userTutorId: root.$route.query.id,
        auditStatus: 2,
        auditReason: disagreeReson.value,
      });
      logEvent("ops_teacher_click_review", "教师招聘_ops审核按钮_点击", {
        auditStatus: 2,
        auditReason: disagreeReson.value,
      });
      emit("updateExamineStatus");
    };

    const handleUpdate = async () => {
      if (!disagreeReson.value) {
        root.$notify({
          message: root.$t("请填写原因"),
          type: "error",
        });
        return;
      }
      await root.$Api.tutorManagement.handleAgree({
        userTutorId: root.$route.query.id,
        auditStatus: 6,
        auditReason: disagreeReson.value,
      });

      logEvent("ops_teacher_click_review", "教师招聘_ops审核按钮_点击", {
        auditStatus: 6,
        auditReason: disagreeReson.value,
      });
      emit("updateExamineStatus");
    };

    const handleAgree = async () => {
      await root.$Api.tutorManagement.handleAgree({
        userTutorId: root.$route.query.id,
        auditStatus: 3,
        auditReason: "",
      });
      logEvent("ops_teacher_click_review", "教师招聘_ops审核按钮_点击", {
        auditStatus: 3,
        auditReason: null,
      });
      emit("updateExamineStatus");
    };
    /**
     * 更新子组件
     * 方法一: 给子组件设置refs，通过dom调用组件内部方法，更新数据
     * 方法二: 设置一个状态，通知子组件数据更新
     */
    const updateChildComps = () => {
      childIsUpdate.value = true;
      // refs.teacherInfo.updateComp();
    };
    onMounted(async () => {
      await getTeacherInfo();
      await getConstantData();
    });
    return {
      loading,
      activeNames,
      businessLine,
      eslSubmitCount,
      eslDemoVideoUrl,
      childIsUpdate,
      ...toRefs(optionObj),
      ...toRefs(moduleInfo),
      ...toRefs(constants),
      updateTeacherInfoNew,
      updateTeacherInfoOld,
      getTeacherInfo,
      disagreeReson,
      handleUpdate,
      handleDisAgree,
      handleAgree,
      videoUrl,
      payoneerRegisterStatus,
      payoneerStatus,
    };
  },
};
</script>
<style lang="scss" scoped>
.teacher-archives-wrapper {
  .title {
    width: 100%;
    .left {
      float: left;
      font-size: 18px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      padding-left: 10px;
    }
    .right {
      float: right;
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      padding-right: 5px;
    }
  }

  .video-replay {
    margin: 20px 0;
    padding: 0 10px;

    .replay-title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      margin-bottom: 10px;
    }

    a {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
