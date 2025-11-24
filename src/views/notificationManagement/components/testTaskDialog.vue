<template>
  <el-dialog
    @close="handleClose"
    :title="$t('测试')"
    :visible.sync="visible"
    center
    width="500px"
  >
    <header>
      <el-form
        :model="formState"
        :label-width="150"
        :rules="rules"
        ref="sendMsgToUserRef"
      >
        <el-form-item :label="$t('用户id')">
          <el-input
            style="width: 60%"
            type="text"
            :placeholder="$t('请输入内容')"
            v-model="formState.userId"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="sendMsgCheck()"
            :loading="btnLoading"
            :disabled="!formState.userId"
          >
            {{ $t("发送") }}
          </el-button>
          <el-button
            type="default"
            @click="handleClose"
            :disabled="!formState.userId"
            >{{ $t("取消") }}</el-button
          >
        </el-form-item>
      </el-form>
    </header>
  </el-dialog>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
import { testSendMsg2User } from "@/api/notificationManagement";
import { getStorage } from "@/utils/handleStorage";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    currentTask: {
      type: Object,
      default: {},
    },
  },
  setup(props, { root, emit }) {
    const sendMsgToUserRef = ref(null);
    const btnLoading = ref(false);
    const formState = reactive({
      userId: "",
    });
    const rules = reactive({
      userId: [
        { required: true, message: root.$t("请选择"), trigger: "change" },
      ],
    });
    const handleClose = () => {
      emit("update:visible", false);
    };
    const sendMsgCheck = () => {
      sendMsgToUserRef.value.validate(async (valid) => {
        if (valid) {
          if (!/\d/gi.test(parseInt(formState.userId))) {
            return root.$message.error("请输入数字");
          }
          confirmMsg();
        }
      });
    };
    const confirmMsg = async () => {
      await root.$confirm(
        `确认要发送给 ${formState.userId}? 请仔细检查用户ID`,
        root.$t("确认取消？"),
        { type: "warning", center: true }
      );
      btnLoading.value = true;
      const data = await testSendMsg2User({
        userId: formState.userId,
        id: props.currentTask?.id,
        opsUserName: getStorage("userName"),
      });
      if (data) {
        root.$message.success(root.$t("发送成功"));
        setTimeout(() => {
          emit("showHistoryAllTask", {
            disabled: true,
            id: data || "",
          });
          handleClose();
        }, 2000);
      }

      btnLoading.value = false;
    };
    return {
      rules,
      formState,
      handleClose,
      btnLoading,
      sendMsgCheck,
      sendMsgToUserRef,
    };
  },
};
</script>
