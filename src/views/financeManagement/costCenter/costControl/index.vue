<template>
  <div class="cost-control">
    <el-button
      type="primary"
      @click="hanldeAdd(LEVEL_1)"
      v-if="
        Per.handleButtonPer('financeMT.costCenter.costControl.addFirstLevelCost')
      "
    >
      {{ $t("新增一级成本") }}
    </el-button>
    <el-table
      :data="tableData"
      class="mt15"
      v-loading="tableLoading"
      ref="expansionTable"
    >
      <el-table-column type="expand">
        <template slot-scope="{ row: { financeCostResultResps } }">
          <div class="second-level-box">
            <div class="title">{{ $t("二级成本中心") }}</div>
            <el-table
              :show-header="false"
              :data="financeCostResultResps"
              v-if="financeCostResultResps.length"
            >
              <el-table-column label="id" prop="id" width="80" />
              <el-table-column
                :label="$t('成本中心')"
                :prop="
                  $store.state.app.currentLang === 'zh'
                    ? 'costNameZh'
                    : 'costNameEn'
                "
              />
              <el-table-column :label="$t('添加人')" prop="createUserName" />
              <el-table-column :label="$t('添加时间')" prop="createTime">
                <template slot-scope="{ row }">
                  {{ moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
                </template>
              </el-table-column>
              <el-table-column width="180" />
            </el-table>
            <div class="empty" v-else>
              {{ $t("待添加二级成本，以此生效一级成本") }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150">{{ $t("一级成本中心") }}</el-table-column>
      <el-table-column label="id" prop="id" width="80" />
      <el-table-column
        :label="$t('成本中心')"
        :prop="
          $store.state.app.currentLang === 'zh' ? 'costNameZh' : 'costNameEn'
        "
      />
      <el-table-column :label="$t('添加人')" prop="createUserName" />
      <el-table-column :label="$t('添加时间')" prop="createTime">
        <template slot-scope="{ row }">
          {{ moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" width="180">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="hanldeAdd(LEVEL_2, row)"
            v-if="
              Per.handleButtonPer(
                'financeMT.costCenter.costControl.newSecondaryCost'
              )
            "
          >
            {{ $t("新增二级成本") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <NewCost
      :pid="pid"
      :level="level"
      :visible.sync="visible"
      @ok="getCostList"
    />
  </div>
</template>

<script>
import moment from "moment";
import {
  markRaw,
  nextTick,
  onMounted,
  reactive,
  toRefs,
} from "@vue/composition-api";
import NewCost from "./components/NewCost.vue";

export const LEVEL_1 = 1;
export const LEVEL_2 = 2;

export default {
  name: "costControl",
  components: { NewCost },
  setup(props, { root, refs }) {
    const newCostState = reactive({ visible: false, pid: null, level: null });
    const tableState = reactive({ tableData: [], tableLoading: false });

    const getCostList = async () => {
      tableState.tableLoading = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.financeManagement.getCostList();
      if (status !== 200 || code !== 200) return Promise.reject();
      tableState.tableData = markRaw(data);
      await nextTick();
      data.forEach((row) => refs.expansionTable.toggleRowExpansion(row, true));
      tableState.tableLoading = false;
    };

    const hanldeAdd = (level, row) => {
      newCostState.level = level;
      newCostState.pid = level === LEVEL_1 ? 0 : row.id;
      newCostState.visible = true;
    };

    onMounted(getCostList);

    return {
      moment,

      LEVEL_1,
      LEVEL_2,
      ...toRefs(newCostState),
      ...toRefs(tableState),

      hanldeAdd,
      getCostList,
    };
  },
};
</script>

<style lang="scss" scoped>
.cost-control {
  padding: 16px;
  .el-table {
    ::v-deep .el-table__expanded-cell {
      padding: 0 0 0 48px;
      background: #fafafa;
      .second-level-box {
        display: flex;
        .title,
        .empty {
          width: 150px;
          line-height: 43px;
          text-align: center;
          border-bottom: 1px#f1f1f1 solid;
        }
        .empty {
          flex: 1;
        }
        .cell {
          line-height: 32px;
        }
        .el-table__row {
          background: #fafafa;
          &:last-child td {
            border: none;
          }
        }
      }
    }
  }
}
</style>
