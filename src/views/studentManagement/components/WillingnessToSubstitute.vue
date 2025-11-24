<template>
  <!-- 1v1代课意愿 -->
  <el-dialog
    :before-close="close"
    :title="$t('代课意愿设置')"
    :visible.sync="visible"
    center
    width="500px"
    :show-close="false"
    top="15vh"
  >
    <div class="willingness-to-substitute-warp">
      <span class="title" style="font-weight: 700">{{ $t("选择学生") }} </span>
      <el-select
        v-model="curStudent"
        filterable
        clearable
        :multiple="multiple"
        :collapse-tags="true"
        :placeholder="$t('请选择')"
        @change="changeSelect"
      >
        <el-option
          v-for="item in studentsList"
          :key="item.studentUserId"
          :label="item.realName"
          :value="item.studentUserId"
          v-show="item.status !== 3"
        >
        </el-option>
      </el-select>
      <div v-loading="loading" class="subject-box" v-show="curStudent > 0">
        <div class="subject mb10" v-for="item in subjectArr">
          <span class="title" style="font-weight: 700"> {{ item.label }}:</span>
          <el-switch
            :disabled="!isHasPromise"
            v-model="item.substitute"
            :active-text="$t('同意')"
            :inactive-text="$t('不同意')"
          >
          </el-switch>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("取消") }}</el-button>
      <el-button
        :disabled="!curStudent > 0 || !isHasPromise"
        :loading="submiting"
        type="primary"
        @click="submit"
        >{{ $t("确定") }}</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { onMounted, computed, ref } from "@vue/composition-api";
import HandlePermission from "@/utils/handlePermission";
const { handleButtonPer } = HandlePermission;
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    students: {
      type: Array,
      default: [],
    },
  },
  setup(props, { root, emit }) {
    const subjectArr = ref([
      { label: root.$t("中文"), value: 0, substitute: false },
      { label: root.$t("英文"), value: 1, substitute: false },
      { label: root.$t("数学"), value: 2, substitute: false },
      { label: root.$t("音乐"), value: 3, substitute: false },
    ]);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const curStudent = ref("");
    const submiting = ref(false);
    const loading = ref(false);
    const close = () => {
      emit("update:visible", false);
    };
    const changeSelect = (studentId) => {
      if (!studentId) return;
      checkPromise(studentId);
      reqSubstituteStatus(studentId);
    };
    const isHasPromise = ref(false);
    const checkPromise = async (studentId) => {
      try {
        const res = await root.$Api.studentManagement.reqCheckSubstitutePromise(
          studentId
        );
        isHasPromise.value =
          res || handleButtonPer("teach.studentMT.parentInfo.substitute");
      } catch {
        isHasPromise.value = false;
      }
    };
    const reqSubstituteStatus = async (studentId) => {
      subjectArr.value.forEach((subject) => {
        subject.substitute = false;
      });
      try {
        loading.value = true;
        const res = await root.$Api.studentManagement.reqStudentSubstitute(
          studentId
        );
        if (!res) {
          subjectArr.value.forEach((subject) => {
            subject.substitute = false;
          });
        } else {
          const substituteArr = res.split(",");
          substituteArr.forEach((i) => {
            subjectArr.value[i].substitute = true;
          });
        }
      } finally {
        loading.value = false;
      }
    };

    const submit = async () => {
      let paramsArr = [];
      subjectArr.value.forEach((subject, index) => {
        if (subject.substitute) {
          paramsArr.push(index);
        }
      });
      try {
        submiting.value = true;
        await root.$Api.studentManagement.reqModifyStudentSubstitute(
          curStudent.value,
          {
            refuseSubstitute: paramsArr.join(","),
          }
        );
        root.$message.success(root.$t("操作成功"));
        close();
      } catch {
        reqSubstituteStatus(curStudent.value);
      } finally {
        submiting.value = false;
      }
    };
    return {
      studentsList: props.students,
      currentLang,
      curStudent,
      subjectArr,
      loading,
      submiting,
      isHasPromise,
      close,
      changeSelect,
      submit,
    };
  },
};
</script>

<style scoped lang="scss">
.willingness-to-substitute-warp {
  min-height: 180px;
  .title {
    font-weight: 700;
    margin-right: 10px;
  }
  .subject-box {
    margin-top: 20px;
  }
  .none {
    height: 100px;
  }
}
</style>
