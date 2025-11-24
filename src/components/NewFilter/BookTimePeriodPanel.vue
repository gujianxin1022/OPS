<template>
  <el-popover
    placement="right"
    v-model="show"
    width="auto"
    trigger="click"
  >
    <div>
      <v-date-picker
        :attributes="attrs"
        :min-date="new Date(now)"
        color="indigo"
        is-expanded
        title-position="left"
        mode="date"
        v-model="myDateModel"
        :key="key"
        :model-configks="masks"
        @dayclick="handleDateChange"
        :locale="isEn ? 'en' : 'zh'"
      >
        <template>
          <div slot="footer">
            <span style="margin-left: 20px; color: #606266">{{
              $t("开始时间")
            }}</span>
            <el-time-select
              @change="handleStartTimeChange"
              style="margin: 0 20px 20px 20px"
              v-model="startTime"
              :disabled="!myDate || !myDate.length"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:30',
                minTime: limitTime,
              }"
              :placeholder="$t('选择时间')"
              :clearable="false"
            >
            </el-time-select>
            <br />
            <span style="margin-left: 20px; color: #606266">{{
              $t("结束时间")
            }}</span>
            <el-time-select
              @change="handleEndTimeChange"
              style="margin: 0 20px 20px 20px"
              v-model="endTime"
              :disabled="!myDate || !myDate.length"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:30',
                minTime: limitTime,
              }"
              :placeholder="$t('选择时间')"
              :clearable="false"
            >
            </el-time-select>
          </div>
        </template>
      </v-date-picker>
    </div>
    <el-tag
      closable
      @close="deleteTag"
      style="cursor: pointer"
      slot="reference"
    >
      <span v-if="myDate">
        {{ `${myDate} ${startTime}` }} ~ {{ `${myDate} ${endTime}` }}
      </span>
      <span v-else>{{ $t("请选择日期时间") }}</span>
    </el-tag>
  </el-popover>
</template>
<script>

import { ref, computed } from "@vue/composition-api";
import moment from "moment";

export default {
  props: {
    key: {
      type: Number,
      default: -1,
    },
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const limitTime = ref("");
    let now = moment(root.DateTimeUtils.getNextHalfHour().toISOString())
      .subtract(30, "minutes")
      .toISOString();
    const initLimitTime = () => {
      if (myDate.value === moment(now).format("YYYY-MM-DD")) {
        limitTime.value = moment(now).format("HH:mm");
      } else {
        limitTime.value = "";
      }
    };
    const initMyDate = () => {
      if (myDate.value === moment(now).format("YYYY-MM-DD")) {
        let thirtyMinutesAfter = moment(now).add(30, "minutes").toISOString();
        startTime.value = moment(thirtyMinutesAfter).format("HH:mm");
        endTime.value = moment(thirtyMinutesAfter).format("HH:mm");
      } else {
        startTime.value = "00:00";
        endTime.value = "00:00";
      }
    };
    const myDate = ref("");
    const startTime = ref("00:00");
    const endTime = ref("00:00");
    const show = ref(false);
    const masks = ref({
      type: "string",
      mask: "YYYY-MM-DD",
    });
    const initTimeOptions = () => {
      let options = [];
      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 2; j++) {
          let hour = i < 10 ? "0" + i : i;
          let minute = j == 0 ? "00" : "30";
          let value = hour + ":" + minute;
          options.push({ value: value, label: value });
        }
      }
      return options;
    };
    const timeOptions = initTimeOptions();
    const handleDateChange = (_, flag) => {
      if (myDateModel.value) {
        myDate.value = moment(myDateModel.value).format("YYYY-MM-DD");
      }
      if (!flag) {
        initMyDate();
      }
      initLimitTime();
      emitValueChange();
    };
    const handleStartTimeChange = (value) => {
      startTime.value = value;
      emitValueChange()
    };
    const handleEndTimeChange = (value) => {
      endTime.value = value;
      emitValueChange();
      show.value=false
    };
    const attrs = [
      {
        key: "today",
        highlight: {
          color: "purple",
          fillMode: "outline",
          contentClass: "italic",
        },
        dates: new Date(),
      },
    ];
    const myDateModel = ref("");
    const deleteTag = () => {
      emit("handleDeleTag");
    };
    const emitValueChange = () => {
      emit("onSelectDateTime", {
        minStartTime: moment(
          `${myDate.value} ${startTime.value}`
        ).toISOString(),
        maxStartTime: moment(`${myDate.value} ${endTime.value}`).toISOString(),
      });
    };
    return {
      isEn,
      myDate,
      startTime,
      endTime,
      timeOptions,
      show,
      handleDateChange,
      handleStartTimeChange,
      handleEndTimeChange,
      attrs,
      masks,
      limitTime,
      myDateModel,
      deleteTag,
      now,
    };
  },
};
</script>
<style lang="scss">
.italic {
  font-style: italic;
}
</style>
