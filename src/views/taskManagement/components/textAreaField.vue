<template>
  <!-- 字段库-文本 -->
  <div class="select-field-warp" v-loading="loadFieldInfo">
    <el-row style="margin-left: 60px">
      <el-col class="tc" :span="11">{{ $t("中文") }}：</el-col>
      <el-col class="tc" :span="11">{{ $t("英文") }}：</el-col>
    </el-row>
    <el-form
      class="my-form"
      :inline="true"
      :rules="rules"
      ref="myForm"
      :model="formState"
      :label-width="isEn ? '120px' : '80px'"
    >
      <el-form-item :label="$t('字段名称')" prop="itemNameMap.zh">
        <el-input
          maxlength="80"
          show-word-limit
          class="w170"
          v-model="formState.itemNameMap.zh"
        ></el-input>
      </el-form-item>
      <el-form-item prop="itemNameMap.en">
        <el-input
          maxlength="80"
          show-word-limit
          class="w170"
          v-model="formState.itemNameMap.en"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button
      :loading="loading"
      @click="submit"
      class="submit-btn fr"
      type="primary"
      >{{ $t("确认") }}</el-button
    >
  </div>
</template>
<script>
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import { deepClone } from "@/utils/handleData";
export default {
  props: {
    itemType: {
      type: String,
      default: "",
    },
    operateFieldId: {
      type: Number,
      default: null,
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const formState = reactive({
      itemNameMap: {
        zh: "",
        en: "",
      },
      itemType: props.itemType,
    });
    const loading = ref(false);
    const rules = {
      "itemNameMap.zh": [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
      "itemNameMap.en": [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
    };

    const submit = async () => {
      await refs["myForm"].validate();
      loading.value = true;
      try {
        if (!props.operateFieldId) {
          /* 新增 */
          const res = await root.$Api.taskManagement.reqAddPublicField(
            formState
          );
          emit("refreshPage");
        } else {
          /* 编辑 */
          formState.id = props.operateFieldId;
          let params = deepClone(formState);
          const res = await root.$Api.taskManagement.updatePublicFieldInfo(
            params
          );
        }
        emit("refreshPage");
      } finally {
        loading.value = false;
      }
    };
    const loadFieldInfo = ref(false);
    const getFieldInfo = async () => {
      loadFieldInfo.value = true;
      try {
        const res = await root.$Api.taskManagement.reqPublicFieldInfo(
          props.operateFieldId
        );
        root.$set(formState, "itemNameMap", res.itemNameMap);
      } finally {
        loadFieldInfo.value = false;
      }
    };

    onMounted(() => {
      if (props.operateFieldId) {
        /* 编辑获取字段详情*/
        getFieldInfo();
      }
    });
    return {
      isEn,
      formState,
      rules,
      loading,
      loadFieldInfo,
      submit,
    };
  },
};
</script>
<style lang="scss" scoped>
.select-field-warp {
  padding: 20px;
  .w170 {
    width: 170px;
  }
  .my-form {
    margin-top: 20px;
    i {
      font-weight: 700;
      cursor: pointer;
      font-size: 16px;
      margin-left: 5px;
    }
  }
  .submit-btn {
    margin-top: 20px;
    width: 120px;
  }
}
</style>
