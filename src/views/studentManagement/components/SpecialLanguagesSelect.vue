<template>
  <!-- 服务语言偏好下拉 -->
  <span>
    <el-select
      style="width: 150px"
      v-show="!isDisabled"
      :disabled="isDisabled"
      v-model="value"
      filterable
      :placeholder="$t('请选择')"
      @change="changeSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      >
      </el-option>
    </el-select>
    <span v-show="isDisabled">{{ langLabel }}</span>
  </span>
</template>

<script>
import { onMounted, ref, computed, watch } from "@vue/composition-api";
import { deepClone } from "@/utils/handleData";

export default {
  props: {
    defaultValue: { type: String, default: "" },
    specialLanguageDesc: { type: String, default: "" },
    isDisabled: { type: Boolean, default: false },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const options = ref([]);
    const value = ref("");
    const langLabel = ref("");
    watch(isEn, (val) => {
      getoptions();
    });
    const getoptions = async () => {
      const res = await root.$Api.studentManagement.reqSpecialLanguagesList();
      options.value = res || [];
      setLangLabel(props.defaultValue);
    };
    const changeSelect = async (val) => {
      if (val === "default") {
        emit("change", props.defaultValue);
      } else {
        emit("change", val);
      }
      setLangLabel(val);
    };
    const setLangLabel = (val) => {
      langLabel.value =
        options.value.filter((e) => {
          return e.code === val;
        })[0]?.name || props.specialLanguageDesc||'-';
    };
    onMounted(() => {
      value.value = deepClone(props.defaultValue);
      getoptions();
    });
    return {
      options,
      value,
      langLabel,
      changeSelect,
    };
  },
};
</script>
