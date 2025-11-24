<template>
  <div class="revenue-voucher-container">
    <screen-wrapper @search="search" screenTitle>
      <screen-item :label="$t('类型')">
        <el-select
          clearable
          v-model="screenData.type"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in revenueTypeTopList(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('BU')">
        <el-select
          clearable
          v-model="screenData.worktagBusinessUnitId"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in buList(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('状态')">
        <el-select
          clearable
          v-model="screenData.uploadStatus"
          :placeholder="$t('请选择')"
        >
          <el-option
            v-for="item in pushStatusList(isEn)"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </screen-item>
      <screen-item :label="$t('编号')" :label-width="isEn ? 280 : 140">
        <el-input
          v-model.trim="screenData.journalLineExternalReferenceId"
          clearable
        />
      </screen-item>
      <screen-item :label="$t('月份')" label-width="140">
        <el-date-picker
          value-format="yyyyMM"
          v-model="screenData.journalLineExternalLike"
          type="month"
          placeholder=""
        >
        </el-date-picker>
      </screen-item>
    </screen-wrapper>
    <custom-card :title="$t('数据列表')" class="table-wrapper">
      <div slot="header-right">
        <el-button
          class="mr5"
          type="primary"
          @click="handleDownload()"
          :loading="downloadLoading"
          v-if="
            Per.handleButtonPer(
              'financeMT.revenueMT.revenueVoucher.download'
            )
          "
        >
          {{ $t("下载") }}
        </el-button>
        <el-button
          type="primary"
          @click="handlePush()"
          :loading="pushLoading"
          v-if="
            Per.handleButtonPer(
              'financeMT.revenueMT.revenueVoucher.push'
            )
          "
        >
          {{ $t("推送") }}
        </el-button>
      </div>
      <el-table
        :span-method="spanMethod"
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%; margin-top: 10px"
        stripe
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" fixed />
        <el-table-column
          v-for="(column, index) in keyMapArr"
          :width="smallCol.includes(column) ? 100 : 250"
          :key="index"
          :label="column"
          :prop="column"
        >
          <template slot-scope="{ row }">
            <span v-if="column === 'source'">
              <span v-if="row.source === 1">{{ $t("课包收入相关") }}</span>
              <span v-else-if="row.source === 2">{{
                $t("赠送课和积分相关")
              }}</span>
              <span v-else-if="row.source === 3">{{ $t("免费课") }}</span>
              <span v-else>-</span>
            </span>
            <span v-else-if="column === 'type'">
              {{ revenueTypeFilter(isEn, row.type) }}
            </span>
            <span v-else-if="column === 'submit'">
              <span v-if="row.source === 1">{{ $t("已记账") }}</span>
              <span v-else-if="row.source === 0">{{ $t("草稿模式") }}</span>
              <span v-else>-</span>
            </span>
            <span v-else-if="column === 'createTime'">
              {{ DateTimeUtils.dateClockTime(row.createTime) }}
            </span>
            <span v-else-if="column === 'uploadStatus'">
              <span v-if="row.uploadStatus === 1">{{ $t("已推送") }}</span>
              <span v-else-if="row.uploadStatus === 0">{{ $t("未推送") }}</span>
              <span v-else>-</span>
            </span>
            <span v-else>
              {{ row[column] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          width="150"
          :label="$t('操作')"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              :loading="row.loading"
              @click="handleDownloadDetail(row)"
              v-if="
                Per.handleButtonPer(
                  'financeMT.revenueMT.revenueVoucher.downloadDetail'
                )
              "
              >{{ $t("下载明细") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="pageData.total"
        :current-page="pageData.pageNum"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </custom-card>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  unref,
  set,
} from "@vue/composition-api";
import {
  revenueTypeTopList,
  pushStatusList,
  revenueTypeFilter,
  buList,
  keymaps,
} from "./constanst";
import axios from "axios";
import { getDevice } from "@/utils/handleData";
import datetime from "@/utils/datetime_utils";
import { deepClone } from "../../../../utils/handleData";
import moment from "moment";
const jstz = require("@/utils/jstz");
const timezone = jstz.jstz.determine();
const ua = navigator.userAgent.toLowerCase();
export default defineComponent({
  setup(_, { root, emit, refs }) {
    const smallCol = [
      "id",
      "type",
      "source",
      "submit",
      "currency",
      "uploadStatus",
      "createTime",
      "lineOrder",
      "debitAmount",
      "creditAmount",
      "lineCurrency",
    ];
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const screenData = reactive({
      type: void 0,
      worktagBusinessUnitId: void 0,
      uploadStatus: void 0,
      journalLineExternalReferenceId: void 0,
      journalLineExternalLike: "",
    });
    const pageData = reactive({
      pageNum: 1,
      pageSize: 50,
      total: 0,
    });
    const downloadLoading = ref(false);
    const pushLoading = ref(false);
    const keyMapArr = ref([]);
    const loading = ref(false);
    const tableData = ref(null);
    const selectedRows = ref(null);
    const handleDownload = () => {
      if (!unref(selectedRows)?.length)
        return root.$notify.warning(root.$t("请选择凭证"));
      downloadLoading.value = true;
      const url = `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/collection/voucher/download/voucher`;
      const ids = unref(selectedRows).map(
        (t) => t.journalLineExternalReferenceId
      );
      axios({
        url: url,
        method: "post",
        data: { journalLineExternalReferenceIdList: ids },
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
          "X-LNG": root.$store.getters.currentLang,
          "X-TZ": timezone.name() + " " + datetime.getTimeZone(),
          "X-DEVICE": getDevice(ua),
        },
      }).then((response) => {
        try {
          const enc = new TextDecoder("utf-8");
          const res = JSON.parse(enc.decode(new Uint8Array(response.data))); //转化成json对象
          if (res.code !== 200) {
            root.$notify.error(root.$t("操作失败"));
          }
          downloadLoading.value = false;
        } catch (err) {
          let blob = new Blob([response.data]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          const date = moment(new Date()).add("year", 0).format("YYY-MM-DD");
          downloadElement.download = `voucher-${date}.xlsx`;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
          downloadLoading.value = false;
        }
      });
    };
    const handlePush = () => {
      if (!unref(selectedRows)?.length)
        return root.$notify.warning(root.$t("请选择凭证"));
      pushLoading.value = true;
      const ids = unref(selectedRows).map(
        (t) => t.journalLineExternalReferenceId
      );
      root.$Api.financeManagement
        .pushRevenuwVoucher(ids)
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject(data);
          root.$notify.success(root.$t("操作成功"));
          pushLoading.value = false;
          getData();
        })
        .catch((response) => {
          root.$notify.error(response[0]?.reasonZh);
          pushLoading.value = false;
        });
    };

    const getCurrentPage = (page) => {
      pageData.pageNum = page;
      getData();
    };

    const getPerPage = (perPage) => {
      pageData.pageSize = perPage;
      getData();
    };

    const handleDownloadDetail = (item) => {
      set(item, "loading", true);
      const url = `${process.env.VUE_APP_BASE_API}/opsapi/finance/reconciliation/collection/voucher/download/voucher/details?journalLineExternalReferenceId=${item.journalLineExternalReferenceId}`;
      root.$Api.financeManagement
        .downloadRevenuwVoucherDetail()
        .then(({ status, data: { code, data } }) => {
          if (status !== 200 || code !== 200) return Promise.reject();
        });
      axios({
        url: url,
        method: "get",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(window.localStorage.getItem("userInfo")).jwtToken
          }`,
          "X-LNG": root.$store.getters.currentLang,
          "X-TZ": timezone.name() + " " + datetime.getTimeZone(),
          "X-DEVICE": getDevice(ua),
        },
      }).then((response) => {
        try {
          const enc = new TextDecoder("utf-8");
          const res = JSON.parse(enc.decode(new Uint8Array(response.data)));
          if (res.code === 10001) {
            root.$notify.error(root.$t("下载量太大，请联系管理员"));
          } else if (res.code !== 200) {
            root.$notify.error(root.$t(res.message));
          }
          if(res.code===200){
            root.$notify.success(root.$t('文件已发送至您的邮箱，需要一些时间到达，请查收'));
          }
          set(item, "loading", false);
        } catch (err) {
          let blob = new Blob([response.data]);
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = `${item.journalLineExternalReferenceId}-details.xlsx`;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
          set(item, "loading", false);
        }
      });
    };

    const sliptDataByCourse = (list) => {
      const copyList = deepClone(list);
      const map = new Map();
      copyList.forEach((item, index) => {
        const id = item.journalLineExternalReferenceId;
        if (!map.has(id)) {
          map.set(id, [item]);
        } else {
          map.set(id, map.get(id).concat([item]));
        }
      });
      let flag = 0;
      copyList.forEach((_t, _i) => {
        const id = _t.journalLineExternalReferenceId;
        if (map.has(id) && _i === flag) {
          const len = map.get(id).length;
          _t.rowspan = map.get(id).length;
          flag += len;
        }
      });
      return copyList;
    };

    const spanMethod = ({ row, columnIndex }) => {
      if (columnIndex === 0 || columnIndex === unref(keyMapArr).length + 1) {
        if (row.rowspan) {
          return {
            rowspan: row.rowspan,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    };

    const handleSelectionChange = (list) => {
      selectedRows.value = list;
    };

    const getData = () => {
      const params = {
        ...screenData,
        ...pageData,
      };
      delete params.total;
      loading.value = true;
      root.$Api.financeManagement
        .getRevenueVoucherList(params)
        .then(({ status, data: { code, data } }) => {
          if (code !== 200 || status !== 200) return Promise.reject();
          tableData.value = sliptDataByCourse(data.list);
          pageData.total = data.total;
          try {
            keyMapArr.value = data.list?.length
              ? Object.keys(data.list[0])
              : Object.keys(keymaps);
          } catch {
            loading.value = false;
          }
          loading.value = false;
        })
        .catch(() => {
          tableData.value = [];
          pageData.total = 0;
        });
    };
    const search = () => {
      pageData.pageNum = 1;
      getData();
    };
    onMounted(getData);
    return {
      isEn,
      ref,
      loading,
      screenData,
      tableData,
      selectedRows,
      keyMapArr,
      handleDownload,
      downloadLoading,
      pushLoading,
      handlePush,
      pageData,
      smallCol,
      search,
      handleDownloadDetail,
      handleSelectionChange,
      getPerPage,
      getCurrentPage,

      revenueTypeTopList,
      pushStatusList,
      revenueTypeFilter,
      buList,
      keymaps,
      spanMethod,
    };
  },
});
</script>

<style lang="scss" scoped>
.revenue-voucher-container {
  padding: 10px 0 0 10px;
}
::v-deep {
  .el-table .cell {
    word-break: break-word !important;
  }
}
</style>
