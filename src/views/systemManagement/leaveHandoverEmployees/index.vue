<template>
  <div class="leave-handover-employees">
    <div class="handover-note">
      {{ $t("说明：请及时转移以下员工名下的用户，全部转移后方可设为离职") }}
      <el-button type="primary" @click="handleSearch">{{
        $t("查询")
      }}</el-button>
    </div>
    <el-table
      class="data-table"
      v-loading="loading"
      :data="dataList"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        :label="$t('序号')"
      >
      </el-table-column
      ><el-table-column
        width="120"
        prop="userId"
        align="center"
        label="ID"
      ></el-table-column>
      <el-table-column
        width="120"
        prop="realName"
        align="center"
        :label="$t('username')"
      ></el-table-column>
      <el-table-column
        width="120"
        prop="agentUserRealName"
        align="center"
        :label="$t('代管人')"
      ></el-table-column>
      <el-table-column align="center" :label="$t('离职前归属部门')">
        <template v-slot="{ row }">
          {{ isZh ? row.postZh : row.postEn }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        :label="$t('离职交接开始时间')"
        width="150"
        sortable
      >
        <template v-slot="{ row }">
          {{ toFormatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="parentCountByCC"
        :label="$t('当前名下条数(作为课程顾问)')"
        width="140"
        sortable
      >
        <template v-slot="{ row }">
          <span>{{ row.parentCountByCC }}</span>
          <template v-if="row.parentCountByCC > 0">
            <el-button
              v-if="
                Per.handleButtonPer(
                  'system.leaveHandoverEmployees.resignationDownload'
                )
              "
              type="text"
              @click="handleDownload(row.downloadCCUrl)"
            >
              {{ $t("下载") }}
            </el-button>
            <el-button
              v-if="
                Per.handleButtonPer(
                  'system.leaveHandoverEmployees.resignationTransfer'
                )
              "
              type="text"
              @click="handleTransfer(row.distributionCCUrl)"
              >{{ $t("转出") }}</el-button
            >
          </template>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="parentCountByLA"
        :label="$t('当前名下条数(作为学管)')"
        width="140"
        sortable
      >
        <template v-slot="{ row }">
          <span>{{ row.parentCountByLA }}</span>
          <template
            v-if="
              row.parentCountByLA > 0 &&
              Per.handleButtonPer(
                'system.leaveHandoverEmployees.resignationDownload'
              )
            "
          >
            <el-button
              v-if="
                Per.handleButtonPer(
                  'system.leaveHandoverEmployees.resignationDownload'
                )
              "
              type="text"
              @click="handleDownload(row.downloadLAUrl)"
            >
              {{ $t("下载") }}
            </el-button>
            <el-button
              v-if="
                Per.handleButtonPer(
                  'system.leaveHandoverEmployees.resignationTransfer'
                )
              "
              type="text"
              @click="handleTransfer(row.distributionLAUrl)"
              >{{ $t("转出") }}</el-button
            >
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('操作')" width="150">
        <template v-slot="{ row }">
          <el-button
            v-if="
              Per.handleButtonPer(
                'system.leaveHandoverEmployees.resignationCancel'
              )
            "
            type="text"
            @click="handleCancel(row)"
            >{{ $t("撤销") }}</el-button
          >
          <el-button
            v-if="
              Per.handleButtonPer(
                'system.leaveHandoverEmployees.resignationConfirm'
              )
            "
            type="text"
            @click="handleLeave(row)"
          >
            {{ $t("操作离职") }}
          </el-button>
          <el-button
            v-if="
              Per.handleButtonPer(
                'system.leaveHandoverEmployees.resignationConfirm'
              )
            "
            type="text"
            @click="handleAgent(row)"
          >
            {{ $t("重新指定代管人") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('重新指定代管人')"
      :visible.sync="visible"
      v-if="visible"
      top="15vh"
      width="500px"
      close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <el-form label-position="top" label-width="200px">
          <el-form-item
            :label="
              $t('为【XXX】指定新的代管人').replace('XXX', curUser.realName)
            "
          >
            <FilterByOPSAccountOrEmail
              style="width: 350px"
              @change="
                (user) => {
                  if (!user) {
                    agentUserId = null;
                  }
                  agentUserId = user.id;
                }
              "
              :excludedUserId="curUser.agentUserId"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="!agentUserId"
          :loading="submitLoading"
          type="primary"
          @click="confirm"
        >
          {{ $t("确认") }}
        </el-button>
        <el-button
          @click="handleClose"
          >{{ $t("关闭") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import * as leaveApi from "@/api/systemManagement/leave";
import FilterByOPSAccountOrEmail from "@/components/FilterItem/UserDimensionFilter/FilterByOPSAccountOrEmail";

export default {
  name: "LeaveHandoverEmployees",
  components: { FilterByOPSAccountOrEmail },
  data() {
    return {
      loading: false,
      sortBy: "",
      sortOrder: "",
      dataList: [],
      visible: false,
      curUser: {},
      agentUserId: null,
      submitLoading: false,
    };
  },
  computed: {
    isZh() {
      return this.$i18n.locale === "zh";
    },
  },
  methods: {
    handleClose() {
      this.agentUserId = null;
      this.visible=false
    },
    async getDataList() {
      this.loading = true;
      try {
        const list = await leaveApi.getAwaitingResignationEmployeeList();
        this.dataList = list;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.dataList = [];
      this.getDataList();
    },
    toFormatTime(val) {
      if (val) {
        return moment(val).format("YYYY-MM-DD HH:mm");
      }
      return "";
    },
    handleDownload(url) {
      // const downloadUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      const downloadUrl = url;
      window.open(downloadUrl);
    },
    handleTransfer(path) {
      this.$router.push(path);
    },
    // 撤销离职
    async handleCancel(row) {
      this.$confirm(
        this.$t("撤销后员工将变为在职状态，是否确认操作？"),
        this.$t("提示"),
        {
          confirmButtonText: this.$t("确定"),
          cancelButtonText: this.$t("取消"),
          type: "warning",
        }
      )
        .then(() => {
          leaveApi.cancelResignation(row.id).then(() => {
            this.$message({
              type: "success",
              message: this.$t("撤销成功"),
            });
            this.getDataList();
          });
        })
        .catch(() => {});
    },
    // 操作离职
    handleLeave(row) {
      const hasParent = row.parentCountByCC > 0 || row.parentCountByLA > 0;
      if (hasParent) {
        this.$message.error(this.$t("名下存在家长未转移，不可操作离职"));
        return;
      }
      const msg = this.$t("将该用户操作为离职将无法登录，是否确认继续操作？");
      this.$confirm(msg, this.$t("提示"), {
        confirmButtonText: this.$t("确定"),
        cancelButtonText: this.$t("取消"),
        type: "warning",
      })
        .then(async () => {
          const userId = row.userId;
          // const res = await this.$Api.systemManagement.resignUser(userId);
          const res = await this.$Api.systemManagement.reqHandleUserDimissionV3(
            userId
          );
          this.$message({
            type: "success",
            message: "操作离职成功",
          });
          this.getDataList();
        })
        .catch(() => {});
    },
    handleAgent(row) {
      this.curUser = row;
      this.visible = true;
    },
    async confirm() {
      try {
        this.submitLoading = true;
        const params = {
          id: this.curUser.id,
          agentUserId: this.agentUserId,
        };
        const res = await this.$Api.systemManagement.reqChangeAgent(params);
        this.handleClose()
        this.$notify({
          message: "操作成功",
          type: "success",
        });
      } finally {
        this.submitLoading = false;
        this.handleSearch();
      }
    },
  },
  mounted() {
    // this.getDataList();
    // 将离职待交接员工的红点提示消除
    this.$store.commit(
      "SET_AWAITING_RESIGNATION_EMPLOYEE_MSG_READ_STATE",
      true
    );
  },
  activated() {
    // 每次切到当前页面都重新请求数据
    this.getDataList();
  },
};
</script>

<style lang="scss" scoped>
.leave-handover-employees {
  padding: 20px;
}

.handover-note {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.data-table {
  width: 100%;
  margin-top: 20px;
}
</style>
