<template>
  <div class="content-list-wrap">
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div slot="header-right" class="tip-wrap">
        <p>
          {{ $t("数据更新时间")
          }}<span class="ml10"
            >{{ $t("T+1部分") }}：{{
              DateTimeUtils.dateClockTime(dataUpdateTime.delayTime) || "-"
            }}</span
          ><span class="ml10"
            >/ {{ $t("4H部分") }}：{{
              DateTimeUtils.dateClockTime(dataUpdateTime.realTime) || "-"
            }}</span
          >
        </p>

        <el-button
          class="mr5"
          v-if="
            Per.handleButtonPer(
              'teach.myWorkbench.myStudentNew.olReassignStudentManagement'
            )
          "
          type="primary"
          @click="assignLABySelect()"
        >
          {{ $t("重新分配") }}
        </el-button>
        <el-button
          v-if="
            Per.handleButtonPer(
              'teach.myWorkbench.myStudentNew.olBatchAllocation'
            )
          "
          type="primary"
          @click="batchAssign()"
        >
          {{ $t("批量重新分配") }}
        </el-button>
      </div>
      <el-table
        @sort-change="sortChange"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        @selection-change="handleSelectedStudent"
        ref="multipleTable"
      >
        <el-table-column
          type="selection"
          :selectable="handleSelected"
          width="50"
          fixed
        />
        <!-- 学生 -->
        <el-table-column
          fixed
          align="center"
          :label="$t('my-home-Students')"
          width="150"
          prop="studentRealName"
        >
          <template slot-scope="{ row }">
            <el-button
              @click="goStudentDetail(row.studentUserId, row.studentRealName)"
              type="text"
              >{{ row.studentRealName || "-" }}</el-button
            >
          </template>
        </el-table-column>
        <!-- 学生ID -->
        <el-table-column
          sortable="custom"
          align="center"
          :label="$t('学生ID')"
          width="120"
          prop="studentUserId"
        >
          <template slot-scope="{ row }">
            <el-button
              @click="
                operatingStudent(
                  row.studentUserId,
                  row.subjectTypeId,
                  'showStudentDrawer'
                )
              "
              type="text"
              >{{ row.studentUserId || "-" }}</el-button
            >
          </template>
        </el-table-column>
        <!-- 家长ID -->
        <el-table-column
          sortable="custom"
          align="center"
          prop="parentUserId"
          :label="$t('家长id')"
          width="120"
        >
          <template slot-scope="{ row }">
            <span>
              <router-link
                :to="{
                  path: `/studentManagement/parentInfo`,
                  query: { parentUserId: row.parentUserId },
                }"
              >
                <el-button type="text">
                  {{ row.parentUserId || "-" }}
                </el-button>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(field, idx) in showFields"
          :key="field + idx"
          align="center"
          :label="$t(fieldMap[field])"
          :sortable="fieldSortMap[field].sort ? 'custom' : false"
          :width="concatFields.includes(field) ? '200' : '150'"
          :prop="field"
        >
          <template slot-scope="{ row }">
            <span v-if="!concatFields.includes(field)">
              <span
                v-if="
                  fieldSortMap[field].type &&
                  fieldSortMap[field].type === COLUMN_TYPE.CYCLE &&
                  row[field]
                "
                >M</span
              >
              <span v-if="row[field] || row[field] === 0">
                <span
                  v-if="
                    timeFields.includes(field) ||
                    flagFields.includes(field) ||
                    field === 'subjectTypeId'
                  "
                >
                  <span v-if="timeFields.includes(field)">{{
                    DateTimeUtils.dateClockTime(row[field])
                  }}</span>
                  <span v-if="flagFields.includes(field)">
                    <span v-if="row[field] === 1">{{ $t("是") }}</span>
                    <span v-if="row[field] === 0">{{ $t("否") }}</span>
                  </span>
                  <span v-if="field === 'subjectTypeId'">
                    <span v-if="row[field] === 0">{{ $t("中文") }}</span>
                    <span v-if="row[field] === 1">{{ $t("英文") }}</span>
                  </span>
                </span>
                <span v-else>{{ row[field] }}</span>
                <span v-if="fieldSortMap[field].type">
                  <span v-if="fieldSortMap[field].type === COLUMN_TYPE.NUM">{{
                    $t("节")
                  }}</span>
                  <span v-if="fieldSortMap[field].type === COLUMN_TYPE.NTag">{{
                    $t("签")
                  }}</span>
                  <span v-if="fieldSortMap[field].type === COLUMN_TYPE.TIMES">{{
                    $t("次")
                  }}</span>
                </span>
              </span>
              <span v-else>-</span>
            </span>
            <div v-else>
              <!-- 三周约课比 -->
              <span v-if="field === 'threeWeekSchedulePercent'">
                {{ row.classCompletedLastWeekNum }} :
                {{ row.classPlannedCompletedThisWeekNum }} :
                {{ row.classScheduledNextWeekNum }}
              </span>
              <!-- 三月约课比 -->
              <span v-if="field === 'threeMonthSchedulePercent'">
                {{ row.classCompletedLastMonthNum }} :
                {{ row.classPlannedCompletedThisMonthNum }} :
                {{ row.classScheduledNextMonthNum }}
              </span>
              <!-- 订单情况 -->
              <span v-if="field === 'orderInfo'">
                <span
                  >{{ $t("待支付") }}:
                  {{ row.parentOrderPaymentPendingNum || "0" }}</span
                >
                <span
                  >{{ $t("已下单") }}:
                  {{ row.parentOrderPaymentCompletedNum || "0" }}</span
                >
                <span
                  >{{ $t("已取消") }}:
                  {{ row.parentOrderPaymentCancelNum || "0" }}</span
                >
              </span>
              <!--上次完课时间+停课天数"-->
              <span v-if="field === 'lastEndTimeWithDay'">
                {{ DateTimeUtils.dateClockTime(row.lastClassEndTime) }}
                {{ row.lastClassEndTime ? "+" : "-" }}
                {{ row.lastClassEndTimeCycle }}
              </span>
              <!-- 时差 -->
              <span v-if="field === 'parentTimeDifference'">
                {{ getTimeDifference(row.parentTimeDifference) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <!-- 最近备注内容 -->
        <el-table-column
          align="center"
          prop="lastThreeFollowContents"
          :label="$t('最近跟进内容')"
          :min-width="300"
        >
          <template slot-scope="{ row }">
            <div
              class="note_wrap mb5"
              v-for="note in row.lastThreeFollowContents"
              :key="note.id"
            >
              <el-tag>{{ $t(FOLLOW_LABEL[note.followType]) }}</el-tag>
              <el-popover placement="top" width="300" trigger="hover">
                <div>
                  <div>
                    <el-tag>{{ $t(FOLLOW_LABEL[note.followType]) }}</el-tag>
                    <span>{{ note.createUsername }}</span>
                    <span>{{
                      DateTimeUtils.dateClockTime(note.createTime)
                    }}</span>
                  </div>
                  <el-input
                    class="mt5"
                    type="textarea"
                    :value="note.content"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                  ></el-input>
                </div>
                <span slot="reference">
                  {{ getNote(note.content) }}
                </span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" fixed="right" width="150">
          <template slot="header">
            <span>{{ $t("操作") }}</span>
            <i
              style="cursor: pointer"
              class="el-icon-setting"
              @click="isShowFiledsConfigDialog = true"
            ></i>
          </template>
          <template slot-scope="{ row }">
            <span class="operation-col">
              <span class="icon-btn">
                <img
                  v-if="row.bindWechat === 1"
                  class="icon"
                  src="@/assets/wechat-active.png"
                  @click="handleViewWechatDetails(row)"
                />
                <img
                  v-else
                  class="icon"
                  src="@/assets/wechat.png"
                  @click="
                    $router.push({
                      name: 'parentWechatBinding',
                      query: { parentId: row.parentUserId },
                    })
                  "
                />
              </span>
              <!-- 复制链接 -->
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('复制链接')"
                placement="top-start"
              >
                <span class="icon-btn" @click="openCopyLinkDialog(row)">
                  <img class="icon" src="@/assets/copy-icon.png" />
                </span>
              </el-tooltip>
              <!-- 测评链接 -->
              <el-tooltip
                v-if="
                  Per.handleButtonPer('teach.myWorkbench.myStudent.testlink')
                "
                class="item"
                effect="dark"
                :content="$t('测评链接')"
                placement="top-start"
              >
                <span class="icon-btn" @click="copyTestLink(row)">
                  <img class="icon" src="@/assets/test-link.png" />
                </span>
              </el-tooltip>
              <!-- Follow -->
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('Follow')"
                placement="top-start"
              >
                <span
                  class="icon-btn"
                  @click="
                    operatingStudent(
                      row.studentUserId,
                      row.subjectTypeId,
                      'showFollowDrawer'
                    )
                  "
                >
                  <img class="icon" src="@/assets/follow.png" />
                </span>
              </el-tooltip>
              <!-- 查看海报 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ $t("查看海报")
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myStudent.chinesePoster'
                      )
                    "
                    @click.native="showPosterDialog(row, 'zh')"
                    >{{ $t("中文海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myStudent.englishPoster'
                      )
                    "
                    @click.native="showPosterDialog(row, 'en')"
                    >{{ $t("英文海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    :disabled="
                      !Per.handleButtonPer(
                        'teach.myWorkbench.myStudent.mathPoster'
                      )
                    "
                    @click.native="showPosterDialog(row, 'ma')"
                    >{{ $t("数学海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="showPosterDialog(row, 'mu')"
                    >{{ $t("音乐海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(row, 'zh', 'ops/poster/list/group')
                    "
                    >{{ $t("中文团购海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(row, 'en', 'ops/poster/list/group')
                    "
                    >{{ $t("英文团购海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(row, 'ma', 'ops/poster/list/group')
                    "
                    >{{ $t("数学团购海报") }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
    <!-- 海报弹窗  -->
    <PosterPopUp
      v-if="currentItem && isShowPosterDialog"
      :show="isShowPosterDialog"
      :lang="posterLang"
      :info="currentItem"
      @handleClose="isShowPosterDialog = false"
      :loc="loc"
    />
    <!-- 复制链接弹窗  -->
    <CopyLinkDialog
      v-if="currentItem && isShowCopyLinkDialog"
      :visible.sync="isShowCopyLinkDialog"
      :currentItem="currentItem"
      :lang="linkLang"
    />
    <!-- 字段配置弹窗 -->
    <FiledsConfigDialog
      v-if="isShowFiledsConfigDialog"
      :visible.sync="isShowFiledsConfigDialog"
      @configCb="configCb"
      :showFields="showFields"
    />
    <ParentsWechatDetails
      :parentId="parentsWechatDetailsInfo.parentId"
      :visible.sync="parentsWechatDetailsInfo.visible"
      @close="getTableData"
    />
    <!-- 学员数据抽屉 -->
    <el-drawer :title="$t('学员数据')" :visible.sync="showStudentDrawer">
      <div v-if="showStudentDrawer" style="width: 600px">
        <StudentData
          @close="showStudentDrawer = false"
          :studentID="studentID"
          :subjectTypeId="subjectTypeId"
        />
      </div>
    </el-drawer>
    <!-- 跟进学员抽屉 -->
    <el-drawer :title="$t('学员Follow up')" :visible.sync="showFollowDrawer">
      <div style="width: 600px; height: 100%">
        <FollowDrawer
          @refresh="
            (showFollowDrawer = false), (pageState.pageNum = 1), getTableData()
          "
          :studentId="studentID"
          :courseType="subjectTypeId"
          @close="showFollowDrawer = false"
        />
      </div>
    </el-drawer>
    <!-- 批量分配学管 -->
    <BatchAssignDialog
      v-if="showBatchAssignDialog"
      :visible.sync="showBatchAssignDialog"
      @uploadSuccess="handleUploadAssignSuccess"
    >
    </BatchAssignDialog>
    <!-- 选择分配 -->
    <AssignLADialog
      v-if="showAssignDialogBySelect"
      :visible.sync="showAssignDialogBySelect"
      :selectedItems="selectedItems"
      @assignSuccess="assignSuccess"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  onMounted,
  unref,
} from "@vue/composition-api";
import CopyLinkDialog from "@/views/myWorkbench/components/copyLinkDialog.vue";
import PosterPopUp from "@/views/myWorkbench/components/posterPopUp.vue";
import FiledsConfigDialog from "./filedsConfigDialog.vue";
import StudentData from "@/views/myWorkbench/components/studentDataDrawer";
import FollowDrawer from "@/views/myWorkbench/components/followDrawer";
import ParentsWechatDetails from "@/views/studentManagement/components/ParentsWechatDetails";
import { FUNCTION_POINT } from "../../dataConfig/constant";
import {
  fieldMap,
  fieldSortMap,
  defaultTableColumnData,
} from "../../dataConfig/filter";
import { FOLLOW_LABEL, COLUMN_TYPE } from "../../dataConfig/enum";
import { copyLink } from "@/utils/file";
import EVENT_NAME from "@/utils/event_name";
import BatchAssignDialog from "./batchAssignDialog.vue";
import AssignLADialog from "./assignLaDialog.vue";
import Constants from "@/utils/constants";

export default defineComponent({
  components: {
    CopyLinkDialog,
    PosterPopUp,
    FiledsConfigDialog,
    StudentData,
    FollowDrawer,
    ParentsWechatDetails,
    BatchAssignDialog,
    AssignLADialog,
  },
  setup(props, { root, emit, refs }) {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    const { id, userName } = userInfo;
    const linkLang = ref("0");
    const selectedItems = ref([]);
    const concatFields = [
      "threeWeekSchedulePercent",
      "threeMonthSchedulePercent",
      "orderInfo",
      "lastEndTimeWithDay",
      "parentTimeDifference",
    ];
    const timeFields = [
      "lastHandoverTime",
      "lastFollowTime",
      "nextClassStartTime",
      "lastOrderTime",
      "parentRemainingPunchInTime",
    ];

    const flagFields = [
      "parentRemainingPunchIn",
      "parentRemainingPunchInUpload",
      "thisMonthHasOrder",
    ];
    const _privateParams = ref({});
    const showFields = ref([]);
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const currentItem = ref(null);
    const posterLang = ref(null);
    const tableData = ref([]);
    const flagState = reactive({
      loading: false,
      isShowCopyLinkDialog: false,
      isShowPosterDialog: false,
      isBatch: false,
      isShowFiledsConfigDialog: false,
      showStudentDrawer: false,
      showFollowDrawer: false,
      showBatchAssignDialog: false,
      showAssignDialogBySelect: false,
    });
    const parentsWechatDetailsInfo = reactive({
      parentId: void 0,
      visible: false,
    });

    const pageState = reactive({
      pageSize: 50,
      pageNum: 1,
    });

    const orderState = reactive({
      orderBy: "",
      asc: "",
    });

    const dataUpdateTime = reactive({
      delayTime: null,
      realTime: null,
    });

    const total = ref(0);

    const sortChange = ({ column, prop, order }) => {
      if (!order) {
        Object.assign(orderState, { orderBy: "", asc: "" });
        Object.assign(_privateParams.value, orderState);
      } else {
        const asc = order === "ascending" ? "asc" : "desc";
        if (prop === "lastEndTimeWithDay") {
          Object.assign(orderState, { orderBy: "lastClassEndTime", asc });
          Object.assign(_privateParams.value, orderState);
        } else {
          Object.assign(orderState, { orderBy: prop, asc });
          Object.assign(_privateParams.value, orderState);
        }
      }
      getTableData();
    };

    const getTimeDifference = (time) => {
      time += "";
      if (time === "0") return root.$t("无时差");
      const hour = parseInt(
        time.startsWith("-") ? time.substr(1) / 60 : time / 60
      );
      const minute = parseInt(
        time.startsWith("-") ? time.substr(1) % 60 : time % 60
      );
      const radioVal = time.startsWith("-") ? "-" : "+";
      return minute
        ? `${radioVal} ${hour}${root.$t("小时")}${minute}${root.$t("分钟")}`
        : `${radioVal} ${hour}${root.$t("小时")}`;
    };

    // 获取显示字段
    const getShowOrHideFields = () => {
      const hasConfig = window.localStorage.getItem("configFields");
      root.$Api.studentManagement
        .getShowOrHideFields(FUNCTION_POINT, 0)
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          let columnData = data?.data?.fieldList.length
            ? data?.data?.fieldList
            : hasConfig
            ? []
            : defaultTableColumnData;
          showFields.value = columnData
            .sort((a, b) => a.seq - b.seq)
            .map((item) => item.field);
        })
        .catch(() => {
          showFields.value = [];
        });
    };

    // 字段配置完毕
    const configCb = () => {
      window.localStorage.setItem("configFields", true);
      getShowOrHideFields();
      flagState.isShowFiledsConfigDialog = false;
    };

    const handleViewWechatDetails = (row) => {
      parentsWechatDetailsInfo.parentId = row.parentUserId;
      parentsWechatDetailsInfo.visible = true;
    };

    // 复制专属链接弹窗
    const openCopyLinkDialog = (row) => {
      linkLang.value = Constants.subjectTypeMap[row.subjectTypeId];
      flagState.isShowCopyLinkDialog = true;
      currentItem.value = row;
    };
    const loc = ref("");
    // 海报弹窗
    const showPosterDialog = (row, lang, locString) => {
      loc.value = locString || "ops/poster/list";
      flagState.isShowPosterDialog = true;
      currentItem.value = row;
      posterLang.value = lang;
    };

    // 复制测评链接
    const copyTestLink = async (row) => {
      if (row.courseType !== 2) {
        return root.$notify.error(root.$t("暂无链接"));
      }
      const link = `https://student.lingoace.com/evaluate/result/index.html?studentId=${row.studentUserId}`;
      await copyLink(link).then(
        () => {
          root.$notify({
            message: root.$t("复制成功"),
            type: "success",
          });
        },
        () => {
          root.$notify({
            message: root.$t("复制失败"),
            type: "error",
          });
        }
      );
    };
    const studentID = ref(-1);
    const subjectTypeId = ref(-1);
    // 显示学生数据
    const operatingStudent = (stuId, subId, event) => {
      studentID.value = stuId;
      subjectTypeId.value = subId;
      flagState[event] = true;
    };

    const goStudentDetail = (studentId, studentName) => {
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${studentId}&studentName=${studentName}`
      );
    };

    const getNote = (content) => {
      return content?.length > 20 ? content.slice(0, 20) : content;
    };

    const getParseNote = (content) => {
      content = content.replace(/\n/g, "<br/>");
      return content;
    };

    const getTableData = () => {
      const params = _privateParams.value;
      flagState.loading = true;
      const queryParams = Object.assign(params, { ...pageState, userId: id });
      root.$Api.studentManagement
        .getStudentListNew(queryParams)
        .then(({ data }) => {
          if (data.code !== 200) {
            return Promise.reject();
          }
          tableData.value = data.data.list;
          flagState.loading = false;
          total.value = data.data?.total;
        })
        .catch(() => {
          tableData.value = [];
          flagState.loading = false;
        });
    };

    const getCurrentPage = (page) => {
      pageState.pageNum = page;
      getTableData();
    };

    const getPerPage = (perPage) => {
      pageState.pageSize = perPage;
      getTableData();
    };

    const batchAssign = () => {
      flagState.showBatchAssignDialog = true;
    };

    const assignLABySelect = () => {
      if (!unref(selectedItems).length)
        return root.$notify.warning(root.$t("请选择重新分配的学生"));
      flagState.showAssignDialogBySelect = true;
    };

    const handleSelectedStudent = (students) => {
      selectedItems.value = students;
    };

    const handleSelected = (row, index) => {
      if (row.xgUserId !== null) {
        return true;
      } else {
        return false;
      }
    };

    const assignSuccess = () => {
      refs.multipleTable.clearSelection();
      flagState.showAssignDialogBySelect = false;
      getTableData();
    };

    const handleUploadAssignSuccess = () => {
      flagState.showBatchAssignDialog = false;
      getTableData();
    };

    onMounted(() => {
      root.$eventBus.$on("triggerSearch", (params) => {
        _privateParams.value = Object.assign({}, orderState, params);
        pageState.pageNum = 1;
        getTableData();
      });
      getShowOrHideFields();
      root.$Api.studentManagement
        .getDataUpdateTime()
        .then(({ data }) => {
          if (data.code !== 200) return Promise.reject();
          Object.assign(dataUpdateTime, data.data);
        })
        .catch(() => {});
    });
    return {
      linkLang,
      studentID,
      subjectTypeId,
      isEn,
      tableData,
      pageState,
      showFields,
      currentItem,
      posterLang,
      concatFields,
      total,
      timeFields,
      flagFields,
      _privateParams,
      parentsWechatDetailsInfo,
      orderState,
      dataUpdateTime,
      ...toRefs(flagState),
      selectedItems,

      handleViewWechatDetails,
      openCopyLinkDialog,
      configCb,
      showPosterDialog,
      copyTestLink,
      operatingStudent,
      goStudentDetail,
      getNote,
      getTableData,
      getShowOrHideFields,
      getPerPage,
      getCurrentPage,
      sortChange,
      getParseNote,
      getTimeDifference,
      batchAssign,
      handleSelected,
      handleSelectedStudent,
      assignLABySelect,
      assignSuccess,
      handleUploadAssignSuccess,

      /**enum */
      FOLLOW_LABEL,
      fieldSortMap,
      fieldMap,
      COLUMN_TYPE,
      loc
    };
  },
});
</script>
<style lang="scss" scoped>
.content-list-wrap {
  .icon-btn {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 20px;
    font-size: 15px;
    color: #409eff;
    cursor: pointer;
  }
  .icon-btn-disable {
    color: rgb(204, 199, 199);
  }
  .icon {
    width: 18px;
    height: 18px;
  }
  .note_wrap {
    text-align: left;
  }
  .tip-wrap {
    color: #99a9bf;
    font-size: 14px;
    text-align: right;
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #7580e5;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
