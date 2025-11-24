<template>
  <el-dialog
    :title="$t('交接学生')"
    :visible="visible"
    width="1200px"
    :before-close="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    top="5vh"
  >
    <!-- v-loading="formState.loading" -->
    <div class="form-warp" :style="{ height: tableHeight + 'px' }">
      <FormProvider :form="form">
        <FormLayout labelCol="24" wrapperCol="24" layout="vertical">
          <SchemaField :schema="handoverForm" :scope="{}" />
        </FormLayout>
      </FormProvider>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t("取消") }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">{{
        $t("确定")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  onMounted,
  reactive,
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
import CourseProgress from "../components/courseProgress";
import { createSchemaField, FormProvider } from "@formily/vue";
import { form, schema, initFormData, constructionParams } from "./index";
import { deepClone } from "@/utils/handleData";
import { getCountryList } from "@/api/base";
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
    userRole: { type: String, default: `` },
    localKey: { type: Number, default: 0 },
    taskCode: { type: Number, default: 0 },
    taskLine: { type: Number, default: 1 },
  },
  setup(props, { root, emit }) {
    setValidateLanguage("zh-en");
    registerValidateLocale({
      "zh-en": {
        required: root.$t("该字段是必填字段"),
      },
    });
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const { reqFormInfo, formState } = useInitHandoverForm(root);
    const tableHeight = window.innerHeight - 245;
    const loading = ref(false);
    const countryOfResidence = ref(null);
    const handleClose = () => {
      form.reset();
      emit("update:visible", false);
    };
    const isEmpty = (str) => {
      if (typeof str === "undefined" || str === null || str.length === 0) {
        return true;
      }
      return false;
    };
    const customValidate = async (params) => {
      /* 注：微信、WhatsApp、LINE至少填写一项 */
      // const { internalWechat, internalWhatsapp, internalLine } =
      //   params.sopParentReq;
      // const validateSuccess =
      //   !isEmpty(internalWechat) ||
      //   !isEmpty(internalWhatsapp) ||
      //   !isEmpty(internalLine);
      // form.setFieldState("sopParentReq.internalWechat", (state) => {
      //   state.setSelfErrors(
      //     validateSuccess ? [] : [root.$t("注：微信、WhatsApp、LINE至少填写一项")]
      //   );
      // });
      // return validateSuccess;
      return true;
    };

    const getCountryOfResidence = async () => {
      const {
        status,
        data: { code, data },
      } = await getCountryList();
      if (status !== 200 || code !== 200) return Promise.reject();
      countryOfResidence.value = data;
    };

    const getTimeDifference = (time) => {
      time += "";
      if (time === "0") return root.$t("无时差");
      const hour = parseInt(
        time.startsWith("-") ? time.substr(1) / 60 : time / 60
      );
      const minute = parseInt(
        time.startsWith("-") ? time.substr(1) % 60 : time % 60
      );
      const radioVal = time.startsWith("-") ? "-" : "+";
      return minute
        ? `${radioVal} ${hour}${root.$t("小时")}${minute}${root.$t("分钟")}`
        : `${radioVal} ${hour}${root.$t("小时")}`;
    };

    const handleSubmit = async () => {
      // const validateSuccess = await customValidate({ ...form.values });
      // if (!validateSuccess) return;
      await form
        .validate()
        .then(async () => {
          try {
            await getCountryOfResidence();
            const params = await constructionParams(
              deepClone({ ...form.values })
            );
            const specialLanguageDesc =
              params.sopParentReq.specialLanguage.split("_")[1];
            params.sopParentReq.specialLanguage =
              params.sopParentReq.specialLanguage.split("_")[0];
            const address = countryOfResidence.value.find(
              (t) =>
                t.nameZh === params.sopParentReq.countryOfResidence ||
                t.nameEn === params.sopParentReq.countryOfResidence
            );
            delete params.sopParentReq.internalPhone;
            delete params.sopParentReq.internalWechat;
            delete params.sopParentReq.internalWhatsapp;
            delete params.sopParentReq.internalLine;
            if (params.sopStudentSubjectReq.subjectInfoEn)
              params.sopStudentSubjectReq.subjectInfoEn.parentExpectEn = '[]'; /* 系统删除了英文家长期待字段，但是后端还有，先前端手动处理 */
            if (!address) {
              return root.$notify.error(
                root.$t("请按照最新格式选择'用户居住地'信息")
              );
            }
            loading.value = true;
            const timeDiff = getTimeDifference(
              params.sopParentReq.timeDifference
            );
            root
              .$msgbox({
                title: root.$t("提醒"),
                message: (
                  <div>
                    <p>{root.$t("请确认以下信息的正确性:")}</p>
                    <p>
                      {root.$t("居住地")}：{address.nameZh}
                    </p>
                    <p>
                      {root.$t("时区")}：{params.sopParentReq.timeZone}
                    </p>
                    <p>
                      {root.$t("时差")}: {timeDiff}
                    </p>
                    <p>
                      {root.$t("用户服务语言偏好")}: {specialLanguageDesc}
                    </p>
                  </div>
                ),
                confirmButtonText: root.$t("确认"),
              })
              .then(async () => {
                const {
                  status,
                  data: { code, data },
                } = await root.$Api.task.handleHandoverStuTask(params);
                if (status !== 200 || code !== 200) return Promise.reject();
                root.$notify({
                  type: "success",
                  message: root.$t("完成任务"),
                });
                emit("refreshPage");
                emit("update:visible", false);
              })
              .catch(() => {});
          } finally {
            loading.value = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    onMounted(async () => {
      reqFormInfo(props);
    });
    return {
      tableHeight,
      loading,
      handleClose,
      form,
      handoverForm: schema(props.currentInfo, isEn.value, props.taskLine),
      handleSubmit,
      reqFormInfo,
      formState,
    };
  },
};

let parentInfo = null;

/* 初始化交接单 */
const useInitHandoverForm = (root) => {
  const formState = reactive({
    loading: false,
    form: {},
  });

  /* 家长信息，学生信息，学科信息 */
  const reqFormInfo = async (props) => {
    formState.loading = true;
    const handoverBaseInfo = await root.$Api.task.getHandoverBaseInfo(
      props.currentInfo.studentId,
      props.currentInfo.course.studentPlanId
    );
    parentInfo = handoverBaseInfo.data.data.sopParentResp;
    const initData = await initFormData(handoverBaseInfo, props.taskLine);
    formState.form = initData;
    form.setValues(initData);
    formState.loading = false;
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
  width: 220px;
  line-height: 26px;
}
</style>
