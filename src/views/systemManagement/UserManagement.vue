<template>
  <div
    class="user-management-wrapper"
    v-if="Per.handleButtonPer('system.userMT.userList.ulViewUser')"
  >
    <el-form :inline="true" class="console-top">
      <el-form-item :label="$t('username')">
        <el-input
          v-model="screenData.userName"
          style="width: 200px"
          :placeholder="$t('请输入用户名')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('在职状态')">
        <el-select v-model="screenData.activeStatus">
          <el-option
            v-for="item in activeStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">{{
          $t("my-home-Search")
        }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="
            () => {
              currentUserId = null;
              drawer = true;
            }
          "
          v-if="Per.handleButtonPer('system.userMT.userList.ulViewAddUser')"
          >{{ $t("添加用户") }}</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrapper mt10">
      <el-table
        :data="tableData"
        v-loading="loading"
        tooltip-effect="dark"
        :border="false"
        fit
        show-overflow-tooltip="true"
        style="width: 100%"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
        stripe
        class="attend-table"
        @sort-change="handleSortChange"
      >
        <el-table-column align="center" :label="$t('序号')" :width="50">
          <template slot-scope="scope">{{
            (currentPage - 1) * screenData.pageSize + scope.$index + 1
          }}</template>
        </el-table-column>
        <el-table-column
          :width="currentLang === 'en' ? 140 : 120"
          prop="userInfo.code"
          align="center"
          :label="$t('员工编号')"
        ></el-table-column>
        <el-table-column
          :width="currentLang === 'en' ? 140 : 120"
          prop="userInfo.id"
          align="center"
          :label="$t('员工id')"
        ></el-table-column>
        <el-table-column
          width="120"
          prop="userInfo.username"
          align="center"
          :label="$t('username')"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.userInfo.dimissionStatus === 1">{{
              scope.row.userInfo.username
            }}</span>
            <el-button v-else @click="jumpToUserInfo(scope.row)" type="text">{{
              scope.row.userInfo.username
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang === 'en' ? 140 : 120"
          prop="userInfo.code"
          align="center"
          :label="$t('在职状态')"
        >
          <template slot-scope="scope">
            {{ getJobStatusName(scope.row.userInfo.dimissionStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="currentLang === 'zh'"
          :width="currentLang === 'en' ? 140 : 120"
          prop="postExtInfo.nameZh"
          align="center"
          :label="$t('部门')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          v-else
          :width="currentLang === 'en' ? 140 : 120"
          prop="postExtInfo.nameEn"
          align="center"
          :label="$t('部门')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="userInfo.email"
          align="center"
          :label="$t('电子邮箱')"
        ></el-table-column>
        <el-table-column
          :width="currentLang === 'en' ? 140 : 120"
          prop="userInfo.phone"
          align="center"
          :label="$t('电话号码')"
        ></el-table-column>
        <el-table-column
          width="120"
          prop="userInfo.realName"
          align="center"
          :label="$t('真实姓名')"
        ></el-table-column>
        <el-table-column
          width="120"
          align="center"
          :label="$t('my-home-Gender')"
        >
          <template slot-scope="scope">
            {{ scope.row.userInfo.gender | mapGender }}
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="userInfo.nameZh"
          align="center"
          :label="$t('中文名称')"
        ></el-table-column>
        <el-table-column
          width="120"
          prop="userInfo.nameEn"
          align="center"
          :label="$t('英文名称')"
        ></el-table-column>
        <el-table-column
          width="200"
          prop="userInfo.wechat"
          align="center"
          :label="$t('微信号')"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('入职日期')"
          width="120"
          sortable="custom"
        >
          <template v-slot="{ row }">
            {{ toFormatTime(row.userInfo.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="dimissionTime"
          :label="$t('离职日期')"
          width="120"
          sortable="custom"
        >
          <template v-slot="{ row }">
            {{ toFormatTime(row.userInfo.dimissionTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          :label="$t('最近登录时间')"
          width="120"
          sortable="custom"
        >
          <template v-slot="{ row }">
            {{ toFormatTime(row.userInfo.lastLoginTime) }}
          </template>
        </el-table-column>
        <el-table-column
          :width="currentLang === 'en' ? 140 : 120"
          prop="userInfo.whatsapp"
          align="center"
          :label="$t('whatsapp账号')"
        ></el-table-column>
        <el-table-column
          width="320"
          fixed="right"
          align="center"
          :label="$t('操作')"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="changePsw(scope.row)"
              :disabled="scope.row.userInfo.dimissionStatus === 1"
              v-if="
                Per.handleButtonPer('system.userMT.userList.ulChangePassword')
              "
              >{{ $t("glb-Change Password") }}</el-button
            >
            <el-button
              type="text"
              @click="resetPsw(scope.row)"
              :disabled="scope.row.userInfo.dimissionStatus === 1"
              v-if="
                Per.handleButtonPer('system.userMT.userList.ulResetPassword')
              "
              >{{ $t("student-management-Reset Password") }}</el-button
            >
            <el-button
              type="text"
              @click="
                () => {
                  currentUserId = scope.row.userInfo.id;
                  drawer = true;
                }
              "
              :disabled="scope.row.userInfo.dimissionStatus === 1"
              v-if="
                Per.handleButtonPer('system.userMT.userList.ulViewChangeUser')
              "
              >{{ $t("更新用户信息") }}</el-button
            >
            <br />
            <el-button
              type="text"
              @click="deleteUser(scope.row)"
              :disabled="scope.row.userInfo.dimissionStatus === 1"
              v-if="
                Per.handleButtonPer('system.userMT.userList.ulViewDeleteUser')
              "
              >{{ $t("删除用户") }}</el-button
            >
            <el-button
              type="text"
              @click="resignUser(scope.row)"
              :disabled="scope.row.userInfo.dimissionStatus !== 0"
              v-if="Per.handleButtonPer('system.userMT.userList.resignedUser')"
              >{{ $t("操作离职") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="total"
        :current-page="currentPage"
        @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage"
      />
    </div>
    <ChangePassword
      :show="showChangePsw"
      :userInfo="userInfo"
      @closeChangePsw="closeChangePsw"
    ></ChangePassword>
    <el-drawer
      v-if="drawer"
      :visible.sync="drawer"
      direction="rtl"
      :title="currentUserId ? $t('更新用户信息') : $t('添加用户')"
      :wrapperClosable="true"
    >
      <UpdateUserInfo
        @refresh="getData()"
        @close="drawer = false"
        :rowData="currentTaskRow"
        :id="currentUserId"
      />
    </el-drawer>
    <ReplacementManagementDialog
      v-if="replaceDialog"
      :visible.sync="replaceDialog"
      :currentUser="currentUser"
      @updateList="search"
    />
    <el-dialog
      :title="$t('操作离职')"
      :visible.sync="visibleDimission"
      v-if="visibleDimission"
      top="15vh"
      width="500px"
      close-on-click-modal="false"
    >
      <div>
        <el-form label-position="top" label-width="200px">
          <el-form-item :label="$t('离职日期')">
            <FilterBySingleDate
              ref="FilterBySingleDate"
              style="width: 300px"
              :clearable="false"
              :defaultCurDate="true"
              @changeSelect="changeSingleDate"
              :invalidTime="new Date()"
              invalidTimeDirection="old"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="submitLoading"
          type="primary"
          @click="reqDimission"
        >
          {{ $t("确认") }}
        </el-button>
        <el-button @click="visibleDimission = false">{{
          $t("关闭")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapState, mapMutations } from "vuex";
import ChangePassword from "./userSub/ChangePassword";
import UpdateUserInfo from "./components/UpdateUserInfo.vue";
import countryCodeSelector from "vue-country-code-selector";
import ReplacementManagementDialog from "./components/ReplacementManagementDialog.vue";
import FilterBySingleDate from "@/components/FilterItem/CommodityFilter/FilterBySingleDate";

export default {
  name: "userManagement",
  components: {
    ChangePassword,
    UpdateUserInfo,
    countryCodeSelector,
    ReplacementManagementDialog,
    FilterBySingleDate,
  },
  data() {
    return {
      visibleDimission: false,
      replaceDialog: false,
      sortField: "",
      sortOrder: "",
      loading: false,
      tableData: [],
      screenData: {
        pageNum: 1,
        pageSize: 50,
        userName: "",
        activeStatus: -1,
      },
      // 在职状态列表
      activeStatusList: [
        { label: this.$t("全部"), value: -1 },
        { label: this.$t("在职"), value: 0 },
        { label: this.$t("离职待交接"), value: 2 },
        { label: this.$t("离职"), value: 1 },
      ],
      currentPage: 1,
      total: 0,
      userInfo: null,
      showChangePsw: false,
      // 弹窗翻译
      tips: null,
      hint: null,
      confirm: null,
      cancel: null,
      drawer: false,
      currentUserId: null,
      currentUser: {},
      dimissionTime: null,
      submitLoading: false,
    };
  },
  computed: {
    ...mapState({
      userInfoList: (state) => state.system.userInfoList,
      userMtPage: (state) => state.remberTags.userMtPage,
      currentLang: (state) => state.app.currentLang,
    }),
  },
  methods: {
    changeSingleDate(time) {
      this.dimissionTime = time[0];
    },
    ...mapMutations(["SET_PAGE_TITLE", "setStateData"]),
    ...mapActions(["getUserInfoListAction"]),
    search() {
      this.screenData.pageNum = 1;
      this.setStateData({
        key: "userMtPage",
        value: 1,
      });
      this.getData();
    },
    jumpToUserInfo(data) {
      this.$router.push({
        path: "/system/userInfo",
        query: {
          id: data.userInfo.id,
          username: data.userInfo.username,
        },
      });
    },
    /**
     * 修改密码
     */
    changePsw(data) {
      this.userInfo = data;
      this.showChangePsw = true;
    },
    closeChangePsw() {
      this.userInfo = null;
      this.showChangePsw = false;
    },
    /**
     * 重置密码
     */
    resetPsw(data) {
      if (this.currentLang === "zh") {
        this.tips = "提示";
        this.hint = "此操作将重置用户密码为初始化状态, 是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "Tips";
        this.hint =
          "This operation will reset the user password to the initialization state. Do you want to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          let userId = data.userInfo.id;
          this.$Api.systemManagement
            .resetUserPassword(userId)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: this.$t("操作成功，重置密码已发送至该账号绑定邮箱"),
                  type: "success",
                });
              }
            });
        })
        .catch((_) => {});
    },
    /**
     * 删除用户
     */
    deleteUser(data) {
      if (this.currentLang === "zh") {
        this.tips = "提示";
        this.hint = "此操作将永久删除用户, 是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "Tips";
        this.hint =
          "This operation will permanently delete users. Do you want to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          let userId = data.userInfo.id;
          this.$Api.systemManagement
            .deleteUser(userId)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: "删除成功",
                  type: "success",
                });
                this.getData();
              } else {
                this.$notify({
                  message: "删除失败",
                  type: "error",
                });
              }
            });
        })
        .catch(() => {});
    },
    async reqDimission() {
      this.submitLoading = true;
      try {
        const res = await this.$Api.systemManagement.reqHandleUserDimission({
          dmissionUserId: this.currentUser.userInfo.id,
          agentUserId: 0,
          transferAgentMap: null,
          dimissionTime: this.dimissionTime,
        });
        this.$notify({
          message: "操作离职成功",
          type: "success",
        });
        this.visibleDimission = false;
      } finally {
        this.submitLoading = false;
        this.getData();
      }
    },
    /* 操作离职 */
    resignUser(data) {
      this.currentUser = data;
      if (this.currentLang === "zh") {
        this.tips = "提示";
        this.hint = "将该用户操作为离职将无法登录，是否确认继续操作？";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "Tips";
        this.hint =
          "The user is unable to log in if you do this, are you sure to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(async () => {
          let userId = data.userInfo.id;
          const canDimission = await this.$Api.systemManagement.reqCandimission(
            userId
          );
          if (!canDimission) {
            this.replaceDialog = true;
            return;
          } else {
            this.visibleDimission = true;
            return;
          }
        })
        .catch(() => {});
    },
    getCurrentPage(page) {
      this.currentPage = page;
      this.screenData.pageNum = page;
      this.setStateData({
        key: "userMtPage",
        value: page,
      });
      this.getData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.screenData.pageNum = this.userMtPage;
      this.currentPage = this.userMtPage;
      const orderType = this.sortOrder
        ? this.sortOrder === "ascending"
          ? "asc"
          : "desc"
        : undefined;
      const params = {
        ...this.screenData,
        activeStatus: undefined,
        dimissionstatus:
          this.screenData.activeStatus > -1
            ? this.screenData.activeStatus
            : undefined,
        ordercolumn: orderType ? this.sortField : undefined,
        ordertype: orderType,
      };
      // 过滤掉空值
      for (let key in params) {
        const val = params[key];
        if (val === undefined || val === null || val === "") {
          delete params[key];
        }
      }
      this.getUserInfoListAction(params).then((res) => {
        this.total = res.total;
        this.tableData = res.list;
        this.loading = false;
      });
    },
    // 获取在职状态名称
    getJobStatusName(val) {
      if (val === 1) {
        return this.$t("离职");
      } else if (val === 2) {
        return this.$t("离职待交接");
      }
      return this.$t("在职");
    },
    toFormatTime(val) {
      if (val) {
        return moment(val).format("YYYY-MM-DD HH:mm");
      }
      return "-";
    },
    handleSortChange({ prop, order }) {
      // 处理排序字段名称转换
      // const fieldMap = {
      //   'userInfo.createTime': 'createTime',
      //   'userInfo.dimissionTime': 'dimissionTime',
      //   'userInfo.lastLoginTime': 'lastLoginTime'
      // };
      // this.sortField = fieldMap[prop] || prop;
      this.sortField = prop;
      this.sortOrder = order;
      this.getData();
    },
  },
  created() {
    this.SET_PAGE_TITLE("用户管理");
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
.image {
  width: 100px;
  height: auto;
}

.form {
  height: 300px;
  overflow: auto;

  input {
    width: 90%;
  }
}

.intl-tel-input-container {
  padding: 0 !important;
  width: 100px;
  margin: 0;
  top: -10px;
}

.flex {
  display: flex;
}

.intl-tel-input-container {
  height: 40px;
}

.table-wrapper {
  padding: 0 15px;

  .attend-table {
    border: 1px solid #f1f1f1;

    table {
      width: 100%;
    }
  }
}

.console-top {
  padding: 20px 15px 20px;
}
</style>
<style>
.flag-list-box {
  background: #fff !important;
}
</style>
