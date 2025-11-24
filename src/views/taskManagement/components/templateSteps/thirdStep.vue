<template>
  <!-- 任务简介 -->
  <div class="task-third-step-warp">
    <div class="title">{{ $t("任务生成条件") }}</div>
    <div class="box-card">
      <div class="form-warp">
        <el-form
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="thirdFormState"
          label-width="100px"
        >
          <el-form-item :label="$t('触发类型')" prop="triggerType">
            <el-radio-group
              :disabled="editType === 'edit'"
              @change="
                (val) => {
                  thirdFormState.eventType = '';
                  clearValidate();
                  if (val == 1) {
                    thirdFormState.cycleTimeZone = '';
                    thirdFormState.cycleTime = '';
                    thirdFormState.cycleDimension = '';
                    thirdFormState.cycleDay = '';
                  }
                }
              "
              v-model="thirdFormState.triggerType"
            >
              <el-radio :label="1" v-show="watchRoleType !== 3"
                >{{ $t("事件触发") }}
                <span class="tips">({{ $t("长期任务") }})</span></el-radio
              >
              <el-radio :label="2">{{ $t("时间触发") }}</el-radio>
            </el-radio-group>
            <div class="tips">
              {{
                thirdFormState.triggerType == 1
                  ? $t("当以下事件发生时，自动生成任务")
                  : $t("规定时间满足以下条件的用户，自动生成任务")
              }}
            </div>
          </el-form-item>
          <template v-if="thirdFormState.triggerType == 1">
            <el-form-item :label="$t('事件类型')" prop="eventType">
              <el-select
                :disabled="editType === 'edit'"
                v-model="thirdFormState.eventType"
                filterable
                clearable
                :placeholder="$t('请选择')"
                @change="
                  () => {
                    thirdFormState.event = '';
                  }
                "
              >
                <el-option
                  v-for="item in getEventTypeList(isEn)"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('具体事件')"
              prop="event"
              v-show="thirdFormState.eventType !== ''"
            >
              <el-select
                :disabled="editType === 'edit'"
                v-model="thirdFormState.event"
                filterable
                clearable
                :placeholder="$t('请选择')"
              >
                <el-option
                  v-for="item in getEventList(isEn)"
                  v-show="item.eventType === thirdFormState.eventType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="thirdFormState.triggerType == 2">
            <el-form-item :label="$t('时间')" prop="circulationMode">
              <el-radio-group
                @change="
                  (val) => {
                    thirdFormState.cycleTimeZone = '';
                    thirdFormState.cycleTime = '';
                    clearFieldValidate('cycleTimeZone');
                    clearFieldValidate('cycleDimension');
                    if (val == 2) {
                      thirdFormState.cycleDimension = '';
                      thirdFormState.cycleDay = '';
                    }
                  }
                "
                v-model="thirdFormState.circulationMode"
              >
                <el-radio :label="1"
                  >{{ $t("循环时间") }}
                  <span class="tips">({{ $t("长期任务") }})</span></el-radio
                >
                <el-radio :label="2"
                  >{{ $t("单一时间")
                  }}<span class="tips">({{ $t("一次性任务") }})</span></el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('时区')" prop="cycleTimeZone">
              <FilterByTimeZone
                class="w120"
                :initVal="thirdFormState.cycleTimeZone"
                @changeSelect="
                  (val) => {
                    thirdFormState.cycleTimeZone = val;
                  }
                "
              />
            </el-form-item>
            <el-form-item
              v-if="thirdFormState.circulationMode == '1'"
              :label="$t('具体时间')"
              key="cycleDimension1"
              prop="cycleDimension"
            >
              <el-select
                class="w120"
                v-model="thirdFormState.cycleDimension"
                filterable
                clearable
                :placeholder="$t('请选择')"
                @change="
                  () => {
                    thirdFormState.cycleDay = '';
                    thirdFormState.cycleTime = '';
                  }
                "
              >
                <el-option
                  v-for="item in getTimeSpanList(isEn)"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-if="thirdFormState.cycleDimension !== 0"
                class="w120"
                v-model="thirdFormState.cycleDay"
                filterable
                clearable
                :placeholder="$t('请选择')"
                @change="
                  () => {
                    thirdFormState.event = '';
                  }
                "
              >
                <el-option
                  v-for="item in thirdFormState.cycleDimension ==
                  TIME_SPAN_WEEKS
                    ? getWeekList(isEn)
                    : getMounthList()"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-time-picker
                value-format="HH:mm:ss"
                v-model="thirdFormState.cycleTime"
                :placeholder="$t('请选择')"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item
              v-if="thirdFormState.circulationMode == '2'"
              :label="$t('具体时间')"
              key="cycleDimension2"
              prop="cycleDimension"
            >
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                :default-value="new Date(Date.now())"
                v-model="thirdFormState.cycleTime"
                type="datetime"
                :placeholder="$t('请选择')"
              >
              </el-date-picker>
            </el-form-item>
          </template>
          <el-form-item
            v-if="watchRoleType !== 3"
            :label="$t('特殊条件')"
            prop="specialConditionList"
          >
            <div class="mb10">
              <el-switch
                :active-value="2"
                :inactive-value="1"
                v-model="thirdFormState.specialCondition"
                @change="
                  () => {
                    thirdFormState.specialConditionList = [];
                  }
                "
              >
              </el-switch>
              <span class="tips">
                {{ $t("当存在以下任务未完成时，不会产生本任务") }}
              </span>
            </div>
            <el-select
              v-show="thirdFormState.specialCondition == 2"
              v-model="thirdFormState.specialConditionList"
              key="specialConditionList"
              filterable
              clearable
              multiple
              :placeholder="$t('请选择')"
            >
              <el-option
                v-for="item in taskTemplateList"
                :key="item.id"
                :label="isEn ? item.taskNameEn : item.taskNameCn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="fix-footer">
        <el-button
          style="width: 108px"
          :loading="loading"
          @click="preStep"
          class="submit-btn"
          type="primary"
          >{{ $t("上一步") }}</el-button
        >
        <el-button
          style="width: 108px"
          :loading="loading"
          @click="nextStep"
          class="submit-btn"
          type="primary"
          >{{ $t("下一步") }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  onMounted,
  ref,
  reactive,
  computed,
  watch,
} from "@vue/composition-api";
import { TIME_SPAN_WEEKS } from "../../dataConfig/enum";
import {
  getEventTypeList,
  getEventList,
  getTimeSpanList,
  getWeekList,
  getMounthList,
} from "../../dataConfig/constant";
import FilterByTimeZone from "@/components/FilterItem/CommodityFilter/FilterByTimeZone";
import { deepClone } from "../../../../utils/handleData";
import { watchRoleType } from "./watchParams";

export default {
  components: { FilterByTimeZone },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const thirdFormState = ref({
      triggerType: 1 /* 触发类型 */,
      eventType: "",
      event: "",
      specialCondition: 1,
      specialConditionList: [],
      circulationMode: 1,
      cycleTimeZone: "",
      cycleDay: "",
      cycleTime: "",
    });
    const validateCycleDimension = async (rule, value, callback) => {
      let flag = false;
      if (thirdFormState.value.circulationMode == 1) {
        if (thirdFormState.value.cycleDimension === 0) {
          flag = thirdFormState.value.cycleTime;
        } else {
          flag =
            thirdFormState.value.cycleDay && thirdFormState.value.cycleTime;
        }
      }
      if (thirdFormState.value.circulationMode == 2) {
        flag = thirdFormState.value.cycleTime;
      }
      if (!flag) callback(new Error(root.$t("请完善具体时间")));
    };
    const rules = reactive({
      triggerType: {
        required: true,
      },
      event: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      eventType: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      circulationMode: {
        required: true,
      },
      cycleTimeZone: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      cycleDimension: {
        required: true,
        validator: validateCycleDimension,
        trigger: "change",
      },
      specialConditionList: "",
    });
    watch(
      () => thirdFormState.value.specialCondition,
      (val) => {
        refs.myForm.clearValidate("specialConditionList");
        rules.specialConditionList =
          val === 2
            ? {
                required: true,
                message: root.$t("请选择"),
                trigger: "change",
              }
            : {
                required: false,
                trigger: "change",
              };
      }
    );

    const finalData = ref({});
    const nextStep = async () => {
      await refs["myForm"].validate();
      finalData.value = deepClone(thirdFormState.value);
      emit("toNextStep");
    };
    const preStep = async () => {
      emit("toPreStep");
    };
    const taskTemplateList = ref([]);
    const reqList = async () => {
      try {
        const res = await root.$Api.taskManagement.reqTaskTemplateList(
          /* 已经启用的任务模板 enable：1 */ {
            pageNum: 1,
            pageSize: 100,
            enable: "",
          }
        );
        taskTemplateList.value = res.list || [];
      } catch {
        taskTemplateList.value = [];
      }
    };
    watch(
      () => thirdFormState.value.cycleTime,
      (val) => {
        if (val && val.length > 8) {
          /* yyyy-MM-dd HH:mm:ss时间选择器要设置当天不能选取过去时间 */
          if (isToday(new Date(val))) {
            let data = new Date();
            let hour = data.getHours();
            let minute = data.getMinutes();
            let second = data.getSeconds();
            pickerOptions.selectableRange = [
              `${hour}:${minute}:${second} - 23:59:59`,
            ];
          } else {
            pickerOptions.selectableRange = "00:00:00 - 23:59:59";
          }
        }
      }
    );
    const isToday = (date) => {
      const today = new Date();
      return (
        date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()
      );
    };
    const pickerOptions = reactive({
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
      },
      selectableRange: (() => {
        let data = new Date();
        let hour = data.getHours();
        let minute = data.getMinutes();
        let second = data.getSeconds();
        return [`${hour}:${minute}:${second} - 23:59:59`];
      })(),
    });
    const reset = () => {
      refs["myForm"].resetFields();
      thirdFormState.value.circulationMode = 1;
      thirdFormState.value.cycleDay = "";
      thirdFormState.value.cycleTime = "";
    };
    const clearValidate = () => {
      refs.myForm.clearValidate();
    };

    onMounted(() => {
      reqList();
    });
    watch(
      () => watchRoleType.value,
      (val) => {
        thirdFormState.value.triggerType = 2;
      }
    );
    /* 手动清除field校验 */
    const clearFieldValidate = (props) => {
      refs.myForm.clearValidate(props);
    };
    return {
      isEn,
      editType: root.$route.query.type,
      thirdFormState,
      rules,
      taskTemplateList,
      TIME_SPAN_WEEKS,
      pickerOptions,
      finalData,
      nextStep,
      preStep,
      getEventTypeList,
      getEventList,
      getTimeSpanList,
      getWeekList,
      getMounthList,
      reset,
      clearValidate,
      clearFieldValidate,
      watchRoleType: watchRoleType,
    };
  },
};
</script>
<style lang="scss" scoped>
.task-third-step-warp {
  margin-top: 20px;

  .box-card {
    position: relative;
    background: #f9f9ff;
    padding: 20px 0 50px 20px;
    border-radius: 6px;
    overflow: hidden;

    .form-warp {
      overflow: scroll;
      height: calc(100vh - 350px);

      .tips {
        color: #bebebe;
      }

      .w120 {
        width: 120px;
      }
    }

    .fix-footer {
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      height: 50px;
      background: #f4f6f9;
      text-align: center;
      line-height: 50px;
    }
  }

  .title {
    color: #7580e5;
    border-left: 2px solid #a0a7e6;
    padding-left: 6px;
    margin-bottom: 10px;
    font-size: 14px;
  }
}
</style>
