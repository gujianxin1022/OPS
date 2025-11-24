<template>
  <div class="job-position-management-wrapper" v-if="Per.handleButtonPer('system.jobMT.jmViewJob')">
    <div class="job-tree-wrap">
      <el-button v-if="Per.handleButtonPer('system.jobMT.updateJobTree')" type="primary"
        class="update-power-tree-btn mb10" :loading="updateJobTreeLoading" @click="updateJobTree">{{ $t("保存岗位树")
        }}</el-button>
      <el-input v-if="Per.handleButtonPer('system.jobMT.jmFilterByKeyword')" class="mb10" :placeholder="$t('输入关键字进行过滤')"
        v-model="filterText">
      </el-input>
      <el-tree :key="treeKey" ref="rightsTree" node-key="id" :data="tree" :props="defaultProps"
        @node-click="handleNodeClick" :expand-on-click-node="false" default-expand-all :filter-node-method="filterNode"
        :draggable="draggable" :allow-drag="allowDrag" :allow-drop="allowDrop" @node-drag-end="onTreeNodeDragEnd">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}
            <el-tag size="mini" v-if="data.type === 3">{{ $t("公司") }}</el-tag>
            <el-tag size="mini" type="success" v-if="data.type === 2">{{
    $t("部门")
  }}</el-tag>
          </span>
          <span>
            <el-button v-if="Per.handleButtonPer('system.jobMT.jmViewChangeJob') &&
    data.id !== 0
    " type="text" size="mini" @click="() => edit(node, data)">
              {{ $t("编辑") }}
            </el-button>
            <el-button v-if="Per.handleButtonPer('system.jobMT.jmViewAddJob')" type="text" size="mini" :disabled="node.level >= treeMaxLevel"
              @click="() => append(data, node)">
              {{ $t("添加") }}
            </el-button>
            <el-button v-if="Per.handleButtonPer('system.jobMT.jmViewDeleteJob') &&
    data.id !== 0
    " type="text" size="mini" @click="() => remove(node, data)">
              {{ $t("删除") }}
            </el-button>
            <el-button v-if="Per.handleButtonPer('system.jobMT.relateRole') && data.id !== 0
    " type="text" size="mini" @click="() => relate(node, data)">
              {{ $t("绑定角色") }}
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="job-table-wrap">
      <div class="job-table-title-msg">
        <div>
          <span class="label">{{ $t("部门") }}：</span>
          <span class="value">{{ titleText }}</span>
        </div>
        <div>
          <el-button v-if="Per.handleButtonPer('system.jobMT.addDepartment')" type="primary"
            @click="showAddDepartment">{{
    $t("添加员工")
  }}</el-button>
        </div>
      </div>
      <el-table :data="userTableData" v-loading="userTableDataLoading" tooltip-effect="dark" :border="false" fit stripe
        show-overflow-tooltip="true" style="width: 100%" class="table"
        :header-cell-style="{ background: '#f1f1f1', color: '#606266' }">
        <el-table-column align="center" :label="$t('序号')" :width="50">
          <template slot-scope="scope">{{
    (pageNum - 1) * pageSize + scope.$index + 1
  }}</template>
        </el-table-column>
        <el-table-column :label="$t('用户编号')" prop="userId" width="100" align="center"></el-table-column>
        <el-table-column :label="$t('username')" min-width="110" align="center">
          <template slot-scope="scope">
            <span style="color: #7580e5; cursor: pointer" @click="jumpToUserInfo(scope.row)">{{ scope.row.username
              }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('电子邮箱')" prop="email" min-width="220" align="center"></el-table-column>
        <el-table-column :label="$t('电话')" prop="phone" min-width="150" align="center"></el-table-column>
        <el-table-column :label="$t('中文名称')" prop="nameZh" width="110" align="center"></el-table-column>
        <el-table-column :label="$t('英文名称')" prop="nameEn" width="100" align="center"></el-table-column>
        <el-table-column :label="$t('真实姓名')" prop="realName" width="100" align="center"></el-table-column>
        <el-table-column :label="$t('操作')" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="!scope.row.isLeader" @click="setThisManisLeading(scope.row)">{{ $t("设为负责人")
              }}</el-button>
            <el-button type="text" v-else @click="cancelThisManIsleading(scope.row)">{{ $t("取消负责人") }}</el-button>
            <el-button @click="deleteUserFromPost(scope.row)" type="text" v-if="!scope.row.isLeader">{{ $t("移除")
              }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination :total="total" :current-page="pageNum" @getCurrentPage="getCurrentPage"
        @getPerPage="getPerPage" />
    </div>
    <AddJob v-if="showAddJob && currentNode" :show="showAddJob" @close="(showAddJob = false), (currentNode = null)"
      :currentNode="currentNode" @getData="getData" @add="add"></AddJob>
    <UpdateJobInfo v-if="showUpdateJob && currentNode" :show="showUpdateJob" :nodeInfo="nodeInfo"
      @close="(showUpdateJob = false), (currentNode = null)" @getUserSingle="getUserSingle" @getData="getData"
      :currentNode="currentNode"></UpdateJobInfo>
    <AddStaffToDepDialog :showAddStaffToDepDialog="showAddStaffToDepDialog" :nodeObj="nodeObj"
      @closeAddStaffToDepDialog="closeAddStaffToDepDialog" @getUserSingle="getUserSingle" :pageNumParent="pageNum"
      :pageSizeParent="pageSize"></AddStaffToDepDialog>
    <JobRelatedRole v-if="showRelatedJob && currentNode" :show="showRelatedJob"
      @close="(showRelatedJob = false), (currentNode = null)" :currentNode="currentNode"></JobRelatedRole>
  </div>
</template>

<script>
import AddJob from "./jobSub/AddJob";
import JobRelatedRole from "./jobSub/JobRelatedRole";
import UpdateJobInfo from "./jobSub/UpdateJobInfo";
import AddStaffToDepDialog from "./userSub/AddStaffToDepDialog";
import { mapActions, mapState, mapMutations } from "vuex";
import { sortList } from "@/utils/list";
export default {
  name: "jobPositionManagement",
  components: {
    AddJob,
    UpdateJobInfo,
    AddStaffToDepDialog,
    JobRelatedRole,
  },
  data() {
    return {
      treeKey: 0,
      updateJobTreeLoading: false,
      treeWrapLoading: false,
      userTableDataLoading: false,
      tree: [],
      filterText: "",
      defaultProps: {
        children: "subList",
        label: "nameZh",
      },
      showAddJob: false,
      showUpdateJob: false,
      currentData: null,
      nodeInfo: null,
      nodeObj: {},
      currentPage: 1,
      pageNum: 1,
      pageSize: 50,
      total: 0,
      userTableData: [],
      showAddStaffToDepDialog: false,
      titleText: "---",
      tips: "",
      hint: "",
      confirm: "",
      cancel: "",
      currentNode: null,
      showRelatedJob: false,
      // 控制最大层级. 从LingoAce层级算起，限制最大子层级为 {value - 1} 级 （注意：这里 LingoAce.level = 2）
      treeMaxLevel: 7,
      // 树节点拖拽时的错误信息，拖拽过程中产生，先记录，当拖拽结束时且拖拽不成功的情况下再提示UI
      dragErrorMsg: "",
    };
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
    },
  },
  computed: {
    ...mapState({
      themeColor: (state) => state.app.themeColor,
      currentLang: (state) => state.app.currentLang,
    }),
    // 是否可以拖动部门树
    draggable() {
      // 权限控制
      return this.Per.handleButtonPer('system.jobMT.jmViewMoveJob');
    },
  },
  methods: {
    ...mapMutations(["SET_PAGE_TITLE"]),
    ...mapActions(["getSystemJobPositionList"]),
    closeAddStaffToDepDialog() {
      this.showAddStaffToDepDialog = false;
    },
    showAddDepartment() {
      this.showAddStaffToDepDialog = true;
    },
    // 设为负责人
    setThisManisLeading(scopeRow) {
      if (this.currentLang === "zh") {
        this.tips = "提示";
        this.hint = "此操作将设置该用户为部门负责人，是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "Tips";
        this.hint =
          "This operation will set the user as the department head. Do you want to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }

      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          if (!this.nodeObj.id) {
            this.$notify({
              message: "请先选择部门",
              type: "warning",
            });
          }
          this.userTableDataLoading = true;
          this.$Api.systemManagement
            .updateLeader(this.nodeObj.id, scopeRow.userId, 1)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  type: "success",
                  message: "设置成功",
                });
                this.getUserSingle(
                  this.nodeObj.id,
                  this.pageNum,
                  this.pageSize
                );
              }
              this.userTableDataLoading = false;
            });
        })
        .catch((_) => { });
    },
    deleteUserFromPost(scopeRow) {
      if (this.currentLang === "zh") {
        this.tips = "提示";
        this.hint = "此操作将把该用户移除部门，是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "Tips";
        this.hint =
          "This operation will remove the user from the Department and whether to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          this.userTableDataLoading = true;
          this.$Api.systemManagement
            .deletePostUser(
              this.nodeObj.id,
              [scopeRow.userId],
              JSON.parse(window.localStorage.getItem("userInfo"))?.id
            )
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  message: "移除成功",
                  type: "success",
                });
                this.getUserSingle(
                  this.nodeObj.id,
                  this.pageNum,
                  this.pageSize
                );
              } else {
                this.$notify({
                  message: "移除失败",
                  type: "error",
                });
              }
            });
        })
        .catch((_) => { });
    },
    // 取消负责人
    cancelThisManIsleading(scopeRow) {
      if (this.currentLang === "zh") {
        this.tips = "提示";
        this.hint = "此操作将取消该用户为部门负责人，是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "Tips";
        this.hint =
          "This operation will cancel the user as the department head. Do you want to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          if (!this.nodeObj.id) {
            this.$notify({
              message: "请先选择部门",
              type: "warning",
            });
          }
          this.userTableDataLoading = true;
          this.$Api.systemManagement
            .updateLeader(this.nodeObj.id, scopeRow.userId, 0)
            .then(({ status, data }) => {
              if (status == 200 && data.code == 200) {
                this.$notify({
                  type: "success",
                  message: "取消负责人成功",
                });
                this.getUserSingle(
                  this.nodeObj.id,
                  this.pageNum,
                  this.pageSize
                );
              }
            });
        })
        .catch((_) => { });
    },
    jumpToUserInfo(data) {
      this.$router.push({
        path: "/system/userInfo",
        query: {
          id: data.userId,
          username: data.username,
        },
      });
    },
    getCurrentPage(page) {
      this.pageNum = page;
      this.getUserSingle(this.nodeObj.id, this.pageNum, this.pageSize);
    },
    getPerPage(page) {
      this.pageSize = page;
      this.getUserSingle(this.nodeObj.id, this.pageNum, this.pageSize);
    },
    edit(node, data) {
      if (this.currentLang === "zh") {
        this.hint = "该岗位未更新到岗位树中，若需要编辑，请先保存岗位树！";
      } else {
        this.hint =
          "The position has not been updated to the position tree. If you need to edit, please update the position tree first!";
      }
      this.nodeInfo = { ...node.data };
      if (this.nodeInfo.fullCode === undefined) {
        this.$notify({
          message: this.hint,
          type: "warning",
        });
        return;
      }
      this.showUpdateJob = true;
    },
    append(data, node) {
      if (!data.id && data.id != 0) {
        this.$notify({
          message: "请先保存岗位树",
          type: "error",
        });
        return;
      }
      if (node.level >= this.treeMaxLevel) {
        this.$notify({
          message: "超出部门的最大层级",
          type: "error",
        });
        return;
      }
      this.showAddJob = true;
      this.currentData = data;
    },
    relate(data) {
      if (!data.data.id && data.data.id != 0) {
        this.$notify({
          message: "请先保存岗位树",
          type: "error",
        });
        return;
      }
      this.showRelatedJob = true;
      this.currentData = data;
    },
    add(form) {
      if (!this.currentData.subList) {
        this.$set(this.currentData, "subList", []);
      }
      this.currentData.subList.push(form);
      this.tree = JSON.parse(JSON.stringify(this.tree));
      this.showAddJob = false;
      this.$notify({
        message: "添加资源成功",
        type: "success",
      });
    },
    remove(node, data) {
      if (!data.id && data.id != 0) {
        this.$notify({
          message: "请先保存岗位树",
          type: "error",
        });
        return;
      }
      if (this.currentLang === "zh") {
        this.tips = "警告";
        this.hint = "此操作将永久删除岗位, 是否继续?";
        this.confirm = "确定";
        this.cancel = "取消";
      } else {
        this.tips = "warning";
        this.hint =
          "This operation will permanently delete the position. Do you want to continue?";
        this.confirm = "Sure";
        this.cancel = "Cancel";
      }
      this.$confirm(this.hint, this.tips, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          let parent = node.parent;
          let subList = parent.data.subList || parent.data;
          let index = subList.findIndex((d) => d.id == data.id);
          subList.splice(index, 1);
          this.tree = JSON.parse(JSON.stringify(this.tree));
          this.$notify({
            message: "删除资源成功",
            type: "success",
          });
        })
        .catch((_) => { });
    },
    /**
     * 保存岗位树
     */
    async updateJobTree() {
      await this.$confirm(
        this.$t("确认保存当前岗位树?"),
        this.$t("提示"),
        {
          type: "warning",
          cancelButtonText: this.$t("取消"),
          confirmButtonText: this.$t("确定"),
        }
      );
      this.updateJobTreeLoading = true;
      this.$Api.systemManagement
        .updateJobTree(this.tree[0].subList)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: "保存岗位树成功",
              type: "success",
            });
            this.updateJobTreeLoading = false;
            setTimeout(() => {
              // window.location.reload();
            }, 500);
          }
        });
    },
    handleNodeClick(nodeObj, node) {
      if (!nodeObj.id && nodeObj.id != 0) return;
      this.currentNode = node;
      this.nodeObj = nodeObj;
      this.titleText = nodeObj.nameZh;
      this.pageNum = 1;
      this.pageSize = 50;
      if (nodeObj.subList) {
        // 部门
        this.getUserSingle(nodeObj.id, this.pageNum, this.pageSize);
      } else {
        // 单个岗位
        this.getUserSingle(nodeObj.id, this.pageNum, this.pageSize);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      const label = this.currentLang === "en" ? data.nameEn : data.nameZh;
      return label.indexOf(value) !== -1;
    },
    /**
     * 获取当前岗位以及夏下级岗位用户
     */
    getUserMore(pageNum, pageSize, fullCodePre) {
      this.userTableDataLoading = true;
      this.$Api.systemManagement
        .getThisJobUserList({
          pageNum,
          pageSize,
          fullCodePre,
        })
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.total = data.data.total;
            this.userTableData = data.data.list;
            this.userTableDataLoading = false;
          }
        });
    },
    /**
     * 仅获取当前岗位用户
     */
    async getUserSingle(postId, pageNum, pageSize) {
      if (postId == undefined) {
        return;
      }
      this.userTableDataLoading = true;
      try {
        const {
          status,
          data: { data, code },
        } = await this.$Api.systemManagement.getThisJobUsers({
          postId,
          pageNum,
          pageSize,
        });
        if (status !== 200 || code !== 200) return Promise.reject();
        this.total = data.total;
        this.userTableData = data.list;
      } finally {
        this.userTableDataLoading = false;
      }
    },
    /**
     * 获取系统所有岗位
     */
    getData() {
      this.tree = [];
      this.treeWrapLoading = true;
      this.getSystemJobPositionList().then((data) => {
        let flatList = data.data;
        flatList.forEach((item) => {
          if (
            item.pid == null ||
            item.pid == item.id ||
            (item.pid === 0 && item.id === 4)
          ) {
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
        // 递归排序
        const sortedTree = sortList(this.tree, "orderNo", "subList");
        let arr = [
          { id: 0, nameZh: "全部", nameEn: "ALl", subList: sortedTree },
        ];
        this.tree = arr;
        this.getUserSingle(this.nodeObj.id, this.pageNum, this.pageSize);
        this.treeWrapLoading = false;
        // console.log('all tree:', arr);
      });
    },
    // el-tree 判断节点能否被拖拽
    allowDrag(node) {
      // console.log(node);
      // 第一级是 全部 ，第二级是 领格卓越, 不允许拖动
      if (node.level < 3) {
        console.log("不允许拖动");
        return false;
      }
      return true;
    },
    // el-tree 判断节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      // console.log('allowDrop:', draggingNode, dropNode, type);
      let errorMsg = '';
      if (dropNode.level === 1) {
        // console.log("禁止目标是一级节点的一切拖动");
        return false;
      }
      if (dropNode.level === 2 && type !== 'inner') {
        // console.log("禁止变为二级节点");
        return false;
      }
      // 本次拖动会在目标节点的基础上增加的层级
      const addLevel = (draggingNode.childNodes || []).length + (type === 'inner' ? 1 : 0);
      // 控制最大层级. 从LingoAce层级算起，限制最大子层级为 {maxLevel - 1} 级 （注意：这里 LingoAce.level = 2）
      const maxLevel = this.treeMaxLevel;
      if (dropNode.level + addLevel > maxLevel) {
        errorMsg = '超出部门的最大层级';
      }
      // 禁止放入
      if (errorMsg) {
        this.dragErrorMsg = errorMsg;
        return false;
      }
      // console.log("允许放置,", dropNode.data.nameZn, dropNode.level, type);
      return true;
    },
    // 树节点拖拽结束时
    onTreeNodeDragEnd(draggingNode, dropNode, dropType, event) {
      // 没有放入节点和行为，则表示拖拽不成功
      if (!dropNode || dropType === 'none') {
        const errorMsg = this.dragErrorMsg;
        if (errorMsg) {
          this.$message.error(errorMsg);
        }
      }
      this.dragErrorMsg = '';
    }
  },
  created() {
    this.SET_PAGE_TITLE("岗位管理");
    this.getData();
    this.defaultProps = {
      children: "subList",
      label: this.currentLang === "en" ? "nameEn" : "nameZh",
    };
  },
};
</script>
<style lang="scss" scoped>
.job-position-management-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.job-tree-wrap {
  width: 38%;

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .update-power-tree-btn {
    width: 100%;
    margin-bottom: 10px;
  }
}

.job-table-wrap {
  width: 58%;

  .job-table-title-msg {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 20px;

    div:nth-child(1) {
      font-size: 14px;

      .label {
        color: #666;
        margin: 0 20px;
      }
    }

    div:nth-child(2) {
      position: absolute;
      right: 0;
    }
  }

  .table {
    margin: 0 auto !important;
    border: 1px solid #f1f1f1;
  }
}
</style>
