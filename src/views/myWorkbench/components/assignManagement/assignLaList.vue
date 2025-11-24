<template>
  <div class="la-assign-set-container mt20">
    <div class="top-wrap mb20">
      <div style="display: flex">
        <CommonTree @get_seleParams="handleRangeData"></CommonTree>
        <el-button class="ml10" type="primary" @click="search">{{
          $t("查询")
        }}</el-button>
      </div>
      <el-space>
        <el-button type="primary" @click="beforeOpenDialog('timeSet')">{{
          $t("时间设置")
        }}</el-button>
        <el-button type="primary" @click="beforeOpenDialog('propsSet')">{{
          $t("属性设置")
        }}</el-button>
        <el-button type="primary" @click="beforeOpenDialog('batchSwitch')">{{
          $t("批量开关")
        }}</el-button>
      </el-space>
    </div>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      tooltip-effect="dark"
      :border="false"
      fit
      show-overflow-tooltip="true"
      style="width: 100%; margin-top: 10px"
      stripe
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" fixed />
      <el-table-column fixed width="50" align="center" :label="$t('序号')">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('员工')" prop="userInfoResp">
        <template slot-scope="{ row }">
          {{ row.userInfoResp && row.userInfoResp.username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('部门')"
        prop="postInfoResp"
        :width="150"
      >
        <template slot-scope="{ row }">
          {{ getPostName(row) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('参与分配规则')"
        prop="rule"
        :width="150"
      >
        <template slot-scope="{ row }">
          <p v-for="item in row.joinedRuleList" :key="item.id">
            {{ item.ruleName }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('服务学科')"
        prop="subjet"
        min-width="120"
      >
        <template slot-scope="{ row }">
          <span v-for="(item, i) in row.subjectIds" :key="item">
            {{ Filters.getSubjectLabel(item, currentLang) }}
            <span v-if="i !== row.subjectIds.length - 1">;</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('掌握语言')"
        prop="language"
        :width="120"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.languageDesc }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('排班周期')"
        prop="dutyCycle"
        min-width="150"
      >
        <template slot-scope="{ row }">
          <span v-if="row.dutyCycle.length">
            <span v-for="(item, i) in row.dutyCycle" :key="item">
              {{ Filters.mapWeek(+item, isEn) }}
              <span v-if="i !== row.dutyCycle.length - 1">;</span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('排班时间')"
        prop="time"
        min-width="120"
      >
        <template slot-scope="{ row }">
          <span v-if="row.workStartTime && row.workEndTime">
            {{ row.workStartTime }} - {{ row.workEndTime }} （{{
              row.timeZone
            }}）
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('临时休假')"
        prop="name"
        min-width="120"
      >
        <template slot-scope="{ row }">
          {{ getDateWithWeek(row.leaveStartTime) }}
          -
          {{ getDateWithWeek(row.leaveEndTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="autoAssign"
        :width="120"
        fixed="right"
      >
        <template slot="header">
          <span>{{ $t("自动分配开关") }}</span>
          <el-popover trigger="hover" placement="right" title="">
            <div style="width: 200px" class="content-tip">
              {{ $t("关闭后将不会参与常规规则分配") }}
            </div>
            <i
              slot="reference"
              class="el-icon-question"
              style="color: #ccc"
            ></i>
          </el-popover>
        </template>
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.autoAssign"
            :active-color="activeColor"
            inactive-color="#ccc"
            :active-value="0"
            :inactive-value="1"
            @change="changeStatus(row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 时间设置弹窗 -->
    <el-dialog
      v-if="showTimeSetDialog"
      :title="$t('时间设置')"
      :visible="showTimeSetDialog"
      :before-close="handleCloseTimeSetDialog"
      width="1000px"
    >
      <el-form :model="timeSetForm" ref="timeSetFormRef" label-width="120px">
        <el-form-item
          :label="$t('以下时间按照该时区设定')"
          :label-width="isEn ? '300px' : '200px'"
          style="marginleft: 20px"
          :rules="[{ required: true, message: $t('请选择') }]"
        >
          <FilterByTimeZone
            @changeSelect="
              (val) => {
                timeSetForm.timeZone = val;
              }
            "
          />
        </el-form-item>
        <el-form-item
          :label="$t('排班周期')"
          :label-width="isEn ? '150px' : '120px'"
          :rules="[{ required: true, message: $t('请选择') }]"
        >
          <el-checkbox-group v-model="timeSetForm.dutyCycle">
            <el-checkbox
              v-for="week in Constants.weekList(currentLang)"
              :key="week.value"
              :label="week.value"
              >{{ $t(week.label) }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>

        <div class="time-wrap mb10">
          <el-form-item
            :label="$t('排班时间')"
            :label-width="isEn ? '150px' : '120px'"
            :rules="[{ required: true, message: $t('请选择') }]"
          >
            <el-radio-group
              v-model="timeSetForm.timeType"
              @change="handleChangeTimeType"
              :class="isEn ? 'enWwrap' : ''"
            >
              <el-radio
                style="display: block"
                class="mb10"
                :label="TIME_TYPE.ALL"
                >{{ $t("全部时间") }}</el-radio
              >
              <el-radio :label="TIME_TYPE.FIXED_TIME">{{
                $t("指定时间段")
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="timeSetForm.timeType === TIME_TYPE.FIXED_TIME"
            style="marginleft: -100px"
            class="mb10"
            :class="isEn ? 'enTime' : ''"
          >
            <el-time-picker
              is-range
              v-model="timeSetForm.workTime"
              range-separator="-"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              format="HH:mm"
              value-format="HH:mm"
            >
            </el-time-picker>
          </el-form-item>
        </div>
        <el-form-item
          :label="$t('临时休假')"
          :label-width="isEn ? '150px' : '120px'"
        >
          <el-date-picker
            format="yyyy-MM-dd"
            v-model="timeSetForm.leaveTime"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="textalign: right">
          <el-button
            @click="handleSubmitTimeSet(handleSubmit)"
            type="primary"
            class="mr10 mt50"
            >{{ $t("保存") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量开关弹窗-->
    <el-dialog
      v-if="showSwitchDialog"
      :title="$t('批量开关')"
      :visible="showSwitchDialog"
      :before-close="handleCloseSwitchDialog"
      width="400px"
      center=""
    >
      <div style="textalign: center">
        <span>{{ $t("关") }}</span>
        <el-switch
          v-model="autoAssign"
          :active-color="activeColor"
          inactive-color="#ccc"
          :active-value="0"
          :inactive-value="1"
        ></el-switch>
        <span>{{ $t("开") }}</span>
        <p class="switch-tip">{{ $t("学管分配设置-批量开关提示") }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseSwitchDialog">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="handleSubmitSwitch(handleSubmit)">{{
          $t("保存")
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 属性设置弹窗 -->
    <el-dialog
      v-if="showPropsSetDialog"
      :title="$t('属性设置')"
      :visible="showPropsSetDialog"
      :before-close="handleClosePropsSetDialog"
      width="500px"
      center=""
    >
      <el-form :model="propsSetForm" ref="propsSetFormRef" label-width="120px">
        <el-form-item :label="$t('服务学科')">
          <el-checkbox-group v-model="propsSetForm.subjectIds">
            <el-checkbox
              v-for="week in Constants.subjectListAll(currentLang)"
              :key="week.value"
              :label="week.value"
              >{{ $t(week.label) }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('课程类型')">
          <el-checkbox-group v-model="propsSetForm.classTypeIds">
            <el-checkbox
              v-for="week in Constants.courseTypeList(isEn)"
              :key="week.value"
              :label="week.value"
              >{{ $t(week.label) }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('掌握语言')">
          <el-select
            style="width: 200px"
            v-model="propsSetForm.language"
            filterable
            multiple
            clearable
          >
            <el-option
              v-for="item in languageList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="textalign: right">
          <el-button
            @click="handleSubmitPropsSet(handleSubmit)"
            type="primary"
            class="mr10 mt50"
            >{{ $t("保存") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  ref,
  unref,
  onMounted,
  watch,
} from "@vue/composition-api";
import CommonTree from "@/views/reportManagement/commonTree";
import styles from "@/styles/variables.scss";
import { deepClone } from "../../../../utils/handleData";
import moment from "moment";
import FilterByTimeZone from "@/components/FilterItem/CommodityFilter/FilterByTimeZone";

const TIME_TYPE = {
  ALL: 1,
  FIXED_TIME: 2,
};
export default defineComponent({
  components: { CommonTree, FilterByTimeZone },
  setup(props, { root, emit, refs }) {
    const {
      timeSetForm,
      showTimeSetDialog,
      handleCloseTimeSetDialog,
      handleSubmitTimeSet,
      handleShowTimeSetDialog,
      handleChangeTimeType,
    } = useTimeSetFun(root);
    const {
      showSwitchDialog,
      handleCloseSwitchDialog,
      handleSubmitSwitch,
      autoAssign,
      handleShowSwitchDialog,
    } = useBatchSwitchFun(root);
    const {
      languageList,
      propsSetForm,
      showPropsSetDialog,
      handleClosePropsSetDialog,
      handleSubmitPropsSet,
      handleShowPropsSetDialog,
    } = usePropsSetFun(root);
    const currentLang = computed(() => root.$store.getters.currentLang);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const tableData = ref(null);
    const activeColor = styles.customPrimaryColor;
    const flagState = reactive({
      tableLoading: false,
    });
    const searchState = reactive({
      userIdStr: "",
      postIdStr: "",
    });

    const selectedItems = ref(null);

    const changeStatus = async (row) => {
      const params = {
        personIdList: [row.userInfoResp.userId],
        autoAssign: row.autoAssign,
      };
      const {
        status,
        data: { data, code },
      } = await root.$Api.workBench.batchUpdateConfig(params);
      if (status !== 200 || code !== 200) {
        row.autoAssign = !row.autoAssign ? 1 : 0;
        return Promise.reject();
      }
      root.$notify.success(root.$t("操作成功"));
      getData();
    };

    const handleRangeData = (val, valName) => {
      if (valName === "postIdList") {
        searchState.userIdStr = "";
        searchState.postIdStr = val.join(",");
      } else if (valName === "userIdList") {
        searchState.postIdStr = "";
        searchState.userIdStr = val.join(",");
      } else if (valName === "clear") {
        searchState.postIdStr = "";
        searchState.userIdStr = "";
      }
      search();
    };

    const transferUTC2Local = (hour) => {
      if (!hour) return "";
      const date = new Date().toLocaleDateString().replaceAll("/", "-");
      const localDateStr = date + " " + hour + ":00";
      return moment.utc(localDateStr).local().format("HH:mm");
    };

    const handleSelectionChange = (list) => {
      selectedItems.value = list;
    };

    const search = () => {
      getData();
    };

    const getData = () => {
      flagState.tableLoading = true;
      root.$Api.workBench
        .getAssignLaConfigList(searchState.userIdStr, searchState.postIdStr)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          data.forEach((t) => {
            t.joinedRuleList = (t.joinedRuleList || []).filter(
              (_t) => !_t.status
            );
            t.dutyCycle = t.dutyCycle
              ? t.dutyCycle.split(",").sort((a, b) => a - b)
              : [];
            t.language = (t.language || "").split(",");
            t.subjectIds = (t.subjectIds || "").split(",");
            t.classTypeIds = (t.classTypeIds || "").split(",");
          });
          tableData.value = data;
          flagState.tableLoading = false;
        })
        .catch(() => {
          tableData.value = [];
          flagState.tableLoading = false;
        });
    };

    const handleSubmit = async (type, obj) => {
      const params = Object.assign(obj, {
        personIdList: unref(selectedItems).map((t) => t.userInfoResp.userId),
      });
      const {
        status,
        data: { data, code },
      } = await root.$Api.workBench.batchUpdateConfig(params);
      if (status !== 200 || code !== 200) return Promise.reject();
      root.$notify.success(root.$t("操作成功"));
      setTimeout(() => {
        if (type === "timeSet") {
          showTimeSetDialog.value = false;
        } else if (type === "propsSet") {
          showPropsSetDialog.value = false;
        } else {
          showSwitchDialog.value = false;
        }
        getData();
      }, 1000);
    };

    const beforeOpenDialog = (type) => {
      if (!unref(selectedItems)?.length) {
        return root.$notify.warning(root.$t("请选择要操作的学管"));
      }
      const list = unref(selectedItems);
      if (type === "timeSet") {
        showTimeSetDialog.value = true;
        handleShowTimeSetDialog(list);
      } else if (type === "propsSet") {
        showPropsSetDialog.value = true;
        handleShowPropsSetDialog(list);
      } else {
        showSwitchDialog.value = true;
        handleShowSwitchDialog(list);
      }
    };

    const getDateWithWeek = (utcDate) => {
      if (!utcDate) return "";
      const localDate = moment(moment.utc(utcDate).local());
      const week = moment(localDate).day();
      return (
        localDate.format("YYYY-MM-DD") +
        " " +
        root.Filters.mapWeek(week, unref(isEn))
      );
    };

    const getPostName = (row) => {
      const {
        upPostNameEn,
        currentPostNameEn,
        upPostNameZh,
        currentPostNameZh,
        thirdPostNameEn,
        thirdPostNameZh,
      } = row.postInfoResp;
      let strZh = currentPostNameZh;
      if (upPostNameZh) {
        strZh += "/" + upPostNameZh;
      }
      if (thirdPostNameZh) {
        strZh += "/" + thirdPostNameZh;
      }
      let strEn = currentPostNameEn;
      if (upPostNameEn) {
        strEn += "/" + upPostNameEn;
      }
      if (thirdPostNameEn) {
        strEn += "/" + thirdPostNameEn;
      }
      return unref(isEn) ? strEn : strZh;
    };

    return {
      isEn,
      currentLang,
      tableData,
      activeColor,
      TIME_TYPE,
      selectedItems,
      ...toRefs(flagState),

      handleRangeData,
      transferUTC2Local,
      searchState,
      handleSelectionChange,
      getPostName,
      beforeOpenDialog,
      getDateWithWeek,
      search,
      getData,
      changeStatus,
      /**timeSetDialog */
      showTimeSetDialog,
      timeSetForm,
      handleCloseTimeSetDialog,
      handleSubmitTimeSet,
      handleSubmit,
      handleShowTimeSetDialog,
      handleChangeTimeType,
      /**batchSwitchDialog */
      showSwitchDialog,
      autoAssign,
      handleCloseSwitchDialog,
      handleSubmitSwitch,
      handleShowSwitchDialog,
      /**propsSetDialog */
      languageList,
      propsSetForm,
      showPropsSetDialog,
      handleClosePropsSetDialog,
      handleSubmitPropsSet,
      handleShowPropsSetDialog,
    };
  },
});

const useTimeSetFun = (root) => {
  const timeSetForm = reactive({
    personIdList: [],
    dutyCycle: [],
    timeType: void 0,
    workTime: "",
    workStartTime: "",
    workEndTime: "",
    leaveTime: [],
    leaveStartTime: "",
    leaveEndTime: "",
    timeZone: "",
  });

  watch(
    () => timeSetForm.workTime,
    (times) => {
      timeSetForm.workStartTime = times && times[0];
      timeSetForm.workEndTime = times && times[1];
    }
  );

  const showTimeSetDialog = ref(false);

  const handleChangeTimeType = () => {
    timeSetForm.workStartTime = "";
    timeSetForm.workEndTime = "";
    timeSetForm.workTime = "";
  };

  const transferUTC2Local = (hour) => {
    const date = new Date().toLocaleDateString().replaceAll("/", "-");
    const localDateStr = date + " " + hour + ":00";
    return moment.utc(localDateStr).local();
  };

  const handleShowTimeSetDialog = async (list) => {
    if (list.length === 1) {
      const {
        userInfoResp: { userId },
      } = list[0];
      const {
        status,
        data: { data, code },
      } = await root.$Api.workBench.getLaConfigInfo(userId);
      if (status !== 200 || code !== 200) return Promise.reject();
      const {
        workStartTime,
        workEndTime,
        dutyCycle,
        leaveStartTime,
        leaveEndTime,
        timeZone,
      } = data;
      const fmt = "YYYY-MM-DD";
      Object.assign(timeSetForm, {
        dutyCycle: dutyCycle ? dutyCycle.split(",").map((t) => +t) : [],
        leaveTime:
          leaveEndTime && leaveStartTime
            ? [
                moment.utc(leaveStartTime).local().format(fmt),
                moment.utc(leaveEndTime).local().format(fmt),
              ]
            : [],
        workTime:
          workStartTime && workEndTime ? [workStartTime, workEndTime] : "",
        timeType:
          workStartTime === "00:00" && workEndTime === "23:59"
            ? TIME_TYPE.ALL
            : TIME_TYPE.FIXED_TIME,
        timeZone,
      });
    } else {
      Object.assign(timeSetForm, {
        dutyCycle: [],
        timeType: void 0,
        workTime: [],
        leaveTime: [],
      });
    }
  };

  const handleCloseTimeSetDialog = () => {
    showTimeSetDialog.value = false;
  };
  const handleSubmitTimeSet = (cb) => {
    const submitData = deepClone(timeSetForm);
    if (timeSetForm.timeType === TIME_TYPE.ALL) {
      submitData.workStartTime = "00:00";
      submitData.workEndTime = "23:59";
    }
    if (submitData.timeType === TIME_TYPE.FIXED_TIME) {
      if (
        !submitData.dutyCycle.length ||
        !submitData.workTime.length ||
        !submitData.timeZone
      ) {
        return root.$notify.error(root.$t("缺少必要参数"));
      }
    } else {
      if (
        !submitData.dutyCycle.length ||
        !submitData.workStartTime ||
        !submitData.workEndTime ||
        !submitData.timeZone
      ) {
        return root.$notify.error(root.$t("缺少必要参数"));
      }
    }

    if (submitData.workTime && timeSetForm.timeType === TIME_TYPE.FIXED_TIME) {
      const times = submitData.workTime;
      submitData.workStartTime = times && times[0];
      submitData.workEndTime = times && times[1];
    }
    if (submitData.leaveTime?.length) {
      const times = submitData.leaveTime;
      submitData.leaveStartTime = times && new Date(times[0]).toISOString();
      submitData.leaveEndTime = times && new Date(times[1]).toISOString();
    } else {
      submitData.cleanLeaveTime = 1;
    }
    submitData.dutyCycle = submitData.dutyCycle.join(",");
    delete submitData.workTime;
    delete submitData.leaveTime;
    delete submitData.timeType;
    cb("timeSet", submitData);
  };
  return {
    timeSetForm,
    showTimeSetDialog,

    handleCloseTimeSetDialog,
    handleSubmitTimeSet,
    handleShowTimeSetDialog,
    handleChangeTimeType,
  };
};

const useBatchSwitchFun = (root) => {
  const autoAssign = ref(1);
  const showSwitchDialog = ref(false);

  const handleShowSwitchDialog = async (list) => {
    if (list.length === 1) {
      const {
        userInfoResp: { userId },
      } = list[0];
      const {
        status,
        data: { data, code },
      } = await root.$Api.workBench.getLaConfigInfo(userId);
      if (status !== 200 || code !== 200) return Promise.reject();
      autoAssign.value = data.autoAssign;
    } else {
      autoAssign.value = 1;
    }
  };
  const handleCloseSwitchDialog = () => {
    showSwitchDialog.value = false;
  };
  const handleSubmitSwitch = (cb) => {
    cb("switchSet", { autoAssign: unref(autoAssign) });
  };
  return {
    autoAssign,
    showSwitchDialog,
    handleCloseSwitchDialog,
    handleSubmitSwitch,
    handleShowSwitchDialog,
  };
};

const usePropsSetFun = (root) => {
  const propsSetForm = reactive({
    subjectIds: [],
    classTypeIds: [],
    language: [],
  });
  const languageList = ref(null);
  const showPropsSetDialog = ref(false);
  const handleClosePropsSetDialog = () => {
    showPropsSetDialog.value = false;
  };
  const handleShowPropsSetDialog = async (list) => {
    Object.assign(propsSetForm, {
      subjectIds: [],
      classTypeIds: [],
      language: [],
    });
    if (list.length === 1) {
      const {
        userInfoResp: { userId },
      } = list[0];
      const {
        status,
        data: { data, code },
      } = await root.$Api.workBench.getLaConfigInfo(userId);
      if (status !== 200 || code !== 200) return Promise.reject();
      const { subjectIds, classTypeIds, language } = data;
      Object.assign(propsSetForm, {
        subjectIds: subjectIds ? subjectIds.split(",").map((t) => +t) : [],
        classTypeIds: classTypeIds
          ? classTypeIds.split(",").map((t) => +t)
          : [],
        language: language ? language.split(",") : [],
      });
    } else {
      Object.assign(propsSetForm, {
        subjectIds: [],
        classTypeIds: [],
        language: [],
      });
    }
  };
  const handleSubmitPropsSet = (cb) => {
    const submitData = deepClone(propsSetForm);
    if (
      !submitData.subjectIds.length ||
      !submitData.classTypeIds.length ||
      !submitData.classTypeIds.length
    ) {
      return root.$notify.error(root.$t("不能为空"));
    }
    submitData.subjectIds = submitData.subjectIds.join(",");
    submitData.classTypeIds = submitData.classTypeIds.join(",");
    submitData.language = submitData.language.join(",");
    cb("propsSet", submitData);
  };
  const isEn = computed(() => root.$store.getters.currentLang === "en");

  watch(isEn, async () => {
    languageList.value = await root.$Api.base.getLanguageList();
  });

  onMounted(async () => {
    languageList.value = await root.$Api.base.getLanguageList();
  });
  return {
    languageList,
    propsSetForm,
    showPropsSetDialog,
    handleClosePropsSetDialog,
    handleSubmitPropsSet,
    handleShowPropsSetDialog,
  };
};
</script>
<style lang="scss" scoped>
.la-assign-set-container {
  .top-wrap {
    display: flex;
    justify-content: space-between;
  }
  .time-wrap {
    display: flex;
    align-items: flex-end;
  }
}
::v-deep {
  .el-table .cell,
  .el-form-item__label {
    word-break: break-word !important;
  }
}
.content-tip {
  word-break: break-word !important;
}
.enWwrap {
  padding-top: 10px;
}
.enTime {
  // padding-bottom: 10px;
}
.switch-tip {
  word-break: break-word !important;
}
</style>
