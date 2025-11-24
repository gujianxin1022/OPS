<template>
  <div class="reminder-settings-warp">
    <el-button @click="visible = true" type="text">{{
      $t("去设置")
    }}</el-button>
    <el-dialog
      :before-close="close"
      :close-on-click-modal="false"
      :title="$t('提醒管理')"
      center
      :visible.sync="visible"
    >
      <div style="height: 300px">
        <h3>{{ $t("上课提醒") }}</h3>
        <div>
          <span class="title"
            >{{ $t("微信") }}/{{ $t("公众号") }}/{{ $t("小程序") }} :
          </span>
          <span v-loading="loading">{{ isOpen ? $t("开") : $t("关") }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from "@vue/composition-api";
export default {
  setup(props, { root, emit }) {
    const visible = ref(false);
    const loading = ref(false);
    const close = () => {
      visible.value = false;
    };
    const isOpen = ref(false);
    const reqStatus = async () => {
      const { parentUserId } = root.$route.query;
      try {
        loading.value = true;
        const res =
          await root.$Api.studentManagement.reqReminderStatusByBeforeClass(
            parentUserId
          );
        isOpen.value = res.offOn === 1;
      } catch {
        close();
      } finally {
        loading.value = false;
      }
    };
    watch(visible, (val) => {
      val && reqStatus();
    });
    return {
      visible,
      loading,
      isOpen,
      close,
    };
  },
};
</script>
