<template>
  <div>
    <div class="btn-box">
      <el-button
        v-show="
          isDisabled &&
          Per.handleButtonPer('teach.tutorMT.teacherFile.allEditBtn')
        "
        @click="handleEditEvent"
      >
        {{ $t("编辑") }}
      </el-button>
      <el-button v-show="!isDisabled" type="primary" @click="handleSave">
        {{ $t("preservation") }}
      </el-button>
      <el-button v-show="!isDisabled" @click="handleCancel">
        {{ $t("取消") }}
      </el-button>
    </div>
    <el-form
      ref="basicsInfoForm"
      :rules="basicsInfoRules"
      :model="basicsInfoForm"
      :label-width="currentLang === 'en' ? '180px' : '100px'"
    >
      <el-form-item prop="isFromSupplier" :label="$t('渠道来源') + ':'">
        <el-radio-group v-model="basicsInfoForm.isFromSupplier">
          <el-radio disabled :label="false">{{ $t("自主招聘") }}</el-radio>
          <el-radio disabled :label="true">{{ $t("供应商合作") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="identityName" :label="$t('姓名') + ':'">
        <el-input
          v-model="basicsInfoForm.identityName"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('请填写您的姓名')"
        />
      </el-form-item>
      <el-form-item prop="gender" :label="$t('my-home-Gender') + ':'">
        <el-radio-group v-model="basicsInfoForm.gender">
          <el-radio :disabled="isDisabled" :label="1">{{ $t("男") }}</el-radio>
          <el-radio :disabled="isDisabled" :label="2">{{ $t("女") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="birthday"
        :label="$t('student-management-Date of Birth') + ':'"
      >
        <el-date-picker
          v-model="basicsInfoForm.birthday"
          :placeholder="$t('select-Date of Birth')"
          :disabled="isDisabled"
          type="date"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        prop="phone"
        :label="$t('手机号码') + ':'"
        v-if="Per.handleButtonPer('teach.tutorMT.teacherFile.basicsInfoPhone')"
      >
        <el-input
          v-model="basicsInfoForm.phone"
          :disabled="isDisabled"
          type="text"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '' : '手机号码')
          "
        />
      </el-form-item>
      <el-form-item
        prop="email"
        :label="$t('email') + ':'"
        v-if="Per.handleButtonPer('teach.tutorMT.teacherFile.basicsInfoEmail')"
      >
        <el-input
          v-model="basicsInfoForm.email"
          :disabled="isDisabled"
          type="text"
          :placeholder="
            $t('glb-input') + (currentLang == 'en' ? '' : '常用邮箱')
          "
        />
      </el-form-item>
      <el-form-item
        prop="skype"
        label="Skype:"
        v-if="businessLine === BUSINESS_LINE.en"
      >
        <el-input
          v-model="basicsInfoForm.skype"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input') + 'Skype'"
        />
      </el-form-item>
      <el-form-item prop="" :label="$t('basicInfo-居住地') + ':'">
        <el-select
          v-model="level1"
          filterable
          clearable
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
          @change="changeLevel1"
        >
          <el-option
            v-for="item in countryListOptions"
            :key="item.areaId"
            :label="currentLang == 'en' ? item.nameEn : item.nameZh"
            :value="item.areaId"
          />
        </el-select>
        <el-select
          v-if="level1 && level2Options.length"
          v-model="level2"
          filterable
          clearable
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
          @change="changeLevel2"
        >
          <el-option
            v-for="item in level2Options"
            :key="item.areaId"
            :label="currentLang == 'en' ? item.nameEn : item.nameZh"
            :value="item.areaId"
          />
        </el-select>
        <el-select
          v-if="level2 && level3Options.length"
          v-model="level3"
          filterable
          clearable
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
          @change="changeLevel3"
        >
          <el-option
            v-for="item in level3Options"
            :key="item.areaId"
            :label="currentLang == 'en' ? item.nameEn : item.nameZh"
            :value="item.areaId"
          />
        </el-select>
        <el-select
          v-if="level3 && level4Options.length"
          v-model="level4"
          filterable
          clearable
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
          @change="changeLevel4"
        >
          <el-option
            v-for="item in level4Options"
            :key="item.areaId"
            :label="currentLang == 'en' ? item.nameEn : item.nameZh"
            :value="item.areaId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="detailedAddress"
        :label="$t('详细地址') + ':'"
        v-if="businessLine === BUSINESS_LINE.zh"
      >
        <el-input
          v-model="basicsInfoForm.detailedAddress"
          :disabled="isDisabled"
          type="text"
          :placeholder="$t('glb-input') + $t('详细地址')"
        />
      </el-form-item>
      <el-form-item prop="nationality" :label="$t('国籍') + ':'">
        <el-select
          v-model="nationality"
          filterable
          clearable
          :disabled="isDisabled"
          :placeholder="$t('请选择')"
          @change="getNationalityName"
        >
          <el-option
            v-for="item in countryListOptions"
            :key="item.areaId"
            :label="currentLang == 'en' ? item.nameEn : item.nameZh"
            :value="item.areaId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="timeZone" :label="$t('时区') + ':'">
        <el-select
          v-model="basicsInfoForm.timeZone"
          clearable
          :placeholder="$t('请选择')"
          :disabled="isDisabled"
        >
          <el-option
            v-for="item in timeZoneOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
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
} from "@vue/composition-api";
import { BUSINESS_LINE } from "./constants";

export default {
  props: {
    tutorInfo: { type: Array, default: () => ({}) },
    childIsUpdate: { type: Boolean, default: false },
    timeZoneOptions: { type: Array, default: () => [] },
    countryListOptions: { type: Array, default: () => [] },
    businessLine: { type: Boolean, default: false },
  },
  setup(props, { root, emit, refs }) {
    const constants = reactive({ BUSINESS_LINE });
    const isDisabled = ref(true);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const basicsInfoForm = reactive({
      isFromSupplier: false,
      identityName: "", // 姓名
      gender: 0, // 性别
      birthday: "", // 出生日期
      phone: "", // 手机号
      email: "", // 邮箱
      skype: "", // skype
      currentAddress: "", // 居住地 eg：中国-北京-海淀
      detailedAddress: "", // 详细地址
      nationality: "", // 国籍
      timeZone: "", // 时区
    });
    const nationality = ref("");
    const habitation = reactive({
      level1: "",
      level1Name: "",
      level2: "",
      level2Name: "",
      level2Options: [],
      level3: "",
      level3Name: "",
      level3Options: [],
      level4: "",
      level4Name: "",
      level4Options: [],
    });
    const basicsInfoRules = computed(() => ({
      phone: [{ validator: validatePhone, trigger: "blur" }],
      email: [{ validator: validateEmail, trigger: "blur" }],
    }));
    const validatePhone = (rule, value, callback) => {
      if (!value || /^[0-9\-\+]{4,20}$/.test(value)) {
        callback();
      } else {
        callback(new Error(root.$t(`格式错误`)));
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (
        !value ||
        /^([a-zA-Z0-9\._-])+@([a-zA-Z0-9])+(\.[a-zA-Z]+)+/.test(value)
      ) {
        callback();
      } else {
        callback(new Error(root.$t(`格式错误`)));
      }
    };

    watch(
      () => props.childIsUpdate,
      (val) => {
        // console.log('更新基础信息: ', val);
        if (val) {
          updateComp();
        }
      }
    );

    const updateComp = () => {
      const newOBJ = {
        identityName: props.tutorInfo.identityName,
        gender: props.tutorInfo.gender,
        birthday: props.tutorInfo.birthday,
        phone: props.tutorInfo.phone,
        email: props.tutorInfo.email,
        skype: props.tutorInfo.skype,
        currentAddress: props.tutorInfo.currentAddress,
        detailedAddress: props.tutorInfo.detailedAddress,
        nationality: props.tutorInfo.nationality,
        timeZone: props.tutorInfo.timeZone,
        isFromSupplier: props.tutorInfo.source === 5,
      };
      // 获取下拉框数据，回显
      setTimeout(() => {
        getCountryList(props.tutorInfo?.currentAddress?.split("-"));
      }, 1000);
      setTimeout(() => {
        getNationalityID(props.tutorInfo.nationality);
      }, 1000);

      Object.assign(basicsInfoForm, newOBJ);
      // handleCancel(); 不能使用这个，他会一直循环请求教师信息
      isDisabled.value = true;
    };

    // 保存
    const handleSave = () => {
      refs.basicsInfoForm.validate((valid) => {
        if (valid) {
          let currentAddressList = [];
          Object.keys(habitation).forEach((item) => {
            if (item.includes("Name")) {
              habitation[item] ? currentAddressList.push(habitation[item]) : "";
            }
          });
          let currentAddressStr = currentAddressList.join("-") || null; // 后端不用空字符串要null
          let moduleData = {
            ...basicsInfoForm,
            currentAddress: currentAddressStr,
          };
          delete moduleData.source;
          emit("updateBasicsInfo", {
            moduleName: "tutorInfo",
            moduleData: moduleData,
          });
        }
      });
    };
    // 点击编辑按钮
    const handleEditEvent = () => {
      isDisabled.value = false;
    };
    // 取消
    const handleCancel = async () => {
      isDisabled.value = true;
      emit("resetTeacherInfo");
    };

    // 获取国籍 - id  注：以后不要给后端传字符串了，坑太多
    const getNationalityID = (val) => {
      props.countryListOptions.forEach((item) => {
        if (item.nameZh === val || item.nameEn === val) {
          nationality.value = item.areaId;
        }
      });
    };

    // 获取国籍 - 名称
    const getNationalityName = (val) => {
      props.countryListOptions.forEach((item) => {
        if (item.areaId === val) {
          basicsInfoForm.nationality =
            currentLang.value == "en" ? item.nameEn : item.nameZh;
        }
      });
    };

    // 获取居住地对应id
    const getCountryList = async (val = []) => {
      if (!val.length) return;
      props.countryListOptions.forEach((item) => {
        if (item.nameZh === val[0] || item.nameEn === val[0]) {
          habitation.level1 = item.areaId;
        }
      });
      await changeLevel1(habitation.level1);
      habitation.level2Options.forEach((item) => {
        if (item.nameZh === val[1] || item.nameEn === val[1]) {
          habitation.level2 = item.areaId;
        }
      });
      await changeLevel2(habitation.level2);
      habitation.level3Options.forEach((item) => {
        if (item.nameZh === val[2] || item.nameEn === val[2]) {
          habitation.level3 = item.areaId;
        }
      });
      await changeLevel3(habitation.level3);
      habitation.level4Options.forEach((item) => {
        if (item.nameZh === val[3] || item.nameEn === val[3]) {
          habitation.level4 = item.areaId;
        }
      });
      await changeLevel4(habitation.level4);
    };

    // 获取居住地下拉数据，设置居住地参数
    const changeLevel1 /* 清空数据 - 设置参数 - 获取2级下拉数据 */ = async (
      val
    ) => {
      Object.assign(habitation, {
        level2: "",
        level2Options: [],
        level3: "",
        level3Options: [],
        level4: "",
        level4Options: [],
      });
      if (val !== "") {
        props.countryListOptions.forEach((item) => {
          if (item.areaId === val) {
            habitation.level1Name =
              currentLang.value === "zh" ? item.nameZh : item.nameEn;
          }
        });
        await root.$Api.tutorManagement
          .getAreaList({
            areaId: val,
            level: 1,
            type: currentLang.value === "en" ? 2 : 1,
          })
          .then((data) => {
            habitation.level2Options = data ?? [];
          });
      }
    };
    const changeLevel2 /* 清空数据 - 设置参数 - 获取3级下拉数据 */ = async (
      val
    ) => {
      Object.assign(habitation, {
        level3: "",
        level3Options: [],
        level4: "",
        level4Options: [],
      });
      if (val !== "") {
        habitation.level2Options.forEach((item) => {
          if (item.areaId === val) {
            habitation.level2Name =
              currentLang.value === "zh" ? item.nameZh : item.nameEn;
          }
        });
        await root.$Api.tutorManagement
          .getAreaList({
            areaId: val,
            level: 2,
            type: currentLang.value === "en" ? 2 : 1,
          })
          .then((data) => {
            habitation.level3Options = data ?? [];
          });
      }
    };
    const changeLevel3 /* 清空数据 - 设置参数 - 获取4级下拉数据 */ = async (
      val
    ) => {
      Object.assign(habitation, {
        level4: "",
        level4Options: [],
      });
      if (val !== "") {
        habitation.level3Options.forEach((item) => {
          if (item.areaId === val) {
            habitation.level3Name =
              currentLang.value === "zh" ? item.nameZh : item.nameEn;
          }
        });
        await root.$Api.tutorManagement
          .getAreaList({
            areaId: val,
            level: 3,
            type: currentLang.value === "en" ? 2 : 1,
          })
          .then((data) => {
            habitation.level4Options = data ?? [];
          });
      }
    };
    const changeLevel4 /* 设置参数 */ = (val) => {
      if (val !== "") {
        habitation.level4Options.forEach((item) => {
          if (item.areaId === val) {
            habitation.level4Name =
              currentLang.value === "zh" ? item.nameZh : item.nameEn;
          }
        });
      }
    };

    return {
      isDisabled,
      currentLang,
      basicsInfoForm,
      basicsInfoRules,
      nationality,
      ...toRefs(constants),
      ...toRefs(habitation),
      handleSave,
      handleEditEvent,
      getNationalityName,
      handleCancel,
      changeLevel1,
      changeLevel2,
      changeLevel3,
      changeLevel4,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-box {
  text-align: right;
  margin: 0 0 10px;
}
</style>
