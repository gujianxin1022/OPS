<template>
  <el-dialog
    width="520px"
    :title="$t(`新增${levelText}级成本`)"
    :visible="visible"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="formData" :rules="rules" ref="ruleForm">
      <el-form-item prop="costNameZh">
        <el-input
          maxlength="50"
          :placeholder="$t(`请输入${levelText}级成本名称中文`)"
          v-model="formData.costNameZh"
        />
      </el-form-item>
      <el-form-item prop="costNameEn">
        <el-input
          maxlength="50"
          :placeholder="$t(`请输入${levelText}级成本名称英文`)"
          v-model="formData.costNameEn"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="handleOk" :loading="loading">
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { LEVEL_1, LEVEL_2 } from "../index.vue";
import { ABNORMAL_CODE } from "@/utils/constants"
import { computed, reactive, ref, unref } from "@vue/composition-api";
export default {
  props: {
    level: { type: Number, default: null },
    pid: { type: Number, default: null },
    visible: { type: Boolean, default: false },
  },
  setup(props, { root, refs, emit }) {
    const levelText = computed(
      () => ({ [LEVEL_1]: "一", [LEVEL_2]: "二" }[props.level])
    );

    const loading = ref(false);
    const formData = reactive({ costNameEn: "", costNameZh: "" });
    const validateCostNameZh = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(root.$t(`请输入${unref(levelText)}级成本名称中文`)));
      } else {
        callback();
      }
    }
    const validateCostNameEn = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(root.$t(`请输入${unref(levelText)}级成本名称英文`)));
      } else {
        callback();
      }
    }
    const rules = {
      costNameZh: [{ validator: validateCostNameZh, trigger: 'blur' }],
      costNameEn: [{ validator: validateCostNameEn, trigger: 'blur' }]
    }

    const handleClose = () => {
      emit("update:visible", false);
      refs.ruleForm.resetFields();
    };
    const handleOk = async () => {
      await refs.ruleForm.validate();
      try {
        loading.value = true;
        const { costNameEn, costNameZh } = formData;
        const { id, username } = JSON.parse(localStorage.userInfo);
        const { status, data: { code } } = await root.$Api.financeManagement.addCost({
          level: props.level,
          pid: props.pid,
          createUserId: id,
          createUserName: username,
          costNameEn: costNameEn.trim(),
          costNameZh: costNameZh.trim(),
        });
        if (code === ABNORMAL_CODE.costDuplication) {
          root.$message.error(root.$t('与其他成本重复'));
          return Promise.reject();
        }
        if (status !== 200 || code !== 200) return Promise.reject();
        emit("ok");
        handleClose();
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      rules,
      levelText,
      loading,

      handleClose,
      handleOk,
    };
  },
};
</script>
