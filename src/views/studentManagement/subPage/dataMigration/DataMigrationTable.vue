<script>
import BasicTable from "@/components/table/basic-table";
import DataMigrationForm from "./DataMigrationForm";

import { reactive, ref, unref, watch, computed } from "@vue/composition-api";

let IsMigrate = false;

export default {
  name: "DataMigrationTable",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
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
  setup(props, { root, emit }) {
    const coursePackageInfo = reactive({
      availableAmount: void 0,
      coursePackageName: void 0,
      coursePackageNameEn: void 0,
    });

    const dataMigrationFormVisible = ref(false);
    const activeRow = ref({});
    const isZh = computed(() => root.$store.getters.currentLang === "zh");

    const tableState = reactive({
      columns: [],
      data: [],
      loading: false,

      columns: computed(() => [
        { label: root.$t("课程包(产品)ID"), prop: "coursePackageId" },
        {
          label: root.$t("课程包(产品)名称"),
          prop: `${unref(isZh) ? "coursePackageName" : "coursePackageNameEn"}`,
        },
        { label: root.$t("账户余额"), prop: "balance" },
        {
          label: root.$t("操作"),
          render: (h, { row }) => (
            <el-button
              type="text"
              disabled={
                !row.balance ||
                (coursePackageInfo.availableAmount > 0
                  ? row.balance < 0
                  : row.balance > 0)
              }
              onClick={() => handleMigrateAccounts(row)}
            >
              {root.$t("账户迁移")}
            </el-button>
          ),
        },
      ]),
    });

    const handleMigrateAccounts = (row) => {
      dataMigrationFormVisible.value = true;
      activeRow.value = row;
    };
    const handleClose = () => {
      IsMigrate && emit("ok");
      emit("update:visible", false);
    };
    const handleDataMigrationFormOk = () => {
      IsMigrate = true;
      getParentPurchasedDetail();
    };

    const getParentPurchasedDetail = async () => {
      tableState.loading = true;
      const data = await root.$Api.studentManagement.getParentPurchasedDetail({
        parentUserId: props.parentUserId,
        coursePackageId: props.coursePackageId,
      });
      tableState.data = data.coursePackageDetailList;
      Object.assign(coursePackageInfo, {
        availableAmount: data.availableAmount,
        coursePackageName: data.coursePackageName,
        coursePackageNameEn: data.coursePackageNameEn,
      });
      tableState.loading = false;
    };

    watch(
      () => props.visible,
      (val) => {
        IsMigrate = false;
        val && getParentPurchasedDetail();
      }
    );

    return () => {
      const {
        balance,
        coursePackageId,
        balanceId,
        coursePackageName,
        coursePackageNameEn,
      } = unref(activeRow);

      return (
        <div>
          <el-dialog
            width="880px"
            title={root.$t("家长账户数据迁移")}
            before-close={handleClose}
            visible={props.visible}
          >
            <div class="mb20">
              <label>{root.$t("课程包")}：</label>
              <span>
                {unref(isZh)
                  ? coursePackageInfo.coursePackageName
                  : coursePackageInfo.coursePackageNameEn}
              </span>
            </div>
            <div class="mb20">
              <label>{root.$t("可迁移课时总数")}：</label>
              <span>{coursePackageInfo.availableAmount}</span>
            </div>
            <label>{root.$t("课时明细")}：</label>
            <BasicTable
              height="50vh"
              column={tableState.columns}
              data={tableState.data}
              v-loading={tableState.loading}
            />
            <span slot="footer">
              <el-button onClick={handleClose}>{root.$t("取消")}</el-button>
              <el-button type="primary" onClick={handleClose}>
                {root.$t("确定")}
              </el-button>
            </span>
          </el-dialog>
          <DataMigrationForm
            visible={unref(dataMigrationFormVisible)}
            parentUserId={props.parentUserId}
            parentUserName={props.parentUserName}
            balanceTotal={coursePackageInfo.availableAmount}
            balance={balance}
            coursePackageId={coursePackageId}
            coursePackageName={
              unref(isZh) ? coursePackageName : coursePackageNameEn
            }
            balanceId={balanceId}
            on={{
              ok: () => handleDataMigrationFormOk(),
              "update:visible": (val) => (dataMigrationFormVisible.value = val),
            }}
          />
        </div>
      );
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-top: 0px !important;
  top: 50%;
  transform: translateY(-50%);
}
</style>
