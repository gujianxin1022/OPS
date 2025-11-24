<template>
  <div class="slots-type-warp">
    <el-dialog
      :title="$t('可教课包设置')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :before-close="handleClose"
      width="60%"
      top="5vh"
      center
    >
      <div>
        <el-form
          :label-width="isEn ? '145px' : '80px'"
          :inline="true"
          :style="
            isEn
              ? 'width: 800px; margin: 0 auto'
              : 'width: 500px; margin: 0 auto'
          "
        >
          <el-form-item :label="$t('课包范围')">
            <el-radio-group v-model="reqParams.setType">
              <el-radio :label="1">{{ $t("全部") }}</el-radio>
              <el-radio :label="2">{{ $t("指定课包") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <br />
          <el-form-item v-show="reqParams.setType === 2" :label="$t('课程包')">
            <FilterByCoursePackageInit
              style="width: 400px"
              :initVal="initPackageIds"
              :collapseTags="false"
              @changeEditionSelect="
                (val) => {
                  reqParams.coursePackageIdList = val;
                }
              "
              :multiple="true"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button
          :disabled="false"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          >{{ $t("保存") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "@vue/composition-api";
import FilterByCoursePackageInit from "@/components/FilterItem/CoursePackageTreeFilter/FilterByCoursePackageInit";

export default {
  props: {
    dialogVisible: { type: Boolean, default: false },
    currentRow: { type: Object, default: {} },
  },
  components: { FilterByCoursePackageInit },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const initPackageIds = ref([]);
    onMounted(() => {
      if (
        props.currentRow.packageInfoList &&
        props.currentRow.packageInfoList.length
      ) {
        props.currentRow.packageInfoList.forEach((e) => {
          initPackageIds.value.push(e.coursePackageId + "");
        });
      }
      reqParams.value.setType = props.currentRow.teachPackageType || 1;
    });
    const handleClose = () => {
      emit("update:dialogVisible", false);
    };
    const reqParams = ref({
      coursePackageIdList: [],
      configId: props.currentRow.id,
      setType: 1,
    });
    const loading = ref(false);
    const handleSubmit = async () => {
      try {
        loading.value = true;
        let params = {
          ...reqParams.value,
        };
        await root.$Api.tutorManagement.reqTeacherTypePackageConfig(params);
        root.$notify.success(root.$t("操作成功"));
        handleClose();
        emit("refreshList");
      } finally {
        loading.value = false;
      }
    };

    return {
      handleClose,
      isEn,
      reqParams,
      handleSubmit,
      loading,
      initPackageIds,
    };
  },
};
</script>

<style lang="scss" scoped>
.slots-type-warp {
  padding: 20px 15px 0;
  .tips {
    color: #bebebe;
    font-size: 12px;
  }
}
</style>
