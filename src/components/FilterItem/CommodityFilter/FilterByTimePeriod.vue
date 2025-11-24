<template>
  <!-- 时间段筛选 -->
  <el-date-picker
    v-model="timeArr"
    clearable
    type="datetimerange"
    :start-placeholder="$t('开始日期')"
    :end-placeholder="$t('结束日期')"
    size="small"
    :default-time="['00:00:00', '23:59:59']"
    @change="timeChange"
    :picker-options="pickerOptions"
  />
</template>

<script>
import { ref, computed, watch, onMounted } from "@vue/composition-api";
export default {
  props: {
    defaultTimeArr: {
      type: Array,
      default: [],
    },
    isInvalidPastTime: {
      type: Boolean,
      default: false,
    },
    isShowHotKey: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const timeArr = ref([]);
    const pickerOptions = {
      disabledDate(time) {
        if (!props.isInvalidPastTime) {
          return false;
        }
        return time.getTime() < Date.now();
      },
      shortcuts: props.isShowHotKey && [
        {
          text: root.$t("最近一周"),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          },
        },
        {
          text: root.$t("最近一个月"),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          },
        },
        {
          text: root.$t("最近三个月"),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
          },
        },
      ],
    };
    const timeChange = (arr) => {
      if (!arr) {
        emit("changeSelect", ["", ""]);
        return;
      }
      emit("changeSelect", [arr[0].toISOString(), arr[1].toISOString()]);
    };
    const reset = () => {
      timeArr.value = [];
    };
    watch(
      () => props.defaultTimeArr,
      (val) => {
        timeArr.value = val || "";
      },
      {
        immediate: true,
      }
    );
    onMounted(() => {
      timeArr.value = props.defaultTimeArr;
    });
    return {
      isEn,
      timeArr,
      timeChange,
      pickerOptions,
      reset,
    };
  },
};
</script>
