<template>
  <div class="wechat" v-loading="loading">
    <div class="title">{{ $t("微信绑定数据") }}</div>
    <div class="search">
      <CommonTree @get_seleParams="handleChange" />
      <el-button
        type="primary"
        style="height: 32px"
        @click="handleSearch"
        :disabled="!userIdStr && !postIdStr"
      >
        {{ $t("查询") }}
      </el-button>
    </div>
    <div class="title">{{ $t("学管家长不去重数据") }}：</div>
    <section>
      <div>
        <label>{{ $t("家长总数(未去重)") }}：</label>
        {{ totalData.parentNums }}
      </div>
      <div>
        <label>{{ $t("微信绑定家长数(未去重)") }}：</label>
        {{ totalData.wechatNums }}
      </div>
      <div>
        <label>{{ $t("微信绑定率") }}：</label>
        {{ totalData.rate }}
      </div>
    </section>
    <div class="title">{{ $t("学管家长去重数据") }}：</div>
    <section>
      <div>
        <label>{{ $t("家长总数(去重)") }}：</label>
        {{ distinctData.parentNums }}
      </div>
      <div>
        <label>{{ $t("微信绑定家长数(去重)") }}：</label>
        {{ distinctData.wechatNums }}
      </div>
      <div>
        <label>{{ $t("微信绑定率") }}：</label>
        {{ distinctData.rate }}
      </div>
    </section>
    <div class="title">
      {{ $t("以下数据为每个学管独立数据，学管间家长不去重") }}
    </div>
    <BasicTable
      border
      :data="tableState.data"
      :column="tableState.columns"
      :pagination="true"
      :page="tableState.page"
      :total="tableState.total"
      :limit="tableState.limit"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import { reactive, computed, ref, unref } from "@vue/composition-api";
import {
  getWechatAddDataOverview,
  getWechatAddDataList,
} from "@/api/dataManagement";

import BasicTable from "@/components/table/basic-table";
import CommonTree from "../reportManagement/commonTree";

const { id } = JSON.parse(localStorage.getItem("userInfo"));

export default {
  components: {
    BasicTable,
    CommonTree,
  },
  setup(props, { root }) {
    const isEn = computed(() => root.$store.getters.currentLang === "en");

    const loading = ref(false);
    const userIdStr = ref("");
    const postIdStr = ref("");
    const totalData = ref({
      parentNums: void 0,
      wechatNums: void 0,
      rate: void 0,
    });
    const distinctData = ref({
      parentNums: void 0,
      wechatNums: void 0,
      rate: void 0,
    });

    const handleChange = (val, valName) => {
      switch (valName) {
        case "postIdList":
          postIdStr.value = val.join(",");
          break;
        case "userIdList":
          userIdStr.value = val.join(",");
          break;
        case "clear":
          userIdStr.value = postIdStr.value = "";
          break;
      }
    };

    const tableState = reactive({
      total: 0,
      page: 1,
      limit: 50,
      data: [],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => (page - 1) * limit + $index + 1,
          },
          { label: root.$t("学管姓名"), prop: "xgUserName" },
          { label: root.$t("组别"), prop: "group" },
          { label: root.$t("学生数"), prop: "studentNums" },
          { label: root.$t("家长数"), prop: "parentNums" },
          { label: root.$t("微信绑定家长数"), prop: "wechatNums" },
          { label: root.$t("微信绑定率"), prop: "rate" },
        ];
      }),
    });

    const handlePaginationChange = async (info) => {
      Object.assign(tableState, info);
      await queryTableData();
    };

    const getWechatAddData = async () => {
      Object.assign(totalData.value, {
        parentNums: void 0,
        wechatNums: void 0,
        rate: void 0,
      });
      Object.assign(distinctData.value, {
        parentNums: void 0,
        wechatNums: void 0,
        rate: void 0,
      });
      const res = await getWechatAddDataOverview({
        userId: id,
        postIdStr: unref(postIdStr),
        userIdStr: unref(userIdStr),
      });
      totalData.value = res?.totalData ?? {};
      distinctData.value = res?.distinctData ?? {};
    };

    const queryTableData = async () => {
      try {
        loading.value = true
        Object.assign(tableState, { data: [], total: 0 });
        const res = await getWechatAddDataList({
          userId: id,
          postIdStr: unref(postIdStr),
          userIdStr: unref(userIdStr),
          pageNum: tableState.page,
          pageSize: tableState.limit,
        });
        Object.assign(tableState, { data: res?.list ?? [], total: res?.total ?? 0 });
      } finally {
        loading.value = false
      }
    };

    const handleSearch = async () => {
      try {
        loading.value = true;
        await Promise.all([
          getWechatAddData(),
          handlePaginationChange({ page: 1 }),
        ]);
      } finally {
        loading.value = false;
      }
    };

    return {
      isEn,
      loading,
      userIdStr,
      postIdStr,
      tableState,
      totalData,
      distinctData,

      handleChange,
      handleSearch,
      handlePaginationChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.wechat {
  padding: 24px;

  label {
    color: #606266;
  }

  .title {
    margin: 24px 0;
    font-size: 16px;
    font-weight: 700;

    &:first-child {
      margin-top: 0;
    }
  }

  .search {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  section {
    display: flex;
    justify-content: space-between;
  }

  .free-table {
    margin-top: -16px;
  }
}
</style>
