<template>
  <!-- 单日期筛选 -->
  <el-date-picker
    v-model="time"
    :clearable="clearable"
    type="date"
    @change="timeChange"
    :placeholder="$t('选择日期')"
    :picker-options="pickerOptions"
  >
  </el-date-picker>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";
export default {
  props: {
    defaultCurDate: {
      type: Boolean,
      default: false,
    },
    invalidTime: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    invalidTimeDirection: {
      type: String,
      default: "new",
    },
  },
  setup(props, { root, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const time = ref("");
    const thisStartTime = ref("");
    const thisEndTime = ref("");
    const timeChange = (val) => {
      let startTime = new Date(val).toISOString();
      thisStartTime.value = startTime;
      let endTime = new Date(val.getTime() + 24 * 60 * 60 * 1000).toISOString();
      thisEndTime.value = endTime;
      emit("changeSelect", [startTime, endTime]);
    };
    const handleEmit = () => {
      emit("changeSelect", [thisStartTime.value, thisEndTime.value]);
    };
    const pickerOptions = {
      disabledDate(time) {
        if (!props.invalidTime) {
          return false;
        }
        if (props.invalidTimeDirection === "old") {
          return time.getTime() > new Date(props.invalidTime).getTime();
        } else {
          return time.getTime() < new Date(props.invalidTime).getTime();
        }
      },
    };
    onMounted(() => {
      if (props.defaultCurDate) {
        let now = Date.now();
        let curDate = new Date(
          new Date(now).toLocaleDateString() + " 00:00:00"
        );
        time.value = curDate;
        now && timeChange(curDate);
      }
    });
    return {
      isEn,
      time,
      timeChange,
      pickerOptions,
      handleEmit,
    };
  },
};
</script>
