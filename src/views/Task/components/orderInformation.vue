 <template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"
    :empty-text="$t('暂无数据')"
  >
    <el-table-column :label="$t('所购课时包')" min-width="180">
      <template slot-scope="scope">
        <div
          v-for="item in scope.row.courseProductList"
          :key="item.courseProductId"
        >
          {{
            currentLang === "en"
              ? `${item.courseProductNameEn}-${item.courseProductDetailNameEn}`
              : `${item.courseProductNameCn}-${item.courseProductDetailNameCn}`
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="purchaseTime" :label="$t('购买时间')" width="180">
      <template slot-scope="scope">
        {{ DateTimeUtils.dateClockTime(scope.row.purchaseTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="amount" :label="$t('赠品')">
      <template slot-scope="scope">
        <div
          v-for="course in scope.row.courseProductList"
          :key="course.courseProductId"
        >
          <template
            v-if="
              course.incentiveProductList &&
              course.incentiveProductList.length > 0
            "
          >
            <div
              v-for="item in course.incentiveProductList"
              :key="item.incentiveCourseProductId"
            >
              {{
                currentLang === "en"
                  ? item.courseProductDetailNameEn
                  : item.courseProductDetailNameCn
              }}
            </div>
          </template>
          <template v-else> - </template>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

  <script>
import { mapGetters } from "vuex";
export default {
  name: "orderInformation" /* 订单信息展示列表 */,
  props: {
    studentLearningPlanId: {
      type: String,
      default: "",
    },
    studentUserId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  mounted() {
    this.getParentOrders();
  },
  methods: {
    async getParentOrders() {
      this.loading = true;
      try {
        const {
          status,
          data: { code, data },
        } = await this.$Api.task.getOrderInfo(
          this.studentLearningPlanId,
          this.studentUserId
        );
        if (status !== 200 || code !== 200) return Promise.reject();
        this.tableData = data || [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>