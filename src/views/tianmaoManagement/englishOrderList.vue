<template>
  <div class="coupon-list-wrap">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item
        :label="$t('销售名称')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input clearable v-model="screenData.ccUserName"></el-input>
      </screen-item>
      <screen-item
        :label="$t('家长ID')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input clearable v-model="screenData.parentUserId"></el-input>
      </screen-item>
      <screen-item
        :label="$t('天猫订单ID')"
        :part="4"
        :label-width="labelWidth"
      >
        <el-input clearable v-model="screenData.externalOrderNo"></el-input>
      </screen-item>
      <screen-item
        :label="$t('是否匹配')"
        :part="4"
        :label-width="currentLang === 'en' ? 140 : labelWidth"
      >
        <el-select
          clearable
          v-model="screenData.systemExist"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in systemExistOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </screen-item>
      <screen-item
        :label="$t('交易时间')"
        :part="4"
        :label-width="currentLang === 'en' ? 140 : labelWidth"
      >
        <el-date-picker
          style="width: 220px"
          v-model="applyDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator=""
          :start-placeholder="$t('开始日期')"
          @change="timeChange"
          :end-placeholder="$t('结束日期')"
        >
        </el-date-picker>
      </screen-item>
    </screen-wrapper>
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div slot="header-right">
        <el-button
          class="mr5"
          type="primary"
          @click="getFile"
          :loading="loading"
        >
          {{ $t("下载") }}
        </el-button>
      </div>


      <el-table
        :border="false"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        fit
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
              (screenData.pageNum - 1) * screenData.pageSize + scope.$index + 1
            }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('用户手机号')"
          width="140"
          prop="innerMobile"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('PID')"
          width="140"
          prop="parentUserId"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('天猫订单id')"
          width="140"
          prop="externalOrderNo"
        >
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{ scope.row.externalOrderNo }}</div>
              <div class="text-overflow">{{ scope.row.externalOrderNo }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('天猫订单名称')"
          width="140"
          prop="externalOrderTitle"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('订单金额')"
          width="140"
          prop="payment"
        >
        </el-table-column>
        <el-table-column align="center" :label="$t('订单状态')" width="300">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">{{ $t("待支付") }}</span>
            <span v-else-if="scope.row.status === 1">{{ $t("已支付") }}</span>
            <span v-else-if="scope.row.status === 3">{{ $t("已退款") }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('支付时间')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="payTime"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('渠道码')"
          width="140"
          prop="dealSourceChannel"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('销售ID')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="ccUserId"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('销售姓名')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="ccUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          :label="$t('销售组别')"
          :width="currentLang === 'en' ? 150 : 140"
          prop="fullCode"
        ></el-table-column>

        <el-table-column align="center" :label="$t('是否新用户')" width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.firstRecharge === 1 ?  '是' : '否' }}</span>
          </template>
        </el-table-column>

      </el-table>
      <custom-pagination
        :total="total"
        :current-page="screenData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />

    </custom-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import axios from 'axios';
import GetData from '@/utils/axios.js';
import CustomUpload from "@/components/Upload/CustomUpload";
const { $get, $post, $put } = new GetData()
export default {
  name: "couponList",
  data() {
    return {
      showBathCreateCoupons: false,
      screenData: {
        pageNum: 1,
        pageSize: 50,
        tid: "",
        startDateTime: "",
        endDateTime: "",
        status: "",
        subjectType:1,
        ccUserName: "",
        parentUserId: "",
        externalOrderNo: "",
        systemExist: ""
      },
      applyDate: [],
      tableData: [],
      total: 0,
      loading: false,
      labelWidth: 100,
      tradeStatusOptions: [],
    };
  },
  components: { CustomUpload },
  computed: {
    ...mapGetters(["currentLang"]),
  },
  methods: {

    getFile() {
      this.loading = true;
      const url = `${process.env.VUE_APP_BASE_API}/opsapi/tianmao/order/downloadFile`;
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      axios({
        url: url,
        method: "get",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
        },
        params : params
      })
        .then((response) => {
          let blob = new Blob([response.data]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = `天猫订单.xls`; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          root.$notify({
            message: root.$t("请查看已下载文件《file.xlsx》"),
            type: "success",
          });
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .finally(
          () => {
            // 这里的代码会在then或catch执行完毕后执行
            this.loading = false;
          }
        );
    },

    initData() {
      this.tradeStatusOptions = [
        { label: this.$t("待支付"), value: "0" },
        { label: this.$t("已支付"), value: "1" },
        { label: this.$t("已退款"), value: "3" },

      ];
      this.systemExistOptions = [
        { label: this.$t("是"), value: true },
        { label: this.$t("否"), value: false },
      ];
    },
    search() {
      this.screenData.pageNum = 1;
      this.getTableData();
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.getTableData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getTableData();
    },
    timeChange () {
      if (this.applyDate) {
        this.screenData.startDateTime = new Date(`${this.applyDate[0]} 00:00`).toISOString()
        this.screenData.endDateTime = new Date(`${this.applyDate[1]} 23:59`).toISOString()
      } else {
        this.screenData.startDateTime = ''
        this.screenData.endDateTime = ''
      }
    },
    getTableData() {
      this.loading = true;
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      this.$Api.tianmaoManagement
        .getOrderList(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.list;
          }
          this.loading = false;
        });
    },
    download(){
      this.loading = true;
      let params = {};
      for (var key in this.screenData) {
        if (this.screenData[key] !== "") {
          params[key] = this.screenData[key];
        }
      }
      this.$Api.tianmaoManagement
        .getDownloadFile(params)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.tableData = data.data.list;
          }
          this.loading = false;
        });
    }
  },
  created() {
    this.getTableData();
    this.initData();
  },


};

</script>
<style lang="scss" scoped>
.coupon-list-wrap {
  .create-coupon-wrap {
    width: 100%;
    text-align: right;
    margin-top: 10px;
  }
  .coupon-table-wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .top {
    width: 100%;
    display: flex;
  }
  .textarea {
    width: 100%;
  }
}
</style>
