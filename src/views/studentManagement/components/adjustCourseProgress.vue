<template>
  <el-dialog
    :before-close="closeAdjustDialog"
    :title="$t('Adjust the schedule')"
    :visible.sync="visible"
    center
    append-to-body
    width="950px"
    top="8vh"
  >
    <div class="mb10 title">
      {{ $t("当前进度") }}：{{
        currentLang === "en"
          ? currentProgressData.lessonNameEn || "---"
          : currentProgressData.lessonName || "---"
      }}
    </div>
    <div
      v-loading="isLoading"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="$t('加载中')"
      element-loading-background="rgba(20, 34, 58, 0.8)"
    >
      <el-cascader-panel
        class="change-prograss-wrap"
        :options="options"
        v-model="selectedData"
        size="mini"
        placeholder="请选择版本"
        clearable
        :props="defaultProps"
        getCheckedNodes="getCheckedNodes"
      >
        <template slot-scope="{ data }">
          <span>{{ data.name }}</span>
          <el-tag v-if="data.trialLesson === 1" type="success">{{
            $t("试听")
          }}</el-tag>
        </template>
      </el-cascader-panel>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeAdjustDialog">{{ $t("close") }}</el-button>
      <el-button @click="confirmChange" type="primary"
        >{{ $t("my-home-Confirm") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { onMounted, computed, ref } from "@vue/composition-api";
import { isShowOff, editionIdsList } from "./notRecommendedProgress";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: Number,
      default: "-1",
    },
    currentProgressData: {
      type: Object,
      default: {}, // 课包信息，包含packageId，packageTreeId，pkgName，lessonId, lessonName等
    },
  },
  setup(props, { root, emit }) {
    const defaultProps = {
      label: "name",
      value: "id",
    };
    const isLoading = ref(false);
    const selectedData = ref(selectedData);
    const options = ref([]);
    const currentLang = computed(() => root.$store.getters.currentLang);

    // 获取课程树层级结构
    const getCourseTree = () => {
      console.log(props.currentProgressData)
      const { packageId, packageTreeId, lessonId, scheduleInfo } =
        props.currentProgressData;
      isLoading.value = true;
      root.$Api.studentManagement.getCourseTree(packageId, packageTreeId).then(
        ({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          if (currentLang.value === "en") {
            data.data.treeList.forEach((e) => {
              e.name = e.nameEn;
            });
          }
          // options.value = data.data.treeList;
          mapTreeData(data.data.treeList);
          isLoading.value = false;
          if (packageId && packageTreeId && lessonId) {
            selectedData.value = scheduleInfo;
          }
        },
        () => {
          isLoading.value = false;
        }
      );
    };
    // 不建议

    const mapTreeData = async (data) => {
      await data.forEach((node) => {
        node.tips = "";
        if (node.courseRootId && editionIdsList.includes(node.courseRootId)) {
          node.tips = isShowOff(node) ? `(${root.$t("进度-已下架")}) ` : "";
        }
        if (
          node.name.includes("Level") &&
          editionIdsList.includes(node.parentCourseRootId)
        ) {
          /* Level级别 */
          node.tips = isShowOff(node) ? `(${root.$t("进度-已下架")}) ` : "";
        }
        node.value = node.id;
        node.name =
          currentLang.value === "en" && node.nameEn
            ? `${node.tips}${node.nameEn}`
            : `${node.tips}${node.name}` || "---";
        if (node.children && node.children.length) {
          if (node.children[0].name.includes("Level")) {
            /* Level级别 */
            node.children.forEach((l) => {
              l.parentCourseRootId = node.courseRootId;
            });
          }
          mapTreeData(node.children);
        } else {
          node.children = null;
        }
      });
      options.value = data;
      isLoading.value = false;
    };

    // 确认调整
    const confirmChange = () => {
      if (!selectedData.value || selectedData.value.length !== 4) {
        root.$notify({
          message: root.$t("请选择完整进度"),
          type: "error",
        });
        return;
      }
      const { packageId, packageTreeId, lessonId } = props.currentProgressData;

      const params = {
        oldPackageTreeId: packageTreeId,
        studentUserId: props.studentId,
        coursePackageId: packageId,
        newPackageTreeId: selectedData.value[0] + "",
        oldLessonId: lessonId,
        newLessonId: selectedData.value[3],
      };
      root.$Api.studentManagement.adjustCourseProgress(params).then(
        ({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          root.$notify({
            message: root.$t("调整成功"),
            type: "success",
          });
          emit("adjustSucessCb", false);
        },
        () => {
          root.$notify({
            message: root.$t("调整失败"),
            type: "error",
          });
        }
      );
    };
    const closeAdjustDialog = () => {
      emit("update:visible", false);
    };

    onMounted(getCourseTree);

    return {
      options,
      isLoading,
      selectedData,
      currentLang,
      closeAdjustDialog,
      confirmChange,
      getCourseTree,
      defaultProps,
    };
  },
};
</script>

<style scoped lang="scss">
::v-deep .change-prograss-wrap .el-cascader-menu__wrap {
  height: 500px;
  padding-bottom: 50px;
  overflow: auto;
}
.title {
  font-weight: bold;
}
</style>
