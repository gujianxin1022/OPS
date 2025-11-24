<template>
  <div class="delete-parent-account-warp">
    <screen-wrapper
      @search="(screenData.pageNum = 1), search()"
      :screenTitle="$t('filter queries')"
    >
      <screen-item :label="$t('家长ID')" :part="4" :label-width="labelWidth">
        <el-input
          clearable
          v-model.trim="screenData.parentId"
          :placeholder="$t('请输入家长ID')"
          @keyup.enter.native="(screenData.pageNum = 1), search()"
        />
      </screen-item>
    </screen-wrapper>
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
      :default-sort="{ prop: 'date', order: 'descending' }"
      height="500px"
    >
      <!-- 序号 -->
      <el-table-column
        fixed
        align="center"
        :label="$t('序号')"
        :width="currentLang == 'en' ? 110 : 50"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('家长ID')"
        min-width="100"
        prop="userId"
      >
        <template slot-scope="scope">
          <span>
            <router-link
              :to="{
                path: `/studentManagement/parentInfo`,
                query: { parentUserId: scope.row.userId },
              }"
            >
              <el-button type="text">{{ scope.row.userId }}</el-button>
            </router-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('申请状态')"
        width="130"
        prop="status"
      >
        <template slot-scope="scope">
          {{ handleListMap[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('申请人')"
        min-width="80"
        prop="applyUser"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.applyUser">
            {{ scope.row.applyUser.userName }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('申请时间')"
        width="180"
        prop="createTime"
      >
        <template slot-scope="scope">
          {{ DateTimeUtils.dateClockTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('操作人')"
        width="80"
        prop="operator"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.operator">{{
            scope.row.operator.userName
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('操作状态')"
        min-width="180"
        prop="operationRecordResList"
      >
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.operationRecordResList &&
              scope.row.operationRecordResList.length > 0
            "
          >
            <p
              v-for="(item, index) in scope.row.operationRecordResList"
              :key="index"
            >
              {{ DateTimeUtils.dateClockTime(item.operationTime) }}
              {{ item.modelName }}
              {{ handleListMap[item.status] }}
            </p>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('操作')"
        width="220"
        prop="parentName"
      >
        <template slot-scope="scope">
          <template
            v-if="
              Per.handleButtonPer(
                'system.toolkit.deleteParentAccount.operatingAccount'
              )
            "
          >
            <el-button
              :disabled="scope.row.status !== 1"
              size="mini"
              type="danger"
              @click="
                () => {
                  (userId = scope.row.userId), (deleDialogVisible = true);
                }
              "
              >{{ $t("删除") }}</el-button
            >
            <el-button
              :disabled="scope.row.status !== 1"
              size="mini"
              type="primary"
              @click="
                () => {
                  (applyId = scope.row.applyId), (recallDialogVisible = true);
                }
              "
              >{{ $t("撤销申请") }}</el-button
            >
          </template>
          <span v-else>{{$t('无操作权限')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('删除账户申请')"
      :visible.sync="deleDialogVisible"
      width="500px"
      center
      :before-close="handleClose"
      
    >
      <p style="line-height: 30px;word-break: keep-all">
        <span style="color: red">{{ $t("请务必先和用户核实，") }}</span
        >
        {{
          $t("用户的LingoAce和AceEarly Learning账户及所有相关数据将被永久删除。此外，用户将失去全部剩余的课时、积分和优惠券，并且没有退款的可能。")
        }}
      </p>
     
      <p>{{ $t("是否确定删除该用户的账户？") }}</p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="deleDialogVisible = false">{{
          $t("取消（close）")
        }}</el-button>
        <el-button type="danger" @click="confirmDelete">{{
          $t("删除账户")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('撤销删除账户申请')"
      :visible.sync="recallDialogVisible"
      width="442px"
      center
      :before-close="handleClose"
    >
      <p style="line-height: 30px;word-break: keep-all">
        <span style="color: red">{{ $t("请务必先和用户核实，") }}</span
        >{{
          $t(
            "撤销后用户账户将恢复正常状态，可以继续使用LingoAce和Ace Early Learning。"
          )
        }}
      </p>
      <p>{{
          $t(
            "是否为用户撒销删除账户申请？"
          )
        }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recallDialogVisible = false">{{
          $t("取消（close）")
        }}</el-button>
        <el-button type="primary" @click="confirmRecall">{{
          $t("撤销申请")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, computed, toRefs, unref, ref } from "@vue/composition-api";
import { parentIdValidate } from "@/utils/reg.js";
export default {
  setup(props, { root }) {
    const deleDialogVisible = ref(false);
    const recallDialogVisible = ref(false);
    const handleList = computed(() => [
      {
        label: root.$t("待处理"),
        value: 1,
      },
      {
        label: root.$t("已处理"),
        value: 2,
      },
      {
        label: root.$t("已撤销"),
        value: 3,
      },
    ]);
    const userId = ref("");
    const applyId = ref("");
    const handleListMap = computed(() => {
      return unref(handleList).reduce(
        (pre, next) => ((pre[next["value"]] = next.label), pre),
        {}
      );
    });
    const screenData = reactive({
      parentId: "",
    });
    const tableState = reactive({
      loading: false,
      tableData: [],
    });
    const search = async () => {
      if (screenData.parentId.length <= 0) {
        return root.$message.warning(root.$t("请输入家长ID"));
      }
      if (screenData && screenData.parentId && !parentIdValidate(root, screenData.parentId)) {
        return;
      }
      tableState.loading = true;
      try {
        const data =
          await root.$Api.systemManagement.reqDeleteParentAccountList(
            screenData.parentId
          );
        if (data !== null) {
          tableState.tableData = data;
        } else {
          tableState.tableData = [];
        }
      } finally {
        tableState.loading = false;
      }
    };
    const confirmDelete = async () => {
      try {
        await root.$Api.systemManagement.reqDeleteParentAccount(userId.value);
        root.$message.success(root.$t("删除成功"));
        search();
      } finally {
        deleDialogVisible.value = false;
      }
    };
    const confirmRecall = async () => {
      try {
        await root.$Api.systemManagement.reqCancelDeleteParentAccount(
          applyId.value
        );
        root.$message.success(root.$t("撤销成功"));
      } finally {
        recallDialogVisible.value = false;
      }
      search();
    };

    return {
      screenData,
      search,
      ...toRefs(tableState),
      confirmDelete,
      confirmRecall,
      handleListMap,
      deleDialogVisible,
      recallDialogVisible,
      userId,
      applyId,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete-parent-account-warp {
  padding: 20px;
}
</style>