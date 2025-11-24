<template>
  <el-dialog
    v-if="visible"
    width="766px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :title="$t(operationType)"
    :visible.sync="visible"
  >
    <div>
      <el-tabs
        tab-position="left"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-if="operationType == '新增字段' || operateItemType === 'Select'"
          :disabled="operateItemType.length > 0 && operateItemType !== 'Select'"
          :label="$t('单选')"
          name="Select"
        >
          <selectField
            v-if="activeName === 'Select'"
            :operateFieldId="operateFieldId"
            @refreshPage="refreshPage"
            itemType="Select"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="operateItemType === 'Radio'"
          :disabled="operateItemType.length > 0 && operateItemType !== 'Radio'"
          :label="$t('单选')"
          name="Radio"
        >
          <selectField
            v-if="activeName === 'Radio'"
            :operateFieldId="operateFieldId"
            @refreshPage="refreshPage"
            itemType="Radio"
          />
        </el-tab-pane>
        <el-tab-pane
          :disabled="
            operateItemType.length > 0 && operateItemType !== 'SelectMultiple'
          "
          :label="$t('多选')"
          name="SelectMultiple"
        >
          <selectField
            v-if="activeName === 'SelectMultiple'"
            :operateFieldId="operateFieldId"
            @refreshPage="refreshPage"
            itemType="SelectMultiple"
          />
        </el-tab-pane>
        <el-tab-pane
          :disabled="
            operateItemType.length > 0 && operateItemType !== 'TextArea'
          "
          :label="$t('文本')"
          name="TextArea"
        >
          <textAreaField
            :operateFieldId="operateFieldId"
            @refreshPage="refreshPage"
            itemType="TextArea"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
} from "@vue/composition-api";
import selectField from "./selectField.vue";
import textAreaField from "./textAreaField.vue";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    operateItemType: {
      type: String,
      default: "",
    },
    operationType: {
      type: String,
      default: "",
    },
    operateFieldId: {
      type: Number,
      default: null,
    },
  },
  components: {
    selectField,
    textAreaField,
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const activeName = ref("");
    const handleClose = () => {
      emit("update:visible", false);
    };
    const refreshPage = () => {
      emit("ok");
      handleClose();
    };
    watch(
      () => props.operateItemType,
      (val) => {
        if (val?.length > 0) {
          activeName.value = val;
        } else {
          activeName.value = "Select";
        }
      }
    );
    onMounted(() => {
      if (props.operateItemType?.length > 0) {
        activeName.value = props.operateItemType;
      } else {
        activeName.value = "Select";
      }
    });
    return {
      isEn,
      activeName,
      operateFieldId: props.operateFieldId,
      operateItemType: props.operateItemType,
      handleClose,
      refreshPage,
    };
  },
};
</script>
