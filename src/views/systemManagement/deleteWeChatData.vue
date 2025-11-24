<template>
  <div class="delete-wechat-data">
    <h2 class="mb25">{{ $t("微信数据删除") }}</h2>
    <el-form
      :inline="true"
      :model="searchForm"
    >
      <el-form-item
        :label="$t('微信Id')"
        class="mr15"
      >
        <el-input
          clearable
          style="width: 300px"
          v-model.trim="searchForm.weChatId"
          :placeholder="`${$t('请输入')} ${$t('微信Id')}`"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSingleSearch"
        >
          {{ $t("查询") }}
        </el-button>
        <el-button @click="visible = true">
          {{ $t("批量查询") }}
        </el-button>
      </el-form-item>
    </el-form>
    <header>
      <h2 class="mt15">{{ $t("数据操作") }}</h2>
      <el-button
        @click="handleBatchDelete"
        :disabled="!selectedIds.length"
        :loading="searchForm.batchDelLoading"
      >
        {{ $t("批量删除") }}
      </el-button>
    </header>
    <el-table
      ref="multipleTable"
      row-key="openId"
      :header-cell-style="{ background: '#626DC4', color: '#fff' }"
      v-loading="tableLoading"
      :data="tableData"
      @selection-change="
        (val) => (selectedIds = val.map((item) => item.openId))
      "
    >
      <el-table-column
        type="selection"
        :selectable="(row) => row.isExists"
        reserve-selection
      />
      <el-table-column
        prop="openId"
        label="OpenId"
      />
      <el-table-column
        prop="isExists"
        :label="$t('数据是否存在')"
      >
        <template slot-scope="scope">
          {{ scope.row.isExists ? $t("found") : $t("notFound") }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')">
        <template slot-scope="scope">
          <el-button
            type="text"
            :loading="scope.row.loading"
            :disabled="!scope.row.isExists"
            @click="handleSingleDelete(scope.row)"
          >
            {{ $t("删除") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('批量查询')"
      width="410px"
      :visible="visible"
      :before-close="handleCancel"
    >
      <span>{{ $t("说明：每行一个OpenId，以回车分割，最多可输入100条") }}</span>
      <el-form
        :model="searchForm"
        :rules="rules"
        ref="ruleForm"
        class="mt15"
      >
        <el-form-item prop="weChatBatchId">
          <el-input
            type="textarea"
            :rows="6"
            :placeholder="$t('请输入')"
            v-model="searchForm.weChatBatchId"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        style="display: flex; justify-content: center"
      >
        <el-button @click="handleCancel">{{ $t("取消") }}</el-button>
        <el-button
          type="primary"
          @click="handleOk"
        >{{ $t("确定") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { h, reactive, ref, set, toRefs } from "@vue/composition-api";
import { ABNORMAL_CODE } from "@/utils/constants";
export default {
  name: "delete-wechat-data",
  setup (props, { root, refs }) {
    const searchForm = reactive({
      weChatId: "",
      weChatBatchId: "",
      batchDelLoading: false,
    });
    const tableState = reactive({
      queryIds: [],
      deleteIds: [],
      selectedIds: [],
      tableData: [],
      tableLoading: false,
    });

    const queryTableData = async () => {
      refs.multipleTable.clearSelection();
      tableState.tableLoading = true;
      const {
        status,
        data: { code, data },
      } = await root.$Api.systemManagement.queryWeChatDelList({
        openIdList: tableState.queryIds,
      });
      if (status !== 200 || code !== 200) return Promise.reject();
      Object.assign(tableState, { tableData: data, tableLoading: false });
    };
    const handleSingleSearch = async () => {
      if (!searchForm.weChatId) return (tableState.tableData = []);
      tableState.queryIds = [searchForm.weChatId];
      await queryTableData();
      searchForm.weChatId = "";
    };

    const delConfirm = async () => {
      const [one, tow] = root
        .$t("数据删除后不可恢复，确认删除这x条微信数据吗")
        .replace("$", tableState.deleteIds.length)
        .split("|");
      await root.$confirm(
        root.$store.getters.currentLang === "zh"
          ? one
          : h("div", { style: { lineHeight: 1.5 } }, [
            h(
              "span",
              {
                style: {
                  textAlign: "left",
                  display: "inline-block",
                },
              },
              [h("span", one), h("br"), h("span", tow)]
            ),
          ]),
        root.$t("警告"),
        {
          cancelButtonText: root.$t("取消"),
          confirmButtonText: root.$t("确认"),
          type: "warning",
          center: true,
          customClass: "coustom-message",
        }
      );
    };
    const delWeChatInfo = async () => {
      const {
        status,
        data: { code },
      } = await root.$Api.systemManagement.delWeChatInfo({
        openIdList: tableState.deleteIds,
      });
      if (code === ABNORMAL_CODE.noPermission) {
        root.$notify({
          message: root.$t("没有相关权限"),
          type: "error",
          duration: 3000,
        });
      }
      if (status !== 200 || code !== 200) return Promise.reject();
      root.$message.success(root.$t("删除成功"));
    };
    const handleSingleDelete = async (row) => {
      try {
        tableState.deleteIds = [row.openId];
        await delConfirm();
        set(row, "loading", true);
        await delWeChatInfo();
        refs.multipleTable.toggleRowSelection(row, false);
        tableState.tableData.splice(
          tableState.tableData.findIndex((v) => v.openId === row.openId),
          1
        );
      } catch {
        set(row, "loading", false);
      }
    };
    const handleBatchDelete = async () => {
      try {
        tableState.deleteIds = tableState.selectedIds;
        await delConfirm();
        searchForm.batchDelLoading = true;
        await delWeChatInfo();
        refs.multipleTable.clearSelection();
        tableState.tableData = tableState.tableData
          .map((v) => (tableState.deleteIds.includes(v.openId) ? null : v))
          .filter(Boolean);
      } finally {
        searchForm.batchDelLoading = false;
      }
    };

    const visible = ref(false);
    const validator = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error(root.$t("请输入")));
      } else if (value.split(/[\r\n]/).filter(Boolean).length > 100) {
        callback(new Error(root.$t("最多可输入100条")));
      } else {
        callback();
      }
    };
    const rules = { weChatBatchId: [{ validator, trigger: "blur" }] };
    const handleCancel = () => {
      visible.value = false;
      refs.ruleForm.resetFields();
    };
    const handleOk = async () => {
      await refs.ruleForm.validate();
      tableState.queryIds = [
        ...new Set(
          searchForm.weChatBatchId
            .split(/[\r\n]/)
            .map((val) => val.trim())
            .filter(Boolean)
        ),
      ];
      handleCancel();
      queryTableData();
    };

    return {
      searchForm,
      ...toRefs(tableState),
      handleSingleSearch,
      handleBatchDelete,
      handleSingleDelete,

      rules,
      visible,
      handleCancel,
      handleOk,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete-wechat-data {
  padding: 24px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h2 {
    font-size: 14px;
  }
  ::v-deep .el-table {
    .el-checkbox__inner {
      border-radius: 4px;
    }
    .el-table__header-wrapper {
      .el-checkbox__inner {
        background: #fff;
        border-color: #fff;
        border-radius: 4px;
        &::after {
          border-color: #626dc4;
        }
      }
      .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        background: #626dc4;
      }
    }
    .el-table__body-wrapper {
      tr:nth-child(even) {
        background: #ecedf9;
      }
      tr:nth-child(odd) {
        background: #f9f9ff;
      }
    }
  }
}
</style>
<style lang="scss">
.coustom-message {
  width: 340px;
  border-radius: 16px;
  .el-message-box__btns {
    padding: 10px 30px 0;
    display: flex;
    justify-content: space-between;
    .el-button {
      flex: 1;
      border-radius: 8px;
      &:last-child {
        margin-left: 24px;
      }
    }
  }
  .el-message-box__message > p {
    text-align: left;
  }
}
</style>
