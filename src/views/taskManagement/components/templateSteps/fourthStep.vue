<template>
  <!-- 任务简介 -->
  <div class="task-fourth-step-warp">
    <div class="title">{{ $t("任务完成条件") }}</div>
    <div class="box-card">
      <div class="form-warp">
        <el-form
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="fourthFormState"
          label-width="110px"
        >
          <el-form-item :label="$t('完成时限')" prop="timeLimitMode">
            <el-radio-group
              :disabled="editType === 'edit'"
              @change="
                () => {
                  fourthFormState.eventType = '';
                }
              "
              v-model="fourthFormState.timeLimitMode"
            >
              <el-radio :label="1">{{ $t("固定时长") }} </el-radio>
              <el-radio :label="2">{{ $t("固定到日期") }}</el-radio>
            </el-radio-group>
            <template v-if="fourthFormState.timeLimitMode == '1'">
              <div class="item">
                <span class="item-title">{{ $t("超时时间") }}:</span>
                <el-input-number
                  :disabled="editType === 'edit'"
                  :min="0"
                  v-model="fourthFormState.fixedDurationTimeoutValue"
                  :step="1"
                  step-strictly
                ></el-input-number>
                <el-select
                  :disabled="editType === 'edit'"
                  v-model="fourthFormState.fixedDurationTimeoutUnit"
                  filterable
                  clearable
                  :placeholder="$t('请选择')"
                >
                  <el-option
                    v-for="item in getTimeUnitList(isEn)"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="item">
                <span class="item-title">{{ $t("失效时间") }}:</span>
                <el-input-number
                  :disabled="editType === 'edit'"
                  :min="0"
                  v-model="fourthFormState.fixedDurationExpirationValue"
                  :step="1"
                  step-strictly
                ></el-input-number>
                <el-select
                  :disabled="editType === 'edit'"
                  v-model="fourthFormState.fixedDurationExpirationUnit"
                  filterable
                  clearable
                  :placeholder="$t('请选择')"
                >
                  <el-option
                    v-for="item in getTimeUnitList(isEn)"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </template>
            <template v-if="fourthFormState.timeLimitMode == '2'">
              <div class="item mt10">
                <span class="item-title">{{ $t("时区") }}:</span>
                <FilterByTimeZone
                  :disabled="editType === 'edit'"
                  style="width: 120px"
                  :initVal="fourthFormState.fixedExpirationTimeZone"
                  @changeSelect="
                    (val) => {
                      fourthFormState.fixedExpirationTimeZone = val;
                    }
                  "
                />
              </div>
              <div class="item">
                <span class="item-title">{{ $t("超时时间") }}:</span>
                <el-date-picker
                  :disabled="editType === 'edit'"
                  :picker-options="pickerOptions"
                  v-model="fourthFormState.fixedExpirationTimeout"
                  :default-value="new Date(Date.now())"
                  type="datetime"
                  :placeholder="$t('请选择')"
                >
                </el-date-picker>
              </div>
              <div class="item">
                <span class="item-title">{{ $t("失效时间") }}:</span>
                <el-date-picker
                  :disabled="editType === 'edit'"
                  :picker-options="pickerOptions"
                  v-model="fourthFormState.fixedExpirationTime"
                  :default-value="new Date(Date.now())"
                  type="datetime"
                  :placeholder="$t('请选择')"
                >
                </el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item :label="$t('正常完成要求')" prop="normalCompleteConfig">
            <div class="item">
              <span class="item-title">{{ $t("沟通方式") }}:</span>
              <el-tooltip effect="light" placement="top-start">
                <span slot="content">
                  {{ $t("不同沟通方式可以关联记录的方式：") }}<br />
                  {{
                    $t(
                      "打电话：支持关联企业微信通话、关联Aircall通话、上传图片"
                    )
                  }}<br />
                  {{ $t("发消息：支持关联企业微信会话、上传图片") }}<br />
                  {{ $t("发邮件：仅支持上传图片") }}<br />
                </span>
                <i style="color: #d8d8d8" class="el-icon-question"></i>
              </el-tooltip>
              <el-checkbox-group
                :disabled="editType === 'edit'"
                style="display: inline"
                v-model="
                  fourthFormState.normalCompleteConfig.contactInformation
                "
              >
                <el-checkbox label="1">{{ $t("打电话") }}</el-checkbox>
                <el-checkbox label="2">{{ $t("发消息") }}</el-checkbox>
                <el-checkbox label="3">{{ $t("发邮件") }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="item">
              <span class="item-title">{{ $t("是否需要关联沟通记录") }}:</span>
              <el-radio-group
                :disabled="editType === 'edit'"
                v-model="fourthFormState.normalCompleteConfig.associatedRecord"
              >
                <el-radio :label="1">{{ $t("是") }} </el-radio>
                <el-radio :label="2">{{ $t("否") }}</el-radio>
              </el-radio-group>
            </div>
            <div class="item">
              <span class="item-title">{{ $t("完成方式") }}:</span>
              <el-radio-group
                v-model="
                  fourthFormState.normalCompleteConfig.taskCompletionType
                "
              >
                <el-radio :label="1">{{ $t("Follow Up") }} </el-radio>
                <el-radio :label="2">{{ $t("和用户（家长）建联成功") }}</el-radio>
              </el-radio-group>
              <br />
              <ChooseField
              v-if="fourthFormState.normalCompleteConfig.taskCompletionType !== 2"
                ref="chooseFieldNormal"
                myClassName="normal-complete-config"
                @changeSelect="
                  (list) => {
                    fourthFormState.normalCompleteConfig.formItemList = list;
                    validateChooseFiled('normalCompleteConfig');
                  }
                "
              />
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('异常完成要求')"
            prop="abnormalCompleteConfig"
          >
            <el-checkbox
              :disabled="editType === 'edit'"
              @change="
                () => {
                  clearFieldValidate('abnormalCompleteConfig');
                }
              "
              v-model="showAbnormal"
            ></el-checkbox>
            <div v-show="showAbnormal">
              <div class="item">
                <span class="item-title">{{ $t("沟通方式") }}:</span>
                <el-tooltip effect="light" placement="top-start">
                  <span slot="content">
                    {{ $t("不同沟通方式可以关联记录的方式：") }}<br />
                    {{
                      $t(
                        "打电话：支持关联企业微信通话、关联Aircall通话、上传图片"
                      )
                    }}<br />
                    {{ $t("发消息：支持关联企业微信会话、上传图片") }}<br />
                    {{ $t("发邮件：仅支持上传图片") }}<br />
                  </span>
                  <i style="color: #d8d8d8" class="el-icon-question"></i>
                </el-tooltip>
                <el-checkbox-group
                  :disabled="editType === 'edit'"
                  style="display: inline"
                  v-model="
                    fourthFormState.abnormalCompleteConfig.contactInformation
                  "
                >
                  <el-checkbox label="1">{{ $t("打电话") }}</el-checkbox>
                  <el-checkbox label="2">{{ $t("发消息") }}</el-checkbox>
                  <el-checkbox label="3">{{ $t("发邮件") }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="item">
                <span class="item-title"
                  >{{ $t("是否需要关联沟通记录") }}:</span
                >
                <el-radio-group
                  :disabled="editType === 'edit'"
                  v-model="
                    fourthFormState.abnormalCompleteConfig.associatedRecord
                  "
                >
                  <el-radio :label="1">{{ $t("是") }} </el-radio>
                  <el-radio :label="2">{{ $t("否") }}</el-radio>
                </el-radio-group>
              </div>
              <div class="item">
                <span class="item-title">{{ $t("完成方式") }}:</span>
                <el-radio-group
                  v-model="
                    fourthFormState.abnormalCompleteConfig.taskCompletionType
                  "
                >
                  <el-radio :label="1">{{ $t("Follow Up") }} </el-radio>
                </el-radio-group>
                <br />
                <ChooseField
                  ref="chooseFieldAbnormal"
                  myClassName="abnormal-complete-config"
                  @changeSelect="
                    (list) => {
                      fourthFormState.abnormalCompleteConfig.formItemList =
                        list;
                      validateChooseFiled('abnormalCompleteConfig');
                    }
                  "
                />
              </div>
            </div>
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
import { getTimeUnitList } from "../../dataConfig/constant";
import FilterByTimeZone from "@/components/FilterItem/CommodityFilter/FilterByTimeZone";
import ChooseField from "../chooseField.vue";
import { deepClone } from "../../../../utils/handleData";

export default {
  components: { FilterByTimeZone, ChooseField },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    let fourthFormState = ref({
      timeLimitMode: 1,
      fixedDurationTimeoutValue: "",
      fixedDurationTimeoutUnit: "",
      fixedDurationExpirationValue: "",
      fixedDurationExpirationUnit: "",
      fixedExpirationTimeZone: "",
      fixedExpirationTimeout: "",
      fixedExpirationTime: "",
      normalCompleteConfig: {
        contactInformation: [],
        associatedRecord: 1,
        taskCompletionType: 1,
        formItemList: [],
      },
      abnormalCompleteConfig: {
        contactInformation: [],
        associatedRecord: 1,
        taskCompletionType: 1,
        formItemList: [],
      },
      completeConfigList: [],
    });
    const showAbnormal = ref(false);
    const validateNormalCompleteConfig = async (rule, value, callback) => {
      const normalConfig = fourthFormState.value.normalCompleteConfig;
      if (!normalConfig.contactInformation.length)
        callback(new Error(root.$t("请选择沟通方式")));
      let flag = normalConfig.formItemList?.length;
      if (!flag && normalConfig.taskCompletionType !== 2) callback(new Error(root.$t("请添加字段")));
    };
    const validateAbnormalCompleteConfig = async (rule, value, callback) => {
      if (
        !fourthFormState.value.abnormalCompleteConfig.contactInformation.length
      )
        callback(new Error(root.$t("请选择沟通方式")));
      let flag =
        fourthFormState.value.abnormalCompleteConfig.formItemList.length;
      if (!flag) callback(new Error(root.$t("请添加字段")));
    };
    const validateTimeLimitMode = async (rule, value, callback) => {
      let flag = false;
      if (value == "1") {
        flag =
          fourthFormState.value.fixedDurationTimeoutValue &&
          fourthFormState.value.fixedDurationTimeoutUnit &&
          fourthFormState.value.fixedDurationExpirationValue &&
          fourthFormState.value.fixedDurationExpirationUnit;
        let timeout =
          fourthFormState.value.fixedDurationTimeoutUnit == 1
            ? fourthFormState.value.fixedDurationTimeoutValue
            : fourthFormState.value.fixedDurationTimeoutValue * 24;
        let expiration =
          fourthFormState.value.fixedDurationExpirationUnit == 1
            ? fourthFormState.value.fixedDurationExpirationValue
            : fourthFormState.value.fixedDurationExpirationValue * 24;
        if (!flag) callback(new Error(root.$t("请完善完成时限")));
        if (timeout > expiration) {
          callback(new Error(root.$t("失效时间必须大于等于超时时间")));
        }
      }
      if (value == "2") {
        flag =
          fourthFormState.value.fixedExpirationTimeZone &&
          fourthFormState.value.fixedExpirationTimeout &&
          fourthFormState.value.fixedExpirationTime;
        if (!flag) callback(new Error(root.$t("请完善完成时限")));
        if (
          !isIsoDate(fourthFormState.value.fixedExpirationTimeout) &&
          !isIsoDate(fourthFormState.value.fixedExpirationTime)
        ) {
          if (
            fourthFormState.value.fixedExpirationTimeout.getTime() >
            fourthFormState.value.fixedExpirationTime.getTime()
          ) {
            callback(new Error(root.$t("失效时间必须大于等于超时时间")));
          }
        }
      }
    };
    const rules = reactive({
      timeLimitMode: {
        required: true,
        validator: validateTimeLimitMode,
        trigger: "change",
      },
      normalCompleteConfig: {
        required: true,
        validator: validateNormalCompleteConfig,
        trigger: "change",
      },
      abnormalCompleteConfig: {
        required: false,
        trigger: "change",
      },
    });
    watch(
      () => showAbnormal.value,
      (val) => {
        rules.abnormalCompleteConfig = val
          ? {
              required: true,
              validator: validateAbnormalCompleteConfig,
              trigger: "change",
            }
          : {
              required: false,
              trigger: "change",
            };
      }
    );
    const finalData = ref({});
    const reset = () => {
      refs["myForm"].resetFields();
      fourthFormState.value = {
        timeLimitMode: 1,
        fixedDurationTimeoutValue: "",
        fixedDurationTimeoutUnit: "",
        fixedDurationExpirationValue: "",
        fixedDurationExpirationUnit: "",
        fixedExpirationTimeZone: "",
        fixedExpirationTimeout: "",
        fixedExpirationTime: "",
        normalCompleteConfig: {
          contactInformation: [],
          associatedRecord: 1,
          taskCompletionType: 1,
          formItemList: [],
        },
        abnormalCompleteConfig: {
          contactInformation: [],
          associatedRecord: 1,
          taskCompletionType: 1,
          formItemList: [],
        },
        completeConfigList: [],
      };
      const chooseFieldNormalRef = refs.chooseFieldNormal;
      if (chooseFieldNormalRef) {
        chooseFieldNormalRef.selectTableState.data = [];
        chooseFieldNormalRef.fieldList = [];
        chooseFieldNormalRef.fieldList.length = 0;
        chooseFieldNormalRef.dialogVisible = false;
        chooseFieldNormalRef.handelClearSelect();
      }
      if (showAbnormal.value) {
        refs.chooseFieldAbnormal.selectTableState.data = [];
        refs.chooseFieldAbnormal.fieldList = [];
        refs.chooseFieldAbnormal.fieldList.length = 0;
        refs.chooseFieldAbnormal.dialogVisible = false;
        refs.chooseFieldAbnormal.handelClearSelect();
      }
    };
    const isIsoDate = (str) => {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
      var d = new Date(str);
      return d.toISOString() === str;
    };

    const nextStep = async () => {
      finalData.value = deepClone(fourthFormState.value);
      let normalCompleteConfig = finalData.value.normalCompleteConfig;
      let abnormalCompleteConfig = finalData.value.abnormalCompleteConfig;
      /* 完成类型（1-正常 2-异常） */
      normalCompleteConfig.completeType = 1;
      normalCompleteConfig.contactInformation =
        normalCompleteConfig.contactInformation.join(",");
      finalData.value.completeConfigList[0] = normalCompleteConfig;
      if (showAbnormal.value) {
        abnormalCompleteConfig.completeType = 2;
        abnormalCompleteConfig.contactInformation =
          abnormalCompleteConfig.contactInformation.join(",");
        finalData.value.completeConfigList[1] = abnormalCompleteConfig;
      } else {
        finalData.value.completeConfigList.splice(1, 1);
      }
      delete finalData.value.normalCompleteConfig;
      delete finalData.value.abnormalCompleteConfig;
      /* 切换完成时限,删除不必要参数 */
      if (finalData.value.timeLimitMode == 1) {
        delete finalData.value.fixedExpirationTimeZone;
        delete finalData.value.fixedExpirationTimeout;
        delete finalData.value.fixedExpirationTime;
      } else {
        delete finalData.value.fixedDurationTimeoutUnit;
        delete finalData.value.fixedDurationTimeoutValue;
        delete finalData.value.fixedDurationExpirationUnit;
        delete finalData.value.fixedDurationExpirationValue;
      }
      if (
        finalData.value.fixedExpirationTime &&
        !isIsoDate(finalData.value.fixedExpirationTime)
      ) {
        finalData.value.fixedExpirationTime =
          finalData.value.fixedExpirationTime.toISOString();
      }
      if (
        finalData.value.fixedExpirationTimeout &&
        !isIsoDate(finalData.value.fixedExpirationTimeout)
      ) {
        finalData.value.fixedExpirationTimeout =
          finalData.value.fixedExpirationTimeout.toISOString();
      }
      await refs["myForm"].validate();
      emit("toNextStep");
    };
    const preStep = async () => {
      emit("toPreStep");
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
    watch(
      () => fourthFormState.value.fixedExpirationTimeout,
      (val) => {
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
    );
    watch(
      () => fourthFormState.value.fixedExpirationTime,
      (val) => {
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
    );
    const isToday = (date) => {
      const today = new Date();
      return (
        date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()
      );
    };
    /* 手动触发添加字段校验 */
    const validateChooseFiled = (props) => {
      refs.myForm.validateField(props);
    };
    /* 手动清除field校验 */
    const clearFieldValidate = (props) => {
      refs.myForm.clearValidate(props);
    };

    onMounted(() => {});
    return {
      isEn,
      editType: root.$route.query.type,
      fourthFormState,
      rules,
      pickerOptions,
      showAbnormal,
      finalData,
      nextStep,
      preStep,
      getTimeUnitList,
      reset,
      validateChooseFiled,
      clearFieldValidate,
    };
  },
};
</script>
<style lang="scss" scoped>
.task-fourth-step-warp {
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
      .item {
        margin-bottom: 10px;
        .item-title {
          color: #444444;
        }
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
  .w200 {
    width: 200px;
  }
  .w375 {
    width: 375px;
  }
}
</style>
