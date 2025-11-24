
<template>
  <!-- 学管分配设置 -->
  <div class="la-allocation-settings">
    <el-table
      v-loading="tableState.loading"
      :data="tableState.tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column :label="$t('配置项名称')">
        <template slot-scope="scope">
          {{ currentLang === "en" ? scope.row.titleEn : scope.row.titleZh }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('配置内容')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.content" :key="item">
            {{ currentLang === "en" ? item.postNameEn : item.postNameZh }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" :label="$t('操作')">
        <template>
          <el-button @click="openConfigDialog" type="text">{{
            $t("编辑")
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('选择可交接组')"
      :visible.sync="dialogState.showDialog"
      width="500px"
      :before-close="handleClose"
      top="10vh"
    >
      <div v-loading="dialogState.loading" class="tree-warp">
        <el-tree
          ref="tree"
          node-key="id"
          show-checkbox
          :data="dialogState.treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :check-strictly="true"
          default-expand-all
        >
          <span class="custom-tree-node" slot-scope="{ node,data }">
            <!-- <span>{{ node.label }}</span> -->
            <span
            >{{ node.label }}
            <el-tag size="mini" v-if="data.type === 3">{{ $t("公司") }}</el-tag>
            <el-tag size="mini" type="success" v-if="data.type === 2">{{
              $t("部门")
            }}</el-tag></span
          >
          </span>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogState.showDialog = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, computed } from "@vue/composition-api";
export default {
  name: "LaAllocationSettings",
  setup(props, { root, refs }) {
    const currentLang = computed(() => root.$store.getters.currentLang);
    /* 配置列表逻辑引用 */ const { tableState, queryTableData } =
      useTable(root);
    /* 岗位树操作逻辑引用 */ const {
      dialogState,
      queryTreeDate,
      openConfigDialog,
      getCheckedNodes,
    } = useConfigDialog(root, refs, queryTableData);
    const defaultProps = {
      children: "subList",
      label: "nameZh",
    };
    onMounted(async () => {
      await queryTableData();
    });
    return {
      currentLang,
      defaultProps,
      tableState,
      queryTableData,
      dialogState,
      queryTreeDate,
      openConfigDialog,
      getCheckedNodes,
    };
  },
};
/* 配置项目表格逻辑 */
const useTable = (root) => {
  const tableState = reactive({
    loading: false,
    tableData: [
      {
        titleZh: "顾问交接学管可选组",
        titleEn: "Handover group for CC to LA",
        content: [],
      },
    ],
  });
  //获取配置列表
  const queryTableData = async () => {
    tableState.loading = true;
    tableState.tableData[0].content = [];
    const {
      status,
      data: { code, data },
    } = await root.$Api.workBench.getLAConfigList().finally(() => {
      tableState.loading = false;
    });
    if (status !== 200 || code !== 200) return Promise.reject();
    let content = [];
    data.forEach((e) => {
      content.push({
        postNameZh:
          e.parentPostNameZh !== e.postNameZh
            ? `${e.parentPostNameZh}/${e.postNameZh}`
            : e.postNameZh,
        postNameEn:
          e.parentPostNameEn !== e.postNameEn
            ? `${e.parentPostNameEn}/${e.postNameEn}`
            : e.postNameEn,
      });
    });
    tableState.tableData[0].content = content;
  };
  return {
    tableState,
    queryTableData,
  };
};
/* 设置交接组逻辑 */
const useConfigDialog = (root, refs, queryTableData) => {
  const dialogState = reactive({
    showDialog: false,
    loading: false,
    treeData: [],
  });
  // 岗位tree回显
  const setCheckedNodes = async () => {
    const {
      status,
      data: { code, data },
    } = await root.$Api.workBench.getLAConfigList({
      configType: 1,
    });
    if (status !== 200 && code !== 200) return Promise.reject();
    let configPostIds = [];
    data.forEach((e) => {
      configPostIds.push(e.configPostId);
    });
    refs.tree.setCheckedKeys(configPostIds);
  };
  // 获取权量岗位tree
  const queryTreeDate = async () => {
    dialogState.treeData = [];
    dialogState.loading = true;
    const {
      status,
      data: { code, data },
    } = await root.$Api.systemManagement.getJobPositionList().finally(() => {
      dialogState.loading = false;
    });
    if (status !== 200 || code !== 200) return Promise.reject();
    let flatList = data;
    flatList.forEach((item) => {
      if (item.id === 4) {
        item.disabled = true;
      }
      if (item.pid == null || item.pid == item.id) {
        dialogState.treeData.push(item);
      } else {
        flatList.forEach((ite) => {
          if (ite.id == item.pid) {
            ite.subList = ite.subList || [];
            ite.subList.push(item);
          }
        });
      }
    });
    let arr = [
      { id: 0, nameZh: "全部", disabled: true, subList: dialogState.treeData },
    ];
    dialogState.treeData = arr;
  };
  const openConfigDialog = async () => {
    dialogState.showDialog = true;
    await queryTreeDate();
    await setCheckedNodes();
  };
  // 获取勾选节点更新配置树
  const getCheckedNodes = async () => {
    const checkedNodes = refs.tree.getCheckedNodes();
    let postIdList = [];
    checkedNodes.forEach((e) => {
      postIdList.push(e.id);
    });
    const {
      status,
      data: { code, data },
    } = await root.$Api.workBench.setHandoverConfig({
      configType: 1,
      postIdList,
    });
    if (status !== 200 && code !== 200) return Promise.reject();
    dialogState.showDialog = false;
    queryTableData();
  };

  return {
    dialogState,
    queryTreeDate,
    openConfigDialog,
    getCheckedNodes,
    setCheckedNodes,
  };
};
</script>

<style lang='scss' scoped>
.la-allocation-settings {
  padding: 20px;
  .tree-warp {
    height: 500px;
    overflow: scroll;
  }
}
</style>
