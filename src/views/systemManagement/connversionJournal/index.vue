<template>
  <div>
    <screen-wrapper @search="search" :screenTitle="$t('课时转换日志')">
      <el-form :inline="true" :model="checkOperationInfo" class="form-inline">
        <el-form-item
          :label="$t('操作时间')"
          v-if="
            Per.handleButtonPer(
              'system.journal.classChangeJournal.classChangeDate'
            )
          "
        >
          <label slot="label" class="s-label">{{ $t("操作时间") }}</label>
          <el-date-picker
            style="width: 230px"
            unlink-panels
            v-model="applyDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            size="small"
            :default-time="['00:00:00', '23:59:59']"
            @change="timeChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('转出产品')"
          v-if="
            Per.handleButtonPer(
              'system.journal.classChangeJournal.classChangeOutProduct'
            )
          "
        >
          <label slot="label" class="s-label">{{ $t("转出产品") }}</label>
          <el-select
            clearable
            v-model="screenData.productIdOut"
            :placeholder="$t('请选择转出产品')"
          >
            <el-option
              v-for="item in selectListData.transfer"
              :key="item.coursePackageId"
              :label="
                currentLang === 'zh'
                  ? item.coursePackageNameCn
                  : item.coursePackageNameEn
              "
              :value="item.coursePackageId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('转入产品')"
          v-if="
            Per.handleButtonPer(
              'system.journal.classChangeJournal.classChangeInProduct'
            )
          "
        >
          <label slot="label" class="s-label">{{ $t("转入产品") }}</label>
          <el-select
            clearable
            v-model="screenData.productIdTo"
            :placeholder="$t('请选择转入产品')"
          >
            <el-option
              v-for="item in selectListData.transfer"
              :key="item.coursePackageId"
              :label="
                currentLang === 'zh'
                  ? item.coursePackageNameCn
                  : item.coursePackageNameEn
              "
              :value="item.coursePackageId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('转换方式')">
          <label slot="label" class="s-label">{{ $t("转换方式") }}</label>
          <el-select
            clearable
            v-model="screenData.type"
            :placeholder="$t('请选择')"
          >
            <el-option
              v-for="(value, key) in TransferType"
              :key="key"
              :label="$t(value)"
              :value="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('转出家长ID')">
          <label slot="label" class="s-label">{{ $t("转出家长ID") }}</label>
          <el-input
            clearable
            v-model="screenData.transferUserId"
            :placeholder="$t('请输入')"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('转入家长ID')">
          <label slot="label" class="s-label">{{ $t("转入家长ID") }}</label>
          <el-input
            clearable
            v-model="screenData.recipientUserId"
            :placeholder="$t('请输入')"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('转换原因')"
          v-if="
            Per.handleButtonPer(
              'system.journal.classChangeJournal.classChangeInReason'
            )
          "
        >
          <label slot="label" class="s-label">{{ $t("转换原因") }}</label>
          <el-select
            clearable
            v-model="screenData.reason"
            :placeholder="$t('请选择转换原因')"
          >
            <el-option
              v-for="item in selectListData.reason"
              :key="item.id"
              :label="
                currentLang === 'zh' ? item.productName : item.productNameEn
              "
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('操作人')"
          v-if="
            Per.handleButtonPer(
              'system.journal.classChangeJournal.classChangeOperator'
            )
          "
        >
          <label slot="label" class="s-label">{{ $t("操作人") }}</label>
          <el-input
            clearable
            v-model="screenData.createUserName"
            :placeholder="$t('glb-input') + $t('操作人')"
          ></el-input>
        </el-form-item>
      </el-form>
    </screen-wrapper>
    <custom-card
      :title="$t('数据列表')"
      class="table-wrapper mt10 no-bottom-border"
    >
      <basic-table
        header-cell-class-name="my-theme-color-header"
        border
        stripe
        :column="column"
        :data="tableData"
        :pagination="true"
        :page="page"
        :total="total"
        :limit="limit"
        @pagination="pagination"
      ></basic-table>
    </custom-card>
  </div>
</template>

<script>
import BasicTable from "../../../components/table/basic-table";
import { mapGetters } from "vuex";
import { parentIdValidate } from "@/utils/reg.js";
export default {
  name: "Journal",
  props: {
    openJournal: {
      type: Boolean,
      default: false,
    },
    lang: {
      type: String,
      default: null,
    },
    selectListData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    BasicTable,
  },
  data() {
    const tableData = [];
    return {
      screenData: {
        startTime: null,
        endTime: null,
        productIdOut: null,
        productIdTo: null,
        reason: null,
        createUserName: "",
        recipientUserId: "",
        transferUserId: "",
        type: "",
      },
      tableData: tableData,
      total: 0,
      page: 1,
      limit: 50,
      applyDate: [],
      selectListData: {
        transfer: [], // 转出产品
        reason: [], //转出原因
      },
      TransferType: {
        1: this.$t("家长课时转换"),
        2: this.$t("家长账户迁移"),
        3: this.$t("孩子课时转换"),
        4: this.$t("孩子账户迁移"),
        5: this.$t("跨账号课时迁移"),
      },
    };
  },
  computed: {
    ...mapGetters(["currentLang"]),
    column() {
      const AccountType = {
        1: this.$t("家长"),
        2: this.$t("学生"),
      };
      return [
        {
          label: this.$t("序号"),
          align: "center",
          width: 70,
          fixed: true,
          render: (h, scope) => {
            return h("div", (this.page - 1) * this.limit + scope.$index + 1);
          },
        },
        {
          label: this.$t("操作时间"),
          fixed: true,
          width: 150,
          align: "center",
          prop: "createTime",
        },
        {
          label: this.$t("操作人"),
          fixed: true,

          align: "center",
          prop: "createUserName",
        },
        {
          label: this.$t("转出家长ID"),
          align: "center",
          width: "150",
          render: (h, { row }) => (
            <el-button type="text">
              <router-link
                to={{
                  name: `parentInfo`,
                  query: { parentUserId: row.transferUserId },
                }}
              >
                {row.transferUserId}
              </router-link>
            </el-button>
          ),
        },
        {
          label: this.$t("转出账户类型"),
          align: "center",
          width: 100,
          render: (h, { row }) => AccountType[row.transferOutAccountType],
        },
        {
          label: this.$t("转出账户"),
          align: "center",
          minWidth: 100,
          prop: "transferOutAccountName",
        },
        {
          label: this.$t("转出产品"),
          align: "center",
          minWidth: 140,
          prop:
            this.currentLang == "zh"
              ? "coursePackageOutName"
              : "coursePackageOutNameEn",
        },
        {
          label: this.$t("转出课时数"),
          width: 100,
          align: "center",
          prop: "amount",
        },
        {
          label: this.$t("转入家长ID"),
          align: "center",
          width: "150",
          render: (h, { row }) => (
            <el-button type="text">
              <router-link
                to={{
                  name: `parentInfo`,
                  query: { parentUserId: row.recipientUserId },
                }}
              >
                {row.recipientUserId}
              </router-link>
            </el-button>
          ),
        },
        {
          label: this.$t("转入账户类型"),
          width: 100,
          align: "center",
          render: (h, { row }) => AccountType[row.transferToAccountType],
        },
        {
          label: this.$t("转入账户"),
          align: "center",
          minWidth: 100,
          prop: "transferToAccountName",
        },
        {
          label: this.$t("转入产品"),
          align: "center",
          minWidth: 140,
          prop:
            this.currentLang == "zh"
              ? "coursePackageToName"
              : "coursePackageToNameEn",
        },
        {
          label: this.$t("转入课时数"),
          width: 100,
          align: "center",
          prop: "toAmount",
        },
        {
          label: this.$t("转换原因"),
          align: "center",
          width: 160,
          render: (h, { row }) =>
            row.conversionName.length > 10 ? (
              <el-tooltip class="thidden" effect="light" placement="left">
                <div style="width:200px" slot="content">
                  {this.currentLang == "zh"
                    ? row.conversionName
                    : row.conversionNameEn}
                </div>
                <span class="thidden">
                  {this.currentLang == "zh"
                    ? row.conversionName
                    : row.conversionNameEn}
                </span>
                ;
              </el-tooltip>
            ) : (
              <span>
                {this.currentLang == "zh"
                  ? row.conversionName||'-'
                  : row.conversionNameEn||'-'}
              </span>
            ),
        },
        {
          label: this.$t("转换类型"),
          align: "center",
          prop:
            this.currentLang == "zh"
              ? "conversionTypeName"
              : "conversionTypeNameEn",
        },
        {
          label: this.$t("转换方式"),
          align: "center",
          minWidth: 140,
          render: (h, { row }) => this.TransferType[row.type],
        },
      ];
    },
  },
  methods: {
    // 选择时间
    timeChange() {
      if (this.applyDate) {
        this.screenData.startTime = new Date(`${this.applyDate[0]} 00:00`);
        this.screenData.endTime = new Date(`${this.applyDate[1]} 23:59`);
      } else {
        this.screenData.startTime = null;
        this.screenData.endTime = null;
      }
    },
    // 获取日志列表
    getJournal() {
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      this.$Api.studentManagement
        .getClassJournalList(this.page, this.limit, params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            let list = data.data.list;
            list.forEach((item) => {
              item.createTime = this.DateTimeUtils.dateClockTime(
                item.createTime
              );
            });
            this.tableData = data.data.list;
            this.total = data.data.total;
          }
        });
    },
    //查询
    search() {
      this.page = 1;
      this.getJournal();
    },
    //分页
    pagination(val) {
      this.page = val.page;
      this.limit = val.limit;
      this.getJournal();
    },
    // 获取下拉列表
    getSelectClassHour() {
      // 课程等值积分
      this.$Api.studentManagement
        .getTransferCoursePackageList()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.selectListData.transfer = data.data;
          }
        });
      // 转出原因
      this.$Api.studentManagement
        .getClassHourReason()
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.selectListData.reason = data.data;
          }
        });
    },
  },
  mounted() {
    this.getJournal();
    this.getSelectClassHour();
  },
};
</script>
