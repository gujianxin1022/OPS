<template>
  <!-- 学科下拉 -->
  <el-select
    v-model="key"
    filterable
    :multiple="multiple"
    :collapse-tags="true"
    :placeholder="$t('学科')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in Constants.subjectListNotMusic(currentLang)"
      :key="item.value"
      :label="$t(item.label)"
      :value="`${item.value}`"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed,watch} from "@vue/composition-api";
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
      changeSelect,
    };
  },
};
</script>
