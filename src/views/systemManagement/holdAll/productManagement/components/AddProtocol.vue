<template>
  <el-dialog
    custom-class="add-protocol"
    width="880px"
    append-to-body
    :title="$t(`添加支付条款`)"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-form ref="ruleForm" label-width="220px" :model="formState">
      <el-form-item :label="$t('协议类型')">
        {{ $t("支付条款协议") }}
      </el-form-item>
      <el-form-item
        prop="titleCh"
        :label="$t('条款中文名称')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="60"
          :placeholder="$t('请输入')"
          v-model="formState.titleCh"
        />
      </el-form-item>
      <el-form-item
        prop="titleEn"
        :label="$t('条款英文名称')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="60"
          :placeholder="$t('请输入')"
          v-model="formState.titleEn"
        />
      </el-form-item>
      <el-form-item
        prop="linkCh"
        :label="$t('条款中文链接')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="125"
          :placeholder="$t('请输入')"
          v-model="formState.linkCh"
        />
      </el-form-item>
      <el-form-item
        prop="linkEn"
        :label="$t('条款英文链接')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="125"
          :placeholder="$t('请输入')"
          v-model="formState.linkEn"
        />
      </el-form-item>
      <el-form-item
        prop="version"
        :label="$t('条款版本')"
        :rules="[
          { required: true, validator: validateProductName, trigger: 'blur' },
        ]"
      >
        <el-input
          maxlength="60"
          :placeholder="$t('请输入')"
          v-model="formState.version"
        />
      </el-form-item>
      <el-form-item :label="$t('是否有效')">{{ $t("正常") }}</el-form-item>
      <el-form-item
        prop="effectiveTime"
        :label="$t('有效期')"
        :rules="[
          {
            type: 'array',
            required: true,
            message: $t('请选择'),
            trigger: 'change',
          },
        ]"
      >
        <el-date-picker
          v-model="formState.effectiveTime"
          type="datetimerange"
          :disabled="isEdit"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :picker-options="{
            disabledDate: (date) => date.getTime() < Date.now() - 86400000,
          }"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button type="primary" @click="handleOk" :loading="submitLoading">
        {{ $t("确定") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reactive, ref } from "@vue/composition-api";
import { CLASS_TYPE_LIST, STATUS_LIST, IS_SHOW_LIST } from "../../constants";

export default {
  props: {
    visible: { type: Boolean, default: false },
  },
  setup(props, { root, refs, emit }) {
    const submitLoading = ref(false);

    const formState = reactive({
      type: 3 /* 支付条款协议 */,
      titleCh: null,
      titleEn: null,
      linkCh: null,
      linkEn: null,
      version: "v1.0",
      status: 0 /* 正常 */,
      effectiveTime: [],
    });

    const validateProductName = (_, value, callback) => {
      if (!value?.trim()) {
        callback(new Error(root.$t(`请输入`)));
      } else {
        callback();
      }
    };

    const handleClose = () => {
      emit("update:visible", false);
      formState.version = "v1.0";
      refs.ruleForm.resetFields();
    };

    const handleOk = async () => {
      try {
        submitLoading.value = true;
        await refs.ruleForm.validate();
        const {
          effectiveTime: [validStartTime, validEndTime],
          ...rest
        } = formState;
        const {
          status,
          data: { code },
        } = await root.$Api.systemManagement.addProtocol({
          ...rest,
          validEndTime,
          validStartTime,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        root.$message.success(root.$t("添加成功"));
        emit("ok");
        handleClose();
      } finally {
        submitLoading.value = false;
      }
    };

    return {
      CLASS_TYPE_LIST,
      STATUS_LIST,
      IS_SHOW_LIST,

      formState,
      submitLoading,

      validateProductName,
      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .add-protocol {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0 !important;
  .el-dialog__body {
    height: 470px;
    overflow-y: auto;
  }
}
.el-select,
.el-input,
.el-input-number,
.el-textarea,
.el-date-editor {
  width: 350px;
}
::v-deep .el-radio {
  .el-radio__label {
    display: inline-block;
    width: 100px;
  }
}
</style>
