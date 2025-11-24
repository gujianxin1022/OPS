<template>
  <div class="SKULIST">
    <div class="search-wrap">
      <screen-wrapper @search="search">
        <screen-item :label="$t('SPU名称')" :label-width="currentLang === 'en' ? '140' : '100'" :part="4">
          <FilterBySpuName
            @changeSelect="
              (val) => {
                screenData.spuName = val;
              }
            "
          />
        </screen-item>
        <screen-item label="SKU_ID" :label-width="currentLang === 'en' ? '140' : '100'" :part="4">
          <el-input
            v-model="screenData.id"
            :placeholder="$t('请输入')"
          ></el-input>
        </screen-item>
        <screen-item :label="$t('交易 - SKU名称')" :label-width="currentLang === 'en' ? '140' : '100'" :part="4">
          <el-input
            v-model="screenData.name"
            :placeholder="$t('请输入')"
          ></el-input>
        </screen-item>
        <screen-item :label="$t('交易 - 商城显示')" :label-width="currentLang === 'en' ? '140' : '100'" :part="4">
          <el-select v-model="screenData.appShow" :placeholder="$t('请选择')">
            <el-option
              v-for="item in SPU_SKULIST_APP_SHOW"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            />
          </el-select>
        </screen-item>
        <screen-item :label="$t('交易 - 是否上架')" :label-width="currentLang === 'en' ? '140' : '100'" :part="4">
          <el-select v-model="screenData.status" :placeholder="$t('请选择')">
            <el-option
              v-for="item in SPU_SKULIST_STATUS"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            />
          </el-select>
        </screen-item>
      </screen-wrapper>
    </div>
    <div>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%; margin-top: 10px"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column prop="spuId" label="SPU_ID" />
        <el-table-column width="120px" prop="amount" :label="$t('课时数量')" />
        <el-table-column
          prop="skuNameCn"
          :label="$t('交易 - SKU中文名称')"
          width="180px"
        />
        <el-table-column
          prop="skuNameEn"
          :label="$t('交易 - SKU英文名称')"
          width="180px"
        />
        <el-table-column
          prop="amount"
          :label="$t('交易 - 订阅周期')"
          width="180px"
        >
          <template slot-scope="scope">
            {{
              scope.row.amount && scope.row.supportSubscribe === 1
                ? `${scope.row.amount} ${
                    currentLang === "zh"
                      ? scope.row.cycleUnitCn || "--"
                      : scope.row.cycleUnitEn || "--"
                  }`
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column width="120px" prop="validityTime" :label="$t('有效期')">
          <template slot-scope="scope">
            {{ scope.row.validityTime }}
            {{
              getValidType(scope.row.validityType,currentLang)
          }}
          </template>
        </el-table-column>
        <el-table-column prop="promotionTag" width="125px" :label="$t('促销标签')">
          <template slot-scope="scope">
            {{ getPromotionTag(scope.row.promotionTag, currentLang) }}
          </template>
        </el-table-column>
        <el-table-column prop="SGD" :label="$t('总价') + '(SGD)'" />
        <el-table-column prop="USD" :label="$t('总价') + '(USD)'" />
        <el-table-column prop="HKD" :label="$t('总价') + '(HKD)'" />
        <el-table-column prop="EUR" :label="$t('总价') + '(EUR)'" />
        <el-table-column prop="THB" :label="$t('总价') + '(THB)'" />
        <el-table-column prop="IDR" :label="$t('总价') + '(IDR)'" />
        <el-table-column prop="AUD" :label="$t('总价') + '(AUD)'" />
        <el-table-column prop="CNY" :label="$t('总价') + '(CNY)'" />
        <el-table-column prop="JPY" :label="$t('总价') + '(JPY)'" />
        <el-table-column
          prop="paymentLink"
          :label="$t('交易 - 支付链接')"
          width="260px"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.paymentLink">--</span>
            <el-tooltip v-else :content="$t('交易 - 点击复制链接')">
              <div class="btn-link" @click="onCopyText(scope.row.paymentLink)">
                {{ scope.row.paymentLink }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="120px" prop="status" :label="$t('交易 - 是否上架')">
          <template slot-scope="scope">
            <span :class="scope.row.status ? 'yes' : 'no'">
              {{ getStatus(scope.row.status, currentLang) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="appShow"
          :label="$t('交易 - 是否在商城显示')"
          width="180px"
        >
          <template slot-scope="scope">
            <span :class="scope.row.appShow ? 'yes' : 'no'">
              {{ getAppShow(scope.row.appShow, currentLang) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('交易 - 操作')" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="
                Per.handleButtonPer(
                  'financeMT.productManagement.commodityManage.SKUListEdit'
                )
              "
              type="text"
              @click="goSKUManage(LIMIT_TYPE.edit, scope.row)"
            >
              {{ $t("修改") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="pageDto.total"
        :current-page="pageDto.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <!-- 用来复制 -->
    <input id="copyContent" style="height: 0; border: none" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  SPU_SKULIST_APP_SHOW,
  SPU_SKULIST_STATUS,
  LIMIT_TYPE,
  getAppShow,
  getStatus,
  getType,
  getPromotionTag,
  getValidType,
  SKUMANGE_TERMOFVALIDITY
} from "./constants";

import FilterBySpuName from "@/components/FilterItem/CommodityFilter/FilterBySpuName";

export default {
  components: { FilterBySpuName },
  data() {
    return {
      SPU_SKULIST_APP_SHOW,
      SPU_SKULIST_STATUS,
      SKUMANGE_TERMOFVALIDITY,
      LIMIT_TYPE,
      getAppShow,
      getStatus,
      getType,
      getPromotionTag,
      getValidType,
      screenData: {
        id: "",
        name: "",
        appShow: -1,
        status: -1,
        spuName: "",
      },
      pageDto: {
        pageNum: 1,
        pageSize: 50,
        total: 0,
      },
      loading: false,
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      currentLang: (state) => state.app.currentLang,
    }),
  },
  mounted() {
    this.getTableData();
  },
  activated() {
    this.search();
  },
  methods: {
    // 获取table数据
    getTableData() {
      this.loading = true;
      let params = { ...this.screenData, ...this.pageDto };
      this.$Api.systemManagement
        .getSKUList(params)
        .then(({ status, data: { code, data } }) => {
          if (status === 200 && data) {
            data.list &&
              data.list.forEach((item) => {
                item.currencyTotalPriceList &&
                  item.currencyTotalPriceList.forEach((e) => {
                    item[e.currency] = e.totalPrice;
                  });
              });
            this.tableData = data.list || [];
            this.pageDto.total = data.total;
          } else {
            this.tableData = [];
            this.pageDto.total = 0;
          }
        })
        .finally(() => (this.loading = false));
    },
    search() {
      this.pageDto.pageNum = 1;
      this.getTableData();
    },
    // 复制链接
    onCopyText(text) {
      const input = document.getElementById("copyContent");
      input.value = text;
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("复制成功");
      } else {
        this.$message.success("复制失败");
      }
    },
    // 获取当前页码
    getCurrentPage(currentPage) {
      this.pageDto.pageNum = currentPage;
      this.getTableData();
    },
    // 改变每页展示数据的条数
    getPerPage(perPage) {
      this.pageDto.pageNum = 1;
      this.pageDto.pageSize = perPage;
      this.getTableData();
    },
    // 新增 & 修改
    // 跳转页面需保存tab值，等返回时显示跳转前的他tab页
    goSKUManage(limitType, row = {}) {
      window.sessionStorage.setItem("tabID", "SKUList");
      this.$router.push({
        path: "/system/SKUManage",
        query: {
          limitType,
          spuId: row.spuId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-box {
  margin: 20px 0 10px;
}
.yes {
  color: rgb(89, 198, 116);
}
.no {
  color: red;
}
.btn-link {
  color: #7580e5;
  cursor: pointer;
}
</style>
