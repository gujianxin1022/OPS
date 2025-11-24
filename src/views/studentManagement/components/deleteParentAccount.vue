<template>
  <!-- 删除账号 -->
  <el-dialog
    :close-on-click-modal="false"
    :before-close="close"
    :title="$t('请确认是否要为您的客户申请删除账户')"
    :visible.sync="visible"
    width="500px"
  >
    <template>
      <p style="word-break: keep-all">
        {{ $t("如果您确定要代客户删除账户，请在下面输入大写的DELETE以确认。") }}
      </p>
      <p style="word-break: keep-all">{{ $t("确认后将会有客服人员与您的客户取得联系并做最终确认。") }}</p>
      <p>{{ $t("同时，系统也将记录下您的操作日志。") }}</p>
      <el-input
        v-model.trim="inputTxt"
        :placeholder="$t('请在此框内输入大写的：DELETE')"
      ></el-input>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :disabled="inputTxt !== sureTxt"
        @click="submit"
        :loading="loading"
        >{{ $t("确定删除") }}</el-button
      >
      <el-button @click="close">{{ $t("取消") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parentUserId:{
      type: [String, Number],
      default: -1,
    }
  },
  setup(props, { root, emit }) {
    const sureTxt = "DELETE";
    const inputTxt = ref("");
    const loading = ref(false);
    const submit = async () => {
      try {
        loading.value = true;
        await root.$Api.studentManagement.reqDeleteParentAccount(props.parentUserId);
        root.$message.success(root.$t("申请删除账号成功，请耐心等待"));
        emit("refresh");
        emit("close");
      } finally {
        loading.value = false;
      }
    };
    const close = async () => {
      emit("close");
    };
    return {
      inputTxt,
      sureTxt,
      loading,
      submit,
      close,
    };
  },
};
</script>