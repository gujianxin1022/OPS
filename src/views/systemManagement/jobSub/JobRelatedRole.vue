<template>
  <el-dialog
    :title="
      $t('关联角色') +
      '-' +
      (isEn ? currentNode.data.nameEn : currentNode.data.nameZh)
    "
    :visible.sync="show"
    width="1000px"
    :before-close="close"
    center
    top="10vh"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" class="role-warp" style="overflow-y: scroll">
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          class="mt20"
          v-for="item in rolesList"
          :key="item.id"
          :label="item.id"
          >{{ item.nameZh }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{ $t("取消") }}</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="reqJobRelatingRole"
        >{{ $t("更新岗位角色") }}</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import {
  toRefs,
  reactive,
  ref,
  onBeforeUnmount,
  watch,
  computed,
  onMounted,
} from "@vue/composition-api";
import {
  jobRelatingRole,
  getSystemRolesList,
  getRoleListbyJob,
} from "@/api/systemManagement";

export default {
  props: {
    show: { type: Boolean, default: false },
    currentNode: { type: Object, default: {} },
  },
  setup(props, { root, emit, refs }) {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const rolesList = ref([]);
    const checkList = ref([]);
    const loading = ref(false);
    const reqJobRelatingRole = async () => {
      /* 岗位关联角色 */
      loading.value = true;
      const params = {
        postId: props.currentNode.data.id,
        userId,
        roleIds: checkList.value.join(","),
      };
      try {
        await jobRelatingRole(params);
        root.$message.success(root.$t("操作成功"));
      } catch{
        root.$message.error(root.$t("操作失败"));
      } finally {
        loading.value = false;
        reqCurrentJobRoles()
      }
    };
    const reqAllRolesData = async () => {
      /* 获取所有角色列表 */
      const {
        status,
        data: { code, data },
      } = await getSystemRolesList();
      if (status !== 200 || code !== 200) return Promise.reject();
      rolesList.value = data;
    };
    const reqCurrentJobRoles = async () => {
      /* 获取岗位已关联角色 */
      const res = await getRoleListbyJob({ postId: props.currentNode.data.id });
      checkList.value = res || [];
    };

    const close = () => {
      emit("close");
    };

    onMounted(async () => {
      await reqAllRolesData();
      await reqCurrentJobRoles();
    });
    return {
      isEn,
      show: props.show,
      currentNode: props.currentNode,
      rolesList,
      checkList,
      loading,
      reqJobRelatingRole,
      close,
    };
  },
};
</script>
<style lang="scss" scoped>
.role-warp {
  height: calc(100vh - 300px);
}
</style>
