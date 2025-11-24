<template>
  <div class="SPULIST">
    <div class="search-wrap">
      <screen-wrapper @search="search">
        <screen-item
          label="SPU_ID"
          :label-width="currentLang === 'en' ? '140' : '100'"
          :part="4"
        >
          <el-input
            v-model="screenData.id"
            :placeholder="$t('请输入')"
          ></el-input>
        </screen-item>
        <screen-item
          :label="$t('交易 - SPU名称')"
          :label-width="currentLang === 'en' ? '140' : '100'"
          :part="4"
        >
          <el-input
            v-model="screenData.name"
            :placeholder="$t('请输入')"
          ></el-input>
        </screen-item>
        <screen-item
          :label="$t('类型')"
          :label-width="currentLang === 'en' ? '140' : '100'"
          :part="4"
        >
          <el-select v-model="screenData.type" :placeholder="$t('请选择')">
            <el-option
              v-for="item in SPULIST_TYPE"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            />
          </el-select>
        </screen-item>
        <screen-item
          :label="$t('交易 - 是否上架')"
          :label-width="currentLang === 'en' ? '140' : '100'"
          :part="4"
        >
          <el-select v-model="screenData.status" :placeholder="$t('请选择')">
            <el-option
              v-for="item in SPU_SKULIST_STATUS"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            />
          </el-select>
        </screen-item>
        <screen-item
          :label="$t('交易 - 商城显示')"
          :label-width="currentLang === 'en' ? '140' : '100'"
          :part="4"
        >
          <el-select v-model="screenData.appShow" :placeholder="$t('请选择')">
            <el-option
              v-for="item in SPU_SKULIST_APP_SHOW"
              :key="item.id"
              :label="currentLang === 'zh' ? item.nameZh : item.nameEn"
              :value="item.id"
            />
          </el-select>
        </screen-item>
      </screen-wrapper>
    </div>
    <div>
      <section class="btn-box">
        <el-button
          class="fr mb10"
          v-if="
            Per.handleButtonPer(
              'financeMT.productManagement.commodityManage.SPUListAdd'
            )
          "
          type="primary"
          @click="goSKUManage(LIMIT_TYPE.addSPU)"
        >
          {{ $t("新增") }}
        </el-button>
      </section>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%; margin-top: 10px"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
      >
        <el-table-column prop="merchantId" :label="$t('交易 - 商户ID')" />
        <el-table-column prop="merchantName" :label="$t('交易 - 商户名称')" />
        <el-table-column prop="appId" label="appID" width="150px" />
        <el-table-column
          prop="appName"
          width="100"
          :label="$t('交易 - app名称')"
        />
        <el-table-column prop="type" :label="$t('类型')">
          <template slot-scope="scope">
            {{ getType(scope.row.type, currentLang) }}
          </template>
        </el-table-column>
        <el-table-column prop="spuId" label="SPU_ID" />
        <el-table-column
          prop="spuNameCn"
          :label="$t('交易 - SPU中文名称')"
          width="180px"
        />
        <el-table-column
          prop="spuNameEn"
          :label="$t('交易 - SPU英文名称')"
          width="180px"
        />
        <el-table-column
          prop="descriptionCn"
          :label="$t('交易 - SPU中文描述')"
          width="180px"
        />
        <el-table-column
          prop="descriptionEn"
          :label="$t('交易 - SPU英文描述')"
          width="180px"
        />
        <el-table-column
          prop="appShow"
          :label="$t('交易 - 是否在商城显示')"
          width="180px"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.appShow"
              :active-value="1"
              :inactive-value="0"
              :active-text="$t('是')"
              :inactive-text="$t('否')"
              @change="changeAppShow(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="100"
          :label="$t('交易 - 是否上架')"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              :active-text="$t('是')"
              :inactive-text="$t('否')"
              @change="changeSpuStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="country" :label="$t('地区')" />
        <el-table-column width="120" :label="$t('交易 - 操作')" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="
                Per.handleButtonPer(
                  'financeMT.productManagement.commodityManage.SPUListEdit'
                )
              "
              type="text"
              @click="goSKUManage(LIMIT_TYPE.edit, scope.row)"
            >
              {{ $t("修改") }}
            </el-button>
            <el-button
              v-if="
                Per.handleButtonPer(
                  'financeMT.productManagement.commodityManage.addSKU'
                )
              "
              type="text"
              @click="goSKUManage(LIMIT_TYPE.addSKU, scope.row)"
            >
              {{ $t("交易 - 添加SKU") }}
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  SPU_SKULIST_APP_SHOW,
  SPU_SKULIST_STATUS,
  SPULIST_TYPE,
  LIMIT_TYPE,
  getAppShow,
  getStatus,
  getType,
} from "./constants";

export default {
  data() {
    return {
      SPU_SKULIST_APP_SHOW,
      SPU_SKULIST_STATUS,
      SPULIST_TYPE,
      LIMIT_TYPE,
      getAppShow,
      getStatus,
      getType,
      screenData: {
        id: "",
        name: "",
        type: -1,
        status: -1,
        appShow: -1,
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
    async changeAppShow(row) {
      await this.$Api.financeManagement.reqUpdateSPUIsShow({
        id: row.spuId,
        isShow: row.appShow,
      });
      this.$notify({ type: "success", message: "操作成功" });
      this.getTableData();
    },
    async changeSpuStatus(row) {
      await this.$Api.financeManagement.reqUpdateSPUStatus({
        id: row.spuId,
        status: row.status,
      });
      this.$notify({ type: "success", message: "操作成功" });
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      let params = { ...this.screenData, ...this.pageDto };
      this.$Api.systemManagement
        .getSPUList(params)
        .then(({ status, data: { code, data } }) => {
          if (status === 200) {
            this.tableData = data.list;
            this.pageDto.total = data.total;
          }
        })
        .finally(() => (this.loading = false));
    },
    search() {
      this.pageDto = {
        pageNum: 1,
        pageSize: 50,
      };
      this.getTableData();
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
      window.sessionStorage.setItem("tabID", "SPUList");
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
</style>
