<template>
  <span>
    <div
      v-if="isShowTag"
      :style="isEn ? 'width:57px' : 'width:56px'"
      class="unverified-tag"
    >
      {{ $t("未验证") }}
    </div>
    <el-link
      :style="isEn ? 'width:57px' : 'width:56px'"
      v-if="isShowTag"
      @click="dialogVisible = true"
      class="guide-link"
      type="primary"
      >{{ $t("验证指南") }}</el-link
    >
    <span v-if="!isShowTag" @click="dialogVisible = true" class="guide-span">{{
      $t("验证指南")
    }}</span>
    <el-dialog
      :title="$t('验证指南')"
      :visible.sync="dialogVisible"
      width="60%"
      append-to-body
    >
      <img style="width: 100%" :src="isEn ? GuideEn : GuideZh" />
    </el-dialog>
  </span>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import GuideZh from "@/assets/students/验证Zh.jpg";
import GuideEn from "@/assets/students/验证En.jpg";
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    isShowTag: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const dialogVisible = ref(false);
    return { dialogVisible, isEn, GuideEn, GuideZh };
  },
};
</script>

<style scoped lang="scss">
.unverified-tag {
  background: #f9a9b2;
  width: 57px;
  height: 18px;
  color: #fff;
  text-align: center;
  line-height: 18px;
  font-size: 11px;
  border-radius: 4px;
  margin-bottom: 3px;
}
.guide-link {
  font-size: 11px;
}
.guide-span {
  color: #e6a23c;
  cursor: pointer;
}
</style>
