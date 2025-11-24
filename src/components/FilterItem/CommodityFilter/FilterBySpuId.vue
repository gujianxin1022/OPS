<template>
  <!-- spu下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('请选择')"
    @change="changeSelect"
    :multiple="multiple"
  >
    <el-option
      v-for="(item, index) in optionList"
      :key="item.spuId"
      :label="getLabel(item)"
      :value="item.spuId"
      :disabled="item.spuId==$route.query.spuId"
    >
    </el-option>
  </el-select>
</template>

<script>
import { onMounted, ref, computed ,watch} from "@vue/composition-api";
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    initVal: {
      type: [String, Array],
      default: "",
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const optionList = ref([]);
    const selectId = ref("");
    const reqOptionList = async () => {
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.getSPUList({
        type: -1,
        status: -1,
        appShow: -1,
        pageNum: 1,
        pageSize: 200,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.value = data?.list || [];
    };
    const changeSelect = async (val) => {
      emit("changeSelect", val);
    };
    const getLabel = (item) => {
      return isEn.value ? item.spuNameEn : item.spuNameCn;
    };
    watch(
      () => props.initVal,
      (val) => {
        selectId.value = val || "";
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      reqOptionList();
    });
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
      getLabel,
    };
  },
};
</script>
