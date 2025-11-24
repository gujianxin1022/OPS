<template>
  <el-dialog width="1000px" :title="$t(`原因详情`)" :visible="visible" :before-close="handleClose">
    <el-form inline label-suffix=":" :label-width="$store.getters.currentLang === 'zh' ? '150px' : '200px'">
      <el-form-item :label="$t('类型')">
        <div class="value">{{ details[`typeName${langSuffix}`] }}</div>
      </el-form-item>
      <el-form-item :label="$t('使用方式')">
        <div class="value">{{ $t(CLASSIFY_MAP[details.classify]) }}</div>
      </el-form-item>
      <el-form-item :label="$t('是否展示')">
        <div class="value">{{ $t(SHOW_MAP[details.isShow]) }}</div>
      </el-form-item>
      <el-form-item :label="$t('归属部门')">
        <div class="value">{{ details[`postName${langSuffix}`] }}</div>
      </el-form-item>
      <el-form-item :label="$t('一级成本中心')">
        <div class="value">{{ details[`costFirstName${langSuffix}`] }}</div>
      </el-form-item>
      <el-form-item :label="$t('二级成本中心')">
        <div class="value">{{ details[`costSecondName${langSuffix}`] }}</div>
      </el-form-item>
      <el-form-item :label="$t('原因详情-中文')">
        <div class="value">{{ details.describeZh }}</div>
      </el-form-item>
      <el-form-item :label="$t('原因详情-English')">
        <div class="value">{{ details.describeEn }}</div>
      </el-form-item>
      <el-form-item :label="$t('C端展示-中文')">
        <div class="value">{{ details.describeClientZh }}</div>
      </el-form-item>
      <el-form-item :label="$t('C端展示-English')">
        <div class="value">{{ details.describeClientEn }}</div>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button type="primary" @click="handleOk">{{ $t("确定") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { computed, unref } from '@vue/composition-api';
import { CLASSIFY_MAP, SHOW_MAP } from "./constants"
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    details: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    const isZh = computed(() => root.$store.state.app.currentLang === "zh");
    const langSuffix = computed(() => unref(isZh) ? "Zh" : "En");

    const handleClose = () => {
      emit("update:visible", false);
    };
    const handleOk = async () => {
      emit("ok");
      handleClose();
    };

    return {
      CLASSIFY_MAP,
      SHOW_MAP,
      isZh,
      langSuffix,

      handleClose,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
.value {
  width: 250px;
}
</style>
