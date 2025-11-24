<template>
  <el-tabs class="user-conversation" v-model="activeTab">
    <el-tab-pane :label="$t('单聊')" name="1" lazy>
    </el-tab-pane>
    <el-tab-pane :label="$t('群聊')" name="2" lazy>
    </el-tab-pane>
    <ConversationTable v-loading="loading" :data="dataList" :isGroup="isGroup" :index="(index) => (page.pageNum - 1) * page.pageSize + index + 1" :hideColumns="['parent']" />
    <custom-pagination :current-page="page.pageNum" :total="page.total" :pageSize="page.pageSize"
      @getCurrentPage="onCurrentPageChange" @getPerPage="onPageSizeChange" />
  </el-tabs>
</template>

<script>
import ConversationTable from "@/components/IM/ConversationTable.vue";
import { getSingleChatList, getGroupChatList } from "@/api/im";
export default {
  components: {
    ConversationTable,
  },
  props: {
    parentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeTab: "1",
      loading: false,
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  computed: {
    isGroup() {
      return this.activeTab === '2';
    }
  },
  watch: {
    isGroup() {
      this.page.pageNum = 1;
      this.getConversationList();
    }
  },
  created() {
    this.getConversationList();
  },
  methods: {
    // 获取会话列表
    async getConversationList() {
      this.loading = true;
      this.dataList = []
      const params = {
        parentUserId: this.parentId,
        page: this.page.pageNum,
        size: this.page.pageSize,
      };
      const fetchPromise = this.isGroup ? getGroupChatList(params) : getSingleChatList(params);
      const data = await fetchPromise;
      this.page.total = data.total;
      this.dataList = data.data;
      this.loading = false;
    },
    // 当前页码改变
    onCurrentPageChange(val) {
      this.page.pageNum = val;
      this.getConversationList();
    },
    // 每页展示数据条数改变
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.page.pageNum = 1;
      this.getConversationList();
    },
  },
}
</script>

<style lang="scss" scoped>
.user-conversation {
  padding: 10px;
  width: 80vw;
  max-width: 1000px;
}
</style>
