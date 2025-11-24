<template>
  <div class="role-management-wrapper" v-loading="loading">
    <div
      class="tree-wrap"
      v-if="Per.handleButtonPer('system.roleMT.roleList.rlViewRoles')"
    >
      <div class="w100 mb10">
        <el-button
          class="left-menu-btns"
          type="primary"
          @click="appendRole"
          v-if="Per.handleButtonPer('system.roleMT.roleList.rlAddRoles')"
          >{{ $t("新增角色") }}</el-button
        >
      </div>
      <el-popover
        v-for="(item, index) in rolesList"
        :key="item.id"
        placement="right"
        trigger="hover"
        :disabled="
          !Per.handleButtonPer('system.roleMT.roleList.rlChangeRoles') &&
          !Per.handleButtonPer('system.roleMT.roleList.rlDeleteRoles')
        "
      >
        <div
          class="popover-inner"
          v-if="
            Per.handleButtonPer('system.roleMT.roleList.rlChangeRoles') ||
            Per.handleButtonPer('system.roleMT.roleList.rlDeleteRoles')
          "
        >
          <el-button
            @click="editRoleInfo(item)"
            v-if="Per.handleButtonPer('system.roleMT.roleList.rlChangeRoles')"
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="deleteRoleInfo(item)"
            v-if="
              Per.handleButtonPer('system.roleMT.roleList.rlDeleteRoles') &&
              !Filters.disableRoleCode(item.code)
            "
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </div>
        <p
          slot="reference"
          :class="{ active: activeInd == index }"
          :style="{ background: activeInd == index ? themeColor : '' }"
          @click="changeActiveInd(index)"
        >
          <span>{{ item.orderNo }}</span>
          <span>{{ currentLang === "en" ? item.nameEn : item.nameZh }}</span>
        </p>
      </el-popover>
    </div>
    <div class="right-content" v-loading="rightContentLoading">
      <div class="content-tree-wrapper pr10" :style="{ height: height + 'px' }">
        <el-button
          v-if="
            Per.handleButtonPer('system.roleMT.roleList.rlSetRolePermissions')
          "
          class="update-role-btn mb10"
          type="primary"
          :loading="updateTreeLoading"
          @click="handleUpdateRole"
          >{{ $t("更新权限树") }}</el-button
        >
        <el-input
          v-if="Per.handleButtonPer('system.roleMT.roleList.rlFilterByKeyword')"
          class="mb10"
          :placeholder="$t('输入关键字进行过滤')"
          v-model="filterText"
        >
        </el-input>
        <el-tree
          ref="rightsTree"
          node-key="id"
          :data="tree"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @check="handleCheckChange"
          show-checkbox
          default-expand-all
          :filter-node-method="filterNode"
          :key="treeKey"
        ></el-tree>
      </div>
      <div class="content-table-wrapper">
        <el-table
          :data="roleAllUserData"
          v-loading="roleAllUserTableLoading"
          tooltip-effect="dark"
          :border="false"
          fit
          stripe
          show-overflow-tooltip="true"
          style="width: 100%"
          :header-cell-style="{ background: '#f1f1f1', color: '#606266' }"
          class="attend-table"
          :height="tableHeight"
        >
          <el-table-column align="center" :label="$t('序号')" :width="50">
            <template slot-scope="scope">{{
              (currentPage - 1) * screenData.pageSize + scope.$index + 1
            }}</template>
          </el-table-column>
          <el-table-column
            :label="$t('用户编号')"
            prop="code"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column :label="$t('username')" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="jumpToUserInfo(scope.row)">{{
                scope.row.username
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('电子邮箱')"
            prop="email"
            min-width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('电话')"
            prop="phone"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('中文名称')"
            prop="nameZh"
            width="110"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('英文名称')"
            prop="nameEn"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            :label="$t('真实姓名')"
            prop="realName"
            width="100"
            align="center"
          ></el-table-column>
        </el-table>
        <custom-pagination
          class="pagination"
          :total="roleAllUserTotal"
          :current-page="currentPage"
          @getCurrentPage="getCurrentPage"
          @getPerPage="getPerPage"
        />
      </div>
    </div>
    <UpdateRole
      :show="showUpdateRoleDialog"
      :editRoleInfoData="editRoleInfoData"
      @closeUpdateRole="closeUpdateRole"
    ></UpdateRole>
    <AppendRole
      :show="showAppendRoleDialog"
      @closeAppendRole="closeAppendRole"
    ></AppendRole>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import UpdateRole from "./components/UpdateRole";
import AppendRole from "./components/AppendRole";
import styles from "../../styles/variables.scss";
export default {
  name: "roleManagement",
  components: {
    UpdateRole,
    AppendRole,
  },
  data() {
    return {
      tableHeight: window.innerHeight - 210 || 300,
      treeKey: 0,
      rightContentLoading: false,
      activeInd: 0,
      roleInfo: null,
      editRoleInfoData: null,
      deleteRoleInfoData: null,
      showUpdateRoleDialog: false,
      showAppendRoleDialog: false,
      loading: false,
      tree: [],
      updateTreeIds: [],
      updateTreeLoading: false,
      treeCheckedKeys: [],
      defaultProps: {
        children: "subList",
        label: "nameZh",
      },
      filterText: "",
      screenData: {
        pageNum: 1,
        pageSize: 50,
      },
      roleAllUserTotal: 0,
      roleAllUserData: [],
      currentPage: 1,
      roleAllUserTableLoading: false,
      height: window.innerHeight - 200 || 300,
      defaultExpandlist: [],
      themeColor: styles.customPrimaryColor,
    };
  },
  computed: {
    ...mapState({
      rolesList: (state) => state.system.rolesList,
      allPowerList: (state) => state.system.allPowerList,
      currentLang: (state) => state.app.currentLang,
    }),
  },
  watch: {
    filterText(val) {
      this.$refs.rightsTree.filter(val);
    },
    currentLang(val) {
      this.defaultProps = {
        children: "subList",
        label: val === "en" ? "nameEn" : "nameZh",
      };
      this.treeKey++;
      setTimeout(() => {
        this.treeCheckedKeys.forEach((item, index) => {
          // 获取树上相同 key 的节点
          if (this.$refs.rightsTree.getNode != undefined) {
            let node = this.$refs.rightsTree.getNode(item);
            // 手动设置 checked 状态
            if (node) {
              this.$refs.rightsTree.setChecked(node, true);
            }
          }
        });
      }, 0);
    },
  },
  methods: {
    ...mapMutations(["SET_PAGE_TITLE", "SET_MODULE_MENU_INDEX"]),
    ...mapActions(["getSystemRolesListAction", "getSystemPowerListAction"]),
    jumpToUserInfo(data) {
      this.$router.push({
        path: "/system/userInfo",
        query: {
          id: data.id,
          username: data.username,
        },
      });
    },
    getCurrentPage(page) {
      this.screenData.pageNum = page;
      this.currentPage = page;
      this.getRoleToUserData();
    },
    getPerPage(perPage) {
      this.screenData.pageSize = perPage;
      this.getRoleToUserData();
    },
    /**
     * tree 搜索方法
     */
    filterNode(value, data) {
      if (!value) return true;
      const label = this.currentLang === "en" ? data.nameEn : data.nameZh;
      return label.indexOf(value) !== -1;
    },
    // 左侧 tab 切换的事件
    changeActiveInd(index) {
      this.activeInd = index;
      this.roleInfo = JSON.parse(JSON.stringify(this.rolesList[index]));
      // 每次active发生变化的时候就清空一次树的checked状态
      this.allPowerList.forEach((item) => {
        var node = this.$refs.rightsTree.getNode(item.id);
        if (node) {
          this.$refs.rightsTree.setChecked(node, false);
        }
      });
      this.$nextTick(() => {
        this.getUserHavePowersEvent(this.roleInfo.id);
      });
      this.screenData.pageNum = 1;
      this.currentPage = 1;
      this.getRoleToUserData();
    },
    /**
     * 添加角色
     */
    appendRole() {
      this.showAppendRoleDialog = true;
    },
    closeAppendRole() {
      this.showAppendRoleDialog = false;
    },
    /**
     * 编辑角色
     */
    editRoleInfo(item) {
      this.editRoleInfoData = JSON.parse(JSON.stringify(item));
      this.showUpdateRoleDialog = true;
    },
    closeUpdateRole() {
      this.showUpdateRoleDialog = false;
    },
    /**
     * 删除角色
     */
    deleteRoleInfo(item) {
      this.$confirm("此操作将永久删除角色, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          this.$Api.systemManagement
            .removeRoleInfo(item.id)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  type: "success",
                  message: "删除成功!",
                });
                this.getSystemRolesListAction();
              }
              this.loading = false;
            });
        })
        .catch((_) => {});
    },
    handleNodeClick(data) {},
    /**
     * 树的checked操作
     * @param {Object} data 该节点所对应的对象
     * @param {Boolean} checked 节点本身是否被选中
     * @param {Boolean} indeterminate 节点的子树中是否有被选中的节点
     */
    handleCheckChange(data, checkedNodes) {
      this.updateTreeIds = checkedNodes.checkedKeys.concat(
        checkedNodes.halfCheckedKeys
      );
      this.updateTreeIds = this.updateTreeIds.filter((item) => item != 0);
    },
    /**
     * 更新权限树
     */
    handleUpdateRole() {
      this.rightContentLoading = true;
      this.$Api.systemManagement
        .updatePower(this.updateTreeIds, this.roleInfo.id)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: "更新权限树成功！",
              type: "success",
            });
          } else {
            this.$notify({
              message: "更新权限树失败",
              type: "error",
            });
          }
          this.rightContentLoading = false;
        });
    },
    /**
     * 获取角色拥有的权限
     */
    getUserHavePowersEvent(roleId) {
      this.rightContentLoading = true;
      this.treeCheckedKeys = [];
      // 初次渲染树的checked状态
      this.$Api.systemManagement
        .getRoleHavePowers(roleId)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.treeCheckedKeys = data.data;
            // 遍历 userPreIds 集合
            setTimeout(() => {
              this.treeCheckedKeys.forEach((item, index) => {
                // 获取树上相同 key 的节点
                if (this.$refs.rightsTree.getNode != undefined) {
                  let node = this.$refs.rightsTree.getNode(item);
                  // 手动设置 checked 状态
                  if (node) {
                    this.$refs.rightsTree.setChecked(node, true);
                  }
                }
              });
            }, 0);
          }
          this.rightContentLoading = false;
        });
    },
    getRoleToUserData() {
      this.roleAllUserTableLoading = true;
      let roleId = this.roleInfo.id,
        pageNum = this.screenData.pageNum,
        pageSize = this.screenData.pageSize;
      this.roleAllUserData = [];
      this.roleAllUserTotal = 0;
      this.$Api.systemManagement
        .getThisRoleUserList({ roleId, pageNum, pageSize })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.roleAllUserData = data.data.list;
            this.roleAllUserTotal = data.data.total;
          }
          this.roleAllUserTableLoading = false;
        });
    },
  },
  created() {
    this.rightContentLoading = true;
    this.defaultProps = {
      children: "subList",
      label: this.currentLang === "en" ? "nameEn" : "nameZh",
    };
  },
  mounted() {
    this.SET_PAGE_TITLE("角色管理");
    // 获取所有角色信息 列表
    this.getSystemRolesListAction().then((res) => {
      this.roleInfo = res.data[this.activeInd];
      this.getRoleToUserData();
      this.$nextTick(() => {
        this.getUserHavePowersEvent(this.roleInfo.id);
      });
    });
    //获取权限树列表
    this.getSystemPowerListAction().then((data) => {
      let flatList = data.data;
      flatList.forEach((item) => {
        if (item.pid === 0) {
          this.tree.push(item);
        } else {
          flatList.forEach((ite) => {
            if (ite.id == item.pid) {
              ite.subList = ite.subList || [];
              ite.subList.push(item);
            }
          });
        }
      });
      this.tree.forEach((item) => {
        this.defaultExpandlist.push(item.id);
      });
    });
    // 获取全部权限
  },
};
</script>
<style lang="scss" scoped>
.role-management-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.popover-inner {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.right-content {
  padding-left: 10px;
  display: flex;
  flex: 1;
}
.content-tree-wrapper {
  overflow: auto;
  flex-grow: 1;
  max-width: 450px;
}
.content-table-wrapper {
  width: 420px;
  margin-left: 10px;
  flex: 1;
}
.pagination {
  position: relative;
  right: 0;
}
.update-role-btn {
  width: 100%;
}
.tree-wrap {
  flex-shrink: 0;
  height: 500px;
  overflow: auto;
  // border-right: 1px solid #ccc;
  padding-right: 10px;
  p {
    margin: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    overflow: hidden;
    cursor: pointer;
    font-size: 12px;
    color: #666666;
    outline: none;
    padding-left: 10px;
  }
  .active {
    background-color: #7580e5;
    color: #ffffff;
    transition: all 0.5s;
  }
  .left-menu-btns {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.attend-table {
  border: 1px solid #f1f1f1;
}
</style>
