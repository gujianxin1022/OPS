<template>
  <el-dialog
    @close="closeDialog"
    :title="$t(title)"
    :visible.sync="visible"
    append-to-body
    top="5vh"
    :close-on-click-modal="false"
    width="1000px"
  >
    <div class="form-warp" :style="{ height: tableHeight + 'px' }">
      <FormProvider :form="form">
        <FormLayout labelCol="24" wrapperCol="24" layout="vertical">
          <SchemaField :schema="formData" :scope="{}" />
        </FormLayout>
      </FormProvider>
    </div>
    <span v-if="title !== '查看'" slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">{{ $t("取消") }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">{{
        $t("保存")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "@vue/composition-api";
import { createSchemaField, FormProvider } from "@formily/vue";
import { registerValidateLocale, setValidateLanguage } from "@formily/core";
import UploadImage from "@/components/Upload/UploadImage.vue";
import SkuDetailPriceList from "./SkuDetailPriceList.vue";
import RelatedSkuList from "./RelatedSkuList.vue";


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
  InputNumber,
} from "@formily/element";
import { form, schema } from "./SkuDialog";
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
    InputNumber,
    UploadImage,
    SkuDetailPriceList,
    RelatedSkuList
  },
});
import { deepClone } from "@/utils/handleData";
export default defineComponent({
  components: {
    FormLayout,
    FormProvider,
    Submit,
    ...SchemaField,
    PreviewText,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    skuId: {
      type: Number,
      default: null,
    },
    agreementList: {
      type: Array,
      default: [],
    },
    currencyList: {
      type: Array,
      default: [],
    },
    spuInfo: {
      type: Object,
      default: {},
    },
    skuDetail: {
      type: Object,
      default: {},
    },
    type: {
      type: String,
      default: null,
    },
  },
  setup(props, { root, emit, refs }) {
    setValidateLanguage("zh-en");
    registerValidateLocale({
      "zh-en": {
        required: root.$t("该字段是必填字段"),
      },
    });
    const tableHeight = window.innerHeight - 245;
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const closeDialog = () => {
      emit("update:visible", false);
    };
    const handleSubmit = async () => {
      const validateSuccess = await customValidate();
      await form
        .validate()
        .then(async () => {
          try {
            const formData = await deepClone({ ...form.values });
            try {
              await root.$Api.financeManagement.handelSkuData(formData);
              closeDialog();
              emit("refresh");
            } finally {
            }
          } finally {
            closeDialog();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const customValidate = async () => {/* 自定义校验 */
      const currencyTotalPriceList = form.getValuesIn("currencyTotalPriceList");
      let validateSuccess;
      if (currencyTotalPriceList && currencyTotalPriceList.length > 0) {
        validateSuccess = currencyTotalPriceList.some((e) => {
          return e.totalPrice > 0;
        });
      } else {
        validateSuccess = false;
      }
      form.setFieldState("currencyTotalPriceList", (state) => {
        state.setSelfErrors(
          validateSuccess ? [] : [root.$t("该字段是必填字段")]
        );
      });
      return validateSuccess;
    };

    onMounted(() => {
      if (props.skuDetail) form.setValues(props.skuDetail);
    });
    return {
      title: props.type,
      isEn,
      tableHeight,
      closeDialog,
      form,
      formData: schema(props, isEn.value, root),
      handleSubmit,
    };
  },
});
</script>
<style lang="scss" scoped>
.form-warp {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
}
</style>
<style lang="scss">
  .el-tooltip__popper {
    z-index: 9999 !important;
    width: 120px;
  }
  </style>
