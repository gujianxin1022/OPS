<template>
  <div class="trail-student-table">
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
        border
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column
          fixed
          align="center"
          :label="$t('序号')"
          :width="currentLang == 'en' ? 110 : 50"
        >
          <template slot-scope="scope">{{
            (pageState.pageNum - 1) * pageState.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <!-- 商机ID -->
        <el-table-column
          fixed
          align="center"
          :label="$t('商机id')"
          :width="140"
          prop="dealsId"
        >
        </el-table-column>
        <!-- 学生 -->
        <el-table-column
          fixed
          align="center"
          prop="studentRealName"
          :label="$t('my-home-Student')"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studentStatus === 3">学生已删除</span>
            <el-button
              v-else
              @click="
                goStudentDetail(scope.row.studentId, scope.row.studentRealName)
              "
              type="text"
              >{{ scope.row.studentRealName }}
            </el-button>
          </template>
        </el-table-column>
        <!-- 家长ID  -->
        <el-table-column
          fixed
          width="150"
          align="center"
          :label="$t('家长id')"
          prop="parentUserId"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goParentDetail(scope.row.parentUserId)"
              >{{ scope.row.parentUserId }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          :label="$t('商机状态')"
          prop="dealsStage"
        >
        </el-table-column>
        <el-table-column
          width="150"
          align="center"
          :label="$t('家长首单时间')"
          prop="firstPayTime"
        >
          <template slot-scope="{ row }">
            {{ DateTimeUtils.dateClockTime(row.firstPayTime) }}
          </template>
        </el-table-column>
        <!-- 地区 -->
        <el-table-column
          align="center"
          :label="$t('my-home-2-Country of Residence')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="area"
        ></el-table-column>
        <!-- 课程顾问 -->
        <el-table-column
          align="center"
          :label="$t('课程顾问')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="adviser"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('学管')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="xgUserName"
        ></el-table-column>
        <!-- 学科 -->
        <el-table-column
          align="center"
          :label="$t('学科')"
          width="120"
          prop="subjects"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.subjects && scope.row.subjects.length">
              <span v-for="(subject, idx) in scope.row.subjects" :key="subject">
                <span v-if="subject === 0">{{ $t("中文") }}</span>
                <span v-if="subject === 1">{{ $t("英文") }}</span>
                <span v-if="subject === 2">{{ $t("数学") }}</span>
                <span v-if="subject === 3">{{ $t("音乐") }}</span>
                <span v-if="subject === 6">{{ $t("单词通") }}</span>
                <span v-if="idx !== scope.row.subjects.length - 1">、</span>
              </span>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- 推荐人 -->
        <el-table-column
          align="center"
          :label="$t('my-home-Referrer')"
          prop="name"
          width="160px"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="goRefferUserDetail(scope.row)"
              >{{ scope.row.referrerName || scope.row.referrerId }}
            </el-button>
          </template>
        </el-table-column>
        <!-- 商机创建时间 -->
        <el-table-column
          align="center"
          :label="$t('商机创建时间')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="dealsCreateTime"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.dealsCreateTime)
            }}</span>
          </template>
        </el-table-column>
        <!-- 试听课信息 -->
        <el-table-column
          align="center"
          :label="$t('试听课信息')"
          :width="currentLang == 'en' ? 150 : 120"
          prop="attemptCourseInfos"
        >
          <template slot-scope="scope">
            <p
              v-for="item in scope.row.attemptCourseInfos"
              :key="item.course + item.status"
            >
              <span>{{
                currentLang === "en" ? item.courseEn : item.courseZh
              }}</span>
              <span>{{ item.status | mapStudentProcess }}</span>
            </p>
          </template>
        </el-table-column>
        <!-- 课程进度 -->
        <el-table-column
          align="center"
          :label="$t('schedule-课表')"
          :width="300"
          prop="plannedSpeeds"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.plannedSpeeds && scope.row.plannedSpeeds.length"
            >
              <div
                v-for="item in scope.row.plannedSpeeds"
                :key="item.studentPlanId"
              >
                <div>
                  <span v-if="item.subjectSpeedEn || item.subjectSpeedZh"
                    >{{
                      currentLang === "en"
                        ? item.subjectSpeedEn || "-"
                        : item.subjectSpeedZh || "-"
                    }}：</span
                  >
                  <span v-else>{{ $t("无进度") }}：</span>
                  <!-- 交接过，直接展示学管名称，隐藏交接按钮 -->
                  <template v-if="item.hasLa">
                    <span>{{ item.xgUserName }}</span>
                  </template>
                  <!-- 没交接过 -->
                  <template v-else>
                    <span>-</span>
                    <!-- 可以交接 -->
                    <el-button
                      v-if="item.handover"
                      type="text"
                      @click="onHandover(scope.row, item)"
                      >{{ $t("交接") }}</el-button
                    >
                    <!-- 不可交接：显示交接按钮并置灰：nonHandoverStatus - 1：无对应课时进度 2：交接中-->
                    <template v-else>
                      <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        :content="
                          item.nonHandoverStatus === 1
                            ? $t('无付费课时，无法交接')
                            : $t('交接中')
                        "
                      >
                        <span
                          style="
                            color: #c0c4cc;
                            height: 32px;
                            line-height: 32px;
                            cursor: pointer;
                          "
                          slot="reference"
                          >{{ $t("交接") }}</span
                        >
                      </el-popover>
                    </template>
                  </template>
                </div>
              </div>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- 剩余课时 -->
        <el-table-column
          align="center"
          :label="$t('剩余课时')"
          :width="currentLang == 'en' ? 160 : 120"
          prop="surplusCourseHours"
        >
          <template slot-scope="scope">
            <p v-for="item in scope.row.surplusCourseHours" :key="item.course">
              <span
                >{{
                  currentLang === "en" ? item.courseEn : item.courseZh
                }}：</span
              >
              <span>{{ item.surplusHours || 0 }}</span>
            </p>
          </template>
        </el-table-column>
        <!-- 订单 -->
        <el-table-column
          align="center"
          :label="$t('订单')"
          :width="currentLang == 'en' ? 160 : 120"
          prop="orders"
        >
          <template slot-scope="scope">
            <p v-for="(item, idx) in scope.row.orders" :key="idx">
              <span
                >{{ currentLang === "en" ? item.courseEn : item.courseZh }}：{{
                  item.hours || 0
                }}</span
              >
            </p>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
          align="center"
          fixed="right"
          :label="$t('操作')"
          :width="150"
        >
          <template slot-scope="scope">
            <!-- 复制链接 -->
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ $t("复制链接")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="scope.row.studentStatus === 3"
                  @click.native="showCopyLinkDialog(scope.row, 'zh')"
                  >{{ $t("复制中文链接") }}</el-dropdown-item
                >
                <el-dropdown-item
                  :disabled="
                    scope.row.studentStatus === 3 ||
                    !Per.handleButtonPer(
                      'teach.myWorkbench.myCustomer.copyELlink'
                    )
                  "
                  @click.native="showCopyLinkDialog(scope.row, 'en')"
                  >{{ $t("复制英文链接") }}</el-dropdown-item
                >
                <el-dropdown-item
                  :disabled="
                    scope.row.studentStatus === 3 ||
                    !Per.handleButtonPer(
                      'teach.myWorkbench.myCustomer.copyMAlink'
                    )
                  "
                  @click.native="showCopyLinkDialog(scope.row, 'ma')"
                  >{{ $t("复制数学链接") }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 选择海报 -->
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ $t("查看海报")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="
                    !Per.handleButtonPer(
                      'teach.myWorkbench.myCustomer.chinesePoster'
                    ) || scope.row.studentStatus === 3
                  "
                  @click.native="showPosterDialog(scope.row, 'zh')"
                  >{{ $t("中文海报") }}</el-dropdown-item
                >
                <el-dropdown-item
                  :disabled="
                    !Per.handleButtonPer(
                      'teach.myWorkbench.myCustomer.englishPoster'
                    ) || scope.row.studentStatus === 3
                  "
                  @click.native="showPosterDialog(scope.row, 'en')"
                  >{{ $t("英文海报") }}</el-dropdown-item
                >
                <el-dropdown-item
                  :disabled="
                    !Per.handleButtonPer(
                      'teach.myWorkbench.myCustomer.mathPoster'
                    ) || scope.row.studentStatus === 3
                  "
                  @click.native="showPosterDialog(scope.row, 'ma')"
                  >{{ $t("数学海报") }}</el-dropdown-item
                >
                <el-dropdown-item
                    @click.native="showPosterDialog(scope.row, 'mu')"
                    >{{ $t("音乐海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="showPosterDialog(scope.row, 'zh','ops/poster/list/group')"
                    >{{ $t("中文团购海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(scope.row, 'en', 'ops/poster/list/group')
                    "
                    >{{ $t("英文团购海报") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="
                      showPosterDialog(scope.row, 'ma', 'ops/poster/list/group')
                    "
                    >{{ $t("数学团购海报") }}</el-dropdown-item
                  >
              </el-dropdown-menu>
            </el-dropdown>
            <br />
            <el-button
              v-if="
                Per.handleButtonPer(
                  'teach.studentMT.parentInfo.reAssignLAOfDeal'
                )
              "
              :disabled="scope.row.studentStatus === 3"
              type="text"
              @click="handleReAssign(scope.row)"
              >{{ $t("重新分配") }}</el-button
            >
            <br />
            <el-button
              :disabled="scope.row.studentStatus === 3"
              type="text"
              @click="dealsFollow(scope.row)"
              >{{ $t("商机Follow") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </custom-card>
    <custom-pagination
      :total="pageState.total"
      :current-page="pageState.pageNum"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
    />
    <!-- copy el link -->
    <CopyLinkDialog
      v-if="currentItem && copyLinkVisibility"
      :visible.sync="copyLinkVisibility"
      :currentItem="currentItem"
      :lang="posterLang"
    />
    <!-- poster -->
    <PosterPopUp
      v-if="currentItem && showPoster"
      :show="showPoster"
      :info="currentItem"
      :lang="posterLang"
      @handleClose="handleClosePoster"
      :loc="loc"
    />
    <!-- 重新分配 -->
    <AssignLaDealDialog
      v-if="showReAssignDialog"
      :visible.sync="showReAssignDialog"
      :parentId="currentItem && currentItem.parentUserId"
      :currentItem="currentItem"
    />
    <!-- 商机Follow 抽屉 -->
    <DealsFollowDrawer
      v-if="showDealsFollowDrawer"
      :visible.sync="showDealsFollowDrawer"
      @followSuccess="handleFollowSucess"
      :currentItem="currentItem"
    />
    <!-- 交接 -->
    <HandoverStudents
      v-if="isShowHandoverDialog"
      :visible.sync="isShowHandoverDialog"
      :current-info="currentItem"
      :taskLine="1"
      @refreshPage="search()"
    />
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from "@vue/composition-api";
import CopyLinkDialog from "../copyLinkDialog.vue";
import PosterPopUp from "../posterPopUp.vue";
import AssignLaDealDialog from "@/views/studentManagement/components/assignLaDealDialog";
import DealsFollowDrawer from "@/views/studentManagement/components/dealsFollowDrawer";
import HandoverStudents from "@/views/Task/handoverStudents/index.vue";

export default defineComponent({
  props: {
    searchParams: {
      type: Object,
      defalut: {},
    },
  },
  components: {
    CopyLinkDialog,
    PosterPopUp,
    AssignLaDealDialog,
    DealsFollowDrawer,
    HandoverStudents,
  },
  setup(props, { root, emit, refs }) {
    watch(
      () => props.searchParams,
      (params) => {
        getTableData();
      },
      { deep: true }
    );
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const tableData = ref([]);
    const loading = ref(false);
    const currentItem = ref(null);
    const pageState = reactive({
      pageSize: 50,
      pageNum: 1,
      total: 0,
    });
    const posterLang = ref("");

    const flagState = reactive({
      copyLinkVisibility: false,
      showPoster: false,
      showReAssignDialog: false,
      showDealsFollowDrawer: false,
      isShowHandoverDialog: false,
    });

    const getCurrentPage = (page) => {
      pageState.pageNum = page;
      getTableData();
    };

    const getPerPage = (perPage) => {
      pageState.pageSize = perPage;
      getTableData();
    };

    const getTableData = () => {
      loading.value = true;
      const params = { ...pageState, ...props.searchParams };
      delete params.load;
      delete params.formState;
      delete params.businessCreateTime;
      root.$Api.studentManagement
        .getTrailDeals(params)
        .then(({ status, data: { data, code } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
          tableData.value = data.list;
          pageState.total = data.total;
          loading.value = false;
        })
        .catch(() => {
          tableData.value = [];
          pageState.total = 0;
          loading.value = false;
        });
    };

    const goParentDetail = (pid) => {
      root.$router.push(`/studentManagement/parentInfo?parentUserId=${pid}`);
    };

    const goStudentDetail = (sid, name) => {
      root.$router.push(
        `/studentManagement/studentInfo?studentId=${sid}&studentName=${name}`
      );
    };

    const search = () => {
      pageState.pageNum = 1;
      getTableData();
    };

    const onHandover = (row, course) => {
      currentItem.value = row;
      currentItem.value.course = course;
      flagState.isShowHandoverDialog = true;
    };

    const showCopyLinkDialog = (item, lang) => {
      flagState.copyLinkVisibility = true;
      currentItem.value = item;
      posterLang.value = lang;
    };
    const loc = ref("");
    const showPosterDialog = (row, lang,locString) => {
      loc.value = locString || "ops/poster/list";
      posterLang.value = lang;
      currentItem.value = row;
      flagState.showPoster = true;
    };

    const handleClosePoster = () => {
      currentItem.value = null;
      flagState.showPoster = false;
    };

    const handleReAssign = (row) => {
      currentItem.value = row;
      flagState.showReAssignDialog = true;
    };

    const dealsFollow = (row) => {
      currentItem.value = row;
      flagState.showDealsFollowDrawer = true;
    };

    const handleFollowSucess = () => {
      flagState.showDealsFollowDrawer = false;
    };

    onMounted(() => {});

    return {
      isEn,
      tableData,
      pageState,
      loading,
      currentItem,
      posterLang,
      ...toRefs(flagState),

      getTableData,
      getPerPage,
      getCurrentPage,
      showCopyLinkDialog,
      showPosterDialog,
      handleClosePoster,
      handleReAssign,
      handleFollowSucess,
      goParentDetail,
      dealsFollow,
      onHandover,
      goStudentDetail,
      search,
      loc
    };
  },
});
</script>

<style lang="scss" scoped>
.trail-student-table {
  .el-dropdown-link {
    cursor: pointer;
    color: #7580e5;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
