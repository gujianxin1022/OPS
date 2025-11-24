<template>
  <el-tabs class="conversation-management" v-model="activeTab" type="card">
    <el-tab-pane :label="$t('单聊')" name="1" lazy>
      <SingleChat />
    </el-tab-pane>
    <el-tab-pane :label="$t('群聊')" name="2" lazy>
      <GroupChat />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import SingleChat from "./components/SingleChat.vue";
import GroupChat from "./components/GroupChat.vue";

export default {
  components: {
    SingleChat,
    GroupChat,
  },
  data() {
    return {
      activeTab: "1",
    };
  },
};
</script>

<style lang="scss" scoped>
.conversation-management {
  padding: 10px;
}
</style>
