<template>
  <!-- 时区下拉 -->
  <el-select
    v-model="key"
    filterable
    clearable
    :disabled="disabled"
    :multiple="multiple"
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in timeZones()"
      :key="item.value"
      :label="$t(item.label)"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
import { timeZones } from "@/utils/constants";

export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    initVal: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const key = ref("");
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    watch(
      () => props.initVal,
      (val) => {
        key.value = val || "";
      },
      {
        immediate: true,
      }
    );
    return {
      currentLang,
      key,
      multiple: props.multiple,
      disabled: props.disabled,
      changeSelect,
      timeZones,
    };
  },
};
</script>
