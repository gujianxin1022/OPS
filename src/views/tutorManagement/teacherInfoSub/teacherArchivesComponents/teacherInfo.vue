<template>
  <div class="archives-top mt10">
    <el-button
      v-show="
        isDisabled &&
        Per.handleButtonPer('teach.tutorMT.teacherFile.allEditBtn')
      "
      class="archives-edit-button"
      @click="handleEditEvent"
    >
      {{ $t("编辑") }}
    </el-button>
    <el-button
      v-show="!isDisabled"
      class="archives-edit-button"
      type="primary"
      @click="handleSave"
    >
      {{ $t("preservation") }}
    </el-button>
    <el-button
      v-show="!isDisabled"
      class="archives-edit-button mt50"
      @click="handleCancel"
    >
      {{ $t("取消") }}
    </el-button>
    <div class="archives-top-form">
      <el-form
        ref="teacherInfoForm"
        :rules="rules"
        :model="teacherInfo"
        :label-width="currentLang === 'en' ? '160px' : '100px'"
      >
        <el-form-item :label="$t('my-home-Teacher\'s Account') + ':'">
          <div>{{ teacherInfo.username }}</div>
        </el-form-item>
        <el-form-item :label="$t('my-home-Teacher\'s Nickname') + ':'">
          <el-input v-model="teacherInfo.realName" :disabled="isDisabled" />
          <span class="span-info"
            >{{ $t("教师昵称会展示给用户，请按要求进行填写～") }}({{
              $t("例：中国老师：")
            }}李华华：<span class="span-warn">Huahua LI</span>；{{
              $t("非中国老师：")
            }}Jessica Koh WANG：<span class="span-warn">Jessica K. W.</span
            >)</span
          >
        </el-form-item>
        <el-form-item :label="$t('my-home-Teaching Experience') + ':'">
          <el-select
            v-if="
              Per.handleButtonPer(
                'teach.tutorMT.teacherFile.tfEditTeacheringYear'
              )
            "
            v-model="teacherInfo.teachingYear"
            :placeholder="$t('请选择老师教学年限')"
            :disabled="isDisabled"
          >
            <el-option
              v-for="(item, index) in Constants.teacherTeachAgoList()"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('教师评分') + ':'">
          <el-input-number
            v-model="teacherInfo.rating"
            :disabled="isDisabled"
            :min="1"
            :max="10"
            :label="$t('教师评分')"
          />
        </el-form-item>
        <el-form-item :label="$t('教学风格') + ':'" prop="tutorStyleLabelList">
          <el-select
            v-model="teachStyleList"
            multiple
            filterable
            :disabled="isDisabled"
            :placeholder="$t('请选择教学风格') + ':'"
          >
            <el-option
              v-for="item in tutorStyleLabelListData"
              :key="item.configId"
              :label="item.configValue"
              :value="item.configId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('语言标签') + ':'" prop="languageLabelList">
          <el-select
            v-model="languageList"
            multiple
            filterable
            :disabled="isDisabled"
            :placeholder="$t('请选择语言标签')"
          >
            <el-option
              v-for="item in languageLabelListData"
              :key="item.configId"
              :label="item.configValue"
              :value="item.configId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('转化率标签')" prop="languageLabelList">
          <el-select
            clearable
            v-model="conversionRate"
            :disabled="isDisabled"
            :placeholder="$t('请选择转化率标签')"
          >
            <el-option
              v-for="item in conversionLabelList"
              :key="item.configId"
              :label="item.configValue"
              :value="item.configId"
            >
            </el-option>
           
          </el-select>
        </el-form-item>
        <!-- 全职可选兼职不可选 -->
        <el-form-item :label="$t('入职日期') + ':'">
          <el-date-picker
            v-model="teacherInfo.entryTime"
            :placeholder="$t('入职日期')"
            :disabled="isDisabled"
            type="date"
          />
        </el-form-item>
        <el-form-item prop="tutorTypeConfigId" :label="$t('教师类型-教师资料') + ':'">
          <el-radio-group
            :disabled="isDisabled"
            v-model="teacherInfo.tutorTypeConfigId"
          >
            <el-radio
              v-for="(item, index) in typeConfigForTeacherList"
              :key="index"
              :label="item.configId"
              >{{ $t(item.name) }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('是否参加新师认证') + ':'">
          <el-radio-group
            :disabled="isDisabled"
            v-model="teacherInfo.newTeacherCertification"
          >
            <el-radio :label="0">{{ $t("未完成") }}</el-radio>
            <el-radio :label="1">{{ $t("已完成") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('在岗状态') + ':'">
          <el-radio-group
            :disabled="isDisabled"
            v-model="teacherInfo.working"
            @change="changeWorking"
          >
            <el-radio
              v-for="(item, index) in Constants.workingForTeacherList"
              :key="index"
              :label="item.value"
              >{{ $t(item.label) }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('离职日期') + ':'"
          v-if="teacherInfo.working === 2"
        >
          <el-date-picker
            v-model="teacherInfo.leaveTime"
            type="date"
            :placeholder="$t('离职日期')"
          />
        </el-form-item>
        <!-- 全职可选兼职不可选 -->
        <el-form-item
          :label="$t('开放状态') + ':'"
          prop="hide"
          v-if="showOpenStatus"
        >
          <el-radio-group
            v-model="teacherInfo.hide"
            :disabled="isDisabled"
            @change="clearReason"
          >
            <el-radio
              v-for="(item, index) in Constants.openForTeacherList"
              :key="index"
              :label="item.value"
              >{{ $t(item.label) }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('变更原因') + ':'"
          prop="hideReason"
          v-if="showHideReason"
        >
          <el-select
            v-model="teacherInfo.hideReason"
            :disabled="isDisabled"
            :placeholder="$t('my-home-Select') + $t('变更原因')"
            @change="teacherInfo.hideReasonRemark = ''"
          >
            <el-option
              v-for="(item, index) in Constants.reasonList"
              :key="index"
              :label="$t(item.label)"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="hideReasonRemark"
          v-if="showHideReasonRemark && !isDisabled && showChangeReason"
        >
          <el-input
            v-model="teacherInfo.hideReasonRemark"
            :placeholder="$t('请输入')"
            :disabled="isDisabled"
            :maxlength="20"
            style="width: 196px"
          />
        </el-form-item>
        <el-form-item :label="$t('是否愿意接受代课确认通知')">
          <el-radio-group
            :disabled="isDisabled"
            v-model="teacherInfo.isSubstitute"
          >
            <el-radio :label="1">{{ $t("是") }}</el-radio>
            <el-radio :label="0">{{ $t("否") }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="archives-top-avatar" @click="uploadAvatar">
      <el-avatar
        v-loading="avatarLoading"
        :src="teacherInfo.avatar"
        :size="80"
        :key="teacherInfo.avatar"
      />
    </div>
    <input
      accept="image/jpg, image/png, image/jpeg"
      ref="uploadBtn"
      type="file"
      id="btn_file"
      style="display: none"
      @change="fileChange"
    />
  </div>
</template>

<script>
import { reactive, ref, watch, computed, unref } from "@vue/composition-api";

import moment from "moment";

const teachingYearsRawData /* 教学年限未修改前的数据 */ = {
  teachingYear: null,
  teachingStartTime: undefined,
};

export default {
  props: {
    tutorInfo: { type: Array, default: () => ({}) },
    childIsUpdate: { type: Boolean, default: false },
    tutorStyleLabelListData: { type: Array, default: () => [] },
    languageLabelListData: { type: Array, default: () => [] },
    conversionLabelList: { type: Array, default: () => [] },
    typeConfigForTeacherList:{ type: Array, default: () => [] }
  },
  setup(props, { root, emit, refs }) {
    const teacherInfo = reactive({
      username: "",
      realName: "",
      teachingYear: "",
      rating: "",
      working: "",
      leaveTime: "",
      entryTime: "",
      hide: "",
      hideReason: "",
      hideReasonRemark: "",
      avatar: "",
      isSubstitute: "",
      tutorTypeConfigId:'',
      newTeacherCertification:''
    });
    
    const isDisabled = ref(true);
    const rules = computed(() => ({
      tutorTypeConfigId: [{ required: true, message: "请选择",trigger: "blur"}],
      hide: [{ required: true, message: "请选择开放状态", trigger: "change" }],
      hideReason: [
        { required: true, message: "请选择变更原因", trigger: "change" },
      ],
      hideReasonRemark: [
        { required: true, message: "请输入原因", trigger: "blur" },
        { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
      ],
    }));
    const teachStyleList = ref([]);
    const languageList = ref([]);
    const conversionRate = ref();
    const avatarLoading = ref(false);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const showOpenStatus = computed(() => teacherInfo.working === 1);
    const showHideReason = computed(
      () =>
        teacherInfo.working === 1 &&
        teacherInfo.hide > 0 &&
        showChangeReason.value
    );
    const showHideReasonRemark = computed(
      () =>
        teacherInfo.working === 1 &&
        teacherInfo.hide > 0 &&
        teacherInfo.hideReason === 8
    );

    watch(
      () => props.childIsUpdate,
      (val) => {
        if (val) {
          updateComp();
        }
      }
    );
    // 保存
    const handleSave = () => {
      refs["teacherInfoForm"].validate((valid) => {
        if (valid) {
          setLabel();
          emit("updateTeacherInfo", {
            moduleName: "teacherInfo",
            moduleData: {
              ...teacherInfo,
              teachingStartTime:
                teachingYearsRawData.teachingYear === teacherInfo.teachingYear
                  ? teachingYearsRawData.teachingStartTime
                  : handleTeachAgo(teacherInfo.teachingYear),
            },
          });
          showChangeReason.value = false;
        }
      });
    };
    // 编辑
    const handleEditEvent = () => {
      if (
        props.typeConfigForTeacherList &&
        props.typeConfigForTeacherList.length === 1
      ) {
        teacherInfo.tutorTypeConfigId = props.typeConfigForTeacherList[0].configId;
      }
      isDisabled.value = false;
    };
    // 取消
    const handleCancel = () => {
      refs["teacherInfoForm"].clearValidate()
      emit("resetTeacherInfo");
      isDisabled.value = true;
      showChangeReason.value = false;
    };
    // 上传头像
    const uploadAvatar = () => {
      if (!isDisabled.value && !avatarLoading.value) {
        refs.uploadBtn.click();
      }
    };
    // 监听文件修改
    const fileChange = () => {
      avatarLoading.value = true;
      let fm = new FormData();
      fm.append("category", "avatar");
      fm.append("file", refs.uploadBtn.files[0]);
      root.$Api.base.uploadImage(fm).then(({ status, data }) => {
        if (status == 200 && data.code == 200) {
          teacherInfo.avatar = data.data;
        }
        avatarLoading.value = false;
      });
    };
    const setLabel = async () => {
      let toBeSavedLabelList = [];
      languageList.value.forEach((item) => {
        toBeSavedLabelList.push(
          props.languageLabelListData.find((value) => value.configId === item)
        );
      });
      teachStyleList.value.forEach((item) => {
        toBeSavedLabelList.push(
          props.tutorStyleLabelListData.find((value) => value.configId === item)
        );
      });
      if (unref(conversionRate)) {
        const conversionRateItem = props.conversionLabelList.find(
          (item) => item.configId === unref(conversionRate)
        );
        toBeSavedLabelList.push({
          ...conversionRateItem,
          id: props.tutorInfo?.conversionRateList?.[0]?.id ?? 0,
        });
      }
      const {
        status,
        data: { code, message },
      } = await root.$Api.tutorManagement.setLabel({
        tutorUserId: root.$route.query.id,
        params: toBeSavedLabelList,
      });
      if (status !== 200 || code !== 200) {
        root.$notify({ message, type: "error" });
        return Promise.reject();
      }
    };
    const changeWorking = (val) => {
      if (val !== 1) {
        teacherInfo.hide = 3;
        clearReason();
      } else {
        teacherInfo.hide = 0;
      }
    };
    const showChangeReason = ref(false);
    const clearReason = () => {
      teacherInfo.hideReason = null;
      teacherInfo.hideReasonRemark = null;
      showChangeReason.value = true;
    };
    // 计算老师教学年限
    const handleTeachAgo = (teachAgo) => {
      if (teachAgo < 1) {
        return moment().subtract(0.5, "years").toISOString();
      } else if (teachAgo == 1) {
        return root.DateTimeUtils.beforeYears(teachAgo, 2);
      } else if (teachAgo == 3) {
        return root.DateTimeUtils.beforeYears(teachAgo, 4);
      } else if (teachAgo == 5) {
        return root.DateTimeUtils.beforeYears(teachAgo, 7);
      } else if (teachAgo == 8) {
        return root.DateTimeUtils.beforeYears(teachAgo, 9);
      } else if (teachAgo == 10) {
        return root.DateTimeUtils.beforeYears(teachAgo, 11);
      }
    };
    // 计算老师教学年限
    const computedTeachingYear = (teachingYear) => {
      if (teachingYear < 1) {
        return -1;
      } else if (teachingYear >= 1 && teachingYear < 3) {
        return 1;
      } else if (teachingYear >= 3 && teachingYear < 5) {
        return 3;
      } else if (teachingYear >= 5 && teachingYear < 8) {
        return 5;
      } else if (teachingYear >= 8 && teachingYear < 10) {
        return 8;
      } else if (teachingYear >= 10) {
        return 10;
      }
    };
    const updateComp = () => {
      let teachingYear;
      if (props.tutorInfo.teachingStartTime) {
        const workingDate = new Date(props.tutorInfo.teachingStartTime);
        const diff = moment().diff(moment(workingDate), "year");
        if (diff < 1) {
          teachingYear = -1;
        } else if (diff >= 1 && diff < 3) {
          teachingYear = 2;
        } else if (diff >= 3 && diff < 5) {
          teachingYear = 4;
        } else if (diff >= 5 && diff < 8) {
          teachingYear = 7;
        } else if (diff >= 8 && diff < 10) {
          teachingYear = 9;
        } else if (diff >= 10) {
          teachingYear = 10;
        }
      }
      const newOBJ = {
        username: props.tutorInfo.username,
        realName: props.tutorInfo.realName,
        teachingYear: teachingYear && computedTeachingYear(teachingYear),
        rating: props.tutorInfo.rating,
        working: props.tutorInfo.working,
        leaveTime: props.tutorInfo.leaveTime,
        entryTime: props.tutorInfo.entryTime,
        hide: props.tutorInfo.hide,
        hideReason: props.tutorInfo.hideReason,
        hideReasonRemark: props.tutorInfo.hideReasonRemark,
        avatar: props.tutorInfo.avatar,
        isSubstitute: props.tutorInfo.isSubstitute,
        tutorTypeConfigId:props.tutorInfo.tutorTypeConfigId===0?null:props.tutorInfo.tutorTypeConfigId,
        newTeacherCertification:props.tutorInfo.newTeacherCertification
      };
      teachStyleList.value = [];
      languageList.value = [];
      props.tutorInfo?.teachStyleList?.forEach((item) => {
        teachStyleList.value.push(item.configId);
      });
      props.tutorInfo?.languageList?.forEach((item) => {
        languageList.value.push(item.configId);
      });
      conversionRate.value = props.tutorInfo?.conversionRateList?.[0]?.configId;
      Object.assign(teacherInfo, newOBJ);
      teachingYearsRawData.teachingYear = newOBJ.teachingYear;
      teachingYearsRawData.teachingStartTime =
        props.tutorInfo.teachingStartTime;
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true;
    };

    return {
      currentLang,
      teacherInfo,
      isDisabled,
      rules,
      teachStyleList,
      languageList,
      conversionRate,
      avatarLoading,
      showOpenStatus,
      showHideReason,
      showHideReasonRemark,
      handleSave,
      handleEditEvent,
      handleCancel,
      uploadAvatar,
      fileChange,
      changeWorking,
      clearReason,
      showChangeReason,
    };
  },
};
</script>

<style lang="scss" scoped>
.archives-top {
  display: flex;
  justify-content: space-between;
  position: relative;
  .archives-top-form {
    width: 780px;
  }
  .archives-top-avatar {
    margin-right: 10%;
    height: 100px;
  }
  .archives-edit-button {
    position: absolute;
    right: 0;
    top: 0;
  }
  .span-info {
    color: #a3a3a3;
    font-size: 12px;
    word-wrap: break-word;
  }
  .span-warn {
    color: #ff0000;
  }
}
</style>
