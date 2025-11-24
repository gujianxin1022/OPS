<template>
  <el-dialog
    :title="$t('新生首通')"
    :visible="visible"
    width="1200px"
    :before-close="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div
      v-loading="formState.loading"
      class="form-warp"
      :style="{ height: tableHeight + 'px' }"
    >
      <FormProvider :form="form">
        <FormLayout labelCol="24" wrapperCol="24" layout="vertical">
          <SchemaField :schema="handoverForm" :scope="{}" />
        </FormLayout>
      </FormProvider>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = true">{{ $t("取消") }}</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">{{
        $t("提交")
      }}</el-button>
    </span>
    <el-dialog
      width="30%"
      :title="$t('提示')"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div>{{ $t("是否保存已填写信息？") }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t("取消") }}
        </el-button>
        <el-button type="primary" @click="saveForm" :loading="loading">{{
          $t("保存")
        }}</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs,
  computed,
  ref,
  defineComponent,
} from "@vue/composition-api";
import {
  FormLayout,
  FormItem,
  Input,
  FormGrid,
  Select,
  PreviewText,
  Submit,
  Space,
  Radio,
  DatePicker,
  Cascader,
} from "@formily/element";
import { registerValidateLocale, setValidateLanguage } from "@formily/core";
import AuditionInformation from "../components/auditionInformation";
import OrderInformation from "../components/orderInformation";
import FamilyLaList from "../components/familyLaList";
import CourseProgress from "../components/courseProgress";
import { createSchemaField, FormProvider } from "@formily/vue";
import DateTimeUtils from "@/utils/datetime_utils";
import {
  form,
  schema,
  initFormData,
  initHandoverData,
  constructionParams,
} from "./index";
import { deepClone } from "@/utils/handleData";

const TextDisplay = defineComponent({
  /* 文本展示 */ props: ["value"],
  setup(props) {
    return () => <div>{props.value || "--"}</div>;
  },
});
const ParentAccount = defineComponent({
  /* 家长&推荐人 */ props: ["value"],
  setup(props) {
    const handleClick = () => {
      window.open(
        `/studentManagement/parentInfo?parentUserId=${props.value.id}`,
        "_blank"
      );
    };
    return () => <div onClick={handleClick}>{props.value.name}</div>;
  },
});

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    Select,
    Space,
    Radio,
    DatePicker,
    Cascader,
    AuditionInformation,
    OrderInformation,
    ParentAccount,
    TextDisplay,
    FamilyLaList,
    CourseProgress,
  },
});

export default {
  name: "handoverStudents",
  components: {
    FormLayout,
    FormProvider,
    Submit,
    ...SchemaField,
    AuditionInformation,
    PreviewText,
  },
  props: {
    visible: { type: Boolean, default: false },
    currentInfo: { type: Object, default: () => {} /*  */ },
    task: { type: String, default: () => {} },
  },
  setup(props, { root, emit }) {
    setValidateLanguage("zh-en");
    registerValidateLocale({
      "zh-en": {
        required: root.$t("该字段是必填字段"),
      },
    });
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const { reqFormInfo, formState } = useInitHandoverForm(root, props, isEn);
    const innerVisible = ref(false);
    const tableHeight = window.innerHeight - 245;
    const loading = ref(false);
    const handleClose = () => {
      form.reset();
      emit("update:visible", false);
    };

    /* 提交任务 */
    const handleSubmit = async () => {
      await form
        .validate()
        .then(() => {
          reqHandleTask({ ...form.values, submitType: 1 });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const reqHandleTask = async (originData) => {
      try {
        const params = await constructionParams(deepClone(originData));
        loading.value = true;
        const {
          status,
          data: { code, data },
        } = await root.$Api.task.handleNewStuTask(params);
        if (status != 200 || code !== 200) return Promise.reject();
        root.$notify({
          type: "success",
          message: params.submitType
            ? root.$t("完成任务")
            : root.$t("保存成功"),
        });
        emit("refreshPage");
        form.reset();
        emit("update:visible", false);
        innerVisible.value = false;
      } finally {
        loading.value = false;
      }
    };
    /* 保存表单 */
    const saveForm = async () => {
      reqHandleTask({
        ...form.values,
        submitType: 0,
      });
    };

    onMounted(async () => {
      reqFormInfo(props.currentInfo);
    });
    return {
      innerVisible,
      tableHeight,
      loading,
      handleClose,
      form,
      handoverForm: schema(props.currentInfo, isEn.value),
      handleSubmit,
      saveForm,
      reqFormInfo,
      formState,
    };
  },
};
/* 初始化交接单 */
const useInitHandoverForm = (root, props, isEn) => {
  const formState = reactive({
    loading: false,
    form: {},
  });
  /* 家长信息，学生信息，学科信息 */
  const reqFormInfo = async () => {
    // const { taskCode, taskId } = props
    const { task, currentInfo } = props;
    /* 家长，学生，学科信息 */
    const handoverInfo = await root.$Api.task.getHandOverInfo(
      task.taskTypeCode,
      task.id
    );
    const handoverInfoPart = await initHandoverData(
      handoverInfo.data.data||{},
      isEn.value
    );
    const doTaskParamCash = handoverInfo.data.data?.doTaskParamCash;
    if (doTaskParamCash) {
      /*取保存得表单数据展示 */
      doTaskParamCash.doTaskParam = JSON.parse(doTaskParamCash.doTaskParam);
      const initData = doTaskParamCash;
      const subjectInfoZh = doTaskParamCash.sopStudentSubjectReq.subjectInfoZh;
      const subjectInfoEn = doTaskParamCash.sopStudentSubjectReq.subjectInfoEn;
      if (subjectInfoZh && subjectInfoZh.parentExpect) {
        subjectInfoZh.parentExpect = subjectInfoZh.parentExpect.split(",");
      }
      if (subjectInfoZh && subjectInfoZh.chineseExperience) {
        subjectInfoZh.chineseExperience = subjectInfoZh.chineseExperience.split(",");
      }
      if (subjectInfoEn && subjectInfoEn.englishExperience) {
        subjectInfoEn.englishExperience =  subjectInfoEn.englishExperience.split(",")
      }
      if(initData.sopStudentReq.birthday){
        initData.sopStudentReq.createTime = DateTimeUtils.dateClockTime(initData.sopStudentReq.createTime)
      }
      if(initData.sopStudentReq.createTime){
        initData.sopStudentReq.createTime = DateTimeUtils.dateClockTime(initData.sopStudentReq.createTime)
      }
      initData.sopStudentReq.age = DateTimeUtils.birthdayMapToAge(initData.sopStudentReq.birthday);
      form.setValues({ ...initData, ...handoverInfoPart });
    } else {
      /*走接口获取表单数据展示 */
      const {
        status,
        data: { code, data },
      } = await root.$Api.task.getHandoverBaseInfo(
        currentInfo.studentUserId,
        currentInfo.studentLearningPlanResp.id
      );
      const initData = await initFormData(data);
      initData.doTaskParam.taskId = props.task.id;
      initData.doTaskParam.revision = "2";
      form.setValues({ ...initData, ...handoverInfoPart });
      formState.loading = false;
    }
  };
  return {
    formState,
    reqFormInfo,
  };
};
</script>

<style lang="scss">
.form-warp {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
}
</style>
<style lang="scss">
.el-picker-panel {
  z-index: 9999 !important;
}
.el-cascader__dropdown {
  z-index: 9999 !important;
}
.el-tooltip__popper {
  z-index: 9999 !important;
  width: 120px;
}
</style>
