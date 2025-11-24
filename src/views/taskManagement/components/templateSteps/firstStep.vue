<template>
  <!-- 任务简介 -->
  <div class="task-first-step-warp">
    <div class="title">{{ $t("任务简介") }}</div>
    <div class="box-card">
      <div class="form-warp">
        <el-form
          class="my-form"
          :rules="rules"
          ref="myForm"
          :model="firstFormState"
          label-width="130px"
        >
          <el-form-item :label="$t('任务名称 (中文)')" prop="taskNameCn">
            <el-input
              maxlength="50"
              :placeholder="$t('请输入')"
              class="w200"
              v-model="firstFormState.taskNameCn"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('任务名称 (英文)')" prop="taskNameEn">
            <el-input
              maxlength="50"
              :placeholder="$t('请输入')"
              class="w200"
              v-model="firstFormState.taskNameEn"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('适用区域')" prop="regionList">
            <FilterByRegion
              ref="region"
              :initVal="firstFormState.regionList"
              @changeSelect="
                (val) => {
                  firstFormState.regionList = val;
                }
              "
            />
            <span style="font-size: 13px; color: #ccc"
              >({{ $t("该内容仅做展示，不影响任务创建") }})</span
            >
          </el-form-item>
          <el-form-item :label="$t('任务说明')" prop="taskDesc">
            <el-input
              type="textarea"
              :placeholder="$t('请输入')"
              maxlength="500"
              show-word-limit
              class="w375"
              rows="2"
              v-model="firstFormState.taskDesc"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('任务执行对象')" prop="roleType">
            <el-radio-group
              @change="
                (val) => {
                  watchRoleType = val;
                }
              "
              v-model="firstFormState.roleType"
            >
              <el-radio :label="1">{{ $t("学管") }}</el-radio>
              <el-radio :label="2">{{ $t("销售") }}</el-radio>
              <el-radio :label="3">{{ $t("教师") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              firstFormState.roleType !== 3 && firstFormState.roleType !== ''
            "
            :label="$t('执行部门')"
            prop="postIdList"
          >
            <SelectDepartment
              :checkStrictly="checkStrictly"
              ref="department"
              @changeSelect="
                (postIdList) => {
                  firstFormState.postIdList = postIdList;
                }
              "
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="fix-footer">
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
import { onMounted, ref, reactive, computed } from "@vue/composition-api";
import FilterByRegion from "@/components/FilterItem/CommodityFilter/FilterByRegion";
import SelectDepartment from "@/components/SelectDepartment.vue";
import { deepClone } from "../../../../utils/handleData";
import { watchRoleType } from "./watchParams";

export default {
  components: { FilterByRegion, SelectDepartment },
  setup(props, { root, refs, emit }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const firstFormState = ref({
      taskNameCn: "",
      taskNameEn: "",
      regionList: [],
      taskDesc: "",
      roleType: "",
      postIdList: [],
    });
    const rules = {
      taskNameCn: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
      taskNameEn: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
      regionList: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
      taskDesc: [
        { required: true, message: root.$t("请输入"), trigger: "blur" },
      ],
      roleType: {
        required: true,
        message: root.$t("请选择"),
        trigger: "change",
      },
      postIdList: [
        { required: true, message: root.$t("请选择"), trigger: "blur" },
      ],
    };
    const finalData = ref({});
    const nextStep = async () => {
      finalData.value = deepClone(firstFormState.value);
      await refs["myForm"].validate();
      emit("toNextStep");
    };
    const reset = () => {
      refs["myForm"].resetFields();
      refs["region"].selectId = [];
      if (watchRoleType.value === 3) return;
      refs["department"].resetChecked();
      refs["department"].allCheckedNode = [];
    };
    const checkStrictly = ref(false);
    onMounted(() => {
      checkStrictly.value = root.$route.query.type === "edit";
    });
    return {
      isEn,
      firstFormState,
      rules,
      finalData,
      checkStrictly,
      nextStep,
      reset,
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
  .el-textarea__inner {
    padding-right: 40px;
  }
}
</style>
