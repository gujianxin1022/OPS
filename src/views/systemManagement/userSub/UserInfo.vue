<template>
  <div class="user-info-wrap" v-loading="pageLoading">
    <el-alert
      v-if="
        !Per.handleButtonPer('system.userMT.viewTheUserExistingRoles')
      "
      :title="$t('您还没有查看该用户已有角色的权限')"
      type="warning"
    >
    </el-alert>
    <div class="distribution-role">
      <el-button
        v-if="
          Per.handleButtonPer('system.userMT.userList.ulAssignRolesToUsers')
        "
        class="update-role-btn mb10"
        type="primary"
        :loading="updateTreeLoading"
        @click="handleUpdateRole"
        >{{ $t("更新用户角色") }}</el-button
      >
      <div>
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            :disabled="disabledRoleList.includes(item.id)"
            class="mt20"
            v-for="item in rolesList"
            :key="item.id"
            :label="item.id"
            >{{ currentLang === "zh" ? item.nameZh : item.nameEn }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "userInfo",
  data() {
    return {
      updateTreeLoading: false,
      pageLoading: false,
      checkList: [],
      disabledRoleList: [],
    };
  },
  watch: {
    userDetailInfo(newData) {
      this.checkList = newData.roleList || []; // 用户的角色集合
      const postList = newData.postList;
      let disabledRoleList = [];
      if (postList && postList.length > 0) {
        postList.forEach((e) => {
          if (e.roleList && e.roleList.length > 0) {
            disabledRoleList = disabledRoleList.concat(e.roleList);
          }
        });
      }
      this.disabledRoleList = disabledRoleList;
    },
    immediate: true,
    deep: true,
  },
  computed: {
    ...mapState({
      rolesList: (state) => state.system.rolesList,
      userDetailInfo: (state) => state.system.userDetailInfo,
      allJobList: (state) => state.system.allJobList,
    }),
    userId() {
      return this.$route.query.id;
    },
    ...mapGetters(["currentLang"]),
  },
  methods: {
    ...mapMutations({
      setPageTitle: "SET_PAGE_TITLE",
      setModuleMenuIndex: "SET_MODULE_MENU_INDEX",
    }),
    ...mapActions([
      "getSystemRolesListAction",
      "getUserDetailInfo",
      "getSystemJobPositionList",
    ]),
    filterNode(value, data) {
      if (!value) return true;
      return data.nameZh.indexOf(value) !== -1;
    },
    /**
     * 更新用户角色
     */
    handleUpdateRole() {
      if (this.checkList.length == 0) {
        this.$notify({
          message: "请选择需要为该用户分配的角色",
          type: "warning",
        });
        return;
      }
      this.updateTreeLoading = true;
      this.$Api.systemManagement
        .updateUserRole(this.userId, this.checkList)
        .then(({ status, data }) => {
          if (status == 200 && data.code == 200) {
            this.$notify({
              message: "更新用户角色成功",
              type: "success",
              duration: 2000,
            });
            // 如果更改角色的这个用户是当前用户的话 才刷新，更新视图
            if (
              this.userId ==
              JSON.parse(window.localStorage.getItem("userInfo")).id
            ) {
              window.localStorage.setItem("moduleMenuIndex", 0);
              this.setModuleMenuIndex(0);
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          } else {
            this.$notify({
              message: "更新用户角色失败",
              type: "error",
            });
          }
          this.updateTreeLoading = false;
        });
    },
  },
  created() {
    // 设置页面头部标题
    this.setPageTitle(this.$route.query.username);
    // 获取所有的角色列表
    this.getSystemRolesListAction();
    // 获取用户详细信息
    try {
      this.pageLoading = true;
      this.getUserDetailInfo(this.userId);
    } finally {
      this.pageLoading = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.user-info-wrap {
  padding: 20px;
  width: 100%;
  // display: flex;
  .distribution-role {
    width: 100%;
  }
}
</style>
