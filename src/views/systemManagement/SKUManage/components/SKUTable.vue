<template>
  <div>
    <el-table :data="tableData" max-height="350" border style="width: 100%">
      <!-- 添加sku时，入库的数据只能修改状态和排序，不能删除 -->
      <el-table-column prop="sort" :label="$t('排序')" width="150">
      </el-table-column>
      <el-table-column prop="amount" :label="$t('交易 - 课时数量')" width="150">
      </el-table-column>
      <el-table-column
        prop="nameCn"
        :label="$t('交易 - SKU中文名称')"
        width="150"
      >
      </el-table-column>
      <el-table-column
        prop="nameEn"
        :label="$t('交易 - SKU英文名称')"
        width="150"
      >
      </el-table-column>
      <el-table-column prop="nameFra" :label="$t('SKU法文名称')" width="150">
      </el-table-column>
      <el-table-column
        v-if="classTypeId === 1"
        :label="$t('交易 - 订阅周期')"
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.subscribeCycle">
            {{ scope.row.subscribeCycle }}
            {{
              SKUMANGE_TERMOFVALIDITY[scope.row.subscribeCycleUnit][
                currentLang === "en" ? "nameEn" : "nameZh"
              ]
            }}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('交易 - 有效期')" width="120">
        <template slot-scope="scope">
          {{ scope.row.validityTime }}
          {{
            getValidType(scope.row.validityType,currentLang)
          }}
        </template>
      </el-table-column>
      <el-table-column prop="promotionTag" width="125" :label="$t('促销标签')">
        <template slot-scope="scope">
          {{ getPromotionTag(scope.row.promotionTag, currentLang) }}
        </template>
      </el-table-column>
      <el-table-column prop="SGD" width="125" :label="$t('总价') + '(SGD)'" />
      <el-table-column prop="USD" width="125" :label="$t('总价') + '(USD)'" />
      <el-table-column prop="HKD" width="125" :label="$t('总价') + '(HKD)'" />
      <el-table-column prop="EUR" width="125" :label="$t('总价') + '(EUR)'" />
      <el-table-column prop="THB" width="125" :label="$t('总价') + '(THB)'" />
      <el-table-column prop="IDR" width="125" :label="$t('总价') + '(IDR)'" />
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

      <el-table-column
        prop="status"
        :label="$t('交易 - 是否上架')"
        :width="currentLang === 'zh' ? '150' : '220'"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? $t("否") : $t("是") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="appShow"
        :label="$t('交易 - 是否在商城显示')"
        :width="currentLang === 'zh' ? '150' : '200'"
        sortable
      >
        <template slot="header">
          <span>{{ $t("交易 - 是否在商城显示") }}</span>
          <el-tooltip
            :content="$t('订阅制SKU暂不在app显示')"
            placement="top"
            @click.stop.prevent
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          {{ scope.row.appShow === 0 ? $t("否") : $t("是") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('交易 - 操作')" width="200" fixed="right">
        <template slot-scope="scope">
          <i
            class="el-icon-sort-down sortIcon"
            @click="moveDown(scope.$index, scope.row)"
          />
          <i
            class="el-icon-sort-up sortIcon"
            @click="moveUp(scope.$index, scope.row)"
          />
          <el-popconfirm
            :title="`${$t('交易 - 内容确定删除吗')}？`"
            :confirmButtonText="$t('删除')"
            :cancelButtonText="$t('不删除')"
            icon="el-icon-info"
            iconColor="red"
            placement="left"
            @confirm="deleteRow(scope.row.skuId)"
          >
            <el-button type="text" slot="reference">
              {{ $t("删除") }}
            </el-button>
          </el-popconfirm>
          <el-button type="text" @click="editSku(scope.row.skuId)">{{
            $t("编辑")
          }}</el-button>
          <el-button type="text" @click="copySku(scope.row.skuId)">{{
            $t("复制")
          }}</el-button>
          <el-button type="text" @click="checkSku(scope.row.skuId)">{{
            $t("查看")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <SkuDialog
      v-if="showSkuDialog && currencyList.length > 0"
      :visible.sync="showSkuDialog"
      :agreementList="agreementList"
      :currencyList="currencyList"
      :spuInfo="spuInfo"
      :skuId="currentSkuId"
      :skuDetail="skuDetail"
      :type="type"
      @refresh="refresh()"
    />
    <!-- 用来复制 -->
    <input
      id="copyContent"
      style="height: 0px; border: none; color: transparent; outline: none"
    />
  </div>
</template>

<script>
import {
  SKUMANGE_TERMOFVALIDITY,
  getPromotionTag,
  getValidType
} from "./constants";
import { mapState } from "vuex";
import SkuDialog from "./SkuDialog.vue";

export default {
  components: { SkuDialog },
  props: {
    tableData: { type: Array, default: () => [] },
    limitType: { type: Number, default: () => 0 },
    agreementList: { type: Array, default: () => [] },
    sellForm: { type: Array, default: () => ({}) },
    classTypeId: { type: Number, default: () => -1 },
    currencyList: {
      type: Array,
      default: [],
    },
    spuInfo: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapState({
      currentLang: (state) => state.app.currentLang,
    }),
  },
  watch: {
    tableData(list) {
      list.forEach((item) => {
        this.agreementList.some((i) => {
          if (item.agreementId === i.id) {
            item.agreement = i;
          }
        });
        item.currencyTotalPriceList &&
          item.currencyTotalPriceList.forEach((e) => {
            item[e.currency] = e.totalPrice;
          });
      });
    },
  },
  data() {
    return {
      SKUMANGE_TERMOFVALIDITY,
      getPromotionTag,
      showSkuDialog: false,
      currentSkuId: null,
      skuDetail: null,
      type: null,
      getValidType
    };
  },
  methods: {
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
    async editSku(skuId) {
      this.currentSkuId=skuId
      this.type = "编辑";
      this.skuDetail = await this.reqSkuDetail(skuId);
      this.showSkuDialog = true;
    },
    async checkSku(skuId) {
      this.type = "查看";
      this.skuDetail = await this.reqSkuDetail(skuId);
      this.showSkuDialog = true;
    },
    async copySku(skuId) {
      this.type = "复制";
      this.skuDetail = await this.reqSkuDetail(skuId);
      delete this.skuDetail.skuId;
      if (
        this.skuDetail.currencyTotalPriceList &&
        this.skuDetail.currencyTotalPriceList.length > 0
      ) {
        this.skuDetail.currencyTotalPriceList.forEach((e) => {
          e.paymentLinks = null;
        });
      }
      this.showSkuDialog = true;
    },
    async reqSkuDetail(skuId) {
      const res = await this.$Api.financeManagement.reqSkuData({
        id: skuId,
      });
      return res;
    },
    // 更新表单校验状态
    validateFun(row, valid, value) {
      let emptyVal = [null, undefined, ""];
      if (Array.isArray(value)) {
        let showValid = value.every((item) => !emptyVal.includes(row[item]));
        this.$set(row, valid, !showValid);
      } else {
        this.$set(row, valid, row[value] !== "" ? false : true);
      }
    },
    // 上移
    async moveUp(index, row) {
      if (index > 0) {
        try {
          const upData = this.tableData[index - 1];
          let sortArr = [
            { skuId: row.skuId, sort: upData.sort },
            { skuId: upData.skuId, sort: row.sort },
          ];
          await this.$Api.financeManagement.reqRemoveSku(sortArr);
          this.tableData.splice(index - 1, 1);
          this.tableData.splice(index, 0, upData);
          this.$message.success(this.$t("操作成功"));
          this.$emit('refresh')
        } catch {
          this.$message.error(this.$t("操作失败"));
        }
      } else {
        this.$message.warning("已经是第一条，不可上移");
      }
    },
    // 下移
    async moveDown(index, row) {
      if (index + 1 === this.tableData.length) {
        this.$message.warning("已经是最后一条，不可下移");
      } else {
        try {
          const downData = this.tableData[index + 1];
          let sortArr = [
            { skuId: row.skuId, sort: downData.sort },
            { skuId: downData.skuId, sort: row.sort },
          ];
          await this.$Api.financeManagement.reqRemoveSku(sortArr);
          this.tableData.splice(index + 1, 1);
          this.tableData.splice(index, 0, downData);
          this.$message.success(this.$t("操作成功"));
          this.$emit('refresh')
        } catch {
          this.$message.error(this.$t("操作失败"));
        }
      }
    },
    refresh() {
      this.$emit("refresh");
    },
    // 删除
    async deleteRow(spuId) {
      try {
        const res = await this.$Api.financeManagement.reqDeleteSku({
          skuId: spuId,
        });
        this.refresh();
      } finally {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sortIcon {
  cursor: pointer;
  font-weight: 600;
  &:hover {
    color: #7580e5;
  }
}
::v-deep .el-table__empty-block {
  text-align: left;
}
.btn-link {
  color: #7580e5;
  cursor: pointer;
}
</style>
