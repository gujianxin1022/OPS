<template>
  <!-- 任务简介 -->
  <div class="task-first-step-warp">
    <div class="title">{{ $t("目标用户") }}</div>
    <div class="box-card">
      <div class="form-warp">
        <el-form
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="secondFormState"
          label-width="80px"
        >
          <el-form-item :label="$t('任务对象')" prop="taskTargetType">
            <el-radio-group v-model="secondFormState.taskTargetType">
              <template v-if="watchRoleType !== 3">
                <el-radio :label="1">{{ $t("家长") }}</el-radio>
                <el-radio :label="2">{{ $t("学生") }}</el-radio>
                <el-radio :label="3">{{ $t("课程进度") }}</el-radio>
              </template>
              <template v-else>
                <el-radio :label="4">{{ $t("教师") }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('目标用户')" prop="targetUserRange">
            <el-radio-group v-model="secondFormState.targetUserRange">
              <el-radio v-if="watchRoleType !== 3" :label="1">{{
                $t("全部用户")
              }}</el-radio>
              <el-radio :label="3">{{ $t("自定义上传") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="secondFormState.taskTargetType !== 4">
            <el-form-item :label="$t('基本属性')" prop="basicConditionList">
              <SelectByBaseAttribute ref="basicCondition" />
            </el-form-item>
            <el-form-item
              :label="$t('行为属性')"
              prop="behavioralConditionList"
            >
              <SelectByBehavioralAttribute ref="behavioralCondition" />
            </el-form-item>
          </template>
          <template v-if="secondFormState.targetUserRange == 3">
            <el-form-item :label="$t('上传方式')" prop="uploadType">
              <el-radio-group v-model="uploadType">
                <template v-if="secondFormState.taskTargetType !== 4">
                  <el-radio label="1">{{ $t("按家长ID") }}</el-radio>
                  <el-radio label="2">{{ $t("按学生ID") }}</el-radio>
                </template>
                <template v-if="secondFormState.taskTargetType === 4">
                  <el-radio label="5">{{ $t("按教师ID") }}</el-radio>
                  <el-radio label="6">{{ $t("按学生ID+教师ID") }}</el-radio>
                </template>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('文件上传')" prop="targetUserGroupId">
              <CustomUpload
                ref="CustomUpload"
                @ok="
                  (val) => {
                    secondFormState.targetUserGroupId = val;
                    validateTargetUserGroupId('targetUserGroupId');
                  }
                "
                :type="uploadType"
              />
            </el-form-item>
            <div>
              <span class="tips"
                >{{ $t("仅支持xls、xlsx格式") }},{{ $t("最多1万条") }}</span
              >
              <el-button type="text" v-show="'1,2,5'.includes(uploadType)">
                <a
                  href="https://priv.cdn.lingoace.com/OPS/用户上传模板-Upload template.xlsx"
                  >{{ $t("下载模板") }}</a
                >
              </el-button>
              <el-button v-show="uploadType === '6'" type="text">
                <a
                  href="https://priv.cdn.lingoace.com/OPS/Template(studentIDandteacherID).xlsx"
                  >{{ $t("下载模板") }}</a
                >
              </el-button>
            </div>
          </template>
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
import { onMounted, ref, watch, computed } from "@vue/composition-api";
import SelectByBaseAttribute from "../selectByBaseAttribute.vue";
import SelectByBehavioralAttribute from "../selectByBehavioralAttribute.vue";
import CustomUpload from "../customUpload.vue";
import { deepClone } from "@/utils/handleData";
import { watchRoleType } from "./watchParams";

export default {
  components: {
    SelectByBaseAttribute,
    SelectByBehavioralAttribute,
    CustomUpload,
  },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const secondFormState = ref({
      taskTargetType: "",
      targetUserRange: "",
      basicConditionList: [],
      behavioralConditionList: [],
      targetUserGroupId: "",
    });
    const validateBasicCondition = async (rule, value, callback) => {
      let flag = value.some((e) => {
        let str1 = e.conditionCode;
        let str2 = e.conditionOperator;
        let arr = e.conditionValue;
        if (
          !(str1 === "" || str2 === "" || arr.length === 0) &&
          str1.trim() &&
          str2.trim() &&
          arr
        ) {
          // 两个字符串和数组同时有值，且不为空
          return false;
        } else if (str1 === "" && str2 === "" && arr.length === 0) {
          // 两个字符串和数组都是空值和空数组
          secondFormState.value.basicConditionList = [];
          return false;
        } else {
          // 两个字符串和数组中存在有值和空值的情况
          return true;
        }
      });
      if (flag) callback(new Error(root.$t("请完善基本属性")));
      if (hasDuplicates(value, "conditionCode")) {
        callback(new Error(root.$t("基本属性存在重复条件")));
      }
    };
    const validateBehaviorCondition = async (rule, value, callback) => {
      let flag = value.some((e) => {
        if (e.conditionCode.length && e.conditionTarget) {
          return false;
        } else if (!e.conditionCode.length && !e.conditionTarget) {
          secondFormState.value.behavioralConditionList = [];
          return false;
        } else {
          return true;
        }
      });
      if (flag) callback(new Error(root.$t("请完善行为属性")));
      if (hasDuplicates(value, "conditionCode", "conditionTarget")) {
        callback(new Error(root.$t("行为属性存在重复条件")));
      }
      let valFlag = value.some((e) => {
        return e.conditionMinValue > e.conditionMaxValue;
      });
      if (valFlag) callback(new Error(root.$t("数字范围左侧≤右侧")));
    };
    const rules = {
      taskTargetType: {
        required: true,
        message: root.$t("请选择"),
        trigger: "blur",
      },
      targetUserRange: {
        required: true,
        message: root.$t("请选择"),
        trigger: "blur",
      },
      basicConditionList: {
        required: false,
        validator: validateBasicCondition,
        trigger: "change",
      },
      behavioralConditionList: {
        required: false,
        validator: validateBehaviorCondition,
        trigger: "change",
      },
      targetUserGroupId: {
        required: true,
        message: root.$t("请上传"),
        trigger: "change",
      },
    };
    const finalData = ref({});
    const nextStep = async () => {
      /* 根据属性圈选 */
      if (watchRoleType.value !== 3) {
        secondFormState.value.basicConditionList = deepClone(
          refs.basicCondition.basicConditionList
        );
        secondFormState.value.behavioralConditionList = deepClone(
          refs.behavioralCondition.behaviorConditionList
        );
      }
      await refs["myForm"].validate();
      finalData.value = deepClone(secondFormState.value);
      emit("toNextStep");
    };
    const preStep = async () => {
      emit("toPreStep");
    };
    const uploadType = ref("1");
    watch(
      () => uploadType.value,
      (val) => {
        if (root.$route.query.type === "add") {
          refs.CustomUpload.targetUserGroupId = "";
          refs.CustomUpload.fileList = [];
          secondFormState.value.targetUserGroupId = "";
        }
      }
    );
    watch(
      () => watchRoleType.value,
      (val) => {
        if (val === 3 && root.$route.query.type === "add") {
          secondFormState.value.taskTargetType = 4;
          secondFormState.value.targetUserRange = 3;
        }
      }
    );
    /* 手动触发添加字段校验 */
    const validateTargetUserGroupId = (prop) => {
      refs.myForm.validateField(prop);
    };
    /* 判断条件key值重复 */
    const hasDuplicates = (array, key1, key2) => {
      var valuesSoFar = Object.create(null);
      for (var i = 0; i < array.length; ++i) {
        if (key2) {
          var id = `${array[i][key1]}${array[i][key2]}`;
        } else {
          var id = array[i][key1];
        }
        if (id in valuesSoFar) {
          return true;
        }
        valuesSoFar[id] = true;
      }
      return false;
    };
    return {
      isEn,
      secondFormState,
      rules,
      uploadType,
      finalData,
      nextStep,
      preStep,
      validateTargetUserGroupId,
      watchRoleType: watchRoleType,
    };
  },
};
</script>
<style lang="scss" scoped>
.task-first-step-warp {
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
    .tips {
      color: #bebebe;
      font-size: 12px;
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
