<template>
  <el-dialog
    width="600px"
    :title="$t('添加白名单')"
    :visible="value"
    :before-close="handleCancel"
  >
    <el-form :model="formData" ref="validateForm" :label-width="labelWidth">
      <el-form-item
        :label="$t('有效期')"
        prop="effectiveTerm"
        :rules="[{ type: 'array', required: true, message: $t('请选择') }]"
      >
        <el-date-picker
          v-model="formData.effectiveTerm"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('开始日期')"
          :end-placeholder="$t('结束日期')"
          :picker-options="{
            disabledDate: (date) => date.getTime() < Date.now() - 86400000,
          }"
        />
      </el-form-item>
      <el-form-item
        :label="$t('家长id')"
        prop="parentUserId"
        :rules="[{ required: true, message: $t('请输入') }]"
      >
        <el-input
          style="width: 350px"
          v-model.trim="formData.parentUserId"
          :placeholder="$t('请输入')"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
      <el-button type="primary" @click="handleOk"> {{ $t("确定") }} </el-button>
    </span>
  </el-dialog>
</template>
<script>
import moment from "moment";

import { reactive, computed } from "@vue/composition-api";
import { ABNORMAL_CODE } from "@/utils/constants";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "AddAllowList",
  props: { value: Boolean, allowListType: Number },
  setup(props, { root, emit, refs }) {
    const labelWidth = computed(() =>
      root.$store.getters.currentLang === "zh" ? "80px" : "140px"
    );
    const formData = reactive({ effectiveTerm: [], parentUserId: "" });

    const handleCancel = () => {
      refs.validateForm.resetFields();
      emit("input", false);
    };
    const handleOk = async () => {
      await refs.validateForm.validate();
      if(!parentIdValidate(root, formData.parentUserId)){
        return;
      }
      const { parentUserId, effectiveTerm } = formData;
      const [validStartTime, validEndTime] = effectiveTerm;
      const {
        status,
        data: { code },
      } = await root.$Api.systemManagement.createAllowList({
        parentUserId,
        validStartTime,
        validEndTime: new Date(
          moment(validEndTime).set({ hours: 23, minutes: 59, seconds: 59 })
        ),
        type: props.allowListType,
      });
      if (code === ABNORMAL_CODE.validitySuperposition) {
        root.$message.success(root.$t("您选择的账号在有效期内，请核实后添加"));
      }
      if (code === ABNORMAL_CODE.accountNotExists) {
        root.$message.success(root.$t("家长账号不存在，请核实后添加"));
      }
      if (status !== 200 || code !== 200) return Promise.reject();
      root.$message.success(root.$t("添加成功"));
      emit("ok");
      handleCancel();
    };

    return {
      labelWidth,
      formData,

      handleCancel,
      handleOk,
    };
  },
};
</script>
