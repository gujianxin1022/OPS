<template>
  <div class="erd">
    <screenWrapper
      showReset
      :screenTitle="$t('微信继承数据')"
      @search="handlePaginationChange({ page: 1 })"
      @reset="handleReset"
    >
      <el-form inline :model="formState">
        <el-form-item>
          <span class="flex flex-column-center flex-wrapper" style="gap: 8px">
            <el-radio-group
              v-model="formState.dateType"
              @change="
                () => {
                  formState.startDate = '';
                  formState.endDate = '';
                  resetDate();
                }
              "
            >
              <el-radio-button :label="-1">{{ $t("上月") }}</el-radio-button>
              <el-radio-button :label="0">{{ $t("本月") }}</el-radio-button>
            </el-radio-group>
            <FilterByTimePeriod
              ref="datePicker"
              @changeSelect="
                (timeArr) => {
                  formState.startDate = timeArr[0];
                  formState.endDate = timeArr[1];
                  formState.dateType = void 0
                }
              "
            />
          </span>
        </el-form-item>
        <el-form-item :label="$t('原学管姓名')">
          <CommonTree
            @get_seleParams="handleOriginLAChange"
            :defaultNotSelected="true"
          />
        </el-form-item>
        <el-form-item :label="$t('新学管姓名')">
          <CommonTree
            @get_seleParams="handleNewLAChange"
            :defaultNotSelected="true"
          />
        </el-form-item>
        <el-form-item :label="$t('学生姓名')">
          <el-input
            clearable
            v-model="formState.studentName"
            :placeholder="$t('请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('分配人')">
          <el-input
            clearable
            v-model="formState.allocationName"
            :placeholder="$t('请输入')"
          />
        </el-form-item>
        <el-form-item :label="$t('继承情况')">
          <el-select
            clearable
            v-model="formState.extendStatus"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in inheritanceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('接替状态')">
          <el-select
            clearable
            v-model="formState.receiveStatus"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="item in successionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </screenWrapper>
    <BasicTable
      v-loading="tableState.loading"
      :data="tableState.data"
      :column="tableState.columns"
      :pagination="true"
      :page="tableState.page"
      :total="tableState.total"
      :limit="tableState.limit"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import { onMounted, reactive, computed, unref } from "@vue/composition-api";
import { getWechatExtendRecords } from "@/api/dataManagement";

import BasicTable from "@/components/table/basic-table";
import CommonTree from "../reportManagement/commonTree";
import moment from "moment";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import { readFileSync } from "fs";

const defFormState = {
  dateType: 0,
  orgUserIdStr: "",
  orgPostIdStr: "",
  nowUserIdStr: "",
  nowPostIdStr: "",
  studentName: "",
  allocationName: "",
  extendStatus: "",
  receiveStatus: "",
  startDate: "",
  endDate: "",
};

const { id } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  components: { BasicTable, CommonTree, FilterByTimePeriod },
  setup(props, { root, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const formState = reactive({ ...defFormState });

    const inheritanceList = computed(() => [
      {
        label: root.$t("对应无绑定关系继承"),
        value: -1,
      },
      {
        label: root.$t("成功发起接替,待24小时后自动接替,并不代表最终接替成功"),
        value: 0,
      },
      {
        label: root.$t("90天内转接超2次"),
        value: 40128,
      },
      {
        label: root.$t("原跟进人与接手人一样，不可继承"),
        value: 40130,
      },
      {
        label: root.$t("原学管不是客户的跟进人"),
        value: 40131,
      },
      {
        label: root.$t("不合法的外部联系人userid"),
        value: 40096,
      },
      {
        label: root.$t("成员尚未实名认证"),
        value: 40098,
      },
      {
        label: root.$t("当前客户正在转接中"),
        value: 40129,
      },
    ]);

    const inheritanceListMap = computed(() => {
      return unref(inheritanceList).reduce(
        (pre, next) => ((pre[next["value"]] = next.label), pre),
        {}
      );
    });

    const successionList = computed(() => [
      {
        label: root.$t("全部"),
        value: "",
      },
      {
        label: root.$t("无操作绑定"),
        value: 0,
      },
      {
        label: root.$t("接替完毕"),
        value: 1,
      },
      {
        label: root.$t("等待接替"),
        value: 2,
      },
      {
        label: root.$t("客户拒绝"),
        value: 3,
      },
      {
        label: root.$t("接替成员客户达到上限"),
        value: 4,
      },
      {
        label: root.$t("无接替记录"),
        value: 5,
      },
    ]);

    const successionListMap = computed(() => {
      return unref(successionList).reduce(
        (pre, next) => ((pre[next["value"]] = next.label), pre),
        {}
      );
    });
    const handleOriginLAChange = (val, valName) => {
      switch (valName) {
        case "postIdList":
          formState.orgPostIdStr = val.join(",");
          break;
        case "userIdList":
          formState.orgUserIdStr = val.join(",");
          break;
        case "clear":
          formState.orgPostIdStr = "";
          formState.orgUserIdStr = "";
          break;
      }
    };

    const handleNewLAChange = (val, valName) => {
      switch (valName) {
        case "postIdList":
          formState.nowPostIdStr = val.join(",");
          break;
        case "userIdList":
          formState.nowUserIdStr = val.join(",");
          break;
        case "clear":
          formState.nowPostIdStr = "";
          formState.nowUserIdStr = "";
          break;
      }
    };

    const tableState = reactive({
      total: 0,
      page: 1,
      limit: 50,
      data: [],
      loading: false,
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          {
            label: root.$t("原学管姓名"),
            prop: "orgXgUserName",
          },
          {
            label: root.$t("新学管姓名"),
            prop: "nowXgUserName",
          },
          {
            label: root.$t("学生姓名"),
            render: (h, { row }) => (
              <el-button type="text">
                <router-link
                  to={{
                    name: `studentInfo`,
                    query: {
                      studentId: row.studentId,
                      studentName: row.studentName,
                    },
                  }}
                >
                  {row.studentName}
                </router-link>
              </el-button>
            ),
          },
          {
            label: root.$t("家长ID"),
            render: (h, { row }) => (
              <el-button type="text">
                <router-link
                  to={{
                    name: `parentInfo`,
                    query: { parentUserId: row.parentUserId },
                  }}
                >
                  {row.parentUserId}
                </router-link>
              </el-button>
            ),
          },
          { label: root.$t("家长微信"), prop: "parentWeChat" },
          {
            label: root.$t("继承情况"),
            render: (h, { row }) => unref(inheritanceListMap)[row.extendStatus],
          },
          {
            label: root.$t("接替状态"),
            render: (h, { row }) => unref(successionListMap)[row.receiveStatus],
          },
          { label: root.$t("分配人"), prop: "allocationName" },
          {
            label: root.$t("分配时间"),
            render: (h, { row }) =>
              moment(row.allocationDateTime).format("YYYY-MM-DD HH:mm:ss"),
          },
        ];
      }),
    });

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    const handleReset = () => {
      const { orgUserIdStr, orgPostIdStr, nowUserIdStr, nowPostIdStr } =
        formState;
      Object.assign(formState, {
        ...defFormState,
        orgUserIdStr,
        orgPostIdStr,
        nowUserIdStr,
        nowPostIdStr,
      });
    };

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const { ...rest } = formState;
        const res = await getWechatExtendRecords({
          ...rest,
          userId: id,
          pageNum: tableState.page,
          pageSize: tableState.limit,
        });
        Object.assign(tableState, {
          data: res?.list ?? [],
          total: res?.total ?? 0,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const resetDate = () => {
      console.log(refs.datePicker);
      refs.datePicker.reset();
    };

    onMounted(() => {
      setTimeout(() => queryTableData());
    });

    return {
      isEn,
      formState,
      tableState,
      inheritanceList,
      successionList,
      resetDate,
      handlePaginationChange,
      handleReset,
      handleOriginLAChange,
      handleNewLAChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.erd {
  padding: 24px;
}
</style>
