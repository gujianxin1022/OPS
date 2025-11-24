<template>
  <div class="adjust-class-progress-warp">
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('调整班级进度')"
      :visible.sync="visible"
      :before-close="close"
    >
      <div v-loading="loading">
        <el-row>
          <div class="flex">
            <span class="w80">{{ $t("版本") }}: </span>
            <ul class="ul">
              <template v-if="groupDetailsInfo.type === 1">{{
                groupDetailsInfo.packageTreeName
              }}</template>
              <template v-if="groupDetailsInfo.type === 0">
                <el-select
                  :placeholder="$t('请选择')"
                  v-model="newPackageTreeId"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item of editionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </ul>
          </div>
        </el-row>
        <el-row>
          <div class="flex">
            <span class="w80">lesson: </span>
            <ul class="ul">
              <el-cascader
                style="width: 220px"
                v-model="courseHierarchyIds"
                :options="courseHierarchyList"
                :key="cascaderId"
                :props="{ value: 'id', label: 'name' }"
                :placeholder="$t('级别、单元、lesson')"
              />
            </ul>
          </div>
        </el-row>
        <el-row>
          <el-col class="flex jcc">
            <el-button
              class="mt20"
              type="primary"
              size="medium"
              @click="close"
              >{{ $t("取消") }}</el-button
            >
            <el-button
              class="mt20"
              type="primary"
              size="medium"
              :disabled="courseHierarchyIds.length < 3"
              @click="submit"
              >{{ $t("提交") }}</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, computed, ref, watch } from "@vue/composition-api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    groupDetailsInfo: {
      type: Object,
      default: {},
    },
    groupScale: {
      type: Number,
      default: -1,
    },
  },
  setup(props, { root, emit }) {
    const courseHierarchyList = ref([]);
    const courseHierarchyIds = ref([]);
    const editionOptions = ref([]);
    const newPackageTreeId = ref(props.groupDetailsInfo.packageTreeId);
    const cascaderId=ref(0)
    const close = () => {
      emit("update:visible", false);
    };
    const loading = ref(false);
    const getCourseHierarchyData = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.groupManagement
        .getCourseHierarchyData({
          packageId: props.groupDetailsInfo.coursePackageId,
          packageTreeId: props.groupDetailsInfo.packageTreeId,
        })
        .finally(() => {
          if (props.groupDetailsInfo.type !== 0) {
            loading.value = false;
          }
        });
      if (status !== 200 || code !== 200) return Promise.reject();
      courseHierarchyList.value = data;
      const { levelId, unitId, lessonId } = props.groupDetailsInfo;
      courseHierarchyIds.value = [levelId, unitId, lessonId];
    };
    const submit = async () => {
      loading.value = true;
      const [newLevelId, unitId, newLessonId] = courseHierarchyIds.value;
      const classId = props.groupDetailsInfo.id;
      try {
        if (props.groupScale == 2) {
          const {
            status,
            data: { code, message },
          } = await root.$Api.groupManagement.changeSmallGroupProgress({
            classId,
            newLessonId: newLessonId,
            newLevelId: newLevelId,
            oldPackageTreeId: props.groupDetailsInfo.packageTreeId,
            newPackageTreeId:
              props.groupDetailsInfo.type === 0
                ? newPackageTreeId.value
                : props.groupDetailsInfo.packageTreeId,
          });
          if (status !== 200 || code !== 200) return Promise.reject();
          root.$notify({
            showClose: true,
            message: message,
            type: "success",
          });
        } else {
          /* TODO: 大班课暂时把调整班级进度隐藏了，走不到else逻辑， 后续用到再显示该按钮 */
          /* TODO: 产品说这个大班课调整班级进度这个功能线上暂时没人用，如果用到需要后端修改接口，前端修改对应的字段 */
          /* TODO: 运营 =》大班课 =》大班课列表调整班级进度前后端都没有修改 */
          const {
            status,
            data: { code, message },
          } = await root.$Api.groupManagement.changeBigGroupProgress({
            classId,
            newEditionId: null /* 待修改 */,
            newLessonNo: null /* 待修改 */,
            newLevel: null /* 待修改 */,
          });
          if (status !== 200 && code !== 200) return Promise.reject();
          root.$notify({
            showClose: true,
            message: message,
            type: "success",
          });
        }
        emit("close");
        emit("refresh");
      } finally {
        loading.value = false;
      }
    };
    const currentLang = computed(() => root.$store.getters.currentLang);
    // 获取课程树层级结构
    const getCourseTree = async () => {
      const { coursePackageId, packageTreeId } = props.groupDetailsInfo;
      root.$Api.studentManagement
        .getCourseTree(coursePackageId, packageTreeId)
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          if (currentLang.value === "en") {
            data.data.treeList.forEach((e) => {
              e.name = e.nameEn;
            });
          }
          editionOptions.value = data.data.treeList || [];
        })
        .finally(() => {
          loading.value = false;
        });
    };
    watch(
      () => newPackageTreeId.value,
      (id) => {
        cascaderId.value++
        courseHierarchyList.value = editionOptions.value.filter((v) => {
          return v.id === id;
        })?.[0]?.children;
        courseHierarchyIds.value = [];
      }
    );

    onMounted(async () => {
      loading.value = true;
      await getCourseHierarchyData();
      if (props.groupDetailsInfo.type === 0) {
        await getCourseTree();
      }
    });

    return {
      visible: props.visible,
      courseHierarchyList,
      courseHierarchyIds,
      loading,
      newPackageTreeId,
      editionOptions,
      cascaderId,
      close,
      submit,
    };
  },
};
</script>

<style lang="scss" scoped>
.adjust-class-progress-warp {
  .flex {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 !important;
    span {
      display: inline-block;
      //       width: 37px;
    }
    .ul {
      display: flex;
      padding: 0 !important;
      li {
        list-style-type: none;
        padding: 4px;
        border-radius: 4px;
        margin: 0 3px;
        border: 1px solid #ccc;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
}
</style>
