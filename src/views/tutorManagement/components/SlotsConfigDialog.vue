<template>
  <div class="slots-type-warp">
    <el-dialog
      :title="
        $t('设置slot类型') +
        '-' +
        Filters.getSubjectLabel(businessLine - 1, isEn ? 'en' : 'zh')
      "
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      width="60%"
      top="5vh"
      :before-close="handleClose"
      center
    >
      <div>
        <el-form
          :label-width="isEn ? '145px' : '80px'"
          :inline="true"
          :style="
            isEn
              ? 'width: 800px; margin: 0 auto'
              : 'width: 500px; margin: 0 auto'
          "
        >
          <el-form-item :label="$t('教师')">
            <FilterByTeacher
              :businessLine="businessLine"
              @change="onUserChange"
              ref="FilterByTeacher"
            />
          </el-form-item>
          <br />
          <el-form-item :label="$t('开放状态')">
            <span v-if="!teacher.hide&&teacher.hide!==0">-</span>
            <div v-else>
              {{ $t(Filters.getOpenTxt(teacher.hide)) }}
              <span class="tips" v-show="teacher.hide === 1">{{
                $t("注：仅试听的老师无法设置仅正式的slots")
              }}</span>
              <span class="tips" v-show="teacher.hide === 2">{{
                $t("注：仅正式的老师无法设置仅试听的slots")
              }}</span>
              <span class="tips" v-show="teacher.hide === 3">{{
                $t("注：全部不可教的老师无法设置slots")
              }}</span>
            </div>
          </el-form-item>
          <br />
          <el-form-item :label="$t('日期')">
            <FilterByTimePeriod
              style="width: 345px"
              :isInvalidPastTime="true"
              @changeSelect="
                (timeArr) => {
                  reqParams.startTime = timeArr[0];
                  reqParams.endTime = timeArr[1];
                }
              "
              :defaultTimeArr="defaultTimeArr"
            />
          </el-form-item>
          <el-form-item :label="$t('Slot类型')">
            <el-radio-group v-model="reqParams.slotType">
              <el-radio
                :disabled="teacher.hide == 2 || teacher.hide == 3"
                :label="1"
                >{{ $t("仅试听") }}</el-radio
              >
              <el-radio
                :disabled="teacher.hide == 1 || teacher.hide == 3"
                :label="2"
                >{{ $t("仅正式") }}</el-radio
              >
              <el-radio :disabled="teacher.hide == 3" :label="3">{{
                $t("全部可教（试听/正式）")
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('Slot范围')">
            <div>{{ $t("注：此处按照北京时间展示") }}</div>
            <div v-for="(item, index) in weekList" :key="item.timeLabel">
              <span
                :style="`display: inline-block; text-align: right; width: ${
                  isEn ? '90px' : ''
                }`"
                >{{ $t(item.timeLabel) }}：</span
              >
              <SlotsForDay
                style="display: inline-block"
                :ref="`SlotsForDay${index}`"
                @changeSelect="
                  (val) => {
                    changeSlotsForDay(val, index);
                  }
                "
              />
              <div
                :style="`margin-left: ${isEn ? '88px' : '40px'}`"
                class="mb10"
              >
                <el-tag
                  v-for="(slot, slotIndex) in item.times"
                  style="margin-left: 4px; margin-bottom: 3px"
                  :key="slot"
                  closable
                  size="mini"
                  type="success"
                  @close="deleteTag(slot, index)"
                >
                  {{ slot }}
                </el-tag>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t("取消") }}</el-button>
        <el-button
          :disabled="
            !reqParams.startTime ||
            !reqParams.tutorUserId ||
            !reqParams.slotType
          "
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          >{{ $t("保存") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "@vue/composition-api";
import FilterByTeacher from "@/components/FilterItem/UserDimensionFilter/FilterByTeacher";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import SlotsForDay from "./SlotsForDay.vue";
export default {
  props: {
    dialogVisible: { type: Boolean, default: false },
    tutorContractList: { type: Array, default: () => [] },
    businessLine: {
      type: Number,
      default: 1,
    },
  },
  components: { FilterByTeacher, FilterByTimePeriod, SlotsForDay },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const teacher = ref({});
    const weekList = ref([]);
    function generateWeekData() {
      const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      return weekDays.map((day) => ({
        timeLabel: day,
        times: [], // 可以填充时间数据
      }));
    }
    onMounted(() => {
      weekList.value = generateWeekData();
    });
    const onUserChange = (val) => {
      reqParams.value.tutorUserId = val.id;
      teacher.value = val;
      switch (val.hide) {
        case 0:
          reqParams.value.slotType = 3;
          break;
        case 1:
          reqParams.value.slotType = 1;
          break;
        case 2:
          reqParams.value.slotType = 2;
          break;
      }
    };
    const handleClose = () => {
      emit("update:dialogVisible", false);
    };
    const reqParams = ref({
      startTime: "",
      endTime: "",
      slotType: null,
      tutorUserId: "",
    });
    const defaultTimeArr = ref([]);
    const changeSlotsForDay = (val, index) => {
      weekList.value[index].times = val;
    };

    const deleteTag = (slot, index) => {
      refs[`SlotsForDay${index}`][0].delSelected(slot);
    };

    const loading = ref(false);
    const dayMap = {
      周一: "slotTimeMon",
      周二: "slotTimeTue",
      周三: "slotTimeWed",
      周四: "slotTimeThu",
      周五: "slotTimeFri",
      周六: "slotTimeSat",
      周日: "slotTimeSun",
    };
    const handleSubmit = async () => {
      const result = weekList.value.reduce((acc, item) => {
        const key = dayMap[item.timeLabel];
        if (key) {
          acc[key] = item.times;
        }
        return acc;
      }, {});
      try {
        loading.value = true;
        let params = {
          ...result,
          ...reqParams.value,
        };
        await root.$Api.tutorManagement.reqSetSlotConfig(params);
        root.$notify.success(root.$t("操作成功"));
        handleClose();
        emit("refreshList");
      } finally {
        loading.value = false;
      }
    };

    return {
      handleClose,
      isEn,
      onUserChange,
      teacher,
      reqParams,
      defaultTimeArr,
      weekList,
      changeSlotsForDay,
      deleteTag,
      handleSubmit,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.slots-type-warp {
  padding: 20px 15px 0;
  .tips {
    color: #bebebe;
    font-size: 12px;
  }
}
</style>
