<template>
  <div class="teacher-slots-type-list">
    <header>
      <el-radio-group v-model="businessLine" @change="resetSearch">
        <el-radio-button :label="1">{{ $t("中文") }}</el-radio-button>
        <el-radio-button :label="2">{{ $t("英文") }}</el-radio-button>
        <el-radio-button :label="3">{{ $t("数学") }}</el-radio-button>
      </el-radio-group>
      <el-popover placement="right" width="500" trigger="click">
        <instructions-dialog></instructions-dialog>
        <template v-slot:reference>
          <el-button class="instructions" type="text">{{
            $t("使用说明")
          }}</el-button>
        </template>
      </el-popover>
      <el-button @click="goLogPage" class="fr" type="text"
        >{{ $t("设置记录") }} <i class="el-icon-d-arrow-right"></i>
      </el-button>
    </header>
    <div class="filter-warp mt20">
      <el-form label-position="top" label-width="80px" :inline="true">
        <el-form-item :label="$t('日期')">
          <FilterByWeek @changeSelect="handleCalendarChange" />
        </el-form-item>
        <el-form-item :label="$t('教管')">
          <FilterByTeachManager
            @changeSelect="
              (val) => {
                reqParams.tmUserId = val;
                (tableState.page = 1), reqList();
              }
            "
          />
        </el-form-item>
        <el-form-item :label="$t('教师')">
          <span style="display: inline-block; width: 412px">
            <FilterByUserAccount
              @change="
                (params) => {
                  userParams = params;
                }
              "
              :showSearchBtn="true"
              @search="
                () => {
                  (tableState.page = 1), reqList();
                }
              "
            />
          </span>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs
      tabPosition="top"
      v-model="reqParams.slotType"
      @tab-click="resetSearch"
    >
      <el-tab-pane :label="$t('仅试听')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('仅正式')" name="2"></el-tab-pane>
    </el-tabs>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper"
      style="margin-top: 20px"
    >
      <div slot="header-right">
        <el-button @click="dialogVisible = true" type="primary">
          {{ $t("单一设置") }}
        </el-button>
        <el-button @click="showBathDialog = true" type="primary">
          {{ $t("批量设置") }}
        </el-button>
      </div>
      <BasicTable
        :key="tableIndex"
        header-cell-class-name="my-theme-color-header"
        border
        v-loading="tableState.loading"
        :data="tableState.data"
        :column="tableState.columns"
        :page="tableState.page"
        :total="tableState.total"
        :limit="tableState.limit"
        :pagination="true"
        @pagination="handlePaginationChange"
      />
    </custom-card>
    <SlotsConfigDialog
      v-if="dialogVisible"
      :businessLine="businessLine"
      :dialogVisible.sync="dialogVisible"
      @refreshList="resetSearch"
    />
    <el-dialog
      :close-on-click-modal="false"
      :title="
        $t('批量设置') +
        '-' +
        Filters.getSubjectLabel(businessLine - 1, isEn ? 'en' : 'zh')
      "
      width="400px"
      center
      :visible.sync="showBathDialog"
    >
      <div>
        <CustomUpload
          v-if="showBathDialog"
          ref="CustomUpload"
          :config="{
            url: `/opsapi/teachermanager/teacher-manage/slot/config/ops/save/batch/${businessLine}`,
          }"
          @ok="handelBathCreateSuccess"
          :showInterfaceMsg="true"
        />
        <br />
        <br />
        <span>{{ $t("仅支持xls、xlsx格式") }}</span>
        <el-button type="text">
          <a
            href="https://s3.us-west-1.amazonaws.com/media.pplingo.com/templates/SlotsTemplate.xlsx"
            >{{ $t("下载模板") }}</a
          >
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ref, reactive, computed, onMounted } from "@vue/composition-api";
import FilterByUserAccount from "@/components/FilterItem/UserDimensionFilter/FilterByUserAccount";
import FilterByTeachManager from "@/components/FilterItem/TeacherFilter/FilterByTeachManager";
import BasicTable from "@/components/table/basic-table";
import FilterByWeek from "@/components/FilterItem/CommodityFilter/FilterByWeek.vue";
import SlotsConfigDialog from "./components/SlotsConfigDialog.vue";
import CustomUpload from "@/components/Upload/CustomUpload";
import moment from "moment";
import InstructionsDialog from "./components/InstructionsDialog.vue";

export default {
  components: {
    FilterByUserAccount,
    FilterByTeachManager,
    BasicTable,
    FilterByWeek,
    SlotsConfigDialog,
    CustomUpload,
    InstructionsDialog,
  },
  setup(props, { root, emit, refs }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const businessLine = ref(1);
    const userParams = ref({});
    const resetSearch = () => {
      tableState.page = 1;
      reqList();
    };
    function mergeTimeRanges(timeList) {
      if (!timeList.length) return "";

      const times = timeList.map((time) => new Date(`1970-01-01T${time}:00`));
      let mergedRanges = [];
      let start = times[0];
      let prev = start;

      for (let i = 1; i < times.length; i++) {
        if ((times[i] - prev) / 60000 > 30) {
          if (start.getTime() === prev.getTime()) {
            mergedRanges.push(`${start.toTimeString().slice(0, 5)}`);
          } else {
            mergedRanges.push(
              `${start.toTimeString().slice(0, 5)}～${prev
                .toTimeString()
                .slice(0, 5)}`
            );
          }
          start = times[i];
        }
        prev = times[i];
      }

      if (start.getTime() === prev.getTime()) {
        mergedRanges.push(`${start.toTimeString().slice(0, 5)}`);
      } else {
        mergedRanges.push(
          `${start.toTimeString().slice(0, 5)}～${prev
            .toTimeString()
            .slice(0, 5)}`
        );
      }

      return mergedRanges.join("，");
    }
    const reqParams = ref({
      slotType: "1",
      startTime: "",
      endTime: "",
    });
    const handleCalendarChange = (val) => {
      reqParams.value.startTime = val[0];
      reqParams.value.endTime = val[1];
      resetSearch();
    };
    const tableIndex = ref(0);
    const reqList = async () => {
      let params = {
        ...reqParams.value,
        ...userParams.value,
        pageNum: tableState.page,
        pageSize: tableState.limit,
        businessLine: businessLine.value,
      };
      try {
        tableIndex.value++;
        tableState.loading = true;
        const res = await root.$Api.tutorManagement.reqQuerySlotConfigList(
          params
        );
        res.list.forEach((e) => {
          e.timeInfoList.forEach((sub) => {
            e[sub.startTime] = mergeTimeRanges(sub.times);
          });
        });
        Object.assign(tableState, {
          data: res.list || [],
          total: res.total,
          loading: false,
        });
      } finally {
        tableState.loading = false;
      }
    };
    const tableState = reactive({
      loading: false,
      data: [],
      page: 1,
      limit: 50,
      total: 0,
      columns: computed(() => {
        let column = [];
        if (tableState.data.length) {
          let weekList = tableState.data[0].timeInfoList;
          weekList.forEach((e) => {
            column.push({
              label: moment(e.startTime)
                .locale(isEn.value ? "en" : "zh-cn")
                .format("MM.DD（ddd）"),
              minWidth: 100,
              prop: e.startTime,
            });
          });
        }
        return [
          {
            label: root.$t("序号"),
            fixed: "left",
            width: "50",
            render: (h, { $index }) =>
              (tableState.page - 1) * tableState.limit + $index + 1,
          },
          {
            fixed: "left",
            label: root.$t("教师姓名"),
            prop: "tutorIdentityName",
            minWidth: 100,
          },
          {
            label: root.$t("教师昵称"),
            prop: "tutorRealName",
            minWidth: 100,
          },
          {
            label: root.$t("教师ID"),
            prop: "tutorUserId",
            fixed: "left",
            minWidth: 130,
            render: (h, { row }) => (
              <a
                style={"color: #7580e5"}
                onClick={() => {
                  toTeacherPage(row);
                }}
              >
                {row.tutorUserId}
              </a>
            ),
          },
          {
            label: root.$t("教管"),
            prop: "tmUserName",
            minWidth: 100,
          },
          {
            label: root.$t("白名单家长数"),
            prop: "whiteParentNum",
            minWidth: 100,
          },
          ...column,
        ];
      }),
    });
    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      reqList();
    };
    const goLogPage = () => {
      root.$router.push(`/tutorManagement/teacherSlotsLogList`);
    };

    /* 单一设置 */
    const dialogVisible = ref(false);
    /* 批量设置 */
    const showBathDialog = ref(false);
    const handelBathCreateSuccess = () => {
      showBathDialog.value = false;
      resetSearch();
    };
    /* 跳转 */
    const toTeacherPage = (row) => {
      const url = `/tutorManagement/teacherInfo?id=${
        row.tutorUserId
      }&teacherName=${row.tutorRealName || ""}&tabName=teacherTimetable`;
      window.open(url, "_blank");
    };
    return {
      businessLine,
      isEn,
      userParams,
      reqParams,
      handleCalendarChange,
      reqList,
      tableState,
      resetSearch,
      handlePaginationChange,
      goLogPage,
      dialogVisible,
      showBathDialog,
      handelBathCreateSuccess,
      tableIndex,
    };
  },
};
</script>
<style lang="scss" scoped>
.teacher-slots-type-list {
  padding: 20px;
  .el-form-item__label {
    padding: 0;
  }
  .my-calendar {
    border: null;
    border-color: #ccc;
    border-width: 1px;
    border-radius: 4px;
    padding: 6px;
    color: #4a5568;
    overflow: hidden;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
}
</style>
