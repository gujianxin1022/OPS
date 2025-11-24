<template>
  <div>
    <BasicTable border v-loading="loading" :column="columns" :data="data" />
    <DataMigrationTable
      :visible.sync="visible"
      :parentUserId="parentUserId"
      :coursePackageId="coursePackageId"
      :parentUserName="parentUserName"
      @ok="$emit('refresh')"
    />
  </div>
</template>

<script>
import {
  computed,
  onMounted,
  reactive,
  toRefs,
  ref,
} from "@vue/composition-api";

import BasicTable from "@/components/table/basic-table";
import DataMigrationTable from "../../dataMigration/DataMigrationTable";
import handlePermission from "@/utils/handlePermission";

const { handleButtonPer } = handlePermission;

export default {
  name: "overview",
  components: {
    BasicTable,
    DataMigrationTable,
  },
  props: {
    parentUserId: {
      type: String,
      default: null,
    },
    parentUserName: {
      type: String,
      default: null,
    },
    coursePackageId: {
      type: [String, Number],
      default: null,
    },
  },
  setup(props, { root }) {
    const visible = ref(false);

    const tableState = reactive({
      loading: false,
      data: [],
      columns: computed(() => [
        {
          label: root.$t("课时归属"),
          render: (h, { row }) =>
            row.ownerType === 1 ? root.$t("家长") : row.ownerName,
        },
        { label: root.$t("剩余课时"), prop: "remainAmount" },
        {
          label: root.$t("操作"),
          render: (h, { row }) => (
            <div>
              {handleButtonPer(
                "teach.studentMT.parentInfo.accountDataMigration"
              ) &&
                row.ownerType === 1 && (
                  <el-button
                    type="text"
                    onClick={() => (visible.value = true)}
                    disabled={!row.remainAmount}
                  >
                    {root.$t("账户迁移")}
                  </el-button>
                )}
              {row.ownerType === 2 && (
                <el-button type="text" onClick={() => handleView(row)}>
                  {root.$t("查看")}
                </el-button>
              )}
            </div>
          ),
        },
      ]),
    });

    const queryTableData = async () => {
      try {
        tableState.loading = true;
        const data =
          await root.$Api.studentManagement.getParentAccountOverviewInfo({
            parentUserId: props.parentUserId,
            coursePackageId: props.coursePackageId,
          });
        tableState.data = data;
      } finally {
        tableState.loading = false;
      }
    };

    const handleView = (row) => {
      root.$router.push({
        name: "studentInfo",
        query: {
          tab: "studentAccount",
          studentName: row.ownerName,
          studentId: String(row.ownerId),
          coursePackageId: props.coursePackageId,
        },
      });
    };

    onMounted(queryTableData);

    return {
      visible,
      ...toRefs(tableState),
    };
  },
};
</script>
