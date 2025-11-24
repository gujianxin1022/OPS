<template>
  <div>
    <el-button @click="handleOpenDialog" type="text">{{
      $t("本课小结")
    }}</el-button>
    <TeacherComments
      v-if="showDialog"
      :teacherComments="showDialog"
      :teacherInfo="teacherInfo"
      :commentsLoading="commentsLoading"
      :valuationrate="valuationrate"
      :studentFeedback="studentFeedback"
      :titleName="$t('本课小结')"
      @getTableData="getHistoryClassTableData"
      @closeTeacherComments="showDialog = false"
      :studentUserId="studentUserId"
    ></TeacherComments>
  </div>
</template>

<script>
import TeacherComments from "@/views/myWorkbench/components/teacherComments";
import { ref, onMounted, computed } from "@vue/composition-api";
export default {
  components: { TeacherComments },
  props: {
    classTypeId: {
      type: Number,
      default: null,
    },
    virtualclassId: {
      type: Number,
      default: null,
    },
    virtualClassStartTime: {
      type: String,
      default: "",
    },
    subjectSpeedZh: {
      type: String,
      default: "",
    },
    subjectSpeedEn: {
      type: String,
      default: "",
    },
    tutorUsername: {
      type: String,
      default: "",
    },
    studentUserId: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit, refs }) {
    const showDialog = ref(false);
    const teacherInfo = ref({});
    const handleOpenDialog = async () => {
      reqLessonSummary();
    };
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const reqBaseInfo = async () => {
      teacherInfo.value = {
        teacherName: props.tutorUsername,
        classTime: props.virtualClassStartTime,
        classType: props.classTypeId == 1 ? "一对一" : "小班课",
        course: {
          lessonDescEN: props.subjectSpeedEn,
          lessonDescZH: props.subjectSpeedZh,
        },
      };
    };
    const commentsLoading = ref(false);
    const valuationrate = ref([]);
    const reqLessonSummary = async () => {
      commentsLoading.value = true;
      try {
        commentsLoading.value = true;
        const {
          status,
          data: { code, data },
        } = await root.$Api.classManagement.virtualclassComment(
          props.virtualclassId,
          "Student"
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        showDialog.value = true;
        valuationrate.value = data || [];
      } finally {
        commentsLoading.value = false;
      }
    };
    onMounted(() => {
      reqBaseInfo();
    });
    return {
      classTypeId: props.classTypeId,
      virtualclassId: props.virtualclassId,
      showDialog,
      teacherInfo,
      commentsLoading,
      valuationrate,
      studentUserId: props.studentUserId,
      handleOpenDialog,
    };
  },
};
</script>
