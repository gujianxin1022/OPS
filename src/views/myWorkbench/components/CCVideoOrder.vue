<template>
  <span class="video-order-warp">
    <!-- /* virtualclassTypeId === 3 自研教室 */ -->
    <el-button
      v-if="virtualclassType === 3"
      @click="toClassroom"
      style="vertical-align: middle"
      type="text"
      >{{ $t("CC关单教室") }}</el-button
    >
    <span v-else @click="handelTip" class="toop">{{ $t("CC关单教室") }}</span>
  </span>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";

export default {
  props: {
    row: {
      type: Object,
      default: null,
    },
    classTypeId: {
      type: Number,
      default: 1,
    },
    virtualClassId: {
      type: Number,
      default: -1,
    },
    virtualclassType: {
      type: Number,
      default: 3,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const toClassroom = async () => {
      const res = await root.$Api.classManagement.reqCCVideoOrderClassroomUrl(
        props.classTypeId,
        props.virtualClassId,
        JSON.parse(window.localStorage.getItem("userInfo")).id,
      );
      res.entryPath && window.open(`${res.entryPath}?isCC=1`, "_blank");
    };
    const handelTip = () => {
      root.$notify({
        message: root.$t("CC关单教室仅限于自研教室"),
        type: "error",
      });
    };
    return {
      isEn,
      classData: props.row,
      virtualclassType: props.virtualclassTypeId,
      toClassroom,
      handelTip,
    };
  },
};
</script>
<style scoped lang="scss">
.video-order-warp {
  .toop {
    color: #c0c4cc;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
