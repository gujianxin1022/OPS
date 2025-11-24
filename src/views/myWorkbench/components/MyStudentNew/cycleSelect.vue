<template>
  <div class="user-select-warap">
    <el-select
      size="mini"
      v-model="cycleState.type"
      :placeholder="$t('请选择')"
      style="width:110px"
    >
      <el-option
        v-for="item in cycleSelect"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input-number
      class="value-wrap"
      v-model="cycleState.value"
      controls-position="right"
      :min="0"
    ></el-input-number>
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
} from "@vue/composition-api";

export default defineComponent({
  props: {
    searchParams: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, emit }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    const cycleSelect = ref(null);
    const cycleState = reactive({
      type: "studentFirstSingleCycle",
      value: undefined,
    });

    const emitData = {
      studentFirstSingleCycle: null,
      parentFirstSingleCycle: null,
    };

    watch(
      cycleState,
      () => {
        const data = Object.assign({}, emitData, {
          [cycleState.type]: cycleState.value,
        });
        emit("cycleChange", data);
      },
      { deep: true }
    );

    watch(
      props.searchParams,
      (params) => {
        mapPropsToState(params);
      },
      { deep: true }
    );

    watch(currentLang, () => {
      initData();
    });

    const initData = () => {
      cycleSelect.value = [
        {
          name: root.$t("学生"),
          value: "studentFirstSingleCycle",
        },
        {
          name: root.$t("家长"),
          value: "parentFirstSingleCycle",
        },
      ];
      mapPropsToState(props.searchParams);
    };

    const mapPropsToState = (params) => {
      const { studentFirstSingleCycle, parentFirstSingleCycle } = params;
      if (studentFirstSingleCycle || parentFirstSingleCycle) {
        const o = { studentFirstSingleCycle, parentFirstSingleCycle };
        Object.keys(o).map((key) => {
          if (o[key]) {
            Object.assign(cycleState, { type: key, value: o[key] });
          }
        });
      }
    };

    onMounted(() => {
      initData();
      root.$eventBus.$on("clearFilter", () => {
        cycleState.value = "";
        const data = Object.assign({}, emitData, {
          [cycleState.type]: cycleState.value,
        });
        emit("cycleChange", data);
      });
    });

    return {
      cycleState,
      cycleSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-select-warap {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  width: 192px;
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
  }
  ::v-deep .value-wrap .el-input__inner {
    width: 100%;
  }

}
</style>
<style lang="scss">
.user-select-warap {
  .el-input-number__decrease{
    display: none;
  }
  .el-input-number__increase{
    display: none;
  }
   
  .el-input-number.is-controls-right .el-input__inner{
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
