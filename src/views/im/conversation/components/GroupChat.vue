<template>
  <div class="group-chat">
    <screen-wrapper @search="search" :screenTitle="$t('filter queries')">
      <screen-item :label="$t('最近会话时间')" :labelWidth="labelWidth">
        <el-date-picker
          v-model="query.timeRange"
          type="datetimerange"
          :start-placeholder="$t('开始时间')"
          :end-placeholder="$t('结束时间')"
          size="small"
          :default-time="['00:00:00', '23:59:59']"
        />
      </screen-item>
      <screen-item :label="$t('家长ID')" :labelWidth="labelWidth">
        <el-input v-model.trim="query.parentId" />
      </screen-item>
      <screen-item :label="$t('学生ID')" :labelWidth="labelWidth">
        <el-input v-model.trim="query.studentId" />
      </screen-item>
      <screen-item label="CC/LA" :labelWidth="labelWidth">
        <FilterByOPSAccount @change="onOPSUserChange" />
      </screen-item>
    </screen-wrapper>
    <ConversationTable v-loading="loading" :data="list" isGroup :index="(index) => (page.pageNum - 1) * page.pageSize + index + 1" />
    <custom-pagination
      :current-page="page.pageNum"
      :total="page.total"
      :pageSize="page.pageSize"
      @getCurrentPage="onCurrentPageChange"
      @getPerPage="onPageSizeChange"
    />
  </div>
</template>

<script>
import ConversationTable from "@/components/IM/ConversationTable.vue";
import FilterByOPSAccount from "@/components/FilterItem/UserDimensionFilter/FilterByOPSAccount";
import { getGroupChatList } from "@/api/im";

export default {
  components: {
    ConversationTable,
    FilterByOPSAccount,
  },
  data() {
    return {
      query: {
        timeRange: [], // 最近会话时间
        parentId: "", // 家长id
        studentId: "", // 学生id
      },
      loading: false,
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      businessUser: null,
    };
  },
  computed: {
    labelWidth() {
      return this.$i18n.local == "en" ? 165 : 100;
    },
  },
  created() {
    this.getConversationList();
  },
  methods: {
    search() {
      this.page.pageNum = 1;
      this.getConversationList();
    },
    // 获取会话列表
    async getConversationList() {
      this.loading = true;
      const params = {
        parentUserId: this.query.parentId,
        studentUserId: this.query.studentId,
        page: this.page.pageNum,
        size: this.page.pageSize,
      };
      const numberReg = /^\d+$/;
      if (
        [params.parentUserId, params.studentUserId]
          .filter((p) => p)
          .some((p) => !numberReg.test(p))
      ) {
        const message =
          this.$i18n.locale === "zh"
            ? "请输入正确的家长ID或学生ID"
            : "Please enter the correct parent ID or student ID";
        this.$message.error(message);
        this.loading = false;
        return;
      }
      if (this.businessUser) {
        params.opsUserId = this.businessUser.businessUserId;
      }
      const timeRange = this.query.timeRange;
      if (timeRange && timeRange.length > 1) {
        params.startLastMessageTime = timeRange[0].getTime();
        params.endLastMessageTime = timeRange[1].getTime();
      }
      const data = await getGroupChatList(params);
      this.page.total = data.total;
      // 转换数据结构
      this.list = data.data;
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
    // OPS 业务人员选择
    onOPSUserChange(user) {
      this.businessUser = user.userInfo.id
        ? {
            businessUserId: user.userInfo.id,
            businessUserName: user.userInfo.username,
          }
        : null;
    },
  },
};
</script>
