<template>
  <el-popover
    placement="right"
    v-model="show"
    width="400"
    @after-leave="handleClose"
    trigger="click"
  >
    <div>
      <v-date-picker
        :attributes="attrs"
        :min-date="new Date(minStartTime)"
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
              $t("上课时间")
            }}</span>
            <el-time-select
              @change="handleTimeChange"
              style="margin: 0 20px 20px 20px"
              v-model="myTime"
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
    <el-tag style="cursor: pointer" slot="reference">{{
      myDate ? `${myDate} ${myTime}` : $t("请选择日期时间")
    }}</el-tag>
  </el-popover>
</template>

<script>
import { ref, computed, onMounted, watch } from "@vue/composition-api";
import moment from "moment";

export default {
  props: {
    key: {
      type: Number,
      default: -1,
    },
    minStartTime: {
      type: String,
      default: "",
    },
  },
  setup(props, { root, emit, refs }) {

    // props.minStartTime = new Date().toISOString();
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const limitTime = ref("");
    const initLimitTime = () => {
      if (myDate.value === moment(props.minStartTime).format("YYYY-MM-DD")) {
        limitTime.value = moment(props.minStartTime).format("HH:mm");
      } else {
        limitTime.value = "";
      }
    };

    const initMyDate = () => {
      if (myDate.value === moment(props.minStartTime).format("YYYY-MM-DD")) {
        let thirtyMinutesAfter = moment(props.minStartTime)
          .add(30, "minutes")
          .toISOString();
        myTime.value = moment(thirtyMinutesAfter).format("HH:mm");
      } else {
        myTime.value = "00:00";
      }
    };
    const myDate = ref("");
    const myTime = ref("00:00");
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
    const handleDateChange = (_,flag) => {
      if (myDateModel.value) {
        myDate.value = moment(myDateModel.value).format("YYYY-MM-DD");
      }
      if (!flag) {
        initMyDate();
      }
      initLimitTime();
      emit(
        "onSelectDateTime",
        moment(`${myDate.value} ${myTime.value}`).toISOString()
      );
    };
    const handleTimeChange = (value) => {
      myTime.value = value;
      if (myDate.value) {
        show.value = false;
      }
    };
    const handleClose = () => {
      if (myDate.value) {
        emit(
          "onSelectDateTime",
          moment(`${myDate.value} ${myTime.value}`).toISOString()
        );
      }
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
    return {
      isEn,
      myDate,
      myTime,
      timeOptions,
      show,
      handleDateChange,
      handleTimeChange,
      attrs,
      masks,
      handleClose,
      limitTime,
      myDateModel,
    };
  },
};
</script>
<style lang="scss">
.italic {
  font-style: italic;
}
</style>
