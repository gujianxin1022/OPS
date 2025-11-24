<template>
  <div class="search-area">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <span slot="allFilter">
        <el-button type="text" @click="resetForm">{{ $t("清空") }}</el-button>
        <el-button type="text" @click="openAllFilter()" class="mr10">{{
          $t("全部筛选")
        }}</el-button>
      </span>
      <el-form
        inline="true"
        :model="formState"
        ref="formRef"
        label-width="130px"
        size="small"
        @keyup.enter.native="search"
      >
        <el-form-item :label="$t('范围')" :label-width="isEn ? 200 : 130">
          <CommonTree
            isShowLACCSelect="true"
            :hasLAPermission="
              Per.handleButtonPer('teach.myWorkbench.myStudentNew.filterByLA')
            "
            :hasCCPermission="
              Per.handleButtonPer('teach.myWorkbench.myStudentNew.filterByCC')
            "
            :hasTeachTubePermission="false"
            class="common-tree"
            @get_seleParams="get_seleParams"
            :selectedRangeData="rangeData"
          ></CommonTree>
        </el-form-item>
        <el-form-item :label="$t('用户')" :label-width="isEn ? 200 : 130">
          <UserSelect
            :isShowParentUserName="false"
            @userChange="userChange"
            :searchParams="copyFormState"
          />
        </el-form-item>
        <!-- 学科 -->
        <el-form-item :label="$t('学科')" :label-width="isEn ? 200 : 130">
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
        <el-form-item
          :label="$t('是否绑定微信')"
          prop="parentBindWechat"
          :label-width="isEn ? 200 : 130"
        >
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
        <!-- 学生课时 -->
        <el-form-item
          :label="$t('学生课时')"
          prop="studentAccountBalanceList"
          :label-width="isEn ? 200 : 130"
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
        <!-- 在读周期 -->
        <el-form-item :label="$t('在读周期')" :label-width="isEn ? 200 : 130">
          <CycleSelect
            @cycleChange="cycleChange"
            :searchParams="copyFormState"
          />
        </el-form-item>
        <!-- 家长课时 -->
        <el-form-item
          :label="$t('家长课时')"
          prop="parentAccountBalanceList"
          :label-width="isEn ? 200 : 130"
        >
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
        <!-- 本周预计完课 -->
        <el-form-item
          :label="$t('本周预计完课')"
          prop="classPlannedCompletedThisWeekNumList"
          :label-width="isEn ? 200 : 130"
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
        <!-- 本月是否有订单 -->
        <el-form-item
          :label="$t('本月是否有订单')"
          prop="thisMonthHasOrder"
          :label-width="isEn ? 200 : 130"
        >
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
        <!-- 本月是否打卡 -->
        <el-form-item
          :label="$t('本周是否打卡')"
          prop="parentRemainingPunchIn"
          :label-width="isEn ? 200 : 130"
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
        <!-- 常用筛选组合 -->
        <el-form-item
          :label="$t('常用筛选组合')"
          class="combine-box"
          :label-width="isEn ? 300 : 130"
        >
          <i
            style="cursor: pointer"
            class="el-icon-setting"
            @click="isShowSortFilterDialog = true"
          ></i>
          <div class="icon-wrap">
            <el-tag
              class="mr10 combine-btn"
              v-for="item in usedCombineList"
              :key="item.id"
              @click="triggerSearch(item)"
              >{{ item.formName }}</el-tag
            >
          </div>
        </el-form-item>
      </el-form>
    </screen-wrapper>

    <AllFilterDialog
      v-if="isShowAllFilterDialog"
      referer="search"
      :visible.sync="isShowAllFilterDialog"
      :searchParams="formState"
      @closeDialogBySearch="closeDialogBySearch"
      :rangeType="rangeType"
      :rangeValue="rangeValue"
    />
    <SortFilterDialog
      v-if="isShowSortFilterDialog"
      :visible.sync="isShowSortFilterDialog"
      @closeSortFilterDialog="closeSortFilterDialog"
      :usedCombineList="usedCombineList"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  computed,
} from "@vue/composition-api";
import CommonTree from "@/views/reportManagement/commonTree";
import UserSelect from "./userSelect.vue";
import Constants from "@/utils/constants";
import {
  getCourseTimes,
  getClassNums,
  getIfConfigs,
  FUNCTION_POINT,
} from "../../dataConfig/constant";
import { transferSubmitData } from "../../dataConfig/filter";
import AllFilterDialog from "./allFilterDialog";
import SortFilterDialog from "./sortFilterDialog.vue";
import CycleSelect from "./cycleSelect.vue";
export default defineComponent({
  components: {
    CommonTree,
    AllFilterDialog,
    UserSelect,
    SortFilterDialog,
    CycleSelect,
  },
  setup(_, { root, refs, emit }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo"))?.id;
    const currentLang = computed(() => root.$store.getters.currentLang);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const formState = reactive({
      parentBindWechat: "",
      studentAccountBalanceList: "", //学生课时
      parentAccountBalanceList: "", // 家长课时
      classPlannedCompletedThisWeekNumList: "", // 本周预计完课
      thisMonthHasOrder: null, // 本月是否续费
      parentRemainingPunchIn: null, // 本周是否打卡
      subjectTypeId: 0,
      /**以下 key 对应的 value 值由对应的组件 emit 出来，form 不受控 */
      postIdStr: "",
      userIdStr: "",
      studentName: "",
      studentUserId: null,
      parentUserName: "",
      parentUserId: null,
      studentFirstSingleCycle: null,
      parentFirstSingleCycle: null,
    });

    const total = ref(0);

    const rangeData = reactive({
      rangeType: "1",
      rangeValue: "",
    });

    const rangeType = ref(null);
    const rangeValue = ref(null);

    const copyFormState = reactive(Object.assign({}, {}, formState));

    const flagState = reactive({
      isShowAllFilterDialog: false,
      isShowSortFilterDialog: false,
    });

    const usedCombineList = ref([]);

    const openAllFilter = () => {
      flagState.isShowAllFilterDialog = true;
    };

    // 获取常用筛选列表
    const getNormalFilterList = () => {
      return root.$Api.studentManagement
        .getNormalFilterList(FUNCTION_POINT)
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          usedCombineList.value = (data.data || []).sort(
            (a, b) => a.seq - b.seq
          );
        })
        .catch();
    };
    // 关闭全部筛选弹框触发查询
    const closeDialogBySearch = (searchParams, type, value) => {
      Object.assign(copyFormState, searchParams);

      for (const key in formState) {
        formState[key] = searchParams[key];
      }
      searchParams = transferSubmitData(searchParams);
      Object.assign(rangeData, {
        rangeType: type + "",
        rangeValue: value || searchParams.userIdStr || searchParams.postIdStr,
      });
      flagState.isShowAllFilterDialog = false;
      search(searchParams);
    };

    // 点击常用筛选按钮触发筛选
    const triggerSearch = (item) => {
      delete item.formInfo.rangeType;
      delete item.formInfo.rangeValue;
      root.$eventBus.$emit("triggerSearch", JSON.parse(item.formInfo));
    };
    // 关闭常用筛选弹框
    const closeSortFilterDialog = () => {
      flagState.isShowSortFilterDialog = false;
      getNormalFilterList();
    };

    const search = (params) => {
      let queryParams;
      if (!params || params.key) {
        queryParams = formState;
      } else if (params && !params.key) {
        queryParams = params;
      }
      root.$eventBus.$emit("triggerSearch", transferSubmitData(queryParams));
    };

    const resetForm = () => {
      root.$eventBus.$emit("clearFilter");
      refs.formRef.resetFields();
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
      formState.searchType = +searchType; // 后端要数字类型
      rangeType.value = type;
    };

    const getLaConfigInfo = () => {
      root.$Api.workBench
        .getLaConfigInfo(userId)
        .then(({ status, data: { data, code } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          if (data.subjectIds?.length) {
            data.subjectIds = data.subjectIds.split(",").sort((a, b) => a - b);
            formState.subjectTypeId = +data.subjectIds[0];
          }
        });
    };

    onMounted(async () => {
      await getNormalFilterList();
      getLaConfigInfo();
      root.$nextTick(() => {
        search();
      });
    });

    return {
      currentLang,
      isEn,
      formState,
      rangeData,
      rangeType,
      ...toRefs(flagState),
      usedCombineList,
      copyFormState,
      total,
      rangeValue,

      getCourseTimes,
      getIfConfigs,
      getClassNums,
      search,
      get_seleParams,
      closeDialogBySearch,
      closeSortFilterDialog,
      userChange,
      cycleChange,
      resetForm,
      getNormalFilterList,
      triggerSearch,
      openAllFilter,
    };
  },
});
</script>
<style lang="scss" scoped>
.search-area {
  .common-tree {
    display: inline-block;
    margin-right: 20px;
  }
  .block-item {
    display: inline-block;
  }
  .combine-box {
    width: 100%;
    display: flex;
    .icon-wrap {
      margin-left: 10px;
    }
    .combine-btn {
      cursor: pointer;
    }
  }
}

::v-deep .combine-box .el-form-item__content {
  // width: 85%;
  display: flex;
  align-items: center;
}

::v-deep .check-box .el-checkbox__label {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}
</style>
