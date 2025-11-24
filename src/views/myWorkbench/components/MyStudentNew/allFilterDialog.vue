<template>
  <el-dialog
    class="filter-dialog"
    @close="closeDialog"
    :title="referer === REFERER_TYPE.SET ? $t('常用筛选') : $t('全部筛选')"
    :visible.sync="visible"
    width="1100px"
    center
  >
    <el-form
      inline="true"
      :model="formState"
      ref="formRef"
      label-width="130px"
      size="small"
      @keyup.enter.native="handleSubmit"
    >
      <el-form-item v-if="referer === REFERER_TYPE.SET" label="">
        <el-input
          style="width: 350px"
          maxlength="20"
          show-word-limit
          type="text"
          v-model="categoryName"
          :placeholder="$t('请输入分类名称')"
        ></el-input>
      </el-form-item>
      <!---------------------- 基础信息维度 start ---------------------->
      <div>
        <span class="info mb10">{{ $t("基础信息维度") }}</span>
        <div class="section">
          <el-form-item :label="$t('范围')">
            <CommonTree
              isShowLACCSelect="true"
              class="common-tree"
              :hasLAPermission="
                Per.handleButtonPer('teach.myWorkbench.myStudentNew.filterByLA')
              "
              :hasCCPermission="
                Per.handleButtonPer('teach.myWorkbench.myStudentNew.filterByCC')
              "
              @get_seleParams="get_seleParams"
              :selectedRangeData="rangeData"
            ></CommonTree>
          </el-form-item>
          <el-form-item :label="$t('用户')">
            <UserSelect
              :isShowParentUserName="false"
              @userChange="userChange"
              :searchParams="formState"
            />
          </el-form-item>
          <el-form-item :label="$t('学科')">
            <el-select
              clearable
              :placeholder="$t('请选择')"
              v-model="formState.subjectTypeId"
            >
              <el-option
                v-for="(item, index) in Constants.subjectListAll(
                  currentLang,
                  false
                )"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 在读周期 -->
          <el-form-item :label="$t('在读周期')">
            <CycleSelect @cycleChange="cycleChange" :searchParams="formState" />
          </el-form-item>
          <!-- 是否绑定微信 -->
          <el-form-item :label="$t('是否绑定微信')" prop="parentBindWechat">
            <el-select
              clearable
              :placeholder="$t('请选择')"
              v-model="formState.parentBindWechat"
            >
              <el-option
                v-for="item of getIfConfigs(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!------------------------------- 基础信息维度 end---------------------------------->

      <!------------------------------- 完课维度 start---------------------------------->
      <div>
        <span class="info mb10">{{ $t("完课维度") }}</span>
        <div class="section">
          <el-form-item
            :label="$t('停课情况')"
            prop="lastClassEndTimeCycleList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.lastClassEndTimeCycleList"
              clearable
              multiple
            >
              <el-option
                v-for="item of getClassSuspensions(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本周正常完课')"
            prop="classCompletedThisWeekNumList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.classCompletedThisWeekNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getClassNums(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本周已约未完课')"
            prop="classScheduledThisWeekNumList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.classScheduledThisWeekNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getClassNums(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本周预计完课')"
            prop="classPlannedCompletedThisWeekNumList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.classPlannedCompletedThisWeekNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getClassNums(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本月正常完课')"
            prop="classCompletedThisMonthNumList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.classCompletedThisMonthNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getMonthClassNums(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本月已约未完课')"
            prop="classScheduledThisMonthNumList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.classScheduledThisMonthNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getMonthClassNums(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本月预计完课')"
            prop="classPlannedCompletedThisMonthNumList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.classPlannedCompletedThisMonthNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getMonthClassNums(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('可加课学员')" prop="addClassList">
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.addClassList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getAbleAddStudents(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!------------------------------- 完课维度 end---------------------------------->

      <!------------------------------- 订单维度 start---------------------------------->
      <div>
        <span class="info mb10">{{ $t("订单维度") }}</span>
        <div class="section">
          <el-form-item
            :label="$t('学生课时')"
            prop="studentAccountBalanceList"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.studentAccountBalanceList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getCourseTimes(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('家长课时')" prop="parentAccountBalanceList">
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.parentAccountBalanceList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getCourseTimes(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('家长积分')" prop="parentCoinBalance">
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.parentCoinBalance"
              multiple
              clearable
            >
              <el-option
                v-for="item of getParentIntegrals(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('N签')" prop="studentOrderNumList">
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.studentOrderNumList"
              multiple
              clearable
            >
              <el-option
                v-for="item of getNTags(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('本月是否有订单')" prop="thisMonthHasOrder">
            <el-select
              clearable
              :placeholder="$t('请选择')"
              v-model="formState.thisMonthHasOrder"
            >
              <el-option
                v-for="item of getIfConfigs(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!------------------------------- 订单维度 end---------------------------------->

      <!------------------------------- 转介绍维度 start---------------------------------->
      <div>
        <span class="info mb10">{{ $t("转介绍维度") }}</span>
        <div class="section">
          <el-form-item
            :label="$t('本周是否上传')"
            prop="parentRemainingPunchInUpload"
          >
            <el-select
              clearable
              :placeholder="$t('请选择')"
              v-model="formState.parentRemainingPunchInUpload"
            >
              <el-option
                v-for="item of getIfConfigs(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本周是否打卡成功')"
            prop="parentRemainingPunchIn"
          >
            <el-select
              clearable
              :placeholder="$t('请选择')"
              v-model="formState.parentRemainingPunchIn"
            >
              <el-option
                v-for="item of getIfConfigs(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('本月已打卡次数')"
            prop="parentRemainingPunchInThisMonthNum"
          >
            <el-select
              :placeholder="$t('请选择')"
              v-model="formState.parentRemainingPunchInThisMonthNum"
              multiple
              clearable
            >
              <el-option
                v-for="item of getClockTimes(isEn)"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item class="footer">
        <el-button @click="resetForm">{{ $t("清空") }}</el-button>
        <el-button @click="handleSubmit" type="primary">{{
          referer === REFERER_TYPE.SEARCH ? $t("查询") : $t("保存")
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  ref,
  watch,
} from "@vue/composition-api";
import CommonTree from "@/views/reportManagement/commonTree";
import UserSelect from "./userSelect.vue";
import CycleSelect from "./cycleSelect.vue";

import {
  getClassSuspensions,
  getClassNums,
  getMonthClassNums,
  getAbleAddStudents,
  getCourseTimes,
  getParentIntegrals,
  getNTags,
  getIfConfigs,
  getClockTimes,
} from "../../dataConfig/constant";

const REFERER_TYPE = {
  SEARCH: "search",
  SET: "set",
};
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    referer: {
      type: String,
      default: REFERER_TYPE.SEARCH,
    },
    searchParams: {
      type: Object,
      default: {},
    },
    name: {
      type: String,
      default: "",
    },
    rangeType: {
      type: String,
      default: "",
    },
    rangeValue: {
      type: String || Array,
      default: "",
    },
  },
  components: { CommonTree, UserSelect, CycleSelect },
  setup(props, { root, refs, emit }) {
    const rangeValue = ref(null);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currentLang = computed(() => root.$store.getters.currentLang);
    const userId = JSON.parse(window.localStorage.getItem("userInfo"))?.id;
    const categoryName = ref(props.name || "");
    const formState = reactive({
      userId,
      parentBindWechat: null, // 是否绑定微信  0-未绑定，1-已绑定-暂不启用
      lastClassEndTimeCycleList: [], // 停课情况 eg: [{start:1, end:2}]
      classCompletedThisWeekNumList: [], // 本周正常完课 eg: [{start:1, end:2}]
      classScheduledThisWeekNumList: [], // 本周已约未完课
      classPlannedCompletedThisWeekNumList: [], // 本周预计完课 eg: [{start:1, end:2}]
      classCompletedThisMonthNumList: [], // 本月正常完课  eg: [{start:1, end:2}]
      classScheduledThisMonthNumList: [], // 本月已约未完课 eg: [{start:1, end:2}]
      classPlannedCompletedThisMonthNumList: [], // 本月预计完课 eg: [{start:1, end:2}]
      addClassList: [], // 可加课学员  number[]
      studentAccountBalanceList: [], //学生课时  eg: [{start:1, end:2}]
      parentAccountBalanceList: [], // 家长课时  eg: [{start:1, end:2}]
      parentCoinBalance: [], // 家长积分  eg: [{start:1, end:2}]
      studentOrderNumList: [], // N签 eg: [{start:1, end:2}]
      thisMonthHasOrder: null, // 本月是否有订单  0-没有 1-有
      parentRemainingPunchInUpload: null, //本周是否上传 0 1
      parentRemainingPunchIn: null, // 本周是否打卡成功 0 1
      parentRemainingPunchInThisMonthNum: [], // 本月已打卡次数
      subjectTypeId: 0,

      /**以下 key 对应的 value 值由对应的组件 emit 出来，form 不受控 */
      postIdStr: "",
      userIdStr: "",
      studentName: "",
      studentUserId: null,
      parentUserName: "",
      parentUserId: null,
      parentFirstSingleCycle: null, // 家长在读周期
      studentFirstSingleCycle: null, // 学生在读周期
    });

    const rangeData = reactive({
      rangeType: "",
      rangeValue: "",
    });

    const closeDialog = () => {
      refs["formRef"].resetFields();
      emit("update:visible", false);
    };

    const handleSubmit = () => {
      if (props.referer === REFERER_TYPE.SEARCH) {
        emit(
          "closeDialogBySearch",
          formState,
          rangeData.rangeType,
          rangeValue.value
        );
      } else {
        let isDirty = true;
        if (!categoryName.value) {
          return root.$notify.error(root.$t("请输入常用筛选项名称"));
        }
        // 范围是登录人自己 & 学科是中文
        if (
          formState.userIdStr &&
          +formState.userIdStr === userId &&
          formState.subjectTypeId === 0
        ) {
          const keys = [
            "userIdStr",
            "subjectTypeId",
            "userId",
            "rangeType",
            "rangeValue",
            "id",
          ];
          const nums = [0, 1];
          isDirty = Object.keys(formState).filter((key) => {
            if (
              !keys.includes(key) &&
              ((formState[key] && formState[key].length) ||
                nums.includes(formState[key]))
            ) {
              return true;
            }
            return false;
          }).length;
        }
        if (!isDirty) {
          return root.$notify.error(root.$t("请完善常用筛选项设置"));
        }
        formState.rangeType = rangeData.rangeType;
        formState.rangeValue = rangeValue.value;
        emit("closeDialogBySet", {
          categoryName: categoryName.value,
          formState,
        });
      }
    };

    const resetForm = () => {
      root.$eventBus.$emit("clearFilter");
      Object.keys(formState).forEach((key) => {
        const matchKey = ["postIdStr", "userIdStr", "subjectId"];
        if (matchKey.includes(key)) {
          if (key === "subjectId") {
            formState[key] = 0;
          }
          if (key === "postIdStr" || key === "userIdStr") {
            Object.assign(rangeData, { rangeType: "1", rangeValue: "" });
          }
        } else {
          const mutiKey = [
            "parentRemainingPunchInThisMonthNum",
            "parentCoinBalance",
          ];
          if (key.includes("List") || mutiKey.includes(key)) {
            formState[key] = [];
          } else if (key !== "id") {
            formState[key] = null;
          }
        }
      });
    };

    const userChange = (userState) => {
      Object.assign(formState, userState);
    };

    const cycleChange = (cycleState) => {
      Object.assign(formState, cycleState);
    };

    const get_seleParams = (val, valName, searchType, type, postVal) => {
      if (valName === "postIdList") {
        formState.userIdStr = "";
        formState.postIdStr = val.join(",");
        rangeValue.value = postVal;
      } else if (valName === "userIdList") {
        formState.postIdStr = "";
        formState.userIdStr = val.join(",");
        rangeValue.value = null;
      } else if (valName === "clear") {
        formState.postIdStr = "";
        formState.userIdStr = "";
        rangeValue.value = null;
      }
      formState.searchType = +searchType;
      rangeData.rangeType = type;
    };

    onMounted(() => {
      setTimeout(() => {
        Object.assign(rangeData, {
          rangeType: props.rangeType || props.searchParams.rangeType,
          rangeValue:
            props.rangeValue ||
            props.searchParams.rangeValue ||
            props.searchParams.userIdStr ||
            props.searchParams.postIdStr,
        });
        Object.assign(formState, props.searchParams);
      }, 500);
    });

    return {
      rangeData,
      categoryName,
      isEn,
      formState,
      closeDialog,
      get_seleParams,
      handleSubmit,
      resetForm,
      userChange,
      cycleChange,
      currentLang,

      /**constants API */
      REFERER_TYPE,
      getClassSuspensions,
      getClassNums,
      getMonthClassNums,
      getAbleAddStudents,
      getCourseTimes,
      getParentIntegrals,
      getNTags,
      getIfConfigs,
      getClockTimes,
    };
  },
});
</script>
<style lang="scss" scoped>
.filter-dialog {
  .info {
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
  }
  .common-tree {
    display: inline-block;
    margin-right: 20px;
  }
  .screen-item-label {
    font-weight: bold !important;
  }
  .footer {
    position: relative;
    left: 850px;
    bottom: -20px;
  }
  ::v-deep {
    .el-form-item label {
      word-break: break-word !important;
    }
  }
}
</style>
