<template>
  <el-dialog
    width="1200px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :title="$t('报名小班课')"
    :visible.sync="visible"
  >
    <component
      v-if="visible"
      :is="component"
      :packageType="packageType"
      :progressInfo="progressInfo"
      @ok="handleOk"
      @cancel="handleClose"
    />
  </el-dialog>
</template>
<script>
import { computed } from "@vue/composition-api";
import { FORMAL_COURSE } from "@/utils/constants";

import AuditionCourse from "./AuditionCourse";
import FormalCourse from "./FormalCourse";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    packageType: {
      type: Number,
      default: null,
    },
    progressInfo: {
      type: Object,
      default: () => ({
        packageId: "",
        scheduleInfo: [] /* packageTreeId, levelId, unitId, lessonId */
      }),
    },
  },
  components: {
    AuditionCourse,
    FormalCourse,
  },
  setup(props, { emit, root }) {
    const component = computed(() =>
      props.packageType == FORMAL_COURSE ? "FormalCourse" : "AuditionCourse"
    );

    const handleClose = () => {
      emit("update:visible", false);
    };

    const handleOk = () => {
      emit("ok");
      handleClose();
    }

    return {
      component,

      handleOk,
      handleClose,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-top: 0px !important;
  top: 50%;
  transform: translateY(-50%);
}
</style>
