<template>
  <BasicTable
    v-loading="tableState.loading"
    header-cell-class-name="my-theme-color-header"
    border
    :data="tableState.data"
    :column="tableState.columns"
  />
</template>
<script>
import BasicTable from "@/components/table/basic-table";
import { onMounted, ref, computed, reactive } from "@vue/composition-api";

export default {
  components: { BasicTable },
  setup(props, { root, emit, refs }) {
    const tableState = reactive({
      loading: false,
      data: [],
      columns: computed(() => {
        const { page, limit } = tableState;
        return [
          {
            width: "50",
            label: root.$t("序号"),
            render: (h, { $index }) => $index + 1,
          },
          { label: root.$t("支付方式"), prop: "methodName" },
          {
            label: root.$t("支付通道"),
            prop: "channelRespList",
            render: (h, { row }) => {
              let tag = row.channelRespList;
              return h("div", [
                tag.map(function (items, index) {
                  return h(
                    "div",
                    {
                      style: {
                        height: "32px",
                        lineHeight: "32px",
                        marginTop: "8px",
                      },
                    },
                    items.channelName
                  );
                }),
              ]);
            },
          },
          {
            label: root.$t("占比"),
            prop: "studentNums",
            width: "180",
            render: (h, { row }) => {
              let tag = row.channelRespList;
              return h("div", [
                tag.map(function (items, index) {
                  return (
                    <span>
                      <el-input-number
                        min={0}
                        max={100}
                        style="margin-top:8px"
                        value={items.scale}
                        onInput={(val) => {
                          items.scale = val;
                        }}
                      ></el-input-number>{" "}
                      %
                    </span>
                  );
                }),
              ]);
            },
          },
        ];
      }),
    });
    const reqList = async () => {
      try {
        tableState.loading = true;
        Object.assign(tableState, { data: [] });
        const res =
          await root.$Api.financeManagement.reqAllPayMethodAndChannel();
        res.forEach((e) => {
          e.channelRespList.forEach((t) => {
            t.scale = 0;
          });
        });
        Object.assign(tableState, {
          data: res ?? [],
        });
      } finally {
        tableState.loading = false;
      }
    };
    onMounted(() => {
      reqList();
    });

    return {
      tableState,
    };
  },
};
</script>
