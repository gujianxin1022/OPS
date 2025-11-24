<template>
  <!-- 课程包下的级别下拉筛选 -->
  <el-select
    v-model="selectId"
    filterable
    clearable
    :collapse-tags="true"
    :placeholder="$t('级别')"
    @change="changeSelect"
  >
    <el-option
      v-for="item in optionList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, computed, watch } from "@vue/composition-api";
export default {
  props: {
    coursePackageId: {
      type: String,
      default: "",
    },
    packageTreeId: {
      type: String,
      default: '',
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
      } = await root.$Api.groupManagement.getCourseHierarchyData({
        packageId: props.coursePackageId,
        packageTreeId: props.packageTreeId,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      optionList.value = data || [];
    };
    const name = ref("");

    const changeSelect = async (val) => {
      optionList.value.some((e) => {
        if (e.id == val) {
          console.log(e);
          name.value = e.name;
        }
        return e.id == val;
      });
      emit("changeSelect", val);
      emit("changeName", name.value);
    };
    const init = () => {
      selectId.value = "";
      emit("changeSelect", "");
      optionList.value = [];
    };
    watch(
      () => props.packageTreeId,
      (val) => {
        init();
        if (val === "") return;
        reqOptionList();
      }
    );
    watch(
      () => selectId.value,
      (val) => {
        let levelItem = optionList.value.filter((v) => {
          return v.id === val;
        });
        const unitOptions = levelItem[0]?.children || [];
        emit("changeUnitOptions", unitOptions);
      }
    );
    const clear = () => {
      selectId.value = "";
    };
    return {
      isEn,
      optionList,
      selectId,
      changeSelect,
      clear,
    };
  },
};
</script>
