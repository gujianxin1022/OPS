<template>
  <div class="filter-by-week">
    <div @click="handleFocus" class="my-week-input">
      <i class="el-icon-date" style="color: #c0c4cc"></i>
      {{ showDateStr }}
    </div>
    <el-date-picker
      ref="eldatepicker"
      class="my-week-r-input"
      v-model="dateRange"
      style="height: 0px !important; overflow: hidden"
      type="week"
      format="yyyy 第 WW 周"
      placeholder="选择周"
      :picker-options="{
        firstDayOfWeek: 1,
      }"
      @blur="show = false"
      @change="handleCalendarChange"
      :default-value="new Date()"
    >
    </el-date-picker>
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "@vue/composition-api";
import moment from "moment";
export default {
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    let startTime = ref();
    let endTime = ref();
    const dateRange = ref("");
    const showDateStr = ref("");
    const handleCalendarChange = (date) => {
      startTime.value = moment(date).startOf("isoWeek").toDate();
      endTime.value = moment(date).endOf("isoWeek").toDate();
      show.value = false;
      showDateStr.value =
        moment(startTime.value).format("YYYY-MM-DD") +
        " ~ " +
        moment(endTime.value).format("YYYY-MM-DD");
      emit("changeSelect", [startTime.value, endTime.value]);
    };
    const show = ref(false);
    const handleFocus = () => {
      show.value = !show.value;
      show.value && refs.eldatepicker.focus();
    };
    onMounted(() => {
      dateRange.value = new Date();
      handleCalendarChange(dateRange.value);
    });
    return {
      isEn,
      handleCalendarChange,
      dateRange,
      handleFocus,
      startTime,
      endTime,
      show,
      moment,
      showDateStr,
    };
  },
};
</script>
<style lang="scss" scoped>
.filter-by-week {
  .my-week-input {
    width: 230px;
    height: 32px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    border-radius: 4px;
    font-size: 13px;
    color: #606266;
    padding: 0 10px;
    letter-spacing: 1px;
  }
  .my-week-r-input{
       .el-input__inner{
        height: 0px !important;
       } 
  }
}
</style>
