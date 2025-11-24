<template>
  <!-- 学生下课时流水 -->
  <div>
    <el-input
      :style="isEn ? 'width: 250px' : 'width: 220px'"
      :placeholder="$t('请输入订单编号')"
      v-model="orderNo"
      clearable
      class="input-with-select mb10 fr"
      @keyup.enter.native="queryTableData"
    >
      <el-button
        slot="append"
        @click="queryTableData"
        icon="el-icon-search"
      ></el-button>
    </el-input>
    <BasicTable
      border
      v-loading="loading"
      :column="columns"
      :data="data"
      :page="page"
      :total="total"
      :limit="limit"
      :pagination="true"
      @pagination="handlePaginationChange"
    />
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  reactive,
  toRefs,
  unref,
  ref,
} from "@vue/composition-api";

import moment from "moment";
import BasicTable from "@/components/table/basic-table";

export default {
  name: "overview",
  components: {
    BasicTable,
  },
  props: ["studentUserId", "coursePackageId"],
  setup(props, { root }) {
    const isEn = computed(() => root.$store.state.app.currentLang === "en");
    const orderNo = ref("");
    const tableState = reactive({
      loading: false,
      page: 1,
      limit: 30,
      total: 0,
      data: [],
      columns: computed(() => [
        {
          label: root.$t("序号"),
          width: 80,
          render: (h, { $index }) =>
            (tableState.page - 1) * tableState.limit + $index + 1,
        },
        {
          label: root.$t("时间"),
          render: (h, { row }) =>
            row.createTime &&
            moment(row.createTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        { label: root.$t("课时变动"), prop: "amount" },
        {
          prop: "type",
          render: (h, { row }) => (
            <span class="text-wrap"> {root.$t(root.Constants.classTypeMap[row.type])}</span>
          ),
          renderHeader: (_, { row }) => {
            return (
              <div>
                {root.$t("课时类型")}
                <el-tooltip effect="dark" placement="top-end">
                  <div slot="content" style="line-height:20px;">
                    <span class="text-wrap">{root.$t("课时类型说明：")}</span>
                    <br />
                    <span class="text-wrap">
                      {root.$t("付费课时: 订单内购买的正价课时；")}
                    </span>
                    <br />
                    <span class="text-wrap">
                      {root.$t("赠送课时: 随着订单赠送的课时；")}
                    </span>
                    <br />
                    <span class="text-wrap">
                      {root.$t("运营课时: 人工手动添加的课时；")}
                    </span>
                    <br />
                    <span class="text-wrap">
                      {root.$t("积分兑换课时: 使用积分兑换的课时。")}
                    </span>
                  </div>
                  <i
                    class={"iconfont ppIcon-problem"}
                    style={"font-size:13px;margin-left:5px;cursor:pointer"}
                  ></i>
                </el-tooltip>
              </div>
            );
          },
        },
        {
          label: root.$t("订单编号"),
          prop: "orderNo",
          width: 255,
          render: (h, { row }) => row.orderNo || "-",
        },

        {
          label: root.$t("原因"),
          render: (h, { row }) => {
            return (
              <span class="text-wrap">
                {unref(isEn) ? row.descriptionEn : row.descriptionZn}
              </span>
            );
          },
        },
      ]),
    });

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const data =
          await root.$Api.studentManagement.getStudentAccountFlowDetailsList({
            studentUserId: props.studentUserId,
            pageNum: tableState.page,
            pageSize: tableState.limit,
            coursePackageId: props.coursePackageId,
            orderNo: orderNo.value,
          });
        tableState.data = data.list;
        tableState.total = data.total;
      } finally {
        tableState.loading = false;
      }
    };

    const handlePaginationChange = (info) => {
      Object.assign(tableState, info);
      queryTableData();
    };

    onMounted(queryTableData);

    return {
      ...toRefs(tableState),
      isEn,
      orderNo,
      queryTableData /* 课时转换成功刷新列表 */,
      handlePaginationChange,
    };
  },
};
</script>
