<template>
  <div class="parent-wechat-relationships">
    <div v-if="loading" style="height: 50px">
      <i class="el-icon-loading"></i>
    </div>
    <div v-else-if="!isCCOrLA">{{ $t('只有家长的顾问和学管可以查看') }}</div>
    <div v-else-if="relationships.length === 0">{{ $t('暂无数据') }}</div>
    <div v-else>
      <div v-for="(item, i) in relationships" :key="i" style="margin-bottom: 10px">
        <div>{{ `${$t('用户微信')} ${i + 1}` }}：{{ item.parentExternalUserName }}</div>
        <div>{{ `${$t('与该微信有好友的成员')}: ${showText(item.opsUsername)}` }}</div>
        <div>{{ `${$t('和家长有微信群的成员')}: ${showText(item.opsUsernameInGroup)}` }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStorage } from "@/utils/handleStorage";
export default {
  props: {
    parentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      // 是否是家长的顾问或学管
      isCCOrLA: false,
      relationships: [], // 家长的微信关系列表
    }
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        await this.getRelationships();
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    getRelationships() {
      const userInfo = JSON.parse(getStorage("userInfo"));
      const userId = userInfo.id;
      return this.$Api.studentManagement
        .getParentWeChatRelationships({
          parentId: this.parentId,
          opsUserId: userId,
        })
        .then(({ data: { code, data } }) => {
          this.isCCOrLA = code !== 90001;
          this.relationships = data || [];
          return data;
        });
    },
    // 显示文本
    showText(text) {
      return text || this.$t("无");
    }
  },
  mounted() {
    this.init()
  }
}
</script>
