<template>
  <div class="user-select-warap">
    <el-select
      size="mini"
      v-model="userState.type"
      :placeholder="$t('请选择')"
      @change="handleTypeChange"
    >
      <el-option
        v-for="item in userSelect"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input
      class="value-wrap"
      :placeholder="$t('请输入')"
      :value="userState.value"
      clearable
      @input="handleInput"
    ></el-input>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  computed,
  watch,
  onMounted,
  ref,
  onBeforeUnmount,
} from "@vue/composition-api";

export default defineComponent({
  props: {
    searchParams: {
      type: Object,
      default: {},
    },
    isShowParentUserName: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const userSelect = ref(null);
    const userState = reactive({
      type: "studentName",
      value: "",
    });
    const emitData = {
      studentName: "",
      studentUserId: null,
      parentUserName: "",
      parentUserId: null,
    };

    const handleTypeChange = () => {
      userState.value = "";
    };

    watch(
      props.searchParams,
      (params) => {
        mapPropsToState(params);
      },
      { deep: true }
    );

    watch(
      userState,
      () => {
        const data = Object.assign({}, emitData, {
          [userState.type]: userState.value,
        });
        emit("userChange", data);
      },
      { deep: true }
    );

    watch(currentLang, () => {
      initData();
    });

    const mapPropsToState = (params) => {
      const { studentName, studentUserId, parentUserId, parentUserName } =
        params;
      if (studentName || studentUserId || parentUserId || parentUserName) {
        const o = { studentName, studentUserId, parentUserId, parentUserName };
        Object.keys(o).map((key) => {
          if (o[key]) {
            Object.assign(userState, { type: key, value: o[key] });
          }
        });
      }
    };

    const initData = () => {
      userSelect.value = [
        {
          name: root.$t("学生姓名"),
          value: "studentName",
        },
        {
          name: root.$t("学生ID"),
          value: "studentUserId",
        },
        {
          name: root.$t("家长账号"),
          value: "parentUserName",
        },
        {
          name: root.$t("家长ID"),
          value: "parentUserId",
        },
      ];
      !props.isShowParentUserName && userSelect.value.splice(2, 1);
      mapPropsToState(props.searchParams);
    };

    onMounted(() => {
      initData();
      root.$eventBus.$on("clearFilter", () => {
        userState.value = "";
        const data = Object.assign({}, emitData, {
          [userState.type]: userState.value,
        });
        emit("userChange", data);
      });
    });

    const handleInput = (value) => {
      if (
        userState.type === "studentUserId" ||
        userState.type === "parentUserId"
      ) {
        if (/^\d+$/.test(value) || value === "") {
          userState.value = value;
        }
      } else {
        userState.value = value;
      }
    };

    return {
      emitData,
      userState,
      userSelect,
      handleTypeChange,
      handleInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-select-warap {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  .value-wrap {
    display: inline-block;
    position: relative;
    border-left: 1px solid #dcdfe6;
  }
  ::v-deep .el-tag.el-tag--info {
    max-width: 130px;
    overflow: hidden;
  }
  ::v-deep .el-input__inner {
    border: none;
    width: 130px;
  }
  ::v-deep .value-wrap .el-input__inner {
    width: 100%;
  }
}
</style>
