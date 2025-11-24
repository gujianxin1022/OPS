<template>
  <el-dialog
    width="480px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :title="$t('移出原因')"
  >
    <el-form
      v-loading="listLoading"
      ref="myForm"
      :model="reasonForm"
      :rules="rules"
    >
      <el-form-item prop="quitReasonType">
        <el-radio-group v-model="reasonForm.quitReasonType">
          <div v-for="item in reaonList" :key="item.reasonId" class="mb20">
            <el-radio :label="item.reasonId">{{ item.desc }}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="reasonForm.quitReasonType === 1099"
        prop="quitReasonDesc"
      >
        <el-input
          :maxlength="200"
          :placeholder="$t('请输入')"
          type="textarea"
          v-model="reasonForm.quitReasonDesc"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("my-home-CCancel") }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="sure">{{
        $t("my-home-CConfirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  computed,
  toRefs,
  onMounted,
  ref,
  reactive,
} from "@vue/composition-api";
import { ABNORMAL_CODE } from "@/utils/constants";
export default {
  props: {
    visible: {
      type: Boolean,
      defalult: false,
    },
    studentId: {
      type: Number,
      defalult: null,
    },
    classId: {
      type: Number,
      defalult: null,
    },
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const reaonList = ref([]);
    const handleClose = () => {
      emit("update:visible", false);
    };
    const reasonForm = reactive({
      quitReasonType: "",
      quitReasonDesc: null,
    });
    const loadingState = reactive({
      listLoading: false,
      submitLoading: false,
    });

    const getDelStudentReason = async () => {
      try {
        loadingState.listLoading = true;
        const res = await root.$Api.groupManagement.getDelStudentReason();
        console.log(res)
        reaonList.value = res || [];
      } finally {
        loadingState.listLoading = false;
      }
    };
    const sure = async () => {
      await refs["myForm"].validate();
      loadingState.submitLoading = true;
      try {
        root.$Api.groupManagement
          .removeSmallClassStudent({
            classId: props.classId,
            studentId: props.studentId,
            quitReasonType: reasonForm.quitReasonType,
            quitReasonDesc: reasonForm.quitReasonDesc,
          })
          .then((res) => {
            if (res.data.code === ABNORMAL_CODE.hasCourseIn2HourCode) {
              return root.$notify({
                message: root.$t(
                  "学生当前班级在2h内有未完成的课程，无法退出或转班"
                ),
                type: "error",
              });
            }
            if (res.data.code == 200) {
              emit("removeSuccess");
              handleClose();
              root.$notify({
                message: res.data.message,
                type: "success",
              });
            }
          });
      } finally {
        loadingState.submitLoading = false;
      }
    };
    const rules = {
      quitReasonType: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
      quitReasonDesc: [
        { required: true, message: root.$t("请输入"), trigger: "change" },
      ],
    };
    onMounted(getDelStudentReason);
    return {
      isEn,
      reaonList,
      reasonForm,
      handleClose,
      sure,
      rules,
      ...toRefs(loadingState),
    };
  },
};
</script>
