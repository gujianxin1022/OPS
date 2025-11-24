<template>
  <div class="user-time-zone-warp">
    <div v-show="!showEdit">
      <span class="value">
        <span>
          {{ myVal || "-" }}
        </span>
        <i
          v-if="Per.handleButtonPer('teach.studentMT.parentInfo.editEmail')"
          @click="showEdit = true"
          class="el-icon-edit-outline"
        ></i
      ></span>
    </div>
    <div v-show="showEdit">
      <el-input clearable style="width: 192px" v-model.trim="myVal"> </el-input>
      <template>
        <el-tooltip
          v-if="!myVal"
          class="item"
          effect="dark"
          :content="$t('请输入')"
          placement="top"
        >
          <i style="color: #67c23a" class="el-icon-check"></i>
        </el-tooltip>
        <i
          v-else
          slot="reference"
          @click="showSecondConfirmationDialog = true"
          style="color: #67c23a"
          class="el-icon-check"
        ></i>
      </template>
      <i class="el-icon-close" style="color: #f56c6c" @click="close" />
    </div>
    <el-dialog
      :title="isAdd ? $t('添加邮箱') : $t('更改邮箱')"
      :center="true"
      :visible.sync="showSecondConfirmationDialog"
      width="500px"
      :before-close="closeDialog"
    >
      <div style="line-height: 32px; font-size: 16px">
        <div>{{ $t("原用户邮箱") }}：{{ email || "-" }}</div>
        <div>
          {{ $t("更改后的邮箱") }}：<span style="color: darkorange">{{
            myVal
          }}</span>
        </div>
        <div class="text-wrap" style="color: #f56c6c; font-size: 12px">
          {{
            $t(
              "邮箱会影响用户后续的登录、找回密码、接收通知等行为，请仔细核对。"
            )
          }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">{{ $t("取消") }}</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">{{
          $t("确定修改")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="isAdd ? $t('添加成功') : $t('修改成功')"
      :center="true"
      :visible.sync="showResultDialog"
      width="500px"
    >
      <div slot="title" style="font-size: 18px">
        <span
          style="color: #67c23a; vertical-align: middle"
          class="el-icon-success mr10"
        ></span
        >{{ $t("修改成功") }}
      </div>
      <div class="text-wrap" style="line-height: 32px; font-size: 14px">
        <div>
          1、{{
            $t(
              "请将【newValue】以微信或者其他聊天渠道同步给用户;"
            ).replace("【newValue】", myVal)
          }}
        </div>
        <div>
          2、{{
            $t(
              "告知用户需要前往【我的】-【设置】-【帐号设置】中进行邮箱验证以便于后续正常使用。"
            )
          }}<UnverifiedTag :isShowTag="false" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  computed,
  ref,
  watch,
} from "@vue/composition-api";
import UnverifiedTag from "@/views/studentManagement/subPage/componentsForParent/UnverifiedTag.vue";
export default {
  props: {
    email: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: "",
    },
  },
  components: { UnverifiedTag },
  setup(props, { root, emit }) {
    const myVal = ref("");
    const isEn = computed(() => root.$store.getters.currentLang === "en");
    const showEdit = ref(false);
    const close = () => {
      showEdit.value = false;
      myVal.value = props.email;
    };
    const showSecondConfirmationDialog = ref(false);
    const closeDialog = () => {
      showSecondConfirmationDialog.value = false;
    };
    const loading = ref(false);

    const handleSubmit = async () => {
      const {
        status,
        data: { code },
      } = await root.$Api.studentManagement.updateParentInfo({
        id: props.parentId,
        email: myVal.value,
      });
      if (status !== 200 || code !== 200) {
        myVal.value = props.email;
        return;
      }
      showSecondConfirmationDialog.value = false;
      showResultDialog.value = true;
      emit("updateParentInfo", myVal.value);
      showEdit.value = false;
    };
    const showResultDialog = ref(false);
    const isAdd = ref(false);
    onMounted(() => {
      myVal.value = props.email;
      isAdd.value = !props.email;
    });
    return {
      myVal,
      isEn,
      showEdit,
      close,
      showSecondConfirmationDialog,
      loading,
      handleSubmit,
      closeDialog,
      showResultDialog,
      isAdd,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-time-zone-warp {
  i {
    cursor: pointer;
    margin: 0 5px;
  }
  .value {
    display: inline-block;
    line-height: 20px;
  }
}
</style>
