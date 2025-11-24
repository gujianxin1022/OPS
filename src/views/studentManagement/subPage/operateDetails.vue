<template>
  <div class="operate-details-warp">
    <el-table
      v-loading="isLoading"
      :data="tableData"
      tooltip-effect="dark"
      :border="false"
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column
        min-width="100px"
        fixed
        :label="$t('操作时间')"
        prop="name"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ DateTimeUtils.dateClockTime(scope.row.operateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('行为')"
        min-width="100px"
        prop="typeNameZh"
        align="center"
      >
        <template slot-scope="scope">
          <p>
            {{
              currentLang == "en" ? scope.row.typeNameEn : scope.row.typeNameZh
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        min-width="220px"
        :label="$t('详情')"
        prop="describeZh"
        align="center"
      >
        <template slot-scope="scope">
          <span class="detail-cell">{{
            currentLang == "en" ? scope.row.describeEn : scope.row.describeZh
          }}</span>
          <div
            v-if="
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_OUT ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_JOIN ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_OUT_SYS
            "
          >
            <el-tag
              v-if="scope.row.detail && scope.row.detail.languageLabel"
              size="mini"
              type="success"
            >
              {{
                Filters.languageLabelFilter(
                  scope.row.detail.languageLabel,
                  currentLang === "en"
                )
              }}
            </el-tag>
            <el-tag
              v-if="scope.row.detail && scope.row.detail.ageLabel"
              size="mini"
              type="danger"
            >
              {{
                Filters.ageLabelFilter(
                  scope.row.detail.ageLabel,
                  currentLang === "en"
                )
              }}</el-tag
            >
          </div>
          <div>
            <el-button
              v-if="
                scope.row.showCheckRelateBtn ||
                scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_CANCEL_SYS ||
                scope.row.type ===
                  ACTIONLO_TYPE.ACTIONLOG_Adjustment_batch_of_classes
              "
              @click="showClassDetail(scope.row)"
              type="text"
              >{{ $t("查看课堂详情") }}</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('原因')"
        prop="operateReason"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            v-if="
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_ONE ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_MORE ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_SYS ||
              scope.row.type ===
                ACTIONLO_TYPE.ACTIONLOG_OTO_ADJUST_TUTOR_LEAVE ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_OTO_ADJUST_STUDENT ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_CANCEL_SYS ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_LEAVE ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_ADJUST ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_REPAIR ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_OUT ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_INVITE_INITIATE ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_INVITE_SUCCESS ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_INVITE_FAIL ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_OTO_ADJUST_TUTOR ||
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_Change_Time_Zone ||
              scope.row.type ===
                ACTIONLO_TYPE.ACTIONLOG_Adjustment_of_classes ||
              scope.row.type ===
                ACTIONLO_TYPE.ACTIONLOG_Adjustment_batch_of_classes
            "
            :content="
              currentLang == 'en'
                ? scope.row.operateReason &&
                  (scope.row.operateReason.en || scope.row.operateReason)
                : scope.row.operateReason &&
                  (scope.row.operateReason.zh || scope.row.operateReason)
            "
            placement="top-start"
          >
            <div style="cursor: pointer">
              {{
                currentLang == "en"
                  ? scope.row.operateReason &&
                    (scope.row.operateReason.en || scope.row.operateReason)
                  : scope.row.operateReason &&
                    (scope.row.operateReason.zh || scope.row.operateReason)
              }}
            </div>
          </el-tooltip>
          <div
            class="reason-transfer"
            v-else-if="
              scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_TRANSFER
            "
          >
            {{ getReasonByTranslateClass(scope.row.info) }}
          </div>
          <div
            class="reason-transfer"
            v-else-if="scope.row.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_OUT_SYS"
          >
            {{ getReasonByOutClassSys(scope.row.info) }}
          </div>
          <div v-else>{{ scope.row.operateReason }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="userRole == 1"
        :label="$t('证明材料')"
        prop="describe"
        align="center"
      >
        <template slot-scope="scope">
          <span
            @click="search(scope.row)"
            style="color: #7580e5; cursor: pointer"
            >{{ $t("查看") }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        :label="$t('操作人')"
        prop="operateUserName"
        align="center"
      ></el-table-column>
      <el-table-column :label="$t('操作人身份')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operateUserRole == 1">{{
            $t("my-home-Parent")
          }}</span>
          <span v-else-if="scope.row.operateUserRole == 2">{{
            $t("my-home-Student")
          }}</span>
          <span v-else-if="scope.row.operateUserRole == 3">{{
            $t("老师")
          }}</span>
          <span v-else-if="scope.row.operateUserRole == 4">{{
            $t("my-home-Ambassador")
          }}</span>
          <span v-else-if="scope.row.operateUserRole == 6">{{
            $t("系统")
          }}</span>
          <span v-else>{{ $t("OPS用户") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作平台')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operatePlatform == 1">{{ $t("家长端") }}</span>
          <span v-else-if="scope.row.operatePlatform == 2">{{
            $t("学生端")
          }}</span>
          <span v-else-if="scope.row.operatePlatform == 3">{{
            $t("老师端")
          }}</span>
          <span v-else-if="scope.row.operatePlatform == 4">{{
            $t("城市合伙人端")
          }}</span>
          <span v-else-if="scope.row.operatePlatform == 6">ZOHO</span>
          <span v-else-if="scope.row.operatePlatform == 7">LTO</span>
          <span v-else-if="scope.row.operatePlatform == 8">AI Chatbot-OPS</span>
          <span v-else>{{ $t("OPS端") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('操作设备')"
        prop="operateDevice"
        width="280"
        align="center"
      ></el-table-column>
      <el-table-column
        :label="$t('操作地点')"
        prop="operateIpCountry"
        align="center"
        width="220"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.operateIpCountry == null">{{
            $t("--")
          }}</span>
          <span v-show="scope.row.operateIpCountry"
            >{{ $t(scope.row.operateIpCountry) }}（{{
              scope.row.operateIp
            }}）</span
          >
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="total"
      :current-page="currentPage"
      :pageSize="gotPageObj.pageSize"
      @getCurrentPage="getCurrentPage"
      @getPerPage="getPerPage"
      :pageSizes="[10, 20, 30, 50, 100]"
    />
    <el-dialog
      top="30px"
      :title="$t('证明材料')"
      class="poster-dialog"
      :visible.sync="posterVisibility"
      width="40%"
      :before-close="handleClose"
    >
      <div class="poster">
        <swiper ref="mySwipers" :options="swiperOptions">
          <swiper-slide
            :style="{ height: swiperHeight }"
            v-for="(item, index) in swiperSrcList"
            :key="index"
          >
            <img
              ref="post6"
              :src="item"
              alt=""
              style="width: 100%; height: 100%"
            />
          </swiper-slide>
          <div
            class="swiper-button-prev"
            slot="button-prev"
            @click="prev"
          ></div>
          <div
            class="swiper-button-next"
            slot="button-next"
            @click="next"
          ></div>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </el-dialog>
    <!-- 关联课堂详情 -->
    <el-dialog
      top="15vh"
      :title="$t('课堂详情')"
      class="poster-dialog"
      :visible.sync="showRelationClassDetail"
      width="600px"
      :close-on-click-modal="false"
      :before-close="
        () => {
          showRelationClassDetail = false;
        }
      "
    >
      <el-table
        v-loading="detailLoading"
        :data="detailList"
        style="width: 100%; height: 400px; overflow: scroll"
      >
        <el-table-column :label="$t('序号')" width="180">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :label="
            rowType === ACTIONLO_TYPE.ACTIONLOG_SMALL_CANCEL_SYS
              ? $t('课程ID')
              : $t('课程ID(学生课表)')
          "
          width="180"
        >
        </el-table-column>
        <el-table-column prop="startTime" :label="$t('上课时间')">
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showRelationClassDetail = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 单次/多次约课日志课堂详情 -->
    <el-dialog
      top="15vh"
      :title="$t('课堂详情')"
      class="poster-dialog"
      :visible.sync="showBookClassDetail"
      width="600px"
      :close-on-click-modal="false"
      :before-close="
        () => {
          showBookClassDetail = false;
        }
      "
    >
      <div slot="title">
        <span style="font-size: 18px; color: #303133">{{
          $t("课堂详情")
        }}</span>
        <span style="font-size: 14px; color: #909399">
          （{{ $t("预约状态是操作约课时当时的状态，非当前最新状态") }}）
        </span>
      </div>
      <el-table
        v-loading="detailLoading"
        :data="detailList"
        style="width: 100%; height: 400px; overflow: scroll"
      >
        <el-table-column :label="$t('序号')" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentTimetableId"
          :label="$t('课程ID(学生课表)')"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="startTime" :label="$t('上课时间')">
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('预约状态')">
          <template slot-scope="{ row }">
            <span
              v-if="row.status"
              :style="`color:${statusMap[row.status].color}`"
            >
              {{ $t(statusMap[row.status].text) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('原因')">
          <template slot-scope="{ row }">
            <span v-if="row.cannotReason">
              {{ $t(cannotReasonMap[row.cannotReason]) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showBookClassDetail = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 批量调课日志课堂详情 -->
    <el-dialog
      top="15vh"
      :title="$t('课堂详情')"
      class="poster-dialog"
      :visible.sync="showBatchAdjustClassDetail"
      width="600px"
      :close-on-click-modal="false"
      :before-close="
        () => {
          showBatchAdjustClassDetail = false;
        }
      "
    >
      <el-table
        v-loading="detailLoading"
        :data="detailList"
        style="width: 100%; height: 400px; overflow: scroll"
      >
        <el-table-column :label="$t('序号')" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentTimetableId"
          :label="$t('课程ID(学生课表)')"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="startTime" :label="$t('调整前时间')">
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.outStartTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" :label="$t('调整后时间')">
          <template slot-scope="scope">
            {{ DateTimeUtils.dateClockTime(scope.row.enterStartTime) }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showBatchAdjustClassDetail = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import { TRANSLATE_CLASS_REASON_TYPES, ACTIONLO_TYPE } from "@/utils/constants";
import filters from "@/utils/filters";
import { getPlatformInfo } from "@lingoace/environment-lingoace"; //环境变量sdk
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    userRole: {
      type: [String, Number],
      default: "",
    },
    activeTab: {
      type: String,
      default: "",
    },
    currentCoursePkg: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      TRANSLATE_CLASS_REASON_TYPES,
      ACTIONLO_TYPE,
      isLoading: false,
      detailLoading: false,
      gotPageObj: {
        pageNum: 1,
        pageSize: 50,
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      srcList: [],
      swiperSrcList: [],
      filePdf: "",
      posterVisibility: false,
      swiperOptions: {
        loop: true,
        navigation: {
          prevEl: "swiper-button-prev",
          nextEl: "swiper-button-next",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        on: {
          slideChange: function () {},
        },
        swiperHeight: null,
      },
      showRelationClassDetail: false,
      detailList: [],
      rowType: -1,
      tableHeight:
        getPlatformInfo().os === "Mac OS" ? window.innerHeight - 300 : "310px",
      showBookClassDetail: false,
      showBatchAdjustClassDetail: false,
      statusMap: {
        1: { text: "不可约", color: "#F56C6C" },
        2: { text: "预约", color: "#67C23A" },
        3: { text: "预占", color: "#409EFF" },
      },
      cannotReasonMap: {
        1: "老师时间被占",
        2: "学生时间被占",
        3: "当日系统维护",
      },
    };
  },
  created() {
    let swiper = new Swiper(".swiper-container");
    this.swiperHeight =
      ((document.documentElement.clientWidth * 0.4 - 40) * 0.6 * 1332) / 750 +
      "px";
  },
  watch: {
    activeTab(val) {
      if (val && val === "operateDetail") {
        this.getTableData();
      }
    },
    currentCoursePkg(val) {
      if (this.activeTab === "operateDetail") {
        this.getTableData();
      }
    },
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {
    async showClassDetail(row) {
      const infoDetail = JSON.parse(row.info);
      this.rowType = row.type;
      this.detailLoading = true;
      row.type === this.ACTIONLO_TYPE.ACTIONLOG_SMALL_CANCEL_SYS;
      try {
        let res;
        if (row.type === this.ACTIONLO_TYPE.ACTIONLOG_SMALL_CANCEL_SYS) {
          res = await this.$Api.handleManagement.getRelatedSmallClassDetail(
            infoDetail.virtualclassIdList
          );
          this.showRelationClassDetail = true;
        } else if ([2, 3].includes(row.type)) {
          res = await this.$Api.handleManagement.reqOtoScheduleLogClassDetail({
            id: row.id,
          });
          this.showBookClassDetail = true;
        } else if (
          row.type === this.ACTIONLO_TYPE.ACTIONLOG_Adjustment_batch_of_classes
        ) {
          res =
            await this.$Api.handleManagement.reqOtoBatchAdjustmentLogClassDetail(
              {
                id: row.id,
              }
            );
          this.showBatchAdjustClassDetail = true;
        } else {
          res = await this.$Api.handleManagement.getRelatedClassDetail(
            infoDetail.studentTimetableIdList
          );
          this.showRelationClassDetail = true;
        }
        this.detailList = res || [];
      } finally {
        this.detailLoading = false;
      }
    },
    getReasonByTranslateClass(info) {
      const infoDetail = JSON.parse(info);
      if (infoDetail.reasonType === TRANSLATE_CLASS_REASON_TYPES.OTHER) {
        return infoDetail.reasonDesc;
      } else {
        return filters.translateClassTeasonFilter(
          infoDetail.reasonType,
          this.currentLang === "en"
        );
      }
    },
    getReasonByOutClassSys(info) {
      const infoDetail = JSON.parse(info);
      return filters.removeClassTeasonFilter(
        infoDetail.reasonType,
        this.currentLang === "en"
      );
    },
    handleClose() {
      this.posterVisibility = false;
    },
    // 查看附件
    search(row) {
      this.swiperSrcList = [];
      try {
        let info = JSON.parse(row.info);
        let arr = JSON.parse(info.newCertificate);
        for (var i in arr) {
          if (arr[i].lastIndexOf(".pdf") != -1) {
            this.filePdf = arr[i];
            window.open(arr[i]);
            return false;
          } else {
            this.swiperSrcList.push(arr[i]);
          }
        }
        this.srcList = arr;
        this.posterVisibility = true;
      } catch {
        this.$notify.info({
          title: this.$t("提示"),
          message: this.$t("没有可查看的证明材料"),
        });
      }
    },
    // 上一张
    prev() {
      this.$refs.mySwipers.$swiper.slidePrev();
    },
    // 下一张
    next() {
      this.$refs.mySwipers.$swiper.slideNext();
    },
    getCurrentPage(page) {
      this.gotPageObj.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.gotPageObj.pageSize = perPage;
      this.getTableData();
    },
    // 表格数据
    async getTableData() {
      let params = {
        userId: this.id,
        userRole: this.userRole,
        coursePackageId: this.currentCoursePkg?.packageId || "",
      };
      try {
        this.isLoading = true;
        const res = await this.$Api.handleManagement.getHandleList(
          this.gotPageObj.pageNum,
          this.gotPageObj.pageSize,
          params
        );
        this.total = res.total;
        res.list.forEach((e) => {
          if (
            (e.type === this.ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_ONE ||
              e.type === this.ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_MORE ||
              e.type === this.ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_SYS ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_ADJUST_TUTOR_LEAVE ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_ADJUST_STUDENT ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_CANCEL_SYS ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_LEAVE ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_ADJUST ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_REPAIR ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_SMALL_OUT ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_INVITE_INITIATE ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_INVITE_SUCCESS ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_INVITE_FAIL ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_ADJUST_TUTOR ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_Change_Time_Zone ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_Adjustment_of_classes ||
              e.type === ACTIONLO_TYPE.ACTIONLOG_Adjustment_batch_of_classes) &&
            e.operateReason
          ) {
            try {
              e.operateReason = JSON.parse(e.operateReason);
            } catch {
              e.operateReason = e.operateReason;
            }
          }
          try {
            const studentTimetableIdList = JSON.parse(
              e.info
            ).studentTimetableIdList;
            if (
              /* 约课相关操作且非历史数据，展示查看关联课堂按钮 */
              studentTimetableIdList &&
              (e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_SUBSCRIBE_ONE ||
                e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_SUBSCRIBE_MORE ||
                e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_ONE ||
                e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_MORE ||
                e.type === ACTIONLO_TYPE.ACTIONLOG_OTO_CANCEL_SYS ||
                e.type === ACTIONLO_TYPE.ACTIONLOG_Adjustment_of_classes)
            ) {
              e.showCheckRelateBtn = true;
            } else {
              e.showCheckRelateBtn = false;
            }
          } catch {
            e.showCheckRelateBtn = false;
          }

          try {
            e.detail = JSON.parse(e.info);
          } catch {
            e.detail = e.info;
          }
        });
        this.tableData = res.list;
      } catch {
        this.total = 0;
        this.tableData = [];
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
.operate-details-warp .el-table .cell {
  word-break: keep-all;
}
.reason-transfer {
  word-wrap: break-word;
  word-break: normal;
  width: 100px;
}
.operate-details-warp .el-table .detail-cell {
  word-break: break-word;
}
.el-table::before {
  content: "";
  position: absolute;
  background-color: transparent;
  z-index: 1;
}
</style>
