<template>
  <div class="scheduling-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('充值明细')">
      <screen-item
        :label="$t('生效时间')"
        :part="2"
        label-width="120"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.detailedList.tdFilerByStudentName'
          )
        "
      >
        <FilterByTimePeriod
          v-if="defaultTimeArr"
          @changeSelect="
            (timeArr) => {
              screenData.startTime = timeArr[0];
              screenData.endTime = timeArr[1];
            }
          "
          :defaultTimeArr="defaultTimeArr"
        />
      </screen-item>
      <screen-item
        :label="$t('支付成功时间')"
        :part="2"
        label-width="120"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.detailedList.tdFilerByStudentName'
          )
        "
      >
        <FilterByTimePeriod
          @changeSelect="
            (timeArr) => {
              screenData.paySuccessStartTime = timeArr[0];
              screenData.paySuccessEndTime = timeArr[1];
            }
          "
        />
      </screen-item>
      <screen-item
        :label="$t('按员工查看')"
        label-width="160"
        :part="2"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.detailedList.tdFilerByAdviser'
          )
        "
      >
        <el-select
          filterable
          clearable
          v-model="screenData.cmsUserId"
          :placeholder="$t('glb-input')"
        >
          <el-option
            v-for="(item, index) in xgAndGwListSet"
            :key="index"
            :label="
              item.nameEn +
              `${item.nameEn && item.nameZh ? '-' : ''}` +
              item.nameZh
            "
            :value="item.id"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('家长id')"
        :part="4"
        label-width="100"
        v-if="
          Per.handleButtonPer(
            'financeMT.employeePerformance.detailedList.tdFilerByParent'
          )
        "
      >
        <el-input
          v-model.trim="screenData.parentUserId"
          :placeholder="
            $t('glb-input') +
            (currentLang == 'en' ? ' ' + $t('家长id') : '家长ID')
          "
          @keyup.enter.native="search"
        />
      </screen-item>
    </screen-wrapper>
    <!-- 表格 -->
    <custom-card :title="$t('数据列表')" class="table-wrapper no-bottom-border">
      <div slot="header-right" class="slot-tit">
        {{ $t("统计期内新用户充值课时") }} {{ new_student_amount }}；{{
          $t("老用户充值课时")
        }}
        {{ old_student_amount }}
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        :border="false"
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @sort-change="sortChange"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        class="attend-table"
        stripe
      >
        <el-table-column align="center" :label="$t('序号')" :width="120">
          <template slot-scope="scope">{{
            (screenData.page - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :width="currentLang == 'en' ? 150 : 150"
          prop="updateTime"
          :label="$t('订单创建时间')"
          sortable="custom"
          :class-name="getSortClass('update_time')"
        >
          <template slot-scope="scope">
            <span>{{ DateTimeUtils.dateClockTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('下单人')"
          prop="createUserName"
          :width="currentLang == 'en' ? 180 : 180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :width="currentLang == 'en' ? 150 : 150"
          prop="orderNo"
          :label="$t('支付成功时间')"
        >
          <template slot-scope="scope">
            <span>{{
              DateTimeUtils.dateClockTime(scope.row.successTime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :width="currentLang == 'en' ? 140 : 130"
          prop="parentId"
          :label="$t('家长ID')"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: `/studentManagement/parentInfo`,
                query: { parentUserId: scope.row.parentId },
              }"
            >
              <el-button type="text">{{ scope.row.parentId }}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('glb-student')"
          :width="labelWidth"
        >
          <template slot-scope="scope">
            <p
              style="margin: 0"
              v-for="item in scope.row.childrens"
              :key="item.childrenId"
            >
              <el-button type="text">
                <router-link
                  :to="{
                    path: `/studentManagement/studentInfo`,
                    query: {
                      studentId: item.childrenId,
                      studentName: item.childrenRealName,
                    },
                  }"
                >
                  {{ item.childrenRealName }}
                </router-link>
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 180 : 100"
          align="center"
          prop="productPackageName"
          :label="$t('充值课包')"
        />
        <el-table-column
          align="center"
          width="100"
          prop="rechargeAmount"
          :label="$t('my-home-Top-up Points')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 160 : 100"
          align="center"
          prop="incentiveAmount"
          :label="$t('赠课')"
        />
        <el-table-column
          align="center"
          width="150"
          prop="courseAdviser"
          :label="$t('本次充值课程顾问')"
        />
        <el-table-column
          align="center"
          width="150"
          prop="learnManager"
          :label="$t('本次充值学管老师')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 160 : 100"
          align="center"
          prop="activity"
          :label="$t('充值活动')"
        />
        <el-table-column
          align="center"
          prop="activity"
          :label="$t('活动优惠')"
        />
        <el-table-column
          align="center"
          width="120"
          prop="couponCode"
          :label="$t('是否使用优惠券')"
        >
          <template slot-scope="{ row }">
            <span>{{ row.couponCode ? $t("是") : $t("否") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang == 'en' ? 160 : 100"
          align="center"
          prop="redeemCode"
          :label="$t('课程卡')"
        />
        <el-table-column
          :width="currentLang == 'en' ? 160 : 100"
          align="center"
          prop="valid_date"
          :label="$t('有效期')"
        />
        <!--        <el-table-column align="center" label="版本">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>-->
        <!--              {{ scope.row.course_info.programme_name == 'Advanced' ? '高级版' : scope.row.course_info.programme_name == 'International Lite' ? '国际版' : 'SG' }}-->
        <!--            </span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column align="center" label="级别">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>-->
        <!--              Level{{ scope.row.course_info.course_level }}-->
        <!--            </span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          align="center"
          prop="rechargeCount"
          :width="120"
          :label="$t('Recharge times')"
        />
        <el-table-column
          align="center"
          prop="orderNo"
          :label="$t('流水号')"
          width="260"
        />
      </el-table>
      <!-- 分页 -->
      <custom-pagination
        :total="total"
        :current-page="screenData.page"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
  </div>
</template>

<script>
import { managerRecharge, attendRecharge } from "@/api/financeManagement";
import { mapState, mapGetters } from "vuex";
import FilterByTimePeriod from "@/components/FilterItem/CommodityFilter/FilterByTimePeriod";
import { parentIdValidate } from "@/utils/reg.js";

export default {
  name: "detailedList",
  components: {
    FilterByTimePeriod,
  },
  data() {
    return {
      defaultTimeArr: null,
      screenData: {
        startTime: "", // 时间段startTime  2019-07-24 12:00:00 endTime  2019-07-24 12:00:00
        endTime: "",
        cmsUserId: "",
        page: 1,
        pageSize: 50,
        ordering: "desc",
        startTime: "",
        endTime: "",
        paySuccessStartTime: "",
        paySuccessEndTime: "",
        parentUserId: "",
      },
      role: [],
      applyDate: [],
      loading: true, // 加载loading
      total: 0,
      // 表格数据
      tableData: [],
      labelWidth: "200",
      new_student_amount: 0, // 新用户充值
      old_student_amount: 0, // 老用户充值
    };
  },
  computed: {
    ...mapState({
      xgAndGwListSet: (state) => state.user.xgAndGwListSet,
    }),
    ...mapGetters(["currentLang"]),
  },
  mounted() {
    this.defaultTimeArr = [
      new Date(this.DateTimeUtils.getMonthStartDate()),
      new Date(this.DateTimeUtils.getMonthEndDate()),
    ];
    this.screenData.startTime = this.defaultTimeArr[0];
    this.screenData.endTime = this.defaultTimeArr[1];
    this.getTableData();
    this.getAdhoc();
  },
  methods: {
    // 筛选
    search() {
      this.screenData.page = 1;
      this.getTableData();
      this.getAdhoc();
    },
    // 表格数据
    getTableData() {
      let { startTime, paySuccessStartTime } = this.screenData;
      if (startTime === "" && paySuccessStartTime === "") {
        return this.$message.warning(this.$t("请最少设置一个时间范围"));
      }
      if (this.screenData && this.screenData.parentUserId && !parentIdValidate(this, this.screenData.parentUserId)) {
        return;
      }
      this.loading = true;
      managerRecharge(this.screenData).then((res) => {
        this.loading = false;
        this.total = res.data.data.total;
        this.tableData = res.data.data.list;
      });
    },
    // 充值总数
    getAdhoc() {
      const { month_query, startTime, endTime, cmsUserId } = this.screenData;
      const params = { month_query, startTime, endTime, cmsUserId };
      attendRecharge(params).then((res) => {
        this.new_student_amount = res.data.data.newStudentAmount;
        this.old_student_amount = res.data.data.oldStudentAmount;
      });
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.screenData.page = currentPage;
      this.getTableData();
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.screenData.page = 1;
      this.getTableData();
    },
    sortChange(column) {
      if (column.prop === "update_time" && column.order === "ascending") {
        this.screenData.ordering = "asc";
      } else if (
        column.prop === "update_time" &&
        column.order === "descending"
      ) {
        this.screenData.ordering = "desc";
      } else {
        return;
      }
      this.getTableData();
    },
    getSortClass: function (key) {
      const sort = this.screenData.ordering;
      return sort === `${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.type-btn {
  padding: 20px 0 0 0;
}
.table-wrapper {
  margin-top: 20px;
  padding: 0 15px;

  .slot-tit {
    color: #666;
    font-size: 14px;
  }

  .attend-table {
    border: 1px solid #f1f1f1;
  }
}
</style>
