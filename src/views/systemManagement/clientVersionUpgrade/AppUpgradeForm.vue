<template>
  <div class="app-Uugrade-form-warp">
    <div class="title mb20">{{ $t("APP版本信息") }}</div>
    <el-form
      class="my-form"
      :style="`height:${contentHeight}px`"
      :rules="rules"
      ref="myForm"
      :model="formState"
      label-width="125px"
      :label-position="isEn ? 'top' : 'right'"
      inline-message
    >
      <el-form-item :label="$t('app类型')" prop="appType">
        <el-select v-model="formState.appType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in getAppTypeList(isEn)"
            :key="item.value"
            :label="$t(item.name)"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('平台类型')" prop="platformType">
        <el-select v-model="formState.platformType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in getPlatformTypeList(isEn)"
            :key="item.value"
            :label="$t(item.name)"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formState.appType !== null && formState.platformType !== null"
        :label="$t('历史版本')"
        prop="versionOld"
      >
        <el-select
          v-model="formState.versionOld"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in historyVersionList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('新版本号')" prop="versionNew">
        <el-input
          clearable
          maxlength="10"
          show-word-limit
          :placeholder="$t('请输入')"
          class="w200"
          v-model="formState.versionNew"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('中文描述')" prop="detailCn">
        <el-input
          clearable
          type="textarea"
          maxlength="500"
          show-word-limit
          :placeholder="$t('请输入')"
          class="w200"
          v-model="formState.detailCn"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('英文描述')" prop="detailEn">
        <el-input
          clearable
          type="textarea"
          maxlength="500"
          show-word-limit
          :placeholder="$t('请输入')"
          class="w200"
          v-model="formState.detailEn"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('法语描述')" prop="detailJson">
        <el-input
          clearable
          type="textarea"
          maxlength="500"
          show-word-limit
          :placeholder="$t('请输入')"
          class="w200"
          v-model="formState.detailJson"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('是否强制更新')" prop="forceType">
        <el-select
          v-model="formState.forceType"
          clearable
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in getForceTypeList(isEn)"
            :key="item.value"
            :label="$t(item.name)"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('app包大小')" prop="appSize">
        <el-input-number
          v-model="formState.appSize"
          :step="1"
          :max="999999"
          :min="0"
        ></el-input-number>
        <span style="color: #606266"> M</span>
      </el-form-item>
      <el-form-item :label="$t('下载地址')" prop="detailOther1">
        <a
          style="color: #7580e5"
          :href="formState.detailOther1"
          target="_blank"
          >{{ formState.detailOther1 }}</a
        >
      </el-form-item>
      <el-form-item :label="$t('版本类型')" prop="versionType">
        <el-select v-model="formState.versionType" :placeholder="$t('请选择')">
          <el-option
            v-for="item in getVersionTypeList(isEn)"
            :key="item.value"
            :label="$t(item.name)"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('更新提醒弹窗次数')" prop="popCount">
        <el-input-number
          v-model="formState.popCount"
          :step="1"
          :max="9"
          :min="0"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button @click="close" type="text">{{ $t("取消") }}</el-button>
      <el-button @click="submit" :loading="loading" type="primary">{{
        $t("保存")
      }}</el-button>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
import UploadToS3 from "@/components/Upload/uploadToS3";
import { deepClone } from "@/utils/handleData";
import {
  getAppTypeList,
  getForceTypeList,
  getPlatformTypeList,
  getVersionTypeList,
} from "./dataConfig";

export default {
  components: { UploadToS3 },
  props: {
    visible: { type: Boolean, default: false },
    rowInfo: {
      type: Object,
      default: {},
    },
    operationType: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const loading = ref(false);
    /* 表单校验 */
    const formState = ref({
      appType: null,
      platformType: null,
      forceType: "",
      appSize: 0,
      versionOld: "",
      versionNew: "",
      detailCn: "",
      detailEn: "",
      detailJson: "",
      detailOther1: "",
      versionType: "",
      popCount: 0,
    });
    const initData = () => {
      let info = deepClone(props.rowInfo);
      if (info.detailJson && info.detailJson.includes("{")) {
        try {
          info.detailJson = JSON.parse(info.detailJson).fr;
        } catch {
          info.detailJson = "";
        }
      } else {
        info.detailJson = "";
      }
      delete info.createTime;
      delete info.publicTime;
      delete info.updateTime;
      delete info.state;
      delete info.status;
      formState.value = info;
    };
    const rules = {
      appType: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      forceType: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      platformType: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      versionOld: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      versionNew: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      detailCn: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      detailEn: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      detailJson: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      detailOther1: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
      versionType: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
    };
    const close = () => {
      emit("update:visible", false);
    };
    const submit = async () => {
      await refs["myForm"].validate();
      const params = deepClone(formState.value);
      try {
        loading.value = true;
        await root.$Api.systemManagement.reqAddOrUpdateAppVersion(params);
        root.$notify.success(root.$t("操作成功"));
        emit("refresh");
        close();
      } finally {
        loading.value = false;
      }
    };

    const historyVersionList = ref([]);
    const reqAppHistoryVersionList = async () => {
      const res = await root.$Api.systemManagement.reqAppHistoryVersionList({
        appType: formState.value.appType,
        platformType: formState.value.platformType,
      });
      historyVersionList.value = res || [];
    };
    watch(
      () => formState.value.appType,
      (val) => {
        if (val !== null && formState.value.platformType !== null) {
          reqAppHistoryVersionList();
        }
      }
    );
    watch(
      () => formState.value.platformType,
      (val) => {
        if (val !== null && formState.value.appType !== null) {
          reqAppHistoryVersionList();
        }
      }
    );
    watch(
      () => [formState.value.appType, formState.value.platformType],
      (val) => {
        if (val[0] && val[1]) {
          switch (JSON.stringify(val)) {
            case "[1,1]":
              formState.value.detailOther1 =
                "https://play.google.com/store/apps/details?id=com.pplingo.chinese";
              break;
            case "[1,2]":
              formState.value.detailOther1 =
                "https://apps.apple.com/us/app/lingoace-for-student/id1155911183";
              break;
            case "[2,1]":
              formState.value.detailOther1 =
                "https://play.google.com/store/apps/details?id=com.pplingo.connect";
              break;
            case "[2,2]":
              formState.value.detailOther1 =
                "https://apps.apple.com/us/app/lingoace-connect/id1281981146";
              break;
          }
        } else {
          formState.value.detailOther1 = "";
        }
      }
    );

    onMounted(() => {
      props.operationType === "edit" && initData();
    });
    return {
      isEn,
      formState,
      rules,
      contentHeight: window.innerHeight - 90,
      loading,
      close,
      submit,
      getAppTypeList,
      getForceTypeList,
      getPlatformTypeList,
      historyVersionList,
      getVersionTypeList,
    };
  },
};
</script>

<style scoped lang="scss">
.app-Uugrade-form-warp {
  width: 500px;
  padding: 20px;
  border-radius: 8px;
  .title {
    color: #72767b;
    font-size: 18px;
  }
  .my-form {
    overflow: scroll;
    .upload-to-s3 {
      display: inline-block;
      margin-left: 5px;
    }
  }

  .footer {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
